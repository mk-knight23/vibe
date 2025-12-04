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
import { promises as fs } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

interface SessionData {
  id: string;
  messages: Message[];
  metadata: {
    created: number;
    updated: number;
    tokensUsed: number;
  };
}

export class EnhancedSessionManager {
  private sessionsDir: string;
  private currentSession?: SessionData;

  constructor() {
    this.sessionsDir = join(homedir(), '.vibe', 'sessions');
  }

  async createSession(): Promise<string> {
    const id = `session-${Date.now()}`;
    this.currentSession = {
      id,
      messages: [],
      metadata: {
        created: Date.now(),
        updated: Date.now(),
        tokensUsed: 0
      }
    };
    await this.saveSession();
    return id;
  }

  async loadSession(id: string): Promise<void> {
    const path = join(this.sessionsDir, `${id}.json`);
    const data = await fs.readFile(path, 'utf-8');
    this.currentSession = JSON.parse(data);
  }

  addMessage(role: 'user' | 'assistant', content: string): void {
    if (!this.currentSession) throw new Error('No active session');
    
    this.currentSession.messages.push({
      role,
      content,
      timestamp: Date.now()
    });
    this.currentSession.metadata.updated = Date.now();
  }

  getMessages(limit?: number): Message[] {
    if (!this.currentSession) return [];
    const msgs = this.currentSession.messages;
    return limit ? msgs.slice(-limit) : msgs;
  }

  async saveSession(): Promise<void> {
    if (!this.currentSession) return;
    
    await fs.mkdir(this.sessionsDir, { recursive: true });
    const path = join(this.sessionsDir, `${this.currentSession.id}.json`);
    await fs.writeFile(path, JSON.stringify(this.currentSession, null, 2));
  }

  async exportSession(format: 'json' | 'md' = 'json'): Promise<string> {
    if (!this.currentSession) throw new Error('No active session');
    
    if (format === 'json') {
      return JSON.stringify(this.currentSession, null, 2);
    }
    
    let md = `# Session ${this.currentSession.id}\n\n`;
    this.currentSession.messages.forEach(msg => {
      md += `## ${msg.role}\n${msg.content}\n\n`;
    });
    return md;
  }
}
