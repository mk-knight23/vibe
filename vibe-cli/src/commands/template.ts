import { templates, TemplateManager } from './templates';
import inquirer from 'inquirer';

const templateManager = new TemplateManager();

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
      console.error('Unknown template action. Use: list, create, info');
  }
}

function listTemplates(): void {
  console.log('\nAvailable Templates:');
  const allTemplates = templateManager.listTemplates();
  
  allTemplates.forEach((tpl: any) => {
    console.log(`  ${tpl.id || tpl.name} - ${tpl.name}`);
    console.log(`    ${tpl.description}`);
  });
}

async function createFromTemplate(templateId: string, targetDir?: string): Promise<void> {
  if (!templateId) {
    console.error('Template ID required');
    return;
  }

  const template = templateManager.getTemplate(templateId);
  if (!template) {
    console.error(`Template ${templateId} not found`);
    return;
  }

  const dir = targetDir || 'new-project';
  
  console.log(`Creating project from ${templateId}...`);
  
  try {
    await templateManager.createProject(templateId, dir);
    console.log(`✓ Project created in ${dir}`);
    
    console.log('\nNext Steps:');
    console.log(`  cd ${dir}`);
    console.log(`  npm install`);
    console.log(`  npm run dev`);
  } catch (error) {
    console.error('Failed to create project:', (error as Error).message);
  }
}

function showTemplateInfo(id: string): void {
  const template = templateManager.getTemplate(id);
  if (!template) {
    console.error(`Template ${id} not found`);
    return;
  }

  console.log(`\nTemplate: ${template.name}`);
  console.log(`Description: ${template.description}`);
  console.log(`\nFiles:`);
  if (Array.isArray(template.files)) {
    template.files.forEach((file: any) => {
      console.log(`  - ${file.path}`);
    });
  } else {
    Object.keys(template.files).forEach(path => {
      console.log(`  - ${path}`);
    });
  }
}
