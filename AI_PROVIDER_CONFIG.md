# AI Provider 配置说明

## 环境变量

在 `.env.local` 中配置：

```bash
# 当前使用的 AI Provider
# 可选值：qwen | claude | deepseek | moonshot
NEXT_PUBLIC_AI_PROVIDER=qwen

# 阿里云百炼（Qwen）
NEXT_PUBLIC_QWEN_API_KEY=sk-xxx

# Anthropic Claude
NEXT_PUBLIC_CLAUDE_API_KEY=sk-xxx

# DeepSeek
NEXT_PUBLIC_DEEPSEEK_API_KEY=sk-xxx

# Moonshot (Kimi)
NEXT_PUBLIC_MOONSHOT_API_KEY=sk-xxx
```

## 切换 Provider

### 方法 1: 修改环境变量

```bash
# 使用 Qwen
NEXT_PUBLIC_AI_PROVIDER=qwen

# 使用 Claude
NEXT_PUBLIC_AI_PROVIDER=claude

# 使用 DeepSeek
NEXT_PUBLIC_AI_PROVIDER=deepseek
```

### 方法 2: 运行时切换（开发环境）

```typescript
import { getAIProvider, getCurrentProvider } from '@/lib/ai';

const provider = getAIProvider();
console.log('Current provider:', getCurrentProvider());
```

## 添加新 Provider

1. 创建 `src/lib/ai/xxx-provider.ts`
2. 实现 `AIProvider` 接口
3. 在 `provider-factory.ts` 中添加配置
4. 在 `provider-factory.ts` 的 `getAIProvider()` 中添加 case

## 成本对比

| Provider | 价格/1K tokens | 月成本（MVP） | 推荐场景 |
|----------|---------------|--------------|----------|
| Qwen | ¥0.008 | ¥200 | 中文对话 ✅ |
| DeepSeek | ¥0.001 | ¥50 | 成本敏感 |
| Claude | $0.015 | $50 | 英文对话 |
| Moonshot | ¥0.012 | ¥300 | 长上下文 |
