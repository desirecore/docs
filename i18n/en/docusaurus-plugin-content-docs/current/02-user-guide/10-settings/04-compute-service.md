---
title: Compute Service Configuration
description: Configure AI providers, manage API keys and models, and give agents reasoning capability.
keywords: [compute, AI provider, API Key, model, Provider, LLM, settings]
---

# Compute Service Configuration

Compute Service manages AI providers, API keys, model lists, and default mappings. Agents need at least one available model to understand requests, generate responses, call tools, and execute tasks. Image, voice, video, and music services are configured here as well.

## Core Concepts

| Concept | Description |
|---------|-------------|
| **Provider** | A platform or protocol configuration such as OpenAI, Anthropic, DeepSeek, Ollama, or OpenRouter |
| **Provider ID** | The unique ID of a concrete provider instance |
| **API Key** | The provider credential; its value is kept in the permission-protected local `secrets.json` while configuration stores a reference |
| **Model** | A concrete model used for chat, tool use, image, voice, video, or music services |
| **Default Mapping** | The default model selected for different task purposes |

## Opening Compute Settings

1. Open **Settings** -> **Compute Service**
2. Or open **Explorer** -> **Compute** -> **AI Services**

## Providers

DesireCore includes templates for many mainstream providers and supports custom OpenAI-compatible services:

| Type | Examples | Good For |
|------|----------|----------|
| International providers | OpenAI, Anthropic, Google, Mistral, Cohere, xAI, Perplexity | General chat, reasoning, code, tool use |
| China-based providers | DeepSeek, Zhipu, Qwen, Moonshot, Volcengine, iFlytek | Chinese tasks, local network conditions, cost control |
| Aggregators | OpenRouter, SiliconFlow | Managing many models through one entry point |
| Local models | Ollama | Local open-source models, device-local data, offline or intranet use |
| Custom providers | Private deployments or company gateways | Internal OpenAI-compatible model services |

Providers differ in price, context length, tool calling, media capability, regional availability, and network stability. A common setup is to configure more than one provider: low-cost models for routine work, higher-quality models for difficult reasoning or critical tasks, and Ollama or custom providers for local and intranet scenarios.

You can also add custom providers. Custom providers usually need to be OpenAI API compatible. If media APIs and text APIs use different endpoints, configure a separate media API base URL.

## Adding and Verifying Providers

1. Select a provider in AI Services
2. Enter API Key and Base URL
3. Configure API format, media Base URL, and service types when needed
4. Verify the key and models

| Status | Meaning |
|--------|---------|
| **Available** | The model or service verified successfully |
| **Error** | Key lacks permission, URL is wrong, model is unavailable, or provider returned an error |
| **Timeout** | Network or provider response timeout |
| **Checking** | Verification in progress |

Model verification uses the appropriate path for each model type. Image, voice, video, and music models use media service routes; `mediaBaseUrl` is used when the normal Base URL points to a non-OpenAI-compatible endpoint.

### Custom Providers

Use a custom provider when the built-in templates do not include your provider, or when your organization routes models through an internal gateway. Check:

- Whether the Base URL is OpenAI API compatible
- Whether the API Key or auth headers match the gateway requirements
- Whether model names match what the provider actually exposes
- Whether text and media models need different Base URLs
- Whether API format or service type needs explicit configuration

If the same protocol has multiple instances, such as two OpenAI-compatible gateways, keep clear instance names and use `providerId` in agent-specific settings to target the intended instance.

:::tip Token Plan Key
Some providers distinguish pay-as-you-go API keys and Token Plan keys. The UI warns when a key appears to be configured in the wrong provider type.
:::

## Claude Pro / Max Subscription

Some releases may show a **Claude Subscription** provider in Compute Service. This route sends model requests through Anthropic's official `@anthropic-ai/claude-agent-sdk`; it does not imitate Claude Code by forging request headers.

### Runtime model and how it differs from Claude Code

At the execution boundary, this is a dual-runtime collaboration:

1. The **DesireCore Agent runtime** owns system prompts, memory, skills, tool registration, approvals, delegation, and execution audit.
2. The **Claude Agent SDK runtime** uses the Claude subscription identity for model requests and returns text or `tool_use`.
3. Every `tool_use` is handed back to DesireCore and executed through DesireCore's tools and approval pipeline.

The SDK's bundled tools, skills, plugins, subagents, slash commands, and connectors are not enabled on this route, and the SDK does not execute file, command, or external-service actions for DesireCore. The context, tools, permission boundary, and resulting behavior therefore differ fundamentally from using Claude Code directly.

If you need the full Claude Code programming workflow inside DesireCore, have a **DesireCore Agent invoke the locally installed Claude Code**. Selecting a Claude subscription model does not place the conversation inside Claude Code.

### Connecting

The UI first detects a local Claude Code login. Depending on release and platform, advanced options may also offer in-app login or a `claude setup-token` paste. When a credential expires, refresh fails, or the connection is removed, use the re-detect or sign-in action shown in the panel.

### Terms, authorization, and account risk

:::warning Eligibility is governed by Anthropic's rules
Use of the official SDK shows that DesireCore implements this route through an official technical interface. It **does not authorize a third-party product to relay Claude Free, Pro, or Max credentials**. As of this update, Anthropic's [Claude Code legal and compliance guidance](https://code.claude.com/docs/en/legal-and-compliance) directs developers building third-party products to use API-key authentication or a supported cloud provider and says they may not offer Claude.ai login or relay Free, Pro, or Max credentials on users' behalf. The subscription entry should therefore remain release-gated until DesireCore has explicit authorization for this use case. Later availability depends on official authorization, then-current terms, region, account, and DesireCore release policy.
:::

You are responsible for confirming that your subscription use, account type, region, and automation comply with Anthropic's current terms. Rate limits, feature restrictions, credential invalidation, account suspension, or bans arising from subscription use or provider policy are risks borne by the user; DesireCore cannot control Anthropic's account decisions. For stable commercial or organizational access, prefer an Anthropic API key or an explicitly supported cloud authentication method.

## API Key Security

- API-key values are centralized in the local `~/.desirecore/config/secrets.json` file; provider configuration stores reference names instead of values
- On platforms with POSIX permissions, DesireCore tightens the file mode to `0600`. On Windows, actual protection depends on the current OS account, directory ACLs, device locking, and disk encryption
- `secrets.json` is a sensitive path that ordinary Agent file tools cannot read directly. An authorized connection resolves only the required reference at the execution layer and writes an access audit without the plaintext value
- A key is sent as authentication to its corresponding third-party service only when the user invokes that service. DesireCore official-cloud credentials and external sign-in credentials follow their own authentication flows

:::caution A local file is not a hardware-backed credential vault
`secrets.json` is a permission-protected local credential file, not macOS Keychain, Windows Credential Manager, or a hardware security module. Anyone who controls your OS account, can read the disk, or obtains an inadequately protected backup may still obtain the credentials. Enable disk encryption and do not place this file in Git, cloud-drive sync, or a regular backup.
:::

To change an API key, select the provider instance, enter edit mode, save the new key, and it will replace the old credential. Removing a provider instance removes that configuration; any agent that still references it should be pointed to another provider or default mapping.

Use separate keys for different suppliers or purposes when possible. It makes billing, rate limits, and permission issues easier to trace.

## Default Model Mapping

Default mappings decide which model to use when an agent has no dedicated override. Common purposes include daily chat, reasoning, code, documents, tool use, and media tasks.

When choosing mappings, combine models by role:

- **Low-cost default model**: routine chat, summarization, and lightweight tasks
- **High-quality reasoning model**: complex analysis, planning, code review, and high-risk decision support
- **Tool-use-stable model**: tasks that call files, commands, search, or external services frequently
- **Media model**: image understanding, image generation, voice, video, or music tasks

Default mapping is the global fallback. Agent-level configuration takes precedence when present.

## Agent-Level Model Override

An individual agent can override global defaults in `agent.json`:

```json
{
  "llm": {
    "provider": "anthropic",
    "providerId": "provider-anthropic-001",
    "model": "claude-sonnet-4-5"
  }
}
```

`provider` identifies the protocol or provider type. `providerId` identifies the concrete provider instance. When multiple providers share a protocol or model name, set `providerId` to avoid using the wrong Base URL or API Key.

Migrated or manually maintained configs may still contain a `runtime` field. Use `llm` for agent model configuration. If you edit agent configuration manually, keep `llm.provider`, `llm.providerId`, and `llm.model` aligned.

## Managing Multiple Providers

Multiple providers help with redundancy, cost control, capability coverage, and network adaptation. If several providers share the same model name, DesireCore prefers an explicit `providerId`, then falls back to default mappings and available keys.

When debugging model issues, check in this order:

1. Whether the API key is in the correct provider and key type
2. Whether Base URL and media Base URL match the provider API
3. Whether the model name is still available
4. Whether verification failed because of permission, provider error, or timeout
5. Whether default mapping or agent `providerId` points to the intended provider instance
