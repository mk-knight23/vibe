import { ApiClient } from '../core/api';

export interface Command {
  name: string;
  aliases?: string[];
  category: 'basic' | 'ai' | 'project' | 'advanced';
  description: string;
  usage: string;
  crossPlatform: boolean;
  handler: (client: ApiClient, model: string, args?: any) => Promise<string | void>;
}

export const commands: Command[] = [
  // BASIC
  {
    name: 'help',
    aliases: ['h', '?'],
    category: 'basic',
    description: 'Show help',
    usage: '/help [command]',
    crossPlatform: true,
    handler: async () => 'help'
  },
  {
    name: 'quit',
    aliases: ['exit', 'q'],
    category: 'basic',
    description: 'Exit CLI',
    usage: '/quit',
    crossPlatform: true,
    handler: async () => 'quit'
  },
  {
    name: 'clear',
    aliases: ['cls'],
    category: 'basic',
    description: 'Clear conversation',
    usage: '/clear',
    crossPlatform: true,
    handler: async () => 'clear'
  },
  {
    name: 'version',
    aliases: ['v'],
    category: 'basic',
    description: 'Show version',
    usage: '/version',
    crossPlatform: true,
    handler: async () => 'version'
  },
  {
    name: 'tools',
    aliases: ['t'],
    category: 'basic',
    description: 'List all tools',
    usage: '/tools',
    crossPlatform: true,
    handler: async () => 'tools'
  },

  // AI
  {
    name: 'model',
    aliases: ['m'],
    category: 'ai',
    description: 'Switch AI model',
    usage: '/model',
    crossPlatform: true,
    handler: async () => 'model'
  },
  {
    name: 'provider',
    aliases: ['p'],
    category: 'ai',
    description: 'Switch provider',
    usage: '/provider',
    crossPlatform: true,
    handler: async () => 'provider'
  },

  // PROJECT
  {
    name: 'analyze',
    aliases: ['scan'],
    category: 'project',
    description: 'Analyze code quality',
    usage: '/analyze [path]',
    crossPlatform: true,
    handler: async () => 'analyze'
  },
  {
    name: 'security',
    aliases: ['sec'],
    category: 'project',
    description: 'Security scan',
    usage: '/security [path]',
    crossPlatform: true,
    handler: async () => 'security'
  },
  {
    name: 'optimize',
    aliases: ['opt'],
    category: 'project',
    description: 'Optimize bundle',
    usage: '/optimize [path]',
    crossPlatform: true,
    handler: async () => 'optimize'
  },
  {
    name: 'scan',
    category: 'project',
    description: 'Full project scan (quality + security + optimization)',
    usage: '/scan [path]',
    crossPlatform: true,
    handler: async () => 'scan'
  },

  // ADVANCED
  {
    name: 'refactor',
    category: 'advanced',
    description: 'Refactor code',
    usage: '/refactor <file> [extract|inline]',
    crossPlatform: true,
    handler: async () => 'refactor'
  },
  {
    name: 'test',
    category: 'advanced',
    description: 'Generate tests',
    usage: '/test <file> [framework]',
    crossPlatform: true,
    handler: async () => 'test'
  },
  {
    name: 'docs',
    category: 'advanced',
    description: 'Generate docs',
    usage: '/docs <file>',
    crossPlatform: true,
    handler: async () => 'docs'
  },
  {
    name: 'migrate',
    category: 'advanced',
    description: 'Migrate code',
    usage: '/migrate <file> <from> <to>',
    crossPlatform: true,
    handler: async () => 'migrate'
  },
  {
    name: 'benchmark',
    aliases: ['bench'],
    category: 'advanced',
    description: 'Performance benchmark',
    usage: '/benchmark <file>',
    crossPlatform: true,
    handler: async () => 'benchmark'
  },
  {
    name: 'memory',
    aliases: ['mem'],
    category: 'advanced',
    description: 'View/search memory',
    usage: '/memory [search <query>|clear]',
    crossPlatform: true,
    handler: async () => 'memory'
  },
  {
    name: 'agent',
    aliases: ['auto'],
    category: 'advanced',
    description: 'Autonomous mode',
    usage: '/agent',
    crossPlatform: true,
    handler: async () => 'agent'
  },
  {
    name: 'create',
    aliases: ['c'],
    category: 'advanced',
    description: 'Create files from response',
    usage: '/create',
    crossPlatform: true,
    handler: async () => 'create'
  }
];

export function findCommand(input: string): Command | undefined {
  const name = input.toLowerCase();
  return commands.find(cmd => 
    cmd.name === name || cmd.aliases?.includes(name)
  );
}

export function getCommandsByCategory(category: string): Command[] {
  return commands.filter(cmd => cmd.category === category);
}
