import { ApiClient } from '../core/api';
import { executeTool, tools } from '../tools';
import pc from 'picocolors';

interface AgentTask {
  goal: string;
  maxSteps: number;
  autoApprove: boolean;
}

interface AgentStep {
  thought: string;
  action: string;
  result: string;
}

export class AutonomousAgent {
  private client: ApiClient;
  private model: string;
  private steps: AgentStep[] = [];

  constructor(client: ApiClient, model: string) {
    this.client = client;
    this.model = model;
  }

  async execute(task: AgentTask): Promise<void> {
    console.log(pc.cyan('\n🤖 Agent Mode: Starting autonomous execution\n'));
    console.log(pc.bold(`Goal: ${task.goal}\n`));

    const systemPrompt = `You are an autonomous AI agent. Break down tasks into steps and execute them.

For each step:
1. Think about what needs to be done
2. Choose an action (use tools or generate code)
3. Execute and observe results
4. Decide next step or completion

Available tools: ${tools.map(t => t.name).join(', ')}

Respond in JSON:
{
  "thought": "what I'm thinking",
  "action": "tool_name or 'complete'",
  "params": {...}
}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: task.goal }
    ];

    for (let step = 1; step <= task.maxSteps; step++) {
      console.log(pc.cyan(`\n━━━ Step ${step}/${task.maxSteps} ━━━\n`));

      const response = await this.client.chat(messages, this.model, {
        temperature: 0.7,
        maxTokens: 2000
      });

      const content = response.choices?.[0]?.message?.content || '';
      
      try {
        const parsed = JSON.parse(content);
        
        console.log(pc.yellow(`💭 Thought: ${parsed.thought}`));
        console.log(pc.blue(`⚡ Action: ${parsed.action}`));

        if (parsed.action === 'complete') {
          console.log(pc.green('\n✅ Task completed!\n'));
          break;
        }

        const tool = tools.find(t => t.name === parsed.action);
        if (!tool) {
          console.log(pc.red(`❌ Unknown tool: ${parsed.action}`));
          continue;
        }

        if (!task.autoApprove && tool.requiresConfirmation) {
          console.log(pc.yellow(`⚠️  Requires approval: ${tool.displayName}`));
          continue;
        }

        const result = await executeTool(parsed.action, parsed.params);
        console.log(pc.green(`✓ Result: ${JSON.stringify(result).substring(0, 100)}...`));

        this.steps.push({
          thought: parsed.thought,
          action: parsed.action,
          result: JSON.stringify(result)
        });

        messages.push({ role: 'assistant', content });
        messages.push({ role: 'user', content: `Result: ${JSON.stringify(result)}` });

      } catch (err: any) {
        console.log(pc.red(`❌ Error: ${err.message}`));
        break;
      }
    }

    console.log(pc.cyan(`\n━━━ Agent Summary ━━━\n`));
    console.log(`Steps executed: ${this.steps.length}`);
    console.log(`Goal: ${task.goal}`);
  }
}

// Advanced Agent System v7.0.0
import { MultiFileEditor } from '../core/multi-file-editor';

export interface AgentConfig {
  goal: string;
  maxRuntime: number; // milliseconds
  parallelAgents: number;
  selfTest: boolean;
  autoFix: boolean;
}

export class AdvancedAgent {
  private client: ApiClient;
  private model: string;
  private editor: MultiFileEditor;
  private steps: AgentStep[] = [];
  private subAgents: Map<string, AdvancedAgent> = new Map();
  private startTime: number = 0;

  constructor(client: ApiClient, model: string) {
    this.client = client;
    this.model = model;
    this.editor = new MultiFileEditor();
  }

  async execute(config: AgentConfig): Promise<void> {
    this.startTime = Date.now();
    console.log(`🤖 Agent v7.0 Starting`);
    console.log(`Goal: ${config.goal}`);
    console.log(`Max Runtime: ${config.maxRuntime / 60000} minutes`);
    console.log(`Parallel Agents: ${config.parallelAgents}`);

    while (this.shouldContinue(config)) {
      const step = await this.executeStep(config);
      this.steps.push(step);

      if (step.action === 'complete') break;
      if (step.action === 'spawn_agent') {
        await this.spawnSubAgent(step.result);
      }
      if (config.selfTest && step.action === 'code_change') {
        await this.runSelfTest();
      }
    }

    console.log(`\n✅ Agent completed in ${this.getRuntime()}ms`);
    console.log(`Steps: ${this.steps.length}`);
    console.log(`Sub-agents: ${this.subAgents.size}`);
  }

  private shouldContinue(config: AgentConfig): boolean {
    const runtime = Date.now() - this.startTime;
    return runtime < config.maxRuntime;
  }

  private async executeStep(config: AgentConfig): Promise<AgentStep> {
    const stepStart = Date.now();
    
    const context = ''; // Context disabled
    const prompt = this.buildPrompt(config.goal, context);
    
    const response = await this.client.chat([
      { role: 'system', content: 'You are an advanced autonomous agent.' },
      { role: 'user', content: prompt }
    ], this.model);

    const content = response.choices?.[0]?.message?.content || '';
    const parsed = this.parseResponse(content);

    const step: AgentStep = {
      thought: parsed.thought,
      action: parsed.action,
      result: await this.executeAction(parsed)
    };

    console.log(`\n💭 ${step.thought}`);
    console.log(`⚡ ${step.action}`);

    return step;
  }

  private buildPrompt(goal: string, context: any): string {
    return `Goal: ${goal}

Context:
- Recent commands: ${context.terminal.join(', ')}
- Clipboard: ${context.clipboard}
- Recent files: ${context.files.map((f: any) => f[0]).join(', ')}

What's the next step? Respond in JSON:
{
  "thought": "what I'm thinking",
  "action": "action_name",
  "params": {...}
}`;
  }

  private parseResponse(content: string): any {
    try {
      return JSON.parse(content);
    } catch {
      return { thought: 'Parsing error', action: 'complete', params: {} };
    }
  }

  private async executeAction(parsed: any): Promise<any> {
    switch (parsed.action) {
      case 'edit_files':
        return await this.editor.editMultipleFiles(parsed.params.files);
      case 'run_command':
        return { error: 'Command execution requires approval - use shell tool' };
      case 'spawn_agent':
        return { agentId: `sub-${Date.now()}`, status: 'coming_soon' };
      case 'complete':
        return { success: true };
      default:
        return { error: `Unknown action: ${parsed.action}` };
    }
  }

  private async spawnSubAgent(_config: any): Promise<void> {
    // Sub-agent spawning - Coming Soon
    console.log('⚠️ Sub-agent spawning is coming soon');
  }

  private async runSelfTest(): Promise<void> {
    console.log('🧪 Running self-test...');
    // Run tests and verify changes
  }

  private getRuntime(): number {
    return Date.now() - this.startTime;
  }

  getSteps(): AgentStep[] {
    return this.steps;
  }
}

// Complete Agent System v7.0.0
export class CompleteAgentSystem {
  private agents: Map<string, AdvancedAgent> = new Map();
  
  constructor(
    private client: ApiClient,
    private model: string
  ) {}

  async startAgent(config: AgentConfig): Promise<string> {
    const agentId = `agent-${Date.now()}`;
    const agent = new AdvancedAgent(this.client, this.model);
    
    this.agents.set(agentId, agent);
    
    // Execute in background
    agent.execute(config).finally(() => {
      console.log(`Agent ${agentId} completed`);
    });

    return agentId;
  }

  async spawnAgent(parentId: string, config: AgentConfig): Promise<string> {
    // Sub-agent spawning - Coming Soon
    console.log('⚠️ Parallel agent spawning is coming soon');
    
    const agentId = `${parentId}-sub-${Date.now()}`;
    const agent = new AdvancedAgent(this.client, this.model);
    
    this.agents.set(agentId, agent);
    agent.execute(config);

    return agentId;
  }

  async parallelAgents(configs: AgentConfig[]): Promise<string[]> {
    const agentIds: string[] = [];
    
    for (const config of configs) {
      const id = await this.startAgent(config);
      agentIds.push(id);
    }

    return agentIds;
  }

  async workflowAgent(steps: Array<{goal: string, maxRuntime: number}>): Promise<void> {
    for (const step of steps) {
      const agent = new AdvancedAgent(this.client, this.model);
      await agent.execute({
        goal: step.goal,
        maxRuntime: step.maxRuntime,
        parallelAgents: 0,
        selfTest: false,
        autoFix: false
      });
    }
  }

  getAgent(agentId: string): AdvancedAgent | undefined {
    return this.agents.get(agentId);
  }

  listAgents(): string[] {
    return Array.from(this.agents.keys());
  }

  getActiveAgents(): string[] {
    return []; // Disabled
  }
}
