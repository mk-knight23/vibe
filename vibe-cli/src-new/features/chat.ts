/**
 * Chat Feature
 * 
 * Handles AI chat conversations with context management
 * and streaming responses
 * 
 * @module features/chat
 */

import pc from 'picocolors';
import { APIClient } from '../api/client';
import { Message } from '../types';
import { logger } from '../lib/logger';

// Conversation history (in-memory for now)
const conversationHistory: Message[] = [];

// API client instance
const client = new APIClient();

/**
 * Chat with AI assistant
 * @param userMessage - User's message
 */
export async function chat(userMessage: string): Promise<void> {
  // Add user message to history
  conversationHistory.push({
    role: 'user',
    content: userMessage,
    timestamp: Date.now()
  });
  
  try {
    // Show loading indicator
    process.stdout.write(pc.dim('AI: '));
    
    let response = '';
    
    // Stream response token by token
    await client.streamChat(conversationHistory, (token) => {
      response += token;
      process.stdout.write(token);
    });
    
    // New line after response
    console.log('\n');
    
    // Add AI response to history
    conversationHistory.push({
      role: 'assistant',
      content: response,
      timestamp: Date.now()
    });
    
  } catch (error) {
    logger.error('Chat failed:', error);
  }
}

/**
 * Clear conversation history
 */
export function clearHistory(): void {
  conversationHistory.length = 0;
  logger.success('Conversation history cleared');
}

/**
 * Get conversation history
 */
export function getHistory(): Message[] {
  return [...conversationHistory];
}
