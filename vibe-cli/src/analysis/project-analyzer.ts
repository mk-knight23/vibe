import { promises as fs } from 'fs';
import { join, extname } from 'path';
import fg from 'fast-glob';

export interface ProjectStructure {
  files: FileInfo[];
  languages: Map<string, number>;
  totalLines: number;
  dependencies: string[];
}

export interface FileInfo {
  path: string;
  language: string;
  size: number;
  lines: number;
}

export class ProjectAnalyzer {
  constructor(private projectRoot: string) {}

  async analyzeProject(): Promise<ProjectStructure> {
    const files = await this.scanFiles();
    const fileInfos = await Promise.all(files.map(f => this.analyzeFile(f)));
    
    const languages = new Map<string, number>();
    let totalLines = 0;

    fileInfos.forEach(info => {
      languages.set(info.language, (languages.get(info.language) || 0) + 1);
      totalLines += info.lines;
    });

    const dependencies = await this.extractDependencies();

    return { files: fileInfos, languages, totalLines, dependencies };
  }

  private async scanFiles(): Promise<string[]> {
    return await fg(['**/*.{ts,js,tsx,jsx,py,java,go,rs,cpp,c}'], {
      cwd: this.projectRoot,
      ignore: ['node_modules/**', 'dist/**', 'build/**', '.git/**'],
      absolute: true
    });
  }

  private async analyzeFile(filePath: string): Promise<FileInfo> {
    const content = await fs.readFile(filePath, 'utf-8');
    const stats = await fs.stat(filePath);
    
    return {
      path: filePath,
      language: this.detectLanguage(filePath),
      size: stats.size,
      lines: content.split('\n').length
    };
  }

  private detectLanguage(filePath: string): string {
    const ext = extname(filePath);
    const langMap: Record<string, string> = {
      '.ts': 'TypeScript', '.tsx': 'TypeScript',
      '.js': 'JavaScript', '.jsx': 'JavaScript',
      '.py': 'Python', '.java': 'Java',
      '.go': 'Go', '.rs': 'Rust',
      '.cpp': 'C++', '.c': 'C'
    };
    return langMap[ext] || 'Unknown';
  }

  private async extractDependencies(): Promise<string[]> {
    try {
      const pkgPath = join(this.projectRoot, 'package.json');
      const content = await fs.readFile(pkgPath, 'utf-8');
      const pkg = JSON.parse(content);
      return Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
    } catch {
      return [];
    }
  }
}
