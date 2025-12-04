/**
 * Routeway Provider
 * @module api/providers/routeway
 */

import axios from 'axios';
import { AIProvider } from '../client';
import { Message, AIResponse } from '../../types';
import { getConfig } from '../../config';

export class RoutewayProvider implements AIProvider {
  private baseURL = 'https://routeway.com/api/v1';
  
  async chat(messages: Message[], model: string): Promise<AIResponse> {
    const config = getConfig();
    const response = await axios.post(
      `${this.baseURL}/chat/completions`,
      { model, messages },
      { headers: { 'Authorization': `Bearer ${config.apiKey}` } }
    );
    return response.data;
  }
}
