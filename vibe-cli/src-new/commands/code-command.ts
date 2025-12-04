/**
 * Code Generation Command
 * 
 * Generates code based on natural language descriptions
 * 
 * @module commands/code-command
 */

import { APIClient } from '../api/client';
import { logger } from '../lib/logger';
import { writeFile } from '../lib/file-utils';

const client = new APIClient();

/**
 * Execute code generation command
 * @param args - Task description
 */
export async function codeCommand(args: string[]): Promise<void> {
  if (args.length === 0) {
    logger.error('Usage: code <task description>');
    return;
  }
  
  const task = args.join(' ');
  
  logger.info('Generating code...');
  
  // Create prompt for code generation
  const prompt = `Generate clean, production-ready code for: ${task}

Requirements:
- Include comments
- Follow best practices
- Add error handling
- Make it modular

Provide only the code, no explanations.`;
  
  try {
    const response = await client.chat([
      { role: 'system', content: 'You are an expert programmer.' },
      { role: 'user', content: prompt }
    ]);
    
    console.log('\n' + response + '\n');
    
    // Ask if user wants to save
    const { default: inquirer } = await import('inquirer');
    const { save } = await inquirer.prompt([{
      type: 'confirm',
      name: 'save',
      message: 'Save to file?',
      default: false
    }]);
    
    if (save) {
      const { filename } = await inquirer.prompt([{
        type: 'input',
        name: 'filename',
        message: 'Filename:',
        default: 'generated-code.ts'
      }]);
      
      await writeFile(filename, response);
      logger.success(`Saved to ${filename}`);
    }
    
  } catch (error) {
    logger.error('Code generation failed:', error);
  }
}
