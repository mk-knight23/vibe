# Contributing to VIBE CLI

Thank you for your interest in contributing to VIBE CLI! This document provides guidelines and information for contributors.

## 🚀 Quick Start

1. **Fork** the repository on GitHub
2. **Clone** your fork locally
3. **Install** dependencies: `npm install`
4. **Build** the project: `npm run build`
5. **Test** your changes: `npm test`
6. **Submit** a pull request

## 🛠️ Development Setup

```bash
# Clone the repository
git clone https://github.com/mk-knight23/vibe.git
cd vibe/vibe-cli

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Start development
npm run dev
```

## 📋 Development Workflow

### 1. Choose an Issue
- Check [GitHub Issues](https://github.com/mk-knight23/vibe/issues) for open tasks
- Look for issues labeled `good first issue` or `help wanted`

### 2. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number-description
```

### 3. Make Changes
- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass

### 4. Commit Changes
```bash
git add .
git commit -m "feat: add new feature description"
```

Use conventional commit format:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation
- `test:` - Tests
- `refactor:` - Code refactoring

### 5. Submit Pull Request
- Push your branch to GitHub
- Create a pull request with a clear description
- Reference any related issues

## 🧪 Testing

### Running Tests
```bash
# All tests
npm test

# Specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:security
npm run test:performance

# With coverage
npm run test:coverage
```

### Writing Tests
- Add tests for new features in appropriate test files
- Follow existing test patterns and naming conventions
- Ensure tests are isolated and reliable
- Test both success and failure scenarios

## 📚 Code Style

### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow existing naming conventions
- Add JSDoc comments for public APIs
- Use async/await over Promises when possible

### Error Handling
- Use proper error types and messages
- Handle edge cases gracefully
- Provide helpful error messages to users

### Performance
- Consider performance implications of changes
- Use efficient algorithms and data structures
- Avoid memory leaks

## 🔧 Architecture Guidelines

### Core Principles
- **Modular**: Keep components focused and reusable
- **Testable**: Design for testability
- **Maintainable**: Write clear, documented code
- **Performant**: Optimize for speed and memory usage

### File Organization
```
src/
├── cli/           # CLI interface and commands
├── core/          # Core business logic
├── tools/         # Tool implementations
├── utils/         # Utility functions
└── commands/      # Command handlers
```

### Tool Development
- Tools should be stateless when possible
- Include proper error handling
- Provide clear descriptions and parameters
- Follow the established tool interface

## 📖 Documentation

### Code Documentation
- Add JSDoc comments to public functions
- Document complex algorithms and edge cases
- Keep comments up to date with code changes

### User Documentation
- Update README.md for user-facing changes
- Add examples for new features
- Update command documentation

## 🔒 Security

- Never commit sensitive information
- Use environment variables for secrets
- Follow secure coding practices
- Report security issues privately

## 🤝 Code Review Process

1. **Automated Checks**: CI runs tests and linting
2. **Peer Review**: At least one maintainer reviews changes
3. **Testing**: Ensure all tests pass and new tests are added
4. **Documentation**: Verify docs are updated
5. **Merge**: Approved PRs are merged by maintainers

## 📞 Getting Help

- **Issues**: [GitHub Issues](https://github.com/mk-knight23/vibe/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mk-knight23/vibe/discussions)
- **Discord**: Join our community Discord

## 🎯 Areas for Contribution

### High Priority
- Bug fixes and performance improvements
- Additional AI model support
- Enhanced error handling
- Documentation improvements

### Medium Priority
- New tools and integrations
- UI/UX improvements
- Additional test coverage
- Performance optimizations

### Future Ideas
- Plugin system
- GUI interface
- Mobile app
- Cloud deployment integrations

Thank you for contributing to VIBE CLI! 🎉
