---
title: Workflow Integration
description: Use a separate Workflow Service address and access token to trigger administrator-preconfigured workflows and observe events and execution history.
slug: /api/workflow-integration
sidebar_position: 6
keywords: [API, Workflow Service, workflow, Webhook, SSE, execution history, authorization]
---

# Workflow Integration

Trusted deployment owners or administrator clients can trigger an existing workflow through **standalone Workflow Service**, then use its returned Run ID to observe events and read history. This page covers global workflows that the administrator has deployed, verified, and approved for the Webhook entry point. It grants no authority to execute arbitrary workflows or user resources.

## Obtain the Separate Address and Credential {#workflow-connection}

| Information | Where to obtain it |
|---|---|
| `WORKFLOW_URL` | Workflow Service address supplied by the administrator. Use its actual listener for local calls or a separately configured HTTPS address for remote calls |
| `WORKFLOW_SERVICE_TOKEN` | `WORKFLOW_SERVICE_TOKEN` in the standalone workflow process startup configuration; when not set separately, the deployment may use its configured `AGENT_SERVICE_TOKEN`, which the administrator must confirm |
| `WORKFLOW_ID` | An existing global workflow ID supplied by the administrator, verifiable through the list below; a display name cannot replace it |
| Parameter contract | Administrator-defined inputs, operations, and outcomes; first verify access with a test workflow that has no external side effects |

The workflow service binds to loopback by default. Obtain its actual port from startup readiness information or the administrator. Its address and request header differ from Agent Service. Even if a deployment reuses the same token value, send `X-Workflow-Service-Token`.

The default Agent Service container deployment provides no public workflow service entry point, and its reverse proxy rejects `/api/workflow/*`. Adding a workflow path to an Agent Service URL does not make it available. The administrator must supply a separately reachable Workflow Service address.

For the standalone access described here, every business request below, including SSE, needs a valid `X-Workflow-Service-Token`. This is a service access credential, not separate execution authority for a user, task, or workflow. Run and workflow IDs do not replace credentials or resource permission checks.

## Check the Workflow to Trigger {#list-workflows}

### `GET /api/workflows`

No request body or pagination parameters. Returns `{ "workflows": [...] }` with these item fields:

| Field | Meaning |
|---|---|
| `id`, `name`, `description`, `creator` | Workflow ID, display name, description, and creator description |
| `nodeCount` | Number of nodes in the definition |
| `dslPath` | Service-managed definition path, not a file on the caller's computer or an access credential |
| `lastRun` | Optional compressed last-run summary with `status` and `taskBoardBound`, possibly completion time and duration |

```bash
WORKFLOW_URL='https://workflow.example.com'
WORKFLOW_SERVICE_TOKEN='replace-with-the-configured-workflow-service-token'
WORKFLOW_ID='your-workflow-id'

curl --silent --show-error \
  --header "X-Workflow-Service-Token: ${WORKFLOW_SERVICE_TOKEN}" \
  "${WORKFLOW_URL}/api/workflows"
```

Use discovery to check the definition supplied by the administrator. It does not authorize every workflow to run, and unparseable definitions may be absent from the list.

## Trigger a Preconfigured Workflow {#trigger-workflow-webhook}

### `POST /api/workflow/webhook?id=...`

| Item | Contract |
|---|---|
| Query parameter `id` | Required ID of an existing global workflow |
| Headers | `X-Workflow-Service-Token` and `Content-Type: application/json` |
| Request body | This example uses a JSON object as workflow parameters; omission is treated as an empty object |
| Success | `200` with `runId`, `workflowId`, and `status: "started"` |

This example assumes the administrator has defined a `name` input for the workflow. Replace fields according to its input contract:

```bash
curl --silent --show-error --include --request POST \
  --header "X-Workflow-Service-Token: ${WORKFLOW_SERVICE_TOKEN}" \
  --header 'Content-Type: application/json' \
  --data '{"name":"API"}' \
  "${WORKFLOW_URL}/api/workflow/webhook?id=${WORKFLOW_ID}"
```

```json
{
  "runId": "00000000-0000-4000-8000-000000000010",
  "workflowId": "your-workflow-id",
  "status": "started"
}
```

Save the actual `runId`. `started` means the service received and scheduled the asynchronous execution. Definition parsing, nodes, permissions, or dependencies can still fail later; it does not mean completion.

This workflow Webhook uses the service token and differs from the Bearer secret and event body used by [Agent Webhook](./02-agent-webhook.md). It has no request deduplication or public idempotency key. Putting a business event ID in parameters does not enable deduplication. A lost response may follow execution, so do not resend just to guess its outcome.

## Observe Realtime Events {#workflow-events}

### `GET /api/workflow/events?runId=...`

Send the returned `runId` and service token to receive `text/event-stream`:

```bash
WORKFLOW_RUN_ID='replace-with-the-returned-run-id'

curl --no-buffer --silent --show-error --get \
  --header "X-Workflow-Service-Token: ${WORKFLOW_SERVICE_TOKEN}" \
  --data-urlencode "runId=${WORKFLOW_RUN_ID}" \
  "${WORKFLOW_URL}/api/workflow/events"
```

Each event has an `event:` name and JSON `data:`. Common events include:

| Event | What to observe |
|---|---|
| `workflow:started` | Workflow and Run IDs, name, and total node count |
| `workflow:node_start` | Node ID, type, and optional display name |
| `workflow:node_complete` | Node inputs, outputs, and duration |
| `workflow:node_error` | Node ID and error; continue observing the whole-run outcome |
| `workflow:human_gate` | A human confirmation wait, not completion |
| `workflow:complete` | Run status and any final outputs; inspect `status` |
| `workflow:error` | Execution error, possibly with the failed node |

Use one active subscription per Run. The stream grants access at the service credential boundary for trusted administrator clients. It does not implement arbitrary end-user resource access by Run ID. Native browser `EventSource` cannot directly set this custom authentication header; use a fetch stream that sends headers, and keep tokens out of URLs.

Reconnecting to a Run that already ended in the current service process can return only one `workflow:complete`, whose `status` can also be `failed`. The event name alone does not establish success. Historical executions or realtime context lost after process restart can return `404`; use the history endpoints below.

SSE does not durably replay every event. Disconnection, stream closure, or no events cannot independently establish success. Read state and history by the Run ID, and preserve unknown outcomes when unconfirmed.

## Read Execution History {#workflow-history}

### `GET /api/workflow/:id/runs`

Returns `{ "runs": [...] }`, merging active and persisted executions ordered by `startedAt`, newest first. No pagination parameters. Example key fields of a summary item:

```json
{
  "runs": [
    {
      "runId": "00000000-0000-4000-8000-000000000010",
      "status": "completed",
      "startedAt": "2026-10-14T02:00:00.000Z",
      "nodeCount": 2,
      "completedNodeCount": 2,
      "taskBoardBound": false
    }
  ]
}
```

Summaries can also include `completedAt`, `totalDurationMs`, `error`, and authorized task/execution ownership information. Active executions can temporarily have node counts of `0`, which does not mean their definitions contain no nodes.

### `GET /api/workflow/:id/runs/:runId`

Returns one execution detail object with `workflowId`, `runId`, `status`, `startedAt`, and `taskBoardBound`. Terminal executions can include `completedAt`, `totalDurationMs`, `nodeResults`, `finalOutputs`, and `error`; a human confirmation wait can include `humanGate`.

```bash
curl --silent --show-error \
  --header "X-Workflow-Service-Token: ${WORKFLOW_SERVICE_TOKEN}" \
  "${WORKFLOW_URL}/api/workflow/${WORKFLOW_ID}/runs/${WORKFLOW_RUN_ID}"
```

`running` and `waiting_human` mean execution or pending confirmation. Terminal states are `completed`, `failed`, `cancelled`, and `interrupted`. Evaluate the actual status, error, and outputs. A Workflow `runId` belongs to Workflow Service and cannot be used with Agent Service `/api/runs/:id/receipt`.

### TaskBoard-Associated Records

History lists and details check permissions for associated TaskBoard resources; unreadable task records are not returned as visible results. Task-scoped queries use:

| Query parameter | Condition |
|---|---|
| `boardId` | Required when specifying task scope |
| `workflowBindingId` | Required for task scope and must belong to this workflow and Board/Task |
| `taskId` | Optional; must be nonempty and match the binding when supplied |

These parameters identify and filter resources; they grant no access. Invalid combinations or insufficient permissions can return `403`. Detail outside the requested task scope returns `404`. An empty list can also result from permission filtering or unreadable history, so it does not establish that nothing ran.

## Manual Execution and Definition Write Scope {#workflow-supported-scope}

`POST /api/workflow/run` requires a valid `executionGrantId`, `idempotencyKey`, and the corresponding definition reference or authorized path. A service access token does not replace execution authority. The trigger and read endpoints above do not issue it. Manual execution requires product-supported workflow operations or a separately supplied authorization integration; the quick start here uses a preconfigured Webhook. Do not invent a grant or copy an internal permission object.

The old `POST /api/workflows` definition creation and `PUT /api/workflow/:id` replacement endpoints are retired and return `410`. Maintain definitions through the existing workflow management process. This page only triggers administrator-preconfigured workflows suitable for its Webhook. Use the corresponding product flow for human confirmation; receiving a `human_gate` message is not approval.

## Errors and Recovery {#workflow-errors}

| HTTP status or condition | Meaning and action |
|---|---|
| `401 unauthorized` | Missing or invalid workflow service token; check the dedicated header and address |
| `503 workflow_service_not_initialized` | Workflow access credential is uninitialized; ask the administrator to check startup configuration |
| `503 WORKFLOW_OWNER_FENCED` | The service cannot safely provide the operation; retain the response and ask the administrator to inspect service state, without unconditional trigger replay |
| Trigger `400 id query parameter is required` | Supply the workflow ID from the administrator |
| Trigger `404` | The global workflow is unreadable or missing; check the service and ID |
| Trigger `503 Unable to reserve workflow run` | Execution could not be reserved; inspect the actual response and service state |
| Events `400 runId is required` / `404 Run not found` | Missing Run ID or no realtime execution in this process; check the ID and read history |
| History `403` / `404` | Resource permissions, workflow/Run matching, or task scope do not allow the read; do not bypass ownership checks |
| Failure after successful trigger or SSE disconnection | Receipt is not completion; read history with the actual returned Run ID and retain unknown outcomes when unconfirmed |
| Request format, size, or dependency errors | Preserve the actual status and body, correct the request or investigate dependencies; errors do not share a universal envelope |

Repeating reads updates observations; triggering again creates another execution. If the trigger response is missing, do not attribute the latest execution directly to this request.

## Related Reference

- [Task Orchestration](../04-concepts/10-task-orchestration.md): workflow usage and nodes.
- [OpenAPI Downloads](./07-openapi.md): parameters and response scope for these public operations.
