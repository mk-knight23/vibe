import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { provider, apiKey, model } = await request.json();

    if (!provider || !apiKey || !model) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Test API key with a simple request
    const testMessage = 'Hello';
    
    let apiUrl = '';
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    let body: any = {};

    switch (provider) {
      case 'openrouter':
        apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
        headers['Authorization'] = `Bearer ${apiKey}`;
        body = {
          model,
          messages: [{ role: 'user', content: testMessage }],
          max_tokens: 10,
        };
        break;
      
      case 'megallm':
        apiUrl = 'https://api.megallm.com/v1/chat/completions';
        headers['Authorization'] = `Bearer ${apiKey}`;
        body = {
          model,
          messages: [{ role: 'user', content: testMessage }],
          max_tokens: 10,
        };
        break;
      
      case 'agentrouter':
        apiUrl = 'https://api.agentrouter.com/v1/chat/completions';
        headers['Authorization'] = `Bearer ${apiKey}`;
        body = {
          model,
          messages: [{ role: 'user', content: testMessage }],
          max_tokens: 10,
        };
        break;
      
      case 'routeway':
        apiUrl = 'https://api.routeway.ai/v1/chat/completions';
        headers['Authorization'] = `Bearer ${apiKey}`;
        body = {
          model,
          messages: [{ role: 'user', content: testMessage }],
          max_tokens: 10,
        };
        break;
      
      default:
        return NextResponse.json(
          { error: 'Invalid provider' },
          { status: 400 }
        );
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: 'Invalid API key or configuration' },
        { status: 401 }
      );
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { error: 'Validation failed' },
      { status: 500 }
    );
  }
}
