/**
 * API Client Module
 * 
 * Provides a unified interface for interacting with multiple AI providers.
 * Supports OpenRouter, MegaLLM, AgentRouter, and Routeway with automatic
 * provider switching and model management.
 * 
 * @module core/api
 */

import {
  openRouterChat,
  megaLLMChat,
  agentRouterChat,
  routewayChat,
  fetchOpenRouterModels,
  fetchMegaLLMModels,
  fetchAgentRouterModels,
  fetchRoutewayModels
} from '../providers';

/** Supported AI provider types */
export type ProviderType = 'openrouter' | 'megallm' | 'agentrouter' | 'routeway';

/**
 * Configuration options for chat requests
 */
export interface ChatOptions {
  /** Controls randomness in responses (0.0 - 2.0) */
  temperature?: number;
  /** Maximum tokens to generate in response */
  maxTokens?: number;
  /** Enable streaming responses */
  stream?: boolean;
  /** Available tools for function calling */
  tools?: any[];
}

/**
 * Unified API client for multi-provider AI interactions
 * 
 * Handles provider switching, model fetching, and chat requests
 * across different AI service providers.
 * 
 * @class ApiClient
 */
export class ApiClient {
  /** Currently active AI provider */
  private provider: ProviderType;
  
  /**
   * Initialize API client with specified provider
   * 
   * @param {ProviderType} provider - AI provider to use (default: 'megallm')
   */
  constructor(provider: ProviderType = 'megallm') {
    this.provider = provider;
  }
  
  /**
   * Switch to a different AI provider
   * 
   * @param {ProviderType} provider - New provider to use
   * @throws {Error} If provider is invalid
   */
  setProvider(provider: ProviderType): void {
    const validProviders: ProviderType[] = ['openrouter', 'megallm', 'agentrouter', 'routeway'];
    if (!validProviders.includes(provider)) {
      throw new Error(`Invalid provider: ${provider}. Must be one of: ${validProviders.join(', ')}`);
    }
    this.provider = provider;
  }
  
  /**
   * Get currently active provider
   * 
   * @returns {ProviderType} Current provider name
   */
  getProvider(): ProviderType {
    return this.provider;
  }
  
  /**
   * Fetch available models from current provider
   * 
   * @async
   * @returns {Promise<any[]>} List of available models
   * @throws {Error} If provider is unknown or fetch fails
   */
  async fetchModels(): Promise<any[]> {
    try {
      switch (this.provider) {
        case 'openrouter':
          return await fetchOpenRouterModels();
        case 'megallm':
          return await fetchMegaLLMModels();
        case 'agentrouter':
          return await fetchAgentRouterModels();
        case 'routeway':
          return await fetchRoutewayModels();
        default:
          throw new Error(`Unknown provider: ${this.provider}`);
      }
    } catch (error: any) {
      throw new Error(`Failed to fetch models from ${this.provider}: ${error.message}`);
    }
  }
  
  /**
   * Send chat request to current AI provider
   * 
   * @async
   * @param {any[]} messages - Conversation history
   * @param {string} model - Model identifier to use
   * @param {ChatOptions} options - Additional chat configuration
   * @returns {Promise<any>} AI response
   * @throws {Error} If provider is unknown or request fails
   */
  async chat(messages: any[], model: string, options: ChatOptions = {}): Promise<any> {
    try {
      // Validate inputs
      if (!messages || messages.length === 0) {
        throw new Error('Messages array cannot be empty');
      }
      if (!model || model.trim() === '') {
        throw new Error('Model identifier is required');
      }

      // Route to appropriate provider
      switch (this.provider) {
        case 'openrouter':
          return await openRouterChat(messages, model, options);
        case 'megallm':
          return await megaLLMChat(messages, model, options);
        case 'agentrouter':
          return await agentRouterChat(messages, model, options);
        case 'routeway':
          return await routewayChat(messages, model, options);
        default:
          throw new Error(`Unknown provider: ${this.provider}`);
      }
    } catch (error: any) {
      // Enhance error message with context
      throw new Error(`Chat request failed (${this.provider}/${model}): ${error.message}`);
    }
  }
}

/**
 * Default API client instance
 * Pre-configured with MegaLLM provider
 */
export const defaultClient = new ApiClient();
