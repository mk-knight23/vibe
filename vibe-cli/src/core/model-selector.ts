interface TaskProfile {
  type: 'codegen' | 'refactor' | 'debug' | 'analysis' | 'chat' | 'complex';
  provider: string;
  model: string;
  reasoning: string;
}

export function selectBestModel(input: string, currentProvider: string): TaskProfile {
  const lower = input.toLowerCase();
  
  // Code generation - needs strong reasoning
  if (/create|build|generate|scaffold|make|write.*code/i.test(input)) {
    return {
      type: 'codegen',
      provider: 'megallm',
      model: 'qwen/qwen3-next-80b-a3b-instruct',
      reasoning: 'Code generation requires strong reasoning and context'
    };
  }
  
  // Refactoring - needs precision
  if (/refactor|optimize|improve|clean|restructure/i.test(input)) {
    return {
      type: 'refactor',
      provider: 'openrouter',
      model: 'anthropic/claude-3.5-sonnet',
      reasoning: 'Refactoring requires precise code understanding'
    };
  }
  
  // Debugging - needs analysis
  if (/debug|fix|error|bug|issue|problem|broken/i.test(input)) {
    return {
      type: 'debug',
      provider: 'openrouter',
      model: 'openai/gpt-4o-mini',
      reasoning: 'Debugging requires fast iteration and analysis'
    };
  }
  
  // Analysis - needs comprehension
  if (/analyze|explain|understand|review|audit/i.test(input)) {
    return {
      type: 'analysis',
      provider: 'megallm',
      model: 'qwen/qwen3-next-80b-a3b-instruct',
      reasoning: 'Analysis requires deep code comprehension'
    };
  }
  
  // Complex multi-step
  if (input.length > 200 || /and.*and|then.*then|first.*then.*finally/i.test(input)) {
    return {
      type: 'complex',
      provider: 'megallm',
      model: 'qwen/qwen3-next-80b-a3b-instruct',
      reasoning: 'Complex tasks need strong reasoning'
    };
  }
  
  // Default: chat
  return {
    type: 'chat',
    provider: currentProvider,
    model: 'qwen/qwen3-next-80b-a3b-instruct',
    reasoning: 'General conversation'
  };
}

export function shouldSwitchModel(profile: TaskProfile, currentModel: string): boolean {
  return profile.model !== currentModel;
}
