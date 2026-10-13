---
title: Errors and Troubleshooting
description: Distinguish connection, authentication, request validation, and background execution failures when connecting to standalone instances and calling Agent Webhooks.
slug: /api/errors-and-troubleshooting
sidebar_position: 3
keywords: [API, errors, troubleshooting, Webhook, 401, 403, 503]
---

# Errors and Troubleshooting

When a call fails, check its HTTP status, `Content-Type`, and response body first. Instance authentication, startup status, Webhook handling, and reverse proxies use different error formats. Preserve the actual response instead of assuming that every error has the same `code` field.

## Connection Failures or HTML Responses

| Symptom | What to check and do |
|---|---|
| DNS failure, connection refused, or timeout | Confirm the public HTTPS address and actual port; check the instance process, network, and reverse proxy |
| TLS certificate verification failure | Check the domain and certificate trust chain; the calling environment must trust local test certificates |
| `200` with an HTML body | Check the address and path. Request `${BASE_URL}/api/client-handshake` and confirm that the JSON `service` is `desirecore-agent-service` |
| HTML from `/health` on the public address | The default standalone deployment does not expose `/health` as an external API; use the authenticated handshake |
| `404` from an ordinary API request | Check the method, path, and deployment's supported scope; use the public address and avoid connecting to another internal listener |

Opening an instance page in a browser and requesting its API with curl check different things. Even when the page loads, API calls can fail because of proxy configuration, credentials, or service startup status.

## Instance Authentication and Startup Errors

These errors apply to the authenticated handshake in [Connect to an Instance and Authenticate](./01-connection-and-auth.md).

| HTTP status | Identifier in the body | Meaning and action |
|---|---|---|
| `401` | `error: "unauthorized"` | `X-Agent-Service-Token` is missing or invalid. Confirm that the token belongs to the target instance and that the caller is not using a value from before token rotation |
| `403` | `error: "origin_not_allowed"` | The deployment does not allow the calling page's origin. Have the deployment owner check the exact origin in `AGENT_SERVICE_CORS_ORIGIN`; an allowed origin does not replace a token |
| `503` | `code: "service_not_ready"` | The service is starting. Wait as directed by `Retry-After`, then retry the read-only handshake; inspect startup logs if the failure persists |
| `503` | `error: "instance_token_uninitialized"` | The instance access token is not initialized. The deployment owner should check `AGENT_SERVICE_TOKEN` in the startup configuration; normal standalone startup requires it |
| `500` | Message indicating that the instance identity file cannot be read | The deployment owner should check data directory permissions and structure; preserve existing instance data and do not attempt recovery by deleting its identity file |

Example instance authentication failure:

```json
{
  "error": "unauthorized",
  "message": "缺少或无效的实例访问令牌，请在请求头 X-Agent-Service-Token 中提供。"
}
```

Example startup response:

```json
{
  "status": "starting",
  "service": "agent-service",
  "code": "service_not_ready"
}
```

Treat startup and authentication separately. An invalid token can return `401` even while the service is starting. Wait for startup only when the response is `service_not_ready`. Browser cross-origin restrictions can also prevent a script from reading the response; inspect the request and preflight result in the browser's network panel.

## Webhook Request Errors

An external [Agent Webhook](./02-agent-webhook.md) uses the target Agent's secret supplied by an administrator in `Authorization: Bearer <secret>`. The administrator must have configured and verified the event before you call it. Do not use a provider API key or another Agent's secret for this endpoint.

| HTTP status | `error` in the body or symptom | Meaning and action |
|---|---|---|
| `401` | `Invalid webhook secret` | The secret is missing or does not match. Check the target Agent and `Authorization`, preserving the exact capitalization and spacing of `Bearer <secret>` |
| `403` | `webhook_secret_required` | The target standalone Webhook has no valid configured secret. Ask the administrator to check and configure the Agent's dedicated secret |
| `404` | `Agent not found` | The specified Agent does not exist; check the target instance and Agent ID |
| `404` | `Webhook not enabled for this agent` | The target Agent's Webhook is disabled; ask the administrator to confirm that the event is enabled before sending |
| `400` | `Invalid request body` | The request does not meet field requirements. Correct it using the response `details` and endpoint parameter documentation |
| `400` | `Unknown event type: ...` | No configuration matches `event`; use the exact event name delivered by the administrator |
| `400` | JSON parsing error | Fix JSON syntax, such as comments, trailing commas, or unescaped characters |
| `413` | Request body too large | The Webhook body exceeds `1 MiB`; reduce the entire encoded body in bytes, including `event` and `payload` |
| `415` | Unsupported request media type | Use `Content-Type: application/json` as shown in the endpoint example |
| `500` | `Failed to parse agent.json` | The target Agent configuration cannot be parsed; ask the administrator to correct its JSON errors |

Example Webhook secret validation error:

```json
{
  "error": "Invalid webhook secret"
}
```

For a field validation failure, the `Invalid request body` response includes validation information in `details`. The request framework handles JSON parsing, media types, and body size limits, so those errors may use fields such as `statusCode`, `error`, and `message`. A reverse proxy may also return plain text or HTML. Check the response type before reading its body.

## A Trigger Was Accepted but No Result Arrived

A Webhook `200` with `accepted: true` means the trigger was accepted. The response contains no Run ID or final result. Background execution failures do not change that HTTP response.

Ask the administrator to check that the event matched the intended prompt, has execution permissions, and includes a result delivery step. An ordinary final answer does not automatically appear in chat or become the Webhook HTTP response. For chat notifications, the administrator must arrange and authorize a message delivery step; successfully delivered messages appear in the target Agent's conversation. Receiving no message does not establish whether the event ran, failed, or completed. See [Agent Webhook](./02-agent-webhook.md) for observation methods. The administrator must inspect instance execution logs to investigate background failures.

After a timeout or lost connection, the sender may not know whether the service accepted the request. The current Webhook has no public idempotency key, so resending can start another execution. Check delivered messages and ask the administrator to check execution logs before deciding to resend; do not configure unconditional automatic retries. A read-only handshake can be retried as directed by its startup `Retry-After` header.

## Collect Troubleshooting Information

When requesting help, record the request time, HTTP method and path, status, response type, redacted body, the handshake's `serverVersion` and `instanceId`, and whether the issue appeared after updating a token. Remove instance tokens, Webhook secrets, provider API keys, and business data before sharing log excerpts.
