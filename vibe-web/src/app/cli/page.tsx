'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import CodeBlock from '@/components/code-block';

export default function CLIPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <Badge className="mb-4">v4.0</Badge>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
          Vibe CLI
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          AI-powered development assistant with multi-provider support and auto file creation
        </p>
      </div>

      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="installation">Installation</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>What's New in v4.0</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-border/50 bg-card/60">
                  <h3 className="font-semibold mb-2">🌐 Multi-Provider Support</h3>
                  <p className="text-sm text-muted-foreground">
                    4 AI providers with 40+ free models
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-border/50 bg-card/60">
                  <h3 className="font-semibold mb-2">🎯 Smart Fallback</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatic provider/model switching
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-border/50 bg-card/60">
                  <h3 className="font-semibold mb-2">📁 Auto File Creation</h3>
                  <p className="text-sm text-muted-foreground">
                    AI responses create files automatically
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-border/50 bg-card/60">
                  <h3 className="font-semibold mb-2">⚡ Zero Configuration</h3>
                  <p className="text-sm text-muted-foreground">
                    Hardcoded API keys for instant use
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Supported Providers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">OpenRouter (6 models)</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Grok 4.1 Fast (128k)</li>
                    <li>• GLM 4.5 Air (128k)</li>
                    <li>• Gemini 2.0 Flash (1M)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">MegaLLM (12 models)</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Llama 3.3 70B (128k)</li>
                    <li>• Kimi K2 (200k)</li>
                    <li>• DeepSeek R1 Distill (64k)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">AgentRouter (7 models)</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Claude Haiku 4.5 (200k)</li>
                    <li>• Claude Sonnet 4.5 (200k)</li>
                    <li>• DeepSeek R1 (64k)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Routeway (6 models)</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Kimi K2 (200k)</li>
                    <li>• MiniMax M2 (200k)</li>
                    <li>• GLM 4.6 (128k)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="installation" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>NPM Installation (Recommended)</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock code="npm install -g vibe-ai-cli" />
              <p className="text-sm text-muted-foreground mt-4">
                Installs globally and adds <code>vibe</code> command to your PATH
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>From Source</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock code={`git clone https://github.com/mk-knight23/vibe.git
cd vibe/vibe-cli
npm install
npm run build
npm link`} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verify Installation</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock code="vibe --version" />
              <p className="text-sm text-muted-foreground mt-4">
                Should output: <code>vibe-ai-cli v4.0.0</code>
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
                <h4 className="font-semibold mb-2">Start Vibe</h4>
                <CodeBlock code="vibe" />
                <p className="text-sm text-muted-foreground mt-2">
                  Launches interactive interface with provider selection
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Interactive Commands</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <code className="px-2 py-1 rounded bg-muted">/help</code>
                    <span className="text-muted-foreground">Show available commands</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="px-2 py-1 rounded bg-muted">/models</code>
                    <span className="text-muted-foreground">List all models</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="px-2 py-1 rounded bg-muted">/context</code>
                    <span className="text-muted-foreground">Show conversation context</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="px-2 py-1 rounded bg-muted">/exit</code>
                    <span className="text-muted-foreground">Quit application</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom API Keys (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock code={`export OPENROUTER_API_KEY="your-key"
export MEGALLM_API_KEY="your-key"
export AGENTROUTER_API_KEY="your-key"
export ROUTEWAY_API_KEY="your-key"`} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Code Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">You:</p>
                  <div className="p-3 rounded bg-muted text-sm">
                    Create a REST API with Express.js
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">AI creates:</p>
                  <CodeBlock code={`✓ server.js
✓ routes/
  ✓ users.js
  ✓ posts.js
✓ controllers/
  ✓ userController.js
✓ package.json`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">You:</p>
                  <div className="p-3 rounded bg-muted text-sm">
                    Build a React app with TypeScript
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">AI creates:</p>
                  <CodeBlock code={`✓ src/
  ✓ App.tsx
  ✓ index.tsx
  ✓ components/
✓ public/
✓ tsconfig.json
✓ package.json`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
