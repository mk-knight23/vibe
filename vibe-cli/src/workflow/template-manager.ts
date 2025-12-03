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
}
