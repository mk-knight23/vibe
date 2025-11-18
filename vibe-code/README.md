# Vibe VS Code Extension

**Version: 1.0.0** | **Status: Production Ready** | **License: MIT**

🔌 Feature-rich VS Code extension that brings the power of Vibe AI directly into your editor. Provides intelligent code assistance, multiple AI modes, and seamless workflow integration.

## 🎉 What's New in v1.0.0

- 🚀 **Initial Stable Release**: Production-ready VS Code extension
- 💬 **Advanced Chat Interface**: Rich conversational AI experience
- 🎭 **Multiple AI Modes**: Specialized personas for different tasks
- 🎯 **Context Awareness**: Understands your project structure
- ⌨️ **Keyboard Shortcuts**: Quick mode switching and actions
- 🔄 **Real-time Collaboration**: Live AI assistance while coding
- 🛡️ **Privacy-First**: Local processing with optional cloud features

## 🌟 Key Features

### 💬 Intelligent Chat System
- **Multi-Model Support**: Access to OpenRouter's free and premium models
- **Context-Aware Responses**: Understands your open files and project structure
- **Conversation History**: Persistent chat sessions across editor restarts
- **Code Snippet Integration**: Direct code insertion and application

### 🎭 Specialized AI Modes
- **🏗️ Architect Mode**: System design and planning
- **💻 Code Mode**: Implementation and debugging
- **❓ Ask Mode**: Q&A and explanations
- **🪲 Debug Mode**: Error analysis and resolution
- **🪃 Orchestrator Mode**: Multi-step workflow coordination
- **🔍 Research Mode**: Codebase analysis and documentation

### ⚡ Productivity Features
- **Keyboard Shortcuts**: Quick mode switching without leaving editor
- **Diff Preview**: Safe code modifications with review
- **Auto-Complete Integration**: AI-powered suggestions as you type
- **Multi-File Context**: Analyzes entire project structure
- **Task Automation**: Repetitive task execution

Core implementation is in [`src/extension.ts`](vibe-code/src/extension.ts:1). Extension metadata is in [`package.json`](vibe-code/package.json:1).

---

## Features

### Modes

Modes are managed in the extension backend and surfaced in the webview:

- Architect (🏗️) — plan and design.
- Code (💻) — write & refactor code.
- Ask (❓) — Q&A and explanations.
- Debug (🪲) — diagnose & fix issues.
- Orchestrator (🪃) — coordinate multi-step workflows.
- Project Research (🔍) — analyze and summarize the codebase.

Mode state is stored in the extension host and updated via webview messages (see mode handling in [`src/extension.ts`](https://github.com/mk-knight23/vibe-cli/blob/HEAD/src/extension.ts:131)).

### Personas

Personas tailor the assistant behavior per mode:

- Balanced — general purpose.
- System Architect — high-level design.
- Pair Programmer — implementation-focused.
- Debug Doctor — debugging expert.
- Research Analyst — codebase research.

Personas are defined in [`src/extension.ts`](https://github.com/mk-knight23/vibe-cli/blob/HEAD/src/extension.ts:80) and applied in a synthesized system prompt per request.

### Chat vs Agent Tabs

The webview UI provides:

- **Chat** tab — direct conversational usage.
- **Agent** tab — agent-style behavior, emphasizing checkpoints & todo planning.

Agent/tab selection is handled fully in the webview script and included in the message payload to the backend (see `isAgent` handling in [`src/extension.ts`](https://github.com/mk-knight23/vibe-cli/blob/HEAD/src/extension.ts:640)).

### OpenRouter Integration

- Uses `fetch` from Node 18+ to call `https://openrouter.ai/api/v1/chat/completions`.
- Default model: `z-ai/glm-4.5-air:free`.
- Several **top free models** are exposed in a dropdown for quick switching (see `TOP_FREE_MODELS` in [`src/extension.ts`](https://github.com/mk-knight23/vibe-cli/blob/HEAD/src/extension.ts:113)).

The request wrapper lives in `callOpenRouter(...)` in [`src/extension.ts`](https://github.com/mk-knight23/vibe-cli/blob/HEAD/src/extension.ts:812).

### Settings

Extension settings (via VS Code Settings UI or `settings.json`):

- `vibe.openrouterApiKey` (string) — your OpenRouter API key.
- `vibe.defaultModel` (string) — default model id (defaults to `z-ai/glm-4.5-air:free`).
- `vibe.autoApproveUnsafeOps` (boolean) — future toggle for auto-approving risky operations.
- `vibe.maxContextFiles` (number) — maximum files considered for context collection.

Configuration schema is defined in [`package.json`](https://github.com/mk-knight23/vibe-cli/blob/HEAD/package.json:26).

### Context Button

- **Context** button collects snippets from visible editors (URI, language, first 4k chars) and surfaces them in the sidebar.
- Implementation: `handleRequestContext` in [`src/extension.ts`](https://github.com/mk-knight23/vibe-cli/blob/HEAD/src/extension.ts:355).

This mimics Vibe-CLI’s context injection but is scoped to open editors to keep it safe and predictable.

---

## Commands & Keybindings

Commands are contributed in [`package.json`](https://github.com/mk-knight23/vibe-cli/blob/HEAD/package.json:34):

- `Vibe: Open Chat` (`vibe.openChat`) — opens the main Vibe panel in **Code** mode.
- `Vibe: Open Agent Panel` (`vibe.openAgent`) — opens the panel in **Architect** mode.
- `Vibe: Open Settings` (`vibe.openSettings`) — jumps to Vibe’s settings section.
- `Vibe: Next Mode (⌘+.)` (`vibe.switchNextMode`)
- `Vibe: Previous Mode (⌘+Shift+.)` (`vibe.switchPrevMode`)

Keybindings (when the Vibe panel is visible):

- Next mode: `⌘ + .` (macOS) / `Ctrl + .`
- Previous mode: `⌘ + ⇧ + .` / `Ctrl + ⇧ + .`

See the registration logic in `activate(...)` in [`src/extension.ts`](https://github.com/mk-knight23/vibe-cli/blob/HEAD/src/extension.ts:856).

---

## Building & Running

From this subdirectory (`vscode-extension/`):

```bash
npm install
npm run compile      # builds to ./dist
```

To develop or debug in VS Code:

1. Open this folder in VS Code.
2. Run **"Launch Extension"** debug configuration (you may need to create `.vscode/launch.json`).
3. In the Extension Development Host:
   - Open the Command Palette.
   - Run `Vibe: Open Chat` or `Vibe: Open Agent Panel`.
   - Set your `vibe.openrouterApiKey` in Settings and start chatting.

---

## Packaging for Marketplace

To build a `.vsix` package:

```bash
npm run compile
npx @vscode/vsce package
```

That will produce `vibe-vscode-*.vsix`, which you can:

- Install locally:  
  Command Palette → `Extensions: Install from VSIX...`
- Upload to the VS Code Marketplace under your publisher (`mk-knight23` as in [`package.json`](https://github.com/mk-knight23/vibe-cli/blob/HEAD/package.json:4)).

---

## 🚀 Versioning & Release

### Current Version
- **Version**: v1.0.0 (2024-11-18)
- **Tag Prefix**: `vibe-code-vX.Y.Z`
- **Release Type**: Independent semantic versioning

### Release Process
```bash
# Bump version (patch/minor/major)
npm version patch

# Commit and tag
git add package.json
git commit -m "vibe-code: bump to 1.0.1"
git tag vibe-code-v1.0.1

# Push to trigger automated release
git push origin vibe-code-v1.0.1
```

### Automated Workflows
- **`vibe-code-v*`** triggers:
  - VSIX packaging and build
  - VS Code Marketplace publishing
  - GitHub release with artifacts

## 🔮 Future Roadmap

### Planned Enhancements
- **🔄 Enhanced Diff Visualization**: Better code review interface
- **📝 Advanced Auto-Complete**: Context-aware suggestions
- **🎯 Task Templates**: Predefined workflow patterns
- **🔌 Theme Integration**: Match VS Code theme automatically
- **📊 Usage Analytics**: Privacy-first usage tracking
- **🌐 Multi-Language Support**: Internationalization

### Contributing Guidelines
- Follow VS Code extension development best practices
- Test across different VS Code versions
- Ensure accessibility compliance
- Maintain backward compatibility

## 📝 Notes & Architecture

This first stable release focuses on:

- **🎯 Solid Foundation**: Reliable chat panel with modes/personas
- **🔗 Ecosystem Integration**: Compatible with Vibe CLI and Web
- **🎨 Extensible Architecture**: Clean separation of concerns
- **🛡️ Privacy-First**: Local processing with optional cloud features
- **⚡ Performance**: Optimized for minimal resource usage

Most behavior is orchestrated in [`src/extension.ts`](vibe-code/src/extension.ts:1); new features should be added there using the existing webview messaging pattern (see `handleMessage` and the inline webview script).