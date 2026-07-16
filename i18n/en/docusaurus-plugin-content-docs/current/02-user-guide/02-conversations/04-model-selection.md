---
title: Selecting AI Models
description: Learn how to select and switch between different AI models in DesireCore
keywords: [AI model, model selection, Provider, API Key, model switching, default model]
---

# Selecting AI Models

DesireCore supports connecting to multiple AI model providers (Providers), and you can switch models at any time during a conversation. Different models have different characteristics in capability, speed, and cost, and choosing the right model can give you a better experience.

## Model Selector

The model selector is located in the action button group in the chat header area, displayed as a layers overlay icon.

**Icon Color Meanings:**

| Color | Meaning |
|------|------|
| Gray | Using default model, no manual override |
| Green | Model manually selected, and the model is available |
| Orange | Model manually selected, but the model is currently unavailable (provider disabled/removed, etc.) |

Click the icon to open the model selection dropdown panel.

## Selecting a Model

Models in the dropdown panel are displayed grouped by provider (Provider):

1. **Use Default** — Top option, restores the system default model (no manual specification)
2. **Provider Groups** — Each provider name lists the models available from that provider

Each model entry displays:

- Model display name
- Service type label (such as chat, completion)
- Price information (if available)

Click any model to switch the model used for the current conversation. Selected status is indicated by a green dot.

:::tip Scope
Model selection is a **session-level** temporary override that does not affect other conversations or global default settings. It reverts to default after closing the conversation.
:::

## Thinking Depth

When the selected model declares controllable reasoning or thinking capability, the input area shows **Thinking depth**:

| Option | Behavior | Good for |
|--------|----------|----------|
| **Auto** | Sends no explicit thinking parameter and follows the model or provider default | When you do not know the model's best setting |
| **Off** | Attempts to send the provider-specific disable setting | Simple questions and latency-sensitive work |
| **Minimal / Low / Medium / High / Extra high** | Explicitly enables thinking at a relative depth | Tasks ranging from routine analysis to difficult reasoning, code, and long-running work |

The default is Medium. The effective value is resolved in this order: **current conversation selection -> agent model setting -> global default**. Models without controllable reasoning fall back to Auto and the control is disabled.

Deeper settings generally consume more reasoning budget, take longer, and may increase pay-as-you-go cost or subscription usage. Provider support is not uniform: on/off-only models collapse the depth choices to enabled, models without an extra-high level may fall back to High, and Off is best-effort where the upstream provider does not expose a true disable switch. Use actual output, latency, and provider billing as the final reference.

## Model Unavailable Warning

If a previously selected model is unavailable for the following reasons, an orange warning bar appears at the top of the dropdown panel:

- **Provider Disabled** — The model's Provider is turned off in settings
- **Provider Removed** — The Provider has been deleted from the configuration
- **Model Removed** — The model has been removed from the Provider's available list

When a warning appears, it is recommended to reselect an available model or click "Use Default" to restore default settings.

## API Key Not Configured

If a Provider has not configured an API Key, an orange prompt is displayed in the dropdown panel. Models from that Provider are still listed, but may not function properly. Go to "Settings > Compute Services" to configure the corresponding API Key.

## Configuring Default Model

To modify the globally default model:

1. Open "Settings" (gear icon in lower left)
2. Go to "Compute Services" or through the "Compute" entry in the resource manager
3. Set the default model for each service type in "AI Services > Default Mapping"

:::info Local First
DesireCore stores model configuration and API keys locally; key values reside in `~/.desirecore/config/secrets.json`. When you run a request through that provider, its key is sent to the provider as authentication. Protect the OS account, disk, and backups; see [Compute Service Configuration](../10-settings/04-compute-service.md#api-key-security) for the complete boundary.
:::

## Model Selection Recommendations for Common Scenarios

| Scenario | Recommended Choice | Reason |
|------|---------|------|
| Daily Chat | Mid-scale models | Fast response, low cost |
| Complex Reasoning / Long Text Analysis | Flagship models (e.g., Claude Opus, GPT-4o) | Strong reasoning ability |
| Code Assistance | Code-optimized models (e.g., Claude Sonnet, DeepSeek Coder) | Outstanding programming ability |
| Quick Q&A | Lightweight models (e.g., Haiku, GPT-4o-mini) | Fast, suitable for simple tasks |

## Next Steps

- Learn about [Chat History](./05-chat-history.md) functionality
- Check [Managing Conversations](./06-managing-conversations.md) to understand conversation organization
