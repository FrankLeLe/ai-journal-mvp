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
   NEXT_PUBLIC_AI_PROVIDER = qwen
   NEXT_PUBLIC_QWEN_API_KEY = sk-xxx（使用现有）
   NEXT_PUBLIC_SUPABASE_URL = https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = xxx
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

## Supabase 配置

### Step 1: 创建项目
```
1. 访问 https://supabase.com
2. 登录（GitHub/Email）
3. New Project
4. 项目名：ai-journal-mvp
5. 区域：us-east-1 或 eu-central-1
6. 创建
```

### Step 2: 配置数据库
```
1. SQL Editor → New Query
2. 粘贴 DATABASE_SCHEMA.md 中的 SQL
3. 运行
```

### Step 3: 获取配置
```
1. Settings → API
2. 复制 Project URL
3. 复制 anon public key
4. 添加到环境变量
```

---

*创建时间：2026-03-26 18:15*
