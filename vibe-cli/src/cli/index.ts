#!/usr/bin/env node

/**
 * VIBE CLI - Main Entry Point
 * 
 * This is the primary entry point for the VIBE AI Development Platform CLI.
 * It handles command-line arguments, displays help/version info, and starts
 * the interactive mode with the AI assistant.
 * 
 * Features:
 * - Multi-provider AI support (OpenRouter, MegaLLM, AgentRouter, Routeway)
 * - 60+ commands for development tasks
 * - 42+ tools for file operations, shell execution, web scraping
 * - Advanced memory management and context awareness
 * - Multi-file editing capabilities
 * 
 * @module cli/index
 * @author KAZI
 * @version 7.0.5
 */

import { startInteractive } from './interactive';
import { ApiClient } from '../core/api';

/** Current version of VIBE CLI */
const VERSION = '7.0.7';

/** Welcome banner displayed on startup */
const BANNER = `
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎨 VIBE v7.0.7                                         ║
║   AI-Powered Development Platform                        ║
║                                                           ║
║   🔥 Made by KAZI                                        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`;

/**
 * Main application entry point
 * Handles CLI arguments and starts interactive mode
 * 
 * @async
 * @returns {Promise<void>}
 */
async function main(): Promise<void> {
  // Parse command-line arguments (skip node and script path)
  const args = process.argv.slice(2);

  // Handle version flag
  if (args.includes('--version') || args.includes('-v')) {
    console.log(`VIBE v${VERSION}`);
    process.exit(0);
  }

  // Handle help flag
  if (args.includes('--help') || args.includes('-h')) {
    console.log(BANNER);
    console.log(`
Usage: vibe [options]

Options:
  -v, --version     Show version number
  -h, --help        Show this help message
  
Commands:
  vibe              Start interactive AI assistant mode
  
Examples:
  vibe              Start VIBE CLI with default settings
  vibe --version    Display current version
  vibe --help       Show detailed help information
    `);
    process.exit(0);
  }

  // Display welcome banner
  console.log(BANNER);
  console.log('Type /help for available commands\n');
  
  try {
    // Initialize API client with default provider (MegaLLM)
    const client = new ApiClient();
    
    // Start interactive mode
    await startInteractive(client);
  } catch (error: any) {
    // Handle any startup errors gracefully
    console.error('❌ Error:', error.message);
    
    // Provide helpful error context
    if (error.code === 'EACCES') {
      console.error('💡 Tip: Check file permissions');
    } else if (error.code === 'ENOENT') {
      console.error('💡 Tip: Required file or directory not found');
    }
    
    process.exit(1);
  }
}

// Start the application
main();
