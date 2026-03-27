# AI Router Worker 安全配置指南

**更新时间**: 2026-03-27 13:20  
**版本**: v2.0（官方最佳实践）  

---

## 🛡️ **安全措施概览**

### **已实现的安全措施**

| 安全措施 | 实现方式 | 状态 |
|----------|---------|------|
| **认证和授权** | API Key + Bearer Token | ✅ |
| **CORS 限制** | 域名白名单 | ✅ |
| **速率限制** | 官方 Rate Limiting API | ✅ |
| **输入验证** | 大小 + 长度 + 白名单 | ✅ |
| **日志记录** | console.log + Workers Logs | ✅ |
| **错误处理** | 统一格式 + 不泄露敏感信息 | ✅ |

---

## 🔐 **1. 认证和授权**

### **配置方式**

**方式 1: wrangler secret（推荐）**
```bash
cd /root/.openclaw/workspace-meteor/projects/ai-journal-mvp/worker

# 配置 API Key
wrangler secret put API_KEY

# 配置 Bearer Token（可选）
wrangler secret put AUTH_TOKEN

# 配置 AI Provider API Keys
wrangler secret put QWEN_API_KEY
wrangler secret put CLAUDE_API_KEY
wrangler secret put OPENAI_API_KEY
wrangler secret put GEMINI_API_KEY
```

**方式 2: Dashboard 配置**
```
1. https://dash.cloudflare.com
2. Workers & Pages → ai-router-worker
3. Settings → Environment Variables
4. 添加变量
```

### **调用方式**

**API Key 认证**:
```javascript
fetch('https://ai-router-worker.zdjingji.workers.dev', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your-secret-api-key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ provider: 'qwen', prompt: '你好' })
});
```

**Bearer Token 认证**:
```javascript
fetch('https://ai-router-worker.zdjingji.workers.dev', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your-bearer-token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ provider: 'qwen', prompt: '你好' })
});
```

### **最佳实践**
```
✅ 使用强密码（至少 32 字符）
✅ 定期轮换 API Key
✅ 不同环境使用不同 Key
✅ 不在代码中硬编码 Key
✅ 使用 wrangler secret put 存储
```

---

## 🌐 **2. CORS 限制**

### **配置方式**

**Dashboard 配置**:
```
ALLOWED_ORIGINS = https://your-domain.com,https://another-domain.com

# 或者允许所有域名（仅开发环境）
ALLOWED_ORIGINS = *
```

**本地开发**（.dev.vars）:
```
ALLOWED_ORIGINS=*
```

### **允许的域名列表**
```
✅ 生产环境：https://your-domain.com
✅ 测试环境：https://test.your-domain.com
✅ 本地开发：http://localhost:3000
```

### **最佳实践**
```
✅ 明确指定允许的域名
✅ 不使用通配符 *（生产环境）
✅ 定期审查允许的域名列表
✅ 使用 HTTPS
```

---

## 🚦 **3. 速率限制（官方 API）**

### **配置方式**

**wrangler.toml 配置**:
```toml
[[ratelimits]]
name = "API_RATE_LIMITER"
namespace_id = "1001"

  [ratelimits.simple]
  limit = 100
  period = 60
```

**含义**:
```
每个客户端每分钟最多 100 次请求
客户端标识：API Key 或 IP 地址
```

### **创建 Rate Limit Namespace**

**自动创建**:
```
首次部署时 Cloudflare 会自动创建 namespace_id
```

**手动创建**（可选）:
```
1. https://dash.cloudflare.com
2. Workers & Pages → Your Worker
3. Settings → Rate Limiting
4. Create Namespace
```

### **错误响应**

**429 Too Many Requests**:
```json
{
  "error": "Rate limit exceeded",
  "retry_after": 60
}
```

**响应头**:
```
Retry-After: 60
```

### **最佳实践**
```
✅ 根据业务需求调整限制
✅ 监控速率限制触发情况
✅ 为 API Key 用户设置更高限制
✅ 记录速率限制事件
```

---

## 📥 **4. 输入验证**

### **默认限制**

| 参数 | 限制 | 可配置 |
|------|------|--------|
| 请求体大小 | 1MB | ❌ |
| prompt 长度 | 10000 字符 | ❌ |
| provider | 白名单 | ❌ |
| model | 无限制 | ✅ |

### **自定义限制**

**修改 Worker 代码**:
```javascript
// 修改请求体大小限制（默认 1MB）
if (contentLength && parseInt(contentLength) > 2 * 1024 * 1024) {
  return new Response(JSON.stringify({ error: 'Request body too large' }), { 
    status: 413
  });
}

// 修改 prompt 长度限制（默认 10000 字符）
if (prompt && prompt.length > 20000) {
  return new Response(JSON.stringify({ error: 'Prompt too long' }), { 
    status: 400
  });
}
```

---

## 📝 **5. 日志记录**

### **日志内容**

**成功请求**:
```javascript
console.log('请求成功', {
  provider,
  duration: Date.now() - startTime,
  status: response.status
});
```

**错误请求**:
```javascript
console.error('Worker 错误:', {
  error: error.message,
  stack: error.stack,
  duration: Date.now() - startTime
});
```

### **查看日志**

**Dashboard 查看**:
```
1. https://dash.cloudflare.com
2. Workers & Pages → ai-router-worker
3. Functions → Logs
4. 查看实时日志
```

**Wrangler CLI 查看**:
```bash
wrangler tail ai-router-worker
```

### **最佳实践**
```
✅ 定期审查日志
✅ 设置异常告警
✅ 不记录敏感信息（API Key 等）
✅ 保留足够的日志历史
```

---

## ⚠️ **6. 错误处理**

### **错误响应格式**

**401 未授权**:
```json
{
  "error": "Invalid API Key"
}
```

**429 速率限制**:
```json
{
  "error": "Rate limit exceeded",
  "retry_after": 60
}
```

**400 请求错误**:
```json
{
  "error": "Invalid provider",
  "valid_providers": ["qwen", "claude", "gpt", "gemini"]
}
```

**413 请求体过大**:
```json
{
  "error": "Request body too large"
}
```

**500 服务器错误**:
```json
{
  "error": "Internal server error",
  "message": "详细错误信息"
}
```

---

## 🎯 **完整部署流程**

### **Step 1: 配置 Secrets**
```bash
cd /root/.openclaw/workspace-meteor/projects/ai-journal-mvp/worker

# 认证
wrangler secret put API_KEY
wrangler secret put AUTH_TOKEN

# AI Provider
wrangler secret put QWEN_API_KEY
wrangler secret put CLAUDE_API_KEY
wrangler secret put OPENAI_API_KEY
wrangler secret put GEMINI_API_KEY
```

### **Step 2: 部署 Worker**
```bash
wrangler deploy --name ai-router-worker
```

### **Step 3: 配置环境变量**
```
Dashboard → ai-router-worker → Settings → Environment Variables

添加:
- ALLOWED_ORIGINS = https://your-domain.com
```

### **Step 4: 测试认证**
```bash
# 测试无认证（应该失败）
curl -X POST 'https://ai-router-worker.zdjingji.workers.dev' \
  -H "Content-Type: application/json" \
  -d '{"provider":"qwen","prompt":"你好"}'

# 测试有认证（应该成功）
curl -X POST 'https://ai-router-worker.zdjingji.workers.dev' \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-api-key" \
  -d '{"provider":"qwen","prompt":"你好"}'
```

---

## 📊 **安全配置检查清单**

**部署前检查**:
```
□ API_KEY 已配置（wrangler secret put）
□ 所有 AI Provider API Key 已配置
□ ALLOWED_ORIGINS 已配置
□ Rate Limiting 已配置（wrangler.toml）
□ 测试认证功能
□ 测试速率限制
□ 测试 CORS
```

**生产环境检查**:
```
□ 不允许通配符 *（ALLOWED_ORIGINS）
□ 使用强 API Key
□ 启用速率限制
□ 启用日志记录
□ 设置异常告警
```

---

## 🚨 **安全事件响应**

### **API Key 泄露**
```
1. 立即轮换 API Key
   wrangler secret put API_KEY
   wrangler deploy

2. 审查泄露前的日志
3. 通知受影响的用户
4. 更新所有调用方的 Key
```

### **速率限制触发频繁**
```
1. 检查是否有恶意攻击
2. 考虑降低速率限制
3. 考虑启用 IP 黑名单
4. 审查日志找出原因
```

### **异常错误增多**
```
1. 检查 Worker 日志（wrangler tail）
2. 检查 AI Provider 状态
3. 检查配置是否正确
4. 考虑回滚到稳定版本
```

---

## 🔄 **版本更新历史**

### **v2.0 (2026-03-27)**
```
✅ 使用官方 Rate Limiting API
✅ 添加 wrangler types 生成
✅ 添加 .dev.vars 本地开发配置
✅ 更新兼容性日期到 2026-03-27
✅ 添加 nodejs_compat 标志
```

### **v1.0 (之前版本)**
```
✅ 自定义 KV 速率限制
✅ 基本认证和 CORS
✅ 输入验证
✅ 错误处理
```

---

*更新时间：2026-03-27 13:20*  
*版本：v2.0（官方最佳实践）*
