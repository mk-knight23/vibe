import { promises as fs } from 'fs';
import { resolve, dirname } from 'path';

export class FileManager {
  private safetyBoundaries: string[];

  constructor(projectRoot: string = process.cwd()) {
    this.safetyBoundaries = [resolve(projectRoot)];
  }

  async readFile(filePath: string): Promise<string> {
    this.validatePath(filePath);
    return await fs.readFile(filePath, 'utf-8');
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    this.validatePath(filePath);
    await this.atomicWrite(filePath, content);
  }

  async deleteFile(filePath: string): Promise<void> {
    this.validatePath(filePath);
    await fs.unlink(filePath);
  }

  async createDirectory(dirPath: string): Promise<void> {
    this.validatePath(dirPath);
    await fs.mkdir(dirPath, { recursive: true });
  }

  private async atomicWrite(filePath: string, content: string): Promise<void> {
    const tempPath = `${filePath}.tmp`;
    try {
      await fs.mkdir(dirname(filePath), { recursive: true });
      await fs.writeFile(tempPath, content, 'utf-8');
      await fs.rename(tempPath, filePath);
    } catch (error) {
      await fs.unlink(tempPath).catch(() => {});
      throw error;
    }
  }

  private validatePath(filePath: string): void {
    const resolved = resolve(filePath);
    if (!this.safetyBoundaries.some(b => resolved.startsWith(b))) {
      throw new Error(`Path outside project boundary: ${resolved}`);
    }
  }
}
