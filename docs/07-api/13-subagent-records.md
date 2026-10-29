---
title: 临时子智能体记录
description: 列出父 Run 的临时 Worker，并按有效条目位置读取经过公开字段投影的记录。
slug: /api/subagent-records
sidebar_position: 13
last-reviewed: 2026-10-29
keywords: [API, Worker, 临时子智能体, 记录, 分页]
---

# 临时子智能体记录

可以读取某个父 Run 派出的临时 Worker 列表、任务说明和记录片段。Worker **没有独立 Run**：调用时使用父 Run ID 和列表返回的 `workerId`。需要独立委派 Run 的历史时，使用[会话历史与消息](./08-session-history-and-messages.md)。

先完成[连接与认证](./01-connection-and-auth.md)，使用实例所有者的 `X-Agent-Service-Token`。只有父 Run 的所属用户可以读取；其他用户的父 Run 与不存在的父 Run 都返回 `404`。记录可能包含任务输入、思考过程、普通工具参数和业务内容，请按对话隐私保管。

| 用途 | 方法与路径 |
|---|---|
| 列出父 Run 的 Worker | `GET /api/runs/:id/workers` |
| 分页读取一个 Worker 的记录 | `GET /api/runs/:id/workers/:workerId/transcript` |

## Worker 列表 {#worker-list}

### `GET /api/runs/:id/workers`

使用有权读取的父 Run ID，无分页参数。成功返回 `{run_id, workers}`，按 `startedAt` 升序。没有派出 Worker 时返回空数组。

```bash
curl --silent --show-error \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  "${BASE_URL}/api/runs/${PARENT_RUN_ID}/workers"
```

```json
{"run_id":"parent-run","workers":[]}
```

每项至少包含 `workerId`、`startedAt`、`status`。可选字段包括 `kind`、`agentType`、`preset`、`task`、`callerAgentId`、`sessionId`、`endedAt`、`summary`、`error`、`entryCount`、`bytes`、`truncated`、`routeDecision`。只按实际字段显示，不能用缺席值补成成功。

`sessionId` 是该 Worker 的运行时子会话标识，不是一个新 Run ID。摘要的条数和字节信息也不能替代记录读取或业务结果核验。

## Worker 状态 {#worker-status}

| 状态 | 含义 |
|---|---|
| `running` | 仍观察为执行中 |
| `completed` | Worker 已正常结束；仍需检查其交付结果 |
| `failed` | Worker 失败 |
| `detached` | 同步等待已结束，Worker 仍可在后台执行 |
| `stopped` | 已显式停止 |
| `aborted` | 随父执行中止 |
| `interrupted` | 记录未正常收尾，已按父 Run 或服务重启事实判断为中断 |

读取时会推导状态：父 Run 不再运行时，残留的 `running` 变为 `interrupted`；重启前遗留的 `detached` 也会变为 `interrupted`。已有终态保持其含义。记录接口还可能返回 `unknown`，表示缺少可用的 Worker 索引；它不是完成。遇到未知的新值时保留未知，不据此自动继续任务。

## 分页读取记录 {#worker-transcript}

### `GET /api/runs/:id/workers/:workerId/transcript`

| 查询参数 | 规则 |
|---|---|
| `offset` | 从成功解析且格式有效的 entry 位置开始，默认 `0` |
| `limit` | 默认 `500`，夹限到 `1..2000` |

推荐传规范十进制整数。服务使用 `parseInt`：无效 offset 回到 `0`，无效 limit 回到 `500`，非正 limit 夹到 `1`；不能把其它接口的严格分页验证规则套用到这里。

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
  "entries":[{"seq":99,"at":1793260800000,"kind":"text","text":"正在检查文件。"}],
  "total":3,"offset":1,"limit":1,"truncated":false,"corruptLines":1
}
```

上例中索引缺失但记录文件可读，因此 `status` 为 `unknown`，没有 `worker` 摘要。`offset=1` 返回的 `seq=99` 说明两者不是同一游标。有可用摘要时另带 `worker`，其状态与响应顶层状态一致。

### 条目类型与续读

- `route`：实际路由决策的公开字段；`prompt`、`text`、`thinking`：输入、已聚合的正文或过程记录。
- `tool`：首次记录的工具调用；`tool_patch`：按同一 `toolId` 补齐参数、摘要或生命周期，后写覆盖先写。跨页显示时保留已有调用上下文，不能把 patch 当成新调用。
- `artifact`：已核验的文件产物引用；引用不授予文件访问权限。
- `truncated`：达到录制上限的标记；`end`：Worker 收尾事实。

`toolPhase` 与 Worker 的 `status` 分开，取 `requested/executing/completed/failed/interrupted/unknown`。工具失败的 `isError` 不能因摘要占位而丢失。

`total` 是当前有效 entry 总数，不是消息数。后续位置使用响应的 `offset + limit`，不是最后一个 `seq + 1`，也不是折叠后的消息条数。坏 JSON 或无效 entry 被跳过并计入可选 `corruptLines`。

`truncated: true` 表示录制曾达到条数或字节上限，之后除终局外不再录制；它不表示还有下一页，也不决定 Worker 是否结束。已有空文件返回 `200`、空 `entries`；缺失文件返回 `404`。父 Run 已结束不代表一定存在完整记录。

记录没有快照 revision 或持久 tail 游标。执行中追加、记录清理和公开投影规则变化会影响后续读取；清除对话也会清理 Worker 记录。需要最新显示时重新读取，不把显示记录作为模型恢复材料或完整备份。

## 公开字段与敏感结果 {#record-privacy}

:::info 生效版本
`v10.0.189+`（Worker 记录的敏感字段投影与有效 entry 分页）。
:::

新记录及旧记录的读取都按工具当前声明投影敏感字段和结果。敏感进度正文不会以早期 entry 外发；敏感终态结果可能变为占位，失败状态仍保留。缺少或矛盾的调用身份会使结果保守隐藏，不能凭记录自报的豁免标记取得正文。

额外回放属性和结果外置引用不在公开字段中；明确带类型的图片、音频或二进制内嵌字节也会被移除。普通 JSON 参数、普通字符串和纯 URL／`dc-media://` 引用可以保留；这不是任意业务正文的通用敏感检测。旧文件不会因此原地改写。

本页与普通历史各自使用自己的条目结构和分页规则。遇到占位时按[历史读取边界](./08-session-history-and-messages.md#history-result-privacy)处理，不自动重跑工具来补正文。

## 可运行示例 {#workers-example}

下载 **[workers.mjs](pathname:///api-examples/workers.mjs)**，使用 Node.js 22+，无需 npm 依赖：

```bash
export DESIRECORE_URL='https://your-instance.example'
export DESIRECORE_TOKEN='your-existing-owner-token'
node workers.mjs list --run-id parent-run
node workers.mjs transcript --run-id parent-run --worker-id worker-example \
  --limit 500 --all-pages --max-pages 20
```

示例先验证实例握手，默认只读一页。`--all-pages` 按 entry 窗口推进；观察到 total 改变或达到页数上限时以退出码 `2` 停止，已输出页面是部分结果。示例只输出原始分页信封，不自动折叠、tail、恢复执行或重试。

## 错误处理

| 响应 | 处理 |
|---|---|
| `400` | 使用服务返回的安全父 Run ID／Worker ID；分别编码路径段 |
| `401` | 检查实例令牌和可信用户身份 |
| `404` | 父 Run 不存在、无权读取或记录文件缺失；旧服务也可能没有路由，核对实例版本与支持范围 |
| `500` | 保存请求时间与路径供管理员排查，分享错误前移除路径和业务内容 |
| `503` | 按服务就绪响应处理；不将缺少记录解释为完成 |

完整字段见 [OpenAPI 下载](./07-openapi.md)。
