---
title: API Key and Connection Issues
description: Resolve common issues related to API Key configuration, model connections, and providers
keywords: [API Key, connection timeout, model unavailable, Provider, vendor, configuration]
---

# API Key and Connection Issues

## Where do I configure the API Key?

1. Open "Settings" (gear icon at bottom left)
2. Go to the "AI Services" page
3. Find the corresponding Provider in the provider list (e.g., OpenAI, Anthropic, etc.)
4. Click configure and enter your API Key

Or access the AI Services management page through the "AI Services" entry in the resource manager.

## "API Key invalid" prompt?

1. **Check if the Key is complete** — Ensure you haven't missed characters at the beginning or end when copying the API Key
2. **Check if the Key has expired** — Some provider keys have expiration dates; confirm on the provider's website
3. **Check account balance** — If the provider account balance is insufficient, the key may be suspended
4. **Confirm Key permissions** — Ensure the key has permission to call the corresponding model

## Connection timeout?

If requests to the model API frequently time out:

1. **Check network connection** — Ensure you can normally access the corresponding provider's website
2. **Check proxy settings** — If you use a proxy, ensure it's configured correctly and allows access to API endpoints
3. **Try changing endpoints** — Some providers have multiple API endpoints (e.g., different regions for OpenAI), which can be modified in Provider configuration
4. **Reduce request frequency** — If sending large numbers of requests in a short time, you may trigger the provider's rate limit

## A model shows "unavailable"?

Common reasons for model unavailability:

| Reason | Solution |
|------|---------|
| Provider not enabled | Enable the corresponding Provider on the AI Services page |
| Provider deleted | Re-add the Provider and configure the API Key |
| Model discontinued | The provider may have discontinued the model; select an alternative |
| API Key lacks permission | Confirm your key has access to this model |

## How to add a custom Provider?

DesireCore supports custom Providers compatible with the OpenAI API format (such as locally deployed Ollama):

1. Click add provider on the AI Services page
2. Select "Custom (OpenAI compatible)"
3. Fill in the API endpoint address (e.g., `http://localhost:11434/v1`)
4. Configure authentication information (if needed)

:::tip Local Models
If you're running Ollama or other OpenAI API-compatible model services locally, you can add them directly as custom Providers without an API Key.
:::

## Will API calls incur charges?

DesireCore itself is free, but fees for calling AI model APIs are charged by the corresponding provider. Costs depend on:

- The model you choose (different models have different prices)
- Message length (billed by Token)
- Conversation context length

You can view reference prices for each model in the model selector. It's recommended to set usage budgets and alerts on the provider's website.

## Multiple Providers configured with similar models, which one is used?

DesireCore uses the following priority:

1. Manually selected model in conversation (highest priority)
2. Model specified in global default mapping
3. Default model in the first available Provider

## How to verify if the API Key is configured correctly?

After configuring the API Key, the system will automatically perform connectivity verification. The verification result will be displayed on the Provider card:

- Green status — Connection successful
- Red/Orange status — Connection failed or key invalid
