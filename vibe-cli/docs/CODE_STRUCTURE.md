# VIBE CLI Code Structure & Architecture

## Overview
Complete guide to VIBE CLI codebase - every folder, file, function, and feature explained.

---

## 📁 Project Structure

```
vibe-cli/
├── src/
│   ├── cli/              # Command-line interface layer
│   ├── commands/         # 60+ command implementations
│   ├── core/             # Core engine & business logic
│   ├── providers/        # AI provider integrations
│   ├── tools/            # 28 tools for file/shell/web operations
│   └── utils/            # Helper utilities
├── tests/                # Test suites
├── docs/                 # Documentation
└── dist/                 # Compiled JavaScript output
```

---

## 🎯 src/cli/ - Command-Line Interface

### index.ts
**Purpose**: Main entry point for the CLI application

**What it does**:
1. Shows welcome banner with branding
2. Initializes API client
3. Starts interactive mode
4. Handles version and help flags

**Key functions**:
- `main()` - Entry point, parses args, starts interactive mode
- Handles `--version`, `--help` flags
- Error handling for TTY issues

**Usage**: Called when user runs `vibe` command

---

### interactive.ts
**Purpose**: Interactive terminal experience with streaming, progress, memory

**What it does**:
1. Manages conversation loop
2. Handles user input
3. Processes AI responses
4. Executes tools and commands
5. Manages persistent memory
6. Shows progress indicators
7. Streams AI output token-by-token

**Key functions**:

**`startInteractive(client: ApiClient)`**
- Main loop for user interaction
- Initializes memory system
- Handles onboarding
- Processes user input continuously

**`processUserInput(client, messages, model, input, memory)`**
- Sends request to AI
- Injects memory context
- Shows multi-step progress
- Handles tool calls
- Updates memory
- Returns AI response

**`createFilesWithProgress(files, stats, memory)`**
- Creates files with [1/N] progress indicators
- Updates memory on each file
- Shows success/error for each file

**`executeShellWithProgress(response, stats, memory)`**
- Executes shell commands with animated spinners
- Blocks dangerous commands (rm -rf /, mkfs, etc.)
- Shows duration for each command
- Updates memory

**`executeToolCallsWithTimeline(toolCalls, messages, ...)`**
- Executes AI tool calls
- Shows timeline with duration
- Updates memory based on tool type
- Handles confirmations

**`showSteps(steps)` / `updateSteps(steps)`**
- Shows processing pipeline: 🧠 Understanding → 📋 Planning → ✨ Generating
- Updates in real-time with spinner animations

**`streamAIResponse(message)`**
- Streams AI response word-by-word (20ms delay)
- Natural reading pace

**Memory Integration**:
- Injects memory context before AI request
- Removes memory context after processing
- Updates memory on every operation
- Summarizes messages when >15

**Safety Features**:
- Dangerous command blocking
- Confirmation prompts
- Error tracking
- Visual warnings

---

### command-handler.ts
**Purpose**: Handles slash commands (/help, /model, /create, etc.)

**What it does**:
1. Parses slash commands
2. Routes to appropriate handler
3. Executes command logic
4. Returns result

**Key functions**:
- `handleCommand(input, client, model)` - Main command router
- Handles: /help, /quit, /clear, /model, /provider, /create, /tools, /agent, etc.

**Commands supported**: 60+ commands for various operations

---

### commands.ts
**Purpose**: Command definitions and metadata

**What it does**:
- Defines all available commands
- Provides command descriptions
- Maps commands to handlers

---

### system-prompt.ts
**Purpose**: AI system prompt with instructions and capabilities

**What it does**:
1. Defines AI behavior and personality
2. Lists all available tools
3. Explains operational modes
4. Provides task execution workflow
5. Includes memory system instructions

**Key sections**:
- **Persistent Memory** - Instructions to use memory
- **Core Identity** - What VIBE is
- **Operational Modes** - Chat, Task, Agent
- **Task Workflow** - 7-step process
- **Available Tools** - All 28 tools documented
- **Command Execution Rules** - Safety and efficiency
- **Core Mandates** - 10 principles

**Exports**:
- `VIBE_SYSTEM_PROMPT` - Full system prompt
- `VERSION` - Current version
- `DEFAULT_MODEL` - Default AI model

---

## 🔧 src/tools/ - Tool Implementations

### index.ts
**Purpose**: Tool registry and execution engine

**What it does**:
1. Imports all tool modules
2. Defines tool schemas
3. Provides tool execution function
4. Exports tool metadata

**Tool Definition**:
```typescript
{
  name: 'tool_name',
  displayName: 'ToolName',
  description: 'What it does',
  parameters: { param: { type, required } },
  handler: async function,
  requiresConfirmation: boolean
}
```

**Key functions**:
- `executeTool(toolName, params)` - Executes any tool by name
- `getToolSchemas()` - Returns tool schemas for AI

**Total tools**: 28 tools across 8 categories

---

### filesystem.ts
**Purpose**: File system operations (read, write, list, search)

**What it does**:
- Read/write files
- List directories
- Search file content
- Find files by pattern
- Replace text in files

**Key functions**:

**`listDirectory(path, ignore?, respectGitIgnore?)`**
- Lists files and folders in directory
- Respects .gitignore if requested
- Returns array of file/folder names

**`readFile(path, offset?, limit?)`**
- Reads file contents
- Supports offset/limit for large files
- Returns file content as string

**`writeFile(filePath, content)`**
- Creates or overwrites file
- Creates parent directories if needed
- Returns success message

**`globFiles(pattern, path?, caseSensitive?, respectGitIgnore?)`**
- Finds files matching glob pattern
- Uses fast-glob library
- Returns array of matching file paths

**`searchFileContent(pattern, path?, include?)`**
- Searches for text pattern in files
- Returns matches with file paths
- Case-insensitive search

**`replaceInFile(filePath, oldString, newString, expectedReplacements?)`**
- Replaces text in file
- Validates expected replacement count
- Returns number of replacements made

---

### enhanced.ts
**Purpose**: Enhanced tools (git, ripgrep, project analysis, verification)

**What it does**:
- Git operations (status, diff, log, blame)
- Fast search with ripgrep
- Project analysis
- Dependency checking
- Test/lint/typecheck execution

**Key functions**:

**Git Operations** (all use --no-pager):
- `gitStatus()` - Returns short git status
- `gitDiff(file?)` - Returns git diff
- `gitLog(count?)` - Returns git log (default 5)
- `gitBlame(file, lineStart?, lineEnd?)` - Returns git blame

**Search Operations**:
- `ripgrepSearch(pattern, path, options)` - Fast search with rg, fallback to grep
- `listFilesRg(path)` - List files with rg --files, fallback to find

**Project Analysis**:
- `checkDependency(packageName)` - Checks if package exists in package.json
- `getProjectInfo()` - Detects framework, language, package manager

**Verification**:
- `runTests(testCommand?)` - Auto-detects and runs tests
- `runLint(lintCommand?)` - Auto-detects and runs linter
- `runTypeCheck()` - Runs tsc --noEmit

**File Operations**:
- `getFileInfo(filePath)` - Returns detailed file metadata
- `createDirectory(dirPath, recursive)` - Creates directory
- `deleteFile(filePath)` - Deletes file
- `moveFile(source, destination)` - Moves/renames file
- `copyFile(source, destination)` - Copies file
- `appendToFile(filePath, content)` - Appends to file

---

### shell.ts
**Purpose**: Shell command execution with safety checks

**What it does**:
1. Executes shell commands
2. Validates commands for safety
3. Detects OS for command compatibility
4. Handles command output

**Key functions**:

**`runShellCommand(command, description?, directory?)`**
- Executes shell command
- Checks for destructive commands
- Returns stdout/stderr
- Handles errors gracefully

**Safety checks**:
- Detects OS (Windows, macOS, Linux)
- Blocks destructive commands
- Validates command syntax

---

### web.ts
**Purpose**: Web operations (fetch, search)

**What it does**:
- Fetches content from URLs
- Searches the web
- Handles HTTP requests

**Key functions**:

**`webFetch(url)`**
- Fetches content from URL
- Returns response text
- Handles errors

**`googleWebSearch(query, numResults?)`**
- Searches the web
- Returns search results
- Limited to safe queries

---

### extras.ts
**Purpose**: Memory and task management

**What it does**:
- Saves information to memory
- Manages task lists
- Persists data

**Key functions**:

**`saveMemory(key, value)`**
- Saves key-value pair to memory
- Persists to disk
- Returns success

**`writeTodos(todos)`**
- Saves task list
- Persists to disk
- Returns success

---

### advanced.ts
**Purpose**: Advanced file operations with safety boundaries

**What it does**:
- File manager with safety checks
- Smart shell with auto-correction
- Command history and suggestions

**Key classes**:

**`FileManager`**
- Validates paths against safety boundaries
- Atomic file writes
- Safe file operations

**`SmartShell`**
- Auto-corrects common typos
- Maintains command history
- Suggests commands

---

## 🧠 src/core/ - Core Engine

### api.ts
**Purpose**: API client for AI providers

**What it does**:
1. Manages AI provider connections
2. Switches between providers
3. Fetches available models
4. Sends chat requests

**Key class**: `ApiClient`

**Methods**:
- `setProvider(provider)` - Switches AI provider
- `getProvider()` - Returns current provider
- `fetchModels()` - Gets available models
- `chat(messages, model, options)` - Sends chat request

**Providers**: openrouter, megallm, agentrouter, routeway

---

### memory.ts
**Purpose**: 3-layer persistent memory system

**What it does**:
1. Tracks workspace state (files, structure)
2. Tracks task history
3. Maintains conversation state
4. Persists to .vibe/memory.json
5. Injects context into AI requests
6. Summarizes old messages

**Key class**: `MemoryManager`

**Methods**:

**Workspace Memory**:
- `updateWorkspaceMemory()` - Scans project, updates file list
- `onFileWrite(path, content)` - Updates on file write
- `onFileRead(path, content)` - Updates on file read

**Task Memory**:
- `startTask(description)` - Starts tracking new task
- `onError(error)` - Records error in current task

**Conversation State**:
- `addKeyPoint(point)` - Adds important fact
- `addDecision(decision)` - Records decision
- `addPendingTask(task)` - Adds pending task
- `removePendingTask(task)` - Removes completed task

**Memory Management**:
- `getMemoryContext()` - Returns formatted memory context
- `summarizeOldMessages(messages)` - Summarizes when >15 messages
- `clear()` - Clears all memory
- `getState()` - Returns current state

**Storage**:
- Auto-saves after every operation
- Loads on startup
- JSON format in .vibe/memory.json

---

### agents.ts
**Purpose**: Autonomous agent system

**What it does**:
1. Breaks down complex tasks
2. Executes steps autonomously
3. Verifies each step
4. Reports progress

**Key functions**:
- `runAgent(task, client, model)` - Runs autonomous agent
- Breaks task into steps
- Executes tools
- Verifies results

---

### config.ts
**Purpose**: Configuration management

**What it does**:
- Loads config from ~/.vibe/config.json
- Provides default values
- Manages API keys

**Key functions**:
- `loadConfig()` - Loads configuration
- Returns provider configs, API keys, settings

---

### executor.ts
**Purpose**: Command execution engine

**What it does**:
- Executes commands safely
- Handles timeouts
- Manages process lifecycle

---

### monitoring.ts
**Purpose**: Usage monitoring and metrics

**What it does**:
- Tracks API usage
- Monitors performance
- Logs metrics

---

### multi-file-editor.ts
**Purpose**: Multi-file atomic editing

**What it does**:
- Edits multiple files atomically
- Applies patches
- Rollback on error

---

### routing.ts
**Purpose**: Context routing and prioritization

**What it does**:
- Routes context to AI
- Prioritizes information
- Manages context window

---

### runtime.ts
**Purpose**: Sandbox execution engine

**What it does**:
- Executes code in sandbox
- Manages runtime environment
- Handles security

---

### sessions.ts
**Purpose**: Session management

**What it does**:
- Manages conversation sessions
- Persists session state
- Handles session lifecycle

---

## 🌐 src/providers/ - AI Providers

### index.ts
**Purpose**: Provider registry and common utilities

**What it does**:
- Exports all providers
- Provides common fetch function
- Manages API keys

---

### openrouter.ts
**Purpose**: OpenRouter API integration

**What it does**:
- Connects to OpenRouter API
- Fetches 40+ free models
- Sends chat requests

**Models**: GPT-4, Claude, Gemini, etc.

---

### megallm.ts
**Purpose**: MegaLLM API integration (default)

**What it does**:
- Connects to MegaLLM API
- Free API access
- Default provider

**Models**: Qwen3-Next-80B (default), GPT OSS, etc.

---

### agentrouter.ts
**Purpose**: AgentRouter API integration

**What it does**:
- Connects to AgentRouter
- Claude models with routing
- Specialized agents

---

### routeway.ts
**Purpose**: Routeway API integration

**What it does**:
- Fallback provider
- Fast routing
- Reliable access

---

## 🛠️ src/utils/ - Utilities

### bash-executor.ts
**Purpose**: Bash command parsing and execution

**What it does**:
- Parses bash code blocks from AI responses
- Extracts commands
- Executes commands safely

---

### file-parser.ts
**Purpose**: File parsing from AI responses

**What it does**:
- Parses code blocks with filenames
- Extracts file path and content
- Handles multiple file formats

---

### helpers.ts
**Purpose**: General helper functions

**What it does**:
- Common utility functions
- String manipulation
- Data formatting

---

### logger.ts
**Purpose**: Logging utility

**What it does**:
- Colored console output
- Success/error/warning messages
- Consistent formatting

---

### os-detect.ts
**Purpose**: OS detection and command validation

**What it does**:
- Detects operating system
- Validates commands for OS
- Checks for destructive commands

---

### package-manager.ts
**Purpose**: Package manager detection

**What it does**:
- Detects npm, yarn, pnpm
- Provides appropriate commands
- Handles package operations

---

### streams.ts
**Purpose**: Stream handling utilities

**What it does**:
- Handles streaming responses
- Manages data streams
- Buffers output

---

### terminal-renderer.ts
**Purpose**: Terminal UI rendering

**What it does**:
- Renders progress bars
- Shows spinners
- Formats output

---

## 📦 src/commands/ - Command Implementations

### analyze.ts
**Purpose**: Code analysis commands

**What it does**:
- Analyzes codebase
- Detects issues
- Suggests improvements

---

### analyzers.ts
**Purpose**: Various code analyzers

**What it does**:
- Security analysis
- Performance analysis
- Code quality checks

---

### automate.ts
**Purpose**: Automation commands

**What it does**:
- Automates repetitive tasks
- Creates workflows
- Schedules operations

---

### cli-commands.ts
**Purpose**: CLI-specific commands

**What it does**:
- Terminal operations
- CLI utilities
- Command helpers

---

### debugger.ts
**Purpose**: Debugging commands

**What it does**:
- Debug code
- Find bugs
- Suggest fixes

---

### dev-tools.ts
**Purpose**: Developer tool commands

**What it does**:
- Development utilities
- Build tools
- Testing helpers

---

### integrations.ts
**Purpose**: Third-party integrations

**What it does**:
- GitHub integration
- Cloud provider integration
- API integrations

---

### misc.ts
**Purpose**: Miscellaneous commands

**What it does**:
- Various utilities
- Helper commands
- General operations

---

### operations.ts
**Purpose**: File and project operations

**What it does**:
- Project scaffolding
- File operations
- Bulk operations

---

### registry.ts
**Purpose**: Command registry

**What it does**:
- Registers all commands
- Provides command lookup
- Manages command metadata

---

### template.ts / templates.ts
**Purpose**: Project templates

**What it does**:
- Provides project templates
- Scaffolds new projects
- Initializes boilerplate

---

### workflow.ts / workflows.ts
**Purpose**: Workflow management

**What it does**:
- Defines workflows
- Executes multi-step processes
- Manages workflow state

---

## 🔄 Data Flow

### User Input → AI Response
```
1. User enters input
2. Memory context injected
3. Messages sent to AI provider
4. AI returns response with tool calls
5. Tools executed
6. Memory updated
7. Response shown to user
```

### Tool Execution Flow
```
1. AI requests tool execution
2. Tool parameters validated
3. Confirmation requested (if needed)
4. Tool handler executed
5. Result returned to AI
6. Memory updated
7. AI processes result
```

### Memory Flow
```
1. Load memory on startup
2. Inject context before AI request
3. Update memory on operations
4. Save memory after operations
5. Summarize when >15 messages
```

---

## 🎯 Key Features

### 1. Interactive Terminal
- Token-by-token streaming
- Multi-step progress indicators
- File creation progress
- Shell execution with spinners
- Operation summaries

### 2. Persistent Memory
- Workspace memory (files, structure)
- Task memory (history, errors)
- Conversation state (decisions, tasks)
- Auto-save/load
- Message summarization

### 3. Tool System
- 28 tools across 8 categories
- Automatic execution
- Confirmation system
- Memory integration

### 4. AI Providers
- 4 providers (OpenRouter, MegaLLM, AgentRouter, Routeway)
- 27+ models
- Easy switching
- Free API access

### 5. Safety Features
- Dangerous command blocking
- Confirmation prompts
- Error tracking
- Path validation

---

## 🚀 Execution Flow

### Startup
```
1. Parse command-line arguments
2. Show welcome banner
3. Initialize API client
4. Initialize memory manager
5. Load memory from disk
6. Update workspace memory
7. Run onboarding
8. Start interactive loop
```

### Interactive Loop
```
1. Show prompt
2. Get user input
3. Check for slash command
4. If slash command: handle and continue
5. If regular input:
   a. Start task in memory
   b. Inject memory context
   c. Send to AI
   d. Process response
   e. Execute tools
   f. Update memory
   g. Show results
6. Repeat
```

### Tool Execution
```
1. AI returns tool calls
2. For each tool:
   a. Find tool definition
   b. Parse parameters
   c. Request confirmation (if needed)
   d. Execute tool handler
   e. Update memory
   f. Return result to AI
3. AI processes results
4. Show final response
```

---

## 📊 Statistics

- **Total Files**: 48 TypeScript files
- **Total Lines**: ~15,000 lines
- **Tools**: 28 tools
- **Commands**: 60+ commands
- **Providers**: 4 providers
- **Models**: 27+ models

---

**Version**: 7.0.5  
**Status**: Production Ready  
**Built with ❤️ by KAZI**
