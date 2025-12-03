import { Workflow } from '../workflow-engine';
import { promises as fs } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const projectSetupWorkflow: Workflow = {
  id: 'project-setup',
  name: 'Project Setup',
  steps: [
    {
      id: 'create-dir',
      name: 'Create project directory',
      action: async (ctx) => {
        const dir = ctx.data.get('projectDir');
        await fs.mkdir(dir, { recursive: true });
        return dir;
      }
    },
    {
      id: 'init-git',
      name: 'Initialize Git',
      action: async (ctx) => {
        const dir = ctx.results.get('create-dir');
        await execAsync('git init', { cwd: dir });
        return true;
      }
    },
    {
      id: 'install-deps',
      name: 'Install dependencies',
      action: async (ctx) => {
        const dir = ctx.results.get('create-dir');
        await execAsync('npm install', { cwd: dir });
        return true;
      },
      onError: async (error, ctx) => {
        console.warn('Failed to install dependencies:', error.message);
      }
    }
  ]
};

export const codeReviewWorkflow: Workflow = {
  id: 'code-review',
  name: 'Code Review',
  steps: [
    {
      id: 'analyze-files',
      name: 'Analyze changed files',
      action: async (ctx) => {
        const files = ctx.data.get('files') || [];
        const analysis = [];
        
        for (const file of files) {
          const content = await fs.readFile(file, 'utf-8');
          analysis.push({ file, lines: content.split('\n').length });
        }
        
        return analysis;
      }
    },
    {
      id: 'check-style',
      name: 'Check code style',
      action: async (ctx) => {
        // Placeholder for linting
        return { passed: true };
      }
    },
    {
      id: 'generate-report',
      name: 'Generate review report',
      action: async (ctx) => {
        const analysis = ctx.results.get('analyze-files');
        const style = ctx.results.get('check-style');
        
        return {
          filesAnalyzed: analysis.length,
          styleCheck: style.passed ? 'Passed' : 'Failed'
        };
      }
    }
  ]
};

export const deploymentWorkflow: Workflow = {
  id: 'deployment',
  name: 'Deployment',
  steps: [
    {
      id: 'run-tests',
      name: 'Run tests',
      action: async (ctx) => {
        const dir = ctx.data.get('projectDir');
        await execAsync('npm test', { cwd: dir });
        return true;
      }
    },
    {
      id: 'build',
      name: 'Build project',
      action: async (ctx) => {
        const dir = ctx.data.get('projectDir');
        await execAsync('npm run build', { cwd: dir });
        return true;
      }
    },
    {
      id: 'deploy',
      name: 'Deploy to production',
      action: async (ctx) => {
        // Placeholder for deployment logic
        return { deployed: true, url: 'https://example.com' };
      }
    }
  ]
};

export const allWorkflows = [projectSetupWorkflow, codeReviewWorkflow, deploymentWorkflow];
