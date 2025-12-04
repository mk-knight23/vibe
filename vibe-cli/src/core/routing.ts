export interface ContextEntry {
  type: 'file' | 'conversation' | 'code' | 'error';
  content: string;
  metadata?: Record<string, any>;
  priority: number;
}

export class ContextManager {
  private context: ContextEntry[] = [];
  private maxTokens = 8000;

  addContext(entry: ContextEntry): void {
    this.context.push(entry);
    this.pruneContext();
  }

  addFile(path: string, content: string, priority: number = 5): void {
    this.addContext({
      type: 'file',
      content,
      metadata: { path },
      priority
    });
  }

  addConversation(message: string, priority: number = 10): void {
    this.addContext({
      type: 'conversation',
      content: message,
      priority
    });
  }

  addError(error: string, priority: number = 15): void {
    this.addContext({
      type: 'error',
      content: error,
      priority
    });
  }

  buildContext(): string {
    const sorted = this.context.sort((a, b) => b.priority - a.priority);
    return sorted.map(entry => {
      const prefix = entry.type === 'file' ? `File: ${entry.metadata?.path}\n` : '';
      return prefix + entry.content;
    }).join('\n\n');
  }

  private pruneContext(): void {
    // Sort by priority and keep within token limit
    this.context.sort((a, b) => b.priority - a.priority);
    
    let totalTokens = 0;
    const kept: ContextEntry[] = [];
    
    for (const entry of this.context) {
      const tokens = this.estimateTokens(entry.content);
      if (totalTokens + tokens <= this.maxTokens) {
        kept.push(entry);
        totalTokens += tokens;
      }
    }
    
    this.context = kept;
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  clear(): void {
    this.context = [];
  }

  setMaxTokens(tokens: number): void {
    this.maxTokens = tokens;
    this.pruneContext();
  }
}
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
