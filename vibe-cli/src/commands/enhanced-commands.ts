import { ProjectAnalyzer } from '../analysis/project-analyzer';
import { CommandExecutor } from '../execution/command-executor';
import { GitHubAutomation } from '../integrations/github-automation';
import { FileManager } from '../file-system/file-manager';
import { orchestrator } from '../core/orchestrator';

export async function analyzeCommand(): Promise<void> {
  orchestrator.ui.showProgress('Analyzing project...');
  
  const analyzer = new ProjectAnalyzer(process.cwd());
  const structure = await analyzer.analyzeProject();
  
  orchestrator.ui.stopProgress(true, 'Analysis complete');
  orchestrator.ui.section('Project Structure');
  
  console.log(`Total Files: ${structure.files.length}`);
  console.log(`Total Lines: ${structure.totalLines}`);
  console.log(`\nLanguages:`);
  structure.languages.forEach((count, lang) => {
    console.log(`  ${lang}: ${count} files`);
  });
  
  if (structure.dependencies.length > 0) {
    console.log(`\nDependencies: ${structure.dependencies.length}`);
  }
}

export async function executeCommand(command: string): Promise<void> {
  const executor = new CommandExecutor();
  
  orchestrator.ui.info(`Executing: ${command}`);
  const result = await executor.execute(command);
  
  if (result.exitCode === 0) {
    orchestrator.ui.success('Command completed');
    if (result.stdout) console.log(result.stdout);
  } else {
    orchestrator.ui.error('Command failed');
    if (result.stderr) console.error(result.stderr);
  }
}

export async function gitCommand(action: string, ...args: string[]): Promise<void> {
  const git = new GitHubAutomation();
  
  switch (action) {
    case 'commit':
      await git.commit(args[0]);
      orchestrator.ui.success('Changes committed');
      break;
    case 'push':
      await git.push();
      orchestrator.ui.success('Changes pushed');
      break;
    case 'status':
      const status = await git.getStatus();
      console.log(status);
      break;
    case 'branch':
      await git.createBranch(args[0]);
      orchestrator.ui.success(`Branch ${args[0]} created`);
      break;
    default:
      orchestrator.ui.error('Unknown git action');
  }
}

export async function fileCommand(action: string, ...args: string[]): Promise<void> {
  const fm = new FileManager();
  
  switch (action) {
    case 'read':
      const content = await fm.readFile(args[0]);
      console.log(content);
      break;
    case 'write':
      await fm.writeFile(args[0], args[1]);
      orchestrator.ui.success(`File written: ${args[0]}`);
      break;
    case 'delete':
      await fm.deleteFile(args[0]);
      orchestrator.ui.success(`File deleted: ${args[0]}`);
      break;
    default:
      orchestrator.ui.error('Unknown file action');
  }
}
