---
title: 对话与运行记录
description: 通过 HTTP 与 Socket.IO 发起和续接对话，查询智能体、Run 与回执，并处理接纳未知、重试和断线对账。
slug: /api/conversations-and-runs
sidebar_position: 4
keywords: [API, 智能体, Run, Receipt, 对话, 运行状态, 分页]
---

# 对话与运行记录

部署所有者可以查询自己的 standalone 实例中的智能体和运行记录，用于选择目标智能体、观察已知 Run 和读取执行回执。地址与实例令牌的取得方式见[连接实例与认证](./01-connection-and-auth.md)。以下只读请求均使用 `X-Agent-Service-Token`。

## 读取范围

智能体列表、Run 列表、Run 详情和运行态供实例所有者读取实例数据，不能作为多个租户之间逐用户隔离的接口。回执读取另核对服务端解析的可信用户身份与 Run 的用户归属；Run 不存在或不属于该用户时均返回 `404`。

Agent ID、Run ID、`user_id` 和 `conversation_id` 是标识信息，不是访问凭据。请求中自报用户 ID、知道 Run ID 或曾在别处看到一条记录，都不能代替认证与对应接口的归属检查。

## 查询智能体 {#list-agents}

### `GET /api/agents`

无请求体，不提供分页或筛选参数。成功响应为 `{ "agents": [...] }`；列表项是摘要，不是完整智能体配置。

```bash
curl --silent --show-error \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  "${BASE_URL}/api/agents"
```

响应结构示例：

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

| 字段 | 类型与含义 |
|---|---|
| `id`、`name` | 必需字符串；调用其它接口时使用 `id`，不要用显示名称替代 |
| `skillsCount`、`toolsCount` | 必需非负数；摘要中的技能和工具数量 |
| `heartbeatEnabled`、`hasGit`、`isCoreAgent` | 必需布尔值；心跳、Git 仓库与核心智能体标记 |
| `status` | 可选，`online`、`busy`、`idle`、`offline`、`error`、`recovery`、`shutdown` |
| `metadataError` | 可选，`missing`、`unreadable`、`invalid_json`、`invalid_shape`；有此字段时名称、描述和计数可能是降级值，应先请管理员修复配置 |
| `description`、`engine`、`hasRemote`、`syncStatus` | 可选描述、运行引擎、上游仓库和同步信息 |
| `ui`、`avatar`、`avatarImage` | 可选界面与头像摘要；头像配置存在不等于对应文件可用 |
| `unread`、`pinned`、`pinnedAt`、`folded`、`groupOverride`、`nestMembers` | 可选的当前实例用户未读信息与显示偏好，缺席时不要自行补成已观测值 |

## 查询 Run 列表 {#list-runs}

### `GET /api/runs`

Run 列表按 `started_at` 从新到旧排序，默认不包含已清除对话的记录。筛选先作用于全部可读取记录，再取最多 `limit` 条；同时提供多个筛选条件时按 AND 匹配。

| 查询参数 | 类型 | 默认与含义 |
|---|---|---|
| `limit` | 单个十进制正整数字符串 | 默认 `50`；转换后必须是安全整数，不设置额外统一条数上限 |
| `agent_id` | string | 可选；执行该 Run 的智能体 ID |
| `delegated_by` | string | 可选；发起委派的智能体 ID，对应 `delegation.fromAgentId` |
| `parent_run_id` | string | 可选；委派父 Run ID，对应 `delegation.parentRunId` |

此端点不提供 `offset`、游标或 `total`。不要套用其它接口的分页字段。`limit` 的空值、负数、小数、混杂字符串、重复参数或超出安全整数范围的值会返回 `400`。

先从智能体列表取得 `AGENT_ID`，再按目标智能体查询：

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

`runs` 中的每项包含下节的 Run 元信息。列表不是所有实时事件的重放，也没有针对某次 Webhook 请求的完成关联。

## 查询 Run 详情 {#get-run}

### `GET /api/runs/:id`

`:id` 使用已取得的 Run ID，无请求体和额外查询参数。成功时直接返回 Run 元信息对象，不再套一层 `run` 或 `data`。

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

| 字段 | 含义 |
|---|---|
| `run_id`、`user_id`、`agent_id` | 必需字符串；Run、发起用户与执行智能体的标识 |
| `started_at` | 必需 ISO 8601 时间，表示 Run 首次创建时间；同一 Run 可跨多轮复用 |
| `status` | 必需，`running`、`idle`、`completed`、`failed`、`handed_off` |
| `conversation_id`、`session_id` | 可选，对话与实时运行会话标识；不要与一次提交的请求 ID 混用 |
| `turn_started_at`、`completed_at`、`updatedAt` | 可选，当前轮次开始、Run 完成和最近活动时间 |
| `failure_reason` | 失败原因可能为 `process_restart`、`timeout`、`stale`、`error` |
| `interruption_reason`、`interrupted_at` | 可选，中止原因和时间；用户停止、系统休眠、后台超时等原因有各自标识 |
| `delegation` | 可选委派来源，含 `fromAgentId` 及可能存在的 `parentRunId`、`parentClientRequestId`、`mode` |
| `background`、`inbound` | 可选当前轮次身份信息，分别描述后台处理和来自另一个智能体的消息 |
| `title`、`messageCount`、`archived_at`、`cleared` | 可选标题、消息数量和历史生命周期信息 |
| `team_id`、`work_context_id`、`execution_attachment` | 可选执行归属信息；读取这些字段不授予相应资源权限 |
| `handoffFrom`、`handoffTo` | 可选字符串，转交来源与目标 Run ID；用于关联记录，不授予目标 Run 的读取或续接权限 |
| `handoff_pending` | 可选字符串，服务端记录的进行中转交标记；不是调用凭据，也不能用来发起或重放转交 |
| `handoff_attempted`、`handoff_accepted` | 可选布尔值，分别记录目标已进入可能产生副作用的启动阶段、目标运行时已接纳转交；均不表示目标业务已完成 |

响应还可能包含上下文、恢复和工作目录等可选元信息。缺席字段表示没有这项记录；不要据此补造完成时间、失败原因或执行归属。

`idle` 表示当前未在执行，不等于整项业务已经成功，也不单独保证可以续问；中止后的 Run 也可能回到 `idle`。`handed_off` 表示该 Run 的会话已转交，不是 `completed` 的别名，也不证明目标 Run 已完成。`completed`、`failed` 和 `handed_off` 都描述 Run 的生命周期；判断某次提交仍应关联该轮的终态和回执。

转交字段都是只读观察信息。看到 `handoff_pending` 时不要自动重放来源工作；看到 `handed_off` 时不要继续向来源运行会话自动续问。可以在有权限时按 `handoffTo` 另行读取目标 Run，但读取链路不能替代目标的接纳与终态证据，缺席字段也不能证明没有发生转交。

部分历史分支可在列表中出现，而此详情端点返回 `404`。需要判断运行态或读取回执时，分别使用下面的端点，并按它们自己的读取结果处理。

## 查询运行态 {#get-run-runtime-state}

### `GET /api/runs/:id/runtime-state`

返回 Run 的持久运行态快照，兼容历史分支。`:id` 仅允许字母、数字、下划线和连字符。成功响应只包含三个字段：

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

此端点成功返回的 `status` 只包含 `running`、`idle`、`completed`、`failed`，`running` 不会被改成 `idle`。已转交的 Run 当前会返回 `404`，不会从此端点返回 `handed_off` 或归一化后的 `completed`。其它无法读取或不支持的状态也返回 `404`，因此不能仅凭 `404` 判断记录不存在或任务失败。

此端点不返回 `handoffTo` 等转交详情；需要查看链路时使用 Run 详情，并处理该端点自己的可读范围。这仍是一份快照，不授权取消、回滚或其它修改操作，也不保证接下来提交时状态未变化。

## 读取执行回执 {#list-run-receipts}

### `GET /api/runs/:id/receipt`

回执包含每轮的输入、输出、工具调用和结果。接口根据实例凭据解析可信用户，不接收用来替代身份检查的 `user_id` 参数。Run 不属于该用户时返回 `404`，即使其它读取接口已经返回过该 Run 的元信息。

不带 `offset`、`limit` 时，响应为 `{ "run_id": "...", "receipts": [...] }`，按写入顺序读取已有回执。建议用分页控制每次读取量：只要提供任一分页参数，就启用以下规则。

| 查询参数 | 默认值 | 有效范围与处理 |
|---|---|---|
| `offset` | `0` | 单个非负十进制整数字符串；从最新回执向前跳过，超过 `10000` 时按 `10000` 处理 |
| `limit` | `20` | 单个正十进制整数字符串；超过 `100` 时按 `100` 处理 |

两项转换前后均要有效，空值、小数、负数、重复参数、混杂字符串和非安全整数返回 `400`。响应的 `offset`、`limit` 是实际生效值。页内回执仍按写入顺序排列，最新一页中的最后一项是这一页较新的回执。

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

| 字段 | 使用方式 |
|---|---|
| `receipt_id` | 单条回执的稳定标识；同一 Run 可以有多条回执 |
| `goal`、`input`、`output`、`tool_calls` | 执行目标、输入、输出和工具调用；这些内容可能包含业务数据 |
| `outcome.status` | `success`、`partial`、`failed`；描述该回执记录的结果 |
| `outcome.auto_completed` | 是否无人工干预完成 |
| `started_at`、`completed_at` | 该回执的开始和完成时间 |
| `usage`、`duration_ms`、`interruption_reason` | 可选用量、耗时和中止信息；未回报的字段不能当作零用量或正常完成 |
| `total`、`has_more` | 分页读取的计数和是否还有更早记录；不带分页参数时不返回 |
| `skipped` | 分页读取时跳过的损坏或过大记录数，不表示业务执行失败次数 |

旧记录还可能在 Schema 校验时被跳过，因此 `receipts.length` 可能小于这页跨过的记录数，`total` 也不能当成返回数组长度。继续读取更早页时按响应的 `offset + limit` 推进，不按 `receipts.length` 推进；到达 `10000` 偏移上限后停止翻页，避免重复读取同一页。

空回执列表、跳过的历史记录或最近一条旧回执都不能独立证明当前轮次已完成。用回执做对账时，应同时核对目标 Run、该轮时间与可取得的轮次关联信息；没有足够证据时保留结果未知。

## 只读接口错误 {#read-errors}

| 端点或范围 | HTTP 状态与正文 | 处理方式 |
|---|---|---|
| 所有接口 | `401`，`error: "unauthorized"` | 核对实例令牌与目标地址 |
| 所有接口 | `403 origin_not_allowed` 或 `503 service_not_ready` | 按[错误与排查](./03-errors-and-troubleshooting.md)处理来源限制或启动等待 |
| Run 列表与分页回执 | `400`，`error` 以 `Invalid pagination:` 开头 | 使用单个符合要求的十进制整数参数 |
| Run 详情 | `404`，`error: "Run not found: ..."` | 核对 Run ID 和详情可读范围 |
| 运行态与回执 | `400`，`error: "Invalid run ID"` | 使用服务返回的安全 Run ID，不拼接路径 |
| 运行态 | `404`，`error: "Run runtime state not found: ..."` | 包括已转交的 Run 和无法读取的状态；不要默认成 `idle`、失败或不存在，必要时另查 Run 详情 |
| 回执 | `401`，`error: "无法解析用户身份"` | 请管理员检查实例身份配置 |
| 回执 | `404`，`error: "Run not found: ..."` | Run 不存在、不可读取或不属于可信用户；不能据此跳过归属检查 |
| 读取失败 | `500` | 保存脱敏响应，请管理员检查服务日志；错误正文以实际返回为准 |

查询参数不改变执行权限。只读接口允许再次查询来更新观察结果；不要把一次失败或缺失记录自动转成重新提交任务。

## 发起与续接对话 {#submit-conversation}

对话通过 HTTP 提交，通过 Socket.IO 接收进度和该轮终态。使用已经配置好模型与执行权限的目标智能体；HTTP 和 Socket.IO 必须连接同一实例，使用同一主体的实例令牌。

### 运行 Node.js 示例 {#node-client-example}

[下载客户端示例](pathname:///api-examples/agent-client.mjs)，保存为 `agent-client.mjs`。示例演示文本提交、顺序续问、持久保存请求信息、断线对账与显式取消。使用 **Node.js 22+**，在保存示例的独立目录安装其依赖：

```bash
npm init -y
npm install socket.io-client@4.8.4
```

填入你自己的实例地址、已有令牌和从列表取得的智能体 ID：

```bash
export DESIRECORE_URL='https://agent.example.com'
export DESIRECORE_TOKEN='replace-with-your-existing-instance-token'
export DESIRECORE_AGENT_ID='your-agent-id'

node agent-client.mjs \
  --prompt '请回复一句问候。' \
  --follow-up '请再用英文回复。' \
  --state ./request.json
```

`--follow-up` 可以重复提供，示例只在上一轮得到明确完成信息、接纳查询确认会话属于当前服务进程后尝试续问；若观察到来源 Run 为 `handed_off` 或无法取得其运行态，会保留待发送文本并停止自动续问。首次调用不覆盖已有状态文件；为独立的新任务使用新的 `--state` 路径。状态文件保存原请求、业务文本、文件引用与关联信息，不保存实例令牌，应按业务数据保管。

要提交通用文件，先按[上传附件并交给对话](./09-attachments-and-media.md#upload-and-query)将文件上传到同一实例，保存服务返回的完整 JSON 回执，再交给示例：

```bash
node agent-client.mjs \
  --prompt 'Summarize the attached report.' \
  --attachment-receipt ./receipt.json \
  --state ./attachment-request.json
```

`--attachment-receipt` 可以重复提供。示例校验回执形状，将去重后按首次出现顺序排列的 `fileReference` 放入首轮的 `options.fileReferences` 并计入请求摘要；它不再次上传文件，也不把回执当作访问凭据。附文件仍需提供非空 `--prompt`。顺序 `--follow-up` 只发送文本，不自动重复附上首轮文件；恢复或重试沿用状态文件中的原引用，不能再加新的附件参数。

程序先验证握手，再注册事件监听并建立 Socket.IO 连接。连接路径为 `/socket.io/`，认证为 `auth: { token, clientInstanceId }`；`token` 与 HTTP 请求的 `X-Agent-Service-Token` 相同。`clientInstanceId` 使用稳定的 16—128 字符标识，只包含字母、数字、`.`、`_`、`:`、`-`。认证连接会绑定相应客户端接收通道，示例无需另发订阅消息。

### HTTP 提交字段

`POST /api/query/start` 使用 JSON 请求。请求顶层与 `options` 都不接受未声明字段；至少提供非空 `prompt` 或有效 `mediaRefs`。上面的文本示例使用以下字段：

| 字段 | 用途与示例约定 |
|---|---|
| `prompt` | 本轮用户文本；示例发送非空字符串 |
| `options.agentId` | 目标智能体 ID |
| `options.conversationId` | 对话范围；示例为其保存稳定值，后续请求沿用该范围 |
| `options.fileReferences` | 可选，已上传通用文件的引用数组；示例从附件回执取得，不放在 start 请求顶层 |
| `clientRequestId` | 一次提交的稳定 ID；同一请求恢复和有限重发时保留，新一轮使用新 ID |
| `userMessageId` | 本轮用户消息的稳定 ID，与请求一起保存 |
| `requestDigest` | `qrd1:` 开头的请求内容摘要，由示例按协议计算；它不是认证凭据 |
| `originSocketId` | 当前已认证连接的 `socket.id`；重连后更新，不使用旧连接 ID |

可靠关联与恢复需要以上稳定标识。完整请求字段与约束见[OpenAPI 下载](./07-openapi.md)；不要把未列出的权限对象或用户身份字段写入请求来尝试扩大授权。

新请求接纳时返回 `202`：

```json
{
  "ok": true,
  "clientRequestId": "00000000-0000-4000-8000-000000000002"
}
```

重复接纳的响应还可能包含已有 `sessionId`。`202` 表示本次准入已接纳；它不证明用户消息已经持久提交、模型已经执行或该轮已经完成。`query:started` 等事件可能先于 HTTP 响应到达，应在提交前注册监听，按请求 ID 关联两条通道。

`POST /api/query/follow-up` 续接已知运行会话，使用与 start 不同的请求形状：

| 字段 | 用途与示例约定 |
|---|---|
| `sessionId` | 服务返回的可继续使用的运行会话 ID |
| `originSocketId` | 当前已认证 Socket.IO 连接 ID |
| `message.id` | 这一轮的稳定用户消息 ID |
| `message.role` | `"user"` |
| `message.content` | 本轮文本 |
| `message.timestamp` | 用户消息时间，毫秒时间戳 |
| `clientRequestId` | 新一轮的稳定请求 ID |
| `requestDigest` | 示例计算并保存的该轮 `qrd1:` 内容摘要 |

续问接纳响应为 `202`，包含 `ok: true`、`sessionId` 和相应 `clientRequestId`；重复接纳时可能带 `duplicate`。不要把 start 的 `prompt/options` 对象原样当成 follow-up 请求。

### 接收事件并判定该轮结束 {#conversation-events}

| Socket.IO 事件 | 主要字段 | 处理方式 |
|---|---|---|
| `query:started` | `sessionId`，可能有 `runId`、`agentId`、`conversationId`、`clientRequestId` | 保存服务分配的运行标识，关联对应提交 |
| `query:followUpAccepted` | `sessionId`、可能有 `clientRequestId` | 关联续问的接纳信息，不作为完成信号 |
| `query:message` | `sessionId`、`message`，可能有请求与对话标识 | 观察文本、工具或交付等消息；`message` 结构依消息类型变化 |
| `query:complete` | `sessionId`，可能有 `clientRequestId`、`terminal` 和 `result` | 关联本轮请求后读取结构化 `terminal`；没有终态信息时保留未知 |
| `query:error` | `error`，可能有 `code`、请求和运行标识 | 保存可关联的错误；不要把未关联的错误归给另一次请求 |
| `activity:run_status` | `runId`、`status`，可能有 `sessionId` | 更新 Run 状态观察；它不是单次提交的终态 |

`query:complete.terminal.status` 为 `completed` 时，该轮正常收口；为 `interrupted` 时，该轮被中止，可继续读取其 `reason`、`partial`、`runId` 等已有信息。业务操作是否达到目标仍需核对输出和回执。`result`、某条主动交付消息或 Run 的 `idle`、`handed_off` 都不能代替该轮的终态；来源轮次正常收口也不代表转交目标已经完成。

没有匹配的 `clientRequestId` 或没有结构化 `terminal` 时，示例不会把事件判成这次请求已经成功。状态文件保留已观察的信息，供后续对账。

### 区分各种 ID {#conversation-identifiers}

| ID | 标识范围与生命周期 |
|---|---|
| `clientInstanceId` | 客户端接收通道；恢复同一示例状态时沿用 |
| `originSocketId` | 一次 Socket.IO 连接；每次重连变化 |
| `clientRequestId` | 一次 start 或 follow-up 提交；同一提交重发不变，每轮新请求不同 |
| `userMessageId` / `message.id` | 本轮用户消息；start 和 follow-up 使用不同字段位置 |
| `conversationId` | 对话范围，可跨多轮使用 |
| `sessionId` | 服务分配的运行会话；只有服务确认可复用时继续使用 |
| `runId` | 持久运行记录，可跨多轮复用；每轮可能产生独立回执 |
| `instanceId` | 握手中的数据空间身份，用于确认目标实例 |
| `serverInstanceId` | 接纳查询中的服务进程代际，重启会改变；不是数据空间身份或凭据 |

## 接纳未知、重试与断线对账 {#request-reconciliation}

发生超时、响应丢失或断线后，先保留原请求的 ID、内容摘要和提交时间。用只读接纳查询确认观察结果，再决定是否允许有限重发；不要为了重试而生成新的请求 ID。

### `POST /api/query/client-requests/lookup`

这是带实例认证的只读查询，不发起模型执行。JSON 顶层及 `requests` 每项不接受未声明字段：

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

`agentId` 必填，`conversationId` 可选；`requests` 为 1—100 项，每项的 `clientRequestId` 必填、`userMessageId` 可选，ID 使用非空且不超过 256 字符的字符串。成功响应包括 `protocolVersion: 1`、`serverInstanceId`、`observedAt`、`autoReplayRetentionMs`、`tombstoneRetentionMs` 和 `results`。

| `results[].status` | 含义与处理 |
|---|---|
| `committed` | 已提交，不重发。可能提供 `committedAt`、`sessionId`、`committedServerInstance`、`executionWitness`；不代表执行完成 |
| `reserved` | 已预留，等待后续明确结果；不并发重发 |
| `absent` | 截至查询时没有可确认记录；只有在服务给出的保护窗内、保留原 ID 与相同请求内容时才考虑有限重发 |
| `unknown` | 无法可靠判断；停止自动重发，保留未知并核实执行情况 |

`committedServerInstance` 可为 `current`、`previous`、`unknown`，描述提交与服务进程代际的关系；`executionWitness` 可为 `user-message`、`none`、`unknown`，描述已观察的执行证据。不要把 `committed`、代际或证据字段当成业务完成结论。

示例按响应中的保护窗和服务端 `observedAt` 计算请求年龄，不硬编码一个永久重试期限。超过保护窗时即使查到 `absent` 也不自动再发。收到 `CLIENT_REQUEST_BODY_MISMATCH` 表示同一请求 ID 的内容摘要不一致，应停止重发并核对保存的原请求；新任务与原请求的恢复分别处理。

### 恢复与只读检查

恢复已保存的请求：

```bash
node agent-client.mjs --resume ./request.json
```

示例保持原请求 ID 和内容，只更新重连后的 `originSocketId`。已提交请求不重发，已预留请求继续观察，未知或保护窗外请求停止自动重发。恢复不会用一条新 start 替换已经失效的原会话。URL 与握手实例身份必须与保存的目标一致。

仅查看接纳与可读取的运行记录：

```bash
node agent-client.mjs --recover ./request.json
```

这个模式不建立 Socket.IO 订阅、不发送 start 或 follow-up。已有 `runId` 时读取运行态与回执；只有 `sessionId` 时查找准确匹配的 Run，不猜“最近一条”就是本次运行。对账数据不能重放离线期间全部事件，也不能自动补发曾经发生的外部操作。缺少该轮终态证据时仍保留结果未知。示例不会把 `handed_off` 当成成功，不自动追随转交目标；顺序续问前若观察到来源 Run 已转交，会停止自动续问并保留待发送文本。

示例退出码为 `0`（观察到完成轮次）、`1`（拒绝、失败或中止）、`2`（结果未知或只读恢复模式）。`--recover` 完成只读检查后仍返回 `2`，这不是重新执行任务或确认任务失败的信号。

### 显式取消

```bash
node agent-client.mjs --cancel ./request.json
```

尚未记录终态时，取消通过 Socket.IO `query:abort` 发送已知的会话、对话、请求与智能体标识，没有同步 ack。继续等待可关联的 `query:complete` 中止终态；没有确认时仍按未知处理。已记录终态时，示例报告该状态而不再发送取消。`--resume`、`--recover`、`--cancel` 互斥，不能再附 `--prompt` 或 `--state`。按 Ctrl+C 只停止这个示例客户端，不会隐式取消服务中的任务。

### 提交与恢复错误

| HTTP 状态或标识 | 处理方式 |
|---|---|
| `400`，请求或接纳查询不符合字段要求 | 按对应端点的请求形状修正；lookup 的错误为 `client request lookup body does not match schema` |
| `401` / `403` | 核对实例令牌、页面来源及 HTTP/Socket 主体与目标连接，不通过修改标记绕过认证 |
| `409`，`busy: true` 且 `retryable: true` | 会话正在清空；等待清空结束后沿用原请求 ID 和内容重试，不更换 ID |
| `409 CLIENT_REQUEST_BODY_MISMATCH`，`retryable: false` | 原 ID 与请求内容不一致；停止重发，核对保存的原请求 |
| `503`，连接、请求登记或接纳确认不可用 | 保留实际 `retryable` 与错误信息，先查接纳状态；不假设所有 `503` 都可直接重新提交 |
| 丢失响应、断线或缺少可关联终态 | 先只读对账；不能确认时保留未知并停止自动重发 |

## 相关参考

- [OpenAPI 下载](./07-openapi.md)：公开 HTTP 操作、参数与响应 Schema。
- [错误与排查](./03-errors-and-troubleshooting.md)：连接、认证、启动与异步问题。
