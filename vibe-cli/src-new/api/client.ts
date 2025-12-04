/**
 * AI API Client
 * 
 * Unified interface for communicating with different AI providers.
 * Handles provider selection, request formatting, and response parsing.
 * 
 * @module api/client
 */

import { getConfig } from '../config';
import { Message, AIResponse } from '../types';
import { OpenRouterProvider } from './providers/openrouter';
import { MegaLLMProvider } from './providers/megallm';
import { AgentRouterProvider } from './providers/agentrouter';
import { RoutewayProvider } from './providers/routeway';

/**
 * Provider interface - All providers must implement this
 */
export interface AIProvider {
  chat(messages: Message[], model: string): Promise<AIResponse>;
}

/**
 * Main API client class
 * Routes requests to the appropriate provider based on configuration
 */
export class APIClient {
  private providers: Record<string, AIProvider>;
  
  constructor() {
    // Initialize all providers
    this.providers = {
      openrouter: new OpenRouterProvider(),
      megallm: new MegaLLMProvider(),
      agentrouter: new AgentRouterProvider(),
      routeway: new RoutewayProvider()
    };
  }
  
  /**
   * Send chat request to AI
   * @param messages - Conversation history
   * @param model - Optional model override
   */
  async chat(messages: Message[], model?: string): Promise<string> {
    const config = getConfig();
    const provider = this.providers[config.provider];
    
    if (!provider) {
      throw new Error(`Unknown provider: ${config.provider}`);
    }
    
    // Use provided model or default from config
    const selectedModel = model || config.model;
    
    // Make API request
    const response = await provider.chat(messages, selectedModel);
    
    // Extract content from response
    return response.choices[0]?.message?.content || '';
  }
  
  /**
   * Stream chat response (for real-time output)
   * @param messages - Conversation history
   * @param onToken - Callback for each token received
   */
  async streamChat(
    messages: Message[], 
    onToken: (token: string) => void
  ): Promise<void> {
    // For now, simulate streaming by splitting response
    const response = await this.chat(messages);
    
    for (const char of response) {
      onToken(char);
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }
}
