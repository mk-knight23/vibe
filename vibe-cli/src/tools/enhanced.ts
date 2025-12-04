import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export async function gitStatus(): Promise<string> {
  try {
    return execSync('git --no-pager status --short', { encoding: 'utf-8' });
  } catch (error: any) {
    return `Error: ${error.message}`;
  }
}

export async function gitDiff(file?: string): Promise<string> {
  try {
    const cmd = file ? `git --no-pager diff ${file}` : 'git --no-pager diff HEAD';
    return execSync(cmd, { encoding: 'utf-8' });
  } catch (error: any) {
    return `Error: ${error.message}`;
  }
}

export async function gitLog(count: number = 5): Promise<string> {
  try {
    return execSync(`git --no-pager log -n ${count} --oneline`, { encoding: 'utf-8' });
  } catch (error: any) {
    return `Error: ${error.message}`;
  }
}

export async function gitBlame(file: string, lineStart?: number, lineEnd?: number): Promise<string> {
  try {
    const range = lineStart && lineEnd ? `-L ${lineStart},${lineEnd}` : '';
    return execSync(`git --no-pager blame ${range} ${file}`, { encoding: 'utf-8' });
  } catch (error: any) {
    return `Error: ${error.message}`;
  }
}

export async function ripgrepSearch(pattern: string, searchPath: string = '.', options?: {
  fileType?: string;
  ignoreCase?: boolean;
  contextLines?: number;
}): Promise<string> {
  try {
    let cmd = `rg "${pattern}" ${searchPath}`;
    if (options?.fileType) cmd += ` -t ${options.fileType}`;
    if (options?.ignoreCase) cmd += ' -i';
    if (options?.contextLines) cmd += ` -C ${options.contextLines}`;
    return execSync(cmd, { encoding: 'utf-8' });
  } catch (error: any) {
    try {
      return execSync(`grep -r "${pattern}" ${searchPath}`, { encoding: 'utf-8' });
    } catch {
      return `No matches found for: ${pattern}`;
    }
  }
}

export async function listFilesRg(searchPath: string = '.'): Promise<string> {
  try {
    return execSync(`rg --files ${searchPath}`, { encoding: 'utf-8' });
  } catch (error: any) {
    return execSync(`find ${searchPath} -type f`, { encoding: 'utf-8' });
  }
}

export async function getFileInfo(filePath: string): Promise<any> {
  try {
    const stats = fs.statSync(filePath);
    const ext = path.extname(filePath);
    return {
      path: filePath,
      name: path.basename(filePath),
      directory: path.dirname(filePath),
      extension: ext,
      size: stats.size,
      sizeHuman: formatBytes(stats.size),
      modified: stats.mtime,
      created: stats.birthtime,
      isDirectory: stats.isDirectory(),
      isFile: stats.isFile(),
      permissions: stats.mode.toString(8).slice(-3)
    };
  } catch (error: any) {
    throw new Error(`Cannot get file info: ${error.message}`);
  }
}

export async function createDirectory(dirPath: string, recursive: boolean = true): Promise<string> {
  try {
    fs.mkdirSync(dirPath, { recursive });
    return `Directory created: ${dirPath}`;
  } catch (error: any) {
    throw new Error(`Cannot create directory: ${error.message}`);
  }
}

export async function deleteFile(filePath: string): Promise<string> {
  try {
    fs.unlinkSync(filePath);
    return `File deleted: ${filePath}`;
  } catch (error: any) {
    throw new Error(`Cannot delete file: ${error.message}`);
  }
}

export async function moveFile(source: string, destination: string): Promise<string> {
  try {
    fs.renameSync(source, destination);
    return `Moved: ${source} → ${destination}`;
  } catch (error: any) {
    throw new Error(`Cannot move file: ${error.message}`);
  }
}

export async function copyFile(source: string, destination: string): Promise<string> {
  try {
    fs.copyFileSync(source, destination);
    return `Copied: ${source} → ${destination}`;
  } catch (error: any) {
    throw new Error(`Cannot copy file: ${error.message}`);
  }
}

export async function appendToFile(filePath: string, content: string): Promise<string> {
  try {
    fs.appendFileSync(filePath, content);
    return `Appended to: ${filePath}`;
  } catch (error: any) {
    throw new Error(`Cannot append to file: ${error.message}`);
  }
}

export async function checkDependency(packageName: string): Promise<any> {
  const cwd = process.cwd();
  const packageJsonPath = path.join(cwd, 'package.json');
  
  try {
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      return {
        exists: packageName in deps,
        version: deps[packageName] || null,
        type: packageJson.dependencies?.[packageName] ? 'dependency' : 'devDependency'
      };
    }
    return { exists: false, version: null };
  } catch (error: any) {
    throw new Error(`Cannot check dependency: ${error.message}`);
  }
}

export async function getProjectInfo(): Promise<any> {
  const cwd = process.cwd();
  const info: any = {
    directory: cwd,
    name: path.basename(cwd),
    hasGit: fs.existsSync(path.join(cwd, '.git')),
    hasNodeModules: fs.existsSync(path.join(cwd, 'node_modules')),
    packageManager: null,
    framework: null,
    language: null
  };

  if (fs.existsSync(path.join(cwd, 'package.json'))) {
    const pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf-8'));
    info.packageManager = 'npm';
    info.name = pkg.name || info.name;
    
    if (pkg.dependencies?.react || pkg.devDependencies?.react) info.framework = 'React';
    if (pkg.dependencies?.next || pkg.devDependencies?.next) info.framework = 'Next.js';
    if (pkg.dependencies?.vue || pkg.devDependencies?.vue) info.framework = 'Vue';
    if (pkg.dependencies?.express) info.framework = 'Express';
  }

  if (fs.existsSync(path.join(cwd, 'package-lock.json'))) info.packageManager = 'npm';
  if (fs.existsSync(path.join(cwd, 'yarn.lock'))) info.packageManager = 'yarn';
  if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) info.packageManager = 'pnpm';
  if (fs.existsSync(path.join(cwd, 'requirements.txt'))) info.language = 'Python';
  if (fs.existsSync(path.join(cwd, 'Cargo.toml'))) info.language = 'Rust';
  if (fs.existsSync(path.join(cwd, 'go.mod'))) info.language = 'Go';

  return info;
}

export async function runTests(testCommand?: string): Promise<string> {
  try {
    const cwd = process.cwd();
    let cmd = testCommand;

    if (!cmd && fs.existsSync(path.join(cwd, 'package.json'))) {
      const pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf-8'));
      cmd = pkg.scripts?.test || 'npm test';
    }

    if (!cmd) {
      return 'No test command found. Check package.json or provide command.';
    }

    return execSync(cmd, { encoding: 'utf-8', cwd });
  } catch (error: any) {
    return `Test failed: ${error.message}`;
  }
}

export async function runLint(lintCommand?: string): Promise<string> {
  try {
    const cwd = process.cwd();
    let cmd = lintCommand;

    if (!cmd && fs.existsSync(path.join(cwd, 'package.json'))) {
      const pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf-8'));
      cmd = pkg.scripts?.lint || 'npm run lint';
    }

    if (!cmd) {
      return 'No lint command found. Check package.json or provide command.';
    }

    return execSync(cmd, { encoding: 'utf-8', cwd });
  } catch (error: any) {
    return `Lint failed: ${error.message}`;
  }
}

export async function runTypeCheck(): Promise<string> {
  try {
    const cwd = process.cwd();
    
    if (fs.existsSync(path.join(cwd, 'tsconfig.json'))) {
      return execSync('tsc --noEmit', { encoding: 'utf-8', cwd });
    }

    return 'No TypeScript configuration found.';
  } catch (error: any) {
    return `Type check failed: ${error.message}`;
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
