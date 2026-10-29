---
title: Worker records
description: List temporary Workers under a parent Run and page through their projected public records.
slug: /api/subagent-records
sidebar_position: 13
last-reviewed: 2026-10-29
keywords: [API, Worker, subagents, transcript, pagination]
---

# Worker records

Read the temporary Workers spawned by a parent Run, including task summaries and recorded fragments. A Worker **has no independent Run**: use the parent Run ID and the returned `workerId`. For an independently delegated Run, use [Session history and messages](./08-session-history-and-messages.md).

Complete [connection and authentication](./01-connection-and-auth.md) and supply the instance owner's `X-Agent-Service-Token`. Only the parent Run's owner can read these records; a foreign parent and a missing parent both return `404`. Records may contain task inputs, thinking, ordinary tool parameters and business content. Keep them private as conversation data.

| Purpose | Method and path |
|---|---|
| List Workers under a parent Run | `GET /api/runs/:id/workers` |
| Page one Worker's records | `GET /api/runs/:id/workers/:workerId/transcript` |

## Worker list {#worker-list}

### `GET /api/runs/:id/workers`

Use an authorized parent Run ID. No pagination parameters. The response is `{run_id, workers}`, sorted by `startedAt` ascending. A parent without Workers returns an empty array.

```bash
curl --silent --show-error \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  "${BASE_URL}/api/runs/${PARENT_RUN_ID}/workers"
```

```json
{"run_id":"parent-run","workers":[]}
```

Each item contains at least `workerId`, `startedAt` and `status`. Optional fields include `kind`, `agentType`, `preset`, `task`, `callerAgentId`, `sessionId`, `endedAt`, `summary`, `error`, `entryCount`, `bytes`, `truncated` and `routeDecision`. Display the observed fields without turning absence into success.

`sessionId` identifies the Worker's runtime child session, not another Run. Counts and byte summaries do not replace transcript reads or verification of business results.

## Worker status {#worker-status}

| Status | Meaning |
|---|---|
| `running` | Still observed as executing |
| `completed` | The Worker ended normally; verify its delivery separately |
| `failed` | Worker failed |
| `detached` | Synchronous waiting ended; execution may continue in the background |
| `stopped` | Explicitly stopped |
| `aborted` | Aborted with its parent execution |
| `interrupted` | No normal close was recorded, and parent/instance lifecycle indicates interruption |

Status is derived on read: a leftover `running` becomes `interrupted` when its parent is no longer running; a `detached` record from before service restart also becomes `interrupted`. Existing terminal states retain their meaning. Transcript status can be `unknown` when no usable Worker index exists; this is not completion. Preserve unfamiliar future values without automatically continuing work.

## Page transcript records {#worker-transcript}

### `GET /api/runs/:id/workers/:workerId/transcript`

| Query parameter | Rule |
|---|---|
| `offset` | Position among successfully parsed, valid entries; default `0` |
| `limit` | Default `500`, clamped to `1..2000` |

Use canonical decimal integers. The service uses `parseInt`: invalid offsets become `0`, invalid limits become `500`, and nonpositive limits become `1`. This is not the strict pagination validation used by some other endpoints.

```bash
curl --silent --show-error --get \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  --data-urlencode 'offset=1' --data-urlencode 'limit=1' \
  "${BASE_URL}/api/runs/${PARENT_RUN_ID}/workers/${WORKER_ID}/transcript"
```

```json
{
  "run_id":"parent-run",
  "workerId":"worker-example",
  "status":"unknown",
  "entries":[{"seq":99,"at":1793260800000,"kind":"text","text":"Checking files."}],
  "total":3,"offset":1,"limit":1,"truncated":false,"corruptLines":1
}
```

Here the index is absent while the transcript remains readable, so status is `unknown` and `worker` is omitted. `offset=1` returning `seq=99` illustrates different units. A usable summary adds `worker`, whose status agrees with the top-level status.

### Entry types and continuation

- `route`: public fields of the effective routing decision. `prompt`, `text`, `thinking`: input, aggregated text or process records.
- `tool`: an initially recorded tool call. `tool_patch`: later input, summary or lifecycle fields for the same `toolId`; later fields win. Keep call context across pages instead of treating a patch as a new call.
- `artifact`: a validated file artifact reference; references do not grant file access.
- `truncated`: recording-cap marker. `end`: Worker close facts.

`toolPhase` is separate from Worker `status`: `requested/executing/completed/failed/interrupted/unknown`. Withholding a summary must not discard a failed tool's `isError`.

`total` counts current valid entries, not messages. Continue at the response's `offset + limit`, never at the last `seq + 1` or a folded message count. Invalid JSON/entries are skipped and counted in optional `corruptLines`.

`truncated: true` means recording reached its entry or byte cap; later content, except closing facts, is no longer recorded. It does not mean another page exists or the Worker ended. An existing empty file returns `200` with empty `entries`; an absent file returns `404`. An ended parent does not establish complete records.

There is no snapshot revision or durable tail cursor. Appends, clearing and projection policy changes can affect later reads. Clearing the conversation also clears Worker records. Refresh for current display; these records are not model recovery material or a complete backup.

## Public fields and sensitive results {#record-privacy}

:::info Effective version
`v10.0.189+` (Worker sensitive-field projection and valid-entry pagination).
:::

New records and reads of old records use current tool declarations to project sensitive inputs and results. Sensitive progress text is withheld from early entries. Terminal results may be placeholders while failure facts remain intact. Missing or conflicting call identity causes conservative withholding; a record cannot grant itself an exemption.

Extra replay attributes and external-result references are outside the public fields. Typed embedded image/audio/binary payloads are removed. Ordinary JSON, plain strings and URL/`dc-media://` references can remain; this is not general-purpose sensitive-content detection. Existing files are not rewritten in place.

Worker records and ordinary history have separate shapes and pagination rules. Handle placeholders using the [history read boundary](./08-session-history-and-messages.md#history-result-privacy), without automatically rerunning tools to recover text.

## Runnable example {#workers-example}

Download **[workers.mjs](pathname:///api-examples/workers.mjs)**. Node.js 22+, no npm dependencies:

```bash
export DESIRECORE_URL='https://your-instance.example'
export DESIRECORE_TOKEN='your-existing-owner-token'
node workers.mjs list --run-id parent-run
node workers.mjs transcript --run-id parent-run --worker-id worker-example \
  --limit 500 --all-pages --max-pages 20
```

The example checks instance identity first and reads one page by default. `--all-pages` advances entry windows; a changed total or page cap stops with exit code `2`, leaving explicitly partial output. It prints page envelopes without folding, tailing, restoring execution or retrying automatically.

## Errors

| Response | Action |
|---|---|
| `400` | Use safe parent/Worker IDs returned by the instance; encode each path segment |
| `401` | Check the instance token and trusted user identity |
| `404` | Missing/foreign parent or absent records; older services may lack the route, so check version and support |
| `500` | Keep time and request path for the administrator; remove local paths and business data before sharing errors |
| `503` | Follow service readiness handling; absent records do not imply completion |

See [OpenAPI downloads](./07-openapi.md) for full fields.
