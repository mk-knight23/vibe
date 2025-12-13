// Development Tools Suite
import { existsSync } from 'fs';
import { join } from 'path';
import { executeShellCommand } from '../core/shell-executor';

export class DevTools {
  async lint(path: string = '.', fix: boolean = false): Promise<string> {
    const linters = [
      { cmd: 'eslint', args: fix ? '--fix' : '', files: ['*.js', '*.ts', '*.jsx', '*.tsx'] },
      { cmd: 'pylint', args: '', files: ['*.py'] },
      { cmd: 'rubocop', args: fix ? '-a' : '', files: ['*.rb'] }
    ];

    for (const linter of linters) {
      if (await this.hasCommand(linter.cmd)) {
        try {
          const result = await executeShellCommand(`${linter.cmd} ${linter.args} ${path}`, {
            cwd: process.cwd(),
            timeout: 30000
          });
          return result.stdout || result.stderr || 'Linting complete';
        } catch (err: any) {
          return err.message;
        }
      }
    }

    return 'No linter found. Install ESLint, Pylint, or Rubocop.';
  }

  async format(path: string = '.', check: boolean = false): Promise<string> {
    const formatters = [
      { cmd: 'prettier', args: check ? '--check' : '--write', files: ['*.js', '*.ts', '*.json', '*.md'] },
      { cmd: 'black', args: check ? '--check' : '', files: ['*.py'] },
      { cmd: 'rustfmt', args: check ? '--check' : '', files: ['*.rs'] }
    ];

    for (const formatter of formatters) {
      if (await this.hasCommand(formatter.cmd)) {
        try {
          const result = await executeShellCommand(`${formatter.cmd} ${formatter.args} ${path}`, {
            cwd: process.cwd(),
            timeout: 30000
          });
          return result.stdout || result.stderr || 'Formatting complete';
        } catch (err: any) {
          return err.message;
        }
      }
    }

    return 'No formatter found. Install Prettier, Black, or Rustfmt.';
  }

  async test(pattern: string = '', watch: boolean = false, coverage: boolean = false): Promise<string> {
    const testRunners = [
      { cmd: 'jest', args: `${watch ? '--watch' : ''} ${coverage ? '--coverage' : ''} ${pattern}` },
      { cmd: 'vitest', args: `${watch ? '--watch' : ''} ${coverage ? '--coverage' : ''} ${pattern}` },
      { cmd: 'pytest', args: `${coverage ? '--cov' : ''} ${pattern}` },
      { cmd: 'cargo', args: `test ${pattern}` }
    ];

    for (const runner of testRunners) {
      if (await this.hasCommand(runner.cmd)) {
        try {
          const result = await executeShellCommand(`${runner.cmd} ${runner.args}`, {
            cwd: process.cwd(),
            timeout: 60000
          });
          return (result.stdout + result.stderr) || 'Tests completed';
        } catch (err: any) {
          return err.message;
        }
      }
    }

    return 'No test runner found. Install Jest, Vitest, Pytest, or Cargo.';
  }

  async build(target: string = '', production: boolean = false): Promise<string> {
    const builders = [
      { cmd: 'npm', args: `run build ${production ? '-- --mode production' : ''}` },
      { cmd: 'yarn', args: `build ${production ? '--mode production' : ''}` },
      { cmd: 'pnpm', args: `build ${production ? '--mode production' : ''}` },
      { cmd: 'cargo', args: `build ${production ? '--release' : ''}` },
      { cmd: 'go', args: `build ${target}` }
    ];

    for (const builder of builders) {
      if (await this.hasCommand(builder.cmd)) {
        try {
          const result = await executeShellCommand(`${builder.cmd} ${builder.args}`, {
            cwd: process.cwd(),
            timeout: 300000 // 5 minutes
          });
          return (result.stdout + result.stderr) || 'Build complete';
        } catch (err: any) {
          return err.message;
        }
      }
    }

    return 'No build tool found.';
  }

  async serve(port: number = 3000, open: boolean = false): Promise<void> {
    const servers = [
      { cmd: 'npm', args: `run dev -- --port ${port} ${open ? '--open' : ''}` },
      { cmd: 'yarn', args: `dev --port ${port} ${open ? '--open' : ''}` },
      { cmd: 'python3', args: `-m http.server ${port}` }
    ];

    for (const server of servers) {
      if (await this.hasCommand(server.cmd)) {
        console.log(`Starting dev server on port ${port}...`);
        try {
          await executeShellCommand(`${server.cmd} ${server.args}`, {
            cwd: process.cwd(),
            timeout: 0 // No timeout for servers
          });
        } catch (error) {
          console.error(`Server error: ${error}`);
        }
        return;
      }
    }

    console.log('No dev server found.');
  }

  private async hasCommand(cmd: string): Promise<boolean> {
    try {
      const result = await executeShellCommand(`which ${cmd}`, {
        cwd: process.cwd(),
        timeout: 5000
      });
      return result.exitCode === 0;
    } catch {
      return false;
    }
  }

  async detectProjectType(): Promise<string> {
    if (existsSync('package.json')) return 'node';
    if (existsSync('requirements.txt') || existsSync('setup.py')) return 'python';
    if (existsSync('Cargo.toml')) return 'rust';
    if (existsSync('go.mod')) return 'go';
    if (existsSync('Gemfile')) return 'ruby';
    return 'unknown';
  }
}
