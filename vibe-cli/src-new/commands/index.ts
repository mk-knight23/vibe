/**
 * Command Registry and Router
 * 
 * Central registry for all CLI commands.
 * Routes command execution to appropriate handlers.
 * 
 * @module commands
 */

import pc from 'picocolors';
import { Command } from '../types';
import { logger } from '../lib/logger';

// Import command handlers
import { chatCommand } from './chat-command';
import { codeCommand } from './code-command';
import { analyzeCommand } from './analyze-command';
import { deployCommand } from './deploy-command';
import { templateCommand } from './template-command';
import { configCommand } from './config-command';

/**
 * All available commands
 */
const commands: Command[] = [
  {
    name: 'chat',
    description: 'Chat with AI assistant',
    aliases: ['c'],
    execute: chatCommand
  },
  {
    name: 'code',
    description: 'Generate code with AI',
    aliases: ['gen', 'generate'],
    execute: codeCommand
  },
  {
    name: 'analyze',
    description: 'Analyze project structure',
    aliases: ['scan'],
    execute: analyzeCommand
  },
  {
    name: 'deploy',
    description: 'Deploy to cloud provider',
    aliases: ['d'],
    execute: deployCommand
  },
  {
    name: 'template',
    description: 'Create project from template',
    aliases: ['t', 'create'],
    execute: templateCommand
  },
  {
    name: 'config',
    description: 'Manage configuration',
    aliases: ['cfg'],
    execute: configCommand
  }
];

/**
 * Execute a command by name
 * @param name - Command name or alias
 * @param args - Command arguments
 */
export async function executeCommand(name: string, args: string[]): Promise<void> {
  // Find command by name or alias
  const command = commands.find(cmd => 
    cmd.name === name || cmd.aliases?.includes(name)
  );
  
  if (!command) {
    logger.error(`Unknown command: ${name}`);
    console.log(pc.dim('Type /help for available commands'));
    return;
  }
  
  try {
    await command.execute(args);
  } catch (error) {
    logger.error(`Command failed: ${error}`);
  }
}

/**
 * Get all registered commands
 */
export function getAllCommands(): Command[] {
  return [...commands];
}

/**
 * Find command by name
 */
export function findCommand(name: string): Command | undefined {
  return commands.find(cmd => 
    cmd.name === name || cmd.aliases?.includes(name)
  );
}
