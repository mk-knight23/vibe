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
