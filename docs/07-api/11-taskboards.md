---
title: 任务看板读取
description: 查询有权访问的 TaskBoard、任务详情、交接证据和分页活动记录，并按会话解析默认看板。
slug: /api/taskboards
sidebar_position: 11
keywords: [API, TaskBoard, 任务看板, 活动记录, 分页]
---

# 任务看板读取

使用已有实例地址和 `X-Agent-Service-Token`，可将任务列表、详情及活动记录接入自己的看板。先完成[连接验证](./01-connection-and-auth.md)。实例中需要开启当前用户的全局 TaskBoard 能力；关闭时返回 `403 capabilityDisabled`，请在客户端启用该能力或联系实例管理员。

这些接口按已认证用户及其真实团队权限筛选，HTTP 请求作为该用户的 human actor 读取。请求体中的 `userId`、`actor` 或自报团队不会授予权限。知道 Board、Task、Run 或 Session ID 也不会扩大可读范围。本文的两个 `POST` 都是查询，不创建看板或任务，也不发起 Agent 执行。

| 目的 | 方法和路径 |
|---|---|
| 列出可见看板摘要 | `GET /api/taskboards` |
| 跨看板筛选任务并分页 | `POST /api/taskboards/query` |
| 读取一个看板及其可见任务 | `GET /api/taskboards/:id` |
| 按稳定 ID 读取单个任务 | `GET /api/taskboards/:id/tasks/:taskId` |
| 读取看板内任务的交接证据 | `GET /api/taskboards/:id/activity` |
| 分页读取一个任务的活动 | `GET /api/taskboards/:id/tasks/:taskId/activity` |
| 解析会话的默认看板 | `POST /api/taskboards/session-board/resolve` |

路径中的 ID 使用接口返回的原值，并分别按 URL path segment 编码。Board revision、Task version、查询游标和活动分页位置用途不同，不能互换。

## 看板列表和详情 {#boards}

### `GET /api/taskboards`

无查询参数和请求体。返回 `{schemaVersion: 3, generatedAt, boards}`，其中 `boards` 仅包含当前用户可见的看板；列表没有分页参数。每项包含：

| 字段 | 用途 |
|---|---|
| `meta` | 看板 ID、名称、`scope`、`policy`、`revision` 和时间等元数据 |
| `statusCounts` | 未归档、未删除任务按状态统计的 `{status, count}` 数组 |
| `openCount` | 未归档、未删除任务中尚未进入看板 policy 终态或隐藏类别的数量 |
| `archiveAction` | 当前用户的归档动作快照，包含 `enabled`、`archived`、`expectedBoardRevision`，不可用时可能有 `reason` |

列表可包含已归档看板；不要把 `openCount: 0` 当作看板不存在或所有历史任务都已删除。`scope.type` 可以是 `user`、`team`、`agent` 或 `session`。团队失去访问权限后，聚合列表会省略相应看板。

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

无查询参数和请求体。成功详情为 `{schemaVersion: 3, exists: true, meta, tasks, comments, resourceBindings, availableActions, allDone}`，可能另有 `fanOutDispatches`。

- `tasks` 不包含已删除任务，可以包含已归档任务。`comments` 是这些任务的当前评论投影；已撤回的正文显示为 `[redacted]`，不再附带原正文历史、附件或 Mention 内容。
- `availableActions` 按 `{taskRef, actions}` 列出当前 actor 的动作。读取此快照不授予执行权限；后续操作仍需重新鉴权。不要仅按任务状态、负责人或 `ownerUserId` 猜测动作。
- `allDone` 表示没有未归档、未删除的开放任务；空看板也可能为 `true`，不证明任何一项外部工作已成功。
- `resourceBindings`、`runRefs`、`receiptRefs` 和深链是关联信息，不是读取关联资源的凭据。`fanOutDispatches` 的已创建子任务也不等于对应 Agent Run 已经启动。
- 不属于当前 claim actor 的 `claim.token` 会省略；查询接口始终省略该 token。不要把这些读取结果作为可共享的公开数据。

直接读取任意不存在或不可读的 Board ID 通常返回 `403 forbidden`。某些有权探测、但尚未建板的作用域别名可返回 `200`、`exists: false`。调用方必须同时处理这两种情况，不能承诺“所有不存在都返回 404”。

## 跨看板查询任务 {#query}

### `POST /api/taskboards/query`

请求为 JSON 对象，省略请求体等价 `{}`。只接受 `filter`、`sort`、`pageSize`、`cursor`；未知字段返回 `400 invalidRequest`。

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

| 参数 | 规则 |
|---|---|
| `pageSize` | 整数 `1..200`，默认 `50` |
| `sort` | 同时给 `field` 和 `direction`；field 为 `updatedAt`、`createdAt`、`dueAt`、`priority`、`position`、`subject`，direction 为 `asc` 或 `desc`；默认 `updatedAt desc` |
| `cursor` | 上一页返回的不透明字符串，原样传回；不是 offset，也不是可编辑 JSON |
| `filter` | 可选对象，支持下表中的组合条件 |

| 筛选字段 | 可用值及含义 |
|---|---|
| `keyword` | 最多 512 字符，大小写不敏感地匹配任务 ID、标题、描述、标签及关联引用等字段 |
| `boardIds` | 最多 256 个唯一 Board ID；不可见或不存在的 ID 静默省略，空数组不限制看板 |
| `scopeTypes` | `user`、`team`、`agent`、`session` |
| `statuses` | `backlog`、`pending`、`inProgress`、`blocked`、`inReview`、`completed`、`failed`、`canceled`、`deleted`；已删除任务不进入当前可见任务查询 |
| `priorities` | `high`、`normal`、`low` |
| `labels` / `labelMatch` | 最多 128 个唯一标签；`any`（默认）或 `all` |
| `participantIds` | 最多 256 个唯一 ID，匹配负责人、claim actor、审核人、贡献者或关注者 |
| `reviewStates` | `notSubmitted`、`awaitingReview`、`accepted`、`changesRequested` |
| `due` | `overdue`、`upcoming`、`none`、`any`；以首屏查询时刻判断到期范围，不启动调度 |
| `sourceOwnerTypes` | `automation`、`workflow`、`conversation`、`connector`、`import`、`manual` |
| `integrationTypes` | `automation`、`workflow`、`conversation`、`workdir`、`run` |
| `boardArchive` / `taskArchive` | 分别为 `active`（默认）、`archived` 或 `any` |

数组不允许重复值。没有筛选命中时可以返回：

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

实际每条 `items` 包含 `board`、`task`、`commentCount`、`deepLink`、`availableActions`、`archiveAction`。`deepLink.route` 是应用内地址，不是 API 路径。`totalCount` 和 `statusCounts` 统计全部筛选命中项，不只统计当前页。可选 `indexGeneration` 仅供诊断，不是 Board revision 或授权证明。

### 正确翻页

1. 首屏省略 `cursor`，保存原始筛选及排序条件。
2. 只有 `hasMore: true` 时，将 `nextCursor` 原样放入下一次请求；保持筛选和排序不变。末页省略 `nextCursor`。
3. 筛选或排序与游标不匹配，返回 `400 invalidRequest`。授权可见数据或版本变化导致游标失效时返回 `409 versionConflict`；丢弃已收集的旧页，从首屏重新读取。

每页重新检查权限。游标不建立跨用户授权或长期快照，也不能作为增量同步日志；不要解码、合成或跨用户复用。

## 单任务详情 {#task-detail}

### `GET /api/taskboards/:id/tasks/:taskId`

无查询参数和请求体。存在时返回 `{schemaVersion: 3, exists: true, board, task, comments, resourceBindings, availableActions, archiveAction, deepLink}`。与整板详情不同，这里的 `availableActions` 直接为动作数组，`comments` 仅包含此任务。

Board 已获准读取、但任务不存在或已删除时返回：

```json
{"schemaVersion": 3, "exists": false}
```

Board 本身的权限检查仍可先返回 `403`。不要以 `exists: false` 自动创建任务，或把一个任务的 `version` 用在另一任务上。

## 交接证据和任务活动 {#activity}

这两个路径返回不同内容，不能互相代替。

### `GET /api/taskboards/:id/activity`

这是看板内任务的**交接证据**，不是整个看板的完整事件流。可带 `taskId` 查询参数筛选一个任务；没有分页参数。返回 `{evidence: [...]}`。每项含 `eventId`、`kind: "handoff"`、`taskRef`、`fromActor`、`toActor`、`occurredAt`，可选 `reason`。

```json
{"evidence": []}
```

空数组可以表示没有交接，或所筛选任务不在当前可见范围；它不表示任务没有其他活动。需要评论、状态变化等活动时使用下面的单任务接口。

### `GET /api/taskboards/:id/tasks/:taskId/activity`

| 查询参数 | 规则 |
|---|---|
| `pageSize` | 整数 `1..100`，默认 `50`；限制本页读取的任务事件候选数 |
| `afterRevision` | 安全非负整数，默认 `0`；排除此 Board revision 及之前的任务事件 |
| `throughRevision` | 正安全整数；首屏省略以固定当前 Board 历史前缀，后续沿用返回值 |

`afterRevision > 0` 必须同时提供 `throughRevision`。`afterRevision > throughRevision` 或 `throughRevision` 大于当前 Board revision 返回 `400 invalidRequest`。未知查询参数也返回 `400`。建议使用规范十进制数字；不要依赖字符串强转的兼容细节。

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

`items` 的 `source` 区分两类活动：

- `taskEvent`：含 `taskEvent`，本页内按 Board revision 升序排列，受 `throughRevision` 限制。
- `ownerProjection`：含 `ownerProjection`，是关联服务当前提供的摘要，先于任务事件返回；可能每页重复，也可能变化，不受历史前缀固定。它不是已归档的事件正文。

用 `activityId` 区分重复展示项。`items.length` 可以小于 `pageSize`，也可以因额外摘要大于它；空页仍可能有下一页。只有 `page.nextAfterRevision: null` 才表示固定前缀读完，否则下一页使用该位置并保留同一 `throughRevision`。不要从最后一条活动的时间、Task version 或 `items.length` 推导下一页。

新增任务事件不会扩大已固定的前缀。需要最新活动时重新从首屏读取，并重新取得 `throughRevision`。前缀只约束任务历史，不冻结当前权限和关联服务摘要。任务不存在时可返回 `404 taskNotFound`；先行 Board 权限检查仍可能返回 `403`。

## 按会话解析默认看板 {#session-board}

### `POST /api/taskboards/session-board/resolve`

请求体最多 4 KiB，至少提供 `runId` 或 `sessionId`；只接受这两个字段。标识需匹配 `^[A-Za-z0-9][A-Za-z0-9._:-]{0,255}$`。

```json
{"runId": "your-run-id", "sessionId": "your-current-session-id"}
```

优先使用 Run ID。服务端按已保存的会话归属解析同一 Run 的各代 Session，避免会话重建后误认为看板丢失：

1. 当前 Session 恰有一个可见看板时，选择它；它可以是已归档看板。
2. 当前 Session 有多个看板时，不选择默认看板。
3. 当前 Session 没有看板时，选择同一 Run 其他 Session 中未归档、最近更新的一块。

`sessionId` 只影响当前 Session 优先级；服务端确认其属于另一个 Run 时会忽略这项优先级。只提供 `sessionId` 时，可反查所属 Run；会话归属不可读时可能仅按当前 Session 选择。请求不能自报 Session 列表扩大范围。

成功沿用看板详情形状。没有可选择的默认看板返回 `200 {"schemaVersion":3,"exists":false}`，不创建看板，也不代表 Run 不存在、没有其他看板或对话已结束。

## 可运行示例 {#taskboards-example}

下载 **[taskboards.mjs](pathname:///api-examples/taskboards.mjs)**。使用 Node.js 22 或更高版本，无需安装 npm 包：

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

示例验证握手后输出 `{kind, instanceId, data}`。`query` 和 `activity` 自动续读，保留每页原始信封在 `data.pages`，默认最多 100 页，可用 `--max-pages` 调整；查询冲突或分页异常时不输出半份结果，提示从首屏重读。它不自动重试、不去重关联服务摘要，也不执行任何任务动作。输出可能包含任务正文和业务关联信息，请妥善保管。

## 错误处理

TaskBoard 领域错误使用 `{ok:false,error:{code,message,retryable,...}}`；实例认证和服务就绪错误可能使用[通用错误形状](./03-errors-and-troubleshooting.md)。

| HTTP / 错误码 | 处理方式 |
|---|---|
| `401` / `unauthenticated` | 检查实例令牌及其可信用户身份，不通过请求体自报身份 |
| `403 capabilityDisabled` | 在客户端启用全局 TaskBoard 能力；`retryable:false` 时不要自动循环 |
| `403 forbidden` | 检查看板访问权限和 ID；不能据此区分任意 ID 是否实际存在 |
| `400 invalidRequest` | 检查字段、类型、游标条件及活动修订范围 |
| `409 versionConflict`（查询翻页） | 丢弃旧页和游标，按原筛选从首屏重读 |
| `404 taskNotFound` / `boardNotFound`（活动读取等） | 重新读取可见看板和任务，不自动创建或重放任务 |
| `503 migrationFailed` / `500 internalError` | 保存路径、状态、错误码和时间供管理员排查，避免记录令牌或业务正文 |

读取可以重建查询缓存或完成存储维护，但不会因此发起模型请求或任务执行。接口字段和完整 DTO 见 [OpenAPI 下载](./07-openapi.md)。
