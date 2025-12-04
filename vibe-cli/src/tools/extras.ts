import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const memoryFile = path.join(process.cwd(), '.vibe', 'memory.json');
const todosFile = path.join(process.cwd(), '.vibe', 'todos.json');

// Memory Management
export async function saveMemory(key: string, value: any): Promise<string> {
  const dir = path.dirname(memoryFile);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  let memory: any = {};
  if (fs.existsSync(memoryFile)) {
    memory = JSON.parse(fs.readFileSync(memoryFile, 'utf-8'));
  }
  
  memory[key] = value;
  fs.writeFileSync(memoryFile, JSON.stringify(memory, null, 2));
  return `Saved to memory: ${key}`;
}

export async function loadMemory(key?: string): Promise<any> {
  if (!fs.existsSync(memoryFile)) return key ? null : {};
  const memory = JSON.parse(fs.readFileSync(memoryFile, 'utf-8'));
  return key ? memory[key] : memory;
}

export async function writeTodos(todos: any[]): Promise<string> {
  const dir = path.dirname(todosFile);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(todosFile, JSON.stringify(todos, null, 2));
  const completed = todos.filter(t => t.status === 'completed').length;
  return `Updated todos: ${completed}/${todos.length} completed`;
}

// Sandbox Execution
export type SandboxType = 'docker' | 'podman' | 'sandbox-exec' | false;

export class SandboxEngine {
  private type: SandboxType = false;

  async detectSandbox(): Promise<SandboxType> {
    try {
      await execAsync('docker --version');
      return 'docker';
    } catch {
      try {
        await execAsync('podman --version');
        return 'podman';
      } catch {
        return process.platform === 'darwin' ? 'sandbox-exec' : false;
      }
    }
  }

  async execute(code: string, language: string): Promise<string> {
    this.type = await this.detectSandbox();
    if (!this.type) return 'Sandbox not available';
    
    const tempFile = path.join('/tmp', `vibe-${Date.now()}.${language}`);
    fs.writeFileSync(tempFile, code);
    
    try {
      const { stdout } = await execAsync(`${language} ${tempFile}`);
      return stdout;
    } finally {
      fs.unlinkSync(tempFile);
    }
  }
}
