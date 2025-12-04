export interface WorkflowStep {
  id: string;
  name: string;
  action: (context: WorkflowContext) => Promise<any>;
  condition?: (context: WorkflowContext) => boolean;
  onError?: (error: Error, context: WorkflowContext) => Promise<void>;
}

export interface WorkflowContext {
  data: Map<string, any>;
  results: Map<string, any>;
}

export interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
}

export class WorkflowEngine {
  private workflows: Map<string, Workflow> = new Map();

  registerWorkflow(workflow: Workflow): void {
    this.workflows.set(workflow.id, workflow);
  }

  async executeWorkflow(workflowId: string, initialData?: Record<string, any>): Promise<WorkflowContext> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) throw new Error(`Workflow ${workflowId} not found`);

    const context: WorkflowContext = {
      data: new Map(Object.entries(initialData || {})),
      results: new Map()
    };

    for (const step of workflow.steps) {
      if (step.condition && !step.condition(context)) continue;

      try {
        const result = await step.action(context);
        context.results.set(step.id, result);
      } catch (error) {
        if (step.onError) {
          await step.onError(error as Error, context);
        } else {
          throw error;
        }
      }
    }

    return context;
  }

  getWorkflow(id: string): Workflow | undefined {
    return this.workflows.get(id);
  }

  listWorkflows(): Workflow[] {
    return Array.from(this.workflows.values());
  }
}
import { promises as fs } from 'fs';
import { join } from 'path';

export interface Template {
  id: string;
  name: string;
  description: string;
  files: TemplateFile[];
  variables?: Record<string, string>;
}

export interface TemplateFile {
  path: string;
  content: string;
}

export class TemplateManager {
  private templates: Map<string, Template> = new Map();

  registerTemplate(template: Template): void {
    this.templates.set(template.id, template);
  }

  async applyTemplate(templateId: string, targetDir: string, variables?: Record<string, string>): Promise<void> {
    const template = this.templates.get(templateId);
    if (!template) throw new Error(`Template ${templateId} not found`);

    const vars = { ...template.variables, ...variables };

    for (const file of template.files) {
      const filePath = join(targetDir, this.replaceVariables(file.path, vars));
      const content = this.replaceVariables(file.content, vars);
      
      await fs.mkdir(join(filePath, '..'), { recursive: true });
      await fs.writeFile(filePath, content, 'utf-8');
    }
  }

  private replaceVariables(text: string, variables: Record<string, string>): string {
    return text.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] || '');
  }

  getTemplate(id: string): Template | undefined {
    return this.templates.get(id);
  }

  listTemplates(): Template[] {
    return Array.from(this.templates.values());
  }

  async create(templateId: string, projectName: string): Promise<void> {
    await this.applyTemplate(templateId, projectName, { projectName });
  }
}
