import { orchestrator } from '../core/orchestrator';
import { allWorkflows } from '../workflow/workflows';

export async function workflowCommand(args: string[]): Promise<void> {
  const [action, ...params] = args;

  switch (action) {
    case 'list':
      listWorkflows();
      break;
    case 'run':
      await runWorkflow(params[0], params.slice(1));
      break;
    case 'info':
      showWorkflowInfo(params[0]);
      break;
    default:
      orchestrator.ui.error('Unknown workflow action. Use: list, run, info');
  }
}

function listWorkflows(): void {
  orchestrator.ui.section('Available Workflows');
  const workflows = orchestrator.workflowEngine.listWorkflows();
  
  workflows.forEach(wf => {
    console.log(`  ${wf.id} - ${wf.name} (${wf.steps.length} steps)`);
  });
}

async function runWorkflow(id: string, params: string[]): Promise<void> {
  if (!id) {
    orchestrator.ui.error('Workflow ID required');
    return;
  }

  orchestrator.ui.showProgress(`Running workflow: ${id}`);
  
  try {
    const data: Record<string, any> = {};
    params.forEach(param => {
      const [key, value] = param.split('=');
      if (key && value) data[key] = value;
    });

    const result = await orchestrator.workflowEngine.executeWorkflow(id, data);
    orchestrator.ui.stopProgress(true, 'Workflow completed');
    
    orchestrator.ui.section('Results');
    for (const [key, value] of result.results.entries()) {
      console.log(`  ${key}:`, value);
    }
  } catch (error) {
    orchestrator.ui.stopProgress(false, 'Workflow failed');
    orchestrator.ui.error((error as Error).message);
  }
}

function showWorkflowInfo(id: string): void {
  const workflow = orchestrator.workflowEngine.getWorkflow(id);
  if (!workflow) {
    orchestrator.ui.error(`Workflow ${id} not found`);
    return;
  }

  orchestrator.ui.section(`Workflow: ${workflow.name}`);
  console.log(`ID: ${workflow.id}`);
  console.log(`\nSteps:`);
  workflow.steps.forEach((step, i) => {
    console.log(`  ${i + 1}. ${step.name}`);
  });
}

// Register workflows on module load
allWorkflows.forEach(wf => orchestrator.workflowEngine.registerWorkflow(wf));
