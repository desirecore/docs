---
title: OpenAPI 下载
description: 下载 DesireCore 已公开 HTTP 端点的 OpenAPI 文件，选择正确的实例地址与凭据。
slug: /api/openapi
sidebar_position: 7
---

# OpenAPI 下载

你可以把下面的 JSON 文件导入支持 [OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0.html) 的 API 工具，查看参数、响应和认证要求。请求与响应声明使用 JSON Schema Draft 7 方言；文件只描述表中列出的公开 HTTP 端点。

**[下载 Agent Service OpenAPI JSON](pathname:///openapi/agent-service.json)**

另外提供 **[模型协议代理 OpenAPI JSON](pathname:///openapi/compat-proxy.json)** 和 **[Workflow Service OpenAPI JSON](pathname:///openapi/workflow-service.json)**。三份文件各自使用对应服务的地址与凭据。

## Agent Service 覆盖范围

| 方法与路径 | 用途 | 使用说明 |
|---|---|---|
| `GET /api/client-handshake` | 验证已有实例凭据与服务身份 | [连接实例与认证](./01-connection-and-auth.md) |
| `POST /api/webhook/{agent_id}` | 触发管理员已配置的智能体事件 | [智能体 Webhook](./02-agent-webhook.md) |
| `GET /api/agents/{id}/webhooks` | 读取事件配置与可选工具 | [智能体 Webhook](./02-agent-webhook.md) |
| `PUT /api/agents/{id}/webhooks/events/{event}` | 创建或替换事件，选择所需工具 | [智能体 Webhook](./02-agent-webhook.md) |
| `PATCH /api/agents/{id}/webhooks` | 开启或暂停事件触发 | [智能体 Webhook](./02-agent-webhook.md) |
| `DELETE /api/agents/{id}/webhooks/events/{event}` | 删除已有事件 | [智能体 Webhook](./02-agent-webhook.md) |
| `POST /api/agents/{id}/webhooks/secret/rotate` | 轮换智能体的专用 Webhook 密钥 | [智能体 Webhook](./02-agent-webhook.md) |
| `GET /api/agents/{agentId}/schedule-messages` | 读取可见的后台消息与交付 | [智能体 Webhook](./02-agent-webhook.md) |
| `GET /api/agents` | 读取智能体摘要列表 | [智能体列表](./04-conversations-and-runs.md#list-agents) |
| `GET /api/agents/{id}/input-config` | 读取轻量输入模式和配置摘要 | [输入配置](./04-conversations-and-runs.md#agent-input-config) |
| `GET /api/network/health` | 读取上游网络观察状态 | [实例诊断与用量](./10-observability.md#network-health) |
| `GET /api/runs/recent-calls` | 读取当前用户近期工具调用元数据 | [近期工具调用](./10-observability.md#recent-tool-calls) |
| `GET /api/runs/usage/summary` | 读取当前用户已记录用量汇总 | [已记录用量](./10-observability.md#usage-summary) |
| `GET /api/sessions/messages/all` | 按版本分页读取合并历史 | [合并历史](./08-session-history-and-messages.md#merged-history) |
| `GET /api/runs` | 按条件读取实例运行记录 | [运行列表](./04-conversations-and-runs.md#list-runs) |
| `GET /api/runs/{id}` | 读取单个运行的元信息 | [运行详情](./04-conversations-and-runs.md#get-run) |
| `GET /api/runs/{id}/runtime-state` | 读取运行的原始状态 | [运行状态](./04-conversations-and-runs.md#get-run-runtime-state) |
| `GET /api/runs/{id}/receipt` | 读取可信用户有权查看的回执 | [运行回执](./04-conversations-and-runs.md#list-run-receipts) |
| `POST /api/query/start` | 提交一次新对话请求 | [对话与运行](./04-conversations-and-runs.md) |
| `POST /api/query/follow-up` | 向已建立的会话提交下一轮 | [对话与运行](./04-conversations-and-runs.md) |
| `POST /api/query/client-requests/lookup` | 按稳定请求 ID 对账接纳状态 | [对话与运行](./04-conversations-and-runs.md) |
| `GET /api/sessions` | 列出历史会话 | [会话历史与消息](./08-session-history-and-messages.md) |
| `GET /api/sessions/{runId}` | 读取完整会话快照 | [会话历史与消息](./08-session-history-and-messages.md) |
| `GET /api/sessions/{runId}/messages` | 分页读取持久消息 | [会话历史与消息](./08-session-history-and-messages.md) |
| `GET /api/sessions/messages/search` | 搜索某个智能体的历史消息 | [会话历史与消息](./08-session-history-and-messages.md) |
| `GET /api/conversation/{agentId}/overview` | 读取话题总览 | [会话历史与消息](./08-session-history-and-messages.md) |
| `GET /api/conversation/{agentId}/matters/{id}/full` | 读取话题消息 | [会话历史与消息](./08-session-history-and-messages.md) |
| `POST /api/attachments` | 上传通用附件并取得文件引用 | [附件与媒体](./09-attachments-and-media.md) |
| `GET /api/attachments/{attachmentId}` | 下载当前用户的附件 | [附件与媒体](./09-attachments-and-media.md) |
| `POST /api/media/upload` | 上传图片、音频或视频 | [附件与媒体](./09-attachments-and-media.md) |
| `POST /api/media/access-urls` | 签发短期媒体访问链接 | [附件与媒体](./09-attachments-and-media.md) |
| `GET /media/{filename}` | 使用签名链接读取媒体与 Range | [附件与媒体](./09-attachments-and-media.md) |
| `GET /api/taskboards` | 列出可读任务板 | [TaskBoard 读取](./11-taskboards.md) |
| `POST /api/taskboards/query` | 查询任务板与任务 | [TaskBoard 读取](./11-taskboards.md) |
| `GET /api/taskboards/{id}` | 读取任务板投影 | [TaskBoard 读取](./11-taskboards.md) |
| `GET /api/taskboards/{id}/tasks/{taskId}` | 读取单个任务 | [TaskBoard 读取](./11-taskboards.md) |
| `GET /api/taskboards/{id}/activity` | 读取任务板交接证据 | [TaskBoard 读取](./11-taskboards.md) |
| `GET /api/taskboards/{id}/tasks/{taskId}/activity` | 分页读取任务活动 | [TaskBoard 读取](./11-taskboards.md) |
| `POST /api/taskboards/session-board/resolve` | 解析现有会话任务板 | [TaskBoard 读取](./11-taskboards.md) |
| `GET /api/s3/connections` | 读取已配置连接摘要 | [S3 对象读取](./12-object-storage.md) |
| `GET /api/s3/list` | 列出存储对象 | [S3 对象读取](./12-object-storage.md) |
| `GET /api/s3/download` | 下载对象字节或取得链接 | [S3 对象读取](./12-object-storage.md) |
| `GET /api/runs/{id}/workers` | 列出父 Run 的 Worker | [使用说明](./13-subagent-records.md) |
| `GET /api/runs/{id}/workers/{workerId}/transcript` | 按有效 entry 分页读取记录 | [使用说明](./13-subagent-records.md) |
| `GET /api/manual-topics/archived` | 读取当前用户的归档话题 | [使用说明](./08-session-history-and-messages.md) |
| `GET /api/sessions/{runId}/runtime-state` | 读取会话恢复引用 | [使用说明](./08-session-history-and-messages.md) |
| `POST /api/compute/preparation/retry` | 显式重试算力准备 | [使用说明](./10-observability.md) |
| `GET /api/team-archive` | 列出团队归档摘要 | [使用说明](./14-instance-management.md) |
| `POST /api/team-archive/{archiveId}/restore` | 显式恢复一份团队归档 | [使用说明](./14-instance-management.md) |
| `POST /api/workflow-definitions/{workflowId}/taskboard-bindings` | 绑定已有精确工作流定义 | [使用说明](./14-instance-management.md) |

花括号表示需要替换的路径参数，对应端点指南中的冒号写法。Webhook 管理操作要求认证握手中的 `capabilities.webhookManagement` 为 `true`，并使用实例所有者凭据。旧实例缺少该能力时，使用管理员已启用并验证的事件。运行列表和详情按部署所有者的实例读取范围使用；回执读取另外检查可信用户归属。

## 模型协议代理覆盖范围

| 方法与路径 | 用途 |
|---|---|
| `GET /v1/models` | 列出启用供应商配置中的模型 |
| `POST /v1/messages` | 发送 Messages 请求，可选择 SSE 流式响应 |
| `POST /v1/chat/completions` | 发送 Chat Completions 请求，可选择 SSE 流式响应 |

按[模型协议代理](./05-model-proxy.md)取得当前本机 Base URL 和绑定 Provider 的安全句柄。该 Base URL 已包含 `/v1`；在导入工具中设置服务器时使用它的来源地址，保留实际端口，让文件中的路径补上 `/v1`。`ProxyBearer` 使用 Bearer，`ProxyApiKey` 使用 `x-api-key`；同一操作可任选一种。

模型列表没有按句柄绑定的 Provider 筛选，列表出现模型不代表该句柄可调用它。文件呈现已公开的协议子集；可选参数、工具与结构化输出仍受转换器及目标后端约束。流内错误需要由客户端读取和处理。

## Workflow Service 覆盖范围

| 方法与路径 | 用途 |
|---|---|
| `GET /api/workflows` | 读取已部署工作流元数据 |
| `POST /api/workflow/webhook` | 通过必需查询参数 `id` 触发预置工作流 |
| `GET /api/workflow/events` | 通过必需查询参数 `runId` 观察 SSE 事件 |
| `GET /api/workflow/{id}/runs` | 读取可见的运行摘要 |
| `GET /api/workflow/{id}/runs/{runId}` | 读取单次运行详情 |

使用管理员独立交付的 Workflow Service 地址和 `WorkflowToken` 方案，对应请求头为 `X-Workflow-Service-Token`。默认 Agent Service 反向代理不开放这些工作流路径。见[工作流集成](./06-workflow-integration.md)。

工作流文件的响应声明呈现当前实现的字段，允许额外字段，不代表接口对所有字段执行了闭合 Schema 校验。预置 Webhook、事件观察和历史读取不签发 `executionGrantId`；文件不包含要求额外执行授权的 `/api/workflow/run`，也不包含已退役的定义写入操作。

## 导入后设置地址与认证

将文件的示例服务器 `https://your-instance.example` 替换为管理员交付的实例 HTTPS 地址；如果地址带有非标准端口，保留端口。这个地址不包含 `/api`，也不是文档站点地址。详见[连接实例与认证](./01-connection-and-auth.md)。

| 文件中的认证方案 | 提供什么 | 发送方式 |
|---|---|---|
| `InstanceToken` | 已有实例访问令牌 | `X-Agent-Service-Token: <实例令牌>` |
| `WebhookSecret` | 目标智能体的专用 Webhook 密钥 | `Authorization: Bearer <Webhook 密钥>` |
| `SignedMediaSignature` | 媒体签发接口返回的短期签名 | URL 查询参数 `signature`，并保留 `expires` |

上表适用于 Agent Service 文件。根据具体操作选择对应的方案。供应商 API Key 用于 DesireCore 连接模型供应商；模型代理和 Workflow 文件使用各自的地址与认证方案。

## 使用文件时注意响应含义

握手返回 `200` 表示当前凭据通过验证；某项功能能否使用还取决于实例配置、功能权限和实际能力。

Webhook 的 `200` 和 `accepted: true` 表示接收了触发，响应没有 Run ID 或最终结果。后台失败不会修改已返回的 HTTP 响应。结果交付、超时及重复请求的处理按 [Webhook 指南](./02-agent-webhook.md)执行。

各端点的错误结构不同，生成的调用代码也应保留 HTTP 状态与实际正文。反向代理还可能返回文本或网页；参见[错误与排查](./03-errors-and-troubleshooting.md)。

Socket.IO 的连接、订阅与异步事件需要配套客户端逻辑。OpenAPI 文件描述 HTTP 部分，不把这些事件作为 SSE 端点。

对话提交的 `202` 也不是运行完成反馈。先连接 Socket.IO，再使用当前连接的 `socket.id` 作为 `originSocketId` 提交；HTTP 请求与 Socket 连接必须属于同一认证主体。稳定的 `clientInstanceId` 位于 Socket 认证数据中。断线后按[对话与运行](./04-conversations-and-runs.md)的对账步骤处理，不把 Run 的 `idle` 状态当作某次提交成功的证据。

文件的 `info.version` 是这份 HTTP 接口描述的版本。它不代表 DesireCore 客户端的生效版本，也不代替握手中的 `serverVersion` 或 `apiProtocolVersion`。

媒体原生播放使用签发端点返回的完整 `/media/{filename}?expires=…&signature=…` 链接；该读取入口不使用实例令牌，链接应按短期凭据保管。附件下载仍使用实例认证。历史、话题和媒体的权限与响应范围见各自指南。

观察和聚合历史的可运行读取示例分别为 **[observe.mjs](pathname:///api-examples/observe.mjs)** 与 **[history.mjs](pathname:///api-examples/history.mjs)**。聚合历史的 revision 冲突需要重新读取，不能混拼旧页；用量聚合不等于供应商最终账单。

TaskBoard 与 S3 的读取示例分别为 **[taskboards.mjs](pathname:///api-examples/taskboards.mjs)** 和 **[s3.mjs](pathname:///api-examples/s3.mjs)**。查询游标、活动修订、对象续读令牌和下载模式按对应指南处理。

新增独立示例：**[workers.mjs](pathname:///api-examples/workers.mjs)** 读取 Worker，**[admin.mjs](pathname:///api-examples/admin.mjs)** 执行显式所有者管理操作。会话恢复引用、归档话题和算力准备使用更新后的 history／observe 脚本。
