# VIBE CLI - Clean Architecture

## 📁 Folder Structure

```
src-new/
├── index.ts              # Main entry point
├── cli.ts                # CLI orchestrator
│
├── api/                  # AI Provider Integration
│   ├── client.ts         # Unified API client
│   └── providers/        # Provider implementations
│       ├── openrouter.ts
│       ├── megallm.ts
│       ├── agentrouter.ts
│       └── routeway.ts
│
├── commands/             # Command Handlers
│   ├── index.ts          # Command registry & router
│   ├── chat-command.ts   # /chat command
│   ├── code-command.ts   # /code command
│   ├── analyze-command.ts
│   ├── deploy-command.ts
│   ├── template-command.ts
│   └── config-command.ts
│
├── config/               # Configuration Management
│   └── index.ts          # Load/save config
│
├── features/             # Core Features
│   ├── chat.ts           # AI chat with history
│   └── analyzer.ts       # Project analysis
│
├── lib/                  # Utilities & Helpers
│   ├── logger.ts         # Colored logging
│   └── file-utils.ts     # File operations
│
└── types/                # TypeScript Definitions
    └── index.ts          # All interfaces & types
```

## 🎯 Design Principles

### 1. **Clear Separation of Concerns**
- `api/` - External API communication
- `commands/` - User command handling
- `features/` - Business logic
- `lib/` - Reusable utilities

### 2. **Single Responsibility**
- Each file has ONE clear purpose
- Functions do ONE thing well
- Classes manage ONE concept

### 3. **Dependency Flow**
```
index.ts → cli.ts → commands/ → features/ → api/
                                         ↓
                                       lib/
```

### 4. **Naming Conventions**
- **Files**: `kebab-case.ts` (e.g., `chat-command.ts`)
- **Classes**: `PascalCase` (e.g., `APIClient`)
- **Functions**: `camelCase` (e.g., `executeCommand`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `CONFIG_FILE`)

### 5. **Comments**
Every file has:
- Module description at top
- Function JSDoc comments
- Inline comments for complex logic

## 🔄 Data Flow Example

**User types: `/chat Hello`**

1. `index.ts` → Starts application
2. `cli.ts` → Parses input, detects command
3. `commands/index.ts` → Routes to `chatCommand`
4. `commands/chat-command.ts` → Validates args
5. `features/chat.ts` → Manages conversation
6. `api/client.ts` → Sends to AI provider
7. `api/providers/openrouter.ts` → Makes HTTP request
8. Response flows back up the chain
9. User sees output

## 📝 Adding New Features

### Add a Command:
1. Create `commands/my-command.ts`
2. Export `myCommand(args: string[])`
3. Register in `commands/index.ts`

### Add a Provider:
1. Create `api/providers/my-provider.ts`
2. Implement `AIProvider` interface
3. Register in `api/client.ts`

### Add a Feature:
1. Create `features/my-feature.ts`
2. Export main function
3. Use in command handlers

## 🧪 Testing Structure

```
tests/
├── unit/           # Test individual functions
├── integration/    # Test feature flows
└── e2e/           # Test full commands
```

## 🚀 Build & Run

```bash
# Build
npm run build

# Run
npm start

# Development
npm run dev
```

## 📦 Dependencies

- `inquirer` - Interactive prompts
- `picocolors` - Terminal colors
- `axios` - HTTP requests
- `typescript` - Type safety
