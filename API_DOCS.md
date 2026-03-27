# AI Journal API 文档

**版本**: v1.0  
**创建时间**: 2026-03-26  

---

## 📋 **API 概览**

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/journal/start` | POST | 开始新日记 |
| `/api/journal/message` | POST | 发送消息 |
| `/api/journal/history` | GET | 获取历史记录 |

---

## 🔹 **POST /api/journal/start**

**描述**: 开始新的日记会话

**请求**:
```json
{
  "user_id": "test-001"
}
```

**响应**:
```json
{
  "entry_id": "entry-1774522215968",
  "prompt": "今天的你比昨天进步了什么？",
  "ai_message": "你好！我是你的 AI 日记助手。今天想聊什么？"
}
```

---

## 🔹 **POST /api/journal/message**

**描述**: 发送消息给 AI 助手

**请求**:
```json
{
  "entry_id": "entry-123",
  "message": "今天心情不错",
  "user_id": "test-001"
}
```

**响应**:
```json
{
  "ai_response": "感谢分享！能多说说你的感受吗？",
  "mood_analysis": {
    "score": 8,
    "category": "positive",
    "emotions": ["happy"]
  }
}
```

---

## 🔹 **GET /api/journal/history**

**描述**: 获取用户日记历史

**请求**:
```
GET /api/journal/history?user_id=test-001
```

**响应**:
```json
{
  "entries": [
    {
      "id": "entry-1",
      "content": "今天工作有点累，但完成了重要项目...",
      "mood_score": 7,
      "mood_category": "neutral",
      "created_at": "2026-03-26T10:00:00Z"
    }
  ],
  "total": 1
}
```

---

*创建时间：2026-03-26 20:10*
