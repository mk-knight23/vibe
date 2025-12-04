/**
 * VIBE CLI - Main Entry Point
 * 
 * This is the primary entry point for the VIBE CLI application.
 * It initializes the CLI, loads configuration, and starts the interactive mode.
 * 
 * @module index
 */

import { startCLI } from './cli';
import { loadConfiguration } from './config';
import { logger } from './lib/logger';

/**
 * Main function - Entry point for the application
 * Handles initialization and error catching
 */
async function main(): Promise<void> {
  try {
    // Load user configuration from ~/.vibe/config.json
    await loadConfiguration();
    
    // Start the CLI in interactive mode
    await startCLI();
  } catch (error) {
    // Log any fatal errors and exit
    logger.error('Fatal error:', error);
    process.exit(1);
  }
}

// Execute main function
main();
