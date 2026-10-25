---
title: 实例诊断与用量
description: 读取实例的上游网络状态、近期工具调用和已记录用量，区分连接、执行结果与费用统计。
slug: /api/observability
sidebar_position: 10
keywords: [API, 网络状态, 工具调用, 用量, Token, 诊断]
---

# 实例诊断与用量

部署所有者可以使用已有实例地址和 `X-Agent-Service-Token` 读取以下观察信息。先完成[连接验证](./01-connection-and-auth.md)，再根据实际问题选择接口。

| 你需要判断什么 | 接口 | 不能据此推断什么 |
|---|---|---|
| 实例最近观察到的上游网络状况 | `GET /api/network/health` | 某个模型、工具或请求已经成功 |
| 当前用户最近的工具调用概览 | `GET /api/runs/recent-calls` | 全量审计历史、某轮对话已完成 |
| 当前用户已记录的 Token 和成本 | `GET /api/runs/usage/summary` | 供应商最终账单或精确本地日结 |

这些请求不提交对话，也不重放工具。它们读取的范围、时间和统计方式不同，不能拼成一次请求的完成证明。请求与终态关联仍按[对话与运行记录](./04-conversations-and-runs.md#request-reconciliation)处理。

## 上游网络状态 {#network-health}

### `GET /api/network/health`

无请求体和查询参数。成功直接返回状态对象：

```bash
curl --silent --show-error \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  "${BASE_URL}/api/network/health"
```

```json
{
  "status": "unknown",
  "reason": "init",
  "since": "2026-10-25T00:00:00.000Z",
  "seq": 0
}
```

| 字段 | 含义 |
|---|---|
| `status` | `online`：近期上游请求或探测成功；`degraded`：有网络失败或部分供应商不可达；`offline`：网络不可达已有探测等证据；`unknown`：尚无足够样本，例如启动或唤醒后 |
| `reason` | `init`、`request_ok`、`probe_ok`、`request_failed`、`probe_failed`、`stream_stall`、`multi_host_dns`、`suspend_resume` |
| `since` | 进入当前 `status` 的 ISO 时间；相同状态的原因变化不一定更新该时间 |
| `seq` | 当前网络监控实例的递增序号，用于比较快照和迟到事件；不是跨服务重启的持久版本 |
| `scope` | 可选 `global` 或 `provider`，仅对异常状态有意义 |
| `affectedProviders` | 可选供应商 ID 数组，配合 `scope: provider` 使用 |
| `subcategory` | 可选 `dns`、`tls`、`tcp_reset`、`refused`、`unreachable`、`timeout`、`stream_interrupted`，帮助定位网络问题 |

Socket.IO 连接正常只说明调用方与实例之间可连接，不证明实例能访问公网。`unknown` 不能当作离线；关闭网络监控时也可能一直是 `unknown`。没有活动请求时状态可能陈旧，`online` 也不表示每一家供应商都可用。

### 与实时事件配合

沿用[已认证 Socket.IO 连接](./04-conversations-and-runs.md#submit-conversation)，监听 `network:health`，其载荷与上述 HTTP 对象相同。先建立监听，再拉取 HTTP 快照；同一监控实例内仅采用较新的 `seq`，避免晚到的 HTTP 响应覆盖实时事件。新连接不会自动收到一份专用初始事件，重连后应再次补拉。

服务重启后序号可能重新开始，不要把旧连接保存的最大序号永久带入新连接。重新建立观察基线，再按新基线比较。这里没有事件回放或从网络状态推导安全重试执行的协议。

## 近期工具调用 {#recent-tool-calls}

### `GET /api/runs/recent-calls`

接口按服务端解析的可信用户筛选关联 Run，再返回按时间从新到旧排列的概览；不能通过查询参数切换到另一个用户。

| 查询参数 | 规则 |
|---|---|
| `limit` | 默认 `30`；单个十进制正整数字符串，转换后为安全整数；没有额外统一条数上限 |

不提供 `offset`、游标、`total` 或 `hasMore`。空值、负数、小数、重复参数、混杂字符串和非安全整数返回 `400`。

```bash
curl --silent --show-error --get \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  --data-urlencode 'limit=20' \
  "${BASE_URL}/api/runs/recent-calls"
```

```json
{
  "calls": [
    {
      "id": "example-tool-invocation",
      "timestamp": "2026-10-25T00:00:01.000Z",
      "agentId": "your-agent-id",
      "runId": "run-example",
      "toolName": "Read",
      "status": "success",
      "durationMs": 12
    }
  ]
}
```

每项只含上述元数据，不提供工具输入或输出正文。`id` 是不透明调用标识，保留原值，不从中拆出 Run、回执或分页位置；读取 Run 使用独立的 `runId`。

`status` 为 `success`、`warning` 或 `error`。有明确工具状态时使用该状态；旧回执缺少该信息时，标签可能来自整轮回执结果。时间也可能来自回执时间，不能据此证明工具副作用已完成、已撤回或某次提交成功。

`durationMs` 缺少记录时为 `0`，不代表已经测得零耗时。

这是近期概览，不是完整审计导出。读取可能使用有限的 Run 窗口；没有可用索引时只扫描最近 100 个当前用户 Run，不能靠增大 `limit` 穷举全部历史。清除聊天后仍可能保留相关回执中的调用概览。需要具体一轮结果时读取[执行回执](./04-conversations-and-runs.md#list-run-receipts)。

## 已记录用量 {#usage-summary}

### `GET /api/runs/usage/summary`

返回当前可信用户的聚合信息，不接收 `userId` 身份覆盖参数。

| 查询参数 | 规则 |
|---|---|
| `since` | 可选 ISO 时间；按 **Run 开始时间**筛选，不按每条回执时间筛选；无效值当前会被忽略 |
| `agentId` | 可选 Agent ID，按关联 Run 筛选 |
| `timezone` | 可选 IANA 时区，例如 `UTC`、`Asia/Shanghai`；无效值保留 UTC 日期，不返回参数错误 |

```bash
curl --silent --show-error --get \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  --data-urlencode 'since=2026-10-01T00:00:00Z' \
  --data-urlencode "agentId=${AGENT_ID}" \
  --data-urlencode 'timezone=UTC' \
  "${BASE_URL}/api/runs/usage/summary"
```

```json
{
  "total": {
    "inputTokens": 0,
    "outputTokens": 0,
    "cacheReadTokens": 0,
    "cacheWriteTokens": 0,
    "costUsd": 0,
    "queryCount": 0
  },
  "byModel": [],
  "byDate": [],
  "byAgent": []
}
```

上例是没有用量记录时的空汇总。实际 `byModel` 每项包含 `provider`、`model`，`byDate` 包含 `date`，`byAgent` 包含 `agentId`；各项还带与 `total` 相同的六个聚合字段。

- `inputTokens` 是非缓存输入，缓存读取和写入分别记在对应字段。
- `queryCount` 只统计有用量记录的回执查询，不等于 Run 数、全部提交数或工具调用次数。
- `costUsd` 是已记录的美元成本，不保证等于供应商最终收费；没有用量信息不等于实际没有消耗。
- `byDate` 以 UTC 日期桶为基础，指定时区时按 UTC 中午映射显示日期，不重新按每条事件归日；不能用于精确本地日结。
- 有筛选条件或索引不可用时，统计可能只覆盖最近最多 1000 个当前用户 Run。已清除的 Run 仍可能保留用量；结果不是无上限账单。
- 响应可能缓存约 30 秒。读取不发起模型请求，但可能触发服务端后台索引重建。

## 可运行读取示例 {#observe-example}

下载 **[observe.mjs](pathname:///api-examples/observe.mjs)**，使用 Node.js 22 或更高版本，无需安装 npm 包：

```bash
export DESIRECORE_URL='https://your-instance.example'
export DESIRECORE_TOKEN='your-existing-owner-token'
export DESIRECORE_AGENT_ID='your-agent-id'

node observe.mjs input-config
node observe.mjs network
node observe.mjs recent-calls --limit 20
node observe.mjs usage --agent-id your-agent-id --timezone UTC
```

示例先验证握手，再读取一个接口，输出 `{kind, instanceId, data}`。它不轮询、不自动重试，也不根据观察结果发起执行。返回的配置、调用名称和用量可能属于业务隐私，请保管输出文件。示例会提前拒绝格式不正确的时间、时区和数值；服务端的兼容处理仍以上述参数表为准。

## 常见错误

| 响应 | 处理方式 |
|---|---|
| `401` | 检查实例令牌与当前实例身份，不通过自报用户 ID 绕过 |
| `400`（近期调用） | 检查 `limit` 是否为单个正十进制安全整数 |
| `503 service_not_ready` | 按响应中的 `Retry-After` 等待后重读；不要因此重新提交工作 |
| `500` | 保存接口路径、状态和时间，检查实例日志；避免把令牌或业务正文写入共享日志 |
| `200` 却是 HTML | 地址或代理可能指向网页；重新执行认证握手并确认服务标识 |

更多认证、来源限制和响应处理见[错误与排查](./03-errors-and-troubleshooting.md)。
