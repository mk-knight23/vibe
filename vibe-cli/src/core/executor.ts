import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  duration: number;
}

export class CommandExecutor {
  private dangerousCommands = ['rm -rf', 'format', 'dd', 'mkfs', ':(){:|:&};:'];

  async execute(command: string, cwd?: string): Promise<ExecutionResult> {
    this.validateSafety(command);
    
    const start = Date.now();
    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: cwd || process.cwd(),
        timeout: 30000,
        maxBuffer: 10 * 1024 * 1024
      });
      
      return {
        stdout,
        stderr,
        exitCode: 0,
        duration: Date.now() - start
      };
    } catch (error: any) {
      return {
        stdout: error.stdout || '',
        stderr: error.stderr || error.message,
        exitCode: error.code || 1,
        duration: Date.now() - start
      };
    }
  }

  async dryRun(command: string): Promise<string> {
    return `Would execute: ${command}`;
  }

  private validateSafety(command: string): void {
    const lower = command.toLowerCase();
    for (const dangerous of this.dangerousCommands) {
      if (lower.includes(dangerous)) {
        throw new Error(`Dangerous command blocked: ${dangerous}`);
      }
    }
  }
}
