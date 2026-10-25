---
title: Integration & API
description: Connect an instance, run conversations, configure Agent Webhooks, and use model and workflow services.
slug: /api
sidebar_position: 0
keywords: [API, integration, Webhook, Agent Service, authentication]
---

# Integration & API

Connect your scripts or services to DesireCore using the address and credentials for the service you need. The guides cover connection checks, conversations and results, Agent Webhooks, model protocols, and workflow integration.

## Choose a guide

| Goal | Requirements | Guide |
|---|---|---|
| Connect an instance | Administrator-provided HTTPS address and instance token | [Connection and authentication](./01-connection-and-auth.md) |
| Submit conversations and follow results | Instance owner access, Agent ID, Node.js 22+ for the example | [Conversations and Runs](./04-conversations-and-runs.md) |
| Read history, page through messages, and search | Instance owner access and a known Agent or Run | [Session history and messages](./08-session-history-and-messages.md) |
| Upload attachments, submit file references, or access media | Instance owner access; media playback uses short-lived signed URLs | [Attachments and media](./09-attachments-and-media.md) |
| Trigger an Agent from external events | Enabled event and Agent-level Webhook secret; owner configuration requires the `webhookManagement` capability | [Agent Webhook](./02-agent-webhook.md) |
| Call model protocols through the local proxy | Running local proxy and provider-bound safe token | [Model proxy](./05-model-proxy.md) |
| Trigger an existing workflow | Separate Workflow Service address, service token, and administrator-provided definition | [Workflow integration](./06-workflow-integration.md) |
| Import HTTP contracts into a tool | Select the spec for your service | [OpenAPI downloads](./07-openapi.md) |
| Let DesireCore call your business service | MCP server, tools or skills | [MCP integration](../02-user-guide/09-capabilities/03-mcp-integration.md) and [integration overview](../02-user-guide/09-capabilities/06-integrations-overview.md) |
| Diagnose upstream connectivity and observe recent tool calls and recorded usage | Instance-owner access | [Instance Diagnostics and Usage](./10-observability.md) |
| Read task boards, task details and activity | Instance owner access and the TaskBoard capability | [TaskBoard reads](./11-taskboards.md) |
| List objects or download from configured storage | Instance owner access, Object Storage capability and a configured connection | [S3 object reads](./12-object-storage.md) |

## Credentials and results

Agent Service uses `X-Agent-Service-Token`; external Webhooks use `Authorization: Bearer <Webhook secret>`. Model proxy credentials and Workflow Service tokens have their own scope. A provider API Key does not substitute for an instance credential.

A handshake `200` confirms the authenticated request. Query submission `202` and Webhook `200 accepted` acknowledge admission or receipt; follow the corresponding guide to observe completion and delivery. Conversation events use Socket.IO, while Workflow progress uses SSE.

## Compatibility and stability {#api-compatibility}

Verify the handshake and required capabilities before integrating, then follow each endpoint's status codes, fields, and asynchronous results. A successful connection does not establish every capability. The three services' addresses and credentials are not interchangeable.

- Send requests according to their own Schema. Do not apply one endpoint's extra fields or response wrapper to another.
- Where a response permits extensions, ignore new optional fields you do not use while validating instance identity, required fields, and known states. Treat unknown states and absent fields as unknown rather than silently substituting `idle` or success.
- OpenAPI `info.version` identifies a revision of the interface description. It is neither a compatibility guarantee shared by every service nor an effective client version. Follow each guide and the actual instance response for support conditions.
- History is a display view that may contain privacy placeholders and omit body references. See [history-result read boundaries](./08-session-history-and-messages.md#history-result-privacy). For timeouts, disconnects, and unknown outcomes, follow [admission reconciliation](./04-conversations-and-runs.md#request-reconciliation) instead of creating a new execution immediately.

## Start integrating

1. Obtain the actual service address and its credential. Use verified HTTPS for remote access.
2. Complete the connection check or the selected guide's minimal example.
3. Check the actual response and result delivery. See [errors and troubleshooting](./03-errors-and-troubleshooting.md) for failures.

:::tip Documentation and instance addresses
`https://docs.desirecore.com/api` is a documentation page. Send API requests to your own instance address, such as `https://agent.example.com`.
:::
