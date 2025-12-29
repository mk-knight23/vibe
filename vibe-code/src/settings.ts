// Vibe VS Code Extension - Settings Manager
import * as vscode from 'vscode';
import { VibeSettings, SettingsValidationResult, ExecutionMode } from './types';

export class SettingsManager {
  private static instance: SettingsManager;
  private settings: VibeSettings;
  private listeners: Array<(settings: VibeSettings) => void> = [];

  private constructor() {
    this.settings = this.loadSettings();
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('vibe')) {
        this.settings = this.loadSettings();
        this.notifyListeners();
      }
    });
  }

  static getInstance(): SettingsManager {
    if (!SettingsManager.instance) {
      SettingsManager.instance = new SettingsManager();
    }
    return SettingsManager.instance;
  }

  getSettings(): VibeSettings {
    return { ...this.settings };
  }

  private loadSettings(): VibeSettings {
    const config = vscode.workspace.getConfiguration('vibe');
    return {
      openrouterApiKey: config.get('openrouterApiKey', ''),
      megallmApiKey: config.get('megallmApiKey', ''),
      agentrouterApiKey: config.get('agentrouterApiKey', ''),
      routewayApiKey: config.get('routewayApiKey', ''),
      provider: config.get('provider', 'openrouter'),
      defaultModel: config.get('defaultModel', 'x-ai/grok-4.1-fast:free'),
      executionMode: config.get('executionMode', 'code') as ExecutionMode,
      autoApproveUnsafeOps: config.get('autoApproveUnsafeOps', false),
      maxContextFiles: config.get('maxContextFiles', 20),
      streamingEnabled: config.get('streamingEnabled', true),
      enableMemorySystem: config.get('enableMemorySystem', true),
      enableDiffPreview: config.get('enableDiffPreview', true),
      enableProviderFallback: config.get('enableProviderFallback', true)
    };
  }

  async updateSetting<K extends keyof VibeSettings>(key: K, value: VibeSettings[K]): Promise<void> {
    const config = vscode.workspace.getConfiguration('vibe');
    await config.update(key, value, vscode.ConfigurationTarget.Global);
    this.settings[key] = value;
    this.notifyListeners();
  }

  validate(): SettingsValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for at least one API key
    const hasApiKey = this.settings.openrouterApiKey || 
                      this.settings.megallmApiKey || 
                      this.settings.agentrouterApiKey || 
                      this.settings.routewayApiKey;
    
    if (!hasApiKey) {
      errors.push('No API key configured. Set at least one provider API key.');
    }

    // Validate provider has matching key
    const providerKeyMap: Record<string, keyof VibeSettings> = {
      openrouter: 'openrouterApiKey',
      megallm: 'megallmApiKey',
      agentrouter: 'agentrouterApiKey',
      routeway: 'routewayApiKey'
    };

    const keyField = providerKeyMap[this.settings.provider];
    if (keyField && !this.settings[keyField]) {
      warnings.push(`Selected provider "${this.settings.provider}" has no API key configured.`);
    }

    // Warn about dangerous settings
    if (this.settings.autoApproveUnsafeOps) {
      warnings.push('Auto-approve unsafe operations is enabled. This is dangerous!');
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  getApiKey(provider?: string): string {
    const p = provider || this.settings.provider;
    switch (p) {
      case 'openrouter': return this.settings.openrouterApiKey;
      case 'megallm': return this.settings.megallmApiKey;
      case 'agentrouter': return this.settings.agentrouterApiKey;
      case 'routeway': return this.settings.routewayApiKey;
      default: return '';
    }
  }

  subscribe(listener: (settings: VibeSettings) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) this.listeners.splice(index, 1);
    };
  }

  private notifyListeners(): void {
    const current = this.getSettings();
    this.listeners.forEach(l => { try { l(current); } catch (e) { console.error(e); } });
  }
}
