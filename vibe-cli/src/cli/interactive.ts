import inquirer from 'inquirer';
import pc from 'picocolors';
import ora, { Ora } from 'ora';
import { ApiClient } from '../core/api';
import { logger } from '../utils/logger';
import { tools, executeTool } from '../tools';
import { parseFilesFromResponse } from '../utils/file-parser';
import { executeBashCommands } from '../utils/bash-executor';
import { handleCommand } from './command-handler';
import { VIBE_SYSTEM_PROMPT, VERSION, DEFAULT_MODEL } from './system-prompt';

const SYSTEM_PROMPT = VIBE_SYSTEM_PROMPT;

interface ConversationMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  tool_call_id?: string;
  tool_calls?: any[];
}

interface ProjectContext {
  name: string;
  type: string;
  techStack: string[];
  hasRouting: boolean;
  hasStyling: boolean;
  hasTesting: boolean;
}

export async function startInteractive(client: ApiClient): Promise<void> {
  // Show welcome banner
  showWelcomeBanner();
  
  // Run onboarding
  const onboardingChoice = await runOnboarding();
  
  // Set default provider
  client.setProvider('megallm');
  
  const messages: ConversationMessage[] = [{ role: 'system', content: SYSTEM_PROMPT }];
  let currentModel = DEFAULT_MODEL;
  let lastResponse = '';
  let projectContext: ProjectContext | null = null;
  
  // Handle onboarding choice
  if (onboardingChoice === 'new-project') {
    projectContext = await gatherProjectInfo();
    const projectPrompt = buildProjectPrompt(projectContext);
    messages.push({ role: 'user', content: projectPrompt });
    await processUserInput(client, messages, currentModel, projectPrompt, projectContext);
  } else if (onboardingChoice === 'analyze') {
    messages.push({ role: 'user', content: 'Analyze the current directory structure and tell me about this project' });
    await processUserInput(client, messages, currentModel, 'analyze current directory', null);
  } else if (onboardingChoice === 'model') {
    currentModel = await selectModel(client, currentModel);
  }
  
  // Main interaction loop
  while (true) {
    try {
      const { input } = await inquirer.prompt<{ input: string }>([{
        type: 'input',
        name: 'input',
        message: pc.cyan('You:')
      }]);
      
      if (!input.trim()) continue;
      
      // Handle commands
      if (input.startsWith('/')) {
        const result = await handleSlashCommand(input, client, currentModel, messages, lastResponse);
        if (result.action === 'quit') break;
        if (result.action === 'clear') {
          messages.length = 1; // Keep system prompt
          lastResponse = '';
          logger.success('Conversation cleared');
          continue;
        }
        if (result.action === 'model-changed') {
          currentModel = result.data as string;
          continue;
        }
        continue;
      }
      
      // Detect project creation intent
      const isProjectCreation = /\b(create|build|make|generate|scaffold)\b/i.test(input);
      
      if (isProjectCreation && !projectContext) {
        // Ask clarifying questions
        const shouldGatherInfo = await inquirer.prompt<{ gather: boolean }>([{
          type: 'confirm',
          name: 'gather',
          message: '📦 Would you like to configure project settings?',
          default: false
        }]);
        
        if (shouldGatherInfo.gather) {
          projectContext = await gatherProjectInfo();
        }
      }
      
      // Process user input
      lastResponse = await processUserInput(client, messages, currentModel, input, projectContext);
      
    } catch (error: any) {
      if (error.isTtyError) {
        logger.error('Prompt could not be rendered in this environment');
        break;
      }
      logger.error(`Unexpected error: ${error.message}`);
    }
  }
  
  showGoodbyeMessage();
}

function showWelcomeBanner(): void {
  console.clear();
  console.log(pc.cyan('═'.repeat(65)));
  console.log(pc.cyan('║') + ' '.repeat(63) + pc.cyan('║'));
  console.log(pc.cyan('║') + pc.bold(pc.white('   🎨 VIBE CLI v7.0.2')) + ' '.repeat(40) + pc.cyan('║'));
  console.log(pc.cyan('║') + pc.gray('   Your intelligent AI-powered development assistant') + ' '.repeat(10) + pc.cyan('║'));
  console.log(pc.cyan('║') + ' '.repeat(63) + pc.cyan('║'));
  console.log(pc.cyan('║') + pc.yellow('   🔥 Made by KAZI') + ' '.repeat(43) + pc.cyan('║'));
  console.log(pc.cyan('║') + ' '.repeat(63) + pc.cyan('║'));
  console.log(pc.cyan('═'.repeat(65)));
  console.log();
}

async function runOnboarding(): Promise<string> {
  const { choice } = await inquirer.prompt<{ choice: string }>([{
    type: 'list',
    name: 'choice',
    message: '✨ How would you like to begin?',
    choices: [
      { name: '📦 Create a new project', value: 'new-project' },
      { name: '📂 Continue existing project', value: 'continue' },
      { name: '🔍 Analyze current folder', value: 'analyze' },
      { name: '🤖 Switch AI model', value: 'model' },
      { name: '💬 Start chatting', value: 'chat' }
    ],
    default: 'chat'
  }]);
  
  console.log();
  return choice;
}

async function gatherProjectInfo(): Promise<ProjectContext> {
  console.log(pc.cyan('📋 Project Configuration\n'));
  
  const answers = await inquirer.prompt<{
    name: string;
    type: string;
    routing?: boolean;
    styling: string;
    testing: boolean;
  }>([
    {
      type: 'input',
      name: 'name',
      message: '📁 Project name:',
      default: 'my-app',
      validate: (input: string) => {
        if (!/^[a-z0-9-]+$/.test(input)) {
          return 'Use lowercase letters, numbers, and hyphens only';
        }
        return true;
      }
    },
    {
      type: 'list',
      name: 'type',
      message: '🎯 Project type:',
      choices: [
        { name: 'React App', value: 'react' },
        { name: 'Vue App', value: 'vue' },
        { name: 'Node.js API', value: 'node-api' },
        { name: 'Python App', value: 'python' },
        { name: 'HTML/CSS/JS', value: 'vanilla' },
        { name: 'Other', value: 'other' }
      ]
    },
    {
      type: 'confirm',
      name: 'routing',
      message: '🌐 Add routing?',
      default: false,
      when: (answers: any) => ['react', 'vue'].includes(answers.type)
    },
    {
      type: 'list',
      name: 'styling',
      message: '🎨 Styling solution:',
      choices: ['TailwindCSS', 'CSS Modules', 'Styled Components', 'Plain CSS', 'None'],
      default: 'TailwindCSS'
    },
    {
      type: 'confirm',
      name: 'testing',
      message: '🧪 Add testing setup?',
      default: false
    }
  ]);
  
  console.log();
  
  return {
    name: answers.name,
    type: answers.type,
    techStack: [answers.type, answers.styling].filter(Boolean),
    hasRouting: answers.routing || false,
    hasStyling: answers.styling !== 'None',
    hasTesting: answers.testing
  };
}

function buildProjectPrompt(context: ProjectContext): string {
  let prompt = `Create a ${context.type} project named "${context.name}"`;
  
  if (context.hasRouting) prompt += ' with routing';
  if (context.hasStyling) {
    const styling = context.techStack.find(t => t !== context.type);
    if (styling) prompt += ` using ${styling}`;
  }
  if (context.hasTesting) prompt += ' and include testing setup';
  
  prompt += '. Create a complete, production-ready project structure with all necessary files.';
  
  return prompt;
}

async function selectModel(client: ApiClient, currentModel: string): Promise<string> {
  const spinner = ora('Fetching available models...').start();
  
  try {
    const models = await client.fetchModels();
    spinner.stop();
    
    if (models.length === 0) {
      logger.warn('No models available for current provider');
      return currentModel;
    }
    
    const choices = models.map((m: any) => ({
      name: `${m.id || m.name} ${pc.gray(`(${m.contextLength || 'N/A'} tokens)`)}`,
      value: (m.id || m.name) as string
    }));
    
    const { model } = await inquirer.prompt<{ model: string }>([{
      type: 'list',
      name: 'model',
      message: '🤖 Select AI model:',
      choices,
      default: currentModel,
      pageSize: 15
    }]);
    
    logger.success(`Switched to ${model}`);
    console.log();
    console.log(pc.yellow('💡 Note: If you see raw tool syntax in responses, this model may not'));
    console.log(pc.yellow('   support function calling. Try switching providers with /provider'));
    console.log();
    return model;
    
  } catch (error: any) {
    spinner.stop();
    showError('Failed to fetch models', error.message, 'Try switching providers with /provider');
    return currentModel;
  }
}

async function handleSlashCommand(
  input: string,
  client: ApiClient,
  currentModel: string,
  messages: ConversationMessage[],
  lastResponse: string
): Promise<{ action: string; data?: any }> {
  
  const command = input.slice(1).split(' ')[0];
  
  switch (command) {
    case 'quit':
    case 'exit':
      return { action: 'quit' };
      
    case 'clear':
      return { action: 'clear' };
      
    case 'help':
      showHelp();
      return { action: 'none' };
      
    case 'model':
      const newModel = await selectModel(client, currentModel);
      return { action: 'model-changed', data: newModel };
      
    case 'models':
      suggestCompatibleModels();
      return { action: 'none' };
      
    case 'provider':
      await switchProvider(client);
      return { action: 'none' };
      
    case 'create':
      if (!lastResponse) {
        logger.warn('No previous response to create files from');
        return { action: 'none' };
      }
      await createFilesFromLastResponse(lastResponse, messages);
      return { action: 'none' };
      
    default:
      const handled = await handleCommand(input, client, currentModel);
      return { action: handled === 'quit' ? 'quit' : 'none' };
  }
}

async function switchProvider(client: ApiClient): Promise<void> {
  const { provider } = await inquirer.prompt<{ provider: string }>([{
    type: 'list',
    name: 'provider',
    message: '🔌 Select AI provider:',
    choices: [
      { name: 'MegaLLM (Recommended)', value: 'megallm' },
      { name: 'OpenRouter', value: 'openrouter' },
      { name: 'AgentRouter', value: 'agentrouter' },
      { name: 'Routeway', value: 'routeway' }
    ]
  }]);
  
  client.setProvider(provider as any);
  logger.success(`Switched to ${provider}`);
}

async function processUserInput(
  client: ApiClient,
  messages: ConversationMessage[],
  currentModel: string,
  input: string,
  projectContext: ProjectContext | null
): Promise<string> {
  
  messages.push({ role: 'user', content: input });
  
  const spinner = ora({
    text: 'AI is thinking...',
    color: 'cyan'
  }).start();
  
  try {
    const toolSchemas = tools.map(t => ({
      type: 'function',
      function: {
        name: t.name,
        description: t.description,
        parameters: {
          type: 'object',
          properties: Object.entries(t.parameters).reduce((acc, [key, val]: [string, any]) => {
            acc[key] = { type: val.type, description: val.description || '' };
            return acc;
          }, {} as any),
          required: Object.entries(t.parameters)
            .filter(([_, val]: [string, any]) => val.required)
            .map(([key]) => key)
        }
      }
    }));
    
    const response = await client.chat(messages, currentModel, {
      temperature: 0.7,
      maxTokens: 4000,
      tools: toolSchemas
    });
    
    spinner.stop();
    
    const assistantMessage = response.choices?.[0]?.message;
    if (!assistantMessage) {
      throw new Error('No response from AI');
    }
    
    const reply = assistantMessage.content || '';
    const toolCalls = assistantMessage.tool_calls || [];
    
    // Check for raw tool call syntax in content (fallback for models without proper function calling)
    if (reply.includes('<|tool_call') && !toolCalls.length) {
      console.log();
      console.log(pc.red('═'.repeat(65)));
      console.log(pc.red('❌ Function Calling Not Supported'));
      console.log(pc.red('═'.repeat(65)));
      console.log();
      console.log(pc.yellow('This model does not support function calling properly.'));
      console.log(pc.yellow('VIBE CLI requires function calling for file operations and tools.'));
      console.log();
      
      suggestCompatibleModels();
      
      messages.push({ role: 'assistant', content: reply });
      return reply;
    }
    
    let actionsPerformed = false;
    
    // Check if this is a project creation request
    const isProjectCreation = /\b(create|build|make|generate|scaffold)\b/i.test(input);
    
    if (reply && isProjectCreation) {
      // Parse and create files
      const projectName = projectContext?.name || inferProjectName(input);
      const files = parseFilesFromResponse(reply, projectName);
      
      if (files.length > 0) {
        await createFiles(files, projectName);
        actionsPerformed = true;
      }
      
      // Execute bash commands
      if (reply.includes('```bash') || reply.includes('```shell') || reply.includes('```sh')) {
        const shouldExecute = await promptShellExecution(reply);
        if (shouldExecute) {
          await executeShellCommands(reply);
          actionsPerformed = true;
        }
      }
    }
    
    // Show AI response if no actions were performed
    if (reply && !actionsPerformed) {
      renderAIResponse(reply);
    }
    
    messages.push({ role: 'assistant', content: reply });
    
    // Handle tool calls
    if (toolCalls.length > 0) {
      await executeToolCalls(toolCalls, messages, client, currentModel, toolSchemas);
    }
    
    return reply;
    
  } catch (error: any) {
    spinner.stop();
    showError('API Request Failed', error.message, 'Check your connection or try /provider to switch providers');
    return '';
  }
}

function inferProjectName(input: string): string {
  const createMatch = input.match(/\b(?:create|build|make|generate)\s+(?:a\s+)?(?:an\s+)?(\w+(?:-\w+)*)/i);
  if (createMatch) return createMatch[1] + '-app';
  return 'project';
}

async function createFiles(files: Array<{path: string, content: string}>, projectName: string): Promise<void> {
  console.log();
  console.log(pc.cyan('═'.repeat(65)));
  console.log(pc.cyan(`📁 Creating Project: ${pc.bold(projectName)}`));
  console.log(pc.cyan('═'.repeat(65)));
  console.log();
  
  const results = await Promise.allSettled(
    files.map(async (file) => {
      try {
        await executeTool('write_file', { file_path: file.path, content: file.content });
        return { path: file.path, success: true };
      } catch (err: any) {
        return { path: file.path, success: false, error: err.message };
      }
    })
  );
  
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      const { path, success, error } = result.value;
      if (success) {
        console.log(`${pc.green('✓')} ${path}`);
      } else {
        console.log(`${pc.red('✗')} ${path}: ${error}`);
      }
    }
  });
  
  const successCount = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
  
  console.log();
  console.log(pc.cyan('═'.repeat(65)));
  console.log(pc.green(`✅ Created ${successCount}/${files.length} file(s)`));
  console.log(pc.cyan('═'.repeat(65)));
  console.log();
}

async function promptShellExecution(response: string): Promise<boolean> {
  const bashBlocks = response.match(/```(?:bash|shell|sh)\n([\s\S]*?)```/g);
  if (!bashBlocks) return false;
  
  console.log();
  console.log(pc.yellow('🔧 Shell commands detected:'));
  console.log();
  
  bashBlocks.forEach(block => {
    const commands = block.replace(/```(?:bash|shell|sh)\n/, '').replace(/```$/, '').trim();
    commands.split('\n').forEach(cmd => {
      if (cmd.trim()) {
        console.log(pc.gray('  $ ') + pc.white(cmd.trim()));
      }
    });
  });
  
  console.log();
  
  const { execute } = await inquirer.prompt<{ execute: string }>([{
    type: 'list',
    name: 'execute',
    message: 'Would you like to execute these commands?',
    choices: [
      { name: '▸ Yes, run them', value: 'yes' },
      { name: '▸ No, skip', value: 'no' },
      { name: '▸ Show me a breakdown', value: 'breakdown' }
    ],
    default: 'yes'
  }]);
  
  if (execute === 'breakdown') {
    console.log(pc.cyan('\n📋 Command Breakdown:\n'));
    bashBlocks.forEach(block => {
      const commands = block.replace(/```(?:bash|shell|sh)\n/, '').replace(/```$/, '').trim();
      commands.split('\n').forEach(cmd => {
        if (cmd.trim()) {
          console.log(pc.yellow('Command: ') + pc.white(cmd.trim()));
          console.log(pc.gray('Purpose: ') + explainCommand(cmd.trim()));
          console.log();
        }
      });
    });
    
    const { executeAfter } = await inquirer.prompt<{ executeAfter: boolean }>([{
      type: 'confirm',
      name: 'executeAfter',
      message: 'Execute now?',
      default: true
    }]);
    
    return executeAfter;
  }
  
  return execute === 'yes';
}

function explainCommand(cmd: string): string {
  if (cmd.startsWith('cd ')) return 'Change directory';
  if (cmd.startsWith('npm install')) return 'Install dependencies';
  if (cmd.startsWith('npm run')) return 'Run npm script';
  if (cmd.startsWith('git init')) return 'Initialize git repository';
  if (cmd.startsWith('mkdir')) return 'Create directory';
  if (cmd.startsWith('touch')) return 'Create file';
  return 'Execute command';
}

async function executeShellCommands(response: string): Promise<void> {
  console.log();
  console.log(pc.cyan('═'.repeat(65)));
  console.log(pc.cyan('🔧 Executing Shell Commands'));
  console.log(pc.cyan('═'.repeat(65)));
  console.log();
  
  const executed = await executeBashCommands(response);
  
  console.log();
  console.log(pc.cyan('═'.repeat(65)));
  console.log(pc.green(`✅ Executed ${executed.length} command(s)`));
  console.log(pc.cyan('═'.repeat(65)));
  console.log();
}

async function executeToolCalls(
  toolCalls: any[],
  messages: ConversationMessage[],
  client: ApiClient,
  currentModel: string,
  toolSchemas: any[]
): Promise<void> {
  
  for (const call of toolCalls) {
    const tool = tools.find(t => t.name === call.function.name);
    if (!tool) continue;
    
    const args = JSON.parse(call.function.arguments);
    
    console.log();
    console.log(pc.cyan('═'.repeat(65)));
    console.log(pc.cyan(`🔧 Running Tool: ${pc.bold(tool.displayName)}`));
    console.log(pc.gray(`Parameters: ${JSON.stringify(args).substring(0, 80)}...`));
    console.log(pc.cyan('═'.repeat(65)));
    
    let approved = !tool.requiresConfirmation;
    
    if (tool.requiresConfirmation) {
      const { confirm } = await inquirer.prompt<{ confirm: boolean }>([{
        type: 'confirm',
        name: 'confirm',
        message: `Execute ${tool.displayName}?`,
        default: true
      }]);
      approved = confirm;
    }
    
    if (approved) {
      const spinner = ora(`Executing ${tool.displayName}...`).start();
      
      try {
        const result = await executeTool(call.function.name, args);
        spinner.succeed(`${tool.displayName} completed`);
        
        console.log(pc.green('📦 Status: Success'));
        console.log(pc.cyan('═'.repeat(65)));
        console.log();
        
        messages.push({
          role: 'tool',
          tool_call_id: call.id,
          content: JSON.stringify(result)
        });
        
      } catch (err: any) {
        spinner.fail(`${tool.displayName} failed`);
        
        console.log(pc.red('❌ Status: Failed'));
        console.log(pc.red(`Error: ${err.message}`));
        console.log(pc.cyan('═'.repeat(65)));
        console.log();
        
        messages.push({
          role: 'tool',
          tool_call_id: call.id,
          content: `Error: ${err.message}`
        });
      }
    }
  }
  
  // Get AI's follow-up response
  if (toolCalls.length > 0) {
    const followUpSpinner = ora('Processing results...').start();
    
    try {
      const nextResponse = await client.chat(messages, currentModel, {
        temperature: 0.7,
        maxTokens: 4000,
        tools: toolSchemas
      });
      
      followUpSpinner.stop();
      
      const nextReply = nextResponse.choices?.[0]?.message?.content || '';
      if (nextReply) {
        renderAIResponse(nextReply);
        messages.push({ role: 'assistant', content: nextReply });
      }
      
    } catch (err: any) {
      followUpSpinner.stop();
      showError('Follow-up failed', err.message);
    }
  }
}

function renderAIResponse(message: string): void {
  console.log();
  console.log(pc.cyan('═'.repeat(65)));
  console.log(pc.cyan('🧠 AI Response'));
  console.log(pc.cyan('═'.repeat(65)));
  console.log();
  console.log(message);
  console.log();
  console.log(pc.cyan('═'.repeat(65)));
  console.log();
}

function showError(title: string, reason: string, suggestion?: string): void {
  console.log();
  console.log(pc.red('═'.repeat(65)));
  console.log(pc.red(`❌ ${title}`));
  console.log(pc.red('═'.repeat(65)));
  console.log();
  console.log(pc.red('Reason: ') + reason);
  if (suggestion) {
    console.log(pc.yellow('Suggestion: ') + suggestion);
  }
  console.log();
  console.log(pc.red('═'.repeat(65)));
  console.log();
}

function showHelp(): void {
  console.log();
  console.log(pc.cyan('═'.repeat(65)));
  console.log(pc.cyan('📚 Available Commands'));
  console.log(pc.cyan('═'.repeat(65)));
  console.log();
  console.log(pc.yellow('/help') + '      - Show this help message');
  console.log(pc.yellow('/quit') + '      - Exit the CLI');
  console.log(pc.yellow('/clear') + '     - Clear conversation history');
  console.log(pc.yellow('/model') + '     - Switch AI model');
  console.log(pc.yellow('/models') + '    - Show compatible models');
  console.log(pc.yellow('/provider') + '  - Switch AI provider');
  console.log(pc.yellow('/create') + '    - Create files from last response');
  console.log();
  console.log(pc.cyan('═'.repeat(65)));
  console.log();
}

function showGoodbyeMessage(): void {
  console.log();
  console.log(pc.cyan('═'.repeat(65)));
  console.log(pc.cyan('👋 Thanks for using VIBE CLI!'));
  console.log(pc.gray('   Made with ❤️  by KAZI'));
  console.log(pc.cyan('═'.repeat(65)));
  console.log();
}

function suggestCompatibleModels(): void {
  console.log();
  console.log(pc.cyan('═'.repeat(65)));
  console.log(pc.cyan('🤖 Recommended Models with Function Calling Support'));
  console.log(pc.cyan('═'.repeat(65)));
  console.log();
  console.log(pc.green('OpenRouter:'));
  console.log('  • anthropic/claude-3.5-sonnet');
  console.log('  • openai/gpt-4o-mini');
  console.log('  • google/gemini-2.0-flash-exp:free');
  console.log();
  console.log(pc.green('MegaLLM:'));
  console.log('  • qwen/qwen3-next-80b-a3b-instruct (default)');
  console.log();
  console.log(pc.yellow('💡 Switch with: /model'));
  console.log(pc.cyan('═'.repeat(65)));
  console.log();
}

async function createFilesFromLastResponse(lastResponse: string, messages: ConversationMessage[]): Promise<void> {
  const lastUserMsg = messages.filter((m: ConversationMessage) => m.role === 'user').pop()?.content || '';
  const projectName = inferProjectName(lastUserMsg);
  const files = parseFilesFromResponse(lastResponse, projectName);
  
  if (files.length === 0) {
    logger.warn('No code blocks found in last response');
    return;
  }
  
  await createFiles(files, projectName);
}
