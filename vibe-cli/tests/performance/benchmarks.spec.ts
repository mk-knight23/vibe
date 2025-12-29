import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const TEST_DIR = path.join(process.cwd(), 'test-temp');

describe('Performance Benchmarks', () => {
  // Cleanup after all tests
  afterAll(() => {
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true, force: true });
    }
  });

  describe('File Operations', () => {
    it('Create: <100ms', () => {
      if (!fs.existsSync(TEST_DIR)) {
        fs.mkdirSync(TEST_DIR, { recursive: true });
      }
      
      const start = Date.now();
      const file = path.join(TEST_DIR, 'bench-create.txt');
      fs.writeFileSync(file, 'test content');
      const duration = Date.now() - start;
      
      fs.unlinkSync(file);
      expect(duration).toBeLessThan(100);
    });

    it('Read: <50ms', () => {
      if (!fs.existsSync(TEST_DIR)) {
        fs.mkdirSync(TEST_DIR, { recursive: true });
      }
      
      const file = path.join(TEST_DIR, 'bench-read.txt');
      fs.writeFileSync(file, 'test content');
      
      const start = Date.now();
      fs.readFileSync(file, 'utf-8');
      const duration = Date.now() - start;
      
      fs.unlinkSync(file);
      expect(duration).toBeLessThan(50);
    });

    it('Update: <100ms', () => {
      if (!fs.existsSync(TEST_DIR)) {
        fs.mkdirSync(TEST_DIR, { recursive: true });
      }
      
      const file = path.join(TEST_DIR, 'bench-update.txt');
      fs.writeFileSync(file, 'old');
      
      const start = Date.now();
      fs.writeFileSync(file, 'new');
      const duration = Date.now() - start;
      
      fs.unlinkSync(file);
      expect(duration).toBeLessThan(100);
    });

    it('Delete: <50ms', () => {
      if (!fs.existsSync(TEST_DIR)) {
        fs.mkdirSync(TEST_DIR, { recursive: true });
      }
      
      const file = path.join(TEST_DIR, 'bench-delete.txt');
      fs.writeFileSync(file, 'test');
      
      const start = Date.now();
      fs.unlinkSync(file);
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(50);
    });
  });

  describe('Batch Operations', () => {
    it('Create 10 files: <500ms', () => {
      if (!fs.existsSync(TEST_DIR)) {
        fs.mkdirSync(TEST_DIR, { recursive: true });
      }
      
      const start = Date.now();
      for (let i = 0; i < 10; i++) {
        const file = path.join(TEST_DIR, `batch-${i}.txt`);
        fs.writeFileSync(file, `content ${i}`);
      }
      const duration = Date.now() - start;
      
      for (let i = 0; i < 10; i++) {
        fs.unlinkSync(path.join(TEST_DIR, `batch-${i}.txt`));
      }
      
      expect(duration).toBeLessThan(500);
    });
  });

  describe('Memory Usage', () => {
    it('should stay under 128MB', () => {
      const used = process.memoryUsage().heapUsed;
      const limit = 128 * 1024 * 1024;
      expect(used).toBeLessThan(limit);
    });
  });

  describe('Cold Start', () => {
    it('module import should be fast (<500ms)', async () => {
      const start = Date.now();
      await import('../../src/tools');
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(500);
    });
  });

  describe('Large File Handling', () => {
    it('should handle 1MB file read in <200ms', () => {
      if (!fs.existsSync(TEST_DIR)) {
        fs.mkdirSync(TEST_DIR, { recursive: true });
      }
      
      const file = path.join(TEST_DIR, 'large-file.txt');
      const content = 'x'.repeat(1024 * 1024); // 1MB
      fs.writeFileSync(file, content);
      
      const start = Date.now();
      fs.readFileSync(file, 'utf-8');
      const duration = Date.now() - start;
      
      fs.unlinkSync(file);
      expect(duration).toBeLessThan(200);
    });
  });

  describe('JSON Parsing', () => {
    it('should parse large JSON in <100ms', () => {
      const largeObj = { items: Array(10000).fill({ id: 1, name: 'test', value: 123 }) };
      const json = JSON.stringify(largeObj);
      
      const start = Date.now();
      JSON.parse(json);
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(100);
    });
  });
});
