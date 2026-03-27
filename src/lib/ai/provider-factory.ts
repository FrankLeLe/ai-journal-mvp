// lib/ai/provider-factory.ts
// AI Provider 工厂 - 统一入口

import { AIProvider, ProviderConfig } from './types';
import { QwenProvider } from './qwen-provider';
import { ClaudeProvider } from './claude-provider';

/**
 * Provider 类型
 */
export type ProviderType = 'qwen' | 'claude' | 'deepseek' | 'moonshot';

/**
 * Provider 配置映射
 */
const providerConfigs: Record<ProviderType, ProviderConfig> = {
  qwen: {
    apiKey: process.env.NEXT_PUBLIC_QWEN_API_KEY || '',
    apiURL: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    model: 'qwen-turbo',
    timeout: 10000
  },
  claude: {
    apiKey: process.env.NEXT_PUBLIC_CLAUDE_API_KEY || '',
    apiURL: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-haiku-20240307',
    timeout: 10000
  },
  deepseek: {
    apiKey: process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || '',
    apiURL: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    timeout: 10000
  },
  moonshot: {
    apiKey: process.env.NEXT_PUBLIC_MOONSHOT_API_KEY || '',
    apiURL: 'https://api.moonshot.cn/v1/chat/completions',
    model: 'moonshot-v1-8k',
    timeout: 10000
  }
};

/**
 * 当前使用的 Provider
 * 通过环境变量 NEXT_PUBLIC_AI_PROVIDER 切换
 * 可选值：qwen | claude | deepseek | moonshot
 */
const currentProvider: ProviderType = 
  (process.env.NEXT_PUBLIC_AI_PROVIDER as ProviderType) || 'qwen';

/**
 * 获取 AI Provider 实例
 */
export function getAIProvider(): AIProvider {
  const config = providerConfigs[currentProvider];
  
  if (!config.apiKey) {
    console.warn(`AI Provider "${currentProvider}" API key not configured`);
  }

  switch (currentProvider) {
    case 'qwen':
      return new QwenProvider(config);
    case 'claude':
      return new ClaudeProvider(config);
    // case 'deepseek':
    //   return new DeepSeekProvider(config);
    // case 'moonshot':
    //   return new MoonshotProvider(config);
    default:
      return new QwenProvider(config);
  }
}

/**
 * 获取当前 Provider 名称
 */
export function getCurrentProvider(): ProviderType {
  return currentProvider;
}

/**
 * 获取所有可用 Provider
 */
export function getAvailableProviders(): ProviderType[] {
  return ['qwen', 'claude', 'deepseek', 'moonshot'];
}
