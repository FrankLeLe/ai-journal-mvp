# AI Journal MVP - 部署最佳实践

**更新时间**: 2026-03-27 14:45  

---

## 🎯 **部署流程最佳实践**

### **标准部署流程**

```
┌─────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  本地开发   │ -> │  Git 推送代码    │ -> │ GitHub Actions  │
│  测试完成   │    │  git push        │    │ 自动触发        │
└─────────────┘    └──────────────────┘    └─────────────────┘
                                                      ↓
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  部署完成       │ <- │  Cloudflare      │ <- │ 部署到云平台    │
│  验证功能       │    │  自动部署        │    │ Cloudflare      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### **流程说明**

**1. 本地开发和测试**
```bash
# 本地开发
npm run dev

# 本地测试
curl -X POST 'http://localhost:3000/api/journal/start' \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test-001"}'

# 确保功能正常后再推送
```

**2. Git 推送代码**
```bash
git add .
git commit -m "feat: 添加新功能"
git push origin main
```

**3. GitHub Actions 自动触发**
```
✅ 自动检测 push 事件
✅ 自动运行工作流
✅ 自动部署到 Cloudflare
```

**4. Cloudflare 自动部署**
```
✅ Worker 自动部署
✅ Pages 自动部署
✅ 自动验证部署
```

**5. 部署验证**
```bash
# 测试 Worker
curl -X POST 'https://ai-router-worker.zdjingji.workers.dev' \
  -H "Content-Type: application/json" \
  -d '{"provider":"qwen","prompt":"你好"}'

# 测试 Pages
访问：https://ai-journal-mvp.pages.dev
```

---

## 📋 **GitHub 仓库信息**

**仓库地址**:
```
https://github.com/zdjingji/ai-journal-mvp
```

**推送命令**:
```bash
cd /root/.openclaw/workspace-meteor/projects/ai-journal-mvp

# 添加远程仓库
git remote add origin https://github.com/zdjingji/ai-journal-mvp.git

# 推送到 GitHub
git push -u origin main
```

---

## 🔧 **GitHub Secrets 配置**

**访问**: `https://github.com/zdjingji/ai-journal-mvp/settings/secrets/actions`

**必需 Secrets**:

| Secret 名称 | 值 | 说明 |
|------------|-----|------|
| `CLOUDFLARE_API_TOKEN` | `cfat_wHHHkBbqtlJSqZ5XpWrCBSOitOZkYSKzKq5ByXtM217438fe` | Cloudflare API 令牌 |
| `CLOUDFLARE_ACCOUNT_ID` | `c1dffa5530fd843da6b513fed73ff46c` | Cloudflare 账户 ID |
| `QWEN_API_KEY` | `你的阿里云百炼 API Key` | AI Provider API Key |

**可选 Secrets**:

| Secret 名称 | 值 | 说明 |
|------------|-----|------|
| `API_KEY` | `your-api-key` | Worker 认证 API Key |
| `AUTH_TOKEN` | `bearer-token` | Bearer Token 认证 |
| `ALLOWED_ORIGINS` | `https://your-domain.com` | CORS 允许的域名 |
| `CLAUDE_API_KEY` | `sk-ant-xxx` | Claude API Key |
| `OPENAI_API_KEY` | `sk-xxx` | OpenAI API Key |
| `GEMINI_API_KEY` | `xxx` | Google Gemini API Key |

---

## 📊 **工作流说明**

### **Deploy Worker Workflow**

**文件**: `.github/workflows/deploy-worker.yml`

**触发条件**:
```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

**执行步骤**:
```yaml
1. Checkout 代码
2. 设置 Node.js 环境
3. 安装 Wrangler CLI
4. 生成 TypeScript 类型
5. 部署 Worker 到 Cloudflare
```

### **Deploy Pages Workflow**

**文件**: `.github/workflows/deploy-pages.yml`

**触发条件**:
```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

**执行步骤**:
```yaml
1. Checkout 代码
2. 设置 Node.js 环境
3. 安装依赖
4. 构建 Next.js 项目
5. 部署到 Cloudflare Pages
```

---

## 🧪 **部署后验证**

### **测试清单**

**Worker 测试**:
```bash
# 测试 Qwen API
curl -X POST 'https://ai-router-worker.zdjingji.workers.dev' \
  -H "Content-Type: application/json" \
  -d '{"provider":"qwen","prompt":"你好"}'

# 预期响应
{
  "success": true,
  "provider": "qwen",
  "output": {
    "text": "AI 回复内容"
  }
}
```

**Pages 测试**:
```
访问：https://ai-journal-mvp.pages.dev

测试功能:
□ 页面加载正常
□ 开始日记功能正常
□ AI 回复显示正常
□ 无控制台错误
```

**GitHub Actions 验证**:
```
访问：https://github.com/zdjingji/ai-journal-mvp/actions

验证:
□ 工作流自动触发
□ 所有步骤执行成功
□ 部署状态为 Success
□ 无错误日志
```

---

## 🚨 **故障排查**

### **Worker 部署失败**

**错误**: `Error: Missing CLOUDFLARE_API_TOKEN`
```
解决：检查 GitHub Secrets 是否正确配置
```

**错误**: `Error: Invalid API Token`
```
解决：检查 Token 是否有效，重新生成
```

**错误**: `Error: Account ID not found`
```
解决：检查 CLOUDFLARE_ACCOUNT_ID 是否正确
```

### **Pages 部署失败**

**错误**: `Build failed`
```
解决：检查构建日志，修复代码错误
```

**错误**: `Deploy failed`
```
解决：检查 Cloudflare 配置和权限
```

---

## 📋 **部署清单**

**首次部署前检查**:
```
□ GitHub 仓库已创建
□ GitHub Secrets 已配置（3 个必需）
□ .github/workflows/ 目录已创建
□ deploy-worker.yml 已创建
□ deploy-pages.yml 已创建
□ .gitignore 已配置
□ 本地测试通过
```

**推送前检查**:
```
□ 代码已提交
□ 无敏感信息泄露（检查 .gitignore）
□ 本地构建通过（npm run build）
□ 本地测试通过
```

**推送后验证**:
```
□ GitHub Actions 触发
□ Worker 部署成功
□ Pages 部署成功
□ 功能测试通过
□ 日志无错误
```

---

## 🔄 **持续改进**

### **添加自动测试（可选）**

创建 `.github/workflows/test.yml`:
```yaml
name: Test

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install Dependencies
        run: npm install
      
      - name: Run Tests
        run: npm test
```

### **添加代码质量检查（可选）**

创建 `.github/workflows/lint.yml`:
```yaml
name: Lint

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install Dependencies
        run: npm install
      
      - name: Run Lint
        run: npm run lint
```

---

## 📊 **部署监控**

### **查看部署状态**

**GitHub Actions**:
```
1. 访问 https://github.com/zdjingji/ai-journal-mvp/actions
2. 查看工作流运行状态
3. 点击查看详情日志
```

**Cloudflare Dashboard**:
```
1. https://dash.cloudflare.com
2. Workers & Pages → ai-router-worker
3. Deployments 标签页
4. 查看部署历史
```

### **设置通知**

**GitHub 通知**:
```
Repository Settings → Notifications
✅ Watch repository
✅ Enable email notifications
```

**Cloudflare 通知**:
```
Dashboard → Account Home → Alerting
✅ 创建告警策略
✅ 配置邮件通知
```

---

## 🎯 **总结**

**部署流程最佳实践**:
```
✅ 本地开发和测试完成
✅ Git 推送代码
✅ GitHub Actions 自动触发
✅ 自动部署到 Cloudflare
✅ 部署后验证
```

**关键要点**:
```
✅ 使用 GitHub Secrets 管理敏感信息
✅ 不在代码中硬编码 API Key
✅ 使用 .gitignore 排除敏感文件
✅ 配置自动部署工作流
✅ 设置部署监控和通知
```

---

*更新时间：2026-03-27 14:45*  
*GitHub 用户：zdjingji*  
*仓库：https://github.com/zdjingji/ai-journal-mvp*
