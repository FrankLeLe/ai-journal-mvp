import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { entry_id, message, user_id } = await request.json();
    
    // 模拟 AI 回复（临时方案，后续集成 Qwen API）
    const aiResponses = [
      '感谢分享！能多说说你的感受吗？',
      '听起来不容易。具体发生了什么？',
      '理解你的感受。我在这里倾听你的心声。',
      '这是个很好的觉察！继续说说看？'
    ];
    const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
    
    // 模拟情绪分析
    const moodAnalysis = {
      score: Math.floor(Math.random() * 10) + 1,
      category: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)],
      emotions: ['happy', 'sad', 'calm'][Math.floor(Math.random() * 3)]
    };
    
    return NextResponse.json({
      ai_response: randomResponse,
      mood_analysis: moodAnalysis
    });
  } catch (error) {
    console.error('Error processing message:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
