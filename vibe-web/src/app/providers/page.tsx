'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const providers = [
  {
    id: 'openrouter',
    name: 'OpenRouter',
    models: 6,
    maxContext: '1M tokens',
    features: ['Free tier', 'Diverse models', 'High availability'],
    models_list: [
      { name: 'Grok 4.1 Fast', context: '128k', use: 'Fast responses' },
      { name: 'GLM 4.5 Air', context: '128k', use: 'General purpose' },
      { name: 'DeepSeek Chat V3', context: '64k', use: 'Conversations' },
      { name: 'Qwen3 Coder', context: '32k', use: 'Code generation' },
      { name: 'GPT OSS 20B', context: '8k', use: 'Quick tasks' },
      { name: 'Gemini 2.0 Flash', context: '1M', use: 'Long context' },
    ],
  },
  {
    id: 'megallm',
    name: 'MegaLLM',
    models: 12,
    maxContext: '200k tokens',
    features: ['High quality', 'Long context', 'Reasoning models'],
    models_list: [
      { name: 'Llama 3.3 70B', context: '128k', use: 'Code generation' },
      { name: 'DeepSeek R1 Distill', context: '64k', use: 'Reasoning' },
      { name: 'Kimi K2', context: '200k', use: 'Long context' },
      { name: 'DeepSeek V3.1', context: '64k', use: 'General purpose' },
      { name: 'MiniMax M2', context: '200k', use: 'Long context' },
    ],
  },
  {
    id: 'agentrouter',
    name: 'AgentRouter',
    models: 7,
    maxContext: '200k tokens',
    features: ['Claude access', 'Premium models', 'High reliability'],
    models_list: [
      { name: 'Claude Haiku 4.5', context: '200k', use: 'Fast responses' },
      { name: 'Claude Sonnet 4.5', context: '200k', use: 'Complex tasks' },
      { name: 'DeepSeek R1', context: '64k', use: 'Reasoning' },
      { name: 'GLM 4.5/4.6', context: '128k', use: 'General purpose' },
    ],
  },
  {
    id: 'routeway',
    name: 'Routeway',
    models: 6,
    maxContext: '200k tokens',
    features: ['Free access', 'Diverse selection', 'Good performance'],
    models_list: [
      { name: 'Kimi K2', context: '200k', use: 'Long context' },
      { name: 'MiniMax M2', context: '200k', use: 'Long context' },
      { name: 'GLM 4.6', context: '128k', use: 'General purpose' },
      { name: 'DeepSeek V3', context: '64k', use: 'Code generation' },
    ],
  },
];

export default function ProvidersPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
          AI Providers
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Vibe supports 4 AI providers with 40+ free models. Choose the best provider for your needs.
        </p>
      </div>

      <Tabs defaultValue="openrouter" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          {providers.map((provider) => (
            <TabsTrigger key={provider.id} value={provider.id}>
              {provider.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {providers.map((provider) => (
          <TabsContent key={provider.id} value={provider.id}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{provider.name}</span>
                  <div className="flex gap-2">
                    <Badge>{provider.models} models</Badge>
                    <Badge variant="outline">{provider.maxContext}</Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {provider.features.map((feature) => (
                      <Badge key={feature} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Available Models</h3>
                  <div className="grid gap-3">
                    {provider.models_list.map((model) => (
                      <div
                        key={model.name}
                        className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/60"
                      >
                        <div>
                          <div className="font-medium">{model.name}</div>
                          <div className="text-sm text-muted-foreground">{model.use}</div>
                        </div>
                        <Badge variant="outline">{model.context}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Smart Fallback System</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>✓ Automatic key rotation</li>
              <li>✓ Model fallback on errors</li>
              <li>✓ Provider switching</li>
              <li>✓ Zero downtime</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage in Vibe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <strong>CLI:</strong> Select provider at startup
              </div>
              <div>
                <strong>VS Code:</strong> Choose in settings panel
              </div>
              <div>
                <strong>Web:</strong> Switch in chat interface
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
