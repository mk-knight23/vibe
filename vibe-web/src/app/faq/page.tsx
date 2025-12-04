"use client";

import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { HelpCircle, Shield, User, Code, DollarSign, Settings, Terminal } from "lucide-react";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

// CLI FAQ categories
const cliFaqCategories = [
  {
    icon: Terminal,
    title: "Getting Started",
    questions: [
      {
        question: "What is Vibe CLI?",
        answer: "Vibe CLI is a free, open-source command-line interface that brings AI-powered development workflows to your terminal. It integrates with your editor and Git for a focused, defensive-only workflow."
      },
      {
        question: "How do I install Vibe CLI?",
        answer: "You can install Vibe CLI using npm: 'npm install -g vibe-ai-cli', curl: 'curl -fsSL https://raw.githubusercontent.com/mk-knight23/vibe/main/vibe-cli/install.sh | bash', or Homebrew: 'brew install mk-knight23/tap/vibe-ai-cli'."
      },
      {
        question: "Do I need an account to use Vibe CLI?",
        answer: "No, Vibe CLI is designed to be anonymous. You bring your own OpenRouter API key, and we don't require any account creation or personal information."
      }
    ]
  },
  {
    icon: Shield,
    title: "Security & Privacy",
    questions: [
      {
        question: "Is my code safe with Vibe CLI?",
        answer: "Yes, your code stays local. Vibe CLI only sends the necessary context to OpenRouter's free models. We don't collect or store your code, and all communications are encrypted."
      },
      {
        question: "What data does Vibe CLI collect?",
        answer: "Vibe CLI collects minimal anonymized usage data for improving the tool. We don't collect your code, personal information, or API keys. You can review our privacy policy for full details."
      },
      {
        question: "Can I use Vibe CLI offline?",
        answer: "Vibe CLI requires an internet connection to communicate with AI models through OpenRouter. However, all processing and decision-making happens locally on your machine."
      }
    ]
  },
  {
    icon: User,
    title: "Usage & Features",
    questions: [
      {
        question: "Which programming languages are supported?",
        answer: "Vibe CLI works with all major programming languages including JavaScript, TypeScript, Python, Go, Rust, Java, C++, C#, Ruby, PHP, Swift, and many more."
      },
      {
        question: "How does the defensive workflow work?",
        answer: "Vibe CLI requires explicit approval for all changes. It suggests improvements and modifications but never makes changes without your consent, ensuring you maintain full control over your codebase."
      },
      {
        question: "Can I customize Vibe CLI's behavior?",
        answer: "Yes, Vibe CLI is highly configurable. You can customize prompts, set preferences, and integrate it with your existing development workflow through various configuration options."
      }
    ]
  },
  {
    icon: Code,
    title: "Technical",
    questions: [
      {
        question: "What models does Vibe CLI use?",
        answer: "Vibe CLI routes to free community models available on OpenRouter, including models from various providers like z-ai/glm-4.5-air:free, gpt-4o-mini, claude-3.5-sonnet:beta, and more."
      },
      {
        question: "How do I update Vibe CLI?",
        answer: "You can update Vibe CLI by running 'npm update vibe-ai-cli' or reinstalling using the curl command. We recommend checking for updates regularly."
      },
      {
        question: "Is Vibe CLI open source?",
        answer: "Yes! Vibe CLI is completely open source. You can view the source code, contribute to development, and even fork it for your own use. Visit our GitHub repository to learn more."
      }
    ]
  },
  {
    icon: DollarSign,
    title: "Pricing & Future",
    questions: [
      {
        question: "Is Vibe CLI really free?",
        answer: "Yes, Vibe CLI is completely free to use. We route to free models on OpenRouter and don't charge any fees. In the future, we may offer optional paid tiers with additional features, but the core functionality will remain free."
      },
      {
        question: "What are the future plans for Vibe CLI?",
        answer: "We're working on extended context limits, priority support, advanced features, and more integrations. However, our commitment to keeping the core features free remains unchanged."
      }
    ]
  }
];

// VS Code Extension FAQ categories
const codeFaqCategories = [
  {
    icon: Settings,
    title: "Getting Started",
    questions: [
      {
        question: "What is Vibe VS Code Extension?",
        answer: "Vibe VS Code is a free, open-source extension that brings AI-powered development workflows directly into your Visual Studio Code editor. It provides specialized AI modes, multi-provider support, and rich chat interface."
      },
      {
        question: "How do I install the Vibe Extension?",
        answer: "You can install the Vibe extension from the VS Code marketplace by searching for 'vibe-vscode' or 'Vibe VS Code'. Alternatively, use the VSIX file from our GitHub releases."
      },
      {
        question: "Do I need an account to use Vibe Code?",
        answer: "No, Vibe Code is designed to be anonymous. You bring your own OpenRouter or MegaLLM API keys, and we don't require any account creation or personal information."
      }
    ]
  },
  {
    icon: Shield,
    title: "Security & Privacy",
    questions: [
      {
        question: "Is my code safe with Vibe Code?",
        answer: "Yes, your code stays local. Vibe Code only sends the necessary context to OpenRouter's or MegaLLM's models. We don't collect or store your code, and all communications are encrypted."
      },
      {
        question: "What data does Vibe Code collect?",
        answer: "Vibe Code collects minimal anonymized usage data for improving the tool. We don't collect your code, personal information, or API keys. You can review our privacy policy for full details."
      },
      {
        question: "Can I use Vibe Code offline?",
        answer: "Vibe Code requires an internet connection to communicate with AI models through OpenRouter or MegaLLM. However, all processing and decision-making happens locally on your machine."
      }
    ]
  },
  {
    icon: User,
    title: "Usage & Features",
    questions: [
      {
        question: "What AI modes are available in Vibe Code?",
        answer: "Vibe Code offers six specialized AI modes: Architect (planning), Code (implementation), Ask (Q&A), Debug (issue resolution), Orchestrator (workflow coordination), and Project Research (analysis)."
      },
      {
        question: "How do I switch between AI modes?",
        answer: "You can switch between AI modes using keyboard shortcuts: Cmd/Ctrl + . (period) for next mode, Cmd/Ctrl + Shift + . (period) for previous mode. You can also use the dropdown in the sidebar."
      },
      {
        question: "Can I customize Vibe Code's behavior?",
        answer: "Yes, Vibe Code is highly configurable. You can set your preferred AI provider, API keys, default model, and other preferences through VS Code settings."
      }
    ]
  },
  {
    icon: Code,
    title: "Technical",
    questions: [
      {
        question: "What models does Vibe Code use?",
        answer: "Vibe Code supports multiple providers: OpenRouter with models like z-ai/glm-4.5-air:free, gpt-4o-mini, claude-3.5-sonnet:beta, and MegaLLM with their available models."
      },
      {
        question: "How do I update Vibe Code?",
        answer: "VS Code will automatically notify you when updates are available. You can also update manually through the Extensions panel in VS Code. Check for updates regularly to get the latest features."
      },
      {
        question: "Is Vibe Code open source?",
        answer: "Yes! Vibe Code is completely open source. You can view the source code, contribute to development, and even fork it for your own use. Visit our GitHub repository to learn more."
      }
    ]
  },
  {
    icon: DollarSign,
    title: "Pricing & Future",
    questions: [
      {
        question: "Is Vibe Code really free?",
        answer: "Yes, Vibe Code is completely free to use. We route to free models on OpenRouter and MegaLLM and don't charge any fees. In the future, we may offer optional paid tiers with additional features, but the core functionality will remain free."
      },
      {
        question: "What are the future plans for Vibe Code?",
        answer: "We're working on enhanced diff visualization, advanced auto-complete, task templates, automatic theme integration, privacy-first usage analytics, and internationalization. However, our commitment to keeping the core features free remains unchanged."
      }
    ]
  }
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
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
          Frequently Asked Questions
        </motion.h1>
        <motion.p
          className="mt-6 text-xl leading-relaxed text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Everything you need to know about Vibe CLI and Vibe Code
        </motion.p>
      </motion.div>

      {/* Tabbed interface for CLI vs Code FAQs */}
      <div className="glow-border ambient rounded-2xl p-2">
        <Tabs defaultValue="cli" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-xl bg-card/40 backdrop-blur-sm border border-border/40 p-1 relative z-10 mb-8">
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

          <TabsContent value="cli" className="animate-in fade-in-50 slide-in-from-top-2">
            <div className="space-y-12">
              {cliFaqCategories.map((category, categoryIndex) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
                      <category.icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-2xl font-semibold">{category.title}</h2>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, questionIndex) => (
                      <AccordionItem key={faq.question} value={`cli-item-${categoryIndex}-${questionIndex}`}>
                        <AccordionTrigger className="text-left hover:no-underline">
                          <span className="font-medium">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="code" className="animate-in fade-in-50 slide-in-from-top-2">
            <div className="space-y-12">
              {codeFaqCategories.map((category, categoryIndex) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
                      <category.icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-2xl font-semibold">{category.title}</h2>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, questionIndex) => (
                      <AccordionItem key={faq.question} value={`code-item-${categoryIndex}-${questionIndex}`}>
                        <AccordionTrigger className="text-left hover:no-underline">
                          <span className="font-medium">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* CTA Section */}
      <motion.div
        className="mx-auto mt-16 max-w-2xl text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Still have questions?</h2>
        <p className="text-muted-foreground mb-8">
          We're here to help. Reach out to our community or check out our documentation for more information.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent">
            <Link href="/docs">View Documentation</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="https://github.com/mk-knight23/vibe/discussions" target="_blank" rel="noopener noreferrer">
              Join Community
            </a>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}