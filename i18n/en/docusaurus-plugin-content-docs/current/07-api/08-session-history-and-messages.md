---
title: Session History and Messages
description: Read your session history, per-Run messages, search results, and conversation topics, with pagination, delegated inspection views, and truncation handling.
slug: /api/session-history-and-messages
sidebar_position: 8
keywords: [API, session history, messages, search, topics, pagination, Run]
---

# Session History and Messages

Deployment owners can use these endpoints to read their own history on a standalone instance. Follow [Connect and Authenticate](./01-connection-and-auth.md) to obtain the actual instance address and owner token. Every request uses `X-Agent-Service-Token`; no Socket.IO connection is needed.

## Read scope and identifiers {#history-scope}

Session listings, search, and reads of a specific Run use the user identity resolved by the service. Requests for a specific Run check ownership before returning content. A missing, other-user, or cleared Run returns `404`. Knowing its ID does not grant access, and a caller-supplied `userId` cannot select another user's data.

The two topic endpoints read Agent conversation memory for the connected instance's current local user profile. They are intended for the instance owner and do not provide tenant isolation for a shared service. A missing profile returns `401`; ask the instance administrator to check it.

| Identifier | Where to obtain it | Use on this page |
|---|---|---|
| Agent ID | `id` in the [Agent list](./04-conversations-and-runs.md#list-agents) | `agentId` filters and topic paths |
| Run ID | `runId` in the session list, or a known authorized Run record | `/api/sessions/:runId` and its messages path |
| Runtime session ID | Query start/acceptance events or an available runtime session reference | Continuing a conversation; it cannot replace a Run ID here |
| Topic ID | `activeMatters[].id` or `recentMatters[].id` in the conversation overview | `/matters/:id/full`; it cannot be used to calculate a Run ID |

These reads support display and search. Configuration, messages, or tool records in a history snapshot grant no execution permission, and the snapshot is not a protocol archive that can be replayed unchanged to a model provider. Determine whether a current submission completed using the request identity and terminal-event rules in [Conversations and Runs](./04-conversations-and-runs.md).

## List session history {#list-sessions}

### `GET /api/sessions`

| Query parameter | Meaning |
|---|---|
| `agentId` | Optional Agent filter; omitting it reads the current user's regular session list |
| `includeArchived` | Only the string `true` includes archived sessions; excluded by default |
| `limit` | Default `20`; send a positive decimal integer |
| `offset` | Default `0`; send a nonnegative decimal integer |

Results are ordered by `updatedAt`, newest first. Archiving and run status are separate properties; archived entries can include `archivedAt`. The list retains historical branches that can be opened. A branch may include messages inherited from a predecessor, so concatenating branches does not produce a deduplicated conversation.

This list does not enumerate delegated child Runs, separate conversations created in manual mode, or dedicated timelines such as schedules, Webhooks, and Mentions. There is no `includeDelegated` or `includeManual` switch. Background incoming conversations may have `background: true`; appearing first in the list does not make an entry a suitable target for the next follow-up.

```bash
curl --silent --show-error --get \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  --data-urlencode "agentId=${AGENT_ID}" \
  --data-urlencode 'limit=20' --data-urlencode 'offset=0' \
  "${BASE_URL}/api/sessions"
```

```json
{
  "sessions": [
    {
      "runId": "run-example",
      "agentId": "your-agent-id",
      "status": "idle",
      "messageCount": 1,
      "createdAt": "2026-10-15T08:00:00Z",
      "updatedAt": "2026-10-15T08:00:00Z",
      "preview": "Please review the release notes"
    }
  ],
  "total": 1,
  "hasMore": false
}
```

Entries may also contain `forkedFrom`, `conversationId`, `title`, `titleSource`, `origin`, `background`, and `archivedAt`. Historical display values for `status` are `idle`, `completed`, `failed`, or `handed_off`; they do not replace live execution state or evidence that a particular request succeeded.

When `hasMore` is `true`, request the next page with `offset + limit`. This endpoint and the per-Run messages endpoint do not declare a fixed maximum page size; use small pages. Both accept legacy integer parsing, but always send the integer forms above rather than relying on conversions of invalid values.

## Read a session snapshot {#get-session}

### `GET /api/sessions/:runId`

Use a `runId` containing letters, digits, hyphens, or underscores. Success returns the snapshot directly, without a `data` or `session` wrapper. The snapshot includes the entire persisted message array; prefer the paginated endpoint in the next section for long sessions.

```bash
curl --silent --show-error \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  "${BASE_URL}/api/sessions/${RUN_ID}"
```

```json
{
  "runId": "run-example",
  "agentId": "your-agent-id",
  "userId": "your-instance-user-id",
  "engine": "desirecore-engine",
  "messages": [
    {
      "id": "d8d53a7a-478e-4d96-970e-657dece814f7",
      "role": "user",
      "content": "Please review the release notes",
      "timestamp": 1792051200000
    }
  ],
  "options": {},
  "status": "idle",
  "createdAt": "2026-10-15T08:00:00Z",
  "updatedAt": "2026-10-15T08:00:00Z"
}
```

A snapshot can also contain `conversationId`, `forkedFrom`, team or working-directory information, and an available `runtimeSession` reference. If present, `pendingAssistant` is an unfinished output checkpoint separate from `messages`; do not append it as a saved message. The response removes private runtime replay fields and may restore image references to data URLs, which can make it large.

A delegated child Run returns `403 delegated_run_requires_inspect_view` from this snapshot endpoint. Adding a `view` parameter does not turn it into a delegated inspection endpoint. Use the per-Run messages inspection view below.

## Read per-Run messages in pages {#session-messages}

### `GET /api/sessions/:runId/messages`

| Query parameter | Meaning |
|---|---|
| `offset` | Default `0`; a source-record row position, not a byte offset |
| `limit` | Default `100`; the source-record window to read; use a positive integer |
| `view` | Optional for regular sessions; delegated child Runs require `inspect-run` explicitly |

```bash
curl --silent --show-error --get \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  --data-urlencode 'offset=0' --data-urlencode 'limit=100' \
  "${BASE_URL}/api/sessions/${RUN_ID}/messages"
```

```json
{
  "messages": [
    {
      "id": "d8d53a7a-478e-4d96-970e-657dece814f7",
      "role": "user",
      "content": "Please review the release notes",
      "timestamp": 1792051200000,
      "lineIndex": 0,
      "offset": 0
    }
  ],
  "total": 1
}
```

There is no `hasMore`. Start the next page at the **current request's `offset + limit`** and stop when that reaches the response's `total`. The total counts source-record rows. Blank or malformed records can be skipped, and tool records can be deduplicated for display, so `messages.length` may be smaller than the window or even zero. Do not advance by the returned length or stop early because a page is empty.

Within a message, `lineIndex` is the row number in the Run and `offset` is a byte position. Both support navigation; prefer `id` for stable message identity. `content` can be a string or an array of content blocks, not always plain text. Images, media, and externally stored tool results may retain references or previews; this endpoint does not guarantee complete attachment bytes or tool-result text. For file reads, see [Attachments and Media](./09-attachments-and-media.md#download-attachment).

### Delegated inspection view

For a known delegated Run that you are authorized to read, use the same address with `view=inspect-run`. This does not relax user ownership checks or add the Run to the regular session list.

While execution is in progress and output has not been persisted, the response may also contain `live`:

```json
{
  "messages": [],
  "total": 0,
  "live": {
    "turnId": "turn-example",
    "text": "Working on the delegated task",
    "toolCalls": [],
    "timestamp": 1792051200000
  }
}
```

`live` is a replaceable temporary display snapshot. It may roll back or disappear after a terminal event or persistence of the final message. It is excluded from `total` and is not a persisted message, receipt, or success signal. It contains displayable output text and a limited set of tool states; do not use it to reconstruct tool inputs or execution. `text` is limited to 16,384 characters and `toolCalls` to 128 entries.

## Search an Agent's messages {#search-messages}

### `GET /api/sessions/messages/search`

| Query parameter | Meaning |
|---|---|
| `agentId` | Required target Agent ID |
| `q` | Optional case-insensitive text substring; omit it to filter only by content type |
| `type` | `all`, `image`, `file`, or `tool`; omitted or other values are treated as `all` |
| `limit` | Default `50`; a nonnegative safe integer. `0` returns all remaining matches from `offset`, with `hasMore: false`; always paginate large histories |
| `offset` | Default `0`; a nonnegative safe integer whose sum with `limit` must also be a safe integer |
| `preferredRunId` | Optional selection of a historical branch window for the default conversation; neither an access credential nor a filter restricting results to that Run alone |
| `previewChars` | Optional integer from `1` to `8000`; matching uses the original text before clipping the display preview. Omit it to retain the full extracted text |

The largest safe integer is `9007199254740991`. Text matches are returned by message timestamp, newest first. Ordinary text in content blocks participates in matching; this is not a general full-text index of attachment contents or tool results. The `image` flag follows the message's media/image fields and does not establish that every attachment is an image.

Search includes the user's separate conversations created in manual mode, but excludes archived sessions and delegated child Runs by default. For a default conversation's fork family, it selects a visible branch to avoid duplicate matches. `preferredRunId` bounds that historical window without excluding separate manual conversations. If no valid matching branch is available, this parameter does not grant access to other Runs.

```bash
curl --silent --show-error --get \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  --data-urlencode "agentId=${AGENT_ID}" --data-urlencode 'q=release' \
  --data-urlencode 'limit=50' --data-urlencode 'offset=0' \
  --data-urlencode 'previewChars=240' \
  "${BASE_URL}/api/sessions/messages/search"
```

```json
{
  "items": [
    {
      "runId": "run-example",
      "messageIndex": 0,
      "offset": 0,
      "messageId": "d8d53a7a-478e-4d96-970e-657dece814f7",
      "role": "user",
      "text": "Please review the release notes",
      "timestamp": 1792051200000,
      "hasImages": false,
      "hasFiles": false,
      "hasToolUse": false
    }
  ],
  "total": 1,
  "hasMore": false
}
```

Matches may also contain `toolNames` and `conversationId`. Correlate messages with `runId` and `messageId`. `messageIndex` is the source row number, while a hit's `offset` is a byte position, not the query parameter for the next page. Search pagination instead advances the request's `offset + limit` and reads `hasMore`.

## Read the conversation topic overview {#conversation-overview}

### `GET /api/conversation/:agentId/overview`

There are no query parameters or pagination. The response includes active topics, up to 10 recent topics, and total topic and archived-topic counts. It is a conversation-memory overview, not a replacement for the session list or all original messages.

```json
{
  "agentId": "your-agent-id",
  "activeMatters": [{ "id": "mat_example", "title": "Release review", "type": "task" }],
  "recentMatters": [],
  "totalMatters": 1,
  "totalArchived": 0
}
```

Active entries contain `id`, `title`, and `type`; recent entries can also include `completedAt` and `summary`. When no conversation memory is available, the response may contain empty arrays and zero counts. This does not mean the Agent has no historical messages or establish that the Agent ID exists.

## Read a topic's original messages {#matter-messages}

### `GET /api/conversation/:agentId/matters/:id/full`

Use a topic ID from the overview; there are no pagination parameters. The source can be an active, recent, or archived topic. Success returns `{ "matterId": "…", "messages": [...] }`, with public entries from the topic source. Do not assume every item has the same shape as a per-Run message.

**Each request reads at most 120 source messages.** A longer source also returns `"truncated": true`. The public projection may omit internal entries, so the returned length is not the source total. There is no parameter to raise the limit or continue to another page. For complete per-Run history, use the actual authorized Run ID and the messages pagination endpoint.

```json
{
  "matterId": "mat_example",
  "messages": [{ "role": "user", "content": "Please review the release notes", "timestamp": 1792051200000 }],
  "truncated": true
}
```

## Tool results and read consistency {#history-result-privacy}

These endpoints return message views for display and search. Some tool results contain credentials, interface content, or other sensitive information; history, session snapshots, and topic messages replace that content with a placeholder. Protocol records may also withhold result bodies when the tool-call identity cannot be verified or contains conflicting facts.

- `toolUse[].summary` or a tool-result content block may be replaced. Summaries for running or interrupted tools may also be absent. Do not depend on the exact placeholder wording.
- For withheld results, body references or preview markers such as `summaryRef`, `summaryIncomplete`, and `externalizedPreview` may be removed. An absent reference does not mean the tool never ran, and does not permit constructing a filename to obtain its body.
- Preserve and read the actual `status`, `isError`, and other outcome fields. A placeholder for a failed result still represents failure; the word `completed` in a summary does not establish completion of the submitted turn or the business task.
- If sensitive output is needed, have the user obtain it through the original tool or application. A placeholder is not a reason to rerun tools, resubmit a conversation, or approve an action automatically.

The same historical record may produce different display content over time because of privacy rules, display deduplication, or concurrent writes. Message IDs and source-row windows locate records; they do not guarantee byte-identical bodies. These reads are not a full backup or model-protocol replay. The pagination rules and request-terminal rules above continue to apply independently.

## Runnable read example {#history-example}

**[Download history.mjs](pathname:///api-examples/history.mjs)**. It requires Node.js 22 or later, with no npm dependencies to install.

```bash
export DESIRECORE_URL='https://your-instance.example'
export DESIRECORE_TOKEN='your-existing-owner-token'
export DESIRECORE_AGENT_ID='your-agent-id'

node history.mjs list --limit 20 --all-pages
node history.mjs session run-example
node history.mjs messages run-example --limit 100 --all-pages
node history.mjs messages delegated-run-id --inspect-run
node history.mjs search --query 'release' --preview-chars 240 --all-pages
node history.mjs overview
node history.mjs matter mat_example
```

The example checks the instance handshake before issuing GET requests. It does not submit queries, send follow-ups, or cancel Runs. Each command reads one page by default. `--all-pages` reads up to 20 pages, adjustable with `--max-pages`. Output is newline-delimited JSON containing history content; store it as private data.

`list` accepts `--include-archived`. `search` also supports `--type`, `--preferred-run-id`, and `--preview-chars`. The `messages` inspection view requires the explicit `--inspect-run` option.

Exit code `0` means the requested reads succeeded; `1` indicates a configuration or HTTP failure. Code `2` means pagination reached its configured limit, stopped after observing a changed total, or received a truncated topic response. A stop record's `nextOffset` provides the next read position. Check whether history changed before restarting.

These endpoints provide no version ensuring consistency across pages. Appending, editing, or clearing history during a scan can produce duplicates or omissions. The example stops if `total` changes, but cannot detect content changes that leave the total unchanged. Do not treat a paginated scan as an audit snapshot from a fixed point in time.

## Common errors {#history-errors}

| HTTP / error | Action |
|---|---|
| `400 agentId is required` | Provide an actual Agent ID when searching |
| `400 Invalid history page parameters` | Use nonnegative safe integers for search `limit` and `offset`, and check the `previewChars` range |
| `400 Invalid runId` | Use a Run ID returned by the session list, not a path or runtime session ID |
| `401` | Check the instance token; for `User not authenticated` or `User not found`, ask the administrator to check the instance's current user profile |
| `403 delegated_run_requires_inspect_view` | Use `/messages?view=inspect-run` for an authorized delegated Run, rather than the full snapshot endpoint |
| `404 Session not found`, or the same error with a Run ID | The record is missing, cleared, unreadable, or owned by another user; do not switch identities or guess other IDs to retry |
| `404 Matter messages not found: …` | The topic or readable source messages are unavailable; select again from the current overview. An empty archived source may also return no messages |

For authentication, service readiness, origin restrictions, and HTML responses from a proxy, see [Errors and Troubleshooting](./03-errors-and-troubleshooting.md).
