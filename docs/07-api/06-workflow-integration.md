---
title: 工作流集成
description: 使用独立 Workflow Service 的地址与访问令牌，触发管理员预置工作流并观察实时事件和执行历史。
slug: /api/workflow-integration
sidebar_position: 6
keywords: [API, Workflow Service, 工作流, Webhook, SSE, 执行历史, 授权]
---

# 工作流集成

可信的部署所有者或管理员客户端可以通过**独立部署的 Workflow Service** 触发已有工作流，再用返回的运行 ID 观察事件和读取历史。本页说明管理员已经部署、验证并允许从 Webhook 入口触发的全局工作流，不提供任意工作流或任意用户资源的执行授权。

## 准备独立地址与凭据 {#workflow-connection}

| 信息 | 获取方式 |
|---|---|
| `WORKFLOW_URL` | 管理员交付的 Workflow Service 地址。直接本机调用使用实际监听地址；远程调用使用管理员另外配置的 HTTPS 地址 |
| `WORKFLOW_SERVICE_TOKEN` | 独立工作流进程启动配置中的 `WORKFLOW_SERVICE_TOKEN`；部署未单独设置时可能采用所配置的 `AGENT_SERVICE_TOKEN`，须由管理员确认 |
| `WORKFLOW_ID` | 管理员提供的已部署全局工作流 ID，可用下文列表核对；显示名称不能替代 ID |
| 参数约定 | 管理员说明工作流允许的输入、执行操作与结果。先用一个无外部副作用的测试流程确认接入 |

工作流服务默认绑定本机回环地址，实际端口以启动就绪信息或管理员交付为准。它与 Agent Service 使用不同的服务地址和请求头；即使部署复用了同一个令牌值，仍发送 `X-Workflow-Service-Token`。

默认 Agent Service 容器部署不包含对外工作流服务入口，其反向代理会拒绝 `/api/workflow/*`。不能只在 Agent Service 的地址后添加工作流路径就认为可用。需要管理员单独提供可访问的 Workflow Service 地址。

本页的独立服务接入中，所有下述业务请求，包括 SSE，都必须发送有效的 `X-Workflow-Service-Token`。这是一份服务访问凭据，不是某个用户、任务或工作流的独立执行授权。`runId` 和工作流 ID 也不能代替凭据或资源权限检查。

## 核对可触发工作流 {#list-workflows}

### `GET /api/workflows`

无请求体，不提供分页参数。返回 `{ "workflows": [...] }`，每项包含：

| 字段 | 含义 |
|---|---|
| `id`、`name`、`description`、`creator` | 工作流 ID、显示名称、说明和创建者描述 |
| `nodeCount` | 定义中的节点数量 |
| `dslPath` | 服务端管理的定义路径；不是调用方机器上的文件路径，也不是访问凭据 |
| `lastRun` | 可选的最近运行压缩摘要，包含 `status`、`taskBoardBound`，可能有完成时间和耗时 |

```bash
WORKFLOW_URL='https://workflow.example.com'
WORKFLOW_SERVICE_TOKEN='replace-with-the-configured-workflow-service-token'
WORKFLOW_ID='your-workflow-id'

curl --silent --show-error \
  --header "X-Workflow-Service-Token: ${WORKFLOW_SERVICE_TOKEN}" \
  "${WORKFLOW_URL}/api/workflows"
```

列表发现用于核对管理员交付的定义，不证明所有工作流都获准执行；无法解析的定义也可能不在列表中。

## 触发预置工作流 {#trigger-workflow-webhook}

### `POST /api/workflow/webhook?id=...`

| 项目 | 约定 |
|---|---|
| 查询参数 `id` | 必需，已部署全局工作流的 ID |
| 请求头 | `X-Workflow-Service-Token`、`Content-Type: application/json` |
| 请求体 | 本例使用 JSON 对象，其字段作为该工作流的参数；省略时按空对象处理 |
| 成功响应 | `200`，包含 `runId`、`workflowId`、`status: "started"` |

下面假设管理员已为这个工作流约定 `name` 参数。实际字段按工作流的输入要求替换：

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

保存实际返回的 `runId`。`started` 表示服务已接收并安排这次异步运行，后续定义解析、节点执行、权限或服务依赖仍可能失败。它不代表工作流完成。

这个工作流 Webhook 使用服务令牌，与[智能体 Webhook](./02-agent-webhook.md)的 Bearer secret 和事件体格式不同。本入口没有请求去重或公开幂等键；把业务事件 ID 放进参数也不会自动去重。响应丢失时可能已经执行，不要直接重发来猜测结果。

## 观察实时事件 {#workflow-events}

### `GET /api/workflow/events?runId=...`

发送返回的 `runId` 和服务令牌，响应为 `text/event-stream`：

```bash
WORKFLOW_RUN_ID='replace-with-the-returned-run-id'

curl --no-buffer --silent --show-error --get \
  --header "X-Workflow-Service-Token: ${WORKFLOW_SERVICE_TOKEN}" \
  --data-urlencode "runId=${WORKFLOW_RUN_ID}" \
  "${WORKFLOW_URL}/api/workflow/events"
```

每个事件由 `event:` 名称和 JSON `data:` 组成，常见事件包括：

| 事件 | 观察内容 |
|---|---|
| `workflow:started` | 工作流与运行 ID、名称、总节点数 |
| `workflow:node_start` | 节点 ID、类型与可能存在的显示名 |
| `workflow:node_complete` | 节点输入/输出与耗时 |
| `workflow:node_error` | 节点 ID 和错误；还需观察整次运行结果 |
| `workflow:human_gate` | 人工确认等待信息，不等于运行完成 |
| `workflow:complete` | 运行状态和可能存在的最终输出；必须读取 `status` |
| `workflow:error` | 运行错误，可能包括失败节点 |

同一运行使用一个活动订阅。该流按服务访问凭据放行，供可信的管理员客户端使用，不能作为任意终端用户按 Run ID 读取资源的权限接口。浏览器原生 `EventSource` 不能直接设置这个自定义认证头；浏览器集成需使用能带请求头的 fetch 流读取，令牌不放入 URL。

已经在当前服务进程结束的运行重新连接时，可能只收到一条 `workflow:complete`，其中 `status` 也可能是 `failed`。事件名称本身不代表成功。历史运行或进程重启后不再存在的实时上下文可能返回 `404`，应改查下面的历史端点。

SSE 不是持久的全部事件重放接口。断线、流结束或没有收到事件都不能独立证明任务成功；使用运行 ID 读取状态与历史，对无法确认的情况保留未知。

## 读取运行历史 {#workflow-history}

### `GET /api/workflow/:id/runs`

返回 `{ "runs": [...] }`，合并当前活跃运行和已保存历史，按 `startedAt` 从新到旧排序，不提供分页参数。摘要项的关键字段示例：

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

摘要还可能含 `completedAt`、`totalDurationMs`、`error` 和已授权的任务/执行归属信息。活跃运行的节点计数可能暂为 `0`，不能据此推断工作流定义没有节点。

### `GET /api/workflow/:id/runs/:runId`

返回单次运行的详情对象，包含 `workflowId`、`runId`、`status`、`startedAt` 和 `taskBoardBound`。结束后可能有 `completedAt`、`totalDurationMs`、`nodeResults`、`finalOutputs`、`error`；等待人工确认时可能有 `humanGate`。

```bash
curl --silent --show-error \
  --header "X-Workflow-Service-Token: ${WORKFLOW_SERVICE_TOKEN}" \
  "${WORKFLOW_URL}/api/workflow/${WORKFLOW_ID}/runs/${WORKFLOW_RUN_ID}"
```

`running`、`waiting_human` 表示仍在执行或等待确认；`completed`、`failed`、`cancelled`、`interrupted` 是结束状态。核对 `status`、错误和输出后判断本次运行。Workflow 的 `runId` 属于工作流服务，不能拿去调用 Agent Service 的 `/api/runs/:id/receipt`。

### TaskBoard 关联记录

历史列表与详情会检查关联的 TaskBoard 资源权限；无法读取的任务记录不会作为可见结果返回。按任务范围查询时，参数为：

| 查询参数 | 条件 |
|---|---|
| `boardId` | 指定任务范围时必需 |
| `workflowBindingId` | 指定任务范围时必需，必须属于该工作流及相应 Board/Task |
| `taskId` | 可选；提供时必须非空且与相应绑定匹配 |

这些是筛选与资源定位信息，不授予访问权。字段组合无效或资源权限不足时可能返回 `403`；详情不在指定任务范围内时返回 `404`。列表为空也可能来自权限筛选或不可读历史，不能据此推断从未执行。

## 手动运行与定义修改的支持范围 {#workflow-supported-scope}

`POST /api/workflow/run` 要求有效 `executionGrantId`、`idempotencyKey` 和对应定义引用或获准的定义路径；服务访问令牌不能替代执行授权。上述触发与读取接口不签发这项授权。手动运行需要产品支持的工作流操作，或管理员另外提供的授权集成流程；本页的快速开始使用预置 Webhook。不能自造 grant 或复制内部权限对象。

旧 `POST /api/workflows` 创建定义和 `PUT /api/workflow/:id` 覆盖定义的入口已退役，返回 `410`。使用现有工作流管理流程维护定义，本页只触发管理员已预置且适用该 Webhook 的工作流。需要人工确认时使用相应产品流程；不能把收到 `human_gate` 消息当成已批准执行。

## 错误与恢复 {#workflow-errors}

| HTTP 状态或现象 | 含义与处理 |
|---|---|
| `401 unauthorized` | 缺少或无效的工作流服务令牌；确认专用请求头与服务地址 |
| `503 workflow_service_not_initialized` | 工作流服务访问凭据未初始化；请管理员检查启动配置 |
| `503 WORKFLOW_OWNER_FENCED` | 服务暂时不能安全提供相关操作；保留响应并请管理员检查服务状态，不无条件重发触发请求 |
| 触发 `400 id query parameter is required` | 补充管理员提供的工作流 ID |
| 触发 `404` | 指定的全局工作流不可读取或不存在；核对服务与 ID |
| 触发 `503 Unable to reserve workflow run` | 无法为这次触发预留运行；确认实际响应并检查服务状态 |
| 事件 `400 runId is required` / `404 Run not found` | 缺少运行 ID，或当前进程没有该实时运行；核对 ID，并读取历史 |
| 历史 `403` / `404` | 资源权限、工作流与运行匹配或任务范围不满足；不要绕过归属检查 |
| 触发成功后失败或 SSE 中断 | HTTP 接收成功不代表完成；按实际返回的运行 ID 查历史，不能确认时保留未知 |
| 请求格式、体积或服务依赖错误 | 保留实际状态与正文，修正请求或请管理员排查依赖；不同错误不保证统一包装 |

重试只读查询可以更新观察结果；重新触发会创建另一次运行。没有收到触发响应时，不要把某条“最近运行”直接归为本次请求。

## 相关参考

- [任务编排](../04-concepts/10-task-orchestration.md)：工作流的使用方式与节点。
- [OpenAPI 下载](./07-openapi.md)：本页公开操作的参数和响应范围。
