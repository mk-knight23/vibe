import { promises as fs } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

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
