# VIBE CLI Developer Guide

## For Developers: Understanding the Codebase

This guide helps developers understand, modify, and extend VIBE CLI.

---

## 🎯 Quick Start for Developers

### Setup
```bash
git clone https://github.com/mk-knight23/vibe.git
cd vibe/vibe-cli
npm install
npm run build
npm start
```

### Development
```bash
npm run dev        # Watch mode
npm test          # Run tests
npm run build     # Compile TypeScript
```

---

## 📚 Core Concepts

### 1. Interactive Terminal
The heart of VIBE - handles user interaction, AI communication, and tool execution.

**File**: `src/cli/interactive.ts`

**Key responsibilities**:
- User input loop
- AI request/response handling
- Tool execution
- Memory management
- Progress visualization

**How it works**:
```typescript
// 1. User enters input
const input = await getInputWithSuggestions();

// 2. Start task tracking
memory.startTask(input);

// 3. Inject memory context
messages.splice(1, 0, { role: 'system', content: memoryContext });

// 4. Send to AI
const response = await client.chat(messages, model, options);

// 5. Execute tools
await executeToolCallsWithTimeline(toolCalls, ...);

// 6. Update memory
memory.onFileWrite(path, content);
```

---

### 2. Memory System
3-layer persistent memory that tracks project state across sessions.

**File**: `src/core/memory.ts`

**Layers**:
1. **Workspace Memory** - Files, structure, recent changes
2. **Task Memory** - Task history, errors, suggestions
3. **Conversation State** - Key points, decisions, pending tasks

**How it works**:
```typescript
// Initialize
const memory = new MemoryManager();
memory.updateWorkspaceMemory();

// Track operations
memory.onFileWrite('src/App.tsx', content);
memory.onShellCommand('npm install', 'success');
memory.onError('Permission denied');

// Get context
const context = memory.getMemoryContext();

// Inject into AI request
messages.splice(1, 0, {
  role: 'system',
  content: `# Persistent Memory\n${context}`
});
```

**Storage**: `.vibe/memory.json` in project root

---

### 3. Tool System
28 tools for file operations, shell commands, git, search, and more.

**File**: `src/tools/index.ts`

**Tool definition**:
```typescript
{
  name: 'write_file',
  displayName: 'WriteFile',
  description: 'Create or overwrite a file',
  parameters: {
    file_path: { type: 'string', required: true },
    content: { type: 'string', required: true }
  },
  handler: filesystem.writeFile,
  requiresConfirmation: true
}
```

**Execution flow**:
```typescript
// 1. AI requests tool
toolCalls = [{ function: { name: 'write_file', arguments: {...} } }]

// 2. Find tool
const tool = tools.find(t => t.name === 'write_file');

// 3. Parse arguments
const args = JSON.parse(call.function.arguments);

// 4. Request confirmation (if needed)
if (tool.requiresConfirmation) {
  const { confirm } = await inquirer.prompt([...]);
}

// 5. Execute
const result = await executeTool('write_file', args);

// 6. Update memory
memory.onFileWrite(args.file_path, args.content);
```

---

### 4. AI Providers
4 providers with 27+ models, easy switching.

**File**: `src/core/api.ts`

**Provider interface**:
```typescript
class ApiClient {
  setProvider(provider: 'openrouter' | 'megallm' | 'agentrouter' | 'routeway')
  fetchModels(): Promise<Model[]>
  chat(messages, model, options): Promise<Response>
}
```

**How it works**:
```typescript
// Initialize
const client = new ApiClient('megallm');

// Switch provider
client.setProvider('openrouter');

// Get models
const models = await client.fetchModels();

// Send request
const response = await client.chat(messages, model, {
  temperature: 0.7,
  maxTokens: 4000,
  tools: toolSchemas
});
```

---

## 🔧 Adding New Features

### Add a New Tool

**Step 1**: Create tool function in appropriate file

```typescript
// src/tools/filesystem.ts
export async function myNewTool(param1: string, param2: number): Promise<string> {
  // Validate inputs
  if (!param1) throw new Error('param1 required');
  
  // Perform operation
  const result = doSomething(param1, param2);
  
  // Return result
  return `Success: ${result}`;
}
```

**Step 2**: Add tool definition to registry

```typescript
// src/tools/index.ts
{
  name: 'my_new_tool',
  displayName: 'MyNewTool',
  description: 'Does something useful',
  parameters: {
    param1: { type: 'string', required: true },
    param2: { type: 'number', required: false }
  },
  handler: filesystem.myNewTool,
  requiresConfirmation: false
}
```

**Step 3**: Update system prompt

```typescript
// src/cli/system-prompt.ts
// Add to Available Tools section:
- my_new_tool: Does something useful (params: param1, optional: param2)
```

**Step 4**: Test

```bash
npm run build
npm start
# Try: "Use my_new_tool with param1='test'"
```

---

### Add a New Command

**Step 1**: Create command handler

```typescript
// src/commands/my-command.ts
export async function myCommand(args: string[]): Promise<void> {
  console.log('Executing my command with:', args);
  // Command logic here
}
```

**Step 2**: Register command

```typescript
// src/cli/command-handler.ts
case 'mycommand':
  await myCommand(args);
  return { action: 'none' };
```

**Step 3**: Add to help

```typescript
// src/cli/interactive.ts - showHelp()
console.log('/mycommand - Does something useful');
```

**Step 4**: Test

```bash
npm run build
npm start
# Try: "/mycommand arg1 arg2"
```

---

### Add a New AI Provider

**Step 1**: Create provider file

```typescript
// src/providers/myprovider.ts
export async function getMyProviderKey(): Promise<string> {
  return process.env.MYPROVIDER_API_KEY || 'default-key';
}

export async function fetchMyProviderModels(): Promise<any[]> {
  const response = await fetch('https://api.myprovider.com/models');
  return await response.json();
}

export async function myProviderChat(
  messages: any[],
  model: string,
  options: any
): Promise<any> {
  const response = await fetch('https://api.myprovider.com/chat', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${await getMyProviderKey()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ messages, model, ...options })
  });
  return await response.json();
}
```

**Step 2**: Register provider

```typescript
// src/core/api.ts
export type ProviderType = 'openrouter' | 'megallm' | 'agentrouter' | 'routeway' | 'myprovider';

async chat(messages, model, options) {
  switch (this.provider) {
    case 'myprovider':
      return await myProviderChat(messages, model, options);
    // ... other cases
  }
}
```

**Step 3**: Add to provider switcher

```typescript
// src/cli/interactive.ts - switchProvider()
choices: [
  { name: 'MyProvider', value: 'myprovider' },
  // ... other providers
]
```

---

## 🧪 Testing

### Unit Tests
```bash
npm run test:unit
```

**Example test**:
```typescript
// tests/unit/tools.spec.ts
import { describe, it, expect } from 'vitest';
import { writeFile } from '../src/tools/filesystem';

describe('writeFile', () => {
  it('should create file', async () => {
    const result = await writeFile('test.txt', 'content');
    expect(result).toContain('Success');
  });
});
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

---

## 🐛 Debugging

### Enable Debug Logging

```typescript
// src/utils/logger.ts
export const DEBUG = true; // Set to true

// Use in code
if (DEBUG) console.log('Debug info:', data);
```

### Debug Memory

```typescript
// Check memory state
const state = memory.getState();
console.log('Memory:', JSON.stringify(state, null, 2));

// Check memory file
cat .vibe/memory.json
```

### Debug AI Requests

```typescript
// Log messages before sending
console.log('Messages:', JSON.stringify(messages, null, 2));

// Log response
console.log('Response:', JSON.stringify(response, null, 2));
```

---

## 📦 Building & Publishing

### Build
```bash
npm run build
# Output: dist/
```

### Test Build
```bash
npm start
# Runs: node bin/vibe.js
```

### Publish to NPM
```bash
npm version patch  # or minor, major
npm publish
```

---

## 🎨 Code Style

### TypeScript
- Use strict mode
- Define interfaces for all data structures
- Use async/await over promises
- Handle errors gracefully

### Naming Conventions
- Files: kebab-case (my-file.ts)
- Classes: PascalCase (MyClass)
- Functions: camelCase (myFunction)
- Constants: UPPER_SNAKE_CASE (MY_CONSTANT)

### Comments
- Explain WHY, not WHAT
- Document complex logic
- Add JSDoc for public APIs

### Error Handling
```typescript
try {
  const result = await operation();
  return result;
} catch (error: any) {
  logger.error(`Operation failed: ${error.message}`);
  throw error;
}
```

---

## 🔍 Common Patterns

### Pattern 1: Tool with Confirmation
```typescript
export async function dangerousOperation(param: string): Promise<string> {
  // Validate
  if (!param) throw new Error('param required');
  
  // Perform operation
  const result = doSomething(param);
  
  // Return
  return `Success: ${result}`;
}

// In tool definition:
requiresConfirmation: true
```

### Pattern 2: Memory Update
```typescript
// After any operation that changes state
memory.onFileWrite(path, content);
memory.onShellCommand(cmd, result);
memory.onError(error);
```

### Pattern 3: Progress Indicator
```typescript
const spinner = ora('Processing...').start();
try {
  await operation();
  spinner.succeed('Completed');
} catch (error) {
  spinner.fail('Failed');
}
```

### Pattern 4: Streaming Output
```typescript
const words = message.split(' ');
for (const word of words) {
  process.stdout.write(word + ' ');
  await sleep(20);
}
```

---

## 📊 Performance Tips

### 1. Minimize Tool Calls
Batch operations when possible:
```typescript
// Bad: Multiple tool calls
await writeFile('file1.txt', 'content1');
await writeFile('file2.txt', 'content2');

// Good: Single batch operation
await Promise.all([
  writeFile('file1.txt', 'content1'),
  writeFile('file2.txt', 'content2')
]);
```

### 2. Optimize Memory
Limit history size:
```typescript
// Keep only recent items
this.state.taskHistory = this.state.taskHistory.slice(0, 10);
this.state.recentChanges = this.state.recentChanges.slice(0, 20);
```

### 3. Efficient File Operations
Use streams for large files:
```typescript
import { createReadStream } from 'fs';

const stream = createReadStream('large-file.txt');
stream.on('data', chunk => process(chunk));
```

---

## 🚨 Common Issues

### Issue 1: Tool Not Found
**Cause**: Tool not registered in `src/tools/index.ts`
**Fix**: Add tool definition to `tools` array

### Issue 2: Memory Not Persisting
**Cause**: `.vibe/` folder doesn't exist or no write permissions
**Fix**: Check folder exists and has write permissions

### Issue 3: AI Not Using Tools
**Cause**: Model doesn't support function calling
**Fix**: Switch to compatible model (Claude, GPT-4, Gemini)

### Issue 4: Build Errors
**Cause**: TypeScript errors
**Fix**: Run `npm run build` and fix errors

---

## 📚 Resources

### Documentation
- [Quick Start](./GUIDE.md)
- [Features](./FEATURES.md)
- [Tools Reference](./TOOLS.md)
- [Memory System](./MEMORY.md)
- [Code Structure](./CODE_STRUCTURE.md)

### External
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Node.js Docs](https://nodejs.org/docs/)
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js)
- [Ora](https://github.com/sindresorhus/ora)

---

## 🤝 Contributing

### Process
1. Fork repository
2. Create feature branch
3. Make changes
4. Add tests
5. Update documentation
6. Submit pull request

### Guidelines
- Follow code style
- Add tests for new features
- Update documentation
- Keep commits atomic
- Write clear commit messages

---

## 📝 Checklist for New Features

- [ ] Implement feature
- [ ] Add tests
- [ ] Update documentation
- [ ] Add to CHANGELOG
- [ ] Test manually
- [ ] Run full test suite
- [ ] Build successfully
- [ ] Update version
- [ ] Create PR

---

**Version**: 7.0.5  
**For Developers**  
**Built with ❤️ by KAZI**
