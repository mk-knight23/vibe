import Link from "next/link";
import AnimatedHero from "../components/animated-hero";
import TestimonialsSection from "../components/marketing/testimonials-section";

/**
 * Home (Landing Page)
 * Simplified into a hub now that sections have dedicated pages.
 * Provides quick navigation cards instead of inlined full content.
 */
const hubLinks = [
  {
    href: "/installation",
    title: "Install",
    description: "Curl, npm, Windows binary methods for CLI & VS Code extension."
  },
  {
    href: "/quick-start",
    title: "Quick Start",
    description: "Onboarding steps & progress tracker for both tools."
  },
  {
    href: "/commands",
    title: "Commands",
    description: "Terminal commands for CLI and VS Code commands."
  },
  {
    href: "/features",
    title: "Features",
    description: "Core features for both CLI and VS Code extension."
  },
  {
    href: "/pricing",
    title: "Pricing",
    description: "Free usage model + future tiers."
  },
  {
    href: "/docs",
    title: "Docs",
    description: "Comprehensive guide for both CLI and extension."
  },
  {
    href: "/chat",
    title: "AI Chat",
    description: "Interactive chat with OpenRouter & MegaLLM."
  },
  {
    href: "/faq",
    title: "FAQ",
    description: "Common questions & security stance."
  },
];

// Tool highlights for both CLI and VS Code extension
const toolHighlights = [
  {
    title: "Vibe CLI",
    description: "Terminal-centric AI coding assistant",
    features: [
      "Advanced chat, code generation, refactoring",
      "Debugging, testing, git automation",
      "Autonomous agent capabilities",
      "Multi-model support (OpenRouter, etc.)"
    ],
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Vibe VS Code",
    description: "In-editor AI assistance for Visual Studio Code",
    features: [
      "Multiple AI modes (Architect, Code, Debug, etc.)",
      "Multi-provider support (OpenRouter, MegaLLM)",
      "Copyable messages, clear chat functionality",
      "Keyboard shortcuts & mode switching"
    ],
    color: "from-purple-500 to-pink-500"
  }
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-12 md:pt-16 space-y-28">
      <div className="text-center mb-16">
        <h1 className="font-headline font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary text-[3rem] md:text-[4rem]">
          VIBE
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-xl leading-relaxed text-muted-foreground">
          Your Free AI Coding CLI and VS Code Extension
        </p>
      </div>

      {/* Tool Highlights Section */}
      <section className="relative">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <h2 className="font-headline font-semibold tracking-tight text-[2.2rem] md:text-[2.8rem] mb-4" style={{
            background: 'linear-gradient(to right, hsl(var(--primary)), hsl(var(--accent)))',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            display: 'block'
          }}>
            Two Powerful Tools, One Ecosystem
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Choose the interface that fits your workflow - terminal for CLI power users or VS Code for in-editor assistance
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {toolHighlights.map((tool, index) => (
            <div
              key={tool.title}
              className="group relative rounded-xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm glow-border ambient ease-smooth hover:-translate-y-1 hover:border-accent/50"
            >
              <h3 className={`text-xl font-bold bg-gradient-to-r ${tool.color} bg-clip-text text-transparent mb-2`}>
                {tool.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
              <ul className="space-y-2">
                {tool.features.map((feature, idx) => (
                  <li key={idx} className="text-sm flex items-start">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent mt-1.5 mr-2 flex-shrink-0"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Chat Feature Callout */}
      <section className="relative">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <div className="rounded-xl border border-border/50 bg-gradient-to-r from-primary/10 to-accent/10 p-8 backdrop-blur-sm glow-border ambient">
            <h3 className="text-2xl font-bold text-foreground mb-3">Try Our Interactive AI Chat</h3>
            <p className="text-lg text-muted-foreground mb-6">
              Experience the power of AI directly in your browser with support for both OpenRouter and MegaLLM models
            </p>
            <Link href="/chat" className="inline-block">
              <div className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
                Open AI Chat
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Navigation Hub */}
      <section className="relative">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="font-headline font-semibold tracking-tight text-[2.4rem] md:text-[3rem]" style={{
            background: 'linear-gradient(to right, hsl(var(--primary)), hsl(var(--accent)))',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            display: 'block'
          }}>
            Explore VIBE
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Navigate focused pages for installation, onboarding, command reference, features, documentation, and support.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hubLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative rounded-xl border border-border/50 bg-card/60 p-5 backdrop-blur-sm glow-border ambient ease-smooth hover:-translate-y-1 hover:border-accent/50"
            >
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-gradient-to-r from-primary to-accent group-hover:scale-125 ease-smooth" />
                {link.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {link.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <TestimonialsSection />
    </div>
  );
}
