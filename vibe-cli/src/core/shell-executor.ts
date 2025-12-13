/**
 * Centralized Shell Executor Module
 *
 * Industry-grade shell command execution with live streaming, safety validation,
 * VS Code terminal integration, and comprehensive error handling.
 *
 * @module core/shell-executor
 */

import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import { EventEmitter } from 'events';

export interface ShellExecutionOptions {
  cwd?: string;
  env?: Record<string, string>;
  timeout?: number;
  streamOutput?: boolean;
  onStdout?: (data: string) => void;
  onStderr?: (data: string) => void;
  onProgress?: (progress: ExecutionProgress) => void;
  retryCount?: number;
  retryDelay?: number;
}

export interface ExecutionProgress {
  command: string;
  pid?: number;
  status: 'starting' | 'running' | 'completed' | 'failed' | 'cancelled';
  exitCode?: number | null;
  signal?: string | null;
  stdout: string;
  stderr: string;
  duration: number;
  startTime: number;
}

export interface ShellResult {
  command: string;
  directory: string;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  signal?: string | null;
  duration: number;
  success: boolean;
  error?: string;
  pid?: number;
}

export class ShellExecutor extends EventEmitter {
  private activeProcesses = new Map<number, ChildProcess>();
  private vsCodeTerminal?: any; // VS Code terminal API

  constructor() {
    super();
    this.detectVscodeEnvironment();
  }

  /**
   * Execute shell command with full lifecycle management
   */
  async execute(
    command: string,
    options: ShellExecutionOptions = {}
  ): Promise<ShellResult> {
    const startTime = Date.now();

    // Validate command safety
    const validation = this.validateCommand(command);
    if (!validation.safe) {
      const reason = validation.reason || 'Command blocked for safety';
      return {
        command,
        directory: options.cwd || process.cwd(),
        stdout: '',
        stderr: reason,
        exitCode: 1,
        duration: 0,
        success: false,
        error: reason
      };
    }

    // Prepare execution options
    const execOptions = this.prepareExecutionOptions(command, options);

    // Emit progress start
    const progress: ExecutionProgress = {
      command,
      status: 'starting',
      stdout: '',
      stderr: '',
      duration: 0,
      startTime
    };

    options.onProgress?.(progress);

    // Execute with retry logic
    let lastError: Error | null = null;
    const maxRetries = options.retryCount || 0;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.executeOnce(command, execOptions, progress, options);
        result.duration = Date.now() - startTime;

        // Emit final progress
        progress.status = result.success ? 'completed' : 'failed';
        progress.exitCode = result.exitCode;
        progress.duration = result.duration;
        options.onProgress?.(progress);

        return result;
      } catch (error: any) {
        lastError = error;

        if (attempt < maxRetries) {
          // Wait before retry with exponential backoff
          const delay = (options.retryDelay || 1000) * Math.pow(2, attempt);
          await this.sleep(delay);

          progress.status = 'running';
          options.onProgress?.(progress);
        }
      }
    }

    // All retries failed
    const result: ShellResult = {
      command,
      directory: execOptions.cwd,
      stdout: progress.stdout,
      stderr: progress.stderr,
      exitCode: 1,
      duration: Date.now() - startTime,
      success: false,
      error: lastError?.message || 'Command failed after retries'
    };

    progress.status = 'failed';
    progress.duration = result.duration;
    options.onProgress?.(progress);

    return result;
  }

  /**
   * Execute command once (internal method)
   */
  private async executeOnce(
    command: string,
    execOptions: any,
    progress: ExecutionProgress,
    options: ShellExecutionOptions
  ): Promise<ShellResult> {
    return new Promise((resolve, reject) => {
      let child: ChildProcess;

      // Use VS Code terminal if available and appropriate
      if (this.shouldUseVscodeTerminal(command)) {
        this.executeInVscodeTerminal(command, execOptions, progress, options, resolve, reject);
        return; // Early return - VS Code terminal handles the promise
      }

      // Use spawn for direct execution
      const [cmd, ...args] = this.parseCommand(command);

      child = spawn(cmd, args, {
        cwd: execOptions.cwd,
        env: execOptions.env,
        shell: true,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      // Track active process
      if (child.pid) {
        this.activeProcesses.set(child.pid, child);
        progress.pid = child.pid;
      }

      progress.status = 'running';
      options.onProgress?.(progress);

      let stdout = '';
      let stderr = '';
      let timedOut = false;

      // Set up timeout
      let timeoutId: NodeJS.Timeout | undefined;
      if (options.timeout) {
        timeoutId = setTimeout(() => {
          timedOut = true;
          if (child.pid) {
            this.killProcess(child.pid, 'SIGTERM');
          }
          reject(new Error(`Command timed out after ${options.timeout}ms`));
        }, options.timeout);
      }

      // Handle stdout
      child.stdout?.on('data', (data) => {
        const chunk = data.toString();
        stdout += chunk;
        progress.stdout = stdout;

        if (options.streamOutput && options.onStdout) {
          options.onStdout(chunk);
        }

        options.onProgress?.({ ...progress });
      });

      // Handle stderr
      child.stderr?.on('data', (data) => {
        const chunk = data.toString();
        stderr += chunk;
        progress.stderr = stderr;

        if (options.streamOutput && options.onStderr) {
          options.onStderr(chunk);
        }

        options.onProgress?.({ ...progress });
      });

      // Handle process completion
      child.on('close', (code, signal) => {
        if (timeoutId) clearTimeout(timeoutId);
        if (child.pid) this.activeProcesses.delete(child.pid);

        const success = code === 0 && !timedOut;
        const result: ShellResult = {
          command,
          directory: execOptions.cwd,
          stdout,
          stderr,
          exitCode: code,
          signal,
          duration: 0, // Set by caller
          success,
          pid: child.pid,
          error: code !== 0 ? `Command exited with code ${code}` : undefined
        };

        if (success) {
          resolve(result);
        } else {
          reject(new Error(result.error || `Command failed with exit code ${code}`));
        }
      });

      // Handle process errors
      child.on('error', (error) => {
        if (timeoutId) clearTimeout(timeoutId);
        if (child.pid) this.activeProcesses.delete(child.pid);

        reject(new Error(`Failed to start command: ${error.message}`));
      });
    });
  }

  /**
   * Execute command in VS Code terminal
   */
  private async executeInVscodeTerminal(
    command: string,
    execOptions: any,
    progress: ExecutionProgress,
    options: ShellExecutionOptions,
    resolve: (result: ShellResult) => void,
    reject: (error: Error) => void
  ): Promise<void> {
    try {
      // VS Code terminal integration would go here
      // For now, fall back to direct execution
      const result = await this.executeOnce(command, execOptions, progress, {
        ...options,
        streamOutput: false // VS Code handles its own streaming
      });
      resolve(result);
    } catch (error) {
      reject(error as Error);
    }
  }

  /**
   * Cancel running command
   */
  cancel(pid: number, signal: string = 'SIGTERM'): boolean {
    return this.killProcess(pid, signal);
  }

  /**
   * Cancel all running commands
   */
  cancelAll(signal: string = 'SIGTERM'): void {
    for (const [pid, process] of this.activeProcesses) {
      this.killProcess(pid, signal);
    }
    this.activeProcesses.clear();
  }

  /**
   * Get list of active processes
   */
  getActiveProcesses(): number[] {
    return Array.from(this.activeProcesses.keys());
  }

  /**
   * Validate command safety
   */
  private validateCommand(command: string): { safe: boolean; reason?: string } {
    const dangerousPatterns = [
      /\brm\s+-rf\s*\/?\b/,           // rm -rf /
      /\brm\s+-rf\s*\/\w+/,           // rm -rf /something
      /\bchmod\s+777\b/,              // chmod 777
      /\bmkfs\b/,                     // mkfs
      /\bdd\s+if=/,                   // dd if=
      /\bfork\s*bomb/,                // fork bombs
      /\b: \(\)\s*\{\s*: \| :&\s*\};\s*:/, // bash fork bomb
      /\bsudo\b/,                     // sudo commands (unless explicitly allowed)
      /\bshutdown\b/,                 // shutdown
      /\breboot\b/,                   // reboot
      /\bhalt\b/,                     // halt
      /\bpoweroff\b/,                 // poweroff
      /\bkillall\b/,                  // killall
      /\bpkill\b/,                    // pkill
      /\bkill\s+-\d+\b/               // kill signals
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(command)) {
        return {
          safe: false,
          reason: `Blocked dangerous command pattern: ${pattern.source}`
        };
      }
    }

    return { safe: true };
  }

  /**
   * Parse command string into executable and arguments
   */
  private parseCommand(command: string): string[] {
    // Simple parsing - could be enhanced for complex commands
    return command.split(/\s+/).filter(arg => arg.length > 0);
  }

  /**
   * Prepare execution options
   */
  private prepareExecutionOptions(command: string, options: ShellExecutionOptions): any {
    return {
      cwd: options.cwd || process.cwd(),
      env: {
        ...process.env,
        VIBE_CLI: '1',
        ...options.env
      }
    };
  }

  /**
   * Check if VS Code terminal should be used
   */
  private shouldUseVscodeTerminal(command: string): boolean {
    // Use VS Code terminal for interactive commands or when explicitly requested
    return this.vsCodeTerminal &&
           (command.includes('npm run dev') ||
            command.includes('yarn dev') ||
            command.includes('pnpm dev') ||
            process.env.VIBE_USE_VSCODE_TERMINAL === 'true');
  }

  /**
   * Detect VS Code environment
   */
  private detectVscodeEnvironment(): void {
    // Check if running in VS Code extension context
    if (typeof global !== 'undefined' &&
        (global as any).vscode &&
        (global as any).vscode.workspace) {
      // VS Code API is available
      this.vsCodeTerminal = (global as any).vscode.window.createTerminal();
    }
  }

  /**
   * Kill a process
   */
  private killProcess(pid: number, signal: string): boolean {
    try {
      process.kill(pid, signal as any);
      this.activeProcesses.delete(pid);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Global executor instance
export const shellExecutor = new ShellExecutor();

/**
 * Convenience function for executing shell commands
 */
export async function executeShellCommand(
  command: string,
  options: ShellExecutionOptions = {}
): Promise<ShellResult> {
  return shellExecutor.execute(command, options);
}

/**
 * Stream shell command output to callbacks
 */
export async function streamShellCommand(
  command: string,
  onStdout: (data: string) => void,
  onStderr: (data: string) => void,
  options: Omit<ShellExecutionOptions, 'onStdout' | 'onStderr' | 'streamOutput'> = {}
): Promise<ShellResult> {
  return shellExecutor.execute(command, {
    ...options,
    streamOutput: true,
    onStdout,
    onStderr
  });
}
