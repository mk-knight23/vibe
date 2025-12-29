import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import path from 'path';

import { detectOS, isDestructiveCommand } from '../utils/os-detect';
import { validateCommand as validateSecurity, AuditLogger, getRiskIndicator, isDryRun } from '../core/security';

const execAsync = promisify(exec);
const auditLogger = new AuditLogger();

interface ShellResult {
  command: string;
  directory: string;
  stdout: string;
  stderr: string;
  error?: string;
  exitCode: number | null;
  signal?: string;
  backgroundPIDs?: number[];
  sandboxed?: boolean;
  riskLevel?: string;
}

export async function runShellCommand(
  command: string,
  description?: string,
  directory?: string,
  streamOutput?: (type: 'stdout' | 'stderr', data: string) => void
): Promise<ShellResult> {
  const cwd = directory ? path.resolve(process.cwd(), directory) : process.cwd();
  
  // Security validation
  const validation = validateSecurity(command);
  
  if (!validation.allowed) {
    auditLogger.log({
      action: 'shell_command',
      command,
      riskLevel: validation.riskLevel,
      approved: false,
      result: 'blocked'
    });
    
    return {
      command,
      directory: cwd,
      stdout: '',
      stderr: `${getRiskIndicator(validation.riskLevel)} Command blocked: ${validation.reason}`,
      error: validation.reason,
      exitCode: 1,
      riskLevel: validation.riskLevel
    };
  }

  // Dry-run mode
  if (isDryRun()) {
    return {
      command,
      directory: cwd,
      stdout: `[DRY-RUN] Would execute: ${command}`,
      stderr: '',
      exitCode: 0,
      riskLevel: validation.riskLevel
    };
  }

  // Legacy safety check
  if (isDestructiveCommand(command)) {
    return {
      command,
      directory: cwd,
      stdout: '',
      stderr: 'Destructive command blocked for safety',
      error: 'This command is potentially destructive and requires manual confirmation',
      exitCode: 1
    };
  }

  const osType = detectOS();
  const sandboxed = false;

  const result: ShellResult = {
    command,
    directory: cwd,
    stdout: '',
    stderr: '',
    exitCode: null,
    backgroundPIDs: [],
    sandboxed,
    riskLevel: validation.riskLevel
  };

  try {
    // Check for background process
    if (command.includes(' &')) {
      if (sandboxed) {
        result.error = 'Background processes not supported in sandbox mode';
        result.exitCode = 1;
        return result;
      }

      const cleanCmd = command.replace(/\s*&\s*$/, '');
      const child = spawn(cleanCmd, [], {
        cwd,
        shell: true,
        detached: true,
        stdio: 'ignore',
        env: { ...process.env, VIBE_CLI: '1' }
      });

      child.unref();
      result.backgroundPIDs = [child.pid || 0];
      result.stdout = `Background process started with PID: ${child.pid}`;
      result.exitCode = 0;
    } else {
      if (sandboxed) {
        result.error = 'Sandbox not available';
        result.exitCode = 1;
      } else {
        // Use spawn for streaming output
        const child = spawn(command, [], {
          cwd,
          shell: true,
          env: { ...process.env, VIBE_CLI: '1' }
        });

        let stdout = '';
        let stderr = '';

        // Stream output if callback provided
        if (streamOutput) {
          child.stdout?.on('data', (data) => {
            const chunk = data.toString();
            stdout += chunk;
            streamOutput('stdout', chunk);
          });

          child.stderr?.on('data', (data) => {
            const chunk = data.toString();
            stderr += chunk;
            streamOutput('stderr', chunk);
          });
        } else {
          // Buffer output if no streaming callback
          child.stdout?.on('data', (data) => {
            stdout += data.toString();
          });

          child.stderr?.on('data', (data) => {
            stderr += data.toString();
          });
        }

        // Wait for process to complete
        await new Promise((resolve, reject) => {
          child.on('close', (code) => {
            result.exitCode = code;
            result.stdout = stdout;
            result.stderr = stderr;
            resolve(code);
          });

          child.on('error', (err) => {
            result.error = err.message;
            result.exitCode = 1;
            reject(err);
          });
        });

        // If no streaming, set buffered output
        if (!streamOutput) {
          result.stdout = stdout;
          result.stderr = stderr;
        }
      }
    }
  } catch (err: any) {
    result.error = err.message;
    result.exitCode = err.code || 1;
    result.stderr = err.stderr || '';
    result.stdout = err.stdout || '';
  }

  return result;
}

export function validateCommand(command: string, coreCommands: string[] = [], excludeCommands: string[] = []): boolean {
  const parts = command.split(/&&|\|\||;/).map(p => p.trim());
  
  for (const part of parts) {
    const cmd = part.split(' ')[0];
    
    // Check exclude list first
    if (excludeCommands.some(exc => cmd.startsWith(exc))) return false;
    
    // If core list exists and doesn't include wildcard, check it
    if (coreCommands.length > 0 && !coreCommands.includes('run_shell_command')) {
      if (!coreCommands.some(core => cmd.startsWith(core.replace('run_shell_command(', '').replace(')', '')))) {
        return false;
      }
    }
  }
  
  return true;
}
