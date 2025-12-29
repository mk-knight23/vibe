/**
 * Health check and observability utilities
 * For production monitoring and graceful degradation
 */

import { getRuntimeConfig, validateProductionEnv, getApiKey } from './config';

// Provider base URLs (duplicated to avoid circular import)
const PROVIDER_URLS: Record<string, string> = {
  openrouter: 'https://openrouter.ai/api/v1',
  megallm: 'https://ai.megallm.io/v1',
  agentrouter: 'https://agentrouter.org/v1',
  routeway: 'https://api.routeway.ai/v1',
};

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  uptime: number;
  checks: {
    config: boolean;
    provider: boolean;
    memory: boolean;
  };
  provider?: string;
  errors?: string[];
}

const startTime = Date.now();

/**
 * Get current health status
 */
export async function getHealthStatus(): Promise<HealthStatus> {
  const errors: string[] = [];
  const config = getRuntimeConfig();
  
  // Check config
  const envValidation = validateProductionEnv();
  const configOk = envValidation.valid;
  if (!configOk) {
    errors.push(`Missing env: ${envValidation.missing.join(', ')}`);
  }
  
  // Check provider connectivity
  let providerOk = false;
  const apiKey = getApiKey(config.provider);
  if (apiKey) {
    providerOk = await checkProviderHealth(config.provider);
    if (!providerOk) {
      errors.push(`Provider ${config.provider} unreachable`);
    }
  }
  
  // Check memory usage
  const memUsage = process.memoryUsage();
  const memoryOk = memUsage.heapUsed < 128 * 1024 * 1024; // 128MB limit
  if (!memoryOk) {
    errors.push(`High memory usage: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`);
  }
  
  // Determine overall status
  let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
  if (!configOk || !providerOk) status = 'unhealthy';
  else if (!memoryOk) status = 'degraded';
  
  return {
    status,
    version: '9.0.0',
    uptime: Date.now() - startTime,
    checks: {
      config: configOk,
      provider: providerOk,
      memory: memoryOk,
    },
    provider: config.provider,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Check if a provider is reachable
 */
async function checkProviderHealth(provider: string): Promise<boolean> {
  const baseUrl = PROVIDER_URLS[provider];
  if (!baseUrl) return false;
  
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${baseUrl}/models`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getApiKey(provider)}` },
      signal: controller.signal,
    });
    
    clearTimeout(timeout);
    return response.ok || response.status === 401; // 401 means reachable but auth failed
  } catch {
    return false;
  }
}

/**
 * Graceful degradation - try fallback providers
 */
export async function getAvailableProvider(): Promise<string | null> {
  const providers = ['megallm', 'openrouter', 'agentrouter', 'routeway'];
  
  for (const provider of providers) {
    const apiKey = getApiKey(provider);
    if (apiKey && await checkProviderHealth(provider)) {
      return provider;
    }
  }
  
  return null;
}

/**
 * Format health status for CLI output
 */
export function formatHealthStatus(health: HealthStatus): string {
  const statusEmoji = {
    healthy: '🟢',
    degraded: '🟡',
    unhealthy: '🔴',
  };
  
  const lines = [
    `${statusEmoji[health.status]} Status: ${health.status.toUpperCase()}`,
    `📦 Version: ${health.version}`,
    `⏱️  Uptime: ${Math.round(health.uptime / 1000)}s`,
    `🔌 Provider: ${health.provider || 'none'}`,
    '',
    'Checks:',
    `  Config: ${health.checks.config ? '✓' : '✗'}`,
    `  Provider: ${health.checks.provider ? '✓' : '✗'}`,
    `  Memory: ${health.checks.memory ? '✓' : '✗'}`,
  ];
  
  if (health.errors?.length) {
    lines.push('', 'Errors:');
    health.errors.forEach(err => lines.push(`  ⚠️ ${err}`));
  }
  
  return lines.join('\n');
}
