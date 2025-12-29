// Vibe VS Code Extension - State Machine
import * as vscode from 'vscode';
import { ExtensionState, ExtensionStateData, StateTransition, ExecutionMode, AgentTask, MODE_DEFINITIONS } from './types';

export class StateMachine {
  private stateData: ExtensionStateData;
  private transitions: StateTransition[] = [];
  private listeners: Array<(state: ExtensionStateData) => void> = [];

  // Valid state transitions
  private validTransitions: Record<ExtensionState, ExtensionState[]> = {
    IDLE: ['READY'],
    READY: ['ANALYZING', 'STREAMING', 'PROPOSING_ACTIONS', 'RUNNING_TOOL'],
    ANALYZING: ['STREAMING', 'PROPOSING_ACTIONS', 'COMPLETED', 'ERROR'],
    STREAMING: ['COMPLETED', 'ERROR', 'CANCELLED'],
    PROPOSING_ACTIONS: ['AWAITING_APPROVAL', 'RUNNING_TOOL', 'COMPLETED', 'ERROR'],
    AWAITING_APPROVAL: ['RUNNING_TOOL', 'COMPLETED', 'CANCELLED', 'ERROR'],
    RUNNING_TOOL: ['VERIFYING', 'COMPLETED', 'ERROR', 'CANCELLED'],
    VERIFYING: ['COMPLETED', 'ERROR'],
    COMPLETED: ['READY'],
    ERROR: ['READY'],
    CANCELLED: ['READY']
  };

  constructor() {
    this.stateData = { state: 'IDLE', mode: 'ask' };
  }

  getState(): ExtensionStateData {
    return { ...this.stateData };
  }

  transition(newState: ExtensionState, action: string, metadata?: Record<string, any>): boolean {
    if (!this.canTransitionTo(newState)) {
      const errorMsg = `Invalid state transition: ${this.stateData.state} -> ${newState}`;
      console.error(errorMsg);
      this.stateData.lastError = errorMsg;
      return false;
    }

    const transition: StateTransition = {
      from: this.stateData.state,
      to: newState,
      action,
      timestamp: new Date(),
      metadata
    };

    this.transitions.push(transition);
    this.stateData.state = newState;
    this.stateData.lastError = undefined;
    this.notifyListeners();
    return true;
  }

  setMode(mode: ExecutionMode): void {
    if (!MODE_DEFINITIONS[mode]) {
      throw new Error(`Invalid execution mode: ${mode}`);
    }
    this.stateData.mode = mode;
    this.notifyListeners();
  }

  setCurrentTask(task?: AgentTask): void {
    this.stateData.currentTask = task;
    this.notifyListeners();
  }

  setProgress(progress?: number): void {
    if (progress !== undefined && (progress < 0 || progress > 100)) {
      throw new Error(`Progress must be between 0 and 100`);
    }
    this.stateData.progress = progress;
    this.notifyListeners();
  }

  setLastError(error?: string): void {
    this.stateData.lastError = error;
    this.notifyListeners();
  }

  subscribe(listener: (state: ExtensionStateData) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) this.listeners.splice(index, 1);
    };
  }

  private canTransitionTo(newState: ExtensionState): boolean {
    return this.validTransitions[this.stateData.state]?.includes(newState) ?? false;
  }

  private notifyListeners(): void {
    const currentState = this.getState();
    this.listeners.forEach(listener => {
      try { listener(currentState); } catch (e) { console.error('State listener error:', e); }
    });
  }

  getTransitionHistory(): StateTransition[] {
    return [...this.transitions];
  }

  reset(): void {
    this.stateData = { state: 'IDLE', mode: 'ask' };
    this.transitions = [];
    this.notifyListeners();
  }
}
