import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * Pricing Page
 * Details about free and upcoming premium features
 */

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-12 md:pt-16 space-y-16">
      <header className="text-center">
        <h1 className="font-headline font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary text-[2.6rem] md:text-[3.2rem]">
          Pricing
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Simple, transparent pricing. Start for free and upgrade when you need premium features.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Free Plan */}
        <Card className="border border-border/50 bg-card/60 backdrop-blur-sm glow-border ambient p-6">
          <CardHeader className="pb-6">
            <div className="inline-flex items-center justify-center rounded-full bg-green-500/15 p-2 w-12 h-12 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
                <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                <path d="M16 6.54 17.46 5 22 9.54l-1.46 1.46L16 6.54Z" />
                <path d="M8 6.54 6.54 5 2 9.54l1.46 1.46L8 6.54Z" />
              </svg>
            </div>
            <CardTitle className="text-2xl">Free Plan</CardTitle>
            <CardDescription className="mt-2">
              Everything you need to get started with AI-powered development
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mt-0.5 flex-shrink-0">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>Unlimited access to free models via OpenRouter</span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mt-0.5 flex-shrink-0">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>Vibe CLI with all core features</span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mt-0.5 flex-shrink-0">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>Vibe VS Code extension access</span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mt-0.5 flex-shrink-0">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>Chat, generate, refactor, debug commands</span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mt-0.5 flex-shrink-0">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>Agent workflows with checkpoints</span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mt-0.5 flex-shrink-0">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>MegaLLM API key support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/installation">Get Started Free</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="border-2 border-accent/50 bg-card/70 backdrop-blur-sm glow-border ambient p-6 relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
            Coming Soon
          </div>
          <CardHeader className="pb-6">
            <div className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500/15 p-2 w-12 h-12 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <CardTitle className="text-2xl">Pro Plan</CardTitle>
            <CardDescription className="mt-2">
              Advanced features for professional development teams
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent mt-0.5 flex-shrink-0">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>Access to premium models (GPT-4, Claude 3, etc.)</span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent mt-0.5 flex-shrink-0">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>Higher rate limits and faster response times</span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent mt-0.5 flex-shrink-0">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>Priority support and dedicated onboarding</span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent mt-0.5 flex-shrink-0">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>Advanced security and privacy features</span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent mt-0.5 flex-shrink-0">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>Team collaboration and shared environments</span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent mt-0.5 flex-shrink-0">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>Advanced analytics and usage insights</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-gradient-to-r from-primary to-accent" disabled>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Early Access Sign Up
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="text-center mt-16">
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto grid gap-6">
          <div className="p-4 rounded-xl border border-border/50 bg-card/40">
            <h3 className="font-medium mb-2">Why is Vibe free?</h3>
            <p className="text-sm text-muted-foreground">Vibe is free to democratize access to AI-powered development tools. We leverage free models from OpenRouter and other providers to keep costs low while providing high-quality assistance.</p>
          </div>
          <div className="p-4 rounded-xl border border-border/50 bg-card/40">
            <h3 className="font-medium mb-2">When will Pro features be available?</h3>
            <p className="text-sm text-muted-foreground">Our Pro plan with premium features is expected to launch in early 2025. Join our waitlist to be notified when it's ready.</p>
          </div>
          <div className="p-4 rounded-xl border border-border/50 bg-card/40">
            <h3 className="font-medium mb-2">What models are included in the free plan?</h3>
            <p className="text-sm text-muted-foreground">The free plan includes access to over 15 free models from OpenRouter, including z-ai/glm-4.5-air:free, gpt-4o-mini, claude-3.5-sonnet:beta, and more.</p>
          </div>
        </div>
      </div>
    </div>
  );
}