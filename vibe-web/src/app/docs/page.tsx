import CodeBlock from "../../components/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Terminal, Code, FileText, Settings, Zap, Shield } from "lucide-react";

/**
 * Comprehensive Documentation Page
 * Detailed guides and reference materials for both Vibe CLI and Vibe VS Code extension.
 */

export default function DocumentationPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-12 md:pt-16 space-y-16">
      <header className="text-center">
        <h1 className="font-headline font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary text-[2.6rem] md:text-[3.2rem]">
          Documentation
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Comprehensive guides and reference materials for Vibe AI tools
        </p>
      </header>

      {/* Tabbed interface for CLI vs Code documentation */}
      <div className="glow-border ambient rounded-2xl p-2">
        <Tabs defaultValue="cli" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-xl bg-card/40 backdrop-blur-sm border border-border/40 p-1 relative z-10">
            <TabsTrigger
              value="cli"
              className="rounded-lg px-4 py-2 text-sm font-medium ease-smooth data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-foreground data-[state=active]:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_4px_12px_-2px_rgba(34,211,238,0.35)] hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Vibe CLI
            </TabsTrigger>
            <TabsTrigger
              value="code"
              className="rounded-lg px-4 py-2 text-sm font-medium ease-smooth data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-foreground data-[state=active]:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_4px_12px_-2px_rgba(34,211,238,0.35)] hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Vibe Code
            </TabsTrigger>
          </TabsList>

          {/* CLI Documentation */}
          <TabsContent value="cli" className="mt-8 animate-in fade-in-50 slide-in-from-top-2">
            <div className="space-y-12">
              <section className="space-y-8">
                <div className="rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm glow-border ambient">
                  <div className="flex items-center gap-3 mb-4">
                    <Terminal className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold text-foreground">Vibe CLI Overview</h2>
                  </div>
                  <p className="mb-4">
                    Vibe CLI is a privacy-first AI coding assistant that operates directly in your terminal.
                    It provides advanced chat, code generation, refactoring, debugging, testing, git automation,
                    and autonomous agent capabilities.
                  </p>
                  <p>
                    The CLI leverages free models from OpenRouter and other providers without compromising your privacy.
                  </p>
                </div>

                <div className="rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm glow-border ambient">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Core Commands</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3 text-sm uppercase tracking-wide text-muted-foreground/70">Chat & Interaction</h4>
                      <CodeBlock
                        code={`vibe chat "Hello"                              # One-off chat interaction
vibe                                          # Start interactive session
vibe generate "Build a Node server"          # Code generation
vibe explain                                  # Explain piped input`}
                        className="text-left"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium mb-3 text-sm uppercase tracking-wide text-muted-foreground/70">Development Tools</h4>
                      <CodeBlock
                        code={`vibe refactor src/**/*.ts                      # Apply refactor suggestions
vibe edit src/file.ts                         # Multi-file diff preview
vibe debug "error log"                        # Analyze errors
vibe test src/file.ts                         # Generate tests`}
                        className="text-left"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm glow-border ambient">
                  <div className="flex items-center gap-3 mb-4">
                    <Settings className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Advanced Features</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3 text-sm uppercase tracking-wide text-muted-foreground/70">Agent Mode</h4>
                      <CodeBlock
                        code={`vibe agent "Improve logging system" --auto    # Autonomous task execution
vibe plan "Build feature"                    # Create structured plan
vibe resume                                  # Resume interrupted session`}
                        className="text-left"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium mb-3 text-sm uppercase tracking-wide text-muted-foreground/70">Model Management</h4>
                      <CodeBlock
                        code={`vibe model list                              # List available models
vibe model use z-ai/glm-4.5-air:free        # Switch models
vibe cost                                    # Estimate token usage`}
                        className="text-left"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm glow-border ambient">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Configuration</h3>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground/70">Environment Variables</h4>
                    <CodeBlock
                      code={`export OPENROUTER_API_KEY=sk-or-...            # Your OpenRouter API key
export OPENAI_API_KEY=sk-...                   # Your OpenAI API key (if using)`}
                      className="text-left"
                    />
                    <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground/70 mt-4">Configuration File</h4>
                    <CodeBlock
                      code={`# Create ~/.vibe/config.json
{
  "defaultModel": "z-ai/glm-4.5-air:free",
  "maxContextFiles": 20,
  "autoApproveUnsafeOps": false
}`}
                      className="text-left"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm glow-border ambient">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Examples & Use Cases</h3>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Refactoring Example</h4>
                      <CodeBlock
                        code={`# Refactor all TypeScript files in src/
vibe refactor src/**/*.ts --type=optimize

# Review and approve changes interactively`}
                        className="text-left"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Debugging Example</h4>
                      <CodeBlock
                        code={`# Analyze a specific error
vibe debug "TypeError: Cannot read property 'length' of undefined"

# Get help with a failing test
vibe debug "tests/auth.test.js: expect(received).toBe(expected)"`}
                        className="text-left"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </TabsContent>

          {/* Code Documentation */}
          <TabsContent value="code" className="mt-8 animate-in fade-in-50 slide-in-from-top-2">
            <div className="space-y-12">
              <section className="space-y-8">
                <div className="rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm glow-border ambient">
                  <div className="flex items-center gap-3 mb-4">
                    <Code className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold text-foreground">Vibe VS Code Extension</h2>
                  </div>
                  <p className="mb-4">
                    The Vibe VS Code extension brings powerful AI assistance directly into your editor.
                    With multi-provider support (OpenRouter and MegaLLM), specialized AI modes, and a
                    rich chat interface, it enhances your development workflow.
                  </p>
                  <p>
                    The extension provides context-aware responses, conversation history, and seamless
                    integration with VS Code's existing workflow.
                  </p>
                </div>

                <div className="rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm glow-border ambient">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">AI Modes</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3 text-sm uppercase tracking-wide text-muted-foreground/70">Specialized Modes</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <span className="inline-block w-6 text-lg mr-2">🏗️</span>
                          <div>
                            <strong>Architect:</strong> Plan and design before implementation
                          </div>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-6 text-lg mr-2">💻</span>
                          <div>
                            <strong>Code:</strong> Write, modify, and refactor code
                          </div>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-6 text-lg mr-2">❓</span>
                          <div>
                            <strong>Ask:</strong> Get answers and explanations
                          </div>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-6 text-lg mr-2">🪲</span>
                          <div>
                            <strong>Debug:</strong> Diagnose and fix software issues
                          </div>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-6 text-lg mr-2">🪃</span>
                          <div>
                            <strong>Orchestrator:</strong> Coordinate tasks across modes
                          </div>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-6 text-lg mr-2">🔍</span>
                          <div>
                            <strong>Research:</strong> Investigate and analyze codebase
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3 text-sm uppercase tracking-wide text-muted-foreground/70">Personas</h4>
                      <ul className="space-y-3">
                        <li>
                          <strong>Balanced:</strong> General purpose assistant with safe defaults
                        </li>
                        <li>
                          <strong>System Architect:</strong> High-level design and trade-off analysis
                        </li>
                        <li>
                          <strong>Pair Programmer:</strong> Hands-on coding partner for implementation
                        </li>
                        <li>
                          <strong>Debug Doctor:</strong> Root cause analysis and fixes
                        </li>
                        <li>
                          <strong>Research Analyst:</strong> Deep codebase and dependency research
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm glow-border ambient">
                  <div className="flex items-center gap-3 mb-4">
                    <Settings className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Key Features</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3 text-sm uppercase tracking-wide text-muted-foreground/70">Interface Features</h4>
                      <ul className="space-y-3">
                        <li>• Click on messages to copy content</li>
                        <li>• Clear chat history with one click</li>
                        <li>• Smooth scrolling with custom scrollbars</li>
                        <li>• Auto-scroll control that respects manual scrolling</li>
                        <li>• Two operation modes: Chat and Agent</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3 text-sm uppercase tracking-wide text-muted-foreground/70">Keyboard Shortcuts</h4>
                      <ul className="space-y-3">
                        <li>
                          <kbd className="px-2 py-1 bg-muted rounded text-xs">Cmd/Ctrl</kbd> + <kbd className="px-2 py-1 bg-muted rounded text-xs">.</kbd>: Next mode
                        </li>
                        <li>
                          <kbd className="px-2 py-1 bg-muted rounded text-xs">Cmd/Ctrl</kbd> + <kbd className="px-2 py-1 bg-muted rounded text-xs">Shift</kbd> + <kbd className="px-2 py-1 bg-muted rounded text-xs">.</kbd>: Previous mode
                        </li>
                        <li>
                          <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd>: Send message
                        </li>
                        <li>
                          <kbd className="px-2 py-1 bg-muted rounded text-xs">Shift</kbd> + <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd>: New line in input
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm glow-border ambient">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Configuration</h3>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground/70">VS Code Settings</h4>
                    <CodeBlock
                      code={`{
  "vibe.provider": "openrouter",                 // or "megallm"
  "vibe.openrouterApiKey": "sk-or-...",
  "vibe.megallmApiKey": "your-megallm-key",
  "vibe.defaultModel": "z-ai/glm-4.5-air:free",
  "vibe.autoApproveUnsafeOps": false,
  "vibe.maxContextFiles": 20
}`}
                      className="text-left"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm glow-border ambient">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Examples & Use Cases</h3>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Using Different Modes</h4>
                      <ul className="space-y-2">
                        <li>• <strong>Architect Mode:</strong> Use when planning a new feature or system design</li>
                        <li>• <strong>Debug Mode:</strong> When you encounter an error and need help fixing it</li>
                        <li>• <strong>Research Mode:</strong> When exploring a large codebase you're unfamiliar with</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}