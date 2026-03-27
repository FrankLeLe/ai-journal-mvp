// lib/ai/index.ts
// AI 模块统一导出

export { getAIProvider, getCurrentProvider, getAvailableProviders } from './provider-factory';
export type { ProviderType } from './provider-factory';

export type { AIProvider, AIResponse, MoodAnalysis, ProviderConfig } from './types';

export { QwenProvider } from './qwen-provider';
export { ClaudeProvider } from './claude-provider';
