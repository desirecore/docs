---
title: 支持的 AI 供应商列表
description: DesireCore 支持的所有 AI 模型供应商及其模型详情
keywords: [供应商, Provider, AI 模型, API, OpenAI, Claude, DeepSeek]
---

# 支持的 AI 供应商列表

DesireCore 支持 **23 家** AI 供应商，涵盖对话、推理、视觉、嵌入、语音、图像生成、视频生成等多种服务类型。

## 国际供应商

### OpenAI

| 信息 | 详情 |
|------|------|
| **接入地址** | `https://api.openai.com/v1` |
| **API 格式** | OpenAI Completions |
| **计价货币** | USD |
| **API Key 获取** | [platform.openai.com](https://platform.openai.com/api-keys) |

| 模型 | 类型 | 上下文 | 最大输出 | 输入价格 | 输出价格 | 特色 |
|------|------|--------|---------|---------|---------|------|
| GPT-5.2 | 对话 | 400K | 128K | $1.75 | $14 | 最新旗舰，编码和智能体优化 |
| GPT-5.2 Pro | 对话 | 400K | 128K | $21 | $168 | 专业版最高性能 |
| GPT-5.1 | 对话 | 400K | 128K | $1.25 | $10 | 高性能旗舰 |
| GPT-5 | 对话 | 400K | 128K | $1.25 | $10 | 统一能力旗舰 |
| GPT-5-mini | 对话 | 128K | 32K | $0.25 | $2 | 高性价比日常对话 |
| GPT-5-nano | 快速 | 128K | 16K | $0.02 | $0.08 | 极速响应 |
| GPT-4.1 | 对话 | 1M | 32K | $2 | $8 | 百万上下文 |
| GPT-4.1 mini | 对话 | 1M | 32K | $0.40 | $1.60 | 百万上下文性价比 |
| GPT-4.1 nano | 快速 | 1M | 32K | $0.10 | $0.40 | 极致性价比 |
| o3 | 推理 | 200K | 100K | $2 | $8 | 深度推理 |
| o3-pro | 推理 | 200K | 100K | $20 | $80 | 高级推理 |
| o3-mini | 推理 | 128K | 100K | $1.10 | $4.40 | 高效推理 |
| o4-mini | 推理 | 200K | 100K | $1.10 | $4.40 | 推理 + 视觉 |
| GPT-4o | 视觉 | 128K | 16K | $2.50 | $10 | 多模态 |
| GPT-4o mini | 视觉 | 128K | 16K | $0.15 | $0.60 | 多模态性价比 |
| DALL-E 3 | 图像生成 | - | - | - | - | 文生图 |
| TTS-1 / TTS-1-HD | 语音合成 | - | - | - | - | 标准/高清语音合成 |
| Whisper | 语音识别 | - | - | - | - | 通用语音识别 |
| GPT-4o Realtime | 全能 | 128K | - | - | - | 实时语音 + 文本 + 视觉 |

> 价格单位：USD / 百万 Token

### Anthropic

| 信息 | 详情 |
|------|------|
| **接入地址** | `https://api.anthropic.com` |
| **API 格式** | Anthropic Messages |
| **计价货币** | USD |
| **API Key 获取** | [console.anthropic.com](https://console.anthropic.com/) |

| 模型 | 类型 | 上下文 | 最大输出 | 输入价格 | 输出价格 | 特色 |
|------|------|--------|---------|---------|---------|------|
| Claude Opus 4.6 | 对话 | 200K | 32K | $5 | $25 | 最新旗舰 |
| Claude Opus 4.5 | 对话 | 200K | 32K | $5 | $25 | 顶级推理 |
| Claude Sonnet 4.5 | 对话 | 200K | 64K | $3 | $15 | 高性能性价比 |
| Claude Sonnet 4 | 对话 | 200K | 64K | $3 | $15 | 旗舰模型 |
| Claude Sonnet 4.5 CU | Computer Use | 200K | 64K | $3 | $15 | 最佳 Computer Use |

### Google

| 信息 | 详情 |
|------|------|
| **接入地址** | `https://generativelanguage.googleapis.com/v1beta` |
| **计价货币** | USD |
| **API Key 获取** | [aistudio.google.com](https://aistudio.google.com/) |

| 模型 | 类型 | 上下文 | 最大输出 | 输入价格 | 输出价格 | 特色 |
|------|------|--------|---------|---------|---------|------|
| Gemini 2.5 Pro | 对话 | 1M | 64K | $1.25 | $10 | 百万上下文旗舰 |
| Gemini 2.5 Flash | 对话 | 1M | 64K | $0.30 | $2.50 | 百万上下文高性价比 |
| Text Embedding 005 | 嵌入 | - | - | $0.10 | - | 文本嵌入 |

### Mistral AI

| 信息 | 详情 |
|------|------|
| **接入地址** | `https://api.mistral.ai/v1` |
| **计价货币** | USD |
| **API Key 获取** | [console.mistral.ai](https://console.mistral.ai/) |

| 模型 | 类型 | 上下文 | 输入价格 | 输出价格 | 特色 |
|------|------|--------|---------|---------|------|
| Mistral Large 3 | 对话 | 256K | $0.50 | $1.50 | 旗舰，视觉 + 工具 |
| Mistral Small 3.2 | 快速 | 130K | $0.10 | $0.30 | 低延迟高效 |
| Codestral | 对话 | 256K | $0.30 | $0.90 | 专业代码模型 |

### xAI

| 信息 | 详情 |
|------|------|
| **接入地址** | `https://api.x.ai/v1` |
| **计价货币** | USD |
| **API Key 获取** | [console.x.ai](https://console.x.ai/) |

| 模型 | 类型 | 上下文 | 输入价格 | 输出价格 | 特色 |
|------|------|--------|---------|---------|------|
| Grok 4 | 对话/推理 | 262K | $3 | $15 | 最新旗舰推理 |
| Grok 4.1 Fast | 对话 | 2M | $0.20 | $0.50 | 超长上下文高速 |

### Cohere

| 信息 | 详情 |
|------|------|
| **接入地址** | `https://api.cohere.ai/compatibility/v1` |
| **计价货币** | USD |
| **API Key 获取** | [dashboard.cohere.com](https://dashboard.cohere.com/) |

| 模型 | 类型 | 上下文 | 输入价格 | 输出价格 | 特色 |
|------|------|--------|---------|---------|------|
| Command A | 对话 | 262K | $2.50 | $10 | RAG 和工具调用 |
| Embed V4 | 嵌入 | 131K | $0.12 | - | 多语言嵌入 |
| Rerank V3.5 | 重排 | - | $2 | - | 语义重排序 |

### Perplexity

| 信息 | 详情 |
|------|------|
| **接入地址** | `https://api.perplexity.ai` |
| **计价货币** | USD |
| **API Key 获取** | [perplexity.ai](https://www.perplexity.ai/) |

| 模型 | 类型 | 上下文 | 输入价格 | 输出价格 | 特色 |
|------|------|--------|---------|---------|------|
| Sonar Pro | 对话 | 200K | $3 | $15 | 内置联网搜索 |
| Sonar Reasoning Pro | 对话 | 128K | $2 | $8 | 深度推理 + 搜索 |
| Sonar | 对话 | 128K | $1 | $1 | 轻量搜索 |

## 国内供应商

### DeepSeek

| 信息 | 详情 |
|------|------|
| **接入地址** | `https://api.deepseek.com/v1` |
| **计价货币** | CNY |
| **API Key 获取** | [platform.deepseek.com](https://platform.deepseek.com/) |

| 模型 | 类型 | 上下文 | 输入价格 | 输出价格 | 特色 |
|------|------|--------|---------|---------|------|
| DeepSeek V3.2 | 对话 | 64K | ¥2 | ¥8 | 高性价比通用 |
| DeepSeek R1 | 推理 | 64K | ¥4 | ¥16 | 深度推理 |

### 阿里 通义千问（DashScope）

| 信息 | 详情 |
|------|------|
| **接入地址** | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| **计价货币** | CNY |
| **API Key 获取** | [dashscope.console.aliyun.com](https://dashscope.console.aliyun.com/) |

| 模型 | 类型 | 上下文 | 输入价格 | 输出价格 | 特色 |
|------|------|--------|---------|---------|------|
| Qwen3.5-Plus | 对话 | 262K | ¥0.8 | ¥4.8 | 旗舰，多模态 |
| Qwen-Max | 对话 | 128K | ¥2.4 | ¥9.6 | 千亿参数旗舰 |
| Qwen-Plus | 对话 | 128K | ¥0.8 | ¥2 | 性价比之选 |
| Qwen-Turbo | 对话 | 1M | ¥0.3 | ¥0.6 | 百万上下文 |
| Qwen-Long | 对话 | 10M | ¥0.5 | ¥2 | 千万级上下文 |
| Qwen3-Max | 对话 | 262K | ¥2.5 | ¥10 | 第三代旗舰 |
| 通义万相 V2 | 图像生成 | - | - | - | 文生图 |
| CosyVoice V2 | 语音合成 | - | - | - | 中英文语音 |
| Paraformer V2 | 语音识别 | - | - | - | 中文优化 |

> 价格单位：CNY / 百万 Token

### 火山引擎 豆包

| 信息 | 详情 |
|------|------|
| **接入地址** | `https://ark.cn-beijing.volces.com/api/v3` |
| **计价货币** | CNY |
| **API Key 获取** | [console.volcengine.com](https://console.volcengine.com/) |

| 模型 | 类型 | 上下文 | 输入价格 | 输出价格 | 特色 |
|------|------|--------|---------|---------|------|
| 豆包 2.0 Pro | 对话 | 256K | ¥3.2 | ¥16 | 旗舰模型 |
| 豆包 Seed-1.8 | 对话 | 256K | ¥0.8 | ¥2 | 深度思考 + 多模态 |
| 豆包 Seed-1.6 | 对话 | 256K | ¥0.8 | ¥8 | 旗舰通用 |
| 豆包 Seed-Code | 对话 | 256K | ¥1.2 | ¥8 | 编程专用 |

### 月之暗面 Kimi

| 信息 | 详情 |
|------|------|
| **接入地址** | `https://api.moonshot.cn/v1` |
| **计价货币** | CNY |
| **API Key 获取** | [platform.moonshot.cn](https://platform.moonshot.cn/) |

| 模型 | 类型 | 上下文 | 输入价格 | 输出价格 | 特色 |
|------|------|--------|---------|---------|------|
| Kimi K2.5 | 对话 | 256K | ¥4 | ¥21 | 原生多模态，智能体集群 |
| Kimi K2 | 对话 | 256K | ¥4 | ¥16 | 万亿参数 MoE |
| Kimi K2 思考版 | 推理 | 256K | ¥4 | ¥16 | 深度推理 |

### 智谱 GLM

| 信息 | 详情 |
|------|------|
| **接入地址** | `https://open.bigmodel.cn/api/paas/v4` |
| **计价货币** | CNY |
| **API Key 获取** | [open.bigmodel.cn](https://open.bigmodel.cn/) |

| 模型 | 类型 | 上下文 | 输入价格 | 输出价格 | 特色 |
|------|------|--------|---------|---------|------|
| GLM-5 | 对话 | 200K | ¥4 | ¥18 | 744B 参数旗舰 |
| GLM-4.7 | 对话 | 200K | ¥4 | ¥16 | 355B MoE 旗舰 |
| GLM-4.7 Thinking | 推理 | 200K | ¥8 | ¥32 | 深度思考 |
| GLM-4.6V | 视觉 | 128K | ¥8 | ¥32 | 多模态 |

### 百度 文心

| 信息 | 详情 |
|------|------|
| **接入地址** | `https://qianfan.baidubce.com/v2` |
| **计价货币** | CNY |
| **API Key 获取** | [console.bce.baidu.com](https://console.bce.baidu.com/) |

| 模型 | 类型 | 上下文 | 输入价格 | 输出价格 | 特色 |
|------|------|--------|---------|---------|------|
| ERNIE 5.0 | 对话/推理 | 128K | ¥8 | ¥32 | 旗舰，多模态 |
| ERNIE 4.5 Turbo | 对话 | 128K | ¥0.8 | ¥3.2 | 高性价比 |

### 腾讯混元

| 信息 | 详情 |
|------|------|
| **接入地址** | `https://api.hunyuan.cloud.tencent.com/v1` |
| **计价货币** | CNY |
| **API Key 获取** | [cloud.tencent.com](https://cloud.tencent.com/) |

| 模型 | 类型 | 上下文 | 输入价格 | 输出价格 | 特色 |
|------|------|--------|---------|---------|------|
| 混元 2.0 Think | 推理 | 128K | ¥3.975 | ¥15.9 | 406B MoE 深度推理 |
| 混元 Turbo S | 对话 | 262K | ¥0.8 | ¥2 | 高速推理 |

### 其他国内供应商

| 供应商 | 代表模型 | 特色 | API Key 获取 |
|--------|---------|------|-------------|
| 百川 Baichuan | M3-Plus, M2-Plus | 医疗增强 | [platform.baichuan-ai.com](https://platform.baichuan-ai.com/) |
| 零一万物 Yi | Yi Lightning | 智能路由，高性价比 | [platform.lingyiwanwu.com](https://platform.lingyiwanwu.com/) |
| MiniMax | M2.5, M2.1 | 百万上下文 | [platform.minimaxi.com](https://platform.minimaxi.com/) |
| 讯飞星火 | X1, 4.0 Ultra | 全国产算力 | [xinghuo.xfyun.cn](https://xinghuo.xfyun.cn/) |

## 聚合平台

### OpenRouter

| 信息 | 详情 |
|------|------|
| **接入地址** | `https://openrouter.ai/api/v1` |
| **特色** | 一个 Key 访问多家模型，部分模型免费 |
| **API Key 获取** | [openrouter.ai](https://openrouter.ai/) |

可用免费模型：Gemini 2.5 Flash、Qwen3 Coder 480B 等。

### 硅基流动

| 信息 | 详情 |
|------|------|
| **接入地址** | `https://api.siliconflow.cn/v1` |
| **特色** | 国内模型聚合，开源模型推理 |
| **API Key 获取** | [cloud.siliconflow.cn](https://cloud.siliconflow.cn/) |

## 创意生成

| 供应商 | 服务类型 | 代表模型 | API Key 获取 |
|--------|---------|---------|-------------|
| Stability AI | 图像生成 | Stable Diffusion 3.5 | [platform.stability.ai](https://platform.stability.ai/) |
| 快手 可灵 | 视频生成 | 可灵 V2.5 | [klingai.com](https://klingai.com/) |

## 本地部署

| 供应商 | 服务类型 | 说明 | 无需 API Key |
|--------|---------|------|-------------|
| Ollama | 对话 | 本地运行开源模型（Llama 等） | 是 |
| 本地 Whisper | 语音识别 | 本地运行 Whisper 模型 | 是 |
