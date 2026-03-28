'use client';

import { useState } from 'react';
import { chat, MODELS } from '../lib/router';

type Category = 'general' | 'work' | 'emotion' | 'study' | 'creative';
type Language = 'zh' | 'en';

const TRANSLATIONS = {
  zh: {
    title: '🤖 AI Journal',
    subtitle: '像聊天一样写日记',
    placeholder: '今天想聊什么？',
    send: '发送',
    thinking: 'AI 思考中...',
    category: '日记类型',
    language: '语言',
    categories: {
      general: '📝 日常对话',
      work: '💼 工作学习',
      emotion: '💕 情感倾诉',
      study: '📚 学习成长',
      creative: '✍️ 创意写作',
    },
    prompts: {
      general: [
        '今天最让你开心的一件事是什么？',
        '遇到了什么挑战？如何面对的？',
        '今天的你比昨天进步了什么？',
      ],
      work: [
        '今天工作中最有成就感的一件事是什么？',
        '遇到了什么工作难题？如何解决的？',
        '从今天的工作中学到了什么？',
      ],
      emotion: [
        '今天最让你感动的一瞬间是什么？',
        '有什么想对亲近的人说但没说出口的话？',
        '今天的情绪波动是因为什么？',
      ],
      study: [
        '今天学到了什么新知识或技能？',
        '有什么不懂的问题想要探索？',
        '如何将今天学到的应用到实践中？',
      ],
      creative: [
        '今天有什么灵感或创意想法？',
        '想要创作什么内容？',
        '描述一个你想象中的场景或故事。',
      ],
    },
  },
  en: {
    title: '🤖 AI Journal',
    subtitle: 'Journal like chatting',
    placeholder: 'What would you like to talk about today?',
    send: 'Send',
    thinking: 'AI is thinking...',
    category: 'Category',
    language: 'Language',
    categories: {
      general: '📝 General',
      work: '💼 Work & Study',
      emotion: '💕 Emotions',
      study: '📚 Learning',
      creative: '✍️ Creative',
    },
    prompts: {
      general: [
        'What made you happiest today?',
        'What challenges did you face? How did you overcome them?',
        'How did you improve compared to yesterday?',
      ],
      work: [
        'What was your biggest achievement at work today?',
        'What work problem did you solve? How?',
        'What did you learn from work today?',
      ],
      emotion: [
        'What touched you most today?',
        'Anything you wanted to say to loved ones but didn\'t?',
        'What caused your emotional ups and downs today?',
      ],
      study: [
        'What new knowledge or skills did you learn today?',
        'Any questions you want to explore?',
        'How can you apply what you learned today?',
      ],
      creative: [
        'What inspirations or creative ideas did you have today?',
        'What do you want to create?',
        'Describe a scene or story from your imagination.',
      ],
    },
  },
};

export default function Home() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant' | 'system'; content: string }>>([
    { role: 'assistant', content: 'Hello! I\'m your AI journal assistant. What would you like to talk about today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState<Category>('general');
  const [language, setLanguage] = useState<Language>('en');

  const t = TRANSLATIONS[language];

  const getSystemPrompt = () => {
    const prompts = {
      zh: {
        general: '你是一个温暖、支持的 AI 日记助手。用简短、温暖的话语回复用户，适当追问。回复控制在 100 字以内。',
        work: '你是一个专业的职业发展顾问。帮助用户反思工作、规划职业。回复专业但亲切，控制在 150 字以内。',
        emotion: '你是一个富有同理心的倾听者。理解用户情感，给予温暖支持。回复温柔、理解，控制在 120 字以内。',
        study: '你是一个博学的学习导师。帮助用户整理知识、解答疑惑。回复清晰有条理，控制在 150 字以内。',
        creative: '你是一个富有创意的写作伙伴。激发用户灵感，提供创意建议。回复富有想象力，控制在 200 字以内。',
      },
      en: {
        general: 'You are a warm, supportive AI journal assistant. Reply in short, warm messages, ask follow-up questions. Keep responses under 100 words.',
        work: 'You are a professional career coach. Help users reflect on work and plan careers. Be professional but friendly, under 150 words.',
        emotion: 'You are an empathetic listener. Understand user emotions and provide warm support. Be gentle and understanding, under 120 words.',
        study: 'You are a knowledgeable learning mentor. Help users organize knowledge and answer questions. Be clear and organized, under 150 words.',
        creative: 'You are a creative writing partner. Inspire users and provide creative suggestions. Be imaginative, under 200 words.',
      },
    };
    return prompts[language][category];
  };

  const getModel = () => {
    // 优先使用分类对应的模型
    return MODELS.byCategory[category];
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user' as const, content: input };
    const newMessages = [
      { role: 'system' as const, content: getSystemPrompt() },
      ...messages,
      userMessage
    ];
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chat(
        newMessages,
        getModel(),
        500
      );
      const aiMessage = { role: 'assistant' as const, content: response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('AI 请求失败:', error);
      const errorMessage = { 
        role: 'assistant' as const, 
        content: language === 'zh' ? '抱歉，连接失败了。请刷新页面重试。' : 'Sorry, connection failed. Please refresh and try again.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    }
    
    setIsLoading(false);
  };

  const getCurrentPrompts = () => {
    return t.prompts[category];
  };

  return (
    <main className="min-h-screen p-4 max-w-2xl mx-auto">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
        <p className="text-gray-600">{t.subtitle}</p>
      </header>

      {/* 设置栏 */}
      <div className="flex gap-2 mb-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          <option value="general">{t.categories.general}</option>
          <option value="work">{t.categories.work}</option>
          <option value="emotion">{t.categories.emotion}</option>
          <option value="study">{t.categories.study}</option>
          <option value="creative">{t.categories.creative}</option>
        </select>
        
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          <option value="zh">🇨🇳 中文</option>
          <option value="en">🇺🇸 English</option>
        </select>
      </div>

      {/* 对话区域 */}
      <div className="bg-white rounded-lg shadow-lg p-4 mb-4 min-h-96">
        {messages.filter(m => m.role !== 'system').map((msg, i) => (
          <div key={i} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block px-4 py-2 rounded-lg ${
              msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-left mb-4">
            <div className="inline-block px-4 py-2 bg-gray-100 rounded-lg">
              <span className="animate-pulse">{t.thinking}</span>
            </div>
          </div>
        )}
      </div>

      {/* 输入区域 */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder={t.placeholder}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {t.send}
        </button>
      </div>

      {/* 今日 Prompts */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h2 className="font-bold mb-2">📝 {language === 'zh' ? '今日引导问题' : "Today's Prompts"}</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          {getCurrentPrompts().map((prompt, i) => (
            <li key={i}>• {prompt}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
