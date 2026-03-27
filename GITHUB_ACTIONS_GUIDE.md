# AI Journal MVP - GitHub Actions 部署指南

**更新时间**: 2026-03-27 14:30  

---

## 📋 **GitHub Secrets 配置**

### **必需 Secrets**

| Secret 名称 | 值 | 说明 |
|------------|-----|------|
| `CLOUDFLARE_API_TOKEN` | `cfat_xxx` | Cloudflare API 令牌 |
| `CLOUDFLARE_ACCOUNT_ID` | `xxx` | Cloudflare 账户 ID |
| `QWEN_API_KEY` | `sk-xxx` | 阿里云百炼 API Key |

### **可选 Secrets**

| Secret 名称 | 值 | 说明 |
|------------|-----|------|
| `API_KEY` | `your-api-key` | Worker 认证 API Key |
| `AUTH_TOKEN` | `bearer-token` | Bearer Token 认证 |
| `ALLOWED_ORIGINS` | `https://your-domain.com` | CORS 允许的域名 |
| `CLAUDE_API_KEY` | `sk-ant-xxx` | Claude API Key |
| `OPENAI_API_KEY` | `sk-xxx` | OpenAI API Key |
| `GEMINI_API_KEY` | `xxx` | Google Gemini API Key |

---

## 🔧 **配置步骤**

### **Step 1: 获取 Cloudflare 信息**

**获取 Account ID**:
```
1. 访问 https://dash.cloudflare.com
2. 右侧边栏显示 Account ID
3. 复制保存
```

**获取 API Token**:
```
1. 访问 https://dash.cloudflare.com/profile/api-tokens
2. Create Token → Use template
3. 选择 "Edit Cloudflare Workers"
4. Continue to summary
5. 复制 Token
```

### **Step 2: 配置 GitHub Secrets**

```
1. 访问 GitHub 仓库
2. Settings → Secrets and variables → Actions
3. New repository secret

添加以下 Secrets:
- CLOUDFLARE_API_TOKEN: cfat_xxx
- CLOUDFLARE_ACCOUNT_ID: xxx
- QWEN_API_KEY: sk-xxx
```

### **Step 3: 推送代码**

```bash
git init
git add .
git commit -m "Initial commit with GitHub Actions"
git remote add origin https://github.com/your-username/ai-journal-mvp.git
git push -u origin main
```

### **Step 4: 自动部署**

```
推送后 GitHub Actions 会自动触发：
1. Deploy Worker Workflow
2. Deploy Pages Workflow

查看进度：
Actions 标签页 → 查看工作流运行状态
```

---

## 📊 **工作流说明**

### **Deploy Worker Workflow**

**触发条件**:
```
✅ push 到 main 分支
✅ pull_request 到 main 分支
```

**执行步骤**:
```
1. Checkout 代码
2. 设置 Node.js 环境
3. 安装 Wrangler CLI
4. 生成 TypeScript 类型
5. 部署 Worker 到 Cloudflare
```

### **Deploy Pages Workflow**

**触发条件**:
```
✅ push 到 main 分支
✅ pull_request 到 main 分支
```

**执行步骤**:
```
1. Checkout 代码
2. 设置 Node.js 环境
3. 安装依赖
4. 构建 Next.js 项目
5. 部署到 Cloudflare Pages
```

---

## 🔐 **安全最佳实践**

### **Secrets 管理**

**✅ 推荐做法**:
```
✅ 使用 GitHub Secrets 存储敏感信息
✅ 不在代码中硬编码 API Key
✅ 定期轮换 Secrets
✅ 使用最小权限原则
```

**❌ 避免做法**:
```
❌ 在代码中提交 API Key
❌ 在日志中打印 Secrets
❌ 分享 Secrets 给他人
❌ 使用过期的 Tokens
```

### **.gitignore 配置**

```gitignore
# 本地开发环境变量
.dev.vars
.env
.env.local

# 构建产物
.next/
dist/
build/

# 依赖
node_modules/

# 类型定义（自动生成）
worker-configuration.d.ts

# 日志
*.log

# Wrangler
.wrangler/
```

---

## 🧪 **测试部署**

### **测试 Worker 部署**

```bash
# 推送后测试
curl -X POST 'https://ai-router-worker.zdjingji.workers.dev' \
  -H "Content-Type: application/json" \
  -d '{"provider":"qwen","prompt":"你好"}'
```

**预期响应**:
```json
{
  "success": true,
  "provider": "qwen",
  "output": {
    "text": "AI 回复内容"
  }
}
```

### **测试 Pages 部署**

```
访问：https://ai-journal-mvp.pages.dev

测试功能:
1. 开始日记
2. 查看 AI 回复
3. 检查功能正常
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

## 📊 **部署监控**

### **查看部署状态**

**GitHub Actions**:
```
1. 访问 GitHub 仓库
2. Actions 标签页
3. 查看工作流运行状态
4. 点击查看详情日志
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

## 🔄 **持续集成**

### **自动测试（可选）**

```yaml
# .github/workflows/test.yml
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

### **代码质量检查（可选）**

```yaml
# .github/workflows/lint.yml
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

## 📋 **部署清单**

**首次部署前检查**:
```
□ GitHub 仓库已创建
□ GitHub Secrets 已配置
□ CLOUDFLARE_API_TOKEN 已设置
□ CLOUDFLARE_ACCOUNT_ID 已设置
□ QWEN_API_KEY 已设置
□ .github/workflows/ 目录已创建
□ deploy-worker.yml 已创建
□ deploy-pages.yml 已创建
□ .gitignore 已配置
```

**推送前检查**:
```
□ 代码已提交
□ 无敏感信息泄露
□ .gitignore 正确
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

## 🎯 **下一步**

**自动化部署完成后**:
```
1. 配置自定义域名（可选）
2. 启用 Cloudflare 分析
3. 设置监控告警
4. 配置速率限制
5. 添加更多 AI Provider
```

**优化建议**:
```
1. 添加自动测试
2. 添加代码质量检查
3. 配置预览部署
4. 设置自动回滚
```

---

*更新时间：2026-03-27 14:30*
