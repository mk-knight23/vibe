import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface WorkspaceMemory {
  files: string[];
  structure: string;
  fileSummaries: Record<string, string>;
  lastUpdated: string;
  recentChanges: string[];
  dependencies: Record<string, string>;
  scripts: Record<string, string>;
  gitBranch: string;
  gitRemote: string;
}

interface TaskMemory {
  description: string;
  filesCreated: string[];
  filesModified: string[];
  errors: string[];
  suggestions: string[];
  timestamp: number;
  duration: number;
  success: boolean;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  tokens?: number;
}

interface StoryMemory {
  projectGoal: string;
  milestones: string[];
  challenges: string[];
  solutions: string[];
  learnings: string[];
  timeline: Array<{ date: string; event: string }>;
}

interface SessionState {
  sessionId: string;
  startTime: number;
  lastActivity: number;
  activeTasks: string[];
  currentContext: string;
  sessionGoals: string[];
  completedInSession: string[];
}

interface ConversationState {
  keyPoints: string[];
  decisions: string[];
  currentArchitecture: Record<string, any>;
  projectType: string;
  pendingTasks: string[];
  workspaceMemory: WorkspaceMemory;
  taskHistory: TaskMemory[];
  chatHistory: ChatMessage[];
  storyMemory: StoryMemory;
  userPreferences: Record<string, any>;
  codePatterns: string[];
  frequentCommands: Record<string, number>;
  sessionState: SessionState;
}

export class MemoryManager {
  private state: ConversationState;
  private memoryFile: string;
  private maxTaskHistory = 20;
  private maxChanges = 50;
  private maxChatHistory = 100;

  constructor(workspaceDir: string = process.cwd()) {
    this.memoryFile = path.join(workspaceDir, '.vibe', 'memory.json');
    this.state = this.loadState();
  }

  private loadState(): ConversationState {
    const defaultState: ConversationState = {
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
        recentChanges: [],
        dependencies: {},
        scripts: {},
        gitBranch: '',
        gitRemote: ''
      },
      taskHistory: [],
      chatHistory: [],
      storyMemory: {
        projectGoal: '',
        milestones: [],
        challenges: [],
        solutions: [],
        learnings: [],
        timeline: []
      },
      userPreferences: {},
      codePatterns: [],
      frequentCommands: {},
      sessionState: {
        sessionId: this.generateSessionId(),
        startTime: Date.now(),
        lastActivity: Date.now(),
        activeTasks: [],
        currentContext: '',
        sessionGoals: [],
        completedInSession: []
      }
    };

    try {
      if (fs.existsSync(this.memoryFile)) {
        const loaded = JSON.parse(fs.readFileSync(this.memoryFile, 'utf-8'));
        // Merge with defaults to handle missing fields
        return {
          ...defaultState,
          ...loaded,
          storyMemory: {
            ...defaultState.storyMemory,
            ...(loaded.storyMemory || {})
          },
          workspaceMemory: {
            ...defaultState.workspaceMemory,
            ...(loaded.workspaceMemory || {})
          }
        };
      }
    } catch (error) {}

    return defaultState;
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
      
      this.state.workspaceMemory.files = this.getFileList(cwd);
      this.state.workspaceMemory.structure = this.getDirectoryTree(cwd);
      
      // Detect project type and dependencies
      if (fs.existsSync(path.join(cwd, 'package.json'))) {
        const pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf-8'));
        this.state.workspaceMemory.dependencies = { ...pkg.dependencies, ...pkg.devDependencies };
        this.state.workspaceMemory.scripts = pkg.scripts || {};
        
        if (pkg.dependencies?.react) this.state.projectType = 'React';
        else if (pkg.dependencies?.next) this.state.projectType = 'Next.js';
        else if (pkg.dependencies?.vue) this.state.projectType = 'Vue';
        else if (pkg.dependencies?.express) this.state.projectType = 'Node.js/Express';
        else this.state.projectType = 'Node.js';
      } else if (fs.existsSync(path.join(cwd, 'requirements.txt'))) {
        this.state.projectType = 'Python';
      } else if (fs.existsSync(path.join(cwd, 'Cargo.toml'))) {
        this.state.projectType = 'Rust';
      } else if (fs.existsSync(path.join(cwd, 'go.mod'))) {
        this.state.projectType = 'Go';
      }
      
      // Git info
      try {
        this.state.workspaceMemory.gitBranch = execSync('git branch --show-current 2>/dev/null', { encoding: 'utf-8' }).trim();
        this.state.workspaceMemory.gitRemote = execSync('git remote get-url origin 2>/dev/null', { encoding: 'utf-8' }).trim();
      } catch {}
      
      this.saveState();
    } catch (error) {}
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
      timestamp: Date.now(),
      duration: 0,
      success: true
    };
    
    this.state.taskHistory.unshift(task);
    this.state.taskHistory = this.state.taskHistory.slice(0, this.maxTaskHistory);
    this.saveState();
  }

  completeTask(success: boolean, duration: number): void {
    if (this.state.taskHistory[0]) {
      this.state.taskHistory[0].success = success;
      this.state.taskHistory[0].duration = duration;
      this.saveState();
    }
  }

  addChatMessage(role: 'user' | 'assistant', content: string, tokens?: number): void {
    this.state.chatHistory.push({
      role,
      content: content.substring(0, 500),
      timestamp: Date.now(),
      tokens
    });
    this.state.chatHistory = this.state.chatHistory.slice(-this.maxChatHistory);
    this.saveState();
  }

  addMilestone(milestone: string): void {
    if (!this.state.storyMemory.milestones.includes(milestone)) {
      this.state.storyMemory.milestones.push(milestone);
      this.state.storyMemory.timeline.push({
        date: new Date().toISOString().split('T')[0],
        event: milestone
      });
      this.saveState();
    }
  }

  addChallenge(challenge: string, solution?: string): void {
    this.state.storyMemory.challenges.push(challenge);
    if (solution) this.state.storyMemory.solutions.push(solution);
    this.saveState();
  }

  addLearning(learning: string): void {
    if (!this.state.storyMemory.learnings.includes(learning)) {
      this.state.storyMemory.learnings.push(learning);
      this.saveState();
    }
  }

  setProjectGoal(goal: string): void {
    this.state.storyMemory.projectGoal = goal;
    this.saveState();
  }

  trackCommand(command: string): void {
    this.state.frequentCommands[command] = (this.state.frequentCommands[command] || 0) + 1;
    this.saveState();
  }

  addCodePattern(pattern: string): void {
    if (!this.state.codePatterns.includes(pattern)) {
      this.state.codePatterns.push(pattern);
      this.saveState();
    }
  }

  setPreference(key: string, value: any): void {
    this.state.userPreferences[key] = value;
    this.saveState();
  }

  searchChatHistory(query: string): ChatMessage[] {
    const lowerQuery = query.toLowerCase();
    const queryTerms = lowerQuery.split(/\s+/).filter(t => t.length > 2);
    
    const scored = this.state.chatHistory.map(msg => {
      const content = msg.content.toLowerCase();
      let score = 0;
      
      // Exact phrase match (high score)
      if (content.includes(lowerQuery)) score += 100;
      
      // Term frequency scoring (only if at least one term matches)
      let termMatches = 0;
      queryTerms.forEach(term => {
        const matches = (content.match(new RegExp(term, 'g')) || []).length;
        if (matches > 0) {
          termMatches++;
          score += matches * 2;
        }
      });
      
      // Require at least one term match
      if (termMatches === 0) score = 0;
      
      // Recency bonus (only for matches)
      if (score > 0) {
        const age = Date.now() - msg.timestamp;
        const recencyBonus = Math.max(0, 5 - (age / (1000 * 60 * 60 * 24)));
        score += recencyBonus;
      }
      
      return { msg, score };
    });
    
    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(s => s.msg);
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
    
    parts.push(`# Project Context`);
    parts.push(`Type: ${this.state.projectType}`);
    parts.push(`Files: ${this.state.workspaceMemory.files.length} tracked`);
    if (this.state.workspaceMemory.gitBranch) parts.push(`Branch: ${this.state.workspaceMemory.gitBranch}`);
    if (this.state.workspaceMemory.lastUpdated) parts.push(`Last updated: ${this.state.workspaceMemory.lastUpdated}`);
    
    if (this.state.storyMemory.projectGoal) {
      parts.push(`\n# Project Goal`);
      parts.push(this.state.storyMemory.projectGoal);
    }
    
    if (this.state.storyMemory.milestones.length > 0) {
      parts.push(`\n# Milestones Achieved`);
      this.state.storyMemory.milestones.slice(-5).forEach(m => parts.push(`✓ ${m}`));
    }
    
    if (this.state.workspaceMemory.recentChanges.length > 0) {
      parts.push(`\n# Recent Changes`);
      this.state.workspaceMemory.recentChanges.slice(0, 5).forEach(c => parts.push(`- ${c}`));
    }
    
    if (this.state.keyPoints.length > 0) {
      parts.push(`\n# Key Points`);
      this.state.keyPoints.slice(-5).forEach(p => parts.push(`- ${p}`));
    }
    
    if (this.state.decisions.length > 0) {
      parts.push(`\n# Decisions Made`);
      this.state.decisions.slice(-3).forEach(d => parts.push(`- ${d}`));
    }
    
    if (this.state.pendingTasks.length > 0) {
      parts.push(`\n# Pending Tasks`);
      this.state.pendingTasks.forEach(t => parts.push(`- ${t}`));
    }
    
    if (this.state.storyMemory.challenges.length > 0) {
      parts.push(`\n# Recent Challenges & Solutions`);
      this.state.storyMemory.challenges.slice(-3).forEach((c, i) => {
        parts.push(`Challenge: ${c}`);
        if (this.state.storyMemory.solutions[i]) parts.push(`Solution: ${this.state.storyMemory.solutions[i]}`);
      });
    }
    
    if (this.state.storyMemory.learnings.length > 0) {
      parts.push(`\n# Key Learnings`);
      this.state.storyMemory.learnings.slice(-5).forEach(l => parts.push(`- ${l}`));
    }
    
    if (this.state.taskHistory.length > 0) {
      parts.push(`\n# Recent Tasks`);
      this.state.taskHistory.slice(0, 3).forEach(t => {
        const status = t.success ? '✓' : '✗';
        parts.push(`${status} ${t.description} (${(t.duration / 1000).toFixed(1)}s)`);
        if (t.filesCreated.length > 0) parts.push(`  Created: ${t.filesCreated.join(', ')}`);
        if (t.errors.length > 0) parts.push(`  Errors: ${t.errors.length}`);
      });
    }
    
    if (Object.keys(this.state.workspaceMemory.dependencies).length > 0) {
      parts.push(`\n# Key Dependencies`);
      Object.entries(this.state.workspaceMemory.dependencies).slice(0, 10).forEach(([k, v]) => {
        parts.push(`- ${k}: ${v}`);
      });
    }
    
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
        recentChanges: [],
        dependencies: {},
        scripts: {},
        gitBranch: '',
        gitRemote: ''
      },
      taskHistory: [],
      chatHistory: [],
      storyMemory: {
        projectGoal: '',
        milestones: [],
        challenges: [],
        solutions: [],
        learnings: [],
        timeline: []
      },
      userPreferences: {},
      codePatterns: [],
      frequentCommands: {},
      sessionState: {
        sessionId: this.generateSessionId(),
        startTime: Date.now(),
        lastActivity: Date.now(),
        activeTasks: [],
        currentContext: '',
        sessionGoals: [],
        completedInSession: []
      }
    };
    this.saveState();
  }

  getState(): ConversationState {
    return this.state;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Session continuity methods
  startSession(): void {
    this.state.sessionState = {
      sessionId: this.generateSessionId(),
      startTime: Date.now(),
      lastActivity: Date.now(),
      activeTasks: [],
      currentContext: '',
      sessionGoals: [],
      completedInSession: []
    };
    this.saveState();
  }

  updateSessionActivity(): void {
    this.state.sessionState.lastActivity = Date.now();
    this.saveState();
  }

  addSessionGoal(goal: string): void {
    if (!this.state.sessionState.sessionGoals.includes(goal)) {
      this.state.sessionState.sessionGoals.push(goal);
      this.saveState();
    }
  }

  completeSessionTask(task: string): void {
    if (!this.state.sessionState.completedInSession.includes(task)) {
      this.state.sessionState.completedInSession.push(task);
      this.saveState();
    }
  }

  getSessionSummary(): string {
    const session = this.state.sessionState;
    const duration = (Date.now() - session.startTime) / 1000 / 60; // minutes

    const parts: string[] = [];
    parts.push(`# Session Summary (${duration.toFixed(1)} minutes)`);
    parts.push(`Session ID: ${session.sessionId}`);

    if (session.sessionGoals.length > 0) {
      parts.push(`\nGoals: ${session.sessionGoals.join(', ')}`);
    }

    if (session.completedInSession.length > 0) {
      parts.push(`Completed: ${session.completedInSession.length} tasks`);
      session.completedInSession.forEach(task => parts.push(`✓ ${task}`));
    }

    if (session.activeTasks.length > 0) {
      parts.push(`Active: ${session.activeTasks.join(', ')}`);
    }

    return parts.join('\n');
  }
}
