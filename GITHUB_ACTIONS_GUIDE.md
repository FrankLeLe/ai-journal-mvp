# GitHub Actions 部署指南

## 必需的 GitHub Secrets

| Secret 名称 | 说明 | 获取方式 |
|------------|------|---------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API 令牌 | Cloudflare Dashboard → API Tokens |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 账户 ID | Cloudflare Dashboard 右侧显示 |

## 配置步骤

### 1. 创建 Cloudflare API Token

1. 访问：https://dash.cloudflare.com/profile/api-tokens
2. 点击 **"Create Token"**
3. 选择模板：**"Edit Cloudflare Workers"**
4. 限定账户范围
5. 复制 Token

### 2. 添加 GitHub Secrets

1. 访问：https://github.com/FrankLeLe/ai-journal-mvp/settings/secrets/actions
2. 点击 **"New repository secret"**
3. 添加以下 Secrets：

```
Name: CLOUDFLARE_ACCOUNT_ID
Value: 你的账户 ID

Name: CLOUDFLARE_API_TOKEN
Value: 你创建的 Token
```

### 3. 验证配置

推送代码后，GitHub Actions 会自动触发部署。

---

## 工作流程

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

---

## 故障排查

### 认证失败
- 检查 API Token 是否有效
- 验证账户 ID 是否正确

### 部署失败
- 检查构建日志
- 验证 package.json 配置

---

## 相关文档

- [部署指南](DEPLOY.md)
- [最佳实践](DEPLOYMENT_BEST_PRACTICES.md)
