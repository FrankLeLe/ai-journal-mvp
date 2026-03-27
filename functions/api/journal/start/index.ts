// Pages Functions 调用 AI Router Worker
export default {
  async fetch(request, env) {
    // 只处理 POST 请求
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    try {
      const { user_id } = await request.json();
      const entryId = `entry-${Date.now()}`;
      
      // 调用 AI Router Worker
      console.log('调用 AI Router Worker...');
      
      const workerResponse = await fetch('https://ai-router-worker.zdjingji.workers.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 如果有 API Key，添加认证
          // 'X-API-Key': env.WORKER_API_KEY
        },
        body: JSON.stringify({
          provider: 'qwen',  // 可以切换：qwen, claude, gpt, gemini
          prompt: '开始新的日记会话，给我一个温暖的问候和引导问题'
        })
      });

      console.log('Worker 响应状态:', workerResponse.status, workerResponse.statusText);

      let aiMessage = '你好！我是你的 AI 日记助手。今天想聊什么？';

      if (workerResponse.ok) {
        const workerData = await workerResponse.json();
        console.log('Worker 返回数据:', JSON.stringify(workerData));
        
        if (workerData.success && workerData.output && workerData.output.text) {
          aiMessage = workerData.output.text;
          console.log('✅ AI API 调用成功');
        } else {
          console.log('⚠️ Worker 返回格式异常:', JSON.stringify(workerData));
        }
      } else {
        const errorText = await workerResponse.text();
        console.log('❌ Worker 调用失败:', errorText);
      }
      
      const prompts = [
        '今天最让你开心的一件事是什么？',
        '遇到了什么挑战？如何面对的？',
        '今天的你比昨天进步了什么？'
      ];
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      
      return new Response(JSON.stringify({
        entry_id: entryId,
        prompt: randomPrompt,
        ai_message: aiMessage
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('API 错误:', error);
      return new Response(JSON.stringify({ error: 'Failed to start journal' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}
