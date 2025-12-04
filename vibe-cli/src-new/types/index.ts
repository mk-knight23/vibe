/**
 * Type Definitions
 * 
 * Central location for all TypeScript types and interfaces
 * used throughout the application.
 * 
 * @module types
 */

/**
 * User configuration structure
 */
export interface Config {
  provider: 'openrouter' | 'megallm' | 'agentrouter' | 'routeway';
  model: string;
  apiKey: string;
  temperature: number;
  maxTokens: number;
}

/**
 * AI chat message
 */
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

/**
 * API response from AI providers
 */
export interface AIResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Command definition
 */
export interface Command {
  name: string;
  description: string;
  aliases?: string[];
  execute: (args: string[]) => Promise<void>;
}

/**
 * Shell execution result
 */
export interface ShellResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  error?: string;
}

/**
 * File operation result
 */
export interface FileOperation {
  path: string;
  action: 'create' | 'update' | 'delete';
  success: boolean;
  error?: string;
}

/**
 * Project template
 */
export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  files: Record<string, string>;
}
