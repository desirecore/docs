---
title: Conversations and Runs
description: Submit and follow up through HTTP and Socket.IO, query Agents and Run receipts, and reconcile unknown admission, retries, and disconnections.
slug: /api/conversations-and-runs
sidebar_position: 4
keywords: [API, Agent, Run, Receipt, conversation, runtime state, pagination]
---

# Conversations and Runs

Deployment owners can query Agents and execution records in their own standalone instance to select a target Agent, observe a known Run, and read execution receipts. See [Connect to an Instance and Authenticate](./01-connection-and-auth.md) for the address and instance token. All read requests below use `X-Agent-Service-Token`.

## Read Scope

The Agent list, Run list, Run details, and runtime state are instance data reads for the instance owner. They do not provide per-user isolation between multiple tenants. Receipt reads additionally match the trusted identity resolved by the server to the Run's user ownership; both a missing Run and a Run belonging to another user return `404`.

Agent IDs, Run IDs, `user_id`, and `conversation_id` identify records; they are not access credentials. Supplying a user ID, knowing a Run ID, or having seen a record elsewhere does not replace authentication and the endpoint's ownership checks.

## List Agents {#list-agents}

### `GET /api/agents`

No request body, pagination, or filter parameters. A successful response is `{ "agents": [...] }`. Items are summaries rather than full Agent configurations.

```bash
curl --silent --show-error \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  "${BASE_URL}/api/agents"
```

Example response structure:

```json
{
  "agents": [
    {
      "id": "your-agent-id",
      "name": "Example Agent",
      "skillsCount": 0,
      "toolsCount": 0,
      "heartbeatEnabled": false,
      "hasGit": false,
      "isCoreAgent": false,
      "status": "idle"
    }
  ]
}
```

| Field | Type and meaning |
|---|---|
| `id`, `name` | Required strings; use `id` for other API calls, not the display name |
| `skillsCount`, `toolsCount` | Required nonnegative numbers; skill and tool counts in the summary |
| `heartbeatEnabled`, `hasGit`, `isCoreAgent` | Required booleans for heartbeat, a Git repository, and core Agent identity |
| `status` | Optional: `online`, `busy`, `idle`, `offline`, `error`, `recovery`, or `shutdown` |
| `metadataError` | Optional: `missing`, `unreadable`, `invalid_json`, or `invalid_shape`; names, descriptions, and counts may be fallback values when present, so ask the administrator to repair configuration |
| `description`, `engine`, `hasRemote`, `syncStatus` | Optional description, engine, upstream repository, and synchronization information |
| `ui`, `avatar`, `avatarImage` | Optional UI and avatar summaries; configured avatar metadata does not establish that its file is usable |
| `unread`, `pinned`, `pinnedAt`, `folded`, `groupOverride`, `nestMembers` | Optional unread information and display preferences for the instance's current user; do not fabricate observed values for absent fields |

## List Runs {#list-runs}

### `GET /api/runs`

Runs are ordered by `started_at`, newest first. Cleared conversation records are excluded by default. Filters apply to all readable records before taking up to `limit` entries. Multiple filters are combined with AND.

| Query parameter | Type | Default and meaning |
|---|---|---|
| `limit` | One decimal positive integer string | Defaults to `50`; must convert to a safe integer, with no additional universal count cap |
| `agent_id` | string | Optional: the Agent that executed the Run |
| `delegated_by` | string | Optional: the delegating Agent, matching `delegation.fromAgentId` |
| `parent_run_id` | string | Optional: the parent delegation Run, matching `delegation.parentRunId` |

This endpoint provides no `offset`, cursor, or `total`. Do not apply another endpoint's pagination fields. Empty, negative, fractional, mixed, repeated, or unsafe integer `limit` values return `400`.

Obtain `AGENT_ID` from the Agent list, then query that Agent's Runs:

```bash
AGENT_ID='your-agent-id'

curl --silent --show-error --get \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  --data-urlencode "agent_id=${AGENT_ID}" \
  --data-urlencode 'limit=20' \
  "${BASE_URL}/api/runs"
```

```json
{
  "runs": [
    {
      "run_id": "00000000-0000-4000-8000-000000000001",
      "user_id": "example-owner",
      "agent_id": "your-agent-id",
      "started_at": "2026-10-14T01:00:00.000Z",
      "status": "idle"
    }
  ]
}
```

Each `runs` item contains the metadata described below. This list does not replay every realtime event or associate completion with a particular Webhook request.

## Read Run Details {#get-run}

### `GET /api/runs/:id`

Use an existing Run ID for `:id`. There is no request body or additional query parameter. Success returns the Run metadata object directly, without a `run` or `data` wrapper.

```bash
RUN_ID='replace-with-an-existing-run-id'

curl --silent --show-error \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  "${BASE_URL}/api/runs/${RUN_ID}"
```

```json
{
  "run_id": "00000000-0000-4000-8000-000000000001",
  "user_id": "example-owner",
  "agent_id": "your-agent-id",
  "started_at": "2026-10-14T01:00:00.000Z",
  "status": "idle"
}
```

| Field | Meaning |
|---|---|
| `run_id`, `user_id`, `agent_id` | Required strings identifying the Run, initiating user, and executing Agent |
| `started_at` | Required ISO 8601 creation time; a Run can be reused across multiple turns |
| `status` | Required: `running`, `idle`, `completed`, or `failed` |
| `conversation_id`, `session_id` | Optional conversation and realtime execution session identifiers; do not confuse them with one submission's request ID |
| `turn_started_at`, `completed_at`, `updatedAt` | Optional current turn start, Run completion, and latest activity times |
| `failure_reason` | Failure reasons include `process_restart`, `timeout`, `stale`, and `error` |
| `interruption_reason`, `interrupted_at` | Optional interruption reason and time; user stops, system suspension, and background timeouts have distinct identifiers |
| `delegation` | Optional delegation lineage, including `fromAgentId` and possibly `parentRunId`, `parentClientRequestId`, and `mode` |
| `background`, `inbound` | Optional current turn identity, for background processing and a message from another Agent respectively |
| `title`, `messageCount`, `archived_at`, `cleared` | Optional title, message count, and history lifecycle information |
| `team_id`, `work_context_id`, `execution_attachment` | Optional execution ownership information; reading these fields grants no resource permissions |

Responses may also include optional context, recovery, and working directory metadata. An absent field means that information is not recorded; do not invent completion times, failure reasons, or ownership.

`idle` means the Run is not currently executing and can await another turn. It does not establish business success; an interrupted Run can also return to `idle`. `completed` and `failed` describe the Run lifecycle. To evaluate a particular submission, associate it with that turn's terminal event and receipt.

Some historical branches can appear in the list while this detail endpoint returns `404`. Use the endpoints below when you need runtime state or receipts, and handle their own read results separately.

## Read Runtime State {#get-run-runtime-state}

### `GET /api/runs/:id/runtime-state`

Returns a persisted Run state snapshot with support for historical branches. `:id` accepts only letters, digits, underscores, and hyphens. A successful response contains exactly three fields:

```bash
curl --silent --show-error \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  "${BASE_URL}/api/runs/${RUN_ID}/runtime-state"
```

```json
{
  "run_id": "00000000-0000-4000-8000-000000000001",
  "agent_id": "your-agent-id",
  "status": "idle"
}
```

`status` accepts only `running`, `idle`, `completed`, and `failed`. An unreadable or unsupported state returns `404`. A stored `running` value is preserved, but this is still a snapshot. It grants no permission to cancel, rewind, or otherwise modify the Run, and the state can change before a subsequent submission.

## Read Execution Receipts {#list-run-receipts}

### `GET /api/runs/:id/receipt`

Receipts contain turn inputs, outputs, tool calls, and outcomes. The endpoint resolves a trusted user from the instance credential; it accepts no `user_id` parameter as a substitute for identity checks. A Run belonging to another user returns `404`, even if another read endpoint returned its metadata.

Without `offset` or `limit`, the response is `{ "run_id": "...", "receipts": [...] }`, with existing receipts in write order. Prefer pagination to bound each read. Providing either pagination parameter enables these rules:

| Query parameter | Default | Effective range and handling |
|---|---|---|
| `offset` | `0` | One nonnegative decimal integer string; skips from the latest receipt backwards, capped at `10000` |
| `limit` | `20` | One positive decimal integer string, capped at `100` |

Both parameters must be valid before and after conversion. Empty, fractional, negative, repeated, mixed, and unsafe integer values return `400`. Response `offset` and `limit` contain the effective values. Receipts within a page remain in write order, so its last item is a newer receipt in that page.

```bash
curl --silent --show-error --get \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  --data-urlencode 'offset=0' \
  --data-urlencode 'limit=20' \
  "${BASE_URL}/api/runs/${RUN_ID}/receipt"
```

```json
{
  "run_id": "00000000-0000-4000-8000-000000000001",
  "receipts": [
    {
      "receipt_id": "example-receipt-id",
      "run_id": "00000000-0000-4000-8000-000000000001",
      "goal": "Reply to the test message",
      "input": "Please say hello.",
      "output": "Hello.",
      "tool_calls": [],
      "outcome": { "status": "success", "auto_completed": true },
      "started_at": "2026-10-14T01:00:00.000Z",
      "completed_at": "2026-10-14T01:00:01.000Z"
    }
  ],
  "total": 1,
  "offset": 0,
  "limit": 20,
  "has_more": false,
  "skipped": 0
}
```

| Field | How to use it |
|---|---|
| `receipt_id` | Stable identifier of one receipt; a Run can have multiple receipts |
| `goal`, `input`, `output`, `tool_calls` | Goal, input, output, and tool calls; these can contain business data |
| `outcome.status` | `success`, `partial`, or `failed`, describing that receipt's outcome |
| `outcome.auto_completed` | Whether completion required no human intervention |
| `started_at`, `completed_at` | That receipt's start and completion times |
| `usage`, `duration_ms`, `interruption_reason` | Optional usage, duration, and interruption information; absence does not establish zero usage or normal completion |
| `total`, `has_more` | Pagination count and whether older records remain; absent without pagination parameters |
| `skipped` | Damaged or oversized records skipped during a paged read, not a business failure count |

Historical records can also be skipped during Schema validation. Thus `receipts.length` can be smaller than the number of records traversed, and `total` is not the array length. Advance to older pages using response `offset + limit`, not `receipts.length`. Stop at the `10000` offset cap to avoid rereading the same page.

Empty receipts, skipped historical entries, or an older last receipt do not independently establish completion of the current turn. Reconcile the target Run, turn timing, and any available turn correlation information. Keep the outcome unknown when evidence is insufficient.

## Read Errors {#read-errors}

| Endpoint or scope | HTTP status and body | Action |
|---|---|---|
| All endpoints | `401`, `error: "unauthorized"` | Check the instance token and target address |
| All endpoints | `403 origin_not_allowed` or `503 service_not_ready` | Follow [Errors and Troubleshooting](./03-errors-and-troubleshooting.md) for origin restrictions or startup waiting |
| Run list and paged receipts | `400`, with `error` starting `Invalid pagination:` | Use one valid decimal integer per parameter |
| Run details | `404`, `error: "Run not found: ..."` | Check the Run ID and detail read scope |
| Runtime state and receipts | `400`, `error: "Invalid run ID"` | Use a safe Run ID returned by the service; do not construct a path |
| Runtime state | `404`, `error: "Run runtime state not found: ..."` | No supported runtime state is readable; do not assume `idle` |
| Receipts | `401`, `error: "无法解析用户身份"` | Ask the administrator to check instance identity configuration |
| Receipts | `404`, `error: "Run not found: ..."` | Missing, unreadable, or differently owned Run; do not bypass ownership checks |
| Read failure | `500` | Save the redacted response and ask the administrator to inspect service logs; use the actual returned error body |

Query parameters do not change execution permissions. Read endpoints can be queried again to update observations. Do not automatically turn a failed read or missing record into a new task submission.

## Start and Continue a Conversation {#submit-conversation}

Submit through HTTP and receive progress and turn termination through Socket.IO. Use an Agent with its model and execution permissions configured. HTTP and Socket.IO must connect to the same instance using an instance token for the same identity.

### Run the Node.js Example {#node-client-example}

[Download the client example](pathname:///api-examples/agent-client.mjs) and save it as `agent-client.mjs`. It demonstrates text submission, sequential follow-ups, persistent request information, reconnection checks, and explicit cancellation. Use **Node.js 22+** and install the dependency in the separate directory containing the example:

```bash
npm init -y
npm install socket.io-client@4.8.4
```

Set your instance address, existing token, and an Agent ID obtained from the list:

```bash
export DESIRECORE_URL='https://agent.example.com'
export DESIRECORE_TOKEN='replace-with-your-existing-instance-token'
export DESIRECORE_AGENT_ID='your-agent-id'

node agent-client.mjs \
  --prompt 'Please say hello.' \
  --follow-up 'Please reply in another language.' \
  --state ./request.json
```

You can repeat `--follow-up`. The example attempts the next turn only after observing explicit completion and confirming through admission lookup that the session belongs to the current service process. An initial call does not overwrite an existing state file; use a new `--state` path for a separate task. The file persists original requests, business text, and correlation information without storing the instance token. Handle it as business data.

The program verifies the handshake, registers event listeners, and connects through Socket.IO. Its path is `/socket.io/` and authentication is `auth: { token, clientInstanceId }`, with the same `token` as the HTTP `X-Agent-Service-Token` header. `clientInstanceId` is a stable 16–128 character identifier containing only letters, digits, `.`, `_`, `:`, and `-`. Authentication binds the client receiving channel; the example does not send an additional subscription message.

### HTTP Submission Fields

`POST /api/query/start` accepts JSON. Its top level and `options` reject undeclared fields. Provide a nonempty `prompt` or valid `mediaRefs`. The text example uses these fields:

| Field | Purpose and example convention |
|---|---|
| `prompt` | User text for this turn; the example sends a nonempty string |
| `options.agentId` | Target Agent ID |
| `options.conversationId` | Conversation scope, saved as a stable value and reused for subsequent requests |
| `clientRequestId` | Stable ID for one submission; preserve it for recovery or bounded replay, and use a new ID for another turn |
| `userMessageId` | Stable user message ID for this turn, saved with the request |
| `requestDigest` | Request content digest beginning `qrd1:`, calculated by the example according to the protocol; it is not an access credential |
| `originSocketId` | Current authenticated `socket.id`; update it after reconnection rather than reusing an old connection ID |

Reliable correlation and recovery need these stable identifiers. See [OpenAPI Downloads](./07-openapi.md) for complete fields and constraints. Adding undeclared permission objects or user identity fields cannot expand authorization.

An admitted new request returns `202`:

```json
{
  "ok": true,
  "clientRequestId": "00000000-0000-4000-8000-000000000002"
}
```

A duplicate admission response can also contain an existing `sessionId`. `202` acknowledges admission; it does not prove that the user message was durably committed, a model executed, or the turn completed. Events such as `query:started` can arrive before the HTTP response. Register listeners before submitting, and correlate both channels by request ID.

`POST /api/query/follow-up` continues a known execution session with a different request shape:

| Field | Purpose and example convention |
|---|---|
| `sessionId` | Reusable execution session ID returned by the service |
| `originSocketId` | Current authenticated Socket.IO connection ID |
| `message.id` | Stable user message ID for this turn |
| `message.role` | `"user"` |
| `message.content` | Turn text |
| `message.timestamp` | User message time as a millisecond timestamp |
| `clientRequestId` | Stable request ID for the new turn |
| `requestDigest` | The turn's `qrd1:` digest calculated and saved by the example |

An admitted follow-up returns `202` with `ok: true`, `sessionId`, and the corresponding `clientRequestId`. Duplicate admission can include `duplicate`. Do not submit the start request's `prompt/options` object as a follow-up.

### Receive Events and Determine Turn Termination {#conversation-events}

| Socket.IO event | Main fields | Action |
|---|---|---|
| `query:started` | `sessionId`, possibly `runId`, `agentId`, `conversationId`, and `clientRequestId` | Save assigned execution identifiers and associate them with the submission |
| `query:followUpAccepted` | `sessionId`, possibly `clientRequestId` | Associate follow-up admission information; it is not completion |
| `query:message` | `sessionId`, `message`, possibly request and conversation identifiers | Observe text, tools, or deliveries; `message` varies by message type |
| `query:complete` | `sessionId`, possibly `clientRequestId`, `terminal`, and `result` | Correlate the request and inspect structured `terminal`; preserve unknown status without terminal information |
| `query:error` | `error`, possibly `code`, request and execution identifiers | Keep associated errors; do not attribute an uncorrelated error to another request |
| `activity:run_status` | `runId`, `status`, possibly `sessionId` | Update Run observations; this is not a single submission's terminal status |

`query:complete.terminal.status: completed` means the turn ended normally. `interrupted` means it was interrupted; inspect available `reason`, `partial`, and `runId` information. Evaluate business success using output and receipts as well. A `result`, an explicit delivery message, or an `idle` Run cannot replace the turn's terminal status.

Without a matching `clientRequestId` or structured `terminal`, the example does not declare that this request succeeded. Its state file retains observed information for reconciliation.

### Distinguish Identifiers {#conversation-identifiers}

| Identifier | Scope and lifetime |
|---|---|
| `clientInstanceId` | Client receiving channel; reused when recovering the same example state |
| `originSocketId` | One Socket.IO connection; changes on reconnection |
| `clientRequestId` | One start or follow-up submission; unchanged for replay, different for each new request |
| `userMessageId` / `message.id` | This turn's user message, at different field locations in start and follow-up |
| `conversationId` | Conversation scope, reusable across turns |
| `sessionId` | Service-assigned execution session; reuse only when the service confirms it remains usable |
| `runId` | Persistent execution record, reusable across turns with separate receipts |
| `instanceId` | Data-space identity from the handshake, used to verify the target instance |
| `serverInstanceId` | Service process generation from admission lookup; changes on restart and is neither a data-space identity nor a credential |

## Unknown Admission, Retries, and Reconnection {#request-reconciliation}

After a timeout, lost response, or disconnection, preserve the original request IDs, digest, and dispatch time. Use read-only admission lookup to observe its status before deciding whether bounded replay is allowed. Do not generate a new request ID just to retry.

### `POST /api/query/client-requests/lookup`

This authenticated, read-only operation does not invoke a model. Its JSON top level and each `requests` item reject undeclared fields:

```json
{
  "agentId": "your-agent-id",
  "conversationId": "your-agent-id",
  "requests": [
    {
      "clientRequestId": "00000000-0000-4000-8000-000000000002",
      "userMessageId": "00000000-0000-4000-8000-000000000003"
    }
  ]
}
```

`agentId` is required and `conversationId` optional. `requests` contains 1–100 items, each with a required `clientRequestId` and optional `userMessageId`. IDs are nonempty strings of at most 256 characters. Success includes `protocolVersion: 1`, `serverInstanceId`, `observedAt`, `autoReplayRetentionMs`, `tombstoneRetentionMs`, and `results`.

| `results[].status` | Meaning and action |
|---|---|
| `committed` | Committed; do not replay. May include `committedAt`, `sessionId`, `committedServerInstance`, and `executionWitness`; it does not establish completion |
| `reserved` | Reserved; wait for a definite outcome rather than sending another concurrent request |
| `absent` | No confirmable record at observation time; consider bounded replay only within the service's protection window, preserving the original IDs and identical request content |
| `unknown` | Cannot be determined reliably; stop automatic replay and keep the outcome unknown while investigating |

`committedServerInstance` is `current`, `previous`, or `unknown`, describing the relationship to the service process generation. `executionWitness` is `user-message`, `none`, or `unknown`, describing observed execution evidence. Neither committed admission nor generation and evidence fields establish business completion.

The example calculates request age using the response protection windows and server `observedAt`, without hardcoding a permanent retry period. Even `absent` does not permit automatic replay outside the window. `CLIENT_REQUEST_BODY_MISMATCH` indicates a content digest mismatch for the same request ID; stop replay and inspect the saved original request. Treat a new task separately from recovery of the original request.

### Resume or Inspect Without Submitting

Resume a saved request:

```bash
node agent-client.mjs --resume ./request.json
```

The example preserves the original IDs and content and updates only `originSocketId` after reconnection. It does not replay committed requests, keeps observing reserved requests, and stops automatic replay for unknown or expired requests. Recovery does not replace an unusable original session with a new start request. The URL and handshake instance identity must match the saved target.

Inspect admission and readable execution records without submitting:

```bash
node agent-client.mjs --recover ./request.json
```

This mode establishes no Socket.IO subscription and sends no start or follow-up. With a known `runId`, it reads runtime state and receipts. With only `sessionId`, it searches for an exact Run match rather than guessing that the latest Run is this execution. These observations cannot replay all missed events or automatically repeat external actions. The outcome remains unknown when this turn's terminal evidence is missing.

Exit codes are `0` for an observed completed turn, `1` for rejection, failure, or interruption, and `2` for an unknown outcome or read-only recovery mode. `--recover` still returns `2` after completing its read-only checks; this does not mean the task was resubmitted or confirmed to have failed.

### Cancel Explicitly

```bash
node agent-client.mjs --cancel ./request.json
```

When no terminal outcome is recorded, cancellation sends Socket.IO `query:abort` with known session, conversation, request, and Agent identifiers. There is no synchronous acknowledgment. Wait for a correlated interrupted terminal in `query:complete`; without confirmation, preserve an unknown outcome. If a terminal outcome is already recorded, the example reports it without sending cancellation again. `--resume`, `--recover`, and `--cancel` are mutually exclusive and cannot be combined with `--prompt` or `--state`. Ctrl+C stops the example client without implicitly cancelling the server task.

### Submission and Recovery Errors

| HTTP status or identifier | Action |
|---|---|
| `400`, invalid submission or lookup fields | Correct the corresponding request shape; lookup returns `client request lookup body does not match schema` |
| `401` / `403` | Check the instance token, page origin, matching HTTP/Socket identity, and target connection; do not alter markers to bypass authentication |
| `409`, `busy: true` and `retryable: true` | The conversation is being cleared; wait for clearing to finish, then retry with the original request ID and content |
| `409 CLIENT_REQUEST_BODY_MISMATCH`, `retryable: false` | The saved ID and request content differ; stop replay and check the original saved request |
| `503`, unavailable connection, request registry, or admission confirmation | Preserve the actual `retryable` and error information and inspect admission first; not every `503` permits direct resubmission |
| Lost response, disconnection, or no correlated terminal | Reconcile through read-only checks first; keep unknown status and stop automatic replay if unconfirmed |

## Related Reference

- [OpenAPI Downloads](./07-openapi.md): public HTTP operations, parameters, and response Schemas.
- [Errors and Troubleshooting](./03-errors-and-troubleshooting.md): connection, authentication, startup, and asynchronous failures.
