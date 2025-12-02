import { NextRequest, NextResponse } from 'next/server';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface MegaLLMResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, apiKey, model, messages, newMessage, isAgent } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    // Prepare system prompt based on mode
    const systemPrompt = isAgent
      ? `You are Vibe AI, an agent assistant. Plan your work as small, reversible steps. Propose checkpoints and a todo list for the user.`
      : `You are Vibe AI, a helpful coding assistant.`;

    // Build messages array
    const chatMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages,
      { role: 'user', content: newMessage }
    ];

    let apiUrl: string;
    let apiHeaders: Record<string, string>;

    switch (provider) {
      case 'openrouter':
        apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
        apiHeaders = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://vibe-ai.vercel.app',
          'X-Title': 'Vibe Web Chat',
        };
        break;
      
      case 'megallm':
        apiUrl = 'https://ai.megallm.io/v1/chat/completions';
        apiHeaders = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'User-Agent': 'Vibe Web Chat',
        };
        break;
      
      case 'agentrouter':
        apiUrl = 'https://api.agentrouter.com/v1/chat/completions';
        apiHeaders = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        };
        break;
      
      case 'routeway':
        apiUrl = 'https://api.routeway.ai/v1/chat/completions';
        apiHeaders = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        };
        break;
      
      default:
        return NextResponse.json(
          { error: 'Invalid provider' },
          { status: 400 }
        );
    }

    const requestBody = {
      model: model || (provider === 'openrouter' ? 'z-ai/glm-4.5-air:free' : 'gpt-4o-mini'),
      messages: chatMessages,
      temperature: 0.2,
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: apiHeaders,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error (${response.status}):`, errorText);
      return NextResponse.json(
        { error: `API request failed: ${response.status} ${errorText}` },
        { status: response.status }
      );
    }

    const data = (await response.json()) as OpenRouterResponse | MegaLLMResponse;
    const content = data.choices?.[0]?.message?.content ?? 'No content returned from API.';

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}