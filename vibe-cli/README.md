# VIBE CLI v7.0.5

**AI-Powered Development Platform** | 60+ Commands | 42+ Tools | 4 Providers | 27+ Models

---

## 🚀 Quick Start

```bash
# Install
npm install -g vibe-ai-cli

# Run
vibe

# Or use npx
npx vibe-ai-cli
```

---

## 📁 Project Structure

```
vibe-cli/
├── src/
│   ├── cli/          # CLI interface & interactive mode
│   ├── commands/     # All 60+ commands
│   ├── core/         # Core engine, agents, API
│   ├── providers/    # AI providers (OpenRouter, MegaLLM, AgentRouter, Routeway)
│   ├── tools/        # File, shell, web, memory tools
│   └── utils/        # Helpers & utilities
├── tests/            # Test suites (unit, integration, e2e, security, performance)
├── docs/             # Documentation (GUIDE.md, REFERENCE.md)
└── dist/             # Compiled output
```

---

## 🎯 Features

### Core Capabilities
- **60+ Commands**: Project scaffolding, code generation, debugging, testing
- **42+ Tools**: File operations, shell execution, web scraping, memory management
- **4 AI Providers**: OpenRouter, MegaLLM, AgentRouter, Routeway
- **27+ Models**: GPT-4, Claude, Gemini, DeepSeek, Qwen, and more
- **Multi-File Editing**: Edit multiple files simultaneously
- **Advanced Agents**: Autonomous task execution
- **Cloud Deployment**: Vercel, AWS, Firebase, Docker, Kubernetes
- **DevOps Suite**: CI/CD, monitoring, logging

### AI Providers
```bash
# OpenRouter - 100+ models
vibe /provider openrouter

# MegaLLM - Free API access
vibe /provider megallm

# AgentRouter - Specialized agents
vibe /provider agentrouter

# Routeway - Fast routing
vibe /provider routeway
```

### Available Models
- **OpenAI**: GPT-4, GPT-4 Turbo, GPT-3.5
- **Anthropic**: Claude 3.5 Sonnet, Claude 3 Opus
- **Google**: Gemini 2.0 Flash, Gemini Pro
- **DeepSeek**: DeepSeek V3, DeepSeek Coder
- **Qwen**: Qwen 3 Next 80B, Qwen 2.5 Coder
- **Meta**: Llama 3.3 70B, Llama 3.1 405B
- **And 20+ more models**

---

## 📖 Commands

### Slash Commands
```bash
/help              # Show all commands
/quit              # Exit VIBE
/clear             # Clear conversation
/version           # Show version
/model <name>      # Switch AI model
/models            # List available models
/provider <name>   # Switch provider
/create <project>  # Create new project
/tools             # List all tools
/agent <task>      # Run autonomous agent
/analyze           # Analyze codebase
/init <template>   # Initialize from template
/workflow <name>   # Run workflow
/metrics           # Show performance metrics
```

### Project Commands
```bash
# Create projects
vibe /create react-app my-app
vibe /create node-api my-api
vibe /create fullstack my-project

# Initialize from templates
vibe /init react-ts
vibe /init node-api
vibe /init nextjs
```

### Development Commands
```bash
# Code generation
"Create a React component for user profile"
"Generate API endpoints for user management"
"Write unit tests for authentication"

# Debugging
"Debug this error: [paste error]"
"Fix the bug in auth.ts"
"Optimize this function"

# Refactoring
"Refactor this code to use TypeScript"
"Convert class components to hooks"
"Add error handling"
```

### DevOps Commands
```bash
# Deployment
"Deploy to Vercel"
"Create Docker container"
"Setup Kubernetes deployment"

# CI/CD
"Setup GitHub Actions"
"Create deployment pipeline"
"Add automated testing"

# Monitoring
"Add logging"
"Setup error tracking"
"Create health checks"
```

---

## 🔧 Tools

### File Operations
- `list_directory` - List files and folders
- `read_file` - Read file contents
- `write_file` - Create/update files
- `glob` - Pattern matching
- `search_file_content` - Search in files
- `replace` - Find and replace

### Shell Operations
- `run_shell_command` - Execute commands
- Smart shell with context awareness
- Command history and suggestions

### Web Operations
- `web_fetch` - Fetch web content
- `google_web_search` - Search the web
- Web scraping and parsing

### Memory Operations
- `save_memory` - Save context
- `write_todos` - Task management
- Session persistence

---

## 🎨 Usage Examples

### 1. Create React App
```bash
vibe
> /create react-app my-app
> "Add routing with React Router"
> "Create login and dashboard pages"
> "Add Tailwind CSS styling"
```

### 2. Build API
```bash
vibe
> /create node-api my-api
> "Add user authentication with JWT"
> "Create CRUD endpoints for posts"
> "Add input validation"
```

### 3. Debug Code
```bash
vibe
> "Debug this error: TypeError: Cannot read property 'map' of undefined"
> "The error is in UserList.tsx line 45"
```

### 4. Deploy Project
```bash
vibe
> "Deploy this Next.js app to Vercel"
> "Setup environment variables"
> "Configure custom domain"
```

---

## ⚙️ Configuration

### Environment Variables
```bash
# API Keys (optional - free tier available)
export OPENROUTER_API_KEY=your_key
export MEGALLM_API_KEY=your_key

# Output format
export VIBE_JSON_OUTPUT=true

# Default provider
export VIBE_PROVIDER=megallm

# Default model
export VIBE_MODEL=qwen/qwen3-next-80b-a3b-instruct
```

### Config File
Create `~/.vibe/config.json`:
```json
{
  "provider": "megallm",
  "model": "qwen/qwen3-next-80b-a3b-instruct",
  "autoApprove": false,
  "maxTokens": 4096
}
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:security
npm run test:performance

# Run with coverage
npm run test:coverage
```

---

## 📊 Statistics

- **Folders**: 6 core folders
- **Files**: 79 TypeScript files
- **Source Size**: 432KB
- **Compiled Size**: 1.5MB
- **Tests**: 34 tests across 4 suites
- **Commands**: 60+ commands
- **Tools**: 42+ tools
- **Providers**: 4 AI providers
- **Models**: 27+ AI models

---

## 🔒 Security

- Input validation on all commands
- Dangerous command detection
- Shell command confirmation
- File operation safeguards
- API key encryption
- Secure credential storage

---

## 🚀 Performance

- Fast startup time (<1s)
- Efficient token usage
- Streaming responses
- Caching for repeated queries
- Optimized file operations
- Parallel tool execution

---

## 📚 Documentation

- **GUIDE.md** - Quick start guide and command reference
- **REFERENCE.md** - Troubleshooting and system prompt details
- **README.md** - This file

---

## 🤝 Contributing

```bash
# Clone repository
git clone https://github.com/mk-knight23/vibe.git
cd vibe/vibe-cli

# Install dependencies
npm install

# Build
npm run build

# Test
npm test

# Run locally
npm start
```

---

## 📝 License

MIT © KAZI

---

## 🔗 Links

- **GitHub**: https://github.com/mk-knight23/vibe
- **NPM**: https://www.npmjs.com/package/vibe-ai-cli
- **Website**: https://vibe-ai.vercel.app
- **Issues**: https://github.com/mk-knight23/vibe/issues

---

## 🎉 What's New in v7.0.5

### Complete Platform Release
- **3 Independent Tools**: CLI, Web Platform, VS Code Extension
- **Unified Documentation**: Comprehensive guides and references
- **Production Ready**: Fully tested and optimized
- **NPM Published**: Available globally via npm install

### Enhanced CLI Features
- 60+ commands for complete development workflow
- 42+ tools for file, shell, and web operations
- 4 AI providers with 27+ models
- Multi-file editing capabilities
- Advanced autonomous agents

### Improved Developer Experience
- Better error messages with actionable suggestions
- Interactive onboarding wizard
- Faster startup and response times
- Enhanced streaming support
- Comprehensive test coverage

### Bug Fixes & Optimizations
- Fixed TypeScript compilation issues
- Resolved import path problems
- Improved memory management
- Enhanced security measures
- Better error handling

---

## 🎉 What's New in v7.0.2

### Restructured Architecture
- Reduced from 24 folders to 6 core folders (75% reduction)
- Better organization with clear separation of concerns
- Shorter import paths and improved maintainability

### Enhanced Features
- Interactive onboarding wizard
- Project configuration prompts
- Enhanced system prompt with Claude Code patterns
- Improved error messages with suggestions
- Better streaming support

### Performance Improvements
- Faster build times
- Optimized file operations
- Reduced memory footprint
- Better caching strategies

### Bug Fixes
- Fixed automatic file creation on simple questions
- Resolved function calling compatibility issues
- Fixed import path issues
- Improved error handling

---

## 💡 Tips

1. **Use specific commands**: Instead of "create a file", use "create src/components/Button.tsx with a reusable button component"

2. **Provide context**: Share error messages, file contents, or project structure for better assistance

3. **Use agents for complex tasks**: `/agent "Build a complete authentication system with login, signup, and password reset"`

4. **Leverage templates**: Use `/init` to quickly scaffold projects with best practices

5. **Chain commands**: Execute multiple operations in sequence for complex workflows

---

## 🐛 Troubleshooting

### Command not found
```bash
# Reinstall globally
npm install -g vibe-ai-cli

# Or use npx
npx vibe-ai-cli
```

### API errors
```bash
# Check provider status
vibe /provider megallm

# Try different model
vibe /model qwen/qwen3-next-80b-a3b-instruct
```

### Build errors
```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

---

## 📋 Restructuring Summary (v7.0.2)

### Final Structure
- **6 folders** (reduced from 24 - 75% reduction)
- **63 TypeScript files** (optimized and organized)
- **2 documentation files** (consolidated from 9)
- **1 comprehensive README** (this file)

### Achievements
✅ Clean, minimal folder structure  
✅ Clear separation of concerns  
✅ All 60+ commands preserved  
✅ All 42+ tools functional  
✅ Zero breaking changes  
✅ Production ready  

### Structure
```
vibe-cli/
├── src/
│   ├── cli/          # 7 files - CLI interface
│   ├── commands/     # 28 files - All commands
│   ├── core/         # 13 files - Core engine
│   ├── providers/    # 5 files - AI providers
│   ├── tools/        # 7 files - Tools
│   └── utils/        # 8 files - Utilities
├── docs/
│   ├── GUIDE.md      # Quick start & commands
│   └── REFERENCE.md  # Troubleshooting & reference
└── README.md         # This file
```

### Benefits
- **75% fewer folders** - easier navigation
- **78% fewer docs** - consolidated information
- **Better organization** - logical grouping
- **Improved maintainability** - clear structure
- **Developer friendly** - easy to understand

---

**Built with ❤️ by KAZI | Powered by AI**
