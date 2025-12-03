import { createInterface } from 'readline';
import { ApiClient } from '../core/api';
import { EnhancedSessionManager } from '../core/enhanced-session-manager';

export class StreamingEngine {
  private sessionManager: EnhancedSessionManager;
  private apiClient: ApiClient;

  constructor() {
    this.sessionManager = new EnhancedSessionManager();
    this.apiClient = new ApiClient();
  }

  async startInteractive(): Promise<void> {
    await this.sessionManager.createSession();
    
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '> '
    });

    console.log('Vibe AI CLI - Interactive Mode (type /quit to exit)\n');
    rl.prompt();

    rl.on('line', async (input) => {
      if (input === '/quit') {
        await this.sessionManager.saveSession();
        rl.close();
        return;
      }

      if (input === '/save') {
        await this.sessionManager.saveSession();
        console.log('Session saved\n');
        rl.prompt();
        return;
      }

      if (input === '/export') {
        const exported = await this.sessionManager.exportSession('md');
        console.log(exported);
        rl.prompt();
        return;
      }

      try {
        this.sessionManager.addMessage('user', input);
        
        process.stdout.write('\nAssistant: ');
        const response = await this.getStreamingResponse(input);
        process.stdout.write('\n\n');
        
        this.sessionManager.addMessage('assistant', response);
      } catch (error: any) {
        console.error(`Error: ${error.message}\n`);
      }

      rl.prompt();
    });

    rl.on('close', () => {
      console.log('\nGoodbye!');
      process.exit(0);
    });
  }

  private async getStreamingResponse(input: string): Promise<string> {
    const history = this.sessionManager.getMessages(10);
    const messages = [...history.map(m => ({ role: m.role, content: m.content })), { role: 'user', content: input }];
    
    const response = await this.apiClient.chat(
      messages,
      'meta-llama/llama-3.3-70b-instruct:free'
    );
    
    // Simulate streaming
    for (const char of response) {
      process.stdout.write(char);
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    return response;
  }
}
