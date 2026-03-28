# AI Journal MVP 部署最佳实践

## 环境变量管理

### 必需的环境变量

| 变量名 | 说明 | 获取方式 |
|--------|------|---------|
| `NEXT_PUBLIC_API_KEY` | AI Router API 密钥 | 从 ai-router-worker 配置 |
| `NEXT_PUBLIC_DEFAULT_MODEL` | 默认 AI 模型 | 推荐：`anthropic/claude-opus-4.6` |

### 安全实践

1. **不要提交 `.env.local` 文件**
2. **使用 `.env.example` 作为模板**
3. **敏感信息使用 GitHub Secrets**
4. **定期轮换 API 密钥**

---

## Cloudflare 配置

### Workers Secrets

通过 `wrangler secret` 命令设置：

```bash
wrangler secret put GMI_API_KEY
wrangler secret put JWT_SECRET
```

### Pages 环境变量

在 Cloudflare Dashboard → Pages → Settings → Environment Variables 配置

---

## 部署检查清单

- [ ] 本地测试通过
- [ ] 环境变量已配置
- [ ] Secrets 已设置
- [ ] 构建成功
- [ ] 部署成功
- [ ] 健康检查通过

---

## 故障排查

### 常见问题

1. **API 密钥错误**
   - 检查环境变量是否正确
   - 验证 API 密钥是否有效

2. **构建失败**
   - 检查 Node.js 版本
   - 清理 node_modules 重新安装

3. **部署失败**
   - 检查 Cloudflare API Token
   - 验证账户 ID

---

## 相关文档

- [部署指南](DEPLOY.md)
- [GitHub Actions 指南](GITHUB_ACTIONS_GUIDE.md)
- [API 文档](API_DOCS.md)
