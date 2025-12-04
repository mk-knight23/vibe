# VIBE CLI Quick Start Guide

## ⚠️ Important: Function Calling Compatibility

If you see responses like this:
```
<minimax:tool_call>
<invoke name="create_file"...
```

Or this:
```
<|tool_call_begin|>functions.Bash:1...
```

**Your current model doesn't support function calling properly.**

VIBE CLI requires function calling to create files, run commands, and use tools.

## ✅ Quick Fix

1. **Check compatible models:**
   ```bash
   /models
   ```

2. **Switch to a compatible model:**
   ```bash
   /model
   ```
   
   Select one of these:
   - `anthropic/claude-3.5-sonnet` (OpenRouter)
   - `openai/gpt-4o-mini` (OpenRouter)
   - `google/gemini-2.0-flash-exp:free` (OpenRouter)
   - `qwen/qwen3-next-80b-a3b-instruct` (MegaLLM - default)

3. **Or switch provider:**
   ```bash
   /provider
   ```
   
   Try: OpenRouter (recommended for best compatibility)

## 🚀 Getting Started

### First Time Setup

1. **Start VIBE:**
   ```bash
   npm start
   # or
   vibe
   ```

2. **Choose from onboarding menu:**
   - 📦 Create a new project
   - 📂 Continue existing project
   - 🔍 Analyze current folder
   - 🤖 Switch AI model
   - 💬 Start chatting

### Creating Projects

Use explicit keywords:
```bash
create a todo app with React
build a website for my portfolio
make a calculator in Python
generate a REST API with Express
scaffold a Vue.js project
```

### Just Asking Questions

For information queries, just ask:
```bash
what is the latest Node.js version?
explain how async/await works
what's the difference between let and const?
how do I fix this error?
```

## 📋 Essential Commands

```bash
/help       # Show all commands
/models     # Show compatible models
/model      # Switch AI model
/provider   # Switch AI provider
/clear      # Clear conversation
/quit       # Exit CLI
```

## 🎯 Usage Examples

### Create a Website
```bash
You: create a shopping website
VIBE: [creates HTML, CSS, JS files]
```

### Fix Code
```bash
You: fix the syntax error in app.js
VIBE: [reads file, fixes error, updates file]
```

### Run Commands
```bash
You: install express and start the server
VIBE: [runs npm install express, npm start]
```

### Git Operations
```bash
You: commit these changes
VIBE: [stages files, creates commit with message]
```

## 🐛 Common Issues

### Files Not Created
- **Cause:** Model doesn't support function calling
- **Fix:** Switch to compatible model with `/model`

### Commands Not Executing
- **Cause:** Model doesn't support function calling
- **Fix:** Switch to compatible model with `/model`

### API Errors
- **Cause:** Network issues or provider problems
- **Fix:** Try different provider with `/provider`

### Slow Responses
- **Cause:** Long conversation history
- **Fix:** Clear history with `/clear`

## 📚 Documentation

- [Complete Documentation](./docs/COMPLETE_DOCUMENTATION.md)
- [Troubleshooting Guide](./docs/TROUBLESHOOTING.md)
- [System Prompt Guide](./docs/SYSTEM_PROMPT.md)

## 🔗 Links

- **GitHub:** https://github.com/mk-knight23/vibe
- **Issues:** https://github.com/mk-knight23/vibe/issues
- **NPM:** https://www.npmjs.com/package/vibe-ai-cli

## 💡 Pro Tips

1. **Use explicit keywords** for file creation: create, build, make, generate, scaffold
2. **Be specific** about what you want: "create a React app with routing and TailwindCSS"
3. **Switch to OpenRouter** for best model compatibility
4. **Use /models** to see which models support function calling
5. **Clear history** with /clear if responses get slow

---

**Need Help?** Run `/help` or visit https://github.com/mk-knight23/vibe/issues
# VIBE CLI Tools and Commands Reference

## Available Tools (11 Total)

### File Operations (6 tools)

#### 1. list_directory
Lists files and directories in a path.

**Parameters:**
- `path` (string, required) - Directory path to list
- `ignore` (array, optional) - Patterns to ignore
- `respect_git_ignore` (boolean, optional) - Respect .gitignore

**Example:**
```
List files in src/
```

#### 2. read_file
Reads file contents including text, images, and PDFs.

**Parameters:**
- `path` (string, required) - File path to read
- `offset` (number, optional) - Start reading from line
- `limit` (number, optional) - Number of lines to read

**Example:**
```
Read src/app.ts
Show me the contents of package.json
```

#### 3. write_file
Creates or overwrites a file. Requires user confirmation.

**Parameters:**
- `file_path` (string, required) - Path where file will be created
- `content` (string, required) - File content

**Example:**
```
create a file called app.js with a simple express server
```

#### 4. glob
Finds files matching glob patterns.

**Parameters:**
- `pattern` (string, required) - Glob pattern (e.g., "*.js", "src/**/*.ts")
- `path` (string, optional) - Directory to search in
- `case_sensitive` (boolean, optional) - Case sensitive matching
- `respect_git_ignore` (boolean, optional) - Respect .gitignore

**Example:**
```
Find all TypeScript files
Show me all .json files in the project
```

#### 5. search_file_content
Searches for text patterns in files.

**Parameters:**
- `pattern` (string, required) - Text pattern to search for
- `path` (string, optional) - Directory to search in
- `include` (string, optional) - File pattern to include

**Example:**
```
Search for "TODO" in all files
Find where "getUserData" is used
```

#### 6. replace
Replaces text in a file. Requires user confirmation.

**Parameters:**
- `file_path` (string, required) - File to edit
- `old_string` (string, required) - Text to replace
- `new_string` (string, required) - Replacement text
- `expected_replacements` (number, optional) - Expected number of replacements

**Example:**
```
Replace "var" with "const" in app.js
Change the port from 3000 to 8080
```

### Shell Operations (1 tool)

#### 7. run_shell_command
Executes shell commands. Requires user confirmation.

**Parameters:**
- `command` (string, required) - Shell command to execute
- `description` (string, optional) - Description of what command does
- `directory` (string, optional) - Directory to run command in

**Example:**
```
Install express
Run npm test
Build the project
```

### Web Operations (2 tools)

#### 8. web_fetch
Fetches content from URLs.

**Parameters:**
- `url` (string, required) - URL to fetch

**Example:**
```
Fetch https://api.github.com/repos/mk-knight23/vibe
Get the content from that URL
```

#### 9. google_web_search
Searches the web.

**Parameters:**
- `query` (string, required) - Search query
- `num_results` (number, optional) - Number of results to return

**Example:**
```
Search for "React 19 new features"
Look up the latest Node.js version
```

### Memory & Task Management (2 tools)

#### 10. save_memory
Saves information to memory for later use.

**Parameters:**
- `key` (string, required) - Memory key
- `value` (any, required) - Value to save

**Example:**
```
Remember that the API endpoint is /api/v2/users
Save this configuration for later
```

#### 11. write_todos
Manages task list.

**Parameters:**
- `todos` (array, required) - Array of todo items

**Example:**
```
Create a todo list for this feature
Track these tasks
```

---

## Available Commands (14 Total)

### Essential Commands

#### /help
Shows help message with available commands.

**Usage:**
```bash
/help
```

#### /quit or /exit
Exits the CLI.

**Usage:**
```bash
/quit
/exit
```

#### /clear
Clears conversation history (keeps system prompt).

**Usage:**
```bash
/clear
```

#### /version
Shows VIBE CLI version.

**Usage:**
```bash
/version
```

### Model & Provider Commands

#### /model
Opens model selection menu to switch AI model.

**Usage:**
```bash
/model
```

#### /models
Shows list of compatible models with function calling support.

**Usage:**
```bash
/models
```

#### /provider
Opens provider selection menu to switch AI provider.

**Usage:**
```bash
/provider
```

**Available Providers:**
- MegaLLM (Recommended)
- OpenRouter
- AgentRouter
- Routeway

### File & Project Commands

#### /create
Creates files from the last AI response (manual trigger).

**Usage:**
```bash
/create
```

**When to use:**
- AI provided code but didn't create files automatically
- You want to manually trigger file creation from previous response

#### /init
Initializes a new project.

**Usage:**
```bash
/init
```

#### /analyze
Analyzes the current project structure and codebase.

**Usage:**
```bash
/analyze
```

### Development Commands

#### /tools
Shows all available tools with descriptions.

**Usage:**
```bash
/tools
```

#### /agent
Starts autonomous agent mode for complex multi-step tasks.

**Usage:**
```bash
/agent
```

#### /workflow
Manages workflows and automation.

**Usage:**
```bash
/workflow
```

#### /metrics
Shows usage metrics and statistics.

**Usage:**
```bash
/metrics
```

---

## Tool Usage Examples

### File Creation Workflow

1. **User Request:**
   ```
   create a todo app with React
   ```

2. **AI Response:**
   ```javascript
   <!-- filename: todo-app/src/App.jsx -->
   import { useState } from 'react';
   
   export default function App() {
     const [todos, setTodos] = useState([]);
     return <div>Todo App</div>;
   }
   ```

3. **System Action:**
   - Automatically parses code blocks
   - Detects filename comments
   - Calls `write_file` tool
   - Creates `todo-app/src/App.jsx`

### Search and Replace Workflow

1. **User Request:**
   ```
   Find all console.log statements and remove them
   ```

2. **System Actions:**
   - Calls `search_file_content` with pattern "console.log"
   - Finds all occurrences
   - Calls `replace` tool for each file
   - Removes console.log statements

### Shell Command Workflow

1. **User Request:**
   ```
   Install dependencies and start the server
   ```

2. **System Actions:**
   - Calls `run_shell_command` with "npm install"
   - Waits for completion
   - Calls `run_shell_command` with "npm start"

---

## Command Cheat Sheet

```bash
# Essential
/help       # Show help
/quit       # Exit CLI
/clear      # Clear history
/version    # Show version

# Models & Providers
/model      # Switch model
/models     # Show compatible models
/provider   # Switch provider

# Files & Projects
/create     # Create files from last response
/init       # Initialize project
/analyze    # Analyze project

# Development
/tools      # Show tools
/agent      # Autonomous mode
/workflow   # Manage workflows
/metrics    # Show metrics
```

---

## Tool Confirmation Requirements

Some tools require user confirmation before execution:

**Requires Confirmation:**
- `write_file` - Creates/overwrites files
- `replace` - Modifies file content
- `run_shell_command` - Executes shell commands

**No Confirmation Needed:**
- `list_directory` - Read-only
- `read_file` - Read-only
- `glob` - Read-only
- `search_file_content` - Read-only
- `web_fetch` - Read-only
- `google_web_search` - Read-only
- `save_memory` - Internal state
- `write_todos` - Internal state

---

## Function Calling Compatibility

All tools require the AI model to support function calling. If you see raw tool syntax like:

```
<|tool_call_begin|>...
<minimax:tool_call>...
```

Your model doesn't support function calling. Switch to a compatible model:

```bash
/models     # See compatible models
/model      # Switch model
```

**Compatible Models:**
- anthropic/claude-3.5-sonnet (OpenRouter)
- openai/gpt-4o-mini (OpenRouter)
- google/gemini-2.0-flash-exp:free (OpenRouter)
- qwen/qwen3-next-80b-a3b-instruct (MegaLLM)

---

## Best Practices

### For File Operations
1. Use `read_file` before `write_file` to understand existing code
2. Use `glob` to find files before `search_file_content`
3. Use `replace` for targeted edits, `write_file` for complete rewrites

### For Shell Commands
1. Explain what commands do before running them
2. Use `description` parameter for clarity
3. Chain related commands with && or ;

### For Search Operations
1. Use specific patterns for better results
2. Combine `glob` and `search_file_content` for targeted searches
3. Use `include` parameter to filter file types

### For Memory
1. Use `save_memory` for important context
2. Use `write_todos` to track multi-step tasks
3. Clear memory when starting new tasks

---

**Last Updated:** 2025-12-04  
**Version:** 7.0.2
