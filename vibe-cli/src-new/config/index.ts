/**
 * Configuration Manager
 * 
 * Handles loading, saving, and accessing user configuration.
 * Configuration is stored in ~/.vibe/config.json
 * 
 * @module config
 */

import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { Config } from '../types';

// Default configuration
const DEFAULT_CONFIG: Config = {
  provider: 'openrouter',
  model: 'meta-llama/llama-3.3-70b-instruct:free',
  apiKey: '',
  temperature: 0.7,
  maxTokens: 4000
};

// In-memory config cache
let config: Config = { ...DEFAULT_CONFIG };

// Configuration file path
const CONFIG_DIR = path.join(os.homedir(), '.vibe');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

/**
 * Load configuration from disk
 * Creates default config if none exists
 */
export async function loadConfiguration(): Promise<void> {
  try {
    // Ensure config directory exists
    await fs.mkdir(CONFIG_DIR, { recursive: true });
    
    // Try to read existing config
    const data = await fs.readFile(CONFIG_FILE, 'utf-8');
    config = { ...DEFAULT_CONFIG, ...JSON.parse(data) };
  } catch (error) {
    // If file doesn't exist, create it with defaults
    await saveConfiguration(DEFAULT_CONFIG);
  }
}

/**
 * Save configuration to disk
 */
export async function saveConfiguration(newConfig: Partial<Config>): Promise<void> {
  config = { ...config, ...newConfig };
  await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
}

/**
 * Get current configuration
 */
export function getConfig(): Config {
  return { ...config };
}

/**
 * Update a single config value
 */
export async function updateConfig(key: keyof Config, value: any): Promise<void> {
  await saveConfiguration({ [key]: value });
}
