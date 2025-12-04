# VIBE CLI - User Guide

## What is VIBE?

VIBE is an AI-powered development platform that brings 60+ commands, 42+ tools, and multi-provider AI support directly to your terminal. Build projects, debug code, automate workflows, and deploy to cloud - all through natural conversation with AI.

## Key Features

### 🤖 Multi-Provider AI
- **OpenRouter** - Access 27+ models (GPT-4, Claude, Gemini)
- **MegaLLM** - Free API with powerful models
- **AgentRouter** - Specialized AI agents
- **Routeway** - Optimized routing

### 🛠️ 42+ Development Tools
- File operations (read, write, search, glob)
- Shell command execution
- Web scraping & API calls
- Git operations
- Package management
- Code analysis

### 📦 60+ CLI Commands
- Project scaffolding
- Code generation
- Debugging assistance
- DevOps automation
- Cloud deployment
- Workflow management

### ⚡ Advanced Capabilities
- Multi-file editing
- Context-aware memory
- Agent-based workflows
- Real-time monitoring
- Session management

## Installation

```bash
npm install -g vibe-ai-cli
```

## Quick Start

```bash
# Start VIBE
vibe

# Or use alias
vibe7
```

## Basic Usage

### Starting a New Project
```
You: Create a React app with TypeScript
VIBE: [Creates project structure, installs dependencies]
```

### Debugging Code
```
You: Debug the authentication error in auth.ts
VIBE: [Analyzes code, identifies issue, suggests fix]
```

### Deploying to Cloud
```
You: Deploy this to Vercel
VIBE: [Configures deployment, pushes to Vercel]
```

## Available Commands

### Slash Commands
- `/help` - Show all commands
- `/model` - Switch AI model
- `/provider` - Change AI provider
- `/clear` - Clear conversation
- `/memory` - View memory status
- `/quit` - Exit VIBE

### Project Commands
- Create new projects
- Generate components
- Add features
- Refactor code
- Write tests

### DevOps Commands
- Docker setup
- Kubernetes config
- CI/CD pipelines
- Cloud deployment
- Monitoring setup

## Examples

### Example 1: Full-Stack App
```
You: Create a full-stack todo app with Next.js and Prisma
VIBE: [Generates complete app with database, API, UI]
```

### Example 2: API Integration
```
You: Add Stripe payment integration
VIBE: [Adds Stripe SDK, creates payment routes, UI components]
```

### Example 3: Testing
```
You: Write tests for the user service
VIBE: [Generates comprehensive test suite]
```

## Tips & Tricks

1. **Be Specific** - Clear instructions get better results
2. **Use Context** - VIBE remembers your conversation
3. **Iterate** - Refine results through conversation
4. **Explore Tools** - Try different commands and features
5. **Save Sessions** - Use memory to continue later

## Troubleshooting

### VIBE won't start
```bash
# Reinstall
npm uninstall -g vibe-ai-cli
npm install -g vibe-ai-cli
```

### API errors
- Check internet connection
- Verify API keys (if using paid providers)
- Try switching providers with `/provider`

### Command not working
- Use `/help` to see available commands
- Check command syntax
- Try rephrasing your request

## Support

- GitHub: https://github.com/mk-knight23/vibe
- Issues: https://github.com/mk-knight23/vibe/issues
- NPM: https://www.npmjs.com/package/vibe-ai-cli
- Website: https://vibe-ai.vercel.app

## Version

Current: 7.0.7
