---
title: OpenAPI download
description: Download the OpenAPI definition for published DesireCore HTTP endpoints and select the right instance address and credential.
slug: /api/openapi
sidebar_position: 7
---

# OpenAPI download

Import the JSON file below into an API tool that supports [OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0.html) to inspect parameters, responses, and authentication requirements. Request and response schemas declare the JSON Schema Draft 7 dialect. The file describes only the published HTTP endpoints listed in the table.

**[Download Agent Service OpenAPI JSON](pathname:///openapi/agent-service.json)**

Also available: **[model protocol proxy OpenAPI JSON](pathname:///openapi/compat-proxy.json)** and **[Workflow Service OpenAPI JSON](pathname:///openapi/workflow-service.json)**. Each file uses its own service address and credential.

## Agent Service coverage

| Method and path | Purpose | Guide |
|---|---|---|
| `GET /api/client-handshake` | Verify an existing instance credential and service identity | [Connection and authentication](./01-connection-and-auth.md) |
| `POST /api/webhook/{agent_id}` | Trigger an administrator-configured Agent event | [Agent Webhook](./02-agent-webhook.md) |
| `GET /api/agents/{id}/webhooks` | Read event settings and available Tools | [Agent Webhook](./02-agent-webhook.md) |
| `PUT /api/agents/{id}/webhooks/events/{event}` | Create or replace an event with selected Tools | [Agent Webhook](./02-agent-webhook.md) |
| `PATCH /api/agents/{id}/webhooks` | Enable or pause event triggers | [Agent Webhook](./02-agent-webhook.md) |
| `DELETE /api/agents/{id}/webhooks/events/{event}` | Delete an existing event | [Agent Webhook](./02-agent-webhook.md) |
| `POST /api/agents/{id}/webhooks/secret/rotate` | Rotate the Agent's dedicated Webhook secret | [Agent Webhook](./02-agent-webhook.md) |
| `GET /api/agents/{agentId}/schedule-messages` | Read visible background messages and deliveries | [Agent Webhook](./02-agent-webhook.md) |
| `GET /api/agents` | Read Agent summaries | [Agent list](./04-conversations-and-runs.md#list-agents) |
| `GET /api/agents/{id}/input-config` | Read lightweight input mode and configuration digest | [Input configuration](./04-conversations-and-runs.md#agent-input-config) |
| `GET /api/network/health` | Read upstream network observations | [Instance Diagnostics and Usage](./10-observability.md#network-health) |
| `GET /api/runs/recent-calls` | Read recent tool-call metadata for the current user | [Recent tool calls](./10-observability.md#recent-tool-calls) |
| `GET /api/runs/usage/summary` | Read recorded usage aggregates for the current user | [Recorded usage](./10-observability.md#usage-summary) |
| `GET /api/sessions/messages/all` | Read merged history with revision pagination | [Merged history](./08-session-history-and-messages.md#merged-history) |
| `GET /api/runs` | Read filtered instance Run metadata | [Run list](./04-conversations-and-runs.md#list-runs) |
| `GET /api/runs/{id}` | Read one Run's metadata | [Run details](./04-conversations-and-runs.md#get-run) |
| `GET /api/runs/{id}/runtime-state` | Read the raw Run state | [Run state](./04-conversations-and-runs.md#get-run-runtime-state) |
| `GET /api/runs/{id}/receipt` | Read receipts owned by the trusted user | [Run receipts](./04-conversations-and-runs.md#list-run-receipts) |
| `POST /api/query/start` | Submit a new conversation request | [Conversations and Runs](./04-conversations-and-runs.md) |
| `POST /api/query/follow-up` | Submit another turn to an established session | [Conversations and Runs](./04-conversations-and-runs.md) |
| `POST /api/query/client-requests/lookup` | Reconcile admission by stable request ID | [Conversations and Runs](./04-conversations-and-runs.md) |
| `GET /api/sessions` | List historical sessions | [Session history and messages](./08-session-history-and-messages.md) |
| `GET /api/sessions/{runId}` | Read a full session snapshot | [Session history and messages](./08-session-history-and-messages.md) |
| `GET /api/sessions/{runId}/messages` | Page through durable messages | [Session history and messages](./08-session-history-and-messages.md) |
| `GET /api/sessions/messages/search` | Search an Agent’s historical messages | [Session history and messages](./08-session-history-and-messages.md) |
| `GET /api/conversation/{agentId}/overview` | Read the conversation topic overview | [Session history and messages](./08-session-history-and-messages.md) |
| `GET /api/conversation/{agentId}/matters/{id}/full` | Read a topic’s messages | [Session history and messages](./08-session-history-and-messages.md) |
| `POST /api/attachments` | Upload an attachment and obtain a file reference | [Attachments and media](./09-attachments-and-media.md) |
| `GET /api/attachments/{attachmentId}` | Download an attachment owned by the current user | [Attachments and media](./09-attachments-and-media.md) |
| `POST /api/media/upload` | Upload an image, audio, or video | [Attachments and media](./09-attachments-and-media.md) |
| `POST /api/media/access-urls` | Issue short-lived media access URLs | [Attachments and media](./09-attachments-and-media.md) |
| `GET /media/{filename}` | Read signed media, including byte ranges | [Attachments and media](./09-attachments-and-media.md) |
| `GET /api/taskboards` | List readable task boards | [TaskBoard reads](./11-taskboards.md) |
| `POST /api/taskboards/query` | Query boards and tasks | [TaskBoard reads](./11-taskboards.md) |
| `GET /api/taskboards/{id}` | Read a board projection | [TaskBoard reads](./11-taskboards.md) |
| `GET /api/taskboards/{id}/tasks/{taskId}` | Read one task | [TaskBoard reads](./11-taskboards.md) |
| `GET /api/taskboards/{id}/activity` | Read board handoff evidence | [TaskBoard reads](./11-taskboards.md) |
| `GET /api/taskboards/{id}/tasks/{taskId}/activity` | Page task activity | [TaskBoard reads](./11-taskboards.md) |
| `POST /api/taskboards/session-board/resolve` | Resolve an existing session board | [TaskBoard reads](./11-taskboards.md) |
| `GET /api/s3/connections` | Read configured connection summaries | [S3 object reads](./12-object-storage.md) |
| `GET /api/s3/list` | List stored objects | [S3 object reads](./12-object-storage.md) |
| `GET /api/s3/download` | Download bytes or request an object link | [S3 object reads](./12-object-storage.md) |

Braces identify path parameters to replace, corresponding to colon notation in the endpoint guides. Webhook management requires `capabilities.webhookManagement: true` from the authenticated handshake and the instance owner's credential. Older instances without that capability use administrator-enabled and verified events. Run lists and details use the deployment owner's instance read access; receipt access additionally checks trusted-user ownership.

## Model protocol proxy coverage

| Method and path | Purpose |
|---|---|
| `GET /v1/models` | List models configured under enabled Providers |
| `POST /v1/messages` | Submit a Messages request, optionally with streaming SSE |
| `POST /v1/chat/completions` | Submit a Chat Completions request, optionally with streaming SSE |

Follow [Model protocol proxy](./05-model-proxy.md) to obtain the current loopback Base URL and a Provider-bound safe token. That Base URL already includes `/v1`. Set the imported server to its origin, preserving the actual port, so the paths in the file add `/v1`. `ProxyBearer` uses Bearer and `ProxyApiKey` uses `x-api-key`; select either scheme for an operation.

The model inventory is not filtered by the token's Provider binding. Listing a model does not authorize the token to call it. The file presents the published protocol subset; optional parameters, tools, and structured output still depend on conversion and the target backend. The client must inspect and handle errors within a stream.

## Workflow Service coverage

| Method and path | Purpose |
|---|---|
| `GET /api/workflows` | Read deployed Workflow metadata |
| `POST /api/workflow/webhook` | Trigger a preconfigured Workflow using required query parameter `id` |
| `GET /api/workflow/events` | Watch SSE events using required query parameter `runId` |
| `GET /api/workflow/{id}/runs` | Read visible Run summaries |
| `GET /api/workflow/{id}/runs/{runId}` | Read one Run's details |

Use the Workflow Service address separately supplied by the administrator and the `WorkflowToken` scheme, which sends `X-Workflow-Service-Token`. The default Agent Service reverse proxy does not expose these Workflow paths. See [Workflow integration](./06-workflow-integration.md).

The Workflow file presents response fields from the current implementation and permits additional fields. It does not claim that the HTTP interface applies closed Schema validation to every field. The preconfigured Webhook, event stream, and history reads do not issue `executionGrantId`. The file excludes `/api/workflow/run`, which requires additional execution authorization, and retired definition writes.

## Set the address and credential after import

Replace the example server `https://your-instance.example` with the instance HTTPS address supplied by the administrator. Preserve any nonstandard port. This address excludes `/api` and is separate from the documentation website address. See [Connection and authentication](./01-connection-and-auth.md).

| Authentication scheme in the file | Credential | How to send it |
|---|---|---|
| `InstanceToken` | Existing instance access token | `X-Agent-Service-Token: <instance token>` |
| `WebhookSecret` | Dedicated secret for the target Agent Webhook | `Authorization: Bearer <Webhook secret>` |
| `SignedMediaSignature` | Short-lived signature returned by the media access endpoint | URL query parameter `signature`, together with `expires` |

The table applies to the Agent Service file. Select the scheme required by the operation. Provider API keys let DesireCore connect to model providers; the proxy and Workflow files use their own addresses and authentication schemes.

## Interpret responses correctly

A `200` handshake response verifies the current credential. Individual features also depend on instance configuration, permissions, and actual capabilities.

Webhook `200` with `accepted: true` acknowledges the trigger. The response has no Run ID or final result, and a later background failure does not change the HTTP response. Follow the [Webhook guide](./02-agent-webhook.md) for result delivery, timeouts, and duplicate requests.

Error structures vary by endpoint. Generated client code should preserve the HTTP status and actual response body. Reverse proxies may also return plain text or a webpage; see [Errors and troubleshooting](./03-errors-and-troubleshooting.md).

Socket.IO connections, subscriptions, and asynchronous events require corresponding client logic. The OpenAPI file describes the HTTP portion and does not represent these events as SSE endpoints.

A conversation submission's `202` response also does not prove completion. Connect Socket.IO first and submit its current `socket.id` as `originSocketId`; the HTTP request and socket must identify the same authenticated principal. Stable `clientInstanceId` belongs to Socket authentication data. After a disconnect, follow the reconciliation steps in [Conversations and Runs](./04-conversations-and-runs.md); a Run's `idle` state does not prove that a particular submission succeeded.

The file's `info.version` is the version of this HTTP interface description. It is separate from DesireCore feature effective versions and the handshake's `serverVersion` and `apiProtocolVersion`.

For native media playback, use the complete `/media/{filename}?expires=…&signature=…` URL returned by the issuing endpoint. This read endpoint uses its short-lived signature rather than an instance token. Attachment downloads still require instance authentication. Consult each guide for history, topic, and media access rules.

Runnable observation and merged-history readers are **[observe.mjs](pathname:///api-examples/observe.mjs)** and **[history.mjs](pathname:///api-examples/history.mjs)**. Restart merged-history reads on revision conflicts instead of combining old pages. Usage aggregates are not final provider invoices.

TaskBoard and S3 read examples are available as **[taskboards.mjs](pathname:///api-examples/taskboards.mjs)** and **[s3.mjs](pathname:///api-examples/s3.mjs)**. Follow the corresponding guides for opaque cursors, activity revisions, object continuation tokens and download modes.
