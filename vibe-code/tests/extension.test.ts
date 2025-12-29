// Vibe VS Code Extension - Unit Tests
import { describe, it, expect, beforeEach } from 'vitest';
import { StateMachine } from '../src/state-machine';
import { MODE_DEFINITIONS, isToolResult, isSuccessfulToolResult } from '../src/types';

describe('StateMachine', () => {
  let stateMachine: StateMachine;

  beforeEach(() => {
    stateMachine = new StateMachine();
  });

  it('should initialize with IDLE state and ask mode', () => {
    const state = stateMachine.getState();
    expect(state.state).toBe('IDLE');
    expect(state.mode).toBe('ask');
  });

  it('should transition from IDLE to READY', () => {
    const result = stateMachine.transition('READY', 'test');
    expect(result).toBe(true);
    expect(stateMachine.getState().state).toBe('READY');
  });

  it('should reject invalid transitions', () => {
    // Cannot go from IDLE directly to COMPLETED
    const result = stateMachine.transition('COMPLETED', 'test');
    expect(result).toBe(false);
    expect(stateMachine.getState().state).toBe('IDLE');
  });

  it('should change mode', () => {
    stateMachine.setMode('code');
    expect(stateMachine.getState().mode).toBe('code');
  });

  it('should reject invalid mode', () => {
    expect(() => stateMachine.setMode('invalid' as any)).toThrow();
  });

  it('should track progress', () => {
    stateMachine.setProgress(50);
    expect(stateMachine.getState().progress).toBe(50);
  });

  it('should reject invalid progress', () => {
    expect(() => stateMachine.setProgress(150)).toThrow();
  });

  it('should notify listeners on state change', () => {
    let notified = false;
    stateMachine.subscribe(() => { notified = true; });
    stateMachine.transition('READY', 'test');
    expect(notified).toBe(true);
  });

  it('should allow unsubscribe', () => {
    let count = 0;
    const unsubscribe = stateMachine.subscribe(() => { count++; });
    stateMachine.transition('READY', 'test');
    expect(count).toBe(1);
    
    unsubscribe();
    stateMachine.setMode('code');
    expect(count).toBe(1); // Should not increment
  });

  it('should reset to initial state', () => {
    stateMachine.transition('READY', 'test');
    stateMachine.setMode('code');
    stateMachine.reset();
    
    const state = stateMachine.getState();
    expect(state.state).toBe('IDLE');
    expect(state.mode).toBe('ask');
  });
});

describe('MODE_DEFINITIONS', () => {
  it('should have all required modes', () => {
    const modes = ['ask', 'code', 'debug', 'architect', 'agent', 'shell'];
    modes.forEach(mode => {
      expect(MODE_DEFINITIONS[mode as keyof typeof MODE_DEFINITIONS]).toBeDefined();
    });
  });

  it('should have required properties for each mode', () => {
    Object.values(MODE_DEFINITIONS).forEach(mode => {
      expect(mode.allowedTools).toBeDefined();
      expect(mode.allowedSideEffects).toBeDefined();
      expect(mode.uiFeatures).toBeDefined();
      expect(mode.description).toBeDefined();
      expect(mode.icon).toBeDefined();
    });
  });

  it('ask mode should be read-only', () => {
    expect(MODE_DEFINITIONS.ask.allowedSideEffects).toHaveLength(0);
  });

  it('agent mode should allow all tools', () => {
    expect(MODE_DEFINITIONS.agent.allowedTools).toContain('all');
    expect(MODE_DEFINITIONS.agent.allowedSideEffects).toContain('all');
  });
});

describe('Type Guards', () => {
  it('isToolResult should validate tool results', () => {
    expect(isToolResult({ success: true, duration: 100, data: 'test' })).toBe(true);
    expect(isToolResult({ success: false, duration: 50, error: 'fail' })).toBe(true);
    expect(isToolResult({ success: true })).toBe(false); // missing duration
    expect(isToolResult(null)).toBe(false);
    expect(isToolResult('string')).toBe(false);
  });

  it('isSuccessfulToolResult should identify success', () => {
    expect(isSuccessfulToolResult({ success: true, duration: 100, data: 'test' })).toBe(true);
    expect(isSuccessfulToolResult({ success: false, duration: 50, error: 'fail' })).toBe(false);
  });
});
