"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Terminal, Code, Zap, Shield, Users, MessageSquare, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

const cliFeatures = [
  {
    icon: Terminal,
    title: "Terminal-First Workflow",
    description: "Seamless CLI integration that feels natural in your development environment",
    details: [
      "Native terminal commands",
      "Shell integration",
      "Multi-step agent workflows",
      "Git automation tools"
    ]
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for speed with minimal overhead and instant responses",
    details: [
      "Sub-second response times",
      "Efficient API calls",
      "Cached responses",
      "Background processing"
    ]
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your code stays local with anonymous usage and BYO key support",
    details: [
      "No data collection",
      "Local processing",
      "Encrypted communications",
      "Open source transparency"
    ]
  }
];

const codeFeatures = [
  {
    icon: Code,
    title: "VS Code Integration",
    description: "Full AI assistance integrated directly in your editor",
    details: [
      "Six specialized AI modes",
      "Multi-provider support (OpenRouter, MegaLLM)",
      "Context-aware responses",
      "Real-time suggestions"
    ]
  },
  {
    icon: MessageSquare,
    title: "Rich Chat Interface",
    description: "Interactive chat with copyable messages and clear history",
    details: [
      "Click-to-copy message content",
      "Clear chat functionality",
      "Smooth scrolling with custom scrollbars",
      "Dark/light theme support"
    ]
  },
  {
    icon: Settings,
    title: "Advanced Controls",
    description: "Customizable settings and workflow controls",
    details: [
      "Multiple AI personas",
      "Model selection",
      "Chat vs Agent mode",
      "Keyboard shortcuts"
    ]
  }
];

export default function FeaturesPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      {/* Hero Section */}
      <motion.div
        className="mx-auto max-w-3xl text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="font-headline font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary text-[2.8rem] md:text-[3.5rem] leading-[1.1]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Powerful Features
        </motion.h1>
        <motion.p
          className="mt-6 text-xl leading-relaxed text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Everything you need for AI-powered development workflows with both CLI and VS Code
        </motion.p>
      </motion.div>

      {/* Feature Tabs */}
      <div className="mb-16 glow-border ambient rounded-2xl p-2">
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
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {cliFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/70 p-6 backdrop-blur-sm glow-border ambient"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground mb-4">{feature.description}</p>
                      <ul className="space-y-2">
                        {feature.details.map((detail) => (
                          <li key={detail} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-accent" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="code" className="mt-8 animate-in fade-in-50 slide-in-from-top-2">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {codeFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/70 p-6 backdrop-blur-sm glow-border ambient"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground mb-4">{feature.description}</p>
                      <ul className="space-y-2">
                        {feature.details.map((detail) => (
                          <li key={detail} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-accent" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Unified CTA Section */}
      <motion.div
        className="mx-auto mt-16 max-w-2xl text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Ready to get started with both tools?</h2>
        <p className="text-muted-foreground mb-8">
          Experience the power of AI-assisted development with CLI and VS Code
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent">
            <Link href="/installation">Install Both Tools</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/chat">Try AI Chat</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}