---
title: Agent Webhook
description: Trigger an existing Agent event with its dedicated secret and understand asynchronous responses, result visibility, and retry limits.
slug: /api/agent-webhook
---

# Agent Webhook

An external system can send a configured event to DesireCore so the target Agent processes its content in the background. This is useful for business notifications, monitoring events, and messages from other applications.

This reference applies to **events that the instance administrator has already configured and verified**. There are currently no self-service integration steps for creating or changing an event's execution permissions. Before calling, obtain the instance address, target Agent ID, event name, and Webhook secret from the administrator, and agree on how to observe the result.

## Before calling

| Information | Source and requirements |
| --- | --- |
| `BASE_URL` | The Agent Service address supplied by the administrator; see [Connection and authentication](./01-connection-and-auth.md). The public documentation website is not a service address. |
| `AGENT_ID` | The target Agent ID supplied by the administrator. A display name cannot replace it. Webhooks must be enabled for this Agent. |
| `event` | An existing event name supplied by the administrator, such as `demo.ping`. It must match exactly. |
| `WEBHOOK_SECRET` | The target Agent's dedicated Webhook secret. Store and inject it through the sender's secret management system. Coordinate rotation with the administrator and update the sender. |
| Event behavior | Confirm the expected fields, permitted operations, and result delivery. Request content cannot expand the event's or Agent's access to tools and files. |

External callers need a configured Webhook secret. A remote instance rejects triggers without one; a local instance without one also cannot be triggered through the external calling method described here. This secret has a different purpose from an instance access token or a model provider's API key. Configure the sender with the dedicated Webhook secret supplied by the administrator.

The sender must be able to reach the instance address. A desktop instance's loopback address is only reachable from the same computer; an external server needs a reachable service address supplied by the administrator. The DesireCore service must remain running.

## Request

```http
POST /api/webhook/:agent_id
Authorization: Bearer <Webhook secret>
Content-Type: application/json
```

Use the `Bearer ` prefix shown above, immediately followed by the secret. The request body limit is **1 MiB (1,048,576 bytes)** for the entire JSON request.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `event` | string | Yes | An event name already configured for the target Agent. |
| `payload` | object | No | Fields required by the event template. Omission is treated as an empty object. |

Only `event` and `payload` are accepted at the top level. `payload` may contain the JSON fields agreed for the event, but must be an object rather than an array or string.

```json
{
  "event": "demo.ping",
  "payload": {
    "message": "Test event: please confirm receipt."
  }
}
```

Transform a third party's original notification into this structure before sending it. For example, a GitHub push integration must map the event name and payload and add the Bearer secret required here. This endpoint does not directly validate GitHub signature headers.

### Template fields

The administrator's prompt template uses `{{key}}` to read a matching top-level field from `payload`. For example, `Received message: {{message}}` becomes `Received message: Test event: please confirm receipt.` for the request above.

- Strings, numbers, and booleans become text. Objects and arrays become JSON text.
- Missing fields and `null` values leave the original placeholder, such as `{{message}}`, unchanged.
- Nested paths such as `{{user.name}}` are not supported. Put the required value in an agreed top-level field.

Supply the fields required by the event so the Agent does not receive unresolved placeholders.

## Send one request

This example assumes that the administrator has configured `demo.ping` to use `payload.message`. Replace the instance address and Agent ID, and set `WEBHOOK_SECRET` through the sender's secret management system. Update the JSON body if your event name or fields differ.

```bash
BASE_URL='https://your-instance.example'
AGENT_ID='your-agent-id'

curl --include --request POST \
  "${BASE_URL%/}/api/webhook/${AGENT_ID}" \
  --header "Authorization: Bearer ${WEBHOOK_SECRET}" \
  --header 'Content-Type: application/json' \
  --data '{"event":"demo.ping","payload":{"message":"Test event: please confirm receipt."}}'
```

A received event returns `200 OK`:

```json
{
  "accepted": true,
  "agentId": "your-agent-id",
  "event": "demo.ping"
}
```

`accepted: true` means the event was received and background processing follows. It does not establish that a model has started, a tool call succeeded, or the task completed. The response contains no Run ID, request ID, or final answer. A subsequent background failure cannot change the already returned `200` response.

## Observe the result

Before calling, ask the administrator how this event is expected to deliver its result. If the event is authorized to use **SendUserMessage** and calls it during the run, successfully stored messages or attachments appear in the target Agent's conversation in DesireCore connected to the same instance. Reopen that Agent's conversation to load existing deliveries.

An ordinary final model answer is not automatically delivered there. A missing message may mean the event is still running, sent no message, or encountered a permission or delivery failure. It does not establish success or failure. An existing delivery also does not establish that all subsequent operations in that run completed.

If the event provides no user delivery, the caller described here receives only the `accepted` receipt feedback; the administrator needs to inspect logs for execution details. This endpoint provides no way to query completion or a final result for this specific request. To investigate a failure or timeout, give the instance administrator the target Agent ID, event name, sending time, and HTTP response so they can inspect service logs. Keep the secret out of troubleshooting records.

If your application needs a unique execution identifier for every call, terminal status polling, or a result callback, first confirm an appropriate integration method with the administrator.

## Duplicate calls and timeouts

This endpoint has no idempotency key or request deduplication. Sending the same request twice may execute it twice. Including a business event ID in `payload` does not automatically enable deduplication.

If the sender times out or disconnects, receipt may be unknown: the service may already have received the event and started processing it. Save the sending time, event name, and any available response, then check what happened. For events that perform external actions, do not resend unconditionally just because no response arrived.

Background processing has its own execution timeout controls. Failure or timeout can occur after successful receipt. Increasing the sender's HTTP timeout does not make this asynchronous endpoint return a final result.

## Errors and actions

Inspect the HTTP status and the actual `error` field first. Some errors also include `message` or `details`. Do not expect every response to use a fixed `success/data/error` envelope.

| HTTP status | Error or condition | Caller action |
| --- | --- | --- |
| `400` | `Invalid request body`, possibly with validation `details` | Check that the JSON body is an object, `event` is a string, and `payload` is an object. Remove other top-level fields. |
| `400` | `Unknown event type: ...` | Check the supplied event name, capitalization, and target Agent. |
| `400` | Invalid JSON | Correct JSON syntax before resending. |
| `401` | `Invalid webhook secret` | Check `Authorization: Bearer ...` and the current secret. Confirm that the sender has received any secret rotation. |
| `401` | `Invalid embedded instance token` | This local event lacks the secret needed for external calling. Ask the administrator for an event with a configured secret. |
| `403` | `webhook_secret_required` | The target Agent on the remote instance has no valid Webhook secret. Ask the administrator to complete configuration. |
| `404` | `Agent not found` | Check the instance address and target Agent ID. |
| `404` | `Webhook not enabled for this agent` | Ask the administrator to confirm that events are enabled for the target Agent. |
| `413` | Request body too large | Reduce the entire JSON request to no more than 1 MiB, following the event's payload requirements. |
| `415` | Unsupported media type | Use `Content-Type: application/json`. |
| `500` | `Failed to parse agent.json` | Ask the administrator to check the Agent configuration. Repeated sending cannot repair it. |

Reverse proxies and connection failures may produce other errors; see [Errors and troubleshooting](./03-errors-and-troubleshooting.md). Fix requests that were explicitly rejected before sending again. Treat a lost response as an unknown outcome as described above.
