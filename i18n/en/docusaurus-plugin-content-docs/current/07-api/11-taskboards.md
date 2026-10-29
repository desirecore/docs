---
title: Reading task boards
description: Query authorized TaskBoards, task details, handoff evidence and paginated activity, and resolve a conversation's default board.
slug: /api/taskboards
sidebar_position: 11
keywords: [API, TaskBoard, tasks, activity, pagination]
---

# Reading task boards

Use the existing instance address and `X-Agent-Service-Token` to integrate task lists, details and activity into your own dashboard. Complete [connection verification](./01-connection-and-auth.md) first. The current user's global TaskBoard capability must be enabled. When disabled, requests return `403 capabilityDisabled`; enable it in the client or contact the instance administrator.

These endpoints use the authenticated user and their actual team permissions. HTTP reads act as that user's human actor. Body fields such as `userId`, `actor` or a claimed team do not grant access. Knowing a Board, Task, Run or Session ID does not expand visibility. Both `POST` endpoints below are queries: they create no board or task and start no Agent execution.

| Purpose | Method and path |
|---|---|
| List visible board summaries | `GET /api/taskboards` |
| Filter and paginate tasks across boards | `POST /api/taskboards/query` |
| Read a board and its visible tasks | `GET /api/taskboards/:id` |
| Read one task by stable ID | `GET /api/taskboards/:id/tasks/:taskId` |
| Read handoff evidence for tasks on a board | `GET /api/taskboards/:id/activity` |
| Paginate one task's activity | `GET /api/taskboards/:id/tasks/:taskId/activity` |
| Resolve a conversation's default board | `POST /api/taskboards/session-board/resolve` |

Use IDs returned by the API, encoding each URL path segment separately. Board revision, Task version, query cursor and activity position serve different purposes and are not interchangeable.

## Data and policy versions {#taskboard-versions}

Response `schemaVersion: 3`, `meta.policy.version`, Board `revision` and Task `version` describe different facts. Current new boards use V5 policies; existing boards retain their saved policy until explicitly upgraded. Policy numbers are not client effective versions. Read the actual policy/capability and current actor action projection instead of selecting actions from a version number alone. A disabled action can report prerequisites such as a required task plan (`taskPlanRequired`); the read DTO does not add a public `TaskItem.plan` field or grant execution authority.

## Board list and details {#boards}

### `GET /api/taskboards`

No query parameters or request body. Returns `{schemaVersion: 3, generatedAt, boards}` containing only visible boards, without pagination. Each board summary contains:

| Field | Meaning |
|---|---|
| `meta` | Board ID, name, `scope`, `policy`, `revision` and timestamps |
| `statusCounts` | `{status, count}` for tasks that are neither archived nor deleted |
| `openCount` | Among those tasks, the number outside the board policy's terminal or hidden categories |
| `archiveAction` | Current user's action snapshot: `enabled`, `archived`, `expectedBoardRevision`, and possibly a `reason` when unavailable |

The list can include archived boards. `openCount: 0` does not mean the board is absent or all historical tasks were deleted. `scope.type` can be `user`, `team`, `agent` or `session`. Aggregate reads omit team boards after access is revoked.

```bash
curl --silent --show-error \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  "${BASE_URL}/api/taskboards"
```

```json
{
  "schemaVersion": 3,
  "generatedAt": "2026-10-25T08:00:00.000Z",
  "boards": []
}
```

### `GET /api/taskboards/:id`

No query parameters or request body. An existing board returns `{schemaVersion: 3, exists: true, meta, tasks, comments, resourceBindings, availableActions, allDone}`, optionally with `fanOutDispatches`.

- `tasks` excludes deleted tasks and can include archived tasks. `comments` contains their current comment projections. Redacted bodies become `[redacted]`, without original body revisions, attachments or Mention content.
- `availableActions` contains `{taskRef, actions}` entries calculated for the current actor. Reading this snapshot grants no authority; later actions must be authorized again. Do not infer actions solely from status, assignee or `ownerUserId`.
- `allDone` means no unarchived, undeleted task remains open. It can be `true` for an empty board and does not prove any external work succeeded.
- `resourceBindings`, `runRefs`, `receiptRefs` and deep links are references, not credentials for related resources. A child task in `fanOutDispatches` does not prove its Agent Run has started.
- `claim.token` is omitted unless the current actor owns that claim. The query endpoint always omits it. Treat read results as private business data.

Direct reads of arbitrary missing or inaccessible Board IDs usually return `403 forbidden`. Some authorized scope aliases for boards not yet created can return `200` with `exists: false`. Handle both cases; missing resources do not uniformly return 404.

## Query tasks across boards {#query}

### `POST /api/taskboards/query`

The body is a JSON object; omitting it is equivalent to `{}`. Only `filter`, `sort`, `pageSize` and `cursor` are accepted. Unknown properties return `400 invalidRequest`.

```json
{
  "filter": {
    "boardIds": ["your-board-id"],
    "statuses": ["pending", "inProgress"],
    "taskArchive": "active"
  },
  "sort": {"field": "updatedAt", "direction": "desc"},
  "pageSize": 50
}
```

| Parameter | Rules |
|---|---|
| `pageSize` | Integer `1..200`; default `50` |
| `sort` | Both `field` and `direction` required. Field: `updatedAt`, `createdAt`, `dueAt`, `priority`, `position` or `subject`; direction: `asc` or `desc`. Default: `updatedAt desc` |
| `cursor` | Opaque string from the previous response, passed unchanged; not an offset or editable JSON |
| `filter` | Optional object combining the filters below |

| Filter | Values and meaning |
|---|---|
| `keyword` | Up to 512 characters; case insensitive match against task ID, subject, description, labels and related references |
| `boardIds` | Up to 256 unique Board IDs; missing/invisible boards are silently omitted. An empty array does not restrict boards |
| `scopeTypes` | `user`, `team`, `agent`, `session` |
| `statuses` | `backlog`, `pending`, `inProgress`, `blocked`, `inReview`, `completed`, `failed`, `canceled`, `deleted`; deleted tasks are excluded from the current visible query |
| `priorities` | `high`, `normal`, `low` |
| `labels` / `labelMatch` | Up to 128 unique labels; `any` (default) or `all` |
| `participantIds` | Up to 256 unique IDs matching assignee, claim actor, reviewer, contributors or watchers |
| `reviewStates` | `notSubmitted`, `awaitingReview`, `accepted`, `changesRequested` |
| `due` | `overdue`, `upcoming`, `none`, `any`; evaluated against the first page's query time, without scheduling work |
| `sourceOwnerTypes` | `automation`, `workflow`, `conversation`, `connector`, `import`, `manual` |
| `integrationTypes` | `automation`, `workflow`, `conversation`, `workdir`, `run` |
| `boardArchive` / `taskArchive` | Independently `active` (default), `archived` or `any` |

Arrays reject duplicate values. An empty result can be:

```json
{
  "schemaVersion": 3,
  "generatedAt": "2026-10-25T08:00:00.000Z",
  "items": [],
  "pageSize": 50,
  "hasMore": false,
  "totalCount": 0,
  "statusCounts": []
}
```

Each actual item contains `board`, `task`, `commentCount`, `deepLink`, `availableActions` and `archiveAction`. `deepLink.route` is an in-app route, not an API path. `totalCount` and `statusCounts` cover all matching results rather than only the current page. Optional `indexGeneration` is diagnostic metadata, not a Board revision or authorization proof.

### Pagination

1. Omit `cursor` on the first request and retain the original filters and sorting.
2. Only when `hasMore: true`, pass `nextCursor` unchanged to the next request with the same filters and sorting. The final page omits `nextCursor`.
3. A cursor used with different filters or sorting returns `400 invalidRequest`. Changed visible data or versions can invalidate it with `409 versionConflict`; discard collected pages and restart from the first page.

Every page checks current access. A cursor grants no cross-user access, lasting snapshot or incremental change log. Do not decode, construct or reuse it across users.

## Single task details {#task-detail}

### `GET /api/taskboards/:id/tasks/:taskId`

No query parameters or request body. An existing task returns `{schemaVersion: 3, exists: true, board, task, comments, resourceBindings, availableActions, archiveAction, deepLink}`. Unlike board details, `availableActions` is directly an array of actions and `comments` includes only this task.

After Board access is authorized, an absent or deleted task returns:

```json
{"schemaVersion": 3, "exists": false}
```

The Board access check can still return `403` first. Do not automatically create a task on `exists: false` or reuse one task's `version` for another.

## Handoff evidence and task activity {#activity}

These paths return different information.

### `GET /api/taskboards/:id/activity`

Returns **handoff evidence** for tasks on the board, not a complete board event stream. Optional query parameter `taskId` restricts it to one task. There are no pagination parameters. Returns `{evidence: [...]}`; each item has `eventId`, `kind: "handoff"`, `taskRef`, `fromActor`, `toActor`, `occurredAt`, and optional `reason`.

```json
{"evidence": []}
```

An empty array can mean no handoff, or that the filtered task is outside the visible set. It does not prove the task has no other activity. Use the single-task endpoint below for comments, state changes and other activity.

### `GET /api/taskboards/:id/tasks/:taskId/activity`

| Query parameter | Rules |
|---|---|
| `pageSize` | Integer `1..100`; default `50`; bounds task event candidates scanned for this page |
| `afterRevision` | Nonnegative safe integer; default `0`; excludes task events at or before this Board revision |
| `throughRevision` | Positive safe integer; omit on the first page to capture the current Board history prefix, then retain the returned value |

`afterRevision > 0` requires `throughRevision`. `afterRevision > throughRevision`, a prefix beyond the current Board revision, or unknown query parameters return `400 invalidRequest`. Send canonical decimal strings rather than relying on coercion details.

```bash
curl --silent --show-error --get \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  --data-urlencode 'pageSize=50' \
  "${BASE_URL}/api/taskboards/${BOARD_ID}/tasks/${TASK_ID}/activity"
```

```json
{
  "schemaVersion": 1,
  "taskRef": {"boardId": "your-board-id", "taskId": "your-task-id"},
  "generatedAt": "2026-10-25T08:00:00.000Z",
  "items": [],
  "page": {"pageSize": 50, "afterRevision": 0, "throughRevision": 12, "nextAfterRevision": null}
}
```

`items.source` distinguishes:

- `taskEvent`: contains `taskEvent`; ordered by ascending Board revision within the page and bounded by `throughRevision`.
- `ownerProjection`: contains `ownerProjection`; a current summary from a related service, returned before task events. It can repeat or change across pages and is not frozen by the history prefix. It is not archived event content.

Use `activityId` to identify repeated display entries. `items.length` can be below `pageSize` or exceed it because of extra summaries. Even an empty page can have a continuation. Only `page.nextAfterRevision: null` means the fixed prefix is exhausted. Otherwise pass that position with the same `throughRevision`. Do not derive the next page from the last timestamp, Task version or item count.

New task events do not expand a captured prefix. To refresh, restart at the first page and capture a new `throughRevision`. The prefix freezes task history, not current permissions or related service summaries. An absent task can return `404 taskNotFound`; the preceding Board check can still return `403`.

## Resolve a conversation's default board {#session-board}

### `POST /api/taskboards/session-board/resolve`

Body limit: 4 KiB. Provide at least `runId` or `sessionId`; no other properties are accepted. IDs must match `^[A-Za-z0-9][A-Za-z0-9._:-]{0,255}$`.

```json
{"runId": "your-run-id", "sessionId": "your-current-session-id"}
```

Prefer the Run ID. The service uses saved session ownership to find sessions belonging to the same Run, so rebuilding a session does not make its board appear lost:

1. Exactly one visible board for the current Session wins, even if archived.
2. Multiple boards for the current Session produce no default.
3. When the current Session has no board, select the most recently updated unarchived board from another Session of the same Run.

`sessionId` only affects current-session priority; that priority is ignored when the service proves it belongs to another Run. With only `sessionId`, the service can resolve its Run. If saved ownership cannot be read, selection may use only the current Session. A caller cannot supply a session list to expand visibility.

Success uses the board detail shape. When no default can be selected, returns `200 {"schemaVersion":3,"exists":false}` without creating a board. This does not establish that the Run is absent, no other board exists, or the conversation has ended.

## Runnable example {#taskboards-example}

Download **[taskboards.mjs](pathname:///api-examples/taskboards.mjs)**. Requires Node.js 22 or later, with no npm packages:

```bash
export DESIRECORE_URL='https://your-instance.example'
export DESIRECORE_TOKEN='your-existing-owner-token'

node taskboards.mjs list
node taskboards.mjs query --filter '{"statuses":["pending","inProgress"]}' --page-size 50
node taskboards.mjs board --board-id your-board-id
node taskboards.mjs task --board-id your-board-id --task-id your-task-id
node taskboards.mjs handoff --board-id your-board-id --task-id your-task-id
node taskboards.mjs activity --board-id your-board-id --task-id your-task-id --page-size 50
node taskboards.mjs resolve --run-id your-run-id
```

After verifying the handshake, the example emits `{kind, instanceId, data}`. `query` and `activity` follow continuations and retain original page envelopes in `data.pages`, up to 100 pages by default; adjust with `--max-pages`. Conflicts or invalid pagination emit no partial result and require a fresh first-page read. The example does not automatically retry, deduplicate related service summaries or execute task actions. Output can contain task content and business references; store it securely.

## Error handling

TaskBoard domain errors use `{ok:false,error:{code,message,retryable,...}}`. Instance authentication and readiness errors can use the [common error shapes](./03-errors-and-troubleshooting.md).

| HTTP / code | Action |
|---|---|
| `401` / `unauthenticated` | Check the instance token and its trusted user identity; do not claim identity in the body |
| `403 capabilityDisabled` | Enable the global TaskBoard capability in the client; do not automatically loop on `retryable:false` |
| `403 forbidden` | Check Board access and ID; this does not distinguish existence of arbitrary IDs |
| `400 invalidRequest` | Check properties, types, cursor conditions and activity revision bounds |
| `409 versionConflict` (query pagination) | Discard old pages and cursor; restart with the original filters |
| `404 taskNotFound` / `boardNotFound` (activity reads and similar cases) | Reload visible boards/tasks; do not automatically create or replay tasks |
| `503 migrationFailed` / `500 internalError` | Save path, status, code and time for the administrator; omit tokens and business content |

Reads can rebuild query caches or perform storage maintenance without starting a model request or task execution. See [OpenAPI downloads](./07-openapi.md) for complete DTOs.
