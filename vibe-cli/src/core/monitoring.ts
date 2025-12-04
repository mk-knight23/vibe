import fs from 'fs';
import path from 'path';
import os from 'os';
import { createHash } from 'crypto';

const AUDIT_DIR = path.join(os.homedir(), '.vibe');
const AUDIT_FILE = path.join(AUDIT_DIR, 'audit.log');

export interface AuditEntry {
  timestamp: string;
  action: string;
  tool: string;
  args: any;
  result?: any;
  error?: any;
  user?: string;
}

export function logAudit(entry: Omit<AuditEntry, 'timestamp'>): void {
  try {
    if (!fs.existsSync(AUDIT_DIR)) {
      fs.mkdirSync(AUDIT_DIR, { recursive: true });
    }

    const fullEntry: AuditEntry = {
      ...entry,
      timestamp: new Date().toISOString()
    };

    fs.appendFileSync(AUDIT_FILE, JSON.stringify(fullEntry) + '\n');
  } catch (error) {
    // Silent fail - don't break execution
  }
}

export function getAuditLog(limit = 100): AuditEntry[] {
  try {
    if (!fs.existsSync(AUDIT_FILE)) return [];
    
    const content = fs.readFileSync(AUDIT_FILE, 'utf-8');
    const lines = content.trim().split('\n').slice(-limit);
    
    return lines.map(line => JSON.parse(line));
  } catch {
    return [];
  }
}

const BACKUP_DIR = path.join(os.homedir(), '.vibe', 'backups');

export function createBackup(filePath: string): string | null {
  try {
    if (!fs.existsSync(filePath)) return null;

    const timestamp = Date.now();
    const backupPath = path.join(BACKUP_DIR, timestamp.toString(), filePath);
    const backupDir = path.dirname(backupPath);

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    fs.copyFileSync(filePath, backupPath);
    return backupPath;
  } catch {
    return null;
  }
}

export function restoreBackup(backupPath: string, targetPath: string): boolean {
  try {
    if (!fs.existsSync(backupPath)) return false;
    
    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.copyFileSync(backupPath, targetPath);
    return true;
  } catch {
    return false;
  }
}

export interface CacheEntry<T> {
  key: string;
  value: T;
  timestamp: number;
  ttl: number;
}

export class CacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL = 3600000; // 1 hour

  set<T>(key: string, value: T, ttl?: number): void {
    this.cache.set(key, {
      key,
      value,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    });
  }

  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return undefined;
    }
    
    return entry.value;
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  hashKey(data: any): string {
    return createHash('sha256').update(JSON.stringify(data)).digest('hex');
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export interface ErrorEntry {
  id: string;
  message: string;
  stack?: string;
  timestamp: number;
  context?: Record<string, any>;
  count: number;
}

export class ErrorTracker {
  private errors: Map<string, ErrorEntry> = new Map();

  track(error: Error, context?: Record<string, any>): string {
    const id = this.generateErrorId(error);
    const existing = this.errors.get(id);

    if (existing) {
      existing.count++;
      existing.timestamp = Date.now();
    } else {
      this.errors.set(id, {
        id,
        message: error.message,
        stack: error.stack,
        timestamp: Date.now(),
        context,
        count: 1
      });
    }

    return id;
  }

  private generateErrorId(error: Error): string {
    const signature = error.message + (error.stack?.split('\n')[1] || '');
    return createHash('md5').update(signature).digest('hex').slice(0, 8);
  }

  getError(id: string): ErrorEntry | undefined {
    return this.errors.get(id);
  }

  getFrequentErrors(limit: number = 10): ErrorEntry[] {
    return Array.from(this.errors.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  getRecentErrors(limit: number = 10): ErrorEntry[] {
    return Array.from(this.errors.values())
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  clear(): void {
    this.errors.clear();
  }
}
export interface Metric {
  name: string;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
}

export class MetricsCollector {
  private metrics: Metric[] = [];
  private timers: Map<string, number> = new Map();

  startTimer(name: string): void {
    this.timers.set(name, Date.now());
  }

  endTimer(name: string, tags?: Record<string, string>): number {
    const start = this.timers.get(name);
    if (!start) return 0;
    
    const duration = Date.now() - start;
    this.record(name, duration, tags);
    this.timers.delete(name);
    return duration;
  }

  record(name: string, value: number, tags?: Record<string, string>): void {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now(),
      tags
    });
  }

  getMetrics(name?: string): Metric[] {
    if (name) return this.metrics.filter(m => m.name === name);
    return this.metrics;
  }

  getAverage(name: string): number {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return 0;
    return metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;
  }

  clear(): void {
    this.metrics = [];
    this.timers.clear();
  }
}
export interface Plugin {
  name: string;
  version: string;
  activate: (context: PluginContext) => Promise<void>;
  deactivate?: () => Promise<void>;
}

export interface PluginContext {
  registerCommand: (name: string, handler: Function) => void;
  registerProvider: (name: string, provider: any) => void;
  config: any;
}

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private activePlugins: Set<string> = new Set();

  async loadPlugin(plugin: Plugin): Promise<void> {
    this.plugins.set(plugin.name, plugin);
  }

  async activatePlugin(name: string, context: PluginContext): Promise<void> {
    const plugin = this.plugins.get(name);
    if (!plugin) throw new Error(`Plugin ${name} not found`);
    await plugin.activate(context);
    this.activePlugins.add(name);
  }

  async deactivatePlugin(name: string): Promise<void> {
    const plugin = this.plugins.get(name);
    if (plugin?.deactivate) await plugin.deactivate();
    this.activePlugins.delete(name);
  }

  getActivePlugins(): string[] {
    return Array.from(this.activePlugins);
  }
}
