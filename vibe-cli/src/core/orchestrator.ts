import { PluginManager } from './plugin-manager';
import { SessionManager } from './session-manager';
import { CacheManager } from './cache-manager';
import { MetricsCollector } from './metrics-collector';
import { ErrorTracker } from './error-tracker';
import { ContextManager } from '../ai/context-manager';
import { ModelRouter } from '../ai/model-router';
import { WorkflowEngine } from '../workflow/workflow-engine';
import { TemplateManager } from '../workflow/template-manager';
import { TerminalRenderer } from '../ui/terminal-renderer';

export class Orchestrator {
  public pluginManager: PluginManager;
  public sessionManager: SessionManager;
  public cacheManager: CacheManager;
  public metricsCollector: MetricsCollector;
  public errorTracker: ErrorTracker;
  public contextManager: ContextManager;
  public modelRouter: ModelRouter;
  public workflowEngine: WorkflowEngine;
  public templateManager: TemplateManager;
  public ui: TerminalRenderer;

  constructor() {
    this.pluginManager = new PluginManager();
    this.sessionManager = new SessionManager();
    this.cacheManager = new CacheManager();
    this.metricsCollector = new MetricsCollector();
    this.errorTracker = new ErrorTracker();
    this.contextManager = new ContextManager();
    this.modelRouter = new ModelRouter();
    this.workflowEngine = new WorkflowEngine();
    this.templateManager = new TemplateManager();
    this.ui = new TerminalRenderer();
  }

  async initialize(): Promise<void> {
    // Initialize default session
    this.sessionManager.createSession();
    
    // Register default models
    this.registerDefaultModels();
    
    // Register default workflows
    this.registerDefaultWorkflows();
    
    // Register default templates
    this.registerDefaultTemplates();
  }

  private registerDefaultModels(): void {
    // OpenRouter models
    this.modelRouter.registerModel({
      id: 'z-ai/glm-4.5-air:free',
      provider: 'openrouter',
      capabilities: {
        maxTokens: 128000,
        strengths: ['chat', 'code', 'analysis'],
        costTier: 'free'
      }
    });

    this.modelRouter.registerModel({
      id: 'google/gemini-2.0-flash-exp:free',
      provider: 'openrouter',
      capabilities: {
        maxTokens: 1000000,
        strengths: ['chat', 'analysis', 'debug'],
        costTier: 'free'
      }
    });
  }

  private registerDefaultWorkflows(): void {
    // Add default workflows here
  }

  private registerDefaultTemplates(): void {
    // Add default templates here
  }

  async shutdown(): Promise<void> {
    this.cacheManager.clear();
    this.metricsCollector.clear();
  }
}

export const orchestrator = new Orchestrator();
