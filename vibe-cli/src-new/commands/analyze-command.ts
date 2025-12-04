/**
 * Project Analysis Command
 * 
 * Analyzes project structure, dependencies, and code metrics
 * 
 * @module commands/analyze-command
 */

import { analyzeProject } from '../features/analyzer';
import { logger } from '../lib/logger';

/**
 * Execute analyze command
 */
export async function analyzeCommand(args: string[]): Promise<void> {
  const directory = args[0] || process.cwd();
  
  logger.info(`Analyzing project in: ${directory}`);
  
  try {
    const analysis = await analyzeProject(directory);
    
    // Display results
    console.log('\n📊 Project Analysis\n');
    console.log(`Files: ${analysis.fileCount}`);
    console.log(`Lines of Code: ${analysis.totalLines}`);
    console.log(`Languages: ${Object.keys(analysis.languages).join(', ')}`);
    console.log(`Dependencies: ${analysis.dependencies.length}`);
    
    logger.success('Analysis complete');
  } catch (error) {
    logger.error('Analysis failed:', error);
  }
}
