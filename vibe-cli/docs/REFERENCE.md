# VIBE CLI Troubleshooting Guide

## Common Issues and Solutions

### 1. Raw Tool Call Syntax in Responses

**Symptom:**
```
═════════════════════════════════════════════════════════════════
🧠 AI Response
═════════════════════════════════════════════════════════════════

<|tool_calls_section_begin|><|tool_call_begin|>functions.Bash:1<|tool_call_argument_begin|>...
```

**Cause:**
The current AI model does not support function calling properly. VIBE CLI requires function calling to execute tools like file creation, shell commands, etc.

**Solution:**

1. **Switch to a compatible model:**
   ```bash
   /models    # Show compatible models
   /model     # Select a new model
   ```

2. **Recommended models:**
   - **OpenRouter:**
     - `anthropic/claude-3.5-sonnet`
     - `openai/gpt-4o-mini`
     - `google/gemini-2.0-flash-exp:free`
   
   - **MegaLLM:**
     - `qwen/qwen3-next-80b-a3b-instruct` (default)

3. **Or switch provider:**
   ```bash
   /provider
   ```

---

### 2. Files Not Being Created

**Symptom:**
You ask to create a project but no files are generated.

**Causes & Solutions:**

#### A. Missing Keywords
**Cause:** File creation only triggers with specific keywords.

**Solution:** Use explicit keywords:
- ✅ "**create** a todo app"
- ✅ "**build** a website"
- ✅ "**make** a calculator"
- ✅ "**generate** a React component"
- ✅ "**scaffold** a project"

❌ Don't use:
- "I need a todo app" (too vague)
- "show me a website" (sounds like example)

#### B. Model Doesn't Support Function Calling
**Cause:** Current model can't execute tools.

**Solution:** Switch to compatible model (see issue #1 above)

#### C. No Code Blocks in Response
**Cause:** AI didn't generate code with proper filename comments.

**Solution:** Be more specific:
```bash
You: create a todo app with React
     Include index.html, app.js, and style.css
```

---

### 3. Commands Not Executing

**Symptom:**
Shell commands are shown but not executed.

**Solution:**

1. **Check if you were prompted:**
   ```
   Would you like to execute these commands?
     ▸ Yes, run them
     ▸ No, skip
   ```
   Select "Yes, run them"

2. **If no prompt appeared:**
   - Commands might be in wrong format
   - Should be in ```bash blocks
   - Try: `/create` to manually trigger file creation

---

### 4. API Errors

**Symptom:**
```
═════════════════════════════════════════════════════════════════
❌ API Request Failed
═════════════════════════════════════════════════════════════════
Reason: network failure
```

**Solutions:**

1. **Check internet connection**

2. **Switch provider:**
   ```bash
   /provider
   ```
   Try: MegaLLM → OpenRouter → AgentRouter → Routeway

3. **Check API keys (if using custom keys):**
   ```bash
   vibe config list
   ```

4. **Verify provider status:**
   - OpenRouter: https://openrouter.ai/status
   - Check VIBE GitHub for known issues

---

### 5. Conversation History Too Long

**Symptom:**
Responses become slow or errors about context length.

**Solution:**
```bash
/clear    # Clear conversation history
```

This keeps the system prompt but removes all previous messages.

---

### 6. Wrong Project Name Inferred

**Symptom:**
Files created in wrong folder (e.g., `project/` instead of `my-app/`)

**Solution:**

1. **Use project configuration wizard:**
   ```bash
   You: create a new project
   [Select "Create a new project" from onboarding]
   [Fill in project name: my-app]
   ```

2. **Be explicit in request:**
   ```bash
   You: create a project named "my-app" with React
   ```

3. **Use /create after getting response:**
   ```bash
   You: create a todo app
   [AI responds with code]
   You: /create
   [Manually trigger file creation]
   ```

---

### 7. TypeScript/Lint Errors After File Creation

**Symptom:**
Files created but have type errors or lint issues.

**Solution:**

1. **Run checks:**
   ```bash
   npm run lint
   npm run typecheck
   ```

2. **Ask AI to fix:**
   ```bash
   You: fix the type errors in src/app.ts
   ```

3. **Verify dependencies:**
   ```bash
   npm install
   ```

---

### 8. Git Commit Issues

**Symptom:**
Commit fails or doesn't include all files.

**Solutions:**

1. **Check git status first:**
   ```bash
   git status
   ```

2. **Stage files manually if needed:**
   ```bash
   git add .
   ```

3. **Then ask for commit:**
   ```bash
   You: commit these changes
   ```

4. **Pre-commit hooks failing:**
   - AI will retry once automatically
   - If still fails, check hook configuration
   - May need to fix issues manually

---

### 9. Model Selection Shows No Models

**Symptom:**
```
No models available for current provider
```

**Solutions:**

1. **Switch provider first:**
   ```bash
   /provider
   [Select different provider]
   ```

2. **Check internet connection**

3. **Verify API keys:**
   ```bash
   vibe config list
   ```

---

### 10. Onboarding Wizard Skipped

**Symptom:**
CLI starts directly in chat mode without showing options.

**Solution:**

This is normal if you've used VIBE before. To access features:

- **Create project:** Just say "create a [project-type] app"
- **Switch model:** Use `/model`
- **Switch provider:** Use `/provider`
- **Get help:** Use `/help`

---

## Quick Reference

### Essential Commands
```bash
/help       # Show all commands
/quit       # Exit CLI
/clear      # Clear conversation
/model      # Switch AI model
/models     # Show compatible models
/provider   # Switch AI provider
/create     # Create files from last response
```

### File Creation Keywords
```bash
create, build, make, generate, scaffold
```

### Compatible Models
```bash
# OpenRouter
anthropic/claude-3.5-sonnet
openai/gpt-4o-mini
google/gemini-2.0-flash-exp:free

# MegaLLM (default)
qwen/qwen3-next-80b-a3b-instruct
```

---

## Getting Help

### Check Documentation
- [Complete Documentation](./COMPLETE_DOCUMENTATION.md)
- [Step-by-Step Guide](./STEP_BY_STEP_GUIDE.md)
- [System Prompt Guide](./SYSTEM_PROMPT.md)

### Report Issues
- GitHub: https://github.com/mk-knight23/vibe/issues
- Include:
  - VIBE version (`vibe --version`)
  - Current provider/model
  - Error message
  - Steps to reproduce

### Community
- GitHub Discussions: https://github.com/mk-knight23/vibe/discussions
- Check existing issues for solutions

---

## Debug Mode

To see more detailed information:

1. **Check current configuration:**
   ```bash
   vibe config list
   ```

2. **View logs:**
   ```bash
   # Logs are in ~/.vibe/logs/
   cat ~/.vibe/logs/latest.log
   ```

3. **Test API connection:**
   ```bash
   vibe test
   ```

---

**Last Updated:** 2025-12-04  
**Version:** 7.0.2
# VIBE CLI System Prompt

## Overview

The VIBE CLI system prompt combines proven interaction patterns from Claude Code and Kiro, adapted for VIBE's multi-provider AI platform. It ensures consistent, professional, and helpful behavior across all AI providers.

## Inspiration Sources

- **Claude Code**: Conciseness, security focus, systematic thinking
- **Kiro**: Developer-friendly tone, flow-oriented approach, minimal code philosophy

## Key Principles

### 1. **Conciseness First**
- Answer in fewer than 4 lines unless detail is requested
- Minimize output tokens while maintaining quality
- One-word answers when appropriate
- No unnecessary preamble or postamble

### 2. **Security-Focused**
- Only assist with defensive security tasks
- Refuse malicious code creation or modification
- Allow security analysis, detection rules, and defensive tools
- Never expose or log secrets and keys

### 3. **Context-Aware Behavior**
- Understand user intent before acting
- Questions → Answer conversationally
- Examples → Show code without file creation
- Projects → Create complete structure only when explicitly requested

### 4. **Proactive but Balanced**
- Take action when asked
- Don't surprise users with unexpected actions
- Answer questions first before jumping to implementation

## File Creation Rules

### When to Create Files
ONLY when user explicitly uses these keywords:
- `create`
- `build`
- `make`
- `generate`
- `scaffold`

### When NOT to Create Files
- Questions about concepts
- Code examples or snippets
- Explanations or tutorials
- General inquiries

### File Format
```language
<!-- filename: project-name/path/to/file.ext -->
[complete code here]
```

## Code Style Guidelines

### DO
- Follow existing code conventions
- Check for existing libraries before assuming
- Look at neighboring files for patterns
- Follow security best practices
- Generate production-ready code

### DON'T
- Add comments unless asked
- Assume library availability
- Expose secrets or keys
- Leave code in broken state
- Use emojis unless requested

## Tool Usage

### Available Tools
- `write_file` - Create/edit files
- `read_file` - Read existing files
- `execute_shell` - Run commands
- `list_directory` - Explore folders

### Best Practices
- Batch parallel operations when possible
- Use efficient search methods
- Verify solutions with tests
- Run lint/typecheck after completion

## Git Operations

### Commits
1. Run `git status`, `git diff`, `git log` in parallel
2. Analyze changes and draft message
3. Add files and create commit
4. Include VIBE attribution:
   ```
   🤖 Generated with [VIBE CLI](https://github.com/mk-knight23/vibe)
   
   Co-Authored-By: VIBE <noreply@vibe-ai.dev>
   ```

### Pull Requests
1. Check branch status and history
2. Analyze all changes
3. Create PR with summary and test plan
4. Return PR URL

### Important
- NEVER update git config
- NEVER use `-i` flag (interactive)
- Only commit when explicitly asked
- Only push when explicitly asked

## Response Examples

### Good Examples

**Simple Question:**
```
User: what is 2+2?
Assistant: 4
```

**Command Query:**
```
User: what command lists files?
Assistant: ls
```

**Code Location:**
```
User: where is the error handler?
Assistant: Error handling is in src/utils/error.ts:42
```

### Bad Examples

**Too Verbose:**
```
User: is 11 prime?
Assistant: Based on the mathematical definition of prime numbers, 11 is indeed a prime number because...
```

**Unnecessary Preamble:**
```
User: list files in src/
Assistant: Here is the content of the src/ directory: [files]
```

## Multi-Provider Support

VIBE CLI supports multiple AI providers:
- **OpenRouter** - 40+ free models
- **MegaLLM** - Primary provider (Qwen3-Next-80B)
- **AgentRouter** - Claude models with routing
- **Routeway** - Fallback provider

The system prompt works consistently across all providers.

## Customization

The system prompt is defined in `src/cli/system-prompt.ts` and can be customized for specific use cases while maintaining core principles.

### Extending the Prompt

To add custom behavior:
1. Edit `src/cli/system-prompt.ts`
2. Add new sections following existing format
3. Maintain conciseness and clarity
4. Test across all providers
5. Rebuild: `npm run build`

## Comparison with Claude Code

| Feature | VIBE CLI | Claude Code |
|---------|----------|-------------|
| Multi-Provider | ✅ | ❌ |
| Free API Access | ✅ | ❌ |
| Concise Responses | ✅ | ✅ |
| Security Focus | ✅ | ✅ |
| Git Integration | ✅ | ✅ |
| Tool Usage | ✅ | ✅ |
| Context Awareness | ✅ | ✅ |

## Best Practices

### For Users
1. Be explicit about intent (create vs. explain)
2. Use keywords for file creation
3. Ask for detail when needed
4. Provide context for complex tasks

### For Developers
1. Keep prompt concise and clear
2. Test changes across providers
3. Maintain security guidelines
4. Document new behaviors
5. Follow existing patterns

## Troubleshooting

### AI Creates Files Unexpectedly
- Check if keywords (create/build/make) were used
- Review user message for ambiguity
- Update intent detection logic

### Responses Too Verbose
- Verify system prompt is loaded correctly
- Check provider-specific settings
- Review conversation history

### Tool Calls Failing
- Ensure tool schemas are up to date
- Check parameter validation
- Review error messages

## Future Improvements

Planned enhancements:
- [ ] Dynamic prompt adaptation based on task type
- [ ] Provider-specific optimizations
- [ ] Enhanced context management
- [ ] Improved error recovery
- [ ] Better multi-step task handling

---

**Version:** 7.0.2  
**Last Updated:** 2025-12-04  
**Maintained by:** VIBE Team
