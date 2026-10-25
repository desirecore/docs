---
title: 错误与排查
description: 区分连接、认证、请求校验与后台执行失败，按实际响应处理 standalone 接入和 Agent Webhook 问题。
slug: /api/errors-and-troubleshooting
sidebar_position: 3
keywords: [API, 错误, 排查, Webhook, 401, 403, 503]
---

# 错误与排查

调用失败时，先检查 HTTP 状态、`Content-Type` 和响应正文。实例认证、启动状态、Webhook 处理和反向代理的错误格式不同，调用方需要保留实际响应，不能假设每个错误都有相同的 `code` 字段。

## 连接不上或收到网页

| 现象 | 检查与处理 |
|---|---|
| 域名无法解析、连接被拒或超时 | 确认使用实例的对外 HTTPS 地址和实际端口，检查实例进程、网络与反向代理状态 |
| TLS 证书验证失败 | 核对域名和证书信任链；本地测试证书须在调用环境中受信任 |
| 返回 `200`，正文却是 HTML | 检查地址与路径。使用 `${BASE_URL}/api/client-handshake` 验证，并确认 JSON 中的 `service` 为 `desirecore-agent-service` |
| 对外 `/health` 返回 HTML | 默认 standalone 部署没有将 `/health` 转发为外部 API；使用带令牌的认证握手 |
| 普通 API 请求返回 `404` | 核对方法、路径和目标部署支持范围；使用对外地址，避免误连容器内的其它监听端口 |

浏览器打开实例页面和 curl 请求 API 是两个不同的检查。页面能打开时，API 仍可能因代理、凭据或服务启动状态失败。

## 实例认证与启动错误

以下错误适用于[连接实例与认证](./01-connection-and-auth.md)中的认证握手。

| HTTP 状态 | 正文中的标识 | 含义与处理 |
|---|---|---|
| `401` | `error: "unauthorized"` | `X-Agent-Service-Token` 缺失或无效。确认令牌来自目标实例，并检查调用方是否仍使用轮换前的值 |
| `403` | `error: "origin_not_allowed"` | 调用页面来源未获部署允许。由部署者核对 `AGENT_SERVICE_CORS_ORIGIN` 中的精确来源；它不替代令牌 |
| `503` | `code: "service_not_ready"` | 服务正在启动。按 `Retry-After` 等待后重试只读握手；持续失败时检查启动日志 |
| `503` | `error: "instance_token_uninitialized"` | 实例访问令牌尚未初始化。部署者检查启动配置中的 `AGENT_SERVICE_TOKEN`；正常 standalone 启动要求该值 |
| `500` | 提示实例身份文件无法读取 | 部署者检查数据目录的权限和结构；保留原有实例数据，不通过删除身份文件尝试恢复 |

实例认证失败示例：

```json
{
  "error": "unauthorized",
  "message": "缺少或无效的实例访问令牌，请在请求头 X-Agent-Service-Token 中提供。"
}
```

启动未就绪示例：

```json
{
  "status": "starting",
  "service": "agent-service",
  "code": "service_not_ready"
}
```

启动与认证分别处理：错误令牌可能在启动期间就返回 `401`。只有确认为 `service_not_ready`，才按启动等待处理。浏览器的跨域限制还可能让脚本无法读取响应，应同时检查浏览器网络面板中的请求和预检结果。

## Webhook 请求错误

外部 [Agent Webhook](./02-agent-webhook.md) 使用管理员提供的目标 Agent secret，按 `Authorization: Bearer <secret>` 发送。调用前需要已配置并启用该事件；不要把模型供应商 Key 或另一个 Agent 的 secret 用于这个入口。

| HTTP 状态 | 正文中的 `error` 或现象 | 含义与处理 |
|---|---|---|
| `401` | `Invalid webhook secret` | secret 缺失或不匹配。检查目标 Agent 和 `Authorization`，使用大小写与空格均正确的 `Bearer <secret>` |
| `403` | `webhook_secret_required` | standalone 的目标 Webhook 没有配置有效 secret。请管理员检查并配置该 Agent 的专用 secret |
| `404` | `Agent not found` | 指定的 Agent 不存在；核对目标实例和 Agent ID |
| `404` | `Webhook not enabled for this agent` | 目标 Agent 的 Webhook 未启用；请管理员确认该事件已启用后再发送 |
| `400` | `Invalid request body` | 请求不符合字段要求。根据响应的 `details` 和端点参数说明修正请求 |
| `400` | `Unknown event type: ...` | `event` 没有对应配置；使用管理员交付的准确事件名 |
| `400` | JSON 解析错误 | 修正 JSON 语法，例如去除注释、尾逗号或未转义字符 |
| `413` | 请求体过大 | Webhook 请求体超过 `1 MiB`；按编码后的字节数缩小整个请求体，包括 `event` 和 `payload` |
| `415` | 不支持请求媒体类型 | 按端点示例使用 `Content-Type: application/json` |
| `500` | `Failed to parse agent.json` | 目标 Agent 配置无法解析；请管理员修正配置中的 JSON 错误 |

Webhook secret 校验失败示例：

```json
{
  "error": "Invalid webhook secret"
}
```

参数校验失败时，`Invalid request body` 响应的 `details` 包含校验信息。JSON 解析、媒体类型和体积限制由请求处理框架检查，它们的正文可能使用 `statusCode`、`error`、`message` 等字段。反向代理也可能直接返回文本或 HTML，应先确认响应类型，再读取对应正文。

## 已接收触发，仍没有结果

Webhook 的 `200` 和 `accepted: true` 表示已接收触发。响应中没有 Run ID 或最终结果；后台执行失败不会回写这次 HTTP 响应。

请管理员核对该事件是否匹配了预期的 prompt、是否具备执行权限，以及流程是否配置了结果交付。普通最终回答不会自动出现在聊天中，也不会成为 Webhook HTTP 响应。需要对话通知时，由管理员为流程安排并授权发送消息步骤；发送成功的消息出现在目标 Agent 的对话中。没有收到消息不能证明事件未执行、失败或已经完成。进一步观察方法见 [Agent Webhook](./02-agent-webhook.md)，后台失败需管理员检查实例执行日志。

请求超时或连接中断时，发送方可能不知道服务是否已经接收。当前 Webhook 没有公开幂等键，重发可能产生另一次执行。先对照已交付消息，并请管理员核对执行日志，再决定是否重发；不要把 Webhook 配置成无条件自动重试。只读握手可以按启动响应中的 `Retry-After` 重试。

## 提供排查信息

求助时记录请求时间、HTTP 方法和路径、状态码、响应类型、脱敏正文、握手中的 `serverVersion` 与 `instanceId`，以及是否在更新令牌后出现问题。提供日志片段前移除实例令牌、Webhook secret、供应商 Key 和业务数据。

## Webhook 配置冲突与权限

配置管理需要实例所有者访问权限，并要求握手返回 `capabilities.webhookManagement: true`。管理请求使用实例令牌；触发请求使用 Webhook secret。参见 [Webhook 配置步骤](./02-agent-webhook.md)。

`409 webhook_configuration_changed` 表示配置期间 Agent 的权限或其他配置发生变化。重新读取可用工具和现有事件，核对权限后再保存。`400 webhook_tool_unavailable` 表示工具 ID 当前不存在或无法唯一解析；重新从管理 GET 的 `availableTools` 选择。`409 webhook_configuration_invalid` 表示现有配置结构损坏，需要管理员修正。

## 对话、代理与工作流排查

对话超时后先使用示例的 `--recover` 读取准入记录；保留原请求 ID、摘要和状态文件，避免将未知状态当作未执行。详见[对话与 Run](./04-conversations-and-runs.md)。模型代理应核对本机 Base URL 和安全 token 的供应商绑定；Workflow Service 应核对独立地址和 `X-Workflow-Service-Token`，再按[工作流指南](./06-workflow-integration.md)检查 `runId` 与终态。

## 历史读取成功但结果不完整 {#history-projection-troubleshooting}

HTTP `200` 表示读取成功，不保证返回完整的工具结果正文。敏感结果或无法核验调用身份的结果可能只提供占位提示，并省略正文引用；这与执行失败、历史损坏或需要重跑不是一回事。保留实际的 `status`、`isError`，按[历史结果的读取边界](./08-session-history-and-messages.md#history-result-privacy)处理，不从占位文字推断成功或自动重试。

逐 Run 消息中的 `offset` 是字节位置，而分页请求的 `offset` 是源行位置；按请求窗口推进，不能用返回消息条数补算下一页。历史可能在读取期间变化，参见[会话历史与消息](./08-session-history-and-messages.md)。

## 网络连接正常但上游不可用

Socket.IO 已连接并不保证实例可访问模型供应商。先读取[上游网络状态](./10-observability.md#network-health)，结合 `reason`、`since` 和供应商范围排查；`unknown` 不是离线，历史 `online` 也不证明当前请求成功。近期调用和用量只是观察信息，不据此自动重放执行。
