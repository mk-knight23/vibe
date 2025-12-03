export interface ModelCapability {
  maxTokens: number;
  strengths: string[];
  costTier: 'free' | 'low' | 'medium' | 'high';
}

export interface ModelInfo {
  id: string;
  provider: string;
  capabilities: ModelCapability;
}

export class ModelRouter {
  private models: Map<string, ModelInfo> = new Map();

  registerModel(model: ModelInfo): void {
    this.models.set(model.id, model);
  }

  selectModel(requirements: {
    task?: 'code' | 'chat' | 'analysis' | 'debug';
    minTokens?: number;
    preferFree?: boolean;
  }): ModelInfo | undefined {
    const candidates = Array.from(this.models.values()).filter(model => {
      if (requirements.minTokens && model.capabilities.maxTokens < requirements.minTokens) {
        return false;
      }
      if (requirements.preferFree && model.capabilities.costTier !== 'free') {
        return false;
      }
      if (requirements.task && !model.capabilities.strengths.includes(requirements.task)) {
        return false;
      }
      return true;
    });

    if (candidates.length === 0) return undefined;

    // Prefer free models, then by max tokens
    return candidates.sort((a, b) => {
      if (a.capabilities.costTier === 'free' && b.capabilities.costTier !== 'free') return -1;
      if (a.capabilities.costTier !== 'free' && b.capabilities.costTier === 'free') return 1;
      return b.capabilities.maxTokens - a.capabilities.maxTokens;
    })[0];
  }

  getModel(id: string): ModelInfo | undefined {
    return this.models.get(id);
  }

  listModels(): ModelInfo[] {
    return Array.from(this.models.values());
  }
}
