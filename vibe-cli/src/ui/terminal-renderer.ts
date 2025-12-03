import chalk from 'chalk';
import ora, { Ora } from 'ora';

export class TerminalRenderer {
  private spinner?: Ora;

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
}
