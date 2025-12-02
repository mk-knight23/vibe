'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Layers, 
  Terminal, 
  Code2, 
  Download, 
  Sparkles, 
  BookOpen, 
  MessageSquare, 
  Command, 
  HelpCircle,
  Github,
  Menu,
  ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';

const mainNavItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/providers', label: 'Providers', icon: Layers },
  { href: '/cli', label: 'CLI', icon: Terminal },
  { href: '/vscode', label: 'VS Code', icon: Code2 },
];

const resourceItems = [
  { href: '/installation', label: 'Installation', icon: Download, desc: 'Get started in 2 minutes' },
  { href: '/features', label: 'Features', icon: Sparkles, desc: 'Explore capabilities' },
  { href: '/docs', label: 'Documentation', icon: BookOpen, desc: 'Complete guides' },
  { href: '/chat', label: 'AI Chat', icon: MessageSquare, desc: 'Try it in browser' },
  { href: '/commands', label: 'Commands', icon: Command, desc: 'CLI & VS Code' },
  { href: '/faq', label: 'FAQ', icon: HelpCircle, desc: 'Common questions' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              VIBE
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "gap-1.5 transition-all text-xs",
                      isActive && "bg-accent text-accent-foreground"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                  <Menu className="h-3.5 w-3.5" />
                  Resources
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                {resourceItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.href}>
                      <DropdownMenuItem asChild>
                        <Link href={item.href} className="flex items-start gap-3 p-3 cursor-pointer">
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{item.label}</div>
                            <div className="text-xs text-muted-foreground">{item.desc}</div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      {idx < resourceItems.length - 1 && <DropdownMenuSeparator />}
                    </div>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a href="https://github.com/mk-knight23/vibe" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                <Github className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
