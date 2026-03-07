---
title: Configure API Key
description: Step-by-step guide to obtain and configure API Keys from various AI providers to connect DesireCore to AI services.
keywords: [API Key, configuration, OpenAI, Claude, DeepSeek, Gemini, SiliconFlow, provider]
---

# Configure API Key

DesireCore is a local-first application — your data is stored locally, and AI capabilities are accessed through your own API Key. Configuring an API Key is the most critical step before you start using DesireCore.

## What is an API Key?

An API Key is like a "key" to access AI services. Each AI provider (such as OpenAI, Anthropic, DeepSeek, etc.) offers API services — you need to register on their website, obtain an API Key, and then enter it in DesireCore so it can call the corresponding AI models.

:::info Cost Information
Using an API Key to call AI services is billed by usage, with fees charged directly by the corresponding provider. DesireCore itself is free. Pricing varies widely between models, from fractions of a cent to tens of dollars per million tokens.
:::

## Configuring in DesireCore

1. Click the **Settings** icon (gear icon) in the bottom-left corner
2. Select the **Compute Services** tab
3. In the provider list, click the provider you want to configure
4. Enter your API Key
5. Click **Verify** to confirm the Key is valid

<!-- Screenshot placeholder: Configure API Key (configure-api-key.png) -->

## Provider API Key Guides

DesireCore supports over 20 AI providers. Below are instructions for the most commonly used ones.

### OpenAI (GPT Series)

OpenAI offers models like GPT-5 and GPT-4, and is one of the world's most well-known AI providers.

| Item | Info |
|------|------|
| Website | [platform.openai.com](https://platform.openai.com) |
| Billing Currency | USD |
| Key Models | GPT-5, GPT-4.1, GPT-4o |
| Key Capabilities | Chat, code, reasoning, vision, voice, image generation |

**Steps to obtain:**

1. Visit [platform.openai.com](https://platform.openai.com) and sign up or log in
2. Click **API keys** in the left navigation
3. Click **Create new secret key**
4. Name your key (e.g., "DesireCore") and click Create
5. Copy the generated key (starts with `sk-`) and store it securely

:::warning Keep Your Key Safe
The API Key is only shown once — copy and save it immediately. If you lose it, you'll need to create a new one.
:::

### Anthropic (Claude Series)

Anthropic offers the Claude series of models, known for safety and long-context processing capabilities.

| Item | Info |
|------|------|
| Website | [console.anthropic.com](https://console.anthropic.com) |
| Billing Currency | USD |
| Key Models | Claude Opus 4.6, Claude Sonnet 4.5 |
| Key Capabilities | Chat, code, reasoning, vision, long-context |

**Steps to obtain:**

1. Visit [console.anthropic.com](https://console.anthropic.com) and sign up or log in
2. Go to **Settings** > **API keys**
3. Click **Create Key**
4. Copy the generated key (starts with `sk-ant-`)

### DeepSeek

DeepSeek is a leading AI company from China, offering high-value conversational and reasoning models.

| Item | Info |
|------|------|
| Website | [platform.deepseek.com](https://platform.deepseek.com) |
| Billing Currency | CNY |
| Key Models | DeepSeek V3.2, DeepSeek R1 |
| Key Capabilities | Chat, code, reasoning, multilingual |

**Steps to obtain:**

1. Visit [platform.deepseek.com](https://platform.deepseek.com) and sign up or log in
2. Go to the dashboard and click **API Keys**
3. Create a new API Key and copy it

### Google (Gemini Series)

Google offers Gemini series models with ultra-long context windows (up to 1 million tokens).

| Item | Info |
|------|------|
| Website | [aistudio.google.com](https://aistudio.google.com) |
| Billing Currency | USD |
| Key Models | Gemini 2.5 Pro, Gemini 2.5 Flash |
| Key Capabilities | Chat, code, reasoning, vision, ultra-long context |

**Steps to obtain:**

1. Visit [aistudio.google.com](https://aistudio.google.com)
2. Click **Get API Key**
3. Select or create a Google Cloud project
4. Copy the generated API Key

### SiliconFlow

SiliconFlow is an AI inference service platform from China that aggregates various open-source models (such as Qwen), with some models offering free credits.

| Item | Info |
|------|------|
| Website | [siliconflow.cn](https://siliconflow.cn) |
| Billing Currency | CNY |
| Key Models | Qwen3 Coder 480B, Qwen3 235B |
| Key Capabilities | Code, reasoning, multilingual, free embeddings |

**Steps to obtain:**

1. Visit [siliconflow.cn](https://siliconflow.cn) and sign up or log in
2. Go to the dashboard and find the **API Keys** page
3. Create a new key and copy it

## More Providers

In addition to the providers listed above, DesireCore also supports:

| Provider | Highlights | Billing Currency |
|----------|-----------|-----------------|
| Tongyi Qwen (DashScope) | By Alibaba Cloud | CNY |
| Doubao (Volcengine) | By ByteDance | CNY |
| Moonshot (Kimi) | Company behind Kimi | CNY |
| Zhipu AI | GLM model series | CNY |
| Baichuan | Chinese LLM | CNY |
| Lingyiwanwu | Yi model series | CNY |
| MiniMax | Chinese multimodal models | CNY |
| Baidu (ERNIE Bot) | By Baidu | CNY |
| Tencent (Hunyuan) | By Tencent | CNY |
| iFlytek (Spark) | By iFlytek | CNY |
| Mistral | European AI company | USD |
| xAI (Grok) | Founded by Elon Musk | USD |
| Cohere | Enterprise AI services | USD |
| OpenRouter | AI model aggregation platform | USD |
| Perplexity | Search-augmented AI | USD |
| Ollama | Run open-source models locally | Free |

The configuration process is similar: go to Settings > Compute Services, select the provider, and enter your API Key.

## Verifying the Connection

After configuring your API Key, it's recommended to verify it immediately:

1. On the provider detail page, click the **Verify** button
2. DesireCore will send a test request to the AI service
3. If it shows "Verified", the configuration is successful

<!-- Screenshot placeholder: Verification result (api-key-verify.png) -->

## Troubleshooting

### API Key reported as invalid

- Check that the key was copied completely (no extra spaces at the beginning or end)
- Confirm the key is still valid and the account has sufficient balance
- Verify your network can reach the corresponding API endpoint

### Network connection failed

- Confirm your network can access the provider's API address
- If you have difficulty accessing overseas services, try providers with regional servers (e.g., DeepSeek, SiliconFlow)
- Check if any firewall or proxy settings are blocking HTTPS requests

### Not sure which provider to choose

:::tip Recommendations
- **Best value**: **DeepSeek** — affordable, low latency, strong multilingual capabilities
- **Best capabilities**: **Anthropic Claude** or **OpenAI GPT** — top performance on complex reasoning and code tasks
- **Want to try for free**: **SiliconFlow** — some models offer free credits
- **Need ultra-long context**: **Google Gemini** — supports up to 1 million token context
:::

After configuring your API Key, you can start your [First Conversation](./05-first-conversation.md)!
