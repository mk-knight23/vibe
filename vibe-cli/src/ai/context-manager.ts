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
