# AI Journal 部署配置

## Cloudflare Pages 部署

### 手动部署步骤

1. **访问 Cloudflare Dashboard**
   ```
   https://dash.cloudflare.com
   ```

2. **创建 Pages 项目**
   ```
   Workers & Pages → Create application → Pages
   Connect to Git → 选择 ai-journal-mvp 仓库
   ```

3. **配置构建**
   ```
   Framework preset: Next.js
   Build command: npm run build
   Output directory: .next
   Root directory: /
   ```

4. **环境变量**
   ```
   NEXT_PUBLIC_API_KEY = your_api_key_here
   NEXT_PUBLIC_DEFAULT_MODEL = anthropic/claude-opus-4.6
   ```

5. **保存并部署**
   ```
   Save and Deploy
   ```

### wrangler CLI 部署

```bash
# 安装 wrangler
npm install -g wrangler

# 登录
wrangler login

# 部署
wrangler pages deploy .next --project-name=ai-journal-mvp
```

## AI Router 配置

### 部署 ai-router-worker

```bash
cd ai-router-worker
npx wrangler deploy
```

### 设置 Secrets

```bash
wrangler secret put GMI_API_KEY
wrangler secret put JWT_SECRET
```

---

*创建时间：2026-03-26 18:15*
*更新时间：2026-03-28 - 迁移到 AI Router*
