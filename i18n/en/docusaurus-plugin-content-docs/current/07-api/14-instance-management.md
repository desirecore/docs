---
title: Instance management and Workflow bindings
description: Use a remote deployment owner credential to inspect and restore team archives and bind an existing exact Workflow definition.
slug: /api/instance-management
sidebar_position: 14
last-reviewed: 2026-10-29
keywords: [API, team archives, Workflow, management, CAS, idempotency]
---

# Instance management and Workflow bindings

These operations are for administrators and trusted management programs holding a remote/standalone **deployment owner credential**. Use the Agent Service origin and `X-Agent-Service-Token`; complete [connection and authentication](./01-connection-and-auth.md) first. Do not distribute this management credential to ordinary Agent tools or public web pages.

Embedded clients require an official UI source for team archive reads and restores. The commands below target an administrator-provided remote instance. Workflow bindings use the authenticated identity as the definition owner and reject a caller-supplied owner.

| Operation | Method and path | Effect |
|---|---|---|
| Inspect team archives | `GET /api/team-archive` | Returns archive, membership and local-path summaries |
| Restore one archive | `POST /api/team-archive/:archiveId/restore` | Restores a team to the active directory and reconciles related configuration |
| Create a Workflow binding | `POST /api/workflow-definitions/:workflowId/taskboard-bindings` | Records a Board/Task binding to an exact Workflow definition |

## Team archives {#team-archives}

### `GET /api/team-archive`

No pagination or filter parameters. Reads archives in the current instance:

```json
{"success":true,"data":{"archives":[]}}
```

| Item fields | Meaning |
|---|---|
| `archiveId`, `teamId`, `name` | Archive identity, original team ID and nullable name; restore uses `archiveId` |
| `archivedAt`, `reason` | Nullable archive time; reason is `disband`, `leader_deleted` or `unknown` |
| `archivedDir` | Absolute path on the instance; not a download URL |
| `supervisor`, `supervisorExists` | Original supervisor and whether that Agent currently exists |
| `memberCount`, `missingMembers` | Roster size and currently missing members |
| `originalIdOccupied` | Whether the original team ID is now occupied |
| `hasManifest`, `gitRecorded` | Whether an archive manifest exists and whether a Git tag was recorded; the latter can be `null` |
| `restorable` | Whether archived team configuration is currently readable and valid |

This is a current read projection, not an ID reservation or a guarantee that the next restore succeeds. Legacy archives without a manifest may appear but need additional workdir/approval handling. Restrict storage and sharing of local paths and organization details.

## Restore a team {#restore-team}

### `POST /api/team-archive/:archiveId/restore`

Copy `archiveId` from the list and encode it as one path segment. Omit the body or send a JSON object containing only:

| Field | Condition |
|---|---|
| `newName` | Required when the old ID is occupied; allocates a new ID. If the old ID is free, changes the name without changing its ID |
| `supervisor` | Required when the old supervisor is missing; use an existing Agent ID. Explicitly supplying it replaces the supervisor |

There is no `force` or overwrite mode. Blank names, unknown fields and invalid archive IDs are rejected.

```bash
curl --silent --show-error --request POST \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  --header 'Content-Type: application/json' \
  --data '{"newName":"Restored project team","supervisor":"replacement-agent"}' \
  "${BASE_URL}/api/team-archive/${ARCHIVE_ID}/restore"
```

Success is `200 {success:true,data:...}`. Inspect the returned fields:

- `teamId`, `restoredFromArchiveId`, `idChanged`: actual restored identity.
- `approval`: `reinstated` restores the saved approval record subject to current content checks; `pending` requires user review of rules.
- `workdir: {path, rebound}`: actual shared directory and whether the old binding was restored. `path` may be `null`; do not invent the old value.
- `reattachedChildren`, `missingMembers`, `warnings`: reattached child teams, missing members and follow-up issues.

Success means the team was restored; inspect remaining issues separately. Repeating restore is not a way to fix nonempty `warnings`. A timeout/disconnect leaves the outcome unknown: check the client team list and archive list first. There is no public idempotency key for this operation and no automatic retry.

| HTTP / code | Action |
|---|---|
| `400 TEAM_RESTORE_INVALID_REQUEST` / `TEAM_ARCHIVE_INVALID_ID` | Correct fields or use the returned archive identity |
| `400 TEAM_RESTORE_SUPERVISOR_REQUIRED` | Select an existing replacement supervisor |
| `404 TEAM_ARCHIVE_NOT_FOUND` | Check whether the archive has already been restored |
| `409 TEAM_RESTORE_ID_OCCUPIED` | Supply `newName`; do not overwrite the existing team |
| `409 TEAM_ARCHIVE_UNREADABLE` | Repair or recover valid archived team configuration |
| `500` | Keep status and diagnostics for the administrator; do not assume all finalization effects were rolled back |

## Exact Workflow and TaskBoard bindings {#workflow-binding}

### `POST /api/workflow-definitions/:workflowId/taskboard-bindings`

Use the **Agent Service origin and instance credential**. The instance needs a connected Workflow Service, an existing exact definition owned by the authenticated user and an authorized Board/Task. The caller neither obtains nor supplies internal service credentials.

Maximum request size: **16 KiB**. Only these five fields are accepted:

| Field | Rule |
|---|---|
| `resourceRef` | `{resourceType:"board",boardId}` or `{resourceType:"task",taskRef:{boardId,taskId}}` |
| `workflowRef` | Exact governed definition ref: `schemaVersion:1`, `resourceType:"workflow-definition"`, path-matching `workflowId`, and `pin:{mode:"exact",definitionRevision,contentHash}` |
| `role` | `reference` is a navigation link; `trigger` enables a trigger binding and requires a Task target |
| `expectedVersion` | Board `revision` (including `0`) or Task `version` (at least `1`) |
| `idempotencyKey` | Stable `8..256` character request key; retain the same request object/key when the outcome is unknown |

Do not claim `ownerUserId`, a runtime node, arbitrary DSL path or an unpinned latest definition. The revision and content hash must identify the same actual definition.

The following navigation-only example can be saved as `binding.json`. Replace IDs, revision and hash with the administrator-provided values:

```json
{
  "resourceRef":{"resourceType":"board","boardId":"project-board"},
  "workflowRef":{
    "schemaVersion":1,"resourceType":"workflow-definition","workflowId":"review-flow",
    "pin":{"mode":"exact","definitionRevision":3,"contentHash":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"}
  },
  "role":"reference","expectedVersion":12,"idempotencyKey":"project-review-binding-001"
}
```

`trigger` also requires that exact definition to declare a required typed `outputs.task_ref` without a default value. Creating a binding does not issue an execution grant, immediately run a Workflow or change task status. Execution still follows [Workflow integration](./06-workflow-integration.md) and administrator-configured authorization.

Success normally returns `201` for a new binding or `200` for an existing/idempotent result, with `{binding, changed, revision}`. `binding` contains its stable `bindingId`, target, pinned definition, role and creating actor/time. `revision` is the binding store revision, not a Task version or definition revision.

On version/idempotency conflicts, inspect the resource and original request instead of automatically changing the key. Missing, mismatching or foreign definitions can return `404`; unsupported typed triggers return `400`. The actual Workflow owner's rejection status/body is preserved without a `{success:false}` envelope. Unavailable services can return `503`.

## Runnable management example {#admin-example}

Download **[admin.mjs](pathname:///api-examples/admin.mjs)**. Node.js 22+, no npm dependencies:

```bash
export DESIRECORE_URL='https://your-instance.example'
export DESIRECORE_TOKEN='your-existing-deployment-owner-token'
node admin.mjs archives
node admin.mjs restore-team --archive-id team-id.20261019053355 \
  --new-name 'Restored project team' --supervisor replacement-agent
node admin.mjs bind-workflow --workflow-id review-flow --request ./binding.json
```

The script verifies instance identity first. Read/write commands are explicit, and writes are not retried automatically. Keep request identity and idempotency keys stable. Handle `401`, `403 renderer_origin_required` and general readiness failures using [Errors and troubleshooting](./03-errors-and-troubleshooting.md). See [OpenAPI downloads](./07-openapi.md) for complete structures.
