/**
 * Config Command
 * Manages CLI configuration
 * @module commands/config-command
 */

import { getConfig, updateConfig } from '../config';
import { logger } from '../lib/logger';

export async function configCommand(args: string[]): Promise<void> {
  const [action, key, value] = args;
  
  if (!action) {
    // Show current config
    const config = getConfig();
    console.log('\n📝 Current Configuration:\n');
    console.log(JSON.stringify(config, null, 2));
    return;
  }
  
  if (action === 'set' && key && value) {
    await updateConfig(key as any, value);
    logger.success(`Updated ${key} = ${value}`);
  } else {
    logger.error('Usage: config [set <key> <value>]');
  }
}
