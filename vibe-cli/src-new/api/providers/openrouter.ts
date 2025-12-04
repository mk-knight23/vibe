/**
 * OpenRouter Provider
 * 
 * Implementation for OpenRouter API
 * Provides access to multiple AI models through a single API
 * 
 * @module api/providers/openrouter
 */

import axios from 'axios';
import { AIProvider } from '../client';
import { Message, AIResponse } from '../../types';
import { getConfig } from '../../config';

export class OpenRouterProvider implements AIProvider {
  private baseURL = 'https://openrouter.ai/api/v1';
  
  /**
   * Send chat request to OpenRouter
   */
  async chat(messages: Message[], model: string): Promise<AIResponse> {
    const config = getConfig();
    
    const response = await axios.post(
      `${this.baseURL}/chat/completions`,
      {
        model,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        temperature: config.temperature,
        max_tokens: config.maxTokens
      },
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://github.com/mk-knight23/vibe',
          'X-Title': 'VIBE CLI'
        }
      }
    );
    
    return response.data;
  }
}
