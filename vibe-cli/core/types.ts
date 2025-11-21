/**
 * Centralized type definitions for the CLI
 */

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | {
    type: string;
    text?: string;
    image_url?: { url: string };
  }[];
}

export interface ChatCompletionArgs {
  apiKey?: string;
  model?: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  thinking?: boolean;
  taskType?: TaskType;
  prompt?: string;
}

export interface ChatCompletionResult {
  model: string;
  message: Record<string, unknown>;
  data: any;
}

export type TaskType =
  | 'code-generation'
  | 'chat'
  | 'debug'
  | 'long-context'
  | 'refactor'
  | 'test-generation'
  | 'completion'
  | 'multi-edit'
  | 'git-analysis'
  | 'code-review'
  | 'agent';

export interface OpenRouterConfig {
  openrouter?: {
    apiKey?: string;
    defaultModel?: string;
    topFreeModels?: FreeModel[];
  };
  [key: string]: any;
}

export interface FreeModel {
  id: string;
  ctx?: number;
  note?: string;
}