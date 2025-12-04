/**
 * Chat Command Handler
 * 
 * Handles the /chat command for AI conversations
 * 
 * @module commands/chat-command
 */

import { chat } from '../features/chat';
import { logger } from '../lib/logger';

/**
 * Execute chat command
 * @param args - Command arguments (message parts)
 */
export async function chatCommand(args: string[]): Promise<void> {
  if (args.length === 0) {
    logger.error('Usage: chat <message>');
    return;
  }
  
  // Join all arguments into a single message
  const message = args.join(' ');
  
  // Send to chat feature
  await chat(message);
}
