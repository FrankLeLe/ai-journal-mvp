'use client';

import { useState } from 'react';
import { checkHealth, getModels, chat } from '../../lib/router';

export default function TestRouter() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: string; content: string}[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const testHealth = async () => {
    setIsLoading(true);
    try {
      addLog('开始健康检查...');
      const result = await checkHealth();
      addLog(`✅ 健康检查成功：${JSON.stringify(result)}`);
    } catch (error: any) {
      addLog(`❌ 健康检查失败：${error.message}`);
    }
    setIsLoading(false);
  };

  const testModels = async () => {
    setIsLoading(true);
    try {
      addLog('开始获取模型列表...');
      const models = await getModels();
      addLog(`✅ 获取到 ${models.length} 个模型:`);
      models.forEach(m => addLog(`  - ${m}`));
    } catch (error: any) {
      addLog(`❌ 获取模型失败：${error.message}`);
    }
    setIsLoading(false);
  };

  const testChat = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    
    try {
      addLog(`发送消息：${userMsg}`);
      const response = await chat(
        [...messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })), { role: 'user', content: userMsg }],
        'openai/gpt-4o-mini',
        100
      );
      addLog(`✅ AI 回复：${response}`);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error: any) {
      addLog(`❌ 聊天失败：${error.message}`);
    }
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🧪 AI Router 测试</h1>
      <p className="text-gray-600 mb-6">测试 ai-router-worker 后端连接</p>

      {/* 测试按钮 */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={testHealth}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          🏥 健康检查
        </button>
        <button
          onClick={testModels}
          disabled={isLoading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          📋 获取模型列表
        </button>
      </div>

      {/* 聊天测试 */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-xl font-bold mb-4">💬 聊天测试</h2>
        
        {/* 消息列表 */}
        <div className="bg-gray-50 rounded p-4 min-h-32 mb-4">
          {messages.length === 0 ? (
            <p className="text-gray-400">暂无消息，发送一条测试消息吧</p>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block px-3 py-1 rounded ${
                  msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}>
                  {msg.role === 'user' ? '👤' : '🤖'} {msg.content}
                </span>
              </div>
            ))
          )}
        </div>

        {/* 输入框 */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && testChat()}
            placeholder="输入测试消息..."
            className="flex-1 border rounded px-3 py-2"
            disabled={isLoading}
          />
          <button
            onClick={testChat}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            发送
          </button>
        </div>
      </div>

      {/* 日志 */}
      <div className="bg-black text-green-400 rounded p-4 font-mono text-sm">
        <h2 className="text-white font-bold mb-2">📝 日志</h2>
        <div className="h-64 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500">暂无日志</p>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="mb-1">{log}</div>
            ))
          )}
        </div>
      </div>

      {/* 返回主页 */}
      <div className="mt-6">
        <a href="/" className="text-blue-500 hover:underline">← 返回主页</a>
      </div>
    </main>
  );
}
