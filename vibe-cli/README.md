# VIBE CLI v7.0.7

**Next-Gen AI Development Platform** - 60+ Commands | 42+ Tools | Multi-Provider AI | Free API Access

[![npm version](https://badge.fury.io/js/vibe-ai-cli.svg)](https://www.npmjs.com/package/vibe-ai-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)

## 🚀 What is VIBE?

VIBE is an AI-powered development platform that brings the power of multiple AI providers directly to your terminal. Build projects, debug code, automate workflows, and deploy to cloud - all through natural conversation.

## ✨ Features

### 🤖 Multi-Provider AI Support
- **OpenRouter** - Access 27+ models (GPT-4, Claude, Gemini, DeepSeek)
- **MegaLLM** - Free API with powerful models
- **AgentRouter** - Specialized AI agents for specific tasks
- **Routeway** - Optimized routing for best performance

### 🛠️ 42+ Development Tools
- **File Operations** - Read, write, search, glob patterns
- **Shell Execution** - Run commands with safety checks
- **Web Scraping** - HTTP requests, API calls, data extraction
- **Git Operations** - Version control automation
- **Package Management** - npm, yarn, pnpm support
- **Code Analysis** - Linting, formatting, testing

### 📦 60+ CLI Commands
- **Project Scaffolding** - Create full-stack apps instantly
- **Code Generation** - Components, APIs, tests
- **Debugging** - AI-powered error analysis
- **DevOps** - Docker, Kubernetes, CI/CD
- **Cloud Deployment** - Vercel, AWS, Firebase
- **Workflow Automation** - Custom workflows

### ⚡ Advanced Capabilities
- **Multi-File Editing** - Edit multiple files simultaneously
- **Context-Aware Memory** - Remembers your project context
- **Agent-Based Workflows** - Complex tasks broken into steps
- **Real-Time Monitoring** - Track operations and performance
- **Session Management** - Save and resume work
- **Tool Execution Tracking** - Monitor all operations

## 📦 Installation

```bash
npm install -g vibe-ai-cli
```

## 🎯 Quick Start

```bash
# Start VIBE
vibe

# Or use version-specific alias
vibe7
```

## 💡 Usage Examples

### Create a Full-Stack App
```bash
vibe
> Create a Next.js app with TypeScript, Tailwind, and Prisma
```

### Debug Code
```bash
vibe
> Debug the authentication error in src/auth.ts
```

### Deploy to Cloud
```bash
vibe
> Deploy this project to Vercel with environment variables
```

### Generate Tests
```bash
vibe
> Write comprehensive tests for the user service
```

### Setup DevOps
```bash
vibe
> Create Docker setup with multi-stage builds
```

## 🎮 Available Commands

### Slash Commands
| Command | Description |
|---------|-------------|
| `/help` | Show all available commands |
| `/model` | Switch AI model |
| `/provider` | Change AI provider |
| `/clear` | Clear conversation history |
| `/memory` | View memory and context |
| `/quit` | Exit VIBE |

### Natural Language Commands
Just describe what you want in plain English:
- "Create a React component for user profile"
- "Add authentication to my Express API"
- "Write tests for the payment service"
- "Deploy to AWS with auto-scaling"
- "Setup CI/CD pipeline with GitHub Actions"

## 🏗️ Project Structure

```
vibe-cli/
├── src/
│   ├── cli/              # CLI interface & interactive mode
│   ├── core/             # Core functionality
│   │   ├── api.ts        # Multi-provider API client
│   │   ├── memory.ts     # Context-aware memory
│   │   ├── agents.ts     # Agent-based workflows
│   │   └── ...
│   ├── tools/            # 42+ development tools
│   ├── providers/        # AI provider integrations
│   ├── commands/         # 60+ CLI commands
│   └── utils/            # Utility functions
├── tests/                # Comprehensive test suites
└── docs/                 # Documentation
```

## 🔧 Configuration

VIBE works out of the box with free APIs. For advanced features:

```bash
# Optional: Set API keys for premium providers
export OPENROUTER_API_KEY="your-key"
export ANTHROPIC_API_KEY="your-key"
```

## 📚 Documentation

- **[User Guide](./docs/USER_GUIDE.md)** - Complete user documentation
- **[Developer Guide](./docs/DEVELOPER_GUIDE.md)** - Development and API reference
- **[Features](./docs/FEATURES.md)** - Detailed feature list
- **[Tools Reference](./docs/TOOLS.md)** - All available tools
- **[Code Structure](./docs/CODE_STRUCTURE.md)** - Architecture overview

## 🎓 Examples

### Example 1: Full-Stack Todo App
```
You: Create a full-stack todo app with Next.js, Prisma, and PostgreSQL
VIBE: [Generates complete app with database, API routes, UI components]
```

### Example 2: Microservices
```
You: Setup microservices architecture with Docker and Kubernetes
VIBE: [Creates services, Dockerfiles, K8s configs, API gateway]
```

### Example 3: Testing Suite
```
You: Add comprehensive testing with Jest and Playwright
VIBE: [Generates unit tests, integration tests, E2E tests]
```

## 🚀 Upgrades in v7.0.7

### New Features
- ✅ Enhanced error handling with context-aware messages
- ✅ Improved multi-file editing capabilities
- ✅ Better memory management and context retention
- ✅ Optimized provider switching
- ✅ Enhanced tool execution tracking

### Improvements
- ✅ Faster startup time (<1s)
- ✅ Better TypeScript support
- ✅ Comprehensive documentation
- ✅ Improved error messages
- ✅ Enhanced security measures

### Bug Fixes
- ✅ Fixed TypeScript compilation errors
- ✅ Resolved memory leaks
- ✅ Fixed provider switching issues
- ✅ Improved file operation reliability

## 🔒 Security

- Input validation on all operations
- Safe shell command execution
- Sandboxed file operations
- API key encryption
- Rate limiting support

## 🧪 Testing

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

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📝 License

MIT © KAZI

## 🌟 Support

- ⭐ Star this repo if you find it helpful
- 🐛 [Report bugs](https://github.com/mk-knight23/vibe/issues)
- 💡 [Request features](https://github.com/mk-knight23/vibe/issues)
- 💬 [Join discussions](https://github.com/mk-knight23/vibe/discussions)

## 🔗 Links

- **Website:** https://vibe-ai.vercel.app
- **GitHub:** https://github.com/mk-knight23/vibe
- **NPM:** https://www.npmjs.com/package/vibe-ai-cli
- **Issues:** https://github.com/mk-knight23/vibe/issues

## 📊 Stats

- **60+ Commands** - Comprehensive CLI toolkit
- **42+ Tools** - Development utilities
- **4 Providers** - Multi-provider AI support
- **27+ Models** - Access to latest AI models
- **Free API** - No credit card required

## 🎯 Use Cases

- **Rapid Prototyping** - Build MVPs in minutes
- **Code Generation** - Generate boilerplate code
- **Debugging** - AI-powered error analysis
- **DevOps** - Automate deployment workflows
- **Learning** - Learn by building with AI guidance
- **Productivity** - Automate repetitive tasks

## 💻 Requirements

- Node.js >= 16.0.0
- npm or yarn or pnpm
- Terminal with UTF-8 support

## 🚀 Getting Started

1. **Install**
   ```bash
   npm install -g vibe-ai-cli
   ```

2. **Run**
   ```bash
   vibe
   ```

3. **Start Building**
   ```
   > Create a React app with TypeScript
   ```

## 📈 Roadmap

- [ ] Plugin system
- [ ] Web dashboard
- [ ] Mobile app
- [ ] Team collaboration
- [ ] Enterprise features
- [ ] Custom AI models
- [ ] Marketplace for tools

## 🙏 Acknowledgments

- OpenRouter for API access
- MegaLLM for free API
- All contributors and users
- Open source community

---

**Made with ❤️ by KAZI**

**Version:** 7.0.7  
**License:** MIT  
**Status:** Production Ready
