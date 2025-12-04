// Team Collaboration Features
import { writeFile, readFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export interface TeamConfig {
  name: string;
  members: string[];
  rules: Record<string, any>;
  workflows: string[];
}

export class TeamCollaboration {
  private configPath: string = '.vibe/team.json';

  async initTeam(name: string): Promise<void> {
    const config: TeamConfig = {
      name,
      members: [],
      rules: {},
      workflows: []
    };

    await mkdir('.vibe', { recursive: true });
    await writeFile(this.configPath, JSON.stringify(config, null, 2));
  }

  async addMember(email: string): Promise<void> {
    const config = await this.loadConfig();
    if (!config.members.includes(email)) {
      config.members.push(email);
      await this.saveConfig(config);
    }
  }

  async removeMember(email: string): Promise<void> {
    const config = await this.loadConfig();
    config.members = config.members.filter(m => m !== email);
    await this.saveConfig(config);
  }

  async setRule(key: string, value: any): Promise<void> {
    const config = await this.loadConfig();
    config.rules[key] = value;
    await this.saveConfig(config);
  }

  async getRule(key: string): Promise<any> {
    const config = await this.loadConfig();
    return config.rules[key];
  }

  async shareWorkflow(name: string, workflow: any): Promise<void> {
    const config = await this.loadConfig();
    const workflowPath = join('.vibe', 'workflows', `${name}.json`);
    
    await mkdir(join('.vibe', 'workflows'), { recursive: true });
    await writeFile(workflowPath, JSON.stringify(workflow, null, 2));
    
    if (!config.workflows.includes(name)) {
      config.workflows.push(name);
      await this.saveConfig(config);
    }
  }

  async getWorkflow(name: string): Promise<any> {
    const workflowPath = join('.vibe', 'workflows', `${name}.json`);
    const content = await readFile(workflowPath, 'utf-8');
    return JSON.parse(content);
  }

  async listWorkflows(): Promise<string[]> {
    const config = await this.loadConfig();
    return config.workflows;
  }

  private async loadConfig(): Promise<TeamConfig> {
    if (!existsSync(this.configPath)) {
      throw new Error('Team not initialized. Run: /team init');
    }
    const content = await readFile(this.configPath, 'utf-8');
    return JSON.parse(content);
  }

  private async saveConfig(config: TeamConfig): Promise<void> {
    await writeFile(this.configPath, JSON.stringify(config, null, 2));
  }

  async getTeamInfo(): Promise<TeamConfig> {
    return await this.loadConfig();
  }
}
import simpleGit, { SimpleGit } from 'simple-git';

export class GitHubAutomation {
  private git: SimpleGit;

  constructor(repoPath: string = process.cwd()) {
    this.git = simpleGit(repoPath);
  }

  async generateCommitMessage(files: string[]): Promise<string> {
    const status = await this.git.status();
    const changes = status.modified.concat(status.created, status.deleted);
    
    if (changes.length === 0) return 'chore: update files';
    
    const types = new Set<string>();
    changes.forEach(file => {
      if (file.includes('test')) types.add('test');
      else if (file.includes('doc')) types.add('docs');
      else if (file.includes('.json')) types.add('chore');
      else types.add('feat');
    });
    
    const type = Array.from(types)[0];
    return `${type}: update ${changes.length} file(s)`;
  }

  async commit(message?: string): Promise<void> {
    const status = await this.git.status();
    if (status.files.length === 0) {
      throw new Error('No changes to commit');
    }
    
    await this.git.add('.');
    const commitMsg = message || await this.generateCommitMessage(status.files.map(f => f.path));
    await this.git.commit(commitMsg);
  }

  async createBranch(branchName: string): Promise<void> {
    await this.git.checkoutLocalBranch(branchName);
  }

  async push(remote: string = 'origin', branch?: string): Promise<void> {
    const currentBranch = branch || (await this.git.branch()).current;
    await this.git.push(remote, currentBranch);
  }

  async getStatus(): Promise<string> {
    const status = await this.git.status();
    return `Branch: ${status.current}\nModified: ${status.modified.length}\nStaged: ${status.staged.length}`;
  }
}
