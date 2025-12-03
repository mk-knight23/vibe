import { orchestrator } from '../core/orchestrator';
import { allTemplates } from '../workflow/templates';
import inquirer from 'inquirer';

export async function templateCommand(args: string[]): Promise<void> {
  const [action, ...params] = args;

  switch (action) {
    case 'list':
      listTemplates();
      break;
    case 'create':
      await createFromTemplate(params[0], params[1]);
      break;
    case 'info':
      showTemplateInfo(params[0]);
      break;
    default:
      orchestrator.ui.error('Unknown template action. Use: list, create, info');
  }
}

function listTemplates(): void {
  orchestrator.ui.section('Available Templates');
  const templates = orchestrator.templateManager.listTemplates();
  
  templates.forEach(tpl => {
    console.log(`  ${tpl.id} - ${tpl.name}`);
    console.log(`    ${tpl.description}`);
  });
}

async function createFromTemplate(templateId: string, targetDir?: string): Promise<void> {
  if (!templateId) {
    orchestrator.ui.error('Template ID required');
    return;
  }

  const template = orchestrator.templateManager.getTemplate(templateId);
  if (!template) {
    orchestrator.ui.error(`Template ${templateId} not found`);
    return;
  }

  // Prompt for variables
  const variables: Record<string, string> = {};
  if (template.variables) {
    const answers = await inquirer.prompt(
      Object.keys(template.variables).map(key => ({
        type: 'input',
        name: key,
        message: `Enter ${key}:`,
        default: template.variables![key]
      }))
    );
    Object.assign(variables, answers);
  }

  const dir = targetDir || variables.projectName || 'new-project';
  
  orchestrator.ui.showProgress(`Creating project from ${templateId}`);
  
  try {
    await orchestrator.templateManager.applyTemplate(templateId, dir, variables);
    orchestrator.ui.stopProgress(true, `Project created in ${dir}`);
    
    orchestrator.ui.section('Next Steps');
    console.log(`  cd ${dir}`);
    console.log(`  npm install`);
    console.log(`  npm run dev`);
  } catch (error) {
    orchestrator.ui.stopProgress(false, 'Failed to create project');
    orchestrator.ui.error((error as Error).message);
  }
}

function showTemplateInfo(id: string): void {
  const template = orchestrator.templateManager.getTemplate(id);
  if (!template) {
    orchestrator.ui.error(`Template ${id} not found`);
    return;
  }

  orchestrator.ui.section(`Template: ${template.name}`);
  console.log(`ID: ${template.id}`);
  console.log(`Description: ${template.description}`);
  console.log(`\nFiles:`);
  template.files.forEach(file => {
    console.log(`  - ${file.path}`);
  });
  
  if (template.variables) {
    console.log(`\nVariables:`);
    Object.entries(template.variables).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
  }
}

// Register templates on module load
allTemplates.forEach(tpl => orchestrator.templateManager.registerTemplate(tpl));
