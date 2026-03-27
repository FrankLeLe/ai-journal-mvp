/**
 * AI Router Worker - 支持多个 AI Provider
 * 使用官方 Rate Limiting API + Secrets 管理
 */

// 生成类型定义：npx wrangler types
// 然后取消下面的注释
// import type { Env } from './worker-configuration';

export default {
  async fetch(request, env, ctx) {
    const startTime = Date.now();
    
    // 1. 只允许 POST 请求
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. CORS 检查
    const corsHeaders = handleCORS(request, env);
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // 3. 认证检查
    const authResult = authenticate(request, env);
    if (!authResult.valid) {
      return new Response(JSON.stringify({ error: authResult.error }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 4. 速率限制检查（官方 Rate Limiting API）
    const rateLimitResult = await checkRateLimit(request, env);
    if (!rateLimitResult.allowed) {
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded',
        retry_after: rateLimitResult.retryAfter 
      }), { 
        status: 429,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Retry-After': rateLimitResult.retryAfter.toString()
        }
      });
    }

    try {
      // 5. 请求体大小限制（最大 1MB）
      const contentLength = request.headers.get('Content-Length');
      if (contentLength && parseInt(contentLength) > 1024 * 1024) {
        return new Response(JSON.stringify({ error: 'Request body too large' }), { 
          status: 413,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // 6. 解析并验证请求体
      const { provider, prompt, messages, model } = await request.json();
      
      // 验证 provider
      const validProviders = ['qwen', 'claude', 'gpt', 'gemini'];
      if (!provider || !validProviders.includes(provider)) {
        return new Response(JSON.stringify({ 
          error: 'Invalid provider',
          valid_providers: validProviders
        }), { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // 验证输入内容
      if (prompt && prompt.length > 10000) {
        return new Response(JSON.stringify({ error: 'Prompt too long (max 10000 characters)' }), { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // 7. 根据 provider 路由到不同 AI API
      let response;
      switch (provider) {
        case 'qwen':
          response = await callQwenAPI(prompt, messages, model, env);
          break;
        case 'claude':
          response = await callClaudeAPI(prompt, messages, model, env);
          break;
        case 'gpt':
          response = await callGPTAPI(prompt, messages, model, env);
          break;
        case 'gemini':
          response = await callGeminiAPI(prompt, messages, model, env);
          break;
        default:
          response = new Response(JSON.stringify({ error: 'Unsupported provider' }), { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
      }

      // 8. 记录成功日志
      console.log('请求成功', {
        provider,
        duration: Date.now() - startTime,
        status: response.status
      });

      // 添加 CORS 头到响应
      const responseData = await response.json();
      return new Response(JSON.stringify(responseData), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      // 9. 记录错误日志
      console.error('Worker 错误:', {
        error: error.message,
        stack: error.stack,
        duration: Date.now() - startTime
      });

      return new Response(JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
}

// CORS 处理
function handleCORS(request, env) {
  const allowedOrigins = env.ALLOWED_ORIGINS?.split(',') || ['*'];
  const origin = request.headers.get('Origin') || '';
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigins.includes('*') || allowedOrigins.includes(origin) ? origin || '*' : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
    'Access-Control-Max-Age': '86400',
  };
  
  return corsHeaders;
}

// 认证处理
function authenticate(request, env) {
  // 方式 1: API Key 认证
  const apiKey = request.headers.get('X-API-Key');
  const validApiKey = env.API_KEY;
  
  if (validApiKey && apiKey !== validApiKey) {
    return { valid: false, error: 'Invalid API Key' };
  }
  
  // 方式 2: Bearer Token 认证（可选）
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const validToken = env.AUTH_TOKEN;
    
    if (validToken && token !== validToken) {
      return { valid: false, error: 'Invalid token' };
    }
  }
  
  return { valid: true };
}

// 速率限制（官方 Rate Limiting API）
async function checkRateLimit(request, env) {
  // 检查是否配置了官方 Rate Limiting API
  if (!env.API_RATE_LIMITER) {
    console.log('未配置 Rate Limiting API，跳过限流');
    return { allowed: true };
  }
  
  // 获取客户端标识（API Key 或 IP）
  const clientId = request.headers.get('X-API-Key') || 
                   request.headers.get('CF-Connecting-IP') || 
                   'anonymous';
  
  try {
    // 使用官方 Rate Limiting API
    const { success } = await env.API_RATE_LIMITER.limit({ 
      key: clientId 
    });
    
    if (!success) {
      return { 
        allowed: false, 
        retryAfter: 60 // 60 秒后重试
      };
    }
    
    return { allowed: true };
  } catch (error) {
    console.error('速率限制检查失败:', error);
    // 失败时允许请求（fail-open）
    return { allowed: true };
  }
}

// Qwen API (阿里云百炼)
async function callQwenAPI(prompt, messages, model, env) {
  const apiKey = env.QWEN_API_KEY;
  if (!apiKey || !apiKey.startsWith('sk-')) {
    return new Response(JSON.stringify({ error: 'Qwen API Key not configured' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const defaultMessages = [
    { role: 'system', content: '你是一个温暖、支持的 AI 日记助手。用简短、温暖的话语回复用户，字数 50-100 字。' },
    { role: 'user', content: prompt || '开始新的日记会话' }
  ];

  const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model || 'qwen-turbo',
      input: {
        messages: messages || defaultMessages
      }
    })
  });

  const qwenData = await response.json();
  return new Response(JSON.stringify({
    success: response.ok,
    provider: 'qwen',
    output: qwenData.output,
    usage: qwenData.usage
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

// Claude API (Anthropic)
async function callClaudeAPI(prompt, messages, model, env) {
  const apiKey = env.CLAUDE_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Claude API Key not configured' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const defaultMessages = [
    { role: 'user', content: prompt || '开始新的日记会话' }
  ];

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2024-01-01',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model || 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: messages || defaultMessages
    })
  });

  const claudeData = await response.json();
  return new Response(JSON.stringify({
    success: response.ok,
    provider: 'claude',
    output: { text: claudeData.content?.[0]?.text },
    usage: claudeData.usage
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

// GPT API (OpenAI)
async function callGPTAPI(prompt, messages, model, env) {
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'OpenAI API Key not configured' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const defaultMessages = [
    { role: 'system', content: '你是一个温暖、支持的 AI 日记助手。用简短、温暖的话语回复用户，字数 50-100 字。' },
    { role: 'user', content: prompt || '开始新的日记会话' }
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model || 'gpt-3.5-turbo',
      messages: messages || defaultMessages,
      max_tokens: 500
    })
  });

  const gptData = await response.json();
  return new Response(JSON.stringify({
    success: response.ok,
    provider: 'gpt',
    output: { text: gptData.choices?.[0]?.message?.content },
    usage: gptData.usage
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

// Gemini API (Google)
async function callGeminiAPI(prompt, messages, model, env) {
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Gemini API Key not configured' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const defaultMessages = [
    { role: 'user', parts: [{ text: prompt || '开始新的日记会话' }] }
  ];

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-pro'}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: messages || defaultMessages
    })
  });

  const geminiData = await response.json();
  return new Response(JSON.stringify({
    success: response.ok,
    provider: 'gemini',
    output: { text: geminiData.candidates?.[0]?.content?.parts?.[0]?.text },
    usage: geminiData.usageMetadata
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
