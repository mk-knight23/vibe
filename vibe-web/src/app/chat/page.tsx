'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { MoonIcon, SunIcon, CopyIcon, SendIcon, Trash2Icon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

const TOP_FREE_MODELS = [
  "z-ai/glm-4.5-air:free",
  "gpt-4o-mini",
  "claude-3.5-sonnet",
  "gemini-2.0-flash",
  "llama-3.3-70b-instruct",
  "openai-gpt-oss-20b",
  "llama3.3-70b-instruct",
  "deepseek-r1-distill-llama-70b",
  "alibaba-qwen3-32b",
  "openai-gpt-oss-120b",
  "llama3-8b-instruct",
  "moonshotai/kimi-k2-instruct-0905",
  "deepseek-ai/deepseek-v3.1-terminus",
  "qwen/qwen3-next-80b-a3b-instruct",
  "deepseek-ai/deepseek-v3.1",
  "mistralai/mistral-nemotron",
  "minimaxai/minimax-m2"
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<'openrouter' | 'megallm'>('openrouter');
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('z-ai/glm-4.5-air:free');
  const [isAgentMode, setIsAgentMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme: currentTheme, setTheme: setNextTheme } = useTheme();

  // Mark component as mounted to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Prepare request payload
      const requestBody = {
        provider,
        apiKey,
        model: selectedModel,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        newMessage: input,
        isAgent: isAgentMode
      };

      // Make API request to backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get response from AI');
      }

      const data = await response.json();
      
      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${(error as Error).message}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Vibe AI Chat
          </h1>
          <div className="flex items-center gap-4">
            {isMounted && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setNextTheme(currentTheme === 'dark' ? 'light' : 'dark')}
              >
                {currentTheme === 'dark' ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Provider</label>
                  <Select 
                    value={provider} 
                    onValueChange={(value: 'openrouter' | 'megallm') => setProvider(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openrouter">OpenRouter</SelectItem>
                      <SelectItem value="megallm">MegaLLM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">API Key</label>
                  <Input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={`${provider} API key`}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Model</label>
                  <Select 
                    value={selectedModel} 
                    onValueChange={setSelectedModel}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TOP_FREE_MODELS.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Mode</label>
                  <Tabs 
                    value={isAgentMode ? "agent" : "chat"} 
                    onValueChange={(value) => setIsAgentMode(value === "agent")}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="chat">Chat</TabsTrigger>
                      <TabsTrigger value="agent">Agent</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={clearChat}
                  disabled={messages.length === 0}
                >
                  <Trash2Icon className="h-4 w-4 mr-2" />
                  Clear Chat
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {provider === 'openrouter' 
                    ? 'Use your OpenRouter API key to access free models. Set your key in the settings above.'
                    : 'Use your MegaLLM API key to access models. Set your key in the settings above.'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3 flex flex-col">
            <Card className="flex-1 flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">
                  {isAgentMode ? 'Agent Mode' : 'Chat Mode'} - {provider}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto max-h-[60vh] mb-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <p className="text-lg mb-2">Welcome to Vibe AI Chat!</p>
                        <p>Send a message to start a conversation with the AI.</p>
                      </div>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                              message.role === 'user'
                                ? 'bg-primary text-primary-foreground rounded-br-none'
                                : 'bg-muted text-foreground rounded-bl-none'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium">
                                {message.role === 'user' ? 'You' : 'Vibe AI'}
                              </span>
                              <span className="text-xs opacity-70">
                                {formatTime(message.timestamp)}
                              </span>
                              <button
                                onClick={() => copyMessage(message.content)}
                                className="ml-2 text-xs opacity-70 hover:opacity-100"
                              >
                                <CopyIcon className="h-3 w-3" />
                              </button>
                            </div>
                            <p className="whitespace-pre-wrap">{message.content}</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-muted text-foreground rounded-2xl rounded-bl-none px-4 py-3 max-w-[80%]">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium">Vibe AI</span>
                        </div>
                        <div className="flex space-x-2">
                          <Skeleton className="h-3 w-3 rounded-full" />
                          <Skeleton className="h-3 w-3 rounded-full" />
                          <Skeleton className="h-3 w-3 rounded-full" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your message here..."
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={isLoading || !input.trim()}
                    >
                      <SendIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    {isAgentMode 
                      ? 'Agent mode: AI will plan tasks and create checkpoints' 
                      : 'Chat mode: Direct conversation with AI'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}