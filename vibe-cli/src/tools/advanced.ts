import { promises as fs } from 'fs';
import { resolve, dirname } from 'path';

export class FileManager {
  private safetyBoundaries: string[];

  constructor(projectRoot: string = process.cwd()) {
    this.safetyBoundaries = [resolve(projectRoot)];
  }

  async readFile(filePath: string): Promise<string> {
    this.validatePath(filePath);
    return await fs.readFile(filePath, 'utf-8');
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    this.validatePath(filePath);
    await this.atomicWrite(filePath, content);
  }

  async deleteFile(filePath: string): Promise<void> {
    this.validatePath(filePath);
    await fs.unlink(filePath);
  }

  async createDirectory(dirPath: string): Promise<void> {
    this.validatePath(dirPath);
    await fs.mkdir(dirPath, { recursive: true });
  }

  private async atomicWrite(filePath: string, content: string): Promise<void> {
    const tempPath = `${filePath}.tmp`;
    try {
      await fs.mkdir(dirname(filePath), { recursive: true });
      await fs.writeFile(tempPath, content, 'utf-8');
      await fs.rename(tempPath, filePath);
    } catch (error) {
      await fs.unlink(tempPath).catch(() => {});
      throw error;
    }
  }

  private validatePath(filePath: string): void {
    const resolved = resolve(filePath);
    if (!this.safetyBoundaries.some(b => resolved.startsWith(b))) {
      throw new Error(`Path outside project boundary: ${resolved}`);
    }
  }
}
// Smart Shell with Auto-Correction
import { exec } from 'child_process';
import { promisify } from 'util';
import { ApiClient } from '../core/api';

const execAsync = promisify(exec);

export class SmartShell {
  private history: string[] = [];
  private corrections: Map<string, string> = new Map();

  constructor(private client?: ApiClient, private model?: string) {
    this.initCommonCorrections();
  }

  private initCommonCorrections(): void {
    this.corrections.set('isntall', 'install');
    this.corrections.set('intsall', 'install');
    this.corrections.set('udpate', 'update');
    this.corrections.set('comit', 'commit');
    this.corrections.set('psuh', 'push');
    this.corrections.set('pul', 'pull');
    this.corrections.set('statsu', 'status');
    this.corrections.set('branhc', 'branch');
  }

  async execute(command: string): Promise<any> {
    this.history.push(command);
    
    try {
      const { stdout, stderr } = await execAsync(command, { timeout: 60000 });
      return { success: true, stdout, stderr };
    } catch (error: any) {
      // Try auto-correction
      const corrected = await this.autoCorrect(command, error.message);
      if (corrected && corrected !== command) {
        console.log(`Auto-corrected: ${corrected}`);
        return await this.execute(corrected);
      }
      return { success: false, error: error.message };
    }
  }

  private async autoCorrect(command: string, error: string): Promise<string | null> {
    // Check common typos
    const words = command.split(' ');
    for (let i = 0; i < words.length; i++) {
      if (this.corrections.has(words[i])) {
        words[i] = this.corrections.get(words[i])!;
        return words.join(' ');
      }
    }

    // AI-powered correction
    if (this.client && this.model) {
      return await this.aiCorrect(command, error);
    }

    return null;
  }

  private async aiCorrect(command: string, error: string): Promise<string | null> {
    if (!this.client || !this.model) return null;

    const prompt = `Fix this command:\nCommand: ${command}\nError: ${error}\nReturn only the corrected command.`;

    try {
      const response = await this.client.chat([
        { role: 'user', content: prompt }
      ], this.model, { maxTokens: 50 });

      return response.choices?.[0]?.message?.content?.trim() || null;
    } catch {
      return null;
    }
  }

  async suggest(partial: string): Promise<string[]> {
    const suggestions: string[] = [];

    // History-based suggestions
    for (const cmd of this.history.slice(-20)) {
      if (cmd.startsWith(partial)) {
        suggestions.push(cmd);
      }
    }

    // Common commands
    const common = ['npm install', 'npm start', 'git status', 'git commit', 'git push'];
    for (const cmd of common) {
      if (cmd.startsWith(partial) && !suggestions.includes(cmd)) {
        suggestions.push(cmd);
      }
    }

    return suggestions.slice(0, 5);
  }

  getHistory(): string[] {
    return this.history.slice(-50);
  }

  clearHistory(): void {
    this.history = [];
  }
}
