'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import CodeBlock from '@/components/code-block';

export default function VSCodePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <Badge className="mb-4">v4.0</Badge>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
          Vibe VS Code
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          AI-powered development assistant that works independently in VS Code
        </p>
      </div>

      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="installation">Installation</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="modes">AI Modes</TabsTrigger>
          <TabsTrigger value="themes">Themes</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>What's New in v4.0</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-border/50 bg-card/60">
                  <h3 className="font-semibold mb-2">🌐 4 AI Providers</h3>
                  <p className="text-sm text-muted-foreground">
                    OpenRouter, MegaLLM, AgentRouter, Routeway
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-border/50 bg-card/60">
                  <h3 className="font-semibold mb-2">🤖 40+ Free Models</h3>
                  <p className="text-sm text-muted-foreground">
                    Direct API access to diverse AI models
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-border/50 bg-card/60">
                  <h3 className="font-semibold mb-2">📁 File Operations</h3>
                  <p className="text-sm text-muted-foreground">
                    Create, edit, delete files directly
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-border/50 bg-card/60">
                  <h3 className="font-semibold mb-2">🔒 Independent</h3>
                  <p className="text-sm text-muted-foreground">
                    Works standalone, no CLI required
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Smart Fallback System</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatic provider/model switching on failures
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Enhanced UI</h4>
                    <p className="text-sm text-muted-foreground">
                      Beautiful themes and smooth animations
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Zero Configuration</h4>
                    <p className="text-sm text-muted-foreground">
                      Hardcoded API keys for instant use
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="installation" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>VS Code Marketplace (Recommended)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="font-semibold">1.</span>
                  <span>Open VS Code</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">2.</span>
                  <span>Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">3.</span>
                  <span>Search for "Vibe VS Code"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">4.</span>
                  <span>Click Install</span>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manual Installation</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock code={`cd vibe-code
npm install
npm run compile
npx @vscode/vsce package
code --install-extension vibe-vscode-*.vsix`} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>First Launch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>After installation:</p>
              <ol className="space-y-2">
                <li>1. Click the Vibe icon in the Activity Bar</li>
                <li>2. Select your provider and model</li>
                <li>3. Start chatting!</li>
              </ol>
              <p className="text-muted-foreground">
                No additional setup required - works out of the box!
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Open Vibe Panel</h4>
                <p className="text-sm text-muted-foreground">
                  Click the Vibe icon in the Activity Bar (left sidebar)
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Keyboard Shortcuts</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <code className="px-2 py-1 rounded bg-muted">Cmd/Ctrl + .</code>
                    <span className="text-muted-foreground">Next mode</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="px-2 py-1 rounded bg-muted">Cmd/Ctrl + Shift + .</code>
                    <span className="text-muted-foreground">Previous mode</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Context Menu</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Right-click on selected code:
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Explain Selected Code</li>
                  <li>• Refactor Selected Code</li>
                  <li>• Generate Tests for Selection</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                Access via: <code>File → Preferences → Settings → Vibe</code>
              </p>
              <div className="space-y-3 text-sm">
                <div>
                  <strong>Provider:</strong> Choose from 4 providers
                </div>
                <div>
                  <strong>Default Model:</strong> Select your preferred model
                </div>
                <div>
                  <strong>API Keys:</strong> Optional custom keys
                </div>
                <div>
                  <strong>Auto-Approve:</strong> Enable/disable auto-approval
                </div>
                <div>
                  <strong>Max Context Files:</strong> Limit context size
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modes" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Modes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-border/50 bg-card/60">
                  <h4 className="font-semibold mb-2">🏗️ Architect</h4>
                  <p className="text-sm text-muted-foreground">
                    Planning and design decisions
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-border/50 bg-card/60">
                  <h4 className="font-semibold mb-2">💻 Code</h4>
                  <p className="text-sm text-muted-foreground">
                    Writing and refactoring code
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-border/50 bg-card/60">
                  <h4 className="font-semibold mb-2">❓ Ask</h4>
                  <p className="text-sm text-muted-foreground">
                    Q&A and explanations
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-border/50 bg-card/60">
                  <h4 className="font-semibold mb-2">🐛 Debug</h4>
                  <p className="text-sm text-muted-foreground">
                    Issue diagnosis and fixes
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-border/50 bg-card/60">
                  <h4 className="font-semibold mb-2">🎯 Orchestrator</h4>
                  <p className="text-sm text-muted-foreground">
                    Task coordination
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-border/50 bg-card/60">
                  <h4 className="font-semibold mb-2">🔍 Project Research</h4>
                  <p className="text-sm text-muted-foreground">
                    Codebase analysis
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="themes" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Visual Themes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-border/50 bg-card/60">
                  <h4 className="font-semibold mb-2">Default</h4>
                  <p className="text-sm text-muted-foreground">
                    Clean and professional
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-purple-500/50 bg-purple-500/10">
                  <h4 className="font-semibold mb-2">Neon</h4>
                  <p className="text-sm text-muted-foreground">
                    Purple/cyan glow effects
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-orange-500/50 bg-orange-500/10">
                  <h4 className="font-semibold mb-2">Sunset</h4>
                  <p className="text-sm text-muted-foreground">
                    Warm orange/yellow tones
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-blue-500/50 bg-blue-500/10">
                  <h4 className="font-semibold mb-2">Ocean</h4>
                  <p className="text-sm text-muted-foreground">
                    Cool blue gradients
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-green-500/50 bg-green-500/10">
                  <h4 className="font-semibold mb-2">Matrix</h4>
                  <p className="text-sm text-muted-foreground">
                    Green terminal style
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
