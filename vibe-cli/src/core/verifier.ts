import * as fs from 'fs';
import * as path from 'path';
import { executeTool } from '../tools';

export interface VerificationResult {
  success: boolean;
  message: string;
  details?: any;
}

export async function verifyFileCreation(filePath: string): Promise<VerificationResult> {
  const absPath = path.resolve(process.cwd(), filePath);
  
  if (!fs.existsSync(absPath)) {
    return {
      success: false,
      message: `File not found: ${filePath}`
    };
  }
  
  const stats = fs.statSync(absPath);
  return {
    success: true,
    message: `File exists: ${filePath}`,
    details: {
      size: stats.size,
      created: stats.birthtime
    }
  };
}

export async function verifyProjectStructure(projectPath: string, expectedFiles: string[]): Promise<VerificationResult> {
  const missing: string[] = [];
  const found: string[] = [];
  
  for (const file of expectedFiles) {
    const fullPath = path.join(projectPath, file);
    if (fs.existsSync(fullPath)) {
      found.push(file);
    } else {
      missing.push(file);
    }
  }
  
  if (missing.length > 0) {
    return {
      success: false,
      message: `Missing files: ${missing.join(', ')}`,
      details: { found, missing }
    };
  }
  
  return {
    success: true,
    message: `All ${expectedFiles.length} files verified`,
    details: { found }
  };
}

export async function verifyShellCommand(command: string): Promise<VerificationResult> {
  try {
    const result = await executeTool('run_shell_command', { command: `${command} --version 2>&1 || echo "not found"` });
    
    if (typeof result === 'string' && result.includes('not found')) {
      return {
        success: false,
        message: `Command not available: ${command}`
      };
    }
    
    return {
      success: true,
      message: `Command available: ${command}`,
      details: { output: result }
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Command failed: ${error.message}`
    };
  }
}

export async function verifyCodeSyntax(filePath: string): Promise<VerificationResult> {
  const ext = path.extname(filePath);
  
  try {
    if (ext === '.js' || ext === '.ts') {
      // Try to parse with Node
      const result = await executeTool('run_shell_command', {
        command: `node --check ${filePath} 2>&1`
      });
      
      if (typeof result === 'string' && result.includes('SyntaxError')) {
        return {
          success: false,
          message: 'Syntax error detected',
          details: { error: result }
        };
      }
    } else if (ext === '.py') {
      const result = await executeTool('run_shell_command', {
        command: `python -m py_compile ${filePath} 2>&1`
      });
      
      if (typeof result === 'string' && result.includes('SyntaxError')) {
        return {
          success: false,
          message: 'Syntax error detected',
          details: { error: result }
        };
      }
    }
    
    return {
      success: true,
      message: 'Syntax valid'
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Verification failed: ${error.message}`
    };
  }
}
