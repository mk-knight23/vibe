import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface WorkspaceMemory {
  files: string[];
  structure: string;
  fileSummaries: Record<string, string>;
  lastUpdated: string;
  recentChanges: string[];
}

interface TaskMemory {
  description: string;
  filesCreated: string[];
  filesModified: string[];
  errors: string[];
  suggestions: string[];
  timestamp: number;
}

interface ConversationState {
  keyPoints: string[];
  decisions: string[];
  currentArchitecture: Record<string, any>;
  projectType: string;
  pendingTasks: string[];
  workspaceMemory: WorkspaceMemory;
  taskHistory: TaskMemory[];
}

export class MemoryManager {
  private state: ConversationState;
  private memoryFile: string;
  private maxTaskHistory = 10;
  private maxChanges = 20;

  constructor(workspaceDir: string = process.cwd()) {
    this.memoryFile = path.join(workspaceDir, '.vibe', 'memory.json');
    this.state = this.loadState();
  }

  private loadState(): ConversationState {
    try {
      if (fs.existsSync(this.memoryFile)) {
        return JSON.parse(fs.readFileSync(this.memoryFile, 'utf-8'));
      }
    } catch (error) {
      // Ignore load errors
    }

    return {
      keyPoints: [],
      decisions: [],
      currentArchitecture: {},
      projectType: 'unknown',
      pendingTasks: [],
      workspaceMemory: {
        files: [],
        structure: '',
        fileSummaries: {},
        lastUpdated: '',
        recentChanges: []
      },
      taskHistory: []
    };
  }

  private saveState(): void {
    try {
      const dir = path.dirname(this.memoryFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.memoryFile, JSON.stringify(this.state, null, 2));
    } catch (error) {
      // Ignore save errors
    }
  }

  updateWorkspaceMemory(): void {
    try {
      const cwd = process.cwd();
      
      // Get file list
      const files = this.getFileList(cwd);
      this.state.workspaceMemory.files = files;
      
      // Get directory structure
      this.state.workspaceMemory.structure = this.getDirectoryTree(cwd);
      
      // Detect project type
      if (fs.existsSync(path.join(cwd, 'package.json'))) {
        const pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf-8'));
        if (pkg.dependencies?.react) this.state.projectType = 'React';
        else if (pkg.dependencies?.next) this.state.projectType = 'Next.js';
        else if (pkg.dependencies?.vue) this.state.projectType = 'Vue';
        else if (pkg.dependencies?.express) this.state.projectType = 'Node.js/Express';
        else this.state.projectType = 'Node.js';
      } else if (fs.existsSync(path.join(cwd, 'requirements.txt'))) {
        this.state.projectType = 'Python';
      } else if (fs.existsSync(path.join(cwd, 'Cargo.toml'))) {
        this.state.projectType = 'Rust';
      }
      
      this.saveState();
    } catch (error) {
      // Ignore errors
    }
  }

  private getFileList(dir: string): string[] {
    try {
      const result = execSync('git ls-files 2>/dev/null || find . -type f -not -path "*/node_modules/*" -not -path "*/.git/*" | head -100', {
        cwd: dir,
        encoding: 'utf-8'
      });
      return result.trim().split('\n').filter(Boolean).slice(0, 100);
    } catch {
      return [];
    }
  }

  private getDirectoryTree(dir: string): string {
    try {
      const result = execSync('tree -L 2 -I "node_modules|.git" 2>/dev/null || ls -R | head -50', {
        cwd: dir,
        encoding: 'utf-8'
      });
      return result.substring(0, 1000);
    } catch {
      return 'Unable to generate tree';
    }
  }

  onFileWrite(filePath: string, content: string): void {
    this.state.workspaceMemory.lastUpdated = filePath;
    this.state.workspaceMemory.recentChanges.unshift(`Created/Updated: ${filePath}`);
    this.state.workspaceMemory.recentChanges = this.state.workspaceMemory.recentChanges.slice(0, this.maxChanges);
    
    // Store summary
    const summary = content.substring(0, 200).replace(/\n/g, ' ');
    this.state.workspaceMemory.fileSummaries[filePath] = summary;
    
    this.updateWorkspaceMemory();
  }

  onFileRead(filePath: string, content: string): void {
    if (!this.state.workspaceMemory.fileSummaries[filePath]) {
      const summary = content.substring(0, 200).replace(/\n/g, ' ');
      this.state.workspaceMemory.fileSummaries[filePath] = summary;
      this.saveState();
    }
  }

  onShellCommand(command: string, result: string): void {
    this.state.workspaceMemory.recentChanges.unshift(`Shell: ${command}`);
    this.state.workspaceMemory.recentChanges = this.state.workspaceMemory.recentChanges.slice(0, this.maxChanges);
    this.saveState();
  }

  onError(error: string): void {
    const currentTask = this.state.taskHistory[0];
    if (currentTask) {
      currentTask.errors.push(error);
      this.saveState();
    }
  }

  startTask(description: string): void {
    const task: TaskMemory = {
      description,
      filesCreated: [],
      filesModified: [],
      errors: [],
      suggestions: [],
      timestamp: Date.now()
    };
    
    this.state.taskHistory.unshift(task);
    this.state.taskHistory = this.state.taskHistory.slice(0, this.maxTaskHistory);
    this.saveState();
  }

  addKeyPoint(point: string): void {
    if (!this.state.keyPoints.includes(point)) {
      this.state.keyPoints.push(point);
      this.saveState();
    }
  }

  addDecision(decision: string): void {
    this.state.decisions.push(decision);
    this.saveState();
  }

  addPendingTask(task: string): void {
    if (!this.state.pendingTasks.includes(task)) {
      this.state.pendingTasks.push(task);
      this.saveState();
    }
  }

  removePendingTask(task: string): void {
    this.state.pendingTasks = this.state.pendingTasks.filter(t => t !== task);
    this.saveState();
  }

  getMemoryContext(): string {
    const parts: string[] = [];
    
    // Project context
    parts.push(`# Project Context`);
    parts.push(`Type: ${this.state.projectType}`);
    parts.push(`Files: ${this.state.workspaceMemory.files.length} tracked`);
    
    if (this.state.workspaceMemory.lastUpdated) {
      parts.push(`Last updated: ${this.state.workspaceMemory.lastUpdated}`);
    }
    
    // Recent changes
    if (this.state.workspaceMemory.recentChanges.length > 0) {
      parts.push(`\n# Recent Changes (last ${Math.min(5, this.state.workspaceMemory.recentChanges.length)})`);
      this.state.workspaceMemory.recentChanges.slice(0, 5).forEach(change => {
        parts.push(`- ${change}`);
      });
    }
    
    // Key points
    if (this.state.keyPoints.length > 0) {
      parts.push(`\n# Key Points`);
      this.state.keyPoints.slice(-5).forEach(point => {
        parts.push(`- ${point}`);
      });
    }
    
    // Decisions
    if (this.state.decisions.length > 0) {
      parts.push(`\n# Decisions Made`);
      this.state.decisions.slice(-3).forEach(decision => {
        parts.push(`- ${decision}`);
      });
    }
    
    // Pending tasks
    if (this.state.pendingTasks.length > 0) {
      parts.push(`\n# Pending Tasks`);
      this.state.pendingTasks.forEach(task => {
        parts.push(`- ${task}`);
      });
    }
    
    // Recent task history
    if (this.state.taskHistory.length > 0) {
      parts.push(`\n# Recent Tasks`);
      this.state.taskHistory.slice(0, 3).forEach(task => {
        parts.push(`- ${task.description}`);
        if (task.filesCreated.length > 0) {
          parts.push(`  Created: ${task.filesCreated.join(', ')}`);
        }
        if (task.errors.length > 0) {
          parts.push(`  Errors: ${task.errors.length}`);
        }
      });
    }
    
    // Directory structure (abbreviated)
    if (this.state.workspaceMemory.structure) {
      parts.push(`\n# Project Structure`);
      parts.push(this.state.workspaceMemory.structure.substring(0, 500));
    }
    
    return parts.join('\n');
  }

  summarizeOldMessages(messages: any[]): any[] {
    if (messages.length <= 10) return messages;
    
    const systemMsg = messages[0];
    const recentMsgs = messages.slice(-6);
    const oldMsgs = messages.slice(1, -6);
    
    // Create summary of old messages
    const summary = {
      role: 'system',
      content: `# Previous Conversation Summary\n${oldMsgs.length} messages summarized:\n- User made ${oldMsgs.filter((m: any) => m.role === 'user').length} requests\n- AI provided ${oldMsgs.filter((m: any) => m.role === 'assistant').length} responses\n- ${oldMsgs.filter((m: any) => m.role === 'tool').length} tool executions\n\nContinue from recent context below.`
    };
    
    return [systemMsg, summary, ...recentMsgs];
  }

  clear(): void {
    this.state = {
      keyPoints: [],
      decisions: [],
      currentArchitecture: {},
      projectType: 'unknown',
      pendingTasks: [],
      workspaceMemory: {
        files: [],
        structure: '',
        fileSummaries: {},
        lastUpdated: '',
        recentChanges: []
      },
      taskHistory: []
    };
    this.saveState();
  }

  getState(): ConversationState {
    return this.state;
  }
}
