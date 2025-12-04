import CodeBlock from "../../components/code-block";

/**
 * Installation Page
 * Comprehensive installation guide for both Vibe CLI and Vibe VS Code extension.
 * Purely presentational; no new functionality introduced.
 */

export default function InstallationPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-12 md:pt-16 space-y-16">
      <header className="text-center">
        <h1 className="font-headline font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary text-[2.6rem] md:text-[3.2rem]">
          Installation
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Choose the fastest method for your platform. All approaches are local & privacy-first.
        </p>
      </header>

      {/* Vibe CLI Installation */}
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Install Vibe CLI</h2>
          <p className="mt-2 text-muted-foreground">Terminal-based AI coding assistant</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6 rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm glow-border ambient">
            <h3 className="text-lg font-semibold">Quick Install (macOS / Linux)</h3>
            <CodeBlock
              code={`# Auto-detect latest version
curl -fsSL https://raw.githubusercontent.com/mk-knight23/vibe/main/vibe-cli/install.sh | bash

# Install specific version
VERSION=v2.1.8 curl -fsSL https://raw.githubusercontent.com/mk-knight23/vibe/main/vibe-cli/install.sh | bash`}
              className="text-left"
            />
          </div>

          <div className="space-y-6 rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm glow-border ambient">
            <h3 className="text-lg font-semibold">Windows Install</h3>
            <CodeBlock
              code={`# Download release asset:
#   vibe-win-x64.exe
# Add directory to PATH as 'vibe'
# Then run:
vibe help

# Or via package managers:
choco install vibe-ai-cli    # Chocolatey
scoop install vibe-ai-cli    # Scoop`}
              className="text-left"
            />
          </div>

          <div className="space-y-6 rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm glow-border ambient">
            <h3 className="text-lg font-semibold">Install via npm</h3>
            <CodeBlock
              code={`# Global install
npm install -g vibe-ai-cli

# One-off run
npx vibe-ai-cli`}
              className="text-left"
            />
          </div>

          <div className="space-y-6 rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm glow-border ambient">
            <h3 className="text-lg font-semibold">Install via Homebrew (macOS/Linux)</h3>
            <CodeBlock
              code={`# Add the tap and install
brew tap mk-knight23/tap
brew install vibe-ai-cli`}
              className="text-left"
            />
          </div>
        </div>
      </section>

      {/* Vibe Code Installation */}
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Install Vibe VS Code Extension</h2>
          <p className="mt-2 text-muted-foreground">In-editor AI assistance for Visual Studio Code</p>
        </div>

        <div className="space-y-6 rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm glow-border ambient">
          <h3 className="text-lg font-semibold">Install from VS Code Marketplace</h3>
          <div className="space-y-4">
            <ol className="list-decimal list-inside space-y-2">
              <li>Open Visual Studio Code</li>
              <li>Go to the Extensions view (Ctrl+Shift+X or Cmd+Shift+X)</li>
              <li>Search for "vibe-vscode" or "Vibe VS Code" by mktech</li>
              <li>Click the "Install" button</li>
              <li>Restart VS Code to complete installation</li>
            </ol>
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Alternative installation methods:</p>
              <CodeBlock
                code={`# Install from VSIX file
# Download vibe-vscode-*.vsix from GitHub releases
# In VS Code Command Palette: Extensions: Install from VSIX...`}
                className="text-left"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}