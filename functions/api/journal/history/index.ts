export async function onRequest(context) {
  const { request } = context;
  
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
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
    
    return new Response(JSON.stringify({
      entries: history,
      total: history.length
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch history' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
