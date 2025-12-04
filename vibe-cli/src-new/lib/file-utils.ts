/**
 * File Utilities
 * 
 * Helper functions for file system operations
 * 
 * @module lib/file-utils
 */

import fs from 'fs/promises';
import path from 'path';

/**
 * Write content to file
 * Creates directories if they don't exist
 */
export async function writeFile(filepath: string, content: string): Promise<void> {
  const dir = path.dirname(filepath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filepath, content, 'utf-8');
}

/**
 * Read file content
 */
export async function readFile(filepath: string): Promise<string> {
  return await fs.readFile(filepath, 'utf-8');
}

/**
 * Check if file exists
 */
export async function fileExists(filepath: string): Promise<boolean> {
  try {
    await fs.access(filepath);
    return true;
  } catch {
    return false;
  }
}

/**
 * List files in directory
 */
export async function listFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter(entry => entry.isFile())
    .map(entry => entry.name);
}
