// lib/ai/qwen-provider.ts
// 阿里云百炼（Qwen）Provider 实现

import { AIProvider, AIResponse, MoodAnalysis, ProviderConfig } from './types';

export class QwenProvider implements AIProvider {
  name = 'qwen';
  private config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  /**
   * 情绪分析
   */
  async analyzeMood(text: string): Promise<MoodAnalysis> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(this.config.apiURL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model || 'qwen-turbo',
          input: {
            messages: [
              {
                role: 'system',
                content: '你是一个情绪分析助手。分析用户文本的情绪，返回 JSON 格式：{"score": 1-10, "category": "positive|negative|neutral", "emotions": ["emotion1"]}'
              },
              {
                role: 'user',
                content: `分析以下文本的情绪：${text}`
              }
            ]
          },
          parameters: {
            result_format: 'text'
          }
        })
      });

      const data: any = await response.json();
      const content = data.output?.text || '{}';
      
      const mood = JSON.parse(content);
      
      return {
        score: Math.min(10, Math.max(1, mood.score || 5)),
        category: mood.category || 'neutral',
        emotions: mood.emotions || []
      };
    } catch (error) {
      console.error('Qwen mood analysis error:', error);
      return {
        score: 5,
        category: 'neutral',
        emotions: []
      };
    }
  }

  /**
   * 生成 AI 回复
   */
  async generateResponse(userMessage: string, mood?: MoodAnalysis): Promise<string> {
    try {
      const response = await fetch(this.config.apiURL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model || 'qwen-turbo',
          input: {
            messages: [
              {
                role: 'system',
                content: '你是一个温暖、支持的 AI 日记助手。用简短、温暖的话语回复用户，适当追问。回复控制在 50 字以内。'
              },
              {
                role: 'user',
                content: userMessage
              }
            ]
          },
          parameters: {
            result_format: 'text'
          }
        })
      });

      const data: any = await response.json();
      return data.output?.text || '感谢分享，我在这里倾听你的心声。';
    } catch (error) {
      console.error('Qwen response error:', error);
      return '感谢你的分享，我在这里倾听。';
    }
  }

  /**
   * 生成每日 Prompts
   */
  async generatePrompts(category: string = 'general'): Promise<string[]> {
    const prompts: Record<string, string[]> = {
      general: [
        '今天最让你开心的一件事是什么？',
        '遇到了什么挑战？如何面对的？',
        '今天的你比昨天进步了什么？'
      ],
      work: [
        '今天工作中最有成就感的一件事是什么？',
        '遇到了什么工作难题？如何解决的？',
        '从今天的工作中学到了什么？'
      ],
      emotion: [
        '今天最让你感动的一瞬间是什么？',
        '有什么想对亲近的人说但没说出口的话？',
        '今天的情绪波动是因为什么？'
      ]
    };

    return prompts[category] || prompts.general;
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.generatePrompts('general');
      return response.length > 0;
    } catch {
      return false;
    }
  }
}
