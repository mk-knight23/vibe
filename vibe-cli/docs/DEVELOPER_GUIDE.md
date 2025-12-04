# VIBE CLI - Developer Guide

## Architecture

VIBE CLI is built with TypeScript and follows a modular architecture:

```
vibe-cli/
├── src/
│   ├── cli/              # CLI interface & interactive mode
│   ├── core/             # Core functionality (API, memory, agents)
│   ├── tools/            # 42+ development tools
│   ├── providers/        # AI provider integrations
│   ├── commands/         # 60+ CLI commands
│   └── utils/            # Utility functions
├── tests/                # Test suites
└── docs/                 # Documentation
```

## Setup

```bash
# Clone repository
git clone https://github.com/mk-knight23/vibe.git
cd vibe/vibe-cli

# Install dependencies
npm install

# Build
npm run build

# Run locally
npm start
```

## Core Modules

### API Client (`src/core/api.ts`)
Unified interface for multi-provider AI interactions.

```typescript
import { ApiClient } from './core/api';

const client = new ApiClient('megallm');
const response = await client.chat(messages, model, options);
```

### Memory Manager (`src/core/memory.ts`)
Context-aware memory system for conversations.

```typescript
import { MemoryManager } from './core/memory';

const memory = new MemoryManager();
memory.startTask('Build React app');
```

### Tool System (`src/tools/index.ts`)
42+ tools for file operations, shell execution, web scraping.

```typescript
import { tools, executeTool } from './tools';

const result = await executeTool('read_file', { path: 'app.ts' });
```

## Adding New Features

### 1. Add New Tool

```typescript
// src/tools/custom.ts
export async function myTool(params: any): Promise<any> {
  // Implementation
}

// src/tools/index.ts
export const tools: ToolDefinition[] = [
  {
    name: 'my_tool',
    displayName: 'MyTool',
    description: 'Does something useful',
    parameters: { /* ... */ },
    handler: myTool
  }
];
```

### 2. Add New Command

```typescript
// src/commands/custom.ts
export async function myCommand(args: string[]): Promise<void> {
  // Implementation
}

// Register in command handler
```

### 3. Add New Provider

```typescript
// src/providers/custom.ts
export async function customChat(
  messages: any[],
  model: string,
  options: ChatOptions
): Promise<any> {
  // Implementation
}

// Add to ApiClient
```

## Testing

```bash
# Run all tests
npm test

# Run specific test suite
npm run test:unit
npm run test:integration
npm run test:e2e

# With coverage
npm run test:coverage
```

## Code Style

### TypeScript
- Strict mode enabled
- Explicit types required
- No implicit any

### Documentation
```typescript
/**
 * Function description
 * 
 * @param {Type} param - Description
 * @returns {ReturnType} Description
 * @throws {Error} When it throws
 */
```

### Error Handling
```typescript
try {
  const result = await operation();
  return result;
} catch (error: any) {
  throw new Error(`Operation failed: ${error.message}`);
}
```

## Building & Publishing

```bash
# Build
npm run build

# Test build
npm start

# Publish to NPM
npm version patch  # or minor, major
npm publish
```

## Project Structure

### CLI Entry (`src/cli/index.ts`)
Main entry point, handles CLI arguments and starts interactive mode.

### Interactive Mode (`src/cli/interactive.ts`)
Conversation loop, handles user input, processes AI responses.

### Command Handler (`src/cli/command-handler.ts`)
Processes slash commands (/help, /model, /clear, etc.).

### System Prompt (`src/cli/system-prompt.ts`)
Defines AI behavior and capabilities.

## Key Concepts

### 1. Provider System
Multiple AI providers with automatic fallback and switching.

### 2. Tool Execution
Tools are executed based on AI function calls with user confirmation.

### 3. Memory Management
Conversation history and context stored for continuity.

### 4. Multi-File Editing
Parse and apply file changes from AI responses.

### 5. Agent Workflows
Complex tasks broken into steps with specialized agents.

## API Reference

### ApiClient
```typescript
class ApiClient {
  constructor(provider?: ProviderType)
  setProvider(provider: ProviderType): void
  getProvider(): ProviderType
  fetchModels(): Promise<any[]>
  chat(messages: any[], model: string, options?: ChatOptions): Promise<any>
}
```

### MemoryManager
```typescript
class MemoryManager {
  startTask(task: string): void
  completeTask(result: string): void
  addContext(key: string, value: any): void
  getContext(key: string): any
  clear(): void
}
```

### Tool Execution
```typescript
async function executeTool(
  toolName: string,
  params: any,
  requireConfirmation?: boolean
): Promise<any>
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## Best Practices

1. **Type Safety** - Use explicit types everywhere
2. **Error Handling** - Always handle errors gracefully
3. **Documentation** - Document all public APIs
4. **Testing** - Write tests for new features
5. **Code Review** - Follow PR review process

## Debugging

```bash
# Enable debug mode
DEBUG=vibe:* npm start

# Check logs
tail -f ~/.vibe/logs/vibe.log

# Inspect memory
cat ~/.vibe/memory.json
```

## Performance

- Lazy load providers
- Cache AI responses
- Optimize file operations
- Use streaming for large responses
- Implement connection pooling

## Security

- Validate all inputs
- Sanitize shell commands
- Encrypt API keys
- Implement rate limiting
- Add audit logging

## Resources

- GitHub: https://github.com/mk-knight23/vibe
- Documentation: https://vibe-ai.vercel.app
- NPM: https://www.npmjs.com/package/vibe-ai-cli
- Issues: https://github.com/mk-knight23/vibe/issues

## Version

Current: 7.0.7
