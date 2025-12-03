export interface Plugin {
  name: string;
  version: string;
  activate: (context: PluginContext) => Promise<void>;
  deactivate?: () => Promise<void>;
}

export interface PluginContext {
  registerCommand: (name: string, handler: Function) => void;
  registerProvider: (name: string, provider: any) => void;
  config: any;
}

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private activePlugins: Set<string> = new Set();

  async loadPlugin(plugin: Plugin): Promise<void> {
    this.plugins.set(plugin.name, plugin);
  }

  async activatePlugin(name: string, context: PluginContext): Promise<void> {
    const plugin = this.plugins.get(name);
    if (!plugin) throw new Error(`Plugin ${name} not found`);
    await plugin.activate(context);
    this.activePlugins.add(name);
  }

  async deactivatePlugin(name: string): Promise<void> {
    const plugin = this.plugins.get(name);
    if (plugin?.deactivate) await plugin.deactivate();
    this.activePlugins.delete(name);
  }

  getActivePlugins(): string[] {
    return Array.from(this.activePlugins);
  }
}
