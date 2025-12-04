/**
 * CLI Orchestrator
 * 
 * Manages the main CLI flow, command routing, and user interaction.
 * Handles both interactive mode and direct command execution.
 * 
 * @module cli
 */

import inquirer from 'inquirer';
import pc from 'picocolors';
import { getConfig } from './config';
import { executeCommand } from './commands';
import { logger } from './lib/logger';

/**
 * Start the CLI application
 * Determines whether to run in interactive mode or execute a single command
 */
export async function startCLI(): Promise<void> {
  const args = process.argv.slice(2);
  
  // Handle version flag
  if (args.includes('--version') || args.includes('-v')) {
    console.log('VIBE v7.0.0');
    return;
  }
  
  // Handle help flag
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }
  
  // If command provided, execute it directly
  if (args.length > 0) {
    await executeCommand(args[0], args.slice(1));
    return;
  }
  
  // Otherwise, start interactive mode
  await startInteractiveMode();
}

/**
 * Interactive mode - Main conversation loop
 * Allows users to chat with AI and execute commands
 */
async function startInteractiveMode(): Promise<void> {
  const config = getConfig();
  
  logger.box('VIBE CLI v7.0.0', 'AI Development Assistant');
  console.log(pc.dim(`Provider: ${config.provider} | Model: ${config.model}\n`));
  
  while (true) {
    const { input } = await inquirer.prompt([{
      type: 'input',
      name: 'input',
      message: pc.cyan('You:'),
      prefix: ''
    }]);
    
    // Exit commands
    if (input === '/quit' || input === '/exit') {
      console.log(pc.green('Goodbye!'));
      break;
    }
    
    // Command execution (starts with /)
    if (input.startsWith('/')) {
      const parts = input.slice(1).split(' ');
      await executeCommand(parts[0], parts.slice(1));
      continue;
    }
    
    // AI chat (handled by chat feature)
    const { chat } = await import('./features/chat');
    await chat(input);
  }
}

/**
 * Display help information
 */
function showHelp(): void {
  console.log(`
${pc.bold('VIBE CLI v7.0.0')} - AI Development Assistant

${pc.bold('Usage:')}
  vibe                    Start interactive mode
  vibe [command] [args]   Execute a command
  vibe --help            Show this help
  vibe --version         Show version

${pc.bold('Commands:')}
  chat <message>         Chat with AI
  code <task>           Generate code
  analyze               Analyze project
  deploy <provider>     Deploy to cloud
  template <name>       Create from template
  
${pc.bold('Interactive Commands:')}
  /quit, /exit          Exit the CLI
  /help                 Show help
  /config               Show configuration
  
${pc.bold('Documentation:')}
  https://github.com/mk-knight23/vibe
`);
}
