// Vibe VS Code Extension - Type Definitions
import * as vscode from 'vscode';

// State Machine Types
export type ExtensionState = 'IDLE' | 'READY' | 'ANALYZING' | 'STREAMING' | 'PROPOSING_ACTIONS' | 'AWAITING_APPROVAL' | 'RUNNING_TOOL' | 'VERIFYING' | 'COMPLETED' | 'ERROR' | 'CANCELLED';
export type ExecutionMode = 'ask' | 'code' | 'debug' | 'architect' | 'agent' | 'shell';

export interface ExtensionStateData {
  state: ExtensionState;
  mode: ExecutionMode;
  currentTask?: AgentTask;
  lastError?: string;
  progress?: number;
  metadata?: Record<string, any>;
}

export interface StateTransition {
  from: ExtensionState;
  to: ExtensionState;
  action: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ModeCapabilities {
  allowedTools: string[];
  allowedSideEffects: string[];
  uiFeatures: string[];
  description: string;
  icon: string;
}

// Tool System Types
export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object';
  required: boolean;
  description: string;
  defaultValue?: any;
}

export type ToolSuccessResult<T = any> = {
  success: true;
  data: T;
  duration: number;
  rollbackData?: any;
};

export type ToolErrorResult = {
  success: false;
  error: string;
  duration: number;
  rollbackData?: any;
};

export type ToolResult<T = any> = ToolSuccessResult<T> | ToolErrorResult;

export interface ToolDefinition {
  id: string;
  name: string;
  category: 'file' | 'workspace' | 'git' | 'shell' | 'analysis' | 'memory' | 'code' | 'testing';
  description: string;
  parameters: ToolParameter[];
  returns: string;
  cancellable: boolean;
  rollbackable: boolean;
  requiresApproval?: boolean;
}

export interface ToolExecutionContext {
  signal?: AbortSignal;
  onProgress?: (progress: number, message: string) => void;
  workspaceFolder: vscode.WorkspaceFolder;
}

export type ToolExecutor = (params: any, context: ToolExecutionContext) => Promise<ToolResult>;

// Agent System Types
export interface AgentStep {
  id: string;
  description: string;
  tool: string;
  parameters: any;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
  verification?: string;
  requiresApproval?: boolean;
  approved?: boolean;
}

export interface AgentTask {
  id: string;
  description: string;
  steps: AgentStep[];
  status: 'planning' | 'executing' | 'verifying' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  startTime: Date;
  endTime?: Date;
}

// Settings Types
export interface VibeSettings {
  openrouterApiKey: string;
  megallmApiKey: string;
  agentrouterApiKey: string;
  routewayApiKey: string;
  provider: 'openrouter' | 'megallm' | 'agentrouter' | 'routeway';
  defaultModel: string;
  executionMode: ExecutionMode;
  autoApproveUnsafeOps: boolean;
  maxContextFiles: number;
  streamingEnabled: boolean;
  enableMemorySystem: boolean;
  enableDiffPreview: boolean;
  enableProviderFallback: boolean;
}

export interface SettingsValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// Provider Types
export interface ProviderConfig {
  name: string;
  baseUrl: string;
  apiKeyEnvVar: string;
  models: string[];
  defaultModel: string;
  maxTokens: number;
  supportsStreaming: boolean;
  supportsTools: boolean;
  rateLimit: { requests: number; window: number };
}

export interface ProviderRequest {
  model: string;
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  tools?: any[];
}

export interface ProviderResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  toolCalls?: any[];
  finishReason?: string;
}

export interface TokenBudget {
  maxInput: number;
  maxOutput: number;
  reservedForTools: number;
}

export interface ProviderHealth {
  available: boolean;
  latency: number;
  lastCheck: Date;
  errorCount: number;
  successRate: number;
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp: Date;
  metadata?: {
    model?: string;
    tokens?: number;
    toolCalls?: ToolCall[];
  };
}

export interface ToolCall {
  id: string;
  name: string;
  parameters: any;
  result?: any;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  mode: ExecutionMode;
  createdAt: Date;
  updatedAt: Date;
}

// Type Guards
export function isToolResult(obj: any): obj is ToolResult {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.success === 'boolean' &&
    typeof obj.duration === 'number'
  );
}

export function isSuccessfulToolResult<T = any>(result: ToolResult<T>): result is ToolSuccessResult<T> {
  return result.success === true;
}

// Mode Definitions
export const MODE_DEFINITIONS: Record<ExecutionMode, ModeCapabilities> = {
  ask: {
    allowedTools: ['search', 'analyze'],
    allowedSideEffects: [],
    uiFeatures: ['chat', 'readonly', 'search'],
    description: 'Read-only Q&A and analysis',
    icon: '$(comment-discussion)'
  },
  code: {
    allowedTools: ['file_ops', 'search', 'analyze', 'git', 'shell', 'format'],
    allowedSideEffects: ['file_write', 'file_create', 'file_delete', 'terminal'],
    uiFeatures: ['chat', 'diff_preview', 'file_tree', 'editor'],
    description: 'Full coding with file operations',
    icon: '$(code)'
  },
  debug: {
    allowedTools: ['analyze', 'search', 'run_tests', 'shell'],
    allowedSideEffects: ['terminal'],
    uiFeatures: ['chat', 'breakpoints', 'console', 'tests'],
    description: 'Error analysis and debugging',
    icon: '$(debug)'
  },
  architect: {
    allowedTools: ['analyze', 'search', 'generate'],
    allowedSideEffects: [],
    uiFeatures: ['chat', 'diagrams', 'planning', 'readonly'],
    description: 'System design and planning',
    icon: '$(circuit-board)'
  },
  agent: {
    allowedTools: ['all'],
    allowedSideEffects: ['all'],
    uiFeatures: ['chat', 'progress', 'approval', 'multi_step'],
    description: 'Autonomous multi-step execution',
    icon: '$(robot)'
  },
  shell: {
    allowedTools: ['shell', 'file_ops'],
    allowedSideEffects: ['terminal', 'file_ops'],
    uiFeatures: ['terminal', 'file_tree', 'commands'],
    description: 'Terminal and file operations only',
    icon: '$(terminal)'
  }
};
