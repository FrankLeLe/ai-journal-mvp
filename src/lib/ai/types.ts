// lib/ai/types.ts
// AI Provider 统一接口定义

/**
 * 情绪分析结果
 */
export interface MoodAnalysis {
  score: number;        // 1-10
  category: 'positive' | 'negative' | 'neutral';
  emotions: string[];
}

/**
 * AI 回复
 */
export interface AIResponse {
  content: string;
  mood?: MoodAnalysis;
  metadata?: {
    model: string;
    tokens?: number;
    latency?: number;
  };
}

/**
 * AI Provider 接口
 */
export interface AIProvider {
  /**
   * Provider 名称
   */
  name: string;

  /**
   * 情绪分析
   */
  analyzeMood(text: string): Promise<MoodAnalysis>;

  /**
   * 生成 AI 回复
   */
  generateResponse(userMessage: string, mood?: MoodAnalysis): Promise<string>;

  /**
   * 生成每日 Prompts
   */
  generatePrompts(category?: string): Promise<string[]>;

  /**
   * 健康检查
   */
  healthCheck(): Promise<boolean>;
}

/**
 * Provider 配置
 */
export interface ProviderConfig {
  apiKey: string;
  apiURL?: string;
  model?: string;
  timeout?: number;
}
