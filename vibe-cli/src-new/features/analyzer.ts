/**
 * Project Analyzer
 * Analyzes project structure and metrics
 * @module features/analyzer
 */

import { readFile, listFiles } from '../lib/file-utils';
import fs from 'fs/promises';
import path from 'path';

export interface ProjectAnalysis {
  fileCount: number;
  totalLines: number;
  languages: Record<string, number>;
  dependencies: string[];
}

export async function analyzeProject(dir: string): Promise<ProjectAnalysis> {
  const files = await getAllFiles(dir);
  
  let totalLines = 0;
  const languages: Record<string, number> = {};
  
  for (const file of files) {
    const ext = path.extname(file);
    languages[ext] = (languages[ext] || 0) + 1;
    
    try {
      const content = await readFile(file);
      totalLines += content.split('\n').length;
    } catch {}
  }
  
  // Read dependencies from package.json
  let dependencies: string[] = [];
  try {
    const pkg = JSON.parse(await readFile(path.join(dir, 'package.json')));
    dependencies = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
  } catch {}
  
  return {
    fileCount: files.length,
    totalLines,
    languages,
    dependencies
  };
}

async function getAllFiles(dir: string, files: string[] = []): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      await getAllFiles(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }
  
  return files;
}
