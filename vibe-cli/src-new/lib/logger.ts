/**
 * Logger Utility
 * 
 * Provides consistent logging across the application
 * with colored output and formatting
 * 
 * @module lib/logger
 */

import pc from 'picocolors';

/**
 * Logger class with various output methods
 */
class Logger {
  /**
   * Log informational message
   */
  info(message: string, ...args: any[]): void {
    console.log(pc.blue('ℹ'), message, ...args);
  }
  
  /**
   * Log success message
   */
  success(message: string, ...args: any[]): void {
    console.log(pc.green('✓'), message, ...args);
  }
  
  /**
   * Log warning message
   */
  warn(message: string, ...args: any[]): void {
    console.log(pc.yellow('⚠'), message, ...args);
  }
  
  /**
   * Log error message
   */
  error(message: string, ...args: any[]): void {
    console.error(pc.red('✗'), message, ...args);
  }
  
  /**
   * Log debug message (only in development)
   */
  debug(message: string, ...args: any[]): void {
    if (process.env.DEBUG) {
      console.log(pc.dim('🐛'), message, ...args);
    }
  }
  
  /**
   * Display a boxed message (for headers)
   */
  box(title: string, subtitle?: string): void {
    const width = 50;
    const line = '─'.repeat(width);
    
    console.log(pc.cyan(`┌${line}┐`));
    console.log(pc.cyan('│') + pc.bold(title.padEnd(width)) + pc.cyan('│'));
    
    if (subtitle) {
      console.log(pc.cyan('│') + pc.dim(subtitle.padEnd(width)) + pc.cyan('│'));
    }
    
    console.log(pc.cyan(`└${line}┘`));
  }
}

// Export singleton instance
export const logger = new Logger();
