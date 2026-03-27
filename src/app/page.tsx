'use client';

import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '你好！我是你的 AI 日记助手。今天想聊什么？' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // 模拟 AI 回复（实际应调用 API）
    setTimeout(() => {
      const aiMessage = { 
        role: 'assistant' as const, 
        content: '感谢分享！能多说说你的感受吗？' 
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <main className="min-h-screen p-4 max-w-2xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">🤖 AI Journal</h1>
        <p className="text-gray-600">像聊天一样写日记</p>
      </header>

      {/* 对话区域 */}
      <div className="bg-white rounded-lg shadow-lg p-4 mb-4 min-h-96">
        {messages.map((msg, i) => (
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
              <span className="animate-pulse">AI 思考中...</span>
            </div>
          </div>
        )}
      </div>

      {/* 输入区域 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="今天想聊什么？"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          发送
        </button>
      </div>

      {/* 今日 Prompts */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4">
        <h2 className="font-bold mb-2">📝 今日引导问题</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• 今天最让你开心的一件事是什么？</li>
          <li>• 遇到了什么挑战？如何面对的？</li>
          <li>• 今天的你比昨天进步了什么？</li>
        </ul>
      </div>
    </main>
  );
}
