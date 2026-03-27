import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { user_id }: { user_id: string } = await request.json();
    
    // 模拟创建新日记（临时方案，后续集成 Supabase）
    const entryId = `entry-${Date.now()}`;
    
    // 生成每日 Prompts
    const prompts = [
      '今天最让你开心的一件事是什么？',
      '遇到了什么挑战？如何面对的？',
      '今天的你比昨天进步了什么？'
    ];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    
    return NextResponse.json({
      entry_id: entryId,
      prompt: randomPrompt,
      ai_message: '你好！我是你的 AI 日记助手。今天想聊什么？'
    });
  } catch (error) {
    console.error('Error starting journal:', error);
    return NextResponse.json(
      { error: 'Failed to start journal' },
      { status: 500 }
    );
  }
}
