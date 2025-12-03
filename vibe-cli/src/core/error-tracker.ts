import { createHash } from 'crypto';

export interface ErrorEntry {
  id: string;
  message: string;
  stack?: string;
  timestamp: number;
  context?: Record<string, any>;
  count: number;
}

export class ErrorTracker {
  private errors: Map<string, ErrorEntry> = new Map();

  track(error: Error, context?: Record<string, any>): string {
    const id = this.generateErrorId(error);
    const existing = this.errors.get(id);

    if (existing) {
      existing.count++;
      existing.timestamp = Date.now();
    } else {
      this.errors.set(id, {
        id,
        message: error.message,
        stack: error.stack,
        timestamp: Date.now(),
        context,
        count: 1
      });
    }

    return id;
  }

  private generateErrorId(error: Error): string {
    const signature = error.message + (error.stack?.split('\n')[1] || '');
    return createHash('md5').update(signature).digest('hex').slice(0, 8);
  }

  getError(id: string): ErrorEntry | undefined {
    return this.errors.get(id);
  }

  getFrequentErrors(limit: number = 10): ErrorEntry[] {
    return Array.from(this.errors.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  getRecentErrors(limit: number = 10): ErrorEntry[] {
    return Array.from(this.errors.values())
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  clear(): void {
    this.errors.clear();
  }
}
