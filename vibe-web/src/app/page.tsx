import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Terminal, Code2, Layers, Download, MessageSquare } from "lucide-react";

const tools = [
  {
    name: "Vibe CLI",
    version: "v4.0",
    description: "AI-powered terminal assistant with multi-provider support",
    features: [
      "🌐 4 AI providers with 40+ models",
      "📁 Auto file creation from AI responses",
      "🎯 Smart fallback system",
      "⚡ Zero configuration required"
    ],
    gradient: "from-blue-500 to-cyan-500",
    color: "text-blue-500",
    install: "npm install -g vibe-ai-cli"
  },
  {
    name: "Vibe VS Code",
    version: "v4.0",
    description: "Independent AI assistant for Visual Studio Code",
    features: [
      "🔒 Works standalone, no CLI needed",
      "📁 Direct file operations",
      "🤖 6 AI modes for different tasks",
      "🎨 5 beautiful visual themes"
    ],
    gradient: "from-purple-500 to-pink-500",
    color: "text-purple-500",
    install: "Install from VS Code Marketplace"
  }
];

const providers = [
  { name: "OpenRouter", models: 6, maxContext: "1M", color: "blue" },
  { name: "MegaLLM", models: 12, maxContext: "200k", color: "purple" },
  { name: "AgentRouter", models: 7, maxContext: "200k", color: "pink" },
  { name: "Routeway", models: 6, maxContext: "200k", color: "cyan" }
];

const features = [
  { icon: "🌐", title: "Multi-Provider", desc: "4 providers with automatic fallback" },
  { icon: "📁", title: "Auto Files", desc: "AI creates files automatically" },
  { icon: "⚡", title: "Zero Config", desc: "Works instantly, no setup" },
  { icon: "🎯", title: "Smart Fallback", desc: "Never fails, always works" },
  { icon: "🤖", title: "40+ Models", desc: "Free access to diverse AI" },
  { icon: "🔒", title: "Privacy First", desc: "No data retention" }
];

const quickLinks = [
  { href: "/installation", title: "Installation", desc: "Get started in 2 minutes", icon: "📦" },
  { href: "/features", title: "Features", desc: "Explore capabilities", icon: "✨" },
  { href: "/docs", title: "Documentation", desc: "Complete guides", icon: "📚" },
  { href: "/chat", title: "AI Chat", desc: "Try it in browser", icon: "💬" },
  { href: "/commands", title: "Commands", desc: "CLI & VS Code", icon: "⌨️" },
  { href: "/faq", title: "FAQ", desc: "Common questions", icon: "❓" }
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-8 md:pt-12 space-y-20">
      {/* Hero */}
      <div className="text-center space-y-8 relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
          <Sparkles className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            v4.0 - Multi-Provider AI Platform
          </span>
        </div>
        
        <div className="space-y-4">
          <h1 className="font-bold tracking-tight text-[4rem] md:text-[6rem] leading-none text-blue-600 dark:text-blue-400">
            VIBE
          </h1>
          <p className="text-3xl md:text-4xl font-bold text-foreground">
            AI-Powered Development
            <span className="block text-purple-500">
              Made Simple
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
          <Badge variant="secondary" className="px-3 py-1">
            <Terminal className="h-3 w-3 mr-1.5" />
            CLI v4.0
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Code2 className="h-3 w-3 mr-1.5" />
            VS Code v4.0
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Layers className="h-3 w-3 mr-1.5" />
            4 Providers
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Sparkles className="h-3 w-3 mr-1.5" />
            40+ Free Models
          </Badge>
        </div>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Build faster with AI assistance in your terminal and editor. 
          <span className="text-foreground font-medium"> Free forever.</span>
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link href="/installation">
            <Button size="lg" className="text-base bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 shadow-lg">
              <Download className="h-4 w-4 mr-2" />
              Get Started Free
            </Button>
          </Link>
          <Link href="/chat">
            <Button size="lg" variant="outline" className="text-base">
              <MessageSquare className="h-4 w-4 mr-2" />
              Try AI Chat
            </Button>
          </Link>
        </div>
      </div>

      {/* Tools */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Two Powerful Tools
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose your interface - terminal or VS Code
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <Card key={tool.name} className="group hover:-translate-y-2 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className={`text-2xl font-bold ${tool.color}`}>
                    {tool.name}
                  </h3>
                  <Badge variant="secondary">{tool.version}</Badge>
                </div>
                <p className="text-muted-foreground">{tool.description}</p>
                <ul className="space-y-2">
                  {tool.features.map((feature, idx) => (
                    <li key={idx} className="text-sm">{feature}</li>
                  ))}
                </ul>
                <div className="pt-2">
                  <code className="text-xs bg-muted px-3 py-1.5 rounded block">{tool.install}</code>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Providers */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-cyan-600 dark:text-cyan-400">
            Multi-Provider Architecture
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            40+ free AI models with automatic fallback
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {providers.map((provider) => (
            <Card key={provider.name} className="hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center space-y-2">
                <h3 className="font-bold">{provider.name}</h3>
                <div className="text-3xl font-bold text-primary">{provider.models}</div>
                <div className="text-xs text-muted-foreground">models</div>
                <Badge variant="outline" className="text-xs">{provider.maxContext}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
            What's New in v4.0
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {features.map((feature) => (
            <Card key={feature.title} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center space-y-2">
                <div className="text-4xl">{feature.icon}</div>
                <h3 className="font-bold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400">
            Explore VIBE
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group p-5 rounded-xl border border-border/50 bg-card/60 hover:-translate-y-1 hover:border-accent/50 transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{link.icon}</span>
                <div>
                  <h3 className="font-semibold group-hover:text-accent transition-colors">{link.title}</h3>
                  <p className="text-sm text-muted-foreground">{link.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Get Started?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Install Vibe CLI or VS Code extension and start building with AI
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/installation">
                <Button size="lg">Install Now</Button>
              </Link>
              <Link href="/docs">
                <Button size="lg" variant="outline">Read Docs</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
