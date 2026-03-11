---
title: Compute Model
description: Understanding DesireCore's compute architecture — bring your own keys, choose your own engines, multi-vendor support
keywords: [compute, Compute, BYOK, vendor, model selection, API Key]
---

# Compute Model

## What is the Compute Model

DesireCore itself doesn't provide AI models, but helps you **connect and manage** various AI services. Like a computer doesn't generate electricity itself, but can use different power sources — you can connect to grid power, use batteries, or even solar.

DesireCore's compute model lets you freely choose AI service vendors, directly connecting with your own API Key without going through any intermediaries.

## BYOK — Bring Your Own Key Mode

BYOK is short for **Bring Your Own Key**, one of DesireCore's core philosophies.

### Understanding BYOK

Imagine you go to a self-service restaurant, but it doesn't sell ingredients — you bring your own ingredients, and the restaurant provides the kitchen, cookware, and cooking guidance. The benefits are:

- **You completely control ingredient sources and costs**
- **The restaurant doesn't markup ingredients**
- **You can switch suppliers anytime**

In DesireCore:

- You register accounts with AI vendors to get API Keys
- Enter the API Keys into DesireCore's settings
- DesireCore directly uses your Keys to call AI services
- Fees are settled directly between you and the vendor

### Advantages of BYOK

| Advantage | Description |
|-----------|-------------|
| **Transparent Billing** | You settle directly with vendors, no middleman markup |
| **Free Choice** | Use OpenAI today, switch to DeepSeek tomorrow — switch anytime |
| **Data Security** | Your data goes directly to vendors, not through third parties |
| **Cost Controllable** | See consumption details in vendor backend |

## Multi-Vendor Support

DesireCore supports over 20 AI vendors, covering mainstream services globally:

### International Vendors

| Vendor | Representative Models | Features |
|--------|----------------------|----------|
| OpenAI | GPT-5 series, o3/o4 | Strongest comprehensive capability, most complete model range |
| Anthropic | Claude Opus/Sonnet | Excellent reasoning and programming capabilities |
| Google | Gemini 2.5 Pro/Flash | Million-level context, multimodal |
| Mistral AI | Mistral Large/Small | European vendor, high cost-performance |
| xAI | Grok 4 series | Ultra-long context (2M) |
| Cohere | Command A | RAG and retrieval enhancement |
| Perplexity | Sonar Pro | Built-in web search |

### Domestic Vendors

| Vendor | Representative Models | Features |
|--------|----------------------|----------|
| DeepSeek | V3.2, R1 | Extremely high cost-performance, strong reasoning |
| Alibaba Tongyi Qianwen | Qwen3 series | Complete model range, ten-million-level context |
| Volcano Doubao | Doubao 2.0 series | Multimodal, supports voice cloning |
| Moonshot AI Kimi | K2/K2.5 | Long context, Agent-specialized |
| Zhipu GLM | GLM-5/4.7 | Large parameter flagship, strong programming |
| Baidu Wenxin | ERNIE 5.0 | Deep reasoning, multimodal |
| Tencent Hunyuan | Hunyuan 2.0 | Reasoning and tool calling |

### Aggregation Platforms

| Vendor | Description |
|--------|-------------|
| OpenRouter | One Key accesses multiple models, some free |
| SiliconFlow | Domestic model aggregation, provides open-source model inference |

### Local Deployment

| Vendor | Description |
|--------|-------------|
| Ollama | Run open-source models locally, no internet needed |
| Local Whisper | Local speech recognition |

### Creative Generation

| Vendor | Service Type |
|--------|-------------|
| Stability AI | Image generation (Stable Diffusion) |
| Kuaishou Kling | Video generation |

## Model Selection Strategy

Different tasks suit different models. DesireCore helps you automatically select through **default mapping**:

| Service Type | Applicable Scenarios | Recommended Model Features |
|--------------|---------------------|---------------------------|
| chat | Daily conversation, complex tasks | Flagship models with strong comprehensive capability |
| fast | Simple tasks, quick response | Lightweight models with fast response |
| reasoning | Math, logical reasoning | Deep reasoning specialized models |
| vision | Image understanding | Multimodal models |
| embedding | Text vectorization | Embedding models |
| tts | Speech synthesis | TTS models |
| asr | Speech recognition | ASR models |

You can customize these mappings in settings — for example, point daily conversation to cheaper models, and important tasks to the strongest models.

## Pre-configured Compute Packages

If you don't want to register vendor accounts yourself, DesireCore also plans to offer pre-configured compute packages — out-of-the-box, pay-as-you-go. But BYOK mode is always available; you won't be locked into any single vendor.

## Next Steps

- Want to see details of all supported vendors? Read [Supported AI Vendors List](../05-more/04-supported-providers.md)
- Want to understand how to configure compute services? Go to the Settings chapter in the User Guide
