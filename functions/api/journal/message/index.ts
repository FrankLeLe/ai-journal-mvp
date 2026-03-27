export async function onRequest(context) {
  const { request } = context;
  
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { entry_id, message } = await request.json();
    
    const aiResponses = [
      '感谢分享！能多说说你的感受吗？',
      '听起来不容易。具体发生了什么？',
      '理解你的感受。我在这里倾听你的心声。',
      '这是个很好的觉察！继续说说看？'
    ];
    const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
    
    const moodAnalysis = {
      score: Math.floor(Math.random() * 10) + 1,
      category: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)],
      emotions: ['happy', 'sad', 'calm'][Math.floor(Math.random() * 3)]
    };
    
    return new Response(JSON.stringify({
      ai_response: randomResponse,
      mood_analysis: moodAnalysis
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to process message' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
