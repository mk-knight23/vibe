import fs from 'fs';
import path from 'path';

export interface ApiProviderConfig {
  openrouter?: {
    apiKey?: string;
    defaultModel?: string;
  };
  megallm?: {
    apiKey?: string;
    defaultModel?: string;
  };
  agentrouter?: {
    apiKey?: string;
    defaultModel?: string;
  };
  routeway?: {
    apiKey?: string;
    defaultModel?: string;
  };
  [key: string]: any;
}

// Environment-based configuration for production
export interface RuntimeConfig {
  provider: string;
  model: string;
  timeout: number;
  maxRetries: number;
  debug: boolean;
  dryRun: boolean;
  auditEnabled: boolean;
  // Production settings
  maxConcurrent: number;
  rateLimitPerMin: number;
  enableTelemetry: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

// Observability metrics
export interface Metrics {
  requestCount: number;
  errorCount: number;
  avgLatency: number;
  lastError?: string;
  uptime: number;
  startTime: Date;
}

const CONFIG_DIR = path.join(process.env.HOME || process.env.USERPROFILE || '.', '.vibe');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

// In-memory metrics for observability
const metrics: Metrics = {
  requestCount: 0,
  errorCount: 0,
  avgLatency: 0,
  uptime: 0,
  startTime: new Date()
};

/**
 * Get runtime configuration from environment variables
 * Supports stateless execution for cloud/CI environments
 */
export function getRuntimeConfig(): RuntimeConfig {
  return {
    provider: process.env.VIBE_PROVIDER || 'megallm',
    model: process.env.VIBE_MODEL || 'qwen/qwen3-next-80b-a3b-instruct',
    timeout: parseInt(process.env.VIBE_TIMEOUT || '60000', 10),
    maxRetries: parseInt(process.env.VIBE_MAX_RETRIES || '3', 10),
    debug: process.env.VIBE_DEBUG === 'true',
    dryRun: process.env.VIBE_DRY_RUN === 'true',
    auditEnabled: process.env.VIBE_AUDIT !== 'false',
    // Production settings
    maxConcurrent: parseInt(process.env.VIBE_MAX_CONCURRENT || '5', 10),
    rateLimitPerMin: parseInt(process.env.VIBE_RATE_LIMIT || '60', 10),
    enableTelemetry: process.env.VIBE_TELEMETRY !== 'false',
    logLevel: (process.env.VIBE_LOG_LEVEL as any) || 'info',
  };
}

/**
 * Check if running in CI/production environment
 */
export function isCI(): boolean {
  return !!(
    process.env.CI ||
    process.env.GITHUB_ACTIONS ||
    process.env.GITLAB_CI ||
    process.env.JENKINS_URL ||
    process.env.CIRCLECI
  );
}

/**
 * Check if running in production mode
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production' || isCI();
}

/**
 * Check if running in interactive mode
 */
export function isInteractive(): boolean {
  return process.stdin.isTTY && !isCI();
}

/**
 * Get API key for provider from environment
 */
export function getApiKey(provider: string): string {
  const envMap: Record<string, string> = {
    openrouter: 'OPENROUTER_API_KEY',
    megallm: 'MEGALLM_API_KEY',
    agentrouter: 'AGENTROUTER_API_KEY',
    routeway: 'ROUTEWAY_API_KEY',
  };
  
  const envVar = envMap[provider.toLowerCase()];
  if (!envVar) return '';
  
  return process.env[envVar] || '';
}

/**
 * Validate required environment for production
 */
export function validateProductionEnv(): { valid: boolean; missing: string[]; warnings: string[] } {
  const missing: string[] = [];
  const warnings: string[] = [];
  
  // Check for at least one API key
  const hasApiKey = ['OPENROUTER_API_KEY', 'MEGALLM_API_KEY', 'AGENTROUTER_API_KEY', 'ROUTEWAY_API_KEY']
    .some(key => !!process.env[key]);
  
  if (!hasApiKey) {
    missing.push('API_KEY (one of: OPENROUTER_API_KEY, MEGALLM_API_KEY, etc.)');
  }

  // Warnings for production
  if (isProduction()) {
    if (!process.env.VIBE_PROVIDER) {
      warnings.push('VIBE_PROVIDER not set, using default');
    }
    if (process.env.VIBE_DEBUG === 'true') {
      warnings.push('Debug mode enabled in production');
    }
  }
  
  return { valid: missing.length === 0, missing, warnings };
}

// ============================================
// OBSERVABILITY
// ============================================

/**
 * Record a request for metrics
 */
export function recordRequest(latencyMs: number, success: boolean, error?: string): void {
  metrics.requestCount++;
  if (!success) {
    metrics.errorCount++;
    metrics.lastError = error;
  }
  // Rolling average
  metrics.avgLatency = (metrics.avgLatency * (metrics.requestCount - 1) + latencyMs) / metrics.requestCount;
}

/**
 * Get current metrics
 */
export function getMetrics(): Metrics {
  return {
    ...metrics,
    uptime: Date.now() - metrics.startTime.getTime()
  };
}

/**
 * Get health status for monitoring
 */
export function getHealthCheck(): { status: 'healthy' | 'degraded' | 'unhealthy'; details: Record<string, any> } {
  const m = getMetrics();
  const errorRate = m.requestCount > 0 ? m.errorCount / m.requestCount : 0;
  
  let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
  if (errorRate > 0.5) status = 'unhealthy';
  else if (errorRate > 0.1) status = 'degraded';
  
  return {
    status,
    details: {
      uptime: m.uptime,
      requests: m.requestCount,
      errors: m.errorCount,
      errorRate: (errorRate * 100).toFixed(2) + '%',
      avgLatency: m.avgLatency.toFixed(0) + 'ms',
      lastError: m.lastError
    }
  };
}

// ============================================
// GRACEFUL DEGRADATION
// ============================================

/**
 * Get fallback provider when primary fails
 */
export function getFallbackProvider(current: string): string | null {
  const providers = ['openrouter', 'megallm', 'agentrouter', 'routeway'];
  
  for (const p of providers) {
    if (p !== current && getApiKey(p)) {
      return p;
    }
  }
  return null;
}

/**
 * Execute with retry and fallback
 */
export async function withRetryAndFallback<T>(
  fn: (provider: string) => Promise<T>,
  provider: string
): Promise<T> {
  const config = getRuntimeConfig();
  let lastError: Error | null = null;
  
  // Try primary provider with retries
  for (let i = 0; i < config.maxRetries; i++) {
    try {
      const start = Date.now();
      const result = await fn(provider);
      recordRequest(Date.now() - start, true);
      return result;
    } catch (err) {
      lastError = err as Error;
      recordRequest(0, false, lastError.message);
      
      // Wait before retry (exponential backoff)
      if (i < config.maxRetries - 1) {
        await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
      }
    }
  }
  
  // Try fallback provider
  const fallback = getFallbackProvider(provider);
  if (fallback) {
    try {
      const start = Date.now();
      const result = await fn(fallback);
      recordRequest(Date.now() - start, true);
      return result;
    } catch (err) {
      recordRequest(0, false, (err as Error).message);
    }
  }
  
  throw lastError || new Error('All providers failed');
}

// ============================================
// FILE CONFIG (for local development)
// ============================================

export function loadConfig(): ApiProviderConfig {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  } catch {
    return {};
  }
}

export function saveConfig(cfg: ApiProviderConfig): void {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2), 'utf8');
  } catch (err) {
    if (getRuntimeConfig().debug) {
      console.error('Failed to save config:', err);
    }
  }
}

export function getConfigValue(key: string): any {
  const cfg = loadConfig();
  return key.split('.').reduce((obj, k) => obj?.[k], cfg as any);
}

export function setConfigValue(key: string, value: any): void {
  const cfg = loadConfig();
  const keys = key.split('.');
  const last = keys.pop()!;
  const target = keys.reduce((obj, k) => {
    if (!obj[k]) obj[k] = {};
    return obj[k];
  }, cfg as any);
  target[last] = value;
  saveConfig(cfg);
}
