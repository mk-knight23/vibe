import pc from 'picocolors';
import { ApiClient } from '../core/api';
import { commands, findCommand, getCommandsByCategory } from '../commands/registry';
import { agentCommand } from '../commands/misc';
import { tools } from '../tools';
import { getHealthStatus, formatHealthStatus } from '../core/health';
import { 
  getSecurityLists, 
  isDryRun, 
  AuditLogger,
  getRiskIndicator 
} from '../core/security';

export async function handleCommand(
  input: string,
  client: ApiClient,
  currentModel: string
): Promise<string | void> {
  const parts = input.slice(1).trim().split(' ');
  const cmdName = parts[0].toLowerCase();
  const args = parts.slice(1);

  // Handle health command directly (not in registry)
  if (cmdName === 'health') {
    const health = await getHealthStatus();
    console.log('\n' + formatHealthStatus(health) + '\n');
    return;
  }

  // Handle security command
  if (cmdName === 'security') {
    showSecurityStatus(args[0]);
    return;
  }

  const command = findCommand(cmdName);
  
  if (!command) {
    console.log(pc.red(`Unknown command: ${cmdName}`));
    console.log(pc.yellow('Type /help for available commands'));
    return;
  }

  switch (command.name) {
    case 'help':
      showHelp(args[0]);
      break;
    
    case 'quit':
      console.log(pc.cyan('\n👋 Goodbye\n'));
      return 'quit';
    
    case 'clear':
      console.log(pc.green('✓ Cleared'));
      return 'clear';
    
    case 'version':
      console.log(pc.cyan('\nVIBE CLI v9.0.0'));
      console.log(pc.gray('36 Tools | 4 Providers | 27+ Models\n'));
      break;
    
    case 'model':
      return 'model';
    
    case 'provider':
      return 'provider';
    
    case 'create':
      return 'create';
    
    case 'tools':
      showAllTools();
      break;
    
    case 'memory':
      return 'memory';
    
    case 'analyze':
      await executeTool('analyze_code_quality', { file_path: args[0] || '.' });
      break;
    
    case 'refactor':
      if (!args[0]) {
        console.log(pc.yellow('Usage: /refactor <file> [extract|inline]'));
        return;
      }
      await executeTool('smart_refactor', { file_path: args[0], type: args[1] || 'extract' });
      break;
    
    case 'test':
      if (!args[0]) {
        console.log(pc.yellow('Usage: /test <file> [vitest|jest|mocha]'));
        return;
      }
      await executeTool('generate_tests', { file_path: args[0], framework: args[1] || 'vitest' });
      break;
    
    case 'optimize':
      await executeTool('optimize_bundle', { project_path: args[0] || '.' });
      break;
    
    case 'security':
      await executeTool('security_scan', { project_path: args[0] || '.' });
      break;
    
    case 'benchmark':
      if (!args[0]) {
        console.log(pc.yellow('Usage: /benchmark <file>'));
        return;
      }
      await executeTool('performance_benchmark', { file_path: args[0] });
      break;
    
    case 'docs':
      if (!args[0]) {
        console.log(pc.yellow('Usage: /docs <file>'));
        return;
      }
      await executeTool('generate_documentation', { file_path: args[0] });
      break;
    
    case 'migrate':
      if (!args[0] || !args[1] || !args[2]) {
        console.log(pc.yellow('Usage: /migrate <file> <from> <to>'));
        console.log(pc.gray('Example: /migrate app.js commonjs esm'));
        return;
      }
      await executeTool('migrate_code', { file_path: args[0], from: args[1], to: args[2] });
      break;
    
    case 'agent':
      await agentCommand(client, currentModel);
      break;
    
    case 'scan':
      await runProjectScan(args[0] || '.');
      break;
    
    default:
      console.log(pc.yellow(`Command not implemented: ${command.name}`));
  }
}

async function executeTool(toolName: string, params: any): Promise<void> {
  const tool = tools.find(t => t.name === toolName);
  if (!tool) {
    console.log(pc.red(`Tool not found: ${toolName}`));
    return;
  }
  
  try {
    console.log(pc.cyan(`\n⚡ ${tool.displayName}\n`));
    const result = await tool.handler(params);
    console.log(result);
    console.log();
  } catch (error: any) {
    console.log(pc.red(`✗ ${error.message}\n`));
  }
}

async function runProjectScan(projectPath: string): Promise<void> {
  console.log(pc.cyan('\n🔍 Project Scan\n'));
  
  const scanTools = [
    { name: 'get_project_info', params: {} },
    { name: 'analyze_code_quality', params: { file_path: projectPath } },
    { name: 'security_scan', params: { project_path: projectPath } },
    { name: 'optimize_bundle', params: { project_path: projectPath } }
  ];
  
  for (const { name, params } of scanTools) {
    const tool = tools.find(t => t.name === name);
    if (tool) {
      try {
        console.log(pc.gray(`Running ${tool.displayName}...`));
        const result = await tool.handler(params);
        console.log(result);
        console.log();
      } catch (error: any) {
        console.log(pc.red(`✗ ${error.message}`));
      }
    }
  }
}

function showHelp(specificCommand?: string): void {
  if (specificCommand) {
    const cmd = findCommand(specificCommand);
    if (cmd) {
      console.log(`\n${pc.bold(pc.cyan(cmd.name.toUpperCase()))}`);
      console.log(pc.gray('─'.repeat(60)));
      console.log(`${pc.bold('Description:')} ${cmd.description}`);
      console.log(`${pc.bold('Usage:')} ${cmd.usage}`);
      if (cmd.aliases?.length) {
        console.log(`${pc.bold('Aliases:')} ${cmd.aliases.join(', ')}`);
      }
      console.log();
    } else {
      console.log(pc.red(`Command not found: ${specificCommand}`));
    }
    return;
  }

  console.log(`
${pc.bold(pc.cyan('VIBE CLI v9.0.0'))}
${pc.gray('36 Tools | 4 Providers | 27+ Models')}

${pc.bold('BASIC')}
${formatCommands(getCommandsByCategory('basic'))}

${pc.bold('AI')}
${formatCommands(getCommandsByCategory('ai'))}

${pc.bold('PROJECT')}
${formatCommands(getCommandsByCategory('project'))}

${pc.bold('ADVANCED')}
${formatCommands(getCommandsByCategory('advanced'))}

${pc.gray('Type /help <command> for details')}
  `);
}

function formatCommands(cmds: any[]): string {
  return cmds.map(cmd => {
    const aliases = cmd.aliases ? pc.gray(` (${cmd.aliases.join(', ')})`) : '';
    return `  ${pc.cyan(`/${cmd.name}`)}${aliases} - ${pc.gray(cmd.description)}`;
  }).join('\n');
}

function showAllTools(): void {
  console.log(`\n${pc.bold(pc.cyan('AVAILABLE TOOLS (36)'))}\n`);
  
  const byCategory: Record<string, string[]> = {};
  tools.forEach(t => {
    if (!byCategory[t.category!]) byCategory[t.category!] = [];
    byCategory[t.category!].push(`${t.displayName} - ${t.description}`);
  });

  Object.entries(byCategory).sort().forEach(([category, toolList]) => {
    console.log(pc.bold(category.toUpperCase()));
    toolList.forEach(tool => console.log(`  ${pc.gray(tool)}`));
    console.log();
  });
}

function showSecurityStatus(subcommand?: string): void {
  const lists = getSecurityLists();
  const dryRun = isDryRun();
  const logger = new AuditLogger();
  const recentAudit = logger.getRecent(10);

  console.log(`\n${pc.bold(pc.cyan('🔒 SECURITY STATUS'))}\n`);
  
  // Mode
  console.log(pc.bold('Mode:'));
  console.log(`  ${dryRun ? pc.yellow('🔍 DRY-RUN (write operations blocked)') : pc.green('🟢 NORMAL')}`);
  console.log();

  if (subcommand === 'audit') {
    // Show audit log
    console.log(pc.bold('Recent Audit Log:'));
    if (recentAudit.length === 0) {
      console.log(pc.gray('  No audit entries'));
    } else {
      recentAudit.slice(0, 10).forEach(entry => {
        const indicator = getRiskIndicator(entry.riskLevel);
        const time = new Date(entry.timestamp).toLocaleTimeString();
        console.log(`  ${indicator} [${time}] ${entry.action} ${entry.command || ''}`);
      });
    }
    console.log();
    return;
  }

  if (subcommand === 'lists') {
    // Show allow/deny lists
    console.log(pc.bold('Allowed Commands (always safe):'));
    lists.allowedCommands.slice(0, 10).forEach(cmd => {
      console.log(`  ${pc.green('✓')} ${cmd}`);
    });
    console.log(pc.gray(`  ... and ${lists.allowedCommands.length - 10} more`));
    console.log();
    return;
  }

  // Default: show summary
  console.log(pc.bold('Risk Levels:'));
  console.log(`  ${getRiskIndicator('safe')} SAFE - Read-only, no approval needed`);
  console.log(`  ${getRiskIndicator('low')} LOW - Minor changes, approval recommended`);
  console.log(`  ${getRiskIndicator('medium')} MEDIUM - Write operations, approval required`);
  console.log(`  ${getRiskIndicator('high')} HIGH - Destructive operations, explicit approval`);
  console.log(`  ${getRiskIndicator('blocked')} BLOCKED - Never allowed`);
  console.log();

  console.log(pc.bold('Operation Types:'));
  console.log(`  📖 READ (${lists.readOperations.length} tools) - No side effects`);
  console.log(`  ✏️  WRITE (${lists.writeOperations.length} tools) - Has side effects`);
  console.log();

  console.log(pc.bold('Commands:'));
  console.log(`  ${pc.cyan('/security audit')} - View recent audit log`);
  console.log(`  ${pc.cyan('/security lists')} - View allow/deny lists`);
  console.log();

  console.log(pc.bold('Environment:'));
  console.log(`  VIBE_DRY_RUN=${dryRun ? 'true' : 'false'} - ${dryRun ? 'Write ops blocked' : 'Normal mode'}`);
  console.log(`  VIBE_AUDIT=${process.env.VIBE_AUDIT !== 'false' ? 'true' : 'false'} - Audit logging`);
  console.log();
}
