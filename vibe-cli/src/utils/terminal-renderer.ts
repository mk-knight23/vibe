import chalk from 'chalk';
import ora, { Ora } from 'ora';

export type StateType = 'thinking' | 'executing' | 'verifying' | 'done' | 'error';

export class TerminalRenderer {
  private spinner?: Ora;
  private currentState: StateType = 'thinking';
  private stateStartTime: number = Date.now();
  private streamingBuffer: string = '';
  private isStreaming: boolean = false;

  // State awareness with clear visual indicators
  setState(state: StateType, message?: string): void {
    this.currentState = state;
    this.stateStartTime = Date.now();

    const stateConfig = {
      thinking: { icon: '🧠', color: chalk.cyan, defaultMsg: 'Analyzing request...' },
      executing: { icon: '⚡', color: chalk.yellow, defaultMsg: 'Executing tools...' },
      verifying: { icon: '🔍', color: chalk.blue, defaultMsg: 'Verifying results...' },
      done: { icon: '✅', color: chalk.green, defaultMsg: 'Complete' },
      error: { icon: '❌', color: chalk.red, defaultMsg: 'Error occurred' }
    };

    const config = stateConfig[state];
    const displayMessage = message || config.defaultMsg;

    // Clear previous spinner
    if (this.spinner) {
      this.spinner.stop();
      this.spinner = undefined;
    }

    // Show state change
    console.log(`\n${config.icon} ${config.color(displayMessage)}`);

    // Start new spinner for ongoing states
    if (state !== 'done' && state !== 'error') {
      this.spinner = ora({
        text: config.color(displayMessage),
        spinner: 'dots',
        color: 'cyan'
      }).start();
    }
  }

  getCurrentState(): StateType {
    return this.currentState;
  }

  getStateDuration(): number {
    return Date.now() - this.stateStartTime;
  }

  // Streaming output with token-by-token rendering
  startStreaming(): void {
    this.isStreaming = true;
    this.streamingBuffer = '';
    process.stdout.write('\n💬 ');
  }

  streamToken(token: string): void {
    if (!this.isStreaming) return;

    // Natural chunking - accumulate tokens and render in meaningful chunks
    this.streamingBuffer += token;

    // Render when we hit natural breakpoints or reasonable chunk sizes
    if (token.includes('\n') || token.includes('.') || token.includes('!') || token.includes('?') ||
        this.streamingBuffer.length > 80) {
      process.stdout.write(this.streamingBuffer);
      this.streamingBuffer = '';
    }
  }

  endStreaming(): void {
    if (this.isStreaming && this.streamingBuffer) {
      process.stdout.write(this.streamingBuffer);
    }
    this.isStreaming = false;
    this.streamingBuffer = '';
    console.log('\n');
  }

  // Trust signals for operations
  showFileOperation(operation: 'read' | 'write' | 'delete', filePath: string, success: boolean = true): void {
    const icons = {
      read: '📖',
      write: '✏️',
      delete: '🗑️'
    };
    const colors = {
      read: chalk.blue,
      write: chalk.green,
      delete: chalk.red
    };

    const icon = icons[operation];
    const color = colors[operation];
    const status = success ? '✓' : '✗';
    const shortPath = filePath.split('/').pop() || filePath;

    console.log(`${icon} ${color(operation.toUpperCase())} ${shortPath} ${success ? chalk.green(status) : chalk.red(status)}`);
  }

  showCommandExecution(command: string, success: boolean = true, duration?: number): void {
    const shortCmd = command.length > 50 ? command.substring(0, 47) + '...' : command;
    const durationStr = duration ? ` (${duration}ms)` : '';

    if (success) {
      console.log(`🔧 ${chalk.gray(shortCmd)} ${chalk.green('✓')}${durationStr}`);
    } else {
      console.log(`🔧 ${chalk.gray(shortCmd)} ${chalk.red('✗')}${durationStr}`);
    }
  }

  showToolExecution(toolName: string, params: any, success: boolean = true, duration?: number): void {
    const paramSummary = Object.keys(params).slice(0, 2).join(', ');
    const durationStr = duration ? ` (${duration}ms)` : '';

    if (success) {
      console.log(`🛠️  ${chalk.cyan(toolName)} ${chalk.gray(paramSummary)} ${chalk.green('✓')}${durationStr}`);
    } else {
      console.log(`🛠️  ${chalk.cyan(toolName)} ${chalk.gray(paramSummary)} ${chalk.red('✗')}${durationStr}`);
    }
  }

  // Legacy methods for backward compatibility
  showProgress(message: string): void {
    this.spinner = ora(message).start();
  }

  updateProgress(message: string): void {
    if (this.spinner) this.spinner.text = message;
  }

  stopProgress(success: boolean = true, message?: string): void {
    if (!this.spinner) return;
    if (success) this.spinner.succeed(message);
    else this.spinner.fail(message);
    this.spinner = undefined;
  }

  success(message: string): void {
    console.log(chalk.green('✓'), message);
  }

  error(message: string): void {
    console.log(chalk.red('✗'), message);
  }

  warning(message: string): void {
    console.log(chalk.yellow('⚠'), message);
  }

  info(message: string): void {
    console.log(chalk.blue('ℹ'), message);
  }

  code(code: string, language?: string): void {
    console.log(chalk.gray('```' + (language || '')));
    console.log(code);
    console.log(chalk.gray('```'));
  }

  section(title: string): void {
    console.log('\n' + chalk.bold.cyan(title));
    console.log(chalk.gray('─'.repeat(title.length)));
  }

  table(data: Record<string, string>[]): void {
    if (data.length === 0) return;
    const keys = Object.keys(data[0]);
    console.log(keys.map(k => chalk.bold(k)).join(' | '));
    data.forEach(row => {
      console.log(keys.map(k => row[k]).join(' | '));
    });
  }

  // Clean, modern UI elements
  divider(length: number = 70): void {
    console.log(chalk.gray('─'.repeat(length)));
  }

  header(text: string): void {
    const width = 70;
    const padding = Math.max(0, width - text.length - 4);
    const leftPad = Math.floor(padding / 2);
    const rightPad = padding - leftPad;

    console.log(chalk.cyan('═'.repeat(width)));
    console.log(chalk.cyan('║') + ' '.repeat(leftPad) + chalk.bold.white(text) + ' '.repeat(rightPad) + chalk.cyan('║'));
    console.log(chalk.cyan('═'.repeat(width)));
  }

  status(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    const colors = {
      success: chalk.green,
      error: chalk.red,
      warning: chalk.yellow,
      info: chalk.blue
    };

    console.log(`${icons[type]} ${colors[type](message)}`);
  }
}
