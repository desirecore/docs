---
title: Integrations and API
description: Connect external programs to a DesireCore instance, verify access, and call a configured Agent Webhook.
slug: /api
sidebar_position: 0
keywords: [API, integration, Webhook, Agent Service, access, authentication]
---

# Integrations and API

Your scripts and services can connect to a DesireCore instance to verify its identity or send events to a configured Webhook for an Agent to handle in the background. Obtain the instance address, credentials, and event details before choosing a guide below.

## Choose an integration

| What you want to do | Requirements | Guide |
|---|---|---|
| Connect your program to an instance | An HTTPS address and instance access token supplied by the deployment administrator | [Connection and Authentication](./01-connection-and-auth.md) |
| Trigger an Agent from an external event | An event enabled and verified by the administrator, plus its Agent ID, event name, and Webhook secret | [Agent Webhook](./02-agent-webhook.md) |
| Let DesireCore call your business service | A service exposed through MCP, or connected through tools and skills | [MCP Server Connections](../02-user-guide/09-capabilities/03-mcp-integration.md) and [Integration Capabilities Overview](../02-user-guide/09-capabilities/06-integrations-overview.md) |

Self-service Webhook creation and runtime permission configuration are currently unavailable. This guide covers calls to an existing valid configuration. Ask your instance administrator for verified event details before connecting.

## Current API reference

| Method and path | Purpose | Meaning of a successful response |
|---|---|---|
| `GET /api/client-handshake` | Verify instance access and read its identity and capabilities | Authentication succeeded and service metadata was returned |
| `POST /api/webhook/:agent_id` | Send a configured event to the target Agent | The trigger was received; background execution has not necessarily completed |

These endpoints use different credentials. Instance reads use `X-Agent-Service-Token`; external Webhooks use `Authorization: Bearer <Webhook secret>` from the corresponding configuration. Model-provider API keys authenticate model requests and cannot replace these instance access credentials.

## Get started

1. Obtain the instance address and credentials for your intended operation from its administrator. Use HTTPS with certificate verification for remote calls.
2. Follow [Connection and Authentication](./01-connection-and-auth.md) to verify instance access, or [Agent Webhook](./02-agent-webhook.md) to verify an event call.
3. Check the actual response and how results are delivered. See [Errors and Troubleshooting](./03-errors-and-troubleshooting.md) for authentication failures, HTML responses, or timeouts.

:::tip Documentation address and instance address
`https://docs.desirecore.com/api` is a documentation page. Use your own instance address as `BASE_URL`, such as `https://agent.example.com`, when making requests. Do not send business requests to the documentation site.
:::
