---
title: 会话历史与消息
description: 查询自己的会话历史、逐 Run 消息、搜索结果与对话话题，正确处理分页、委派检查视图和截断。
slug: /api/session-history-and-messages
sidebar_position: 8
keywords: [API, 会话历史, 消息, 搜索, 话题, 分页, Run]
---

# 会话历史与消息

部署所有者可以用这些接口读取自己 standalone 实例中的会话历史。先按[连接实例与认证](./01-connection-and-auth.md)取得真实实例地址和所有者令牌；所有请求均携带 `X-Agent-Service-Token`，不需要 Socket.IO 连接。

## 读取范围与标识 {#history-scope}

会话列表、搜索和精确 Run 历史按服务端解析的用户归属读取。精确 Run 读取在返回正文前检查该归属；不存在、不属于该用户或已经清除的 Run 均按 `404` 处理。知道 Run ID 不等于有读取权限，也不能通过请求参数自报 `userId` 来选择其他用户。

两个话题接口读取所连接实例当前本机用户资料所属的智能体对话记忆。它们适用于实例所有者，不能作为共享服务的多租户隔离接口。资料缺失时返回 `401`；请实例管理员检查当前用户资料。

| 标识 | 从哪里取得 | 在本页中的用途 |
|---|---|---|
| Agent ID | [智能体列表](./04-conversations-and-runs.md#list-agents)的 `id` | `agentId` 筛选与话题路径 |
| Run ID | 会话列表项的 `runId`，或已知的授权 Run 记录 | `/api/sessions/:runId` 及其消息路径 |
| 运行时会话 ID | 查询接管事件或可用的运行时会话引用 | 用于续聊；不能直接替代这里的 Run ID |
| 话题 ID | 对话总览的 `activeMatters[].id` 或 `recentMatters[].id` | `/matters/:id/full`；不能据此计算 Run ID |

本页的读取结果供显示和检索。历史快照中的配置、消息或工具记录不会授予执行权限，也不是可以原样重放给模型供应商的协议存档。当前请求是否完成，仍按[对话与运行记录](./04-conversations-and-runs.md)的请求身份和终态规则判断。

## 列出会话历史 {#list-sessions}

### `GET /api/sessions`

| 查询参数 | 含义 |
|---|---|
| `agentId` | 可选，按一个 Agent 筛选；省略时查询当前用户的普通会话列表 |
| `includeArchived` | 只有字符串 `true` 才包含已归档会话；默认不包含 |
| `limit` | 默认 `20`；请传正的十进制整数 |
| `offset` | 默认 `0`；请传非负十进制整数 |

列表按 `updatedAt` 从新到旧排序。归档与运行状态是不同的属性；归档项可带 `archivedAt`。列表保留可打开的历史分支，某个分支可能包含前代已有的消息，不能把各分支直接拼接成去重后的完整对话。

此列表不枚举委派子 Run、手动独立会话及调度、Webhook、Mention 等专用时间线。接口没有 `includeDelegated` 或 `includeManual` 开关。后台来信可能带 `background: true`，不能仅因为一项排在首位就把它选作下一轮续聊目标。

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

列表项还可能包含 `forkedFrom`、`conversationId`、`title`、`titleSource`、`origin`、`background`、`archivedAt`。`status` 的历史显示值为 `idle`、`completed`、`failed` 或 `handed_off`，不能用它代替实时执行状态或某次请求的成功凭证。

`hasMore: true` 时用 `offset + limit` 读取下一页。这里及逐 Run 消息接口没有声明固定页大小上限；建议使用小页。两者会兼容解析整数参数，请始终发送上述整数形式，不依赖非法值的转换结果。

## 读取一个会话快照 {#get-session}

### `GET /api/sessions/:runId`

`runId` 使用字母、数字、连字符或下划线。成功返回会话快照本身，不包在 `data` 或 `session` 中。快照包含整个持久消息数组，长会话优先使用下一节的分页接口。

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

快照还可能带 `conversationId`、`forkedFrom`、团队或工作目录信息，以及可用的 `runtimeSession` 引用。`pendingAssistant` 若出现，是尚未定稿的输出检查点，独立于 `messages`；不要把它追加成已保存消息。该响应会移除运行时私有回放字段，图片引用可能还原成 data URL，响应体因此可能较大。

委派子 Run 在这个快照接口返回 `403 delegated_run_requires_inspect_view`。即使增加 `view` 参数也不会把它变成委派检查接口；请使用下面的逐 Run 消息检查视图。

## 分页读取逐 Run 消息 {#session-messages}

### `GET /api/sessions/:runId/messages`

| 查询参数 | 含义 |
|---|---|
| `offset` | 默认 `0`，源记录的行位置，不是字节偏移 |
| `limit` | 默认 `100`，本次要读取的源记录窗口大小；建议使用正整数 |
| `view` | 普通会话可省略；委派子 Run 必须显式使用 `inspect-run` |

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

该接口没有 `hasMore`。下一页从**当前请求的 `offset + limit`** 开始，达到本次响应的 `total` 时停止。`total` 按源记录行数计数；空白、损坏记录可能被跳过，工具记录也可能经过显示去重，所以 `messages.length` 可能小于窗口大小，甚至整页为空。不能用返回长度推进或据此提前结束。

消息中的 `lineIndex` 是 Run 内行号，`offset` 是字节位置，二者仅供导航；稳定消息身份优先使用 `id`。`content` 可为字符串或内容块数组，不应当作始终是纯文本。图片、媒体和外置工具结果可能保留引用或预览；本接口不保证返回附件或工具输出的完整二进制/正文。附件读取见[附件与媒体](./09-attachments-and-media.md#download-attachment)。

### 委派检查视图

对一个已知且有权读取的委派 Run，使用相同地址并增加 `view=inspect-run`。这不会放宽用户归属检查，也不会让该 Run 出现在普通会话列表中。

仍在执行且有未落盘输出时，响应可能额外带 `live`：

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

`live` 是可替换的临时显示快照，可能回退，也可能在终态或最终消息落盘后消失；它不计入 `total`，不能当作持久消息、回执或成功结论。只包含普通输出文本和有限工具状态；不要据此恢复工具输入或执行。`text` 最多 16,384 字符，`toolCalls` 最多 128 项。

## 搜索一个 Agent 的消息 {#search-messages}

### `GET /api/sessions/messages/search`

| 查询参数 | 含义 |
|---|---|
| `agentId` | 必填，目标 Agent ID |
| `q` | 可选，大小写不敏感的文本子串；省略时仅按内容类型筛选 |
| `type` | `all`、`image`、`file` 或 `tool`；省略或其他值按 `all` 处理 |
| `limit` | 默认 `50`；非负安全整数。`0` 表示从 `offset` 起返回全部剩余命中，此时 `hasMore` 为 `false`；大历史建议始终分页 |
| `offset` | 默认 `0`；非负安全整数，且与 `limit` 之和也必须是安全整数 |
| `preferredRunId` | 可选，选择默认会话的历史分支窗口；不是访问凭据，也不是“只查这一个 Run” |
| `previewChars` | 可选，整数 `1`–`8000`；先匹配原文，再裁剪展示预览。省略时保留完整提取文本 |

安全整数最大值为 `9007199254740991`。搜索按消息时间戳从新到旧返回文本命中；内容块中的普通文本会参与匹配，不是附件正文或工具结果的通用全文索引。`image` 标记沿消息的媒体/图片字段判断，不能据此断言所有附件均为图片。

搜索包含该用户的手动独立会话，默认不包含归档会话或委派子 Run。默认会话的 fork 家族会选择可见分支，避免重复命中；`preferredRunId` 限定相应历史窗口，但不排除独立的手动会话。无有效匹配分支时不会借此取得其他 Run 的权限。

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

命中还可能带 `toolNames` 和 `conversationId`。用 `runId` 与 `messageId` 关联消息；`messageIndex` 是源行号，命中里的 `offset` 是字节位置，不能直接当作下一页查询参数。搜索本身按请求的 `offset + limit` 翻页，并读取 `hasMore`。

## 读取对话话题总览 {#conversation-overview}

### `GET /api/conversation/:agentId/overview`

无查询参数或分页。返回活跃话题、最多 10 个近期话题，以及总话题数和已归档话题数；它是对话记忆总览，不能替代会话列表或全部原始消息。

```json
{
  "agentId": "your-agent-id",
  "activeMatters": [{ "id": "mat_example", "title": "Release review", "type": "task" }],
  "recentMatters": [],
  "totalMatters": 1,
  "totalArchived": 0
}
```

活跃项包含 `id`、`title`、`type`；近期项还可能带 `completedAt` 和 `summary`。没有对话记忆时可返回空数组和零计数；这不表示该 Agent 没有任何历史消息，也不证明 Agent ID 存在。

## 读取话题的原始消息 {#matter-messages}

### `GET /api/conversation/:agentId/matters/:id/full`

用总览返回的话题 ID 读取；无分页参数。来源可为活跃、近期或归档话题。成功返回 `{ "matterId": "…", "messages": [...] }`，数组是话题来源的公开条目，不能假定每项都与逐 Run 消息完全同形。

**每次最多读取 120 条来源消息**；超过时额外返回 `"truncated": true`。公开投影还可能省略内部条目，返回长度不代表来源总数。接口没有提高上限或继续翻页的参数；需要逐 Run 完整历史时，使用有权读取的真实 Run ID 和消息分页接口。

```json
{
  "matterId": "mat_example",
  "messages": [{ "role": "user", "content": "Please review the release notes", "timestamp": 1792051200000 }],
  "truncated": true
}
```

## 工具结果与读取稳定性 {#history-result-privacy}

这些接口返回供显示和检索使用的消息视图。某些工具结果含凭据、界面内容等敏感信息，读取历史、会话快照或话题消息时，正文会改为占位提示。协议记录缺少可核验的工具调用身份、或身份信息矛盾时，也可能不返回结果正文。

- `toolUse[].summary` 或内容块中的工具结果可能被替换；执行中或中断的工具摘要也可能缺席。不要依赖占位文字的固定措辞。
- 对被隐藏的结果，`summaryRef`、`summaryIncomplete`、`externalizedPreview` 等正文引用或预览标记可能被移除。缺少引用不表示工具没有执行，也不表示可以自行拼接文件名取得正文。
- 判断工具结局时保留并读取实际的 `status`、`isError` 等状态字段。失败结果的占位仍表示失败；摘要中出现 `completed` 也不能证明本轮请求或整项业务成功。
- 需要敏感结果时，让用户通过原工具或应用重新取得所需数据。不要因为占位提示自动重跑工具、重复提交对话或代替用户批准操作。

同一条历史记录在不同读取时间可能因脱敏规则、显示去重或正在发生的写入得到不同的显示内容。消息 ID 和源行窗口用于定位，不保证正文始终逐字相同；这些读取接口也不代替完整备份或模型协议回放。上面的分页规则和请求终态判断仍分别适用。

## 可运行的读取示例 {#history-example}

**[下载 history.mjs](pathname:///api-examples/history.mjs)**。需要 Node.js 22 或之后版本，不需要安装 npm 依赖。

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

示例先验证实例握手，再发起 GET；不会提交查询、续聊或撤销运行。默认每个命令只读一页，`--all-pages` 最多读取 20 页，可用 `--max-pages` 调整。输出为逐行 JSON，包含历史正文，请按私密数据保存。

`list` 用 `--include-archived` 包含归档；`search` 另支持 `--type`、`--preferred-run-id` 和 `--preview-chars`。`messages` 的检查视图仅通过显式 `--inspect-run` 开启。

退出码 `0` 表示请求的读取成功，`1` 表示配置或 HTTP 请求失败，`2` 表示翻页达到设定上限、观测到总数变化而停止，或话题响应被截断。后续读取位置见停止记录中的 `nextOffset`；重新开始前应确认历史是否变化。

这些接口没有提供跨页一致性版本。执行中追加、编辑或清理历史，都可能让多次读取出现重复或遗漏。示例发现 `total` 变化会停止，但不能检测总数不变的内容改写；不要把一次分页扫描当成固定时点的审计快照。

## 常见错误 {#history-errors}

| HTTP / 错误 | 处理方式 |
|---|---|
| `400 agentId is required` | 搜索时提供真实 Agent ID |
| `400 Invalid history page parameters` | 搜索的 `limit`、`offset` 使用非负安全整数，并检查 `previewChars` 范围 |
| `400 Invalid runId` | 使用会话列表返回的 Run ID，不传路径或运行时 session ID |
| `401` | 检查实例令牌；若为 `User not authenticated` 或 `User not found`，请管理员检查当前实例用户资料 |
| `403 delegated_run_requires_inspect_view` | 对已授权的委派 Run 使用 `/messages?view=inspect-run`，不调用完整快照接口 |
| `404 Session not found` 或带 Run ID 的同类错误 | 记录不存在、已清除、不可读或归属不符；不要换身份或猜其他 ID 重试 |
| `404 Matter messages not found: …` | 话题或可读取的来源消息不存在；从当前总览重新选择；空的归档来源也可能无法返回消息 |

认证、服务尚未就绪、来源限制及代理返回 HTML 的处理，见[错误与排查](./03-errors-and-troubleshooting.md)。
