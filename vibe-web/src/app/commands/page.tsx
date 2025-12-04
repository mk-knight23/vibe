import CodeBlock from "../../components/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

/**
 * Commands Reference Page
 * Extracted from previous landing page sections.
 * Purely presentational: exposes core CLI and VS Code usage groups.
 */

const cliGroups = [
  {
    title: "Basic usage",
    code: `vibe                 # Start interactive chat
vibe chat "message"  # One-off message
vibe help            # List commands`,
    description: "Entry points for interactive or one-off prompting."
  },
  {
    title: "AI agent & tooling",
    code: `vibe agent start
vibe codegen
vibe debug
vibe refactor
vibe testgen
vibe gittools
vibe multiedit`,
    description: "Automation and structured editing / review / generation flows."
  },
  {
    title: "Model management",
    code: `vibe model list
vibe model use <name>
vibe cost`,
    description: "Rotate among available models and inspect usage cost."
  },
  {
    title: "Development workflow",
    code: `vibe plan "feature"
vibe fix
vibe test
vibe run --yolo      # Auto-approval (use carefully)`,
    description: "Higher-level iterative workflow helpers. --yolo skips confirmations (use with caution)."
  },
  {
    title: "Configuration",
    code: `vibe config set <key> <value>
vibe theme set light
vibe resume`,
    description: "Persist CLI settings locally; resume previous session context."
  }
];

const codeGroups = [
  {
    title: "VS Code Commands",
    code: `vibe.openChat        # Open Chat panel
vibe.openAgent       # Open Agent panel
vibe.openSettings    # Open Settings`,
    description: "Open Vibe panels directly from VS Code command palette."
  },
  {
    title: "AI Modes",
    code: `vibe.switchNextMode       # Switch to next mode
vibe.switchPrevMode       # Switch to previous mode`,
    description: "Cycle through specialized AI modes: Architect, Code, Ask, Debug, Orchestrator, Project Research."
  },
  {
    title: "Quick Shortcuts",
    code: `Cmd/Ctrl + .         # Next mode
Cmd/Ctrl + Shift + .   # Previous mode`,
    description: "Keyboard shortcuts for quick mode switching."
  }
];

export default function CommandsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-12 md:pt-16 space-y-14">
      <header className="text-center">
        <h1 className="font-headline font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary text-[2.6rem] md:text-[3.2rem]">
          Commands Reference
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Complete reference for Vibe CLI and VS Code extension commands.
        </p>
      </header>

      {/* Tabs for CLI vs VS Code commands */}
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

          <TabsContent value="cli" className="mt-8 animate-in fade-in-50 slide-in-from-top-2">
            <section className="grid gap-8 md:grid-cols-2">
              {cliGroups.map(group => (
                <div
                  key={group.title}
                  className="space-y-4 rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm glow-border ambient"
                >
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground/70">
                    {group.title}
                  </h2>
                  {group.description && (
                    <p className="text-xs leading-relaxed text-muted-foreground/80">
                      {group.description}
                    </p>
                  )}
                  <CodeBlock code={group.code} className="text-left" />
                </div>
              ))}
            </section>
          </TabsContent>

          <TabsContent value="code" className="mt-8 animate-in fade-in-50 slide-in-from-top-2">
            <section className="grid gap-8 md:grid-cols-2">
              {codeGroups.map(group => (
                <div
                  key={group.title}
                  className="space-y-4 rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm glow-border ambient"
                >
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground/70">
                    {group.title}
                  </h2>
                  {group.description && (
                    <p className="text-xs leading-relaxed text-muted-foreground/80">
                      {group.description}
                    </p>
                  )}
                  <CodeBlock code={group.code} className="text-left" />
                </div>
              ))}
            </section>
          </TabsContent>
        </Tabs>
      </div>

      <footer className="pt-4 text-center text-xs text-muted-foreground/70">
        Need installation or onboarding? Visit the Install or Quick Start pages in the navigation.
      </footer>
    </div>
  );
}