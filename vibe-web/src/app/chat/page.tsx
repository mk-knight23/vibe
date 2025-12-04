'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CopyIcon, SendIcon, Trash2Icon, CheckIcon, Sparkles, Bot, User, AlertCircle, Loader2, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type SetupStep = 'provider' | 'model' | 'apikey' | 'chat';

const PROVIDERS = [
  { 
    value: 'openrouter', 
    label: 'OpenRouter', 
    color: 'from-blue-500 to-cyan-500',
    apiKey: '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',
    models: [
      { id: 'x-ai/grok-4.1-fast', name: 'Grok 4.1 Fast', context: '128k' },
      { id: 'z-ai/glm-4.5-air:free', name: 'GLM 4.5 Air', context: '128k' },
      { id: 'deepseek/deepseek-chat-v3', name: 'DeepSeek Chat V3', context: '64k' },
      { id: 'qwen/qwen3-coder', name: 'Qwen3 Coder', context: '32k' },
      { id: 'google/gemini-2.0-flash', name: 'Gemini 2.0 Flash', context: '1M' },
    ]
  },
  { 
    value: 'megallm', 
    label: 'MegaLLM', 
    color: 'from-purple-500 to-pink-500',
    apiKey: 'sk-mega-0eaa0b2c2bae3ced6afca8651cfbbce07927e231e4119068f7f7867c20cdc820',
    models: [
      { id: 'llama-3.3-70b-instruct', name: 'Llama 3.3 70B Instruct', context: '128k' },
      { id: 'deepseek-r1-distill', name: 'DeepSeek R1 Distill', context: '64k' },
      { id: 'kimi-k2', name: 'Kimi K2', context: '200k' },
      { id: 'deepseek-v3.1', name: 'DeepSeek V3.1', context: '64k' },
      { id: 'minimax-m2', name: 'MiniMax M2', context: '200k' },
      { id: 'qwen3-32b', name: 'Qwen3 32B', context: '128k' },
      { id: 'glm-4.6', name: 'GLM 4.6', context: '128k' },
      { id: 'claude-haiku-3.5', name: 'Claude Haiku 3.5', context: '200k' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', context: '128k' },
      { id: 'gemini-flash', name: 'Gemini Flash', context: '1M' },
    ]
  },
  { 
    value: 'agentrouter', 
    label: 'AgentRouter', 
    color: 'from-green-500 to-emerald-500',
    apiKey: 'sk-UoCbOsndAWqpFuTjxJZGMgLWf93c1lCpmp01OLxQYXKyzxvg',
    models: [
      { id: 'claude-haiku-4.5', name: 'Claude Haiku 4.5', context: '200k' },
      { id: 'claude-sonnet-4.5', name: 'Claude Sonnet 4.5', context: '200k' },
      { id: 'deepseek-r1', name: 'DeepSeek R1', context: '64k' },
      { id: 'deepseek-v3.1', name: 'DeepSeek V3.1', context: '64k' },
      { id: 'glm-4.5', name: 'GLM 4.5', context: '128k' },
      { id: 'glm-4.6', name: 'GLM 4.6', context: '128k' },
    ]
  },
  { 
    value: 'routeway', 
    label: 'Routeway', 
    color: 'from-orange-500 to-red-500',
    apiKey: 'sk-LeRlb8aww5YXvdP57hnVw07xmIA2c3FvfeLvPhbmFU14osMn',
    models: [
      { id: 'kimi-k2', name: 'Kimi K2', context: '200k' },
      { id: 'minimax-m2', name: 'MiniMax M2', context: '200k' },
      { id: 'glm-4.6', name: 'GLM 4.6', context: '128k' },
      { id: 'deepseek-v3', name: 'DeepSeek V3', context: '64k' },
      { id: 'llama-3.2-3b', name: 'Llama 3.2 3B', context: '8k' },
      { id: 'qwen-turbo', name: 'Qwen Turbo', context: '32k' },
    ]
  },
];

export default function ChatPage() {
  const [step, setStep] = useState<SetupStep>('provider');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const [provider, setProvider] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('chat_config');
    if (saved) {
      const config = JSON.parse(saved);
      setProvider(config.provider);
      setSelectedModel(config.model);
      const providerData = PROVIDERS.find(p => p.value === config.provider);
      if (providerData) {
        setApiKey(providerData.apiKey);
      }
      setStep('chat');
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPending]);

  const startChat = () => {
    const providerData = PROVIDERS.find(p => p.value === provider);
    if (providerData) {
      setApiKey(providerData.apiKey);
      localStorage.setItem('chat_config', JSON.stringify({ provider, model: selectedModel, apiKey: providerData.apiKey }));
      setStep('chat');
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isPending) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    
    startTransition(async () => {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider,
            apiKey,
            model: selectedModel,
            messages: messages.map(msg => ({ role: msg.role, content: msg.content })),
            newMessage: currentInput,
          }),
        });

        if (!response.ok) throw new Error('Failed to get response');

        const data = await response.json();
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.content,
          timestamp: new Date(),
        }]);
      } catch (error) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Error: ${(error as Error).message}`,
          timestamp: new Date(),
        }]);
      }
    });
  };

  const copyMessage = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const resetSetup = () => {
    localStorage.removeItem('chat_config');
    setStep('provider');
    setProvider('');
    setSelectedModel('');
    setApiKey('');
    setMessages([]);
  };

  const currentProvider = PROVIDERS.find(p => p.value === provider);
  const currentModel = currentProvider?.models.find(m => m.id === selectedModel);

  if (step !== 'chat') {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <Card className="w-full max-w-lg p-6 md:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${currentProvider?.color || 'from-blue-500 to-cyan-500'} flex items-center justify-center mx-auto shadow-xl`}>
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Setup Chat</h1>
            <p className="text-sm text-muted-foreground">Select provider and model to start chatting</p>
          </div>

          <div className="space-y-4">
            {step === 'provider' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <label className="text-sm font-medium">Step 1: Select Provider</label>
                <Select value={provider} onValueChange={setProvider}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Choose an AI provider" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {PROVIDERS.map(p => (
                      <SelectItem key={p.value} value={p.value} className="py-3">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center`}>
                            <Sparkles className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">{p.label}</div>
                            <div className="text-xs text-muted-foreground">{p.models.length} models • Free access</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={() => setStep('model')} 
                  disabled={!provider}
                  className="w-full h-11"
                >
                  Next: Select Model
                </Button>
              </motion.div>
            )}

            {step === 'model' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Step 2: Select Model</label>
                  <Button variant="ghost" size="sm" onClick={() => setStep('provider')}>Back</Button>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className={`h-6 w-6 rounded bg-gradient-to-br ${currentProvider?.color}`} />
                    <div>
                      <span className="text-sm font-medium">{currentProvider?.label}</span>
                      <p className="text-xs text-muted-foreground">Free API key included</p>
                    </div>
                  </div>
                </div>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Choose a model" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {currentProvider?.models.map(model => (
                      <SelectItem key={model.id} value={model.id} className="py-3">
                        <div className="flex items-center justify-between w-full gap-3">
                          <span className="font-medium">{model.name}</span>
                          <Badge variant="outline" className="text-xs">{model.context}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={startChat} 
                  disabled={!selectedModel}
                  className="w-full h-11"
                >
                  Start Chat
                </Button>
              </motion.div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <div className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${currentProvider?.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold truncate">{currentProvider?.label} Chat</h1>
              <p className="text-xs text-muted-foreground truncate">{currentModel?.name} • {currentModel?.context}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {messages.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setMessages([])} className="flex-1 sm:flex-none">
                <Trash2Icon className="h-4 w-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Clear</span>
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={resetSetup} className="flex-1 sm:flex-none">
              <Settings className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Change Setup</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4 max-w-md px-4">
              <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${currentProvider?.color} flex items-center justify-center mx-auto shadow-xl`}>
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Ready to Chat</h2>
                <p className="text-muted-foreground">Using {currentProvider?.label} with {currentModel?.name}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                ✓ Free API access included
              </Badge>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2 sm:gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${currentProvider?.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm ${
                  message.role === 'user'
                    ? `bg-gradient-to-br ${currentProvider?.color} text-white`
                    : 'bg-card border'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium opacity-90">
                      {message.role === 'user' ? 'You' : currentProvider?.label}
                    </span>
                    <button
                      onClick={() => copyMessage(message.content, message.id)}
                      className="text-xs opacity-60 hover:opacity-100 ml-auto"
                    >
                      {copiedId === message.id ? <CheckIcon className="h-3 w-3" /> : <CopyIcon className="h-3 w-3" />}
                    </button>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-md">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
            {isPending && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${currentProvider?.color} flex items-center justify-center shadow-md`}>
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <Card className="px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div 
                        key={i} 
                        className={`h-2 w-2 rounded-full bg-gradient-to-br ${currentProvider?.color} animate-bounce`}
                        style={{ animationDelay: `${i * 150}ms` }} 
                      />
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="border-t bg-background/95 backdrop-blur p-3 sm:p-4 sticky bottom-0">
        <div className="container mx-auto max-w-4xl">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your message..."
              disabled={isPending}
              className="flex-1 h-11"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isPending || !input.trim()}
              className={`bg-gradient-to-br ${currentProvider?.color} hover:opacity-90 shadow-md h-11 px-4`}
            >
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
