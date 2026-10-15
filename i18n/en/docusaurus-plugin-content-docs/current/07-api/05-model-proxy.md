---
title: Model Protocol Proxy
description: Obtain a local model proxy address and a Provider-bound safe token, call Messages, Chat Completions, and Models, and handle streaming and compatibility limits.
slug: /api/model-proxy
sidebar_position: 5
keywords: [API, Compat Proxy, model proxy, safe token, Provider, Messages, Chat Completions]
---

# Model Protocol Proxy

DesireCore **Compat Proxy** lets local programs call configured model providers using Messages or Chat Completions requests. Callers use a safe token beginning `desirecore_`; the proxy obtains the corresponding provider credential and forwards or converts the request.

This page covers trusted programs on the same machine as the proxy. The default listener is `127.0.0.1` with a dynamically assigned port. Its address and credentials differ from Agent Service `/api` and its instance token. The request body limit is `256 MiB`.

## Obtain the Address, Model, and Safe Token {#proxy-credentials}

1. Configure and verify the provider in [Compute Services](../02-user-guide/10-settings/04-compute-service.md).
2. Ask a trusted Agent in DesireCore to call `InspectModels` and check the exact **Provider ID** and `modelName`. Identically named models can belong to different providers, so use the specific configuration ID.
3. Ask the Agent to call `ComputeCredential` with `action: "list"`, check providers with available credentials, and obtain the current local proxy Base URL. It already includes `/v1`.
4. Call `ComputeCredential` for the chosen provider with `{"action":"get","provider":"<Provider ID>"}`, without `raw: true`. The default result is a revocable `desirecore_` handle.
5. Have the Agent inject the handle into the protected local program configuration you specify, then verify a small request below. Tool cards may show a sensitive-result placeholder, and the Safe Token panel displays only identifying fragments. Neither is a full-token copy interface.

For example, ask:

> Inspect my configured chat models and confirm the Provider ID and modelName. Use ComputeCredential list to obtain the current local proxy Base URL, get a default safe token for the selected provider, inject it into my specified local program configuration, and verify a request that replies only with OK.

If the tool reports that the proxy is not running, restore the service first. If an existing instance's tool output contains no address, ask the administrator for its verified current loopback address. `InspectModels` metadata does not replace the proxy address, and the upstream provider `baseUrl` cannot accept this handle.

| Example variable | Source and meaning |
|---|---|
| `PROXY_BASE_URL` | Current local Base URL from the tool or administrator, already including `/v1`, without a trailing slash |
| `PROXY_TOKEN` | Full safe handle returned by default `ComputeCredential get` |
| Model name | Exact `modelName` from the chosen provider; replace example placeholders |

A safe token binds to the **Provider configuration ID** chosen at issuance. An `x-desirecore-provider-id` header cannot override that binding. If the bound provider does not serve the requested model, the proxy does not fall back to another provider. This binding is not a model-level allowlist, request budget, or automatic expiration policy.

The handle is a usable credential and belongs in protected local configuration. Any program that can reach this local entry point and holds the handle can use its bound provider. The issuing Agent name in a record does not mean every HTTP request reauthenticates that program's identity.

## List Models {#proxy-models}

### `GET /v1/models`

Authenticate with a Bearer token or `x-api-key`. No request body or pagination parameters:

```bash
PROXY_BASE_URL='replace-with-the-returned-local-base-url'
PROXY_TOKEN='replace-with-your-desirecore-safe-token'

curl --silent --show-error \
  --header "Authorization: Bearer ${PROXY_TOKEN}" \
  "${PROXY_BASE_URL}/models"
```

```json
{
  "object": "list",
  "data": [
    {
      "id": "your-model-name",
      "object": "model",
      "created": 1791943200,
      "owned_by": "openai"
    }
  ]
}
```

`id` is the model name. `owned_by` is a provider type, not a Provider configuration ID. `created` is a Unix timestamp generated during listing, not the model's release time.

The current list includes configured models from every enabled provider and **is not filtered to the token's bound provider**. A listed model does not establish that this token can call it or that it is currently available. Calls remain subject to provider binding, configuration, and upstream state. Check your target using the Provider information from `InspectModels`.

## Messages Requests {#proxy-messages}

### `POST /v1/messages`

Use Anthropic Messages format. This example sends text without streaming and sets an output limit of `64`:

```bash
curl --silent --show-error --include --request POST \
  --header "x-api-key: ${PROXY_TOKEN}" \
  --header 'anthropic-version: 2023-06-01' \
  --header 'Content-Type: application/json' \
  --data '{"model":"your-model-name","max_tokens":64,"stream":false,"messages":[{"role":"user","content":"Reply only with OK."}]}' \
  "${PROXY_BASE_URL}/messages"
```

| Field | Purpose |
|---|---|
| `model` | Exact model name from the bound provider |
| `messages` | Messages array; the example contains one user text message |
| `max_tokens` | Messages output limit |
| `system` | Optional system prompt, as a string or protocol-compatible system blocks |
| `stream` | Optional boolean, default `false`; `true` requests SSE |
| `temperature`, `top_p`, `stop_sequences` | Optional generation parameters subject to model constraints |
| `tools`, `tool_choice`, `thinking`, `output_config` | Optional tools and reasoning/output settings, subject to conversion and backend support |

Example nonstreaming response structure:

```json
{
  "id": "msg_example",
  "type": "message",
  "role": "assistant",
  "content": [{ "type": "text", "text": "OK" }],
  "model": "your-model-name",
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": { "input_tokens": 6, "output_tokens": 1 }
}
```

Read `content` and `stop_reason`. For example, `tool_use` means the model requested a tool call, not that the tool ran. Your program must execute permitted tools and submit their results according to the protocol. A stop reason such as `max_tokens` does not establish business completion.

## Chat Completions Requests {#proxy-chat-completions}

### `POST /v1/chat/completions`

Use OpenAI Chat Completions format:

```bash
curl --silent --show-error --include --request POST \
  --header "Authorization: Bearer ${PROXY_TOKEN}" \
  --header 'Content-Type: application/json' \
  --data '{"model":"your-model-name","max_completion_tokens":64,"stream":false,"messages":[{"role":"user","content":"Reply only with OK."}]}' \
  "${PROXY_BASE_URL}/chat/completions"
```

| Field | Purpose |
|---|---|
| `model`, `messages` | Target model and Chat Completions message array |
| `max_completion_tokens` | Optional output limit subject to model and backend constraints |
| `stream`, `stream_options` | Optional streaming settings; usage availability depends on the backend |
| `temperature`, `top_p`, `stop` | Optional generation parameters |
| `tools`, `tool_choice`, `parallel_tool_calls` | Optional function tool definitions and selection; conversion does not execute tools for your program |
| `reasoning_effort`, `response_format` | Optional reasoning/output constraints subject to model and conversion backend support |

```json
{
  "id": "chatcmpl_example",
  "object": "chat.completion",
  "created": 1791943200,
  "model": "your-model-name",
  "choices": [
    {
      "index": 0,
      "message": { "role": "assistant", "content": "OK" },
      "finish_reason": "stop"
    }
  ],
  "usage": { "prompt_tokens": 6, "completion_tokens": 1, "total_tokens": 7 }
}
```

Read `choices[].message`, `finish_reason`, and actual usage fields. Handle finish reasons such as `tool_calls` and `length` separately. Missing usage is not zero consumption.

## Streaming and Protocol Scope {#proxy-streaming}

Set `stream: true` and read with an SSE-capable client; curl can use `--no-buffer`. Messages and Chat Completions return their corresponding protocol streams. The proxy forwards or converts according to the provider's configured API format, so these are not general replacements for complete provider APIs.

Neither HTTP `200` nor the first text fragment establishes normal stream completion. Read the protocol's terminal markers and inspect in-stream errors. On a disconnection, timeout, empty response, or missing termination information, retain partial content and report incomplete execution. Errors can occur after headers are sent, so checking the initial HTTP status is insufficient.

Cross-protocol tools and structured output depend on the converter and backend. Subscription backends can reject unsupported Schemas, tool choices, and parameters. Internal DesireCore tool markers, beta parameters, and complex Schemas are not universally supported external inputs. Start with the small text request here, then verify each additional capability against your backend.

The documented inbound endpoints are `/v1/models`, `/v1/messages`, and `/v1/chat/completions`. There is no inbound `/v1/responses` contract here; a provider using Responses does not imply an identically named proxy endpoint.

## Update and Revoke Tokens {#proxy-token-lifecycle}

Safe handles have no automatic expiry. They can be reused within an execution session and do not become invalid merely because a session ended or the service restarted. The port can change on restart, so obtain the current proxy address again.

Use the compute resource **Safe Token** panel to revoke an entry or invalidate all active handles, then obtain a replacement and update callers. If the panel reports that management is unsupported in this environment, use the administrator's supported desktop management entry point. The panel is neither a token issuer nor a full-handle copy interface.

Revocation affects subsequent authentication and does not guarantee cancellation of requests already forwarded. Disabled providers, removed models, login state, upstream credential refresh, and quota limits can also cause later calls to fail. Diagnose those separately from safe-handle revocation.

## Errors and Eligibility {#proxy-errors}

Authentication failure uses this shape even for Chat Completions requests:

```json
{
  "type": "error",
  "error": {
    "type": "authentication_error",
    "message": "Unauthorized compat-proxy request"
  }
}
```

| Status or condition | Action |
|---|---|
| `401 authentication_error` | Check the local address, handle, and revocation; neither an instance token nor a real provider key substitutes for the safe handle |
| `400 Missing required field: model` | Use the exact model name from the bound provider |
| `400`, bound provider does not serve the model | Check the provider, enablement, and model configuration; the proxy will not switch providers |
| Rejected parameters or tool Schema | Correct according to actual errors and backend compatibility; internal request markers cannot bypass restrictions |
| `413` / `415` | Keep the body within `256 MiB` and use `Content-Type: application/json` |
| Upstream authentication, rate limit, or quota error | Check provider configuration, eligibility, and actual errors, following returned retry conditions |
| `502` / `504` or in-stream error | Check network, upstream response, and timeout; retain incomplete status instead of treating partial text as a complete result |
| Unregistered path | Use an endpoint listed here; valid credentials do not make an unknown path exist |

The proxy accepts `x-api-key` or Bearer authentication. When both are sent, a nonempty `x-api-key` takes precedence. Error formats also differ by Messages, Chat Completions, upstream response, and streaming phase; inspect the actual body.

Existing provider accounts, subscriptions, and cloud compute remain subject to their account, quota, and authorization conditions. A safe handle and protocol conversion grant no new provider eligibility. See [Compute Service Eligibility](../02-user-guide/10-settings/04-compute-service.md) and [Terms of Service](../terms.md).

## Related Reference

- [Connect to an Instance and Authenticate](./01-connection-and-auth.md): Agent Service addresses and credentials.
- [OpenAPI Downloads](./07-openapi.md): separate proxy specification and coverage.
