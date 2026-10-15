---
title: Agent Webhook
description: Create Agent Webhook events, select execution permissions, rotate secrets, trigger events, and observe explicit user deliveries.
slug: /api/agent-webhook
---

# Agent Webhook

An external system can send a configured event to DesireCore so the target Agent processes its content in the background. This is useful for business notifications, monitoring events, and messages from other applications.

Instance owners can create events, select tools, and obtain a dedicated secret through the management API. External services that only send events obtain the configured event details and secret from the administrator.

First use the [authenticated handshake](./01-connection-and-auth.md) and check `capabilities.webhookManagement`. Only an instance reporting `true` supports the management steps below. If the field is missing or `false`, this instance cannot create or change events through these APIs. Existing valid configurations can still use the [trigger request](#request).

## Before calling

| Information | Source and requirements |
| --- | --- |
| `BASE_URL` | The Agent Service address supplied by the administrator; see [Connection and authentication](./01-connection-and-auth.md). The public documentation website is not a service address. |
| `AGENT_ID` | The target Agent ID supplied by the administrator. A display name cannot replace it. Webhooks must be enabled for this Agent. |
| `event` | An existing event name supplied by the administrator, such as `demo.ping`. It must match exactly. |
| `WEBHOOK_SECRET` | The target Agent's dedicated Webhook secret. Store and inject it through the sender's secret management system. Coordinate rotation with the administrator and update the sender. |
| Event behavior | Confirm the expected fields, permitted operations, and result delivery. Trigger requests do not contain tool or file permission settings; actual operations depend on the selected tools and file scope. |

External callers need a configured Webhook secret. A remote instance rejects triggers without one; a local instance without one also cannot be triggered through the external calling method described here. This secret has a different purpose from an instance access token or a model provider's API key. Configure the sender with the dedicated Webhook secret supplied by the administrator.

The sender must be able to reach the instance address. A desktop instance's loopback address is only reachable from the same computer; an external server needs a reachable service address supplied by the administrator. The DesireCore service must remain running.

## Create an event and select execution permissions

The standalone instance owner performs these steps using `X-Agent-Service-Token` from [Connection and authentication](./01-connection-and-auth.md). A Webhook secret grants triggering access, not event management or receipt access. The commands require `curl` and `jq`.

### 1. Read events and available tools

Use the existing instance address, owner token, and target Agent ID. Obtain the Agent ID from the [Agent list](./04-conversations-and-runs.md). The saved management response reports whether a secret exists without returning its value.

```bash
BASE_URL='https://your-instance.example'
AGENT_ID='your-agent-id'
AGENT_SERVICE_TOKEN='replace-with-your-existing-instance-token'
umask 077

curl --fail-with-body --silent --show-error \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  "${BASE_URL}/api/agents/${AGENT_ID}/webhooks" \
  --output webhook-config.json

jq '{enabled,hasSecret,events,availableTools}' webhook-config.json
```

| Response field | Meaning |
| --- | --- |
| `enabled` | Whether the Agent's Webhook endpoint is enabled. |
| `hasSecret` | Whether a secret is configured. Reading does not return its value again. |
| `events` | Each existing event's `event`, `promptTemplate`, `maxTurns`, and `toolIds`. |
| `availableTools` | The `id`, `name`, `riskLevel`, and `requiresConfirmation` of tools currently available for selection. |

Choose the IDs of tools the event needs. `toolIds: []` authorizes no tools. This example selects `SendUserMessage` to deliver the test result to the user's conversation. If it is absent from `availableTools`, adjust the target Agent's tool configuration and read the list again.

Select only tools needed for the event's work. This example needs only `SendUserMessage`. Add tools such as `Write` or `Bash` when the event needs file writing or command execution. These tools can modify configuration files within their effective file scope, including Agent and event configuration in that scope. Tool selection and file scope use the instance's existing permission mechanism; granting write access also requires considering which configurations it can change.

### 2. Save `demo.ping`

The management API accepts the event template, selected tool IDs, and maximum turn count. The service determines the corresponding tools and current file access scope when saving. You do not need to supply tool definitions or permission objects. Execution remains subject to the Agent's current permissions.

| Field | Requirements |
| --- | --- |
| Event name (`:event` in the path) | 1–128 characters. Start with an ASCII letter or digit; remaining characters may be ASCII letters, digits, `.`, `_`, or `-`. `constructor`, `prototype`, and `__proto__` are not allowed. |
| `promptTemplate` | Required nonempty string, at most 32,768 characters. Supports the `{{key}}` fields described below. |
| `toolIds` | Required array of IDs from `availableTools`, without duplicates. Maximum 512 items; an empty array grants no tool permissions. |
| `maxTurns` | Optional integer from 1 to 100; defaults to 5. |

`PUT` creates or replaces the named event and enables the Agent's Webhook endpoint. Replacement updates both the template and tool selection; saving again captures the current file access scope. The request body limit is 128 KiB.

If saving returns `409` with `error: "webhook_configuration_changed"`, the Agent configuration changed during the save, and this event change was not committed. Read events and available tools again with `GET`, confirm the template, tool selection, and current file permissions, then save again.

```bash
SEND_USER_MESSAGE_TOOL_ID="$(jq -er \
  '[.availableTools[] | select(.name == "SendUserMessage")] | if length == 1 then .[0].id else error("SendUserMessage is not available") end' \
  webhook-config.json)"

jq -n --arg tool "${SEND_USER_MESSAGE_TOOL_ID}" \
  --arg prompt 'Received message: {{message}}. Use SendUserMessage to send this received message to the user.' \
  '{promptTemplate:$prompt,toolIds:[$tool],maxTurns:5}' \
  > webhook-event.json

curl --fail-with-body --silent --show-error --request PUT \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  --header 'Content-Type: application/json' \
  --data-binary @webhook-event.json \
  "${BASE_URL}/api/agents/${AGENT_ID}/webhooks/events/demo.ping" \
  --output webhook-write.json
```

A successful save returns `200`:

```json
{
  "success": true,
  "enabled": true,
  "event": "demo.ping",
  "secret": "<generated-webhook-secret>"
}
```

`secret` appears **only when this save generated the initial secret**. Immediately store it through the sender's secret management system. Keep response files containing secrets out of public repositories and logs. When a secret already exists, the response contains only `success`, `enabled`, and `event`.

If the saved secret or its initial response is lost, [rotate the secret](#rotate-the-secret) to obtain a new value. Reading configuration or saving the event again does not retrieve the old secret.

### 3. Trigger and observe delivery

Set `WEBHOOK_SECRET` to the generated or rotated value, use [Send one request](#send-one-request) below to trigger `demo.ping`, and follow [Observe the result](#observe-the-result) to verify user delivery. The Agent needs a working model configuration and must actually call its authorized message tool. Saving the event and receiving the trigger do not replace this verification.

## Pause, delete, and rotate secrets

All management operations below use the instance access token. They change subsequent trigger configuration without stopping background runs that have already been accepted.

| Operation | Request | Successful response |
| --- | --- | --- |
| Pause all events | `PATCH /api/agents/:id/webhooks` with JSON `{"enabled":false}` | `{"success":true,"enabled":false}` |
| Enable existing events | Same path with JSON `{"enabled":true}` | `{"success":true,"enabled":true}`; requires existing events and a secret. |
| Delete one event | `DELETE /api/agents/:id/webhooks/events/:event`, no body | `{"success":true,"enabled":...}`; deleting the last event pauses the endpoint. |

### Rotate the secret

All events for one Agent share a Webhook secret. After rotation, the old secret can no longer authenticate subsequent triggers, and all senders must update it. Existing runs continue processing.

```bash
curl --fail-with-body --silent --show-error --request POST \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  "${BASE_URL}/api/agents/${AGENT_ID}/webhooks/secret/rotate" \
  --output webhook-secret.json
```

Send no body. Success returns `200 {"secret":"<new-webhook-secret>"}`. Save the new value in the sender's secret management configuration. If the rotation response is lost, configuration reads cannot retrieve the secret; rotate again and update all senders.

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

This example uses `demo.ping` created above, or an event with the same name already configured by the administrator, with `payload.message`. Replace the instance address and Agent ID, and set `WEBHOOK_SECRET` through the sender's secret management system. Update the JSON body if your event name or fields differ.

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

The instance owner can also read durable delivery records:

```bash
curl --fail-with-body --silent --show-error \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  "${BASE_URL}/api/agents/${AGENT_ID}/schedule-messages?limit=20&offset=0"
```

The response is `{"items":[...],"total":...,"limit":20,"offset":0}`. Webhook deliveries have `origin: "webhook"` and the event name in `displayName`; the message is usually in `delivery.message` and attachment references in `delivery.attachments`. A delivery degraded to plain text uses `text`. Only records readable by the current identity are returned. `limit` defaults to 50 and has a maximum of 200; `offset` starts at 0.

This is the Agent's delivery list, not the terminal status of a specific trigger. Repeated calls to the same event may have interleaved records, and an empty list does not establish execution failure. To identify business events, include the sender's business identifier in the agreed payload and delivered message. This does not add deduplication or a unique Run lookup to the trigger endpoint.

If the event provides no user delivery, the caller described here receives only the `accepted` receipt feedback; the administrator needs to inspect logs for execution details. This endpoint provides no way to query completion or a final result for this specific request. To investigate a failure or timeout, give the instance administrator the target Agent ID, event name, sending time, and HTTP response so they can inspect service logs. Keep the secret out of troubleshooting records.

If your application needs a unique execution identifier for every call, terminal status polling, or a result callback, first confirm an appropriate integration method with the administrator.

## Duplicate calls and timeouts

This endpoint has no idempotency key or request deduplication. Sending the same request twice may execute it twice. Including a business event ID in `payload` does not automatically enable deduplication.

If the sender times out or disconnects, receipt may be unknown: the service may already have received the event and started processing it. Save the sending time, event name, and any available response, then check what happened. For events that perform external actions, do not resend unconditionally just because no response arrived.

Background processing has its own execution timeout controls. Failure or timeout can occur after successful receipt. Increasing the sender's HTTP timeout does not make this asynchronous endpoint return a final result.

## Management errors

Management errors use stable identifiers in `error`. Field validation failures may also return `details`.

| HTTP status | `error` | Action |
| --- | --- | --- |
| `400` | `invalid_webhook_management_request` | Check required fields, types, and limits. Send no body when rotating a secret. |
| `400` | `invalid_webhook_event` | Use a name matching the event naming rules. |
| `400` | `webhook_tool_unavailable` | Read `availableTools` again and choose exact IDs that remain available. |
| `400` | `webhook_events_required` | Save an event and confirm that a secret exists before enabling. |
| `400` | `invalid_agent_id` | Check the target Agent ID. |
| `401` / `403` | Authentication/governance rejection, or `webhook_owner_required` | Use the target instance owner's token. A Webhook secret cannot manage events. |
| `404` | `agent_not_found` / `webhook_event_not_found` | Check the target Agent and the event being deleted. |
| `409` | `webhook_configuration_changed` | This save was not committed. Read configuration and available tools again, confirm permissions, and retry the save. |
| `409` | `webhook_configuration_invalid` | Have the administrator repair existing configuration before saving again. |
| `413` | Save body too large | Reduce the entire event save request to no more than 128 KiB. |
| `500` | `webhook_management_failed` | Ask the administrator to inspect service logs and check whether the change took effect before proceeding. |

## Trigger errors

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
