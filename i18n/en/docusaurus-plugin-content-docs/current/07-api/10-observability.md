---
title: Instance Diagnostics and Usage
description: Read upstream network health, recent tool calls and recorded usage, with their identity, freshness and aggregation limits.
slug: /api/observability
sidebar_position: 10
keywords: [API, network health, tool calls, usage, tokens, diagnostics]
---

# Instance Diagnostics and Usage

Deployment owners can read the following observations using their existing instance origin and `X-Agent-Service-Token`. Complete the [connection check](./01-connection-and-auth.md) first, then select the endpoint that answers your question.

| What you need to observe | Endpoint | What it does not prove |
|---|---|---|
| The instance's latest upstream network observation | `GET /api/network/health` | A particular model, tool or request succeeded |
| Recent tool calls belonging to the current user | `GET /api/runs/recent-calls` | Complete audit history or completion of a conversation turn |
| Recorded tokens and cost for the current user | `GET /api/runs/usage/summary` | A final provider invoice or precise local daily accounting |

These requests do not submit conversations or replay tools. Their scopes, observation times and aggregation rules differ; combining them does not prove completion of one request. Follow [request reconciliation](./04-conversations-and-runs.md#request-reconciliation) to correlate submissions and terminal events.

## Upstream network health {#network-health}

### `GET /api/network/health`

No request body or query parameters. Success returns the state object directly:

```bash
curl --silent --show-error \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  "${BASE_URL}/api/network/health"
```

```json
{
  "status": "unknown",
  "reason": "init",
  "since": "2026-10-25T00:00:00.000Z",
  "seq": 0
}
```

| Field | Meaning |
|---|---|
| `status` | `online`: a recent upstream request or probe succeeded; `degraded`: network failures or some providers are unreachable; `offline`: probes or other evidence confirm unreachability; `unknown`: insufficient samples, such as after startup or wake |
| `reason` | `init`, `request_ok`, `probe_ok`, `request_failed`, `probe_failed`, `stream_stall`, `multi_host_dns`, `suspend_resume` |
| `since` | ISO time when the current `status` began; a reason change within the same status need not update it |
| `seq` | Increasing sequence within the current network monitor, used to compare snapshots and late events; not a persistent version across service restarts |
| `scope` | Optional `global` or `provider`, meaningful for abnormal states |
| `affectedProviders` | Optional provider ID array used with `scope: provider` |
| `subcategory` | Optional `dns`, `tls`, `tcp_reset`, `refused`, `unreachable`, `timeout`, `stream_interrupted` for diagnosis |

A connected Socket.IO connection only proves connectivity between your client and the instance, not from the instance to the internet. Do not treat `unknown` as offline; disabled monitoring may remain `unknown`. Observations may become stale without active requests, and `online` does not establish that every provider is available.

### Combining snapshots and live events

Use the existing [authenticated Socket.IO connection](./04-conversations-and-runs.md#submit-conversation) to listen for `network:health`, whose payload matches the HTTP object. Install the listener before fetching the snapshot; within the same monitor, accept the newer `seq` so a late HTTP response cannot overwrite a live update. A new connection does not receive a dedicated initial event automatically; fetch another snapshot after reconnecting.

The sequence may restart when the service restarts. Do not permanently carry the old connection's maximum sequence into a new one. Establish a fresh observation baseline before comparing new updates. This is neither event replay nor a protocol for deciding when execution is safe to retry.

## Recent tool calls {#recent-tool-calls}

### `GET /api/runs/recent-calls`

The service filters associated Runs by the trusted user identity before returning a newest-first overview. Query parameters cannot select another user.

| Query parameter | Rule |
|---|---|
| `limit` | Default `30`; a single positive decimal integer string that converts to a safe integer; no additional common item cap |

There is no `offset`, cursor, `total` or `hasMore`. Empty, negative, fractional, repeated, mixed-text and unsafe values return `400`.

```bash
curl --silent --show-error --get \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  --data-urlencode 'limit=20' \
  "${BASE_URL}/api/runs/recent-calls"
```

```json
{
  "calls": [
    {
      "id": "example-tool-invocation",
      "timestamp": "2026-10-25T00:00:01.000Z",
      "agentId": "your-agent-id",
      "runId": "run-example",
      "toolName": "Read",
      "status": "success",
      "durationMs": 12
    }
  ]
}
```

Each item contains only this metadata, without tool input or output bodies. Preserve `id` as an opaque call identifier. Do not parse it into a Run, receipt or page position; use the separate `runId` to read the Run.

`status` is `success`, `warning` or `error`. Explicit tool status is used when available; older receipts without it may derive the label from the overall receipt outcome. The time may also come from the receipt. These observations do not prove that a tool's side effects completed, were reverted, or that a submission succeeded.

A missing `durationMs` is represented as `0`, not a measured zero duration.

This is a recent overview, not a complete audit export. Reads may use a bounded Run window; without a usable index, only the latest 100 current-user Runs are scanned. Increasing `limit` cannot enumerate all history. Call summaries from retained receipts may remain after clearing chat. Read [execution receipts](./04-conversations-and-runs.md#list-run-receipts) for a particular turn's result.

## Recorded usage {#usage-summary}

### `GET /api/runs/usage/summary`

Returns aggregates for the trusted current user. There is no `userId` identity override parameter.

| Query parameter | Rule |
|---|---|
| `since` | Optional ISO time filtering by **Run start time**, not each receipt's time; invalid values are currently ignored |
| `agentId` | Optional Agent ID filtering associated Runs |
| `timezone` | Optional IANA time zone, such as `UTC` or `Asia/Shanghai`; invalid values retain UTC dates rather than returning a parameter error |

```bash
curl --silent --show-error --get \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  --data-urlencode 'since=2026-10-01T00:00:00Z' \
  --data-urlencode "agentId=${AGENT_ID}" \
  --data-urlencode 'timezone=UTC' \
  "${BASE_URL}/api/runs/usage/summary"
```

```json
{
  "total": {
    "inputTokens": 0,
    "outputTokens": 0,
    "cacheReadTokens": 0,
    "cacheWriteTokens": 0,
    "costUsd": 0,
    "queryCount": 0
  },
  "byModel": [],
  "byDate": [],
  "byAgent": []
}
```

The example shows an empty aggregate without usage records. Each `byModel` item adds `provider` and `model`, each `byDate` item adds `date`, and each `byAgent` item adds `agentId`. All carry the same six aggregate fields as `total`.

- `inputTokens` excludes cached input; cache reads and writes have separate fields.
- `queryCount` counts receipt queries with usage records, not Runs, all submissions or tool calls.
- `costUsd` is the recorded dollar cost, not a guarantee of the provider's final charge. Missing usage records do not establish zero consumption.
- `byDate` starts with UTC date buckets. A requested time zone maps each bucket using UTC midday instead of regrouping individual events; it is unsuitable for precise local daily accounting.
- Filtered or fallback reads may cover at most the latest 1000 current-user Runs. Cleared Runs may retain usage. This is not an unlimited invoice history.
- Responses may be cached for about 30 seconds. Reads do not issue model requests, but may trigger background index rebuilding on the service.

## Runnable read example {#observe-example}

Download **[observe.mjs](pathname:///api-examples/observe.mjs)** and use Node.js 22 or later. No npm packages are required:

```bash
export DESIRECORE_URL='https://your-instance.example'
export DESIRECORE_TOKEN='your-existing-owner-token'
export DESIRECORE_AGENT_ID='your-agent-id'

node observe.mjs input-config
node observe.mjs network
node observe.mjs recent-calls --limit 20
node observe.mjs usage --agent-id your-agent-id --timezone UTC
```

The example verifies the handshake, reads one endpoint and emits `{kind, instanceId, data}`. It does not poll, retry automatically or execute work based on observations. Configuration, tool names and usage can be private business data; keep output files private. The example rejects malformed dates, time zones and numbers before connecting; service compatibility behavior remains as described in the parameter tables above.

## Common errors

| Response | Action |
|---|---|
| `401` | Check the instance token and current instance identity; a self-reported user ID cannot bypass authentication |
| `400` (recent calls) | Supply one positive decimal safe integer for `limit` |
| `503 service_not_ready` | Wait according to `Retry-After` and repeat the read; do not resubmit work because of this response |
| `500` | Record the endpoint, status and time, then check instance logs; keep tokens and business bodies out of shared logs |
| `200` containing HTML | The origin or proxy may point to a website; repeat the authenticated handshake and verify the service marker |

See [Errors and Troubleshooting](./03-errors-and-troubleshooting.md) for authentication, origin restrictions and response handling.


## Retry compute preparation {#compute-preparation}

### `POST /api/compute/preparation/retry`

A remote/standalone deployment owner can explicitly retry the instance's existing compute preparation after `SERVICE_PREPARATION_FAILED`. Embedded clients require official UI authority. A successful connection handshake does not establish that compute preparation or a model request will succeed.

Send **no query parameters and no request body**, including no empty `{}`. This fixed recovery operation accepts no task name or provider configuration:

```bash
curl --silent --show-error --request POST \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  "${BASE_URL}/api/compute/preparation/retry"
```

Success is `200 {"status":"ready"}`. An in-progress preparation is awaited; concurrent requests share the same attempt, and an already-ready preparation stays ready. A previous failed attempt may start one new attempt. Readiness does not prove upstream connectivity or complete an earlier conversation.

Unexpected parameters return `400 {"error":"COMPUTE_PREPARATION_RETRY_PARAMETERS_NOT_ALLOWED"}`. Preparation failure returns `503 {"error":"SERVICE_PREPARATION_FAILED"}`. Authentication and management-source failures can return `401` or `403 renderer_origin_required`.

A timeout leaves preparation outcome unknown. Inspect the instance before manually retrying; do not replay the original conversation or business request. This administrator command is explicit in the example:

```bash
node observe.mjs compute-retry --timeout-ms 60000
```
