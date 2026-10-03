---
title: Supported AI Providers
description: Common AI providers, integration protocols, and model configuration examples for DesireCore.
keywords: [providers, Provider, AI models, API, OpenAI, Claude, DeepSeek]
---

# Supported AI Providers

DesireCore's provider and model catalog is updated through config-center. Availability depends on the client, account permissions, and synchronized configuration. Supported services include chat, reasoning, tool use, vision, embeddings, voice, image generation, video generation, and other types.

The source-bundled config-center version 123 (2026-10-01) includes GPT-6.1 Sol, Claude Sonnet 5.5, and Claude Opus 5.5. GPT-6.1 Sol uses Responses API for tool calling; verify that your gateway supports it. Whether a model appears also depends on configuration sync, enabled providers, credentials, and account permissions.

The model and price tables below are configuration examples, not a complete current catalog or live quotes. Select models from the application's current list and consult the provider's current pricing for actual charges.

## International Providers

### OpenAI

| Info | Details |
|------|---------|
| **Endpoint** | `https://api.openai.com/v1` |
| **API Format** | Chat Completions / Responses, as configured for each model |
| **Pricing Currency** | USD |
| **API Key** | [platform.openai.com](https://platform.openai.com/api-keys) |

| Model | Type | Context | Max Output | Input Price | Output Price | Features |
|-------|------|---------|------------|-------------|--------------|----------|
| GPT-5.2 | Chat | 400K | 128K | $1.75 | $14 | Coding and agent workflows |
| GPT-5.2 Pro | Chat | 400K | 128K | $21 | $168 | Pro model |
| GPT-5.1 | Chat | 400K | 128K | $1.25 | $10 | GPT-5 series |
| GPT-5 | Chat | 400K | 128K | $1.25 | $10 | General-purpose model |
| GPT-5-mini | Chat | 128K | 32K | $0.25 | $2 | Daily chat |
| GPT-5-nano | Fast | 128K | 16K | $0.02 | $0.08 | Fast response |
| GPT-4.1 | Chat | 1M | 32K | $2 | $8 | Million context |
| GPT-4.1 mini | Chat | 1M | 32K | $0.40 | $1.60 | 1M context |
| GPT-4.1 nano | Fast | 1M | 32K | $0.10 | $0.40 | Nano series |
| o3 | Reasoning | 200K | 100K | $2 | $8 | Deep reasoning |
| o3-pro | Reasoning | 200K | 100K | $20 | $80 | Advanced reasoning |
| o3-mini | Reasoning | 128K | 100K | $1.10 | $4.40 | Reasoning model |
| o4-mini | Reasoning | 200K | 100K | $1.10 | $4.40 | Reasoning + Vision |
| GPT-4o | Vision | 128K | 16K | $2.50 | $10 | Multimodal |
| GPT-4o mini | Vision | 128K | 16K | $0.15 | $0.60 | Vision and chat |
| DALL-E 3 | Image Gen | - | - | - | - | Text-to-image |
| TTS-1 / TTS-1-HD | Voice Synth | - | - | - | - | Standard/HD voice synthesis |
| Whisper | Speech Recog | - | - | - | - | Universal speech recognition |
| GPT-4o Realtime | Omni | 128K | - | - | - | Real-time voice + text + vision |

> Price unit: USD / million tokens

### Anthropic

| Info | Details |
|------|---------|
| **Endpoint** | `https://api.anthropic.com` |
| **API Format** | Anthropic Messages |
| **Pricing Currency** | USD |
| **API Key** | [console.anthropic.com](https://console.anthropic.com/) |

| Model | Type | Context | Max Output | Input Price | Output Price | Features |
|-------|------|---------|------------|-------------|--------------|----------|
| Claude Opus 4.6 | Chat | 200K | 32K | $5 | $25 | Opus example model |
| Claude Opus 4.5 | Chat | 200K | 32K | $5 | $25 | Opus series |
| Claude Sonnet 4.5 | Chat | 200K | 64K | $3 | $15 | Sonnet series |
| Claude Sonnet 4 | Chat | 200K | 64K | $3 | $15 | Sonnet series |
| Claude Sonnet 4.5 CU | Computer Use | 200K | 64K | $3 | $15 | Computer Use model |

### Google

| Info | Details |
|------|---------|
| **Endpoint** | `https://generativelanguage.googleapis.com/v1beta` |
| **Pricing Currency** | USD |
| **API Key** | [aistudio.google.com](https://aistudio.google.com/) |

| Model | Type | Context | Max Output | Input Price | Output Price | Features |
|-------|------|---------|------------|-------------|--------------|----------|
| Gemini 2.5 Pro | Chat | 1M | 64K | $1.25 | $10 | 1M context |
| Gemini 2.5 Flash | Chat | 1M | 64K | $0.30 | $2.50 | 1M context |
| Text Embedding 005 | Embedding | - | - | $0.10 | - | Text embedding |

### Mistral AI

| Info | Details |
|------|---------|
| **Endpoint** | `https://api.mistral.ai/v1` |
| **Pricing Currency** | USD |
| **API Key** | [console.mistral.ai](https://console.mistral.ai/) |

| Model | Type | Context | Input Price | Output Price | Features |
|-------|------|---------|-------------|--------------|----------|
| Mistral Large 3 | Chat | 256K | $0.50 | $1.50 | Vision + tools |
| Mistral Small 3.2 | Fast | 130K | $0.10 | $0.30 | Low latency efficient |
| Codestral | Chat | 256K | $0.30 | $0.90 | Professional code model |

### xAI

| Info | Details |
|------|---------|
| **Endpoint** | `https://api.x.ai/v1` |
| **Pricing Currency** | USD |
| **API Key** | [console.x.ai](https://console.x.ai/) |

| Model | Type | Context | Input Price | Output Price | Features |
|-------|------|---------|-------------|--------------|----------|
| Grok 4 | Chat/Reasoning | 262K | $3 | $15 | Reasoning |
| Grok 4.1 Fast | Chat | 2M | $0.20 | $0.50 | Ultra-long context high-speed |

### Cohere

| Info | Details |
|------|---------|
| **Endpoint** | `https://api.cohere.ai/compatibility/v1` |
| **Pricing Currency** | USD |
| **API Key** | [dashboard.cohere.com](https://dashboard.cohere.com/) |

| Model | Type | Context | Input Price | Output Price | Features |
|-------|------|---------|-------------|--------------|----------|
| Command A | Chat | 262K | $2.50 | $10 | RAG and tool calling |
| Embed V4 | Embedding | 131K | $0.12 | - | Multilingual embedding |
| Rerank V3.5 | Rerank | - | $2 | - | Semantic reranking |

### Perplexity

| Info | Details |
|------|---------|
| **Endpoint** | `https://api.perplexity.ai` |
| **Pricing Currency** | USD |
| **API Key** | [perplexity.ai](https://www.perplexity.ai/) |

| Model | Type | Context | Input Price | Output Price | Features |
|-------|------|---------|-------------|--------------|----------|
| Sonar Pro | Chat | 200K | $3 | $15 | Built-in web search |
| Sonar Reasoning Pro | Chat | 128K | $2 | $8 | Deep reasoning + search |
| Sonar | Chat | 128K | $1 | $1 | Lightweight search |

## China Providers

### DeepSeek

| Info | Details |
|------|---------|
| **Endpoint** | `https://api.deepseek.com/v1` |
| **Pricing Currency** | CNY |
| **API Key** | [platform.deepseek.com](https://platform.deepseek.com/) |

| Model | Type | Context | Input Price | Output Price | Features |
|-------|------|---------|-------------|--------------|----------|
| DeepSeek V3.2 | Chat | 64K | ¥2 | ¥8 | General-purpose chat |
| DeepSeek R1 | Reasoning | 64K | ¥4 | ¥16 | Deep reasoning |

### Alibaba Tongyi Qianwen (DashScope)

| Info | Details |
|------|---------|
| **Endpoint** | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| **Pricing Currency** | CNY |
| **API Key** | [dashscope.console.aliyun.com](https://dashscope.console.aliyun.com/) |

| Model | Type | Context | Input Price | Output Price | Features |
|-------|------|---------|-------------|--------------|----------|
| Qwen3.5-Plus | Chat | 262K | ¥0.8 | ¥4.8 | Multimodal |
| Qwen-Max | Chat | 128K | ¥2.4 | ¥9.6 | Max series |
| Qwen-Plus | Chat | 128K | ¥0.8 | ¥2 | Daily chat |
| Qwen-Turbo | Chat | 1M | ¥0.3 | ¥0.6 | Million context |
| Qwen-Long | Chat | 10M | ¥0.5 | ¥2 | 10M context |
| Qwen3-Max | Chat | 262K | ¥2.5 | ¥10 | Max series |
| Tongyi Wanxiang V2 | Image Gen | - | - | - | Text-to-image |
| CosyVoice V2 | Voice Synth | - | - | - | Chinese/English voice |
| Paraformer V2 | Speech Recog | - | - | - | Chinese optimized |

> Price unit: CNY / million tokens

### Volcano Engine Doubao

| Info | Details |
|------|---------|
| **Endpoint** | `https://ark.cn-beijing.volces.com/api/v3` |
| **Pricing Currency** | CNY |
| **API Key** | [console.volcengine.com](https://console.volcengine.com/) |

| Model | Type | Context | Input Price | Output Price | Features |
|-------|------|---------|-------------|--------------|----------|
| Doubao 2.0 Pro | Chat | 256K | ¥3.2 | ¥16 | Sonnet series |
| Doubao Seed-1.8 | Chat | 256K | ¥0.8 | ¥2 | Deep thinking + multimodal |
| Doubao Seed-1.6 | Chat | 256K | ¥0.8 | ¥8 | General-purpose model |
| Doubao Seed-Code | Chat | 256K | ¥1.2 | ¥8 | Programming specialized |

### Moonshot AI Kimi

| Info | Details |
|------|---------|
| **Endpoint** | `https://api.moonshot.cn/v1` |
| **Pricing Currency** | CNY |
| **API Key** | [platform.moonshot.cn](https://platform.moonshot.cn/) |

| Model | Type | Context | Input Price | Output Price | Features |
|-------|------|---------|-------------|--------------|----------|
| Kimi K2.5 | Chat | 256K | ¥4 | ¥21 | Native multimodal, agent cluster |
| Kimi K2 | Chat | 256K | ¥4 | ¥16 | Trillion-parameter MoE |
| Kimi K2 Thinking | Reasoning | 256K | ¥4 | ¥16 | Deep reasoning |

### Zhipu GLM

| Info | Details |
|------|---------|
| **Endpoint** | `https://open.bigmodel.cn/api/paas/v4` |
| **Pricing Currency** | CNY |
| **API Key** | [open.bigmodel.cn](https://open.bigmodel.cn/) |

| Model | Type | Context | Input Price | Output Price | Features |
|-------|------|---------|-------------|--------------|----------|
| GLM-5 | Chat | 200K | ¥4 | ¥18 | 744B parameters |
| GLM-4.7 | Chat | 200K | ¥4 | ¥16 | 355B MoE |
| GLM-4.7 Thinking | Reasoning | 200K | ¥8 | ¥32 | Deep thinking |
| GLM-4.6V | Vision | 128K | ¥8 | ¥32 | Multimodal |

### Baidu Ernie

| Info | Details |
|------|---------|
| **Endpoint** | `https://qianfan.baidubce.com/v2` |
| **Pricing Currency** | CNY |
| **API Key** | [console.bce.baidu.com](https://console.bce.baidu.com/) |

| Model | Type | Context | Input Price | Output Price | Features |
|-------|------|---------|-------------|--------------|----------|
| ERNIE 5.0 | Chat/Reasoning | 128K | ¥8 | ¥32 | Multimodal |
| ERNIE 4.5 Turbo | Chat | 128K | ¥0.8 | ¥3.2 | Turbo series |

### Tencent Hunyuan

| Info | Details |
|------|---------|
| **Endpoint** | `https://api.hunyuan.cloud.tencent.com/v1` |
| **Pricing Currency** | CNY |
| **API Key** | [cloud.tencent.com](https://cloud.tencent.com/) |

| Model | Type | Context | Input Price | Output Price | Features |
|-------|------|---------|-------------|--------------|----------|
| Hunyuan 2.0 Think | Reasoning | 128K | ¥3.975 | ¥15.9 | 406B MoE deep reasoning |
| Hunyuan Turbo S | Chat | 262K | ¥0.8 | ¥2 | High-speed reasoning |

### Other China Providers

| Provider | Representative Models | Features | API Key |
|----------|----------------------|----------|---------|
| Baichuan | M3-Plus, M2-Plus | Medical enhanced | [platform.baichuan-ai.com](https://platform.baichuan-ai.com/) |
| 01.AI Yi | Yi Lightning | Smart routing, cost-effective | [platform.lingyiwanwu.com](https://platform.lingyiwanwu.com/) |
| MiniMax | M2.5, M2.1 | Million context | [platform.minimaxi.com](https://platform.minimaxi.com/) |
| iFlytek Spark | X1, 4.0 Ultra | Domestic computing power | [xinghuo.xfyun.cn](https://xinghuo.xfyun.cn/) |

## Aggregation Platforms

### OpenRouter

| Info | Details |
|------|---------|
| **Endpoint** | `https://openrouter.ai/api/v1` |
| **Features** | One key for multiple models, some models free |
| **API Key** | [openrouter.ai](https://openrouter.ai/) |

Available free models: Gemini 2.5 Flash, Qwen3 Coder 480B, etc.

### SiliconFlow

| Info | Details |
|------|---------|
| **Endpoint** | `https://api.siliconflow.cn/v1` |
| **Features** | China model aggregation, open-source model inference |
| **API Key** | [cloud.siliconflow.cn](https://cloud.siliconflow.cn/) |

## Creative Generation

| Provider | Service Type | Representative Model | API Key |
|----------|--------------|----------------------|---------|
| Stability AI | Image Gen | Stable Diffusion 3.5 | [platform.stability.ai](https://platform.stability.ai/) |
| Kling AI | Video Gen | Kling V2.5 | [klingai.com](https://klingai.com/) |

## Local Deployment

| Provider | Service Type | Description | No API Key Required |
|----------|--------------|-------------|---------------------|
| Ollama | Chat | Run open-source models locally (Llama, etc.) | Yes |
| Local Whisper | Speech Recog | Run Whisper model locally | Yes |
