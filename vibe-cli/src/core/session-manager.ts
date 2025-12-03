export interface Session {
  id: string;
  context: Map<string, any>;
  history: Message[];
  metadata: SessionMetadata;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface SessionMetadata {
  created: number;
  updated: number;
  provider?: string;
  model?: string;
}

export class SessionManager {
  private sessions: Map<string, Session> = new Map();
  private currentSessionId?: string;

  createSession(id?: string): Session {
    const sessionId = id || `session-${Date.now()}`;
    const session: Session = {
      id: sessionId,
      context: new Map(),
      history: [],
      metadata: { created: Date.now(), updated: Date.now() }
    };
    this.sessions.set(sessionId, session);
    this.currentSessionId = sessionId;
    return session;
  }

  getCurrentSession(): Session | undefined {
    return this.currentSessionId ? this.sessions.get(this.currentSessionId) : undefined;
  }

  addMessage(message: Message): void {
    const session = this.getCurrentSession();
    if (session) {
      session.history.push(message);
      session.metadata.updated = Date.now();
    }
  }

  setContext(key: string, value: any): void {
    const session = this.getCurrentSession();
    if (session) session.context.set(key, value);
  }

  getContext(key: string): any {
    return this.getCurrentSession()?.context.get(key);
  }

  summarizeHistory(maxTokens: number = 4000): Message[] {
    const session = this.getCurrentSession();
    if (!session) return [];
    
    // Keep recent messages within token limit
    const recentMessages = session.history.slice(-10);
    return recentMessages;
  }
}
