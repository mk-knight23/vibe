// Vibe VS Code Extension - Provider Manager
import * as vscode from 'vscode';
import { fetch } from 'undici';
import { ProviderConfig, ProviderRequest, ProviderResponse, ProviderHealth } from './types';
import { SettingsManager } from './settings';

const PROVIDER_CONFIGS: Record<string, ProviderConfig> = {
  openrouter: {
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    apiKeyEnvVar: 'OPENROUTER_API_KEY',
    models: ['x-ai/grok-4.1-fast:free', 'google/gemini-2.0-flash-exp:free', 'meta-llama/llama-3.3-70b-instruct:free'],
    defaultModel: 'x-ai/grok-4.1-fast:free',
    maxTokens: 4096,
    supportsStreaming: true,
    supportsTools: true,
    rateLimit: { requests: 20, window: 60 }
  },
  megallm: {
    name: 'MegaLLM',
    baseUrl: 'https://api.megallm.com/v1',
    apiKeyEnvVar: 'MEGALLM_API_KEY',
    models: ['qwen/qwen3-next-80b-a3b-instruct', 'deepseek/deepseek-v3-0324'],
    defaultModel: 'qwen/qwen3-next-80b-a3b-instruct',
    maxTokens: 8192,
    supportsStreaming: true,
    supportsTools: true,
    rateLimit: { requests: 10, window: 60 }
  },
  agentrouter: {
    name: 'AgentRouter',
    baseUrl: 'https://api.agentrouter.ai/v1',
    apiKeyEnvVar: 'AGENTROUTER_API_KEY',
    models: ['claude-3-5-sonnet', 'claude-3-opus'],
    defaultModel: 'claude-3-5-sonnet',
    maxTokens: 4096,
    supportsStreaming: true,
    supportsTools: true,
    rateLimit: { requests: 15, window: 60 }
  },
  routeway: {
    name: 'Routeway',
    baseUrl: 'https://api.routeway.ai/v1',
    apiKeyEnvVar: 'ROUTEWAY_API_KEY',
    models: ['gpt-4-turbo', 'gpt-4o'],
    defaultModel: 'gpt-4-turbo',
    maxTokens: 4096,
    supportsStreaming: true,
    supportsTools: false,
    rateLimit: { requests: 10, window: 60 }
  }
};

export class ProviderManager {
  private static instance: ProviderManager;
  private healthStatus: Map<string, ProviderHealth> = new Map();
  private settingsManager: SettingsManager;

  private constructor() {
    this.settingsManager = SettingsManager.getInstance();
    this.initializeHealthStatus();
  }

  static getInstance(): ProviderManager {
    if (!ProviderManager.instance) {
      ProviderManager.instance = new ProviderManager();
    }
    return ProviderManager.instance;
  }

  private initializeHealthStatus(): void {
    Object.keys(PROVIDER_CONFIGS).forEach(provider => {
      this.healthStatus.set(provider, {
        available: true,
        latency: 0,
        lastCheck: new Date(),
        errorCount: 0,
        successRate: 1.0
      });
    });
  }

  getConfig(provider?: string): ProviderConfig {
    const p = provider || this.settingsManager.getSettings().provider;
    return PROVIDER_CONFIGS[p] || PROVIDER_CONFIGS.openrouter;
  }

  async chat(request: ProviderRequest): Promise<ProviderResponse> {
    const settings = this.settingsManager.getSettings();
    const provider = settings.provider;
    const config = this.getConfig(provider);
    const apiKey = this.settingsManager.getApiKey(provider);

    if (!apiKey) {
      throw new Error(`No API key configured for ${provider}`);
    }

    const startTime = Date.now();

    try {
      const response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://vibe-ai.dev',
          'X-Title': 'Vibe VS Code'
        },
        body: JSON.stringify({
          model: request.model || config.defaultModel,
          messages: request.messages,
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens ?? config.maxTokens,
          stream: request.stream ?? false,
          tools: request.tools
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Provider error: ${response.status} - ${errorText}`);
      }

      const data = await response.json() as any;
      const latency = Date.now() - startTime;

      this.updateHealth(provider, true, latency);

      return {
        content: data.choices?.[0]?.message?.content || '',
        model: data.model || request.model,
        usage: data.usage ? {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens
        } : undefined,
        toolCalls: data.choices?.[0]?.message?.tool_calls,
        finishReason: data.choices?.[0]?.finish_reason
      };
    } catch (error) {
      this.updateHealth(provider, false, Date.now() - startTime);

      // Try fallback if enabled
      if (settings.enableProviderFallback) {
        const fallback = this.getFallbackProvider(provider);
        if (fallback) {
          console.log(`Falling back to ${fallback}`);
          return this.chatWithProvider(fallback, request);
        }
      }

      throw error;
    }
  }

  private async chatWithProvider(provider: string, request: ProviderRequest): Promise<ProviderResponse> {
    const config = this.getConfig(provider);
    const apiKey = this.settingsManager.getApiKey(provider);

    if (!apiKey) {
      throw new Error(`No API key for fallback provider ${provider}`);
    }

    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: request.model || config.defaultModel,
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? config.maxTokens
      })
    });

    if (!response.ok) {
      throw new Error(`Fallback provider error: ${response.status}`);
    }

    const data = await response.json() as any;
    return {
      content: data.choices?.[0]?.message?.content || '',
      model: data.model || request.model
    };
  }

  private getFallbackProvider(current: string): string | null {
    const settings = this.settingsManager.getSettings();
    const providers = ['openrouter', 'megallm', 'agentrouter', 'routeway'];
    
    for (const p of providers) {
      if (p !== current && this.settingsManager.getApiKey(p)) {
        const health = this.healthStatus.get(p);
        if (health && health.available && health.successRate > 0.5) {
          return p;
        }
      }
    }
    return null;
  }

  private updateHealth(provider: string, success: boolean, latency: number): void {
    const health = this.healthStatus.get(provider) || {
      available: true,
      latency: 0,
      lastCheck: new Date(),
      errorCount: 0,
      successRate: 1.0
    };

    health.lastCheck = new Date();
    health.latency = latency;

    if (success) {
      health.successRate = Math.min(1.0, health.successRate + 0.1);
      health.errorCount = Math.max(0, health.errorCount - 1);
    } else {
      health.errorCount++;
      health.successRate = Math.max(0, health.successRate - 0.2);
      health.available = health.errorCount < 5;
    }

    this.healthStatus.set(provider, health);
  }

  getHealth(provider?: string): ProviderHealth | undefined {
    return this.healthStatus.get(provider || this.settingsManager.getSettings().provider);
  }

  getAvailableProviders(): string[] {
    return Object.keys(PROVIDER_CONFIGS).filter(p => this.settingsManager.getApiKey(p));
  }
}
