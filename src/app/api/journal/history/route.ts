import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    
    // 模拟历史记录（临时方案，后续集成 Supabase）
    const history = [
      {
        id: 'entry-1',
        content: '今天工作有点累，但完成了重要项目...',
        mood_score: 7,
        mood_category: 'neutral',
        created_at: new Date().toISOString()
      },
      {
        id: 'entry-2',
        content: '周末和家人一起出去玩了，很开心...',
        mood_score: 9,
        mood_category: 'positive',
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ];
    
    return NextResponse.json({
      entries: history,
      total: history.length
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}
