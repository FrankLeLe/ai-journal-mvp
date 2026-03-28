# AI Provider 配置说明

## 环境变量

在 `.env.local` 中配置：

```bash
# 当前使用的 AI Provider（已废弃，使用 AI Router）
# NEXT_PUBLIC_AI_PROVIDER=qwen

# AI Router API Key
NEXT_PUBLIC_API_KEY=your_api_key_here

# 默认模型
NEXT_PUBLIC_DEFAULT_MODEL=anthropic/claude-opus-4.6

# API Base URL（可选）
# NEXT_PUBLIC_API_BASE=https://your-worker.your-account.workers.dev
```

## 切换到 AI Router

现在项目使用 `ai-router-worker` 统一路由，无需配置多个 Provider。

### 旧配置（已废弃）

不再需要配置多个 API Key，统一使用 AI Router。

## 添加新 Provider

在 `ai-router-worker` 中添加，无需修改前端代码。

## 成本对比

| Provider | 价格/1K tokens | 月成本（MVP） | 推荐场景 |
|----------|---------------|--------------|----------|
| Claude Opus 4.6 | $0.005 / $0.025 | $50 | 最强推理 ✅ |
| GPT-4o-mini | $0.00015 / $0.0006 | $10 | 性价比 ✅ |
| DeepSeek-V3.2 | $0.0002 / $0.00032 | $5 | 极致性价比 |
