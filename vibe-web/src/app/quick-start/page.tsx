"use client";

import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { Progress } from "../../components/ui/progress";
import CodeBlock from "../../components/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

/**
 * Enhanced Quick Start Page
 * Interactive onboarding for both Vibe CLI and Vibe VS Code extension.
 */

// Quick start items for CLI
const cliItems = [
  {
    value: "cli-item-1",
    title: "1. Install Vibe CLI",
    content: (
      <div className="space-y-5">
        <p className="mb-4 text-sm md:text-base text-muted-foreground">
          Install globally via npm, curl script, or package managers.
        </p>
        <div className="space-y-5">
          <div>
            <p className="mb-2 font-medium text-xs uppercase tracking-wide text-muted-foreground/70">
              # Option A: npm install
            </p>
            <CodeBlock code="npm install -g vibe-ai-cli" />
          </div>
          <div>
            <p className="mb-2 font-medium text-xs uppercase tracking-wide text-muted-foreground/70">
              # Option B: curl bootstrap (macOS/Linux)
            </p>
            <CodeBlock code="curl -fsSL https://raw.githubusercontent.com/mk-knight23/vibe/main/vibe-cli/install.sh | bash" />
          </div>
          <div>
            <p className="mb-2 font-medium text-xs uppercase tracking-wide text-muted-foreground/70">
              # Option C: Homebrew (macOS/Linux)
            </p>
            <CodeBlock code="brew tap mk-knight23/tap && brew install vibe-ai-cli" />
          </div>
          <div>
            <p className="mb-2 font-medium text-xs uppercase tracking-wide text-muted-foreground/70">
              # Option D: Windows (Chocolatey)
            </p>
            <CodeBlock code="choco install vibe-ai-cli" />
          </div>
        </div>
      </div>
    )
  },
  {
    value: "cli-item-2",
    title: "2. Set API key",
    content: (
      <div className="space-y-4">
        <p className="text-sm md:text-base text-muted-foreground">
          Set your OpenRouter API key to access free models. Keep the key local—workflow remains privacy-first.
        </p>
        <div className="space-y-3">
          <p className="font-medium text-sm">Option A: Environment variable</p>
          <CodeBlock code="export OPENROUTER_API_KEY=sk-or-..." />
          <p className="font-medium text-sm">Option B: CLI config</p>
          <CodeBlock code="vibe config set openrouter.apiKey sk-or-..." />
        </div>
      </div>
    )
  },
  {
    value: "cli-item-3",
    title: "3. Launch interactive chat",
    content: (
      <div className="space-y-3">
        <p className="text-sm md:text-base text-muted-foreground">
          Start a focused session to ask, refactor, generate tests, or draft code with explicit approval steps.
        </p>
        <CodeBlock code="vibe chat 'Hello, help me with a Node.js server'" />
      </div>
    )
  },
  {
    value: "cli-item-4",
    title: "4. Explore models & commands",
    content: (
      <div className="space-y-3">
        <p className="text-sm md:text-base text-muted-foreground">
          List available models and explore core commands to get familiar with the tool.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="font-medium text-sm mb-2">Available models</p>
            <CodeBlock code="vibe model list" />
          </div>
          <div>
            <p className="font-medium text-sm mb-2">Help command</p>
            <CodeBlock code="vibe --help" />
          </div>
        </div>
      </div>
    )
  },
  {
    value: "cli-item-5",
    title: "5. Try agent workflows",
    content: (
      <div className="space-y-3">
        <p className="text-sm md:text-base text-muted-foreground">
          Discover emerging agentic workflows for multi-step tasks (test generation, review orchestration).
        </p>
        <CodeBlock code="vibe agent 'Improve the error handling in my auth module'" />
      </div>
    )
  },
];

// Quick start items for VS Code Extension
const codeItems = [
  {
    value: "code-item-1",
    title: "1. Install Vibe Extension",
    content: (
      <div className="space-y-4">
        <p className="text-sm md:text-base text-muted-foreground">
          Install the Vibe VS Code extension from the marketplace.
        </p>
        <ol className="list-decimal list-inside space-y-2">
          <li>Open VS Code</li>
          <li>Go to Extensions (Ctrl+Shift+X or Cmd+Shift+X)</li>
          <li>Search for "vibe-vscode" or "Vibe VS Code"</li>
          <li>Click Install and restart VS Code</li>
        </ol>
      </div>
    )
  },
  {
    value: "code-item-2",
    title: "2. Configure API Keys",
    content: (
      <div className="space-y-4">
        <p className="text-sm md:text-base text-muted-foreground">
          Set your API keys in VS Code settings to access AI models.
        </p>
        <div className="space-y-3">
          <p className="font-medium text-sm">Steps to configure:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Open VS Code settings (Ctrl+, or Cmd+,)</li>
            <li>Search for "vibe"</li>
            <li>Enter your OpenRouter or MegaLLM API key</li>
          </ol>
          <p className="font-medium text-sm">Or use the Command Palette:</p>
          <CodeBlock code="Cmd+Shift+P → Type 'Vibe: Open Settings'" />
        </div>
      </div>
    )
  },
  {
    value: "code-item-3",
    title: "3. Open Vibe Panel",
    content: (
      <div className="space-y-3">
        <p className="text-sm md:text-base text-muted-foreground">
          Open the Vibe chat panel using the command palette or sidebar icon.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="font-medium text-sm mb-2">Command Palette</p>
            <CodeBlock code="Cmd+Shift+P → 'Vibe: Open Chat'" />
          </div>
          <div>
            <p className="font-medium text-sm mb-2">Or Sidebar</p>
            <p className="text-sm text-muted-foreground">Click the Vibe icon in the activity bar</p>
          </div>
        </div>
      </div>
    )
  },
  {
    value: "code-item-4",
    title: "4. Explore AI Modes",
    content: (
      <div className="space-y-3">
        <p className="text-sm md:text-base text-muted-foreground">
          Switch between specialized AI modes for different tasks: Architect, Code, Ask, Debug, etc.
        </p>
        <div className="space-y-3">
          <p className="font-medium text-sm">Keyboard shortcuts:</p>
          <CodeBlock code="Cmd+Period (.) → Next Mode" />
          <CodeBlock code="Cmd+Shift+Period (.) → Previous Mode" />
        </div>
      </div>
    )
  },
  {
    value: "code-item-5",
    title: "5. Try Agent Mode",
    content: (
      <div className="space-y-3">
        <p className="text-sm md:text-base text-muted-foreground">
          Experience the agent mode for multi-step tasks and planning.
        </p>
        <CodeBlock code="Cmd+Shift+P → 'Vibe: Open Agent Panel'" />
      </div>
    )
  },
];

const QuickStartContent = ({ items, toolName }: { items: any[], toolName: string }) => {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const progress = (openItems.length / items.length) * 100;

  return (
    <div className="rounded-2xl border border-border/50 bg-card/70 p-8 backdrop-blur-sm glow-border ambient ease-smooth">
      {/* Progress (Radix) + label */}
      <div className="mb-8 flex w-full items-center gap-5">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground/70">Progress</span>
        <div className="flex-1">
          <Progress
            value={progress}
            className="h-3 w-full bg-secondary/40 ring-1 ring-inset ring-border/40"
          />
        </div>
        <span className="text-sm font-semibold text-primary min-w-[3ch] text-right">{Math.round(progress)}%</span>
      </div>

      <Accordion
        type="multiple"
        value={openItems}
        onValueChange={(v) => setOpenItems(v)}
        className="w-full space-y-3"
      >
        {items.map((item, index) => (
          <AccordionItem
            value={item.value}
            key={item.value}
            className="overflow-hidden rounded-xl border border-border/50 bg-card/60 transition-all ease-smooth hover:border-accent/50 hover:bg-card/80"
          >
            <AccordionTrigger className="group flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/25 to-accent/25 text-sm font-semibold text-primary shadow-inner group-hover:from-primary/35 group-hover:to-accent/35 ease-smooth">
                  {index + 1}
                </span>
                <span className="text-sm md:text-base font-medium">{item.title}</span>
              </div>
              <div className="ease-smooth group-data-[state=open]:rotate-180">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-muted-foreground"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-6 pt-2 text-sm text-muted-foreground animate-in fade-in-50 slide-in-from-top-2">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {progress === 100 && (
        <div className="mt-10 rounded-xl border border-accent/40 bg-accent/10 p-5 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_8px_30px_-6px_rgba(34,211,238,0.25)] animate-in fade-in-50">
          <div className="mx-auto flex max-w-md items-center justify-center gap-3 text-accent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <span className="font-medium tracking-wide">All steps complete — you are ready to use {toolName}.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function QuickStartPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-12 md:pt-16 space-y-12">
      <header className="text-center">
        <h1 className="font-headline font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary text-[2.6rem] md:text-[3.2rem]">
          Quick Start
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Get started quickly with either Vibe CLI or VS Code extension. Choose your preferred tool.
        </p>
      </header>

      {/* Tabbed interface for CLI vs VS Code onboarding */}
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
            <QuickStartContent items={cliItems} toolName="Vibe CLI" />
          </TabsContent>

          <TabsContent value="code" className="mt-8 animate-in fade-in-50 slide-in-from-top-2">
            <QuickStartContent items={codeItems} toolName="Vibe Code" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}