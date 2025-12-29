import { exec } from 'child_process';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';

const execAsync = promisify(exec);

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  duration: number;
  executionId: string;
}

export interface SecurityConfig {
  allowList: string[];
  denyList: string[];
  dryRun: boolean;
  auditLog: boolean;
}

export class CommandExecutor {
  private dangerousCommands = ['rm -rf', 'format', 'dd', 'mkfs', ':(){:|:&};:'];
  private securityConfig: SecurityConfig;

  constructor(securityConfig: SecurityConfig = {
    allowList: [],
    denyList: [],
    dryRun: false,
    auditLog: true
  }) {
    this.securityConfig = securityConfig;
  }

  async execute(command: string, cwd?: string): Promise<ExecutionResult> {
    this.validateCommand(command);

    const executionId = uuidv4();
    const start = Date.now();

    // Audit log
    if (this.securityConfig.auditLog) {
      console.log(`[AUDIT] Command execution: ${command} (ID: ${executionId})`);
    }

    // Dry run mode
    if (this.securityConfig.dryRun) {
      return {
        stdout: `DRY RUN: Would execute: ${command}`,
        stderr: '',
        exitCode: 0,
        duration: 0,
        executionId
      };
    }

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
        duration: Date.now() - start,
        executionId
      };
    } catch (error: any) {
      return {
        stdout: error.stdout || '',
        stderr: error.stderr || error.message,
        exitCode: error.code || 1,
        duration: Date.now() - start,
        executionId
      };
    }
  }

  async dryRun(command: string): Promise<string> {
    return `Would execute: ${command}`;
  }

  private validateCommand(command: string): void {
    const lower = command.toLowerCase();

    // Check deny list
    for (const denied of this.securityConfig.denyList) {
      if (lower.includes(denied.toLowerCase())) {
        throw new Error(`Command blocked by deny list: ${denied}`);
      }
    }

    // Check allow list if specified
    if (this.securityConfig.allowList.length > 0) {
      const allowed = this.securityConfig.allowList.some(allowed =>
        lower.includes(allowed.toLowerCase())
      );
      if (!allowed) {
        throw new Error(`Command not in allow list`);
      }
    }

    // Check dangerous commands
    for (const dangerous of this.dangerousCommands) {
      if (lower.includes(dangerous)) {
        throw new Error(`Dangerous command blocked: ${dangerous}`);
      }
    }
  }
}
