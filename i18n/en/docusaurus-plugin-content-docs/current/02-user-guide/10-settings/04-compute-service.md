---
title: Compute Service Configuration
description: Configure AI providers, manage API Keys and models to give agents reasoning capabilities.
keywords: [compute, AI provider, API Key, model, Provider, LLM, settings]
---

# Compute Service Configuration

Compute Service is one of DesireCore's core configurations. Agents need to call AI models to understand your intent, generate responses, and execute tasks, and these models are provided by various AI providers. You need to configure at least one provider here for the agent to work properly.

## Basic Concepts

- **Provider**: Platforms providing AI model services, such as OpenAI, Anthropic, DeepSeek, etc.
- **API Key**: The key given to you by the provider for identity verification and billing
- **Model**: Specific AI models, such as GPT-4o, Claude 3.5 Sonnet, DeepSeek-V3, etc.
- **Default Mapping**: Specifies which model to use for different purposes

## Entering Compute Service Configuration

There are two ways to enter:

1. **Settings Panel** → Click **Compute Service** section (will jump to resource manager)
2. **Resource Manager** → Click **Compute** card → **AI Services** Tab

## Supported AI Providers

DesireCore has built-in configuration templates for over 20 mainstream AI providers:

| Provider | Description |
|----------|-------------|
| **OpenAI** | GPT-4o, GPT-4o-mini, etc. |
| **Anthropic** | Claude 3.5 Sonnet, Claude 3 Opus, etc. |
| **DeepSeek** | DeepSeek-V3, DeepSeek-R1, etc. |
| **Google** | Gemini series |
| **Zhipu AI** | GLM series |
| **Baidu Wenxin** | ERNIE series |
| **Tongyi Qianwen** | Qwen series |
| **Moonshot** | Kimi series |
| **SiliconFlow** | Aggregates multiple models |
| **OpenRouter** | Unified interface aggregating multiple models |
| **Ollama** | Locally deployed open-source models |
| More... | Mistral, Cohere, xAI, Perplexity, Volcano Engine, iFlytek, etc. |

:::tip How to Choose the Most Cost-Effective Configuration
- **Limited Budget**: Recommend DeepSeek or Tongyi Qianwen, domestic models have lower prices and excellent Chinese capabilities
- **Pursuing Quality**: Recommend Anthropic Claude or OpenAI GPT-4o
- **Completely Free**: Use Ollama to run open-source models locally (requires good hardware configuration)
- **Flexible Mix**: Configure multiple providers, use cheaper models for daily conversations, use high-end models for complex tasks
:::

## Adding AI Providers

1. On the AI Services page, click your target provider in the provider list on the left
2. The right panel will display the configuration form for that provider
3. Fill in your **API Key**
4. If needed, modify the **Endpoint** (in most cases keep the default)
5. After configuration, click verify to confirm the connection is normal

### Custom Providers

If your provider is not in the built-in list (e.g., privately deployed AI services), you can click **Add Custom Provider** to manually configure the endpoint and authentication method. Custom providers need to be compatible with the OpenAI API format.

## Managing API Keys

Your API Key is protected in the following ways:

- API Key is stored in the system credential manager on your local device (macOS Keychain / Windows Credential Manager / Linux Secret Service)
- Configuration files only store encrypted references, not plaintext
- API Key is not uploaded to DesireCore servers or any third parties

To modify API Key: Select the provider, click the **Edit** button, enter the new Key to overwrite the old value.

## Model Verification

After configuring a provider, we recommend verifying model availability:

1. Select a configured provider
2. Click the **Verify All Models** button
3. The system will check each model's availability one by one

Verification results are displayed with status labels:

| Status | Meaning |
|--------|---------|
| **Available** | Model working normally |
| **Error** | Model returned error, possibly Key doesn't have access to this model |
| **Timeout** | Request timed out, possibly network issue |
| **Checking** | Currently verifying |

## Default Model Mapping

DesireCore agents need different types of models when executing different tasks. **Default Mapping** lets you specify which model to use for each purpose.

Common purpose types:

- **Dialogue Generation**: Daily conversations and text generation
- **Code Generation**: Writing and modifying code
- **Document Processing**: Analyzing and generating documents
- **Tool Calling**: Scenarios requiring Function Calling capabilities

You can select models for each purpose in the **Default Mapping** Tab. Unset purposes will use the global default model.

:::info
Individual agents can also override the default mapping, specifying dedicated models for that agent in agent detail settings. Agent-level settings take precedence over global default mapping.
:::

## Multi-Provider Management

You can configure multiple providers simultaneously. Benefits of doing this:

- **Redundancy Backup**: When one provider's service is unavailable, you can switch to other providers
- **Cost Optimization**: Use cheaper models for daily tasks, use high-end models for critical tasks
- **Capability Complementarity**: Different providers' models have different strengths
