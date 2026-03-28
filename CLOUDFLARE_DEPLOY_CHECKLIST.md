# Cloudflare Pages 部署检查清单

**部署时间**: 2026-03-28  
**版本**: V1.0.0

---

## ✅ **部署前准备**

### **1. 构建配置**
```
✅ Framework: Next.js 14
✅ Build command: npm run build
✅ Output directory: .next
✅ Node version: 18.x
```

### **2. 环境变量**
```
✅ NEXT_PUBLIC_API_KEY = your_api_key_here
✅ NEXT_PUBLIC_DEFAULT_MODEL = anthropic/claude-opus-4.6
```

### **3. wrangler 配置**
```
✅ wrangler.toml 已创建
✅ 项目名：ai-journal-mvp
✅ 兼容性日期：2024-01-01
```

---

## 🚀 **部署步骤**

### **方案 A: 手动部署（推荐 MVP）**

**Step 1: 访问 Dashboard**
```
https://dash.cloudflare.com
```

**Step 2: 创建 Pages 项目**
```
Workers & Pages → Create application → Pages
Connect to Git → 选择 ai-journal-mvp 仓库
```

**Step 3: 配置构建**
```
Framework preset: Next.js
Build command: npm run build
Output directory: .next
Root directory: /
```

**Step 4: 环境变量**
```
添加以下环境变量：
- NEXT_PUBLIC_API_KEY = your_api_key_here
- NEXT_PUBLIC_DEFAULT_MODEL = anthropic/claude-opus-4.6
```

**Step 5: 保存并部署**
```
Save and Deploy
等待构建完成（约 2-3 分钟）
```

### **方案 B: wrangler CLI 部署**

```bash
# 安装 wrangler
npm install -g wrangler

# 登录
wrangler login

# 部署
wrangler pages deploy .next --project-name=ai-journal-mvp
```

---

## ✅ **部署验证**

### **检查清单**
```
✅ 构建成功
✅ 部署成功
✅ HTTPS 正常
✅ 自定义域名（可选）
✅ 环境变量生效
```

### **测试清单**
```
✅ 首页加载测试
✅ API 路由测试
✅ 移动端适配测试
✅ 性能测试（<2 秒）
```

---

## 🔗 相关资源

- **在线演示**: https://1720f70e.ai-journal-mvp.pages.dev
- **后端服务**: 配置环境变量 `NEXT_PUBLIC_API_BASE`
- **GitHub 仓库**: https://github.com/FrankLeLe/ai-journal-mvp

---

*部署时间：2026-03-28*
*版本：V1.0.0*
