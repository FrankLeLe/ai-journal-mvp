// lib/ai.ts
// 使用阿里云百炼 API（Qwen）

const QWEN_API_KEY = process.env.QWEN_API_KEY || 'sk-xxx';
const QWEN_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';

/**
 * 情绪分析
 */
export async function analyzeMood(text: string) {
  const response = await fetch(QWEN_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${QWEN_API_KEY}`
    },
    body: JSON.stringify({
      model: 'qwen-turbo',
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
      }
    })
  });

  const data: any = await response.json();
  const content = data.output?.text || '{}';
  
  try {
    return JSON.parse(content);
  } catch {
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
export async function generateResponse(userMessage: string, mood?: any) {
  const response = await fetch(QWEN_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${QWEN_API_KEY}`
    },
    body: JSON.stringify({
      model: 'qwen-turbo',
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
      }
    })
  });

  const data: any = await response.json();
  return data.output?.text || '感谢分享，我在这里倾听你的心声。';
}

/**
 * 生成每日 Prompts
 */
export async function generatePrompt(category: string = 'general') {
  const prompts = {
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

  return prompts[category as keyof typeof prompts] || prompts.general;
}
