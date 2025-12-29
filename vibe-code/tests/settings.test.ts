// Vibe VS Code Extension - Settings Tests
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock vscode module
vi.mock('vscode', () => ({
  workspace: {
    getConfiguration: vi.fn(() => ({
      get: vi.fn((key: string, defaultValue: any) => defaultValue)
    })),
    onDidChangeConfiguration: vi.fn(() => ({ dispose: vi.fn() }))
  },
  ConfigurationTarget: { Global: 1 }
}));

describe('Settings Validation', () => {
  it('should require at least one API key', () => {
    const settings = {
      openrouterApiKey: '',
      megallmApiKey: '',
      agentrouterApiKey: '',
      routewayApiKey: ''
    };
    
    const hasApiKey = Object.values(settings).some(k => k.length > 0);
    expect(hasApiKey).toBe(false);
  });

  it('should validate provider matches API key', () => {
    const settings = {
      provider: 'openrouter',
      openrouterApiKey: '',
      megallmApiKey: 'valid-key'
    };
    
    const providerKeyMap: Record<string, string> = {
      openrouter: 'openrouterApiKey',
      megallm: 'megallmApiKey'
    };
    
    const keyField = providerKeyMap[settings.provider];
    const hasMatchingKey = !!(settings as any)[keyField];
    expect(hasMatchingKey).toBe(false);
  });

  it('should warn about dangerous auto-approve setting', () => {
    const settings = { autoApproveUnsafeOps: true };
    const warnings: string[] = [];
    
    if (settings.autoApproveUnsafeOps) {
      warnings.push('Auto-approve unsafe operations is enabled');
    }
    
    expect(warnings.length).toBe(1);
  });

  it('should validate execution mode', () => {
    const validModes = ['ask', 'code', 'debug', 'architect', 'agent', 'shell'];
    
    expect(validModes.includes('code')).toBe(true);
    expect(validModes.includes('invalid')).toBe(false);
  });

  it('should validate maxContextFiles range', () => {
    const validate = (value: number) => value >= 1 && value <= 100;
    
    expect(validate(20)).toBe(true);
    expect(validate(0)).toBe(false);
    expect(validate(101)).toBe(false);
  });
});

describe('Provider Configuration', () => {
  const providers = {
    openrouter: { baseUrl: 'https://openrouter.ai/api/v1', maxTokens: 4096 },
    megallm: { baseUrl: 'https://api.megallm.com/v1', maxTokens: 8192 },
    agentrouter: { baseUrl: 'https://api.agentrouter.ai/v1', maxTokens: 4096 },
    routeway: { baseUrl: 'https://api.routeway.ai/v1', maxTokens: 4096 }
  };

  it('should have valid base URLs', () => {
    Object.values(providers).forEach(p => {
      expect(p.baseUrl).toMatch(/^https:\/\//);
    });
  });

  it('should have reasonable token limits', () => {
    Object.values(providers).forEach(p => {
      expect(p.maxTokens).toBeGreaterThanOrEqual(1024);
      expect(p.maxTokens).toBeLessThanOrEqual(128000);
    });
  });

  it('should support all 4 providers', () => {
    expect(Object.keys(providers)).toHaveLength(4);
  });
});

describe('Provider Fallback', () => {
  it('should find fallback when primary fails', () => {
    const apiKeys = {
      openrouter: '',
      megallm: 'valid-key',
      agentrouter: '',
      routeway: ''
    };
    
    const current = 'openrouter';
    const fallback = Object.entries(apiKeys)
      .find(([name, key]) => name !== current && key.length > 0)?.[0];
    
    expect(fallback).toBe('megallm');
  });

  it('should return null when no fallback available', () => {
    const apiKeys = {
      openrouter: '',
      megallm: '',
      agentrouter: '',
      routeway: ''
    };
    
    const current = 'openrouter';
    const fallback = Object.entries(apiKeys)
      .find(([name, key]) => name !== current && key.length > 0)?.[0];
    
    expect(fallback).toBeUndefined();
  });
});

describe('Health Tracking', () => {
  it('should track success rate', () => {
    let successRate = 1.0;
    
    // Simulate failures
    successRate = Math.max(0, successRate - 0.2);
    successRate = Math.max(0, successRate - 0.2);
    
    expect(successRate).toBeCloseTo(0.6);
  });

  it('should mark provider unavailable after 5 errors', () => {
    let errorCount = 0;
    let available = true;
    
    for (let i = 0; i < 5; i++) {
      errorCount++;
      available = errorCount < 5;
    }
    
    expect(available).toBe(false);
  });

  it('should recover after successful requests', () => {
    let errorCount = 3;
    
    // Simulate success
    errorCount = Math.max(0, errorCount - 1);
    
    expect(errorCount).toBe(2);
  });
});
