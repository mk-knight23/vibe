#!/usr/bin/env node

/**
 * VIBE CLI v9.0.0 - Ultimate AI Development Platform
 * 
 * Features:
 * - Multi-Agent Orchestration with 5 specialized roles
 * - Extended Thinking for complex reasoning
 * - Semantic Memory with embeddings
 * - 36+ Advanced Tools
 * 
 * @module cli/index
 * @author KAZI
 * @version 9.0.0
 */

import { startInteractive } from './interactive';
import { ApiClient } from '../core/api';

// Single source of truth - read from package.json at build time
const VERSION = '9.0.0';

const BANNER = `
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎨 VIBE v${VERSION} - ULTIMATE EDITION                       ║
║   AI-Powered Development Platform                        ║
║                                                           ║
║   ✨ Multi-Agent • Extended Thinking • Semantic Memory  ║
║   🔥 Made by KAZI                                        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`;

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.includes('--version') || args.includes('-v')) {
    console.log(`VIBE v${VERSION}`);
    process.exit(0);
  }

  if (args.includes('--help') || args.includes('-h')) {
    console.log(BANNER);
    console.log(`
Usage: vibe [options]

Options:
  -v, --version     Show version number
  -h, --help        Show this help message
  
Commands:
  vibe              Start interactive AI assistant mode
  
Features:
  🤖 Multi-Agent - 5 specialized roles working together
  🧠 Extended Thinking - Complex reasoning support
  🔍 Semantic Memory - Embedding-based search
  🛠️  36+ Tools - Code analysis, security, refactoring
  
Examples:
  vibe              Start VIBE CLI
  vibe --version    Display current version
  vibe --help       Show detailed help
    `);
    process.exit(0);
  }

  console.log(BANNER);
  console.log('Type /help for available commands\n');
  
  try {
    const client = new ApiClient();
    await startInteractive(client);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'EACCES') {
      console.error('💡 Tip: Check file permissions');
    } else if (error.code === 'ENOENT') {
      console.error('💡 Tip: Required file or directory not found');
    }
    
    process.exit(1);
  }
}

main();
