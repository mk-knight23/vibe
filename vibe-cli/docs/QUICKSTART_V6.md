# Vibe CLI v6.0 - Quick Start Guide

## Installation

```bash
npm install -g vibe-ai-cli@6.0.0
```

## Basic Usage

### Start Interactive Chat
```bash
vibe
```

### List Available Commands
```bash
vibe help
```

## New Features Quick Tour

### 1. Workflows

**List workflows:**
```bash
vibe workflow list
```

**Run project setup:**
```bash
vibe workflow run project-setup projectDir=./my-new-app
```

**Get workflow info:**
```bash
vibe workflow info project-setup
```

### 2. Templates

**List templates:**
```bash
vibe template list
```

**Create React app:**
```bash
vibe template create react-ts
```

**Create Node.js API:**
```bash
vibe template create node-api
```

### 3. Performance Monitoring

**View metrics:**
```bash
vibe metrics
```

**View errors:**
```bash
vibe metrics errors
```

**Clear metrics:**
```bash
vibe metrics clear
```

## Common Workflows

### Create a New React Project
```bash
# Create from template
vibe template create react-ts my-react-app

# Navigate to project
cd my-react-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### Create a Node.js API
```bash
# Create from template
vibe template create node-api my-api

# Navigate to project
cd my-api

# Install dependencies
npm install

# Start development server
npm run dev
```

### Automated Project Setup
```bash
# Run complete setup workflow
vibe workflow run project-setup projectDir=./my-project

# This will:
# 1. Create project directory
# 2. Initialize Git
# 3. Install dependencies
```

### Code Review Workflow
```bash
# Review specific files
vibe workflow run code-review files=src/**/*.ts

# This will:
# 1. Analyze changed files
# 2. Check code style
# 3. Generate review report
```

## Interactive Mode Commands

When in interactive chat mode (`vibe`):

```
/help       - Show help
/model      - Change AI model
/provider   - Change provider
/create     - Create files from response
/tools      - List available tools
/clear      - Clear conversation
/quit       - Exit
```

## Configuration

### View Configuration
```bash
vibe config list
```

### Set API Key
```bash
vibe config set openrouter.apiKey sk-or-...
```

### Get Configuration Value
```bash
vibe config get openrouter.apiKey
```

### Reset Configuration
```bash
vibe config reset
```

## Provider Management

### List Available Providers
```bash
vibe provider
```

### Switch Provider
```bash
vibe provider megallm
```

### List Models for Provider
```bash
vibe models
vibe models openrouter
```

## System Status

### Check System Status
```bash
vibe status
```

This shows:
- Current provider
- Configuration status
- Working directory
- Provider connectivity

## Tips & Tricks

### 1. Use Workflows for Repetitive Tasks
Instead of manually running multiple commands, create a workflow:
```bash
vibe workflow run deployment projectDir=./my-app
```

### 2. Monitor Performance
Keep track of CLI performance:
```bash
vibe metrics
```

### 3. Use Templates for Consistency
Start new projects with templates to ensure consistency:
```bash
vibe template create react-ts
```

### 4. Check Errors
If something goes wrong, check the error log:
```bash
vibe metrics errors
```

### 5. Interactive Mode is Powerful
Use interactive mode for complex tasks:
```bash
vibe
> Create a REST API with authentication
```

## Troubleshooting

### Build Errors
```bash
cd vibe-cli
npm run build
```

### Clear Cache
```bash
rm -rf ~/.vibe/cache
```

### Reset Configuration
```bash
vibe config reset
```

### Check Connectivity
```bash
vibe status
```

## Next Steps

1. **Explore Templates**: `vibe template list`
2. **Try Workflows**: `vibe workflow list`
3. **Monitor Performance**: `vibe metrics`
4. **Read Full Documentation**: See UPGRADE_V6.md

## Getting Help

- **Documentation**: https://vibe-ai.vercel.app
- **Issues**: https://github.com/mk-knight23/vibe/issues
- **In-CLI Help**: `vibe help`

---

Happy coding with Vibe CLI v6.0! 🚀
