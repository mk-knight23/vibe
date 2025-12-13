/**
 * Inline Debugging Loop Module
 *
 * Intelligent error detection, investigation, and automatic fixing.
 * Creates a debugging loop that analyzes errors, researches solutions, and applies fixes.
 *
 * @module core/debugger
 */

import { executeTool } from '../tools';
import { TerminalRenderer } from '../utils/terminal-renderer';
import { MemoryManager } from './memory';
import { ApiClient } from './api';

export interface DebugContext {
  error: Error;
  context: string;
  filePath?: string;
  lineNumber?: number;
  codeSnippet?: string;
  stackTrace?: string;
  environment: {
    nodeVersion?: string;
    npmVersion?: string;
    os: string;
    cwd: string;
  };
}

export interface FixAttempt {
  id: string;
  description: string;
  changes: Array<{
    file: string;
    operation: 'replace' | 'insert' | 'delete';
    content: string;
    oldContent?: string;
  }>;
  reasoning: string;
  confidence: number; // 0-1
  applied: boolean;
  successful?: boolean;
}

export interface DebugResult {
  rootCause: string;
  solution: string;
  fixes: FixAttempt[];
  verified: boolean;
  duration: number;
}

export class InlineDebugger {
  private renderer: TerminalRenderer;
  private memory: MemoryManager;
  private client: ApiClient;

  constructor(renderer: TerminalRenderer, memory: MemoryManager, client: ApiClient) {
    this.renderer = renderer;
    this.memory = memory;
    this.client = client;
  }

  /**
   * Main debugging loop - detect, investigate, fix
   */
  async debugAndFix(error: Error, context?: any): Promise<DebugResult> {
    const startTime = Date.now();
    this.renderer.setState('verifying', 'Analyzing error and finding solution...');

    // Create debug context
    const debugContext = await this.createDebugContext(error, context);

    // Analyze error and find root cause
    const rootCause = await this.analyzeError(debugContext);

    // Research and generate solutions
    const solutions = await this.researchSolutions(debugContext, rootCause);

    // Generate and attempt fixes
    const fixes = await this.generateAndApplyFixes(debugContext, solutions);

    // Verify fixes
    const verified = await this.verifyFixes(fixes, debugContext);

    const duration = Date.now() - startTime;

    return {
      rootCause,
      solution: solutions[0] || 'No solution found',
      fixes,
      verified,
      duration
    };
  }

  /**
   * Create comprehensive debug context
   */
  private async createDebugContext(error: Error, context?: any): Promise<DebugContext> {
    // Extract file path and line number from stack trace
    const stackLines = error.stack?.split('\n') || [];
    let filePath: string | undefined;
    let lineNumber: number | undefined;

    for (const line of stackLines) {
      const match = line.match(/at\s+.*?\((.*?):(\d+):\d+\)/) || line.match(/(.*?):(\d+):\d+/);
      if (match) {
        filePath = match[1];
        lineNumber = parseInt(match[2]);
        break;
      }
    }

    // Get code snippet around error
    let codeSnippet: string | undefined;
    if (filePath && lineNumber) {
      try {
        const content = await executeTool('read_file', { path: filePath });
        const lines = content.split('\n');
        const start = Math.max(0, lineNumber - 5);
        const end = Math.min(lines.length, lineNumber + 5);
        codeSnippet = lines.slice(start, end).join('\n');
      } catch (e) {
        // Ignore file read errors
      }
    }

    // Get environment info
    const environment: DebugContext['environment'] = {
      os: process.platform,
      cwd: process.cwd()
    };

    try {
      const nodeVersion = await executeTool('run_shell_command', {
        command: 'node --version',
        description: 'Get Node.js version'
      });
      environment.nodeVersion = nodeVersion.trim();
    } catch (e) {}

    try {
      const npmVersion = await executeTool('run_shell_command', {
        command: 'npm --version',
        description: 'Get npm version'
      });
      environment.npmVersion = npmVersion.trim();
    } catch (e) {}

    return {
      error,
      context: context || 'Unknown context',
      filePath,
      lineNumber,
      codeSnippet,
      stackTrace: error.stack,
      environment
    };
  }

  /**
   * Analyze error to find root cause
   */
  private async analyzeError(debugContext: DebugContext): Promise<string> {
    this.renderer.status('Analyzing error patterns...', 'info');

    const errorMessage = debugContext.error.message.toLowerCase();
    const errorName = debugContext.error.name.toLowerCase();

    // Common error patterns and their root causes
    const errorPatterns = {
      'cannot find module': 'Missing dependency or incorrect import path',
      'syntaxerror': 'JavaScript/TypeScript syntax error',
      'referenceerror': 'Undefined variable or function reference',
      'typeerror': 'Incorrect type usage or null/undefined access',
      'enoent': 'File or directory not found',
      'eacces': 'Permission denied',
      'enospc': 'No space left on device',
      'network': 'Network connectivity issue',
      'timeout': 'Operation timed out',
      'memory': 'Out of memory error',
      'compilation': 'Build/compilation failure'
    };

    // Check for known patterns
    for (const [pattern, cause] of Object.entries(errorPatterns)) {
      if (errorMessage.includes(pattern) || errorName.includes(pattern)) {
        return cause;
      }
    }

    // Use AI to analyze complex errors
    try {
      const analysis = await this.client.chat([{
        role: 'user',
        content: `Analyze this error and provide the root cause:

Error: ${debugContext.error.message}
Stack: ${debugContext.stackTrace?.substring(0, 500)}

Context: ${debugContext.context}
File: ${debugContext.filePath}:${debugContext.lineNumber}

Provide a concise root cause analysis.`
      }], 'qwen/qwen3-next-80b-a3b-instruct', {
        temperature: 0.3,
        maxTokens: 200
      });

      const aiAnalysis = analysis.choices?.[0]?.message?.content || 'Unknown error';
      return aiAnalysis.replace(/^root cause:?\s*/i, '').trim();
    } catch (e) {
      return 'Unable to determine root cause - complex error requiring manual investigation';
    }
  }

  /**
   * Research solutions for the error
   */
  private async researchSolutions(debugContext: DebugContext, rootCause: string): Promise<string[]> {
    this.renderer.status('Researching solutions...', 'info');

    const solutions: string[] = [];

    // Check memory for similar past errors
    const similarErrors = this.memory.searchChatHistory(`error ${debugContext.error.message.substring(0, 50)}`);
    if (similarErrors.length > 0) {
      const pastSolution = similarErrors[0].content;
      if (pastSolution.includes('fixed') || pastSolution.includes('solution')) {
        solutions.push(`Based on past experience: ${pastSolution}`);
      }
    }

    // Generate solutions based on error type
    const errorType = this.categorizeError(debugContext.error);

    switch (errorType) {
      case 'import':
        solutions.push('Check import paths and file extensions');
        solutions.push('Verify package.json dependencies');
        solutions.push('Ensure correct relative path syntax');
        break;

      case 'syntax':
        solutions.push('Check for missing semicolons, brackets, or quotes');
        solutions.push('Verify variable declarations and scope');
        solutions.push('Check for TypeScript type errors');
        break;

      case 'runtime':
        solutions.push('Add null/undefined checks');
        solutions.push('Verify API responses and data structures');
        solutions.push('Check async/await usage');
        break;

      case 'dependency':
        solutions.push('Run npm install or yarn install');
        solutions.push('Check package versions and compatibility');
        solutions.push('Clear node_modules and reinstall');
        break;

      case 'permission':
        solutions.push('Check file permissions');
        solutions.push('Run with appropriate user privileges');
        solutions.push('Verify directory access rights');
        break;
    }

    // Use AI for complex solutions
    if (solutions.length < 3) {
      try {
        const aiSolutions = await this.client.chat([{
          role: 'user',
          content: `Provide 3 specific solutions for this error:

Error: ${debugContext.error.message}
Root Cause: ${rootCause}
File: ${debugContext.filePath}

Provide actionable solutions, not general advice.`
        }], 'qwen/qwen3-next-80b-a3b-instruct', {
          temperature: 0.4,
          maxTokens: 300
        });

        const aiResponse = aiSolutions.choices?.[0]?.message?.content || '';
        const additionalSolutions = aiResponse.split('\n')
          .filter((line: string) => line.trim().length > 10)
          .slice(0, 3);

        solutions.push(...additionalSolutions);
      } catch (e) {
        solutions.push('Manual investigation required');
      }
    }

    return solutions.slice(0, 5); // Limit to 5 solutions
  }

  /**
   * Generate and apply fixes automatically
   */
  private async generateAndApplyFixes(
    debugContext: DebugContext,
    solutions: string[]
  ): Promise<FixAttempt[]> {
    const fixes: FixAttempt[] = [];

    for (let i = 0; i < Math.min(solutions.length, 3); i++) {
      const solution = solutions[i];
      const fix = await this.generateFix(debugContext, solution, i);

      if (fix.confidence > 0.3) { // Only apply confident fixes
        this.renderer.status(`Attempting fix: ${fix.description}`, 'info');

        try {
          const success = await this.applyFix(fix);
          fix.applied = true;
          fix.successful = success;

          if (success) {
            this.renderer.status(`Fix applied successfully`, 'success');
            break; // Stop after first successful fix
          } else {
            this.renderer.status(`Fix failed, trying next solution`, 'warning');
          }
        } catch (error: any) {
          fix.applied = true;
          fix.successful = false;
          this.renderer.status(`Fix error: ${error.message}`, 'error');
        }
      }

      fixes.push(fix);
    }

    return fixes;
  }

  /**
   * Generate a specific fix for an error
   */
  private async generateFix(
    debugContext: DebugContext,
    solution: string,
    index: number
  ): Promise<FixAttempt> {
    const fixId = `fix_${Date.now()}_${index}`;

    // Generate fix based on error type and solution
    const changes = await this.generateChanges(debugContext, solution);

    return {
      id: fixId,
      description: solution,
      changes,
      reasoning: `Applying solution: ${solution}`,
      confidence: this.calculateConfidence(debugContext, solution, changes),
      applied: false
    };
  }

  /**
   * Generate specific code changes for a fix
   */
  private async generateChanges(
    debugContext: DebugContext,
    solution: string
  ): Promise<FixAttempt['changes']> {
    const changes: FixAttempt['changes'] = [];

    if (!debugContext.filePath || !debugContext.codeSnippet) {
      return changes;
    }

    // Use AI to generate specific code changes
    try {
      const fixRequest = await this.client.chat([{
        role: 'user',
        content: `Generate a specific code fix for this error:

Error: ${debugContext.error.message}
Solution: ${solution}
File: ${debugContext.filePath}
Code around error:
${debugContext.codeSnippet}

Provide the exact code change needed. Format as:
OLD_CODE
NEW_CODE

Only provide the code, no explanations.`
      }], 'qwen/qwen3-next-80b-a3b-instruct', {
        temperature: 0.2,
        maxTokens: 200
      });

      const response = fixRequest.choices?.[0]?.message?.content || '';
      const parts = response.split('\n---\n');

      if (parts.length >= 2) {
        const oldCode = parts[0].trim();
        const newCode = parts[1].trim();

        changes.push({
          file: debugContext.filePath,
          operation: 'replace',
          content: newCode,
          oldContent: oldCode
        });
      }
    } catch (e) {
      // Fallback to simple fixes
      changes.push(...this.generateSimpleFixes(debugContext, solution));
    }

    return changes;
  }

  /**
   * Generate simple fixes for common issues
   */
  private generateSimpleFixes(
    debugContext: DebugContext,
    solution: string
  ): FixAttempt['changes'] {
    const changes: FixAttempt['changes'] = [];

    if (!debugContext.filePath) return changes;

    const errorMessage = debugContext.error.message.toLowerCase();

    // Missing import fixes
    if (errorMessage.includes('cannot find module') && solution.includes('import')) {
      const moduleMatch = errorMessage.match(/cannot find module ['"](.+?)['"]/i);
      if (moduleMatch) {
        const moduleName = moduleMatch[1];
        const importStatement = `import ${moduleName} from '${moduleName}';`;

        changes.push({
          file: debugContext.filePath,
          operation: 'insert',
          content: importStatement
        });
      }
    }

    // Missing semicolon fixes
    if (errorMessage.includes('missing semicolon') && debugContext.codeSnippet) {
      const lines = debugContext.codeSnippet.split('\n');
      const errorLine = debugContext.lineNumber ? lines[debugContext.lineNumber - 1] : '';

      if (errorLine && !errorLine.trim().endsWith(';') && !errorLine.trim().endsWith('{') && !errorLine.trim().endsWith('}')) {
        changes.push({
          file: debugContext.filePath,
          operation: 'replace',
          content: errorLine + ';',
          oldContent: errorLine
        });
      }
    }

    return changes;
  }

  /**
   * Apply a fix to the codebase
   */
  private async applyFix(fix: FixAttempt): Promise<boolean> {
    for (const change of fix.changes) {
      try {
        if (change.operation === 'replace' && change.oldContent && change.content) {
          await executeTool('replace', {
            file_path: change.file,
            old_string: change.oldContent,
            new_string: change.content
          });
        } else if (change.operation === 'insert' && change.content) {
          // For inserts, append to file (simplified)
          const currentContent = await executeTool('read_file', { path: change.file });
          await executeTool('write_file', {
            file_path: change.file,
            content: currentContent + '\n' + change.content
          });
        }

        this.memory.onFileWrite(change.file, change.content);
      } catch (error: any) {
        this.memory.onError(`Fix application failed: ${error.message}`);
        return false;
      }
    }

    return true;
  }

  /**
   * Verify that fixes resolved the error
   */
  private async verifyFixes(fixes: FixAttempt[], debugContext: DebugContext): Promise<boolean> {
    this.renderer.setState('verifying', 'Verifying fixes...');

    // Run tests or linting to verify
    try {
      if (debugContext.filePath?.endsWith('.js') || debugContext.filePath?.endsWith('.ts')) {
        // Try to run the file or related tests
        const testResult = await executeTool('run_tests', {});
        return testResult.includes('pass') || testResult.includes('success');
      }

      // Run linting
      const lintResult = await executeTool('run_lint', {});
      return !lintResult.includes('error') && !lintResult.includes('fail');
    } catch (e) {
      // If verification fails, assume fixes are not verified
      return false;
    }
  }

  /**
   * Categorize error type
   */
  private categorizeError(error: Error): string {
    const message = error.message.toLowerCase();
    const name = error.name.toLowerCase();

    if (message.includes('cannot find module') || message.includes('module not found')) {
      return 'import';
    }
    if (name.includes('syntax') || message.includes('unexpected token')) {
      return 'syntax';
    }
    if (name.includes('type') || name.includes('reference')) {
      return 'runtime';
    }
    if (message.includes('enoent') || message.includes('not found')) {
      return 'dependency';
    }
    if (message.includes('eacces') || message.includes('permission')) {
      return 'permission';
    }

    return 'unknown';
  }

  /**
   * Calculate confidence score for a fix
   */
  private calculateConfidence(
    debugContext: DebugContext,
    solution: string,
    changes: FixAttempt['changes']
  ): number {
    let confidence = 0.5; // Base confidence

    // Increase confidence for simple, targeted fixes
    if (changes.length === 1) confidence += 0.2;

    // Increase for syntax errors with clear fixes
    if (debugContext.error.name === 'SyntaxError' && solution.includes('semicolon')) {
      confidence += 0.3;
    }

    // Increase for import errors with import fixes
    if (debugContext.error.message.includes('Cannot find module') && solution.includes('import')) {
      confidence += 0.3;
    }

    // Decrease for complex changes
    if (changes.length > 3) confidence -= 0.2;

    return Math.max(0, Math.min(1, confidence));
  }
}

/**
 * Convenience function for debugging and fixing errors
 */
export async function debugAndFix(
  error: Error,
  renderer: TerminalRenderer,
  memory: MemoryManager,
  client: ApiClient,
  context?: any
): Promise<DebugResult> {
  const debuggerInstance = new InlineDebugger(renderer, memory, client);
  return debuggerInstance.debugAndFix(error, context);
}
