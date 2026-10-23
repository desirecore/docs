---
title: 集成与 API
description: 连接实例、执行对话、配置 Agent Webhook，并接入模型代理和工作流服务。
slug: /api
sidebar_position: 0
keywords: [API, 集成, Webhook, Agent Service, 接入, 认证]
---

# 集成与 API

你可以从自己的脚本或服务连接 DesireCore，验证连接、执行对话、从外部事件触发智能体，或接入模型代理和工作流。先取得对应服务的地址与凭据，再根据用途选择指南。

## 选择接入方式

| 你想做什么 | 所需条件 | 阅读指南 |
|---|---|---|
| 用自己的程序连接实例 | 管理员提供 HTTPS 地址和实例访问令牌 | [连接与认证](./01-connection-and-auth.md) |
| 提交对话并观察结果 | 实例所有者访问权限、Agent ID；运行示例需要 Node.js 22+ | [对话与 Run](./04-conversations-and-runs.md) |
| 读取历史、分页消息与搜索 | 实例所有者访问权限、已知 Agent 或 Run | [会话历史与消息](./08-session-history-and-messages.md) |
| 上传附件、提交文件引用或访问媒体 | 实例所有者访问权限；媒体播放使用短期签名链接 | [附件与媒体](./09-attachments-and-media.md) |
| 从外部事件触发智能体 | 已启用事件和 Agent 级 Webhook secret；所有者配置需服务支持 `webhookManagement` | [Agent Webhook](./02-agent-webhook.md) |
| 通过本机代理调用模型协议 | 正在运行的本机代理和绑定供应商的安全 token | [模型代理](./05-model-proxy.md) |
| 触发现有工作流 | 独立 Workflow Service 地址、服务令牌和管理员提供的定义 | [工作流集成](./06-workflow-integration.md) |
| 将 HTTP 合同导入工具 | 选择对应服务的规范文件 | [OpenAPI 下载](./07-openapi.md) |
| 让 DesireCore 调用你的业务服务 | 通过 MCP、工具或技能连接 | [MCP 服务器连接](../02-user-guide/09-capabilities/03-mcp-integration.md)与[集成能力概览](../02-user-guide/09-capabilities/06-integrations-overview.md) |

## 凭据与结果

Agent Service 使用 `X-Agent-Service-Token`，外部 Webhook 使用 `Authorization: Bearer <Webhook secret>`。模型代理和 Workflow Service 各有独立凭据与权限范围；模型供应商 API Key 不能代替实例访问令牌。

握手的 `200` 证明该次请求已通过认证。对话提交的 `202` 和 Webhook 的 `200 accepted` 表示接纳或接收，应按对应指南观察完成与交付。对话事件使用 Socket.IO，工作流进度使用 SSE。

## 兼容性与稳定性 {#api-compatibility}

接入前验证握手与所需能力，并按具体端点处理状态码、字段和异步结果。连接成功不代表所有功能都可用；三种服务的地址与凭据也不能互换。

- 请求严格按对应 Schema 发送；不要把某个端点的额外字段或响应外壳套用到其它端点。
- 响应允许扩展时，可以忽略未使用的新增可选字段；仍要校验实例身份、必要字段和已知状态。遇到未知状态或缺席字段时保留未知，不自动补成 `idle` 或成功。
- OpenAPI 的 `info.version` 标识接口描述文件的修订，不是所有服务的统一兼容承诺，也不是客户端生效版本。具体支持条件见相应指南与实例返回值。
- 历史读取是显示视图，可能含脱敏占位并省略正文引用；详见[历史结果的读取边界](./08-session-history-and-messages.md#history-result-privacy)。网络超时、断线和结果未知时，按[接纳对账](./04-conversations-and-runs.md#request-reconciliation)处理，不直接创建新的执行。

## 开始接入

1. 向管理员取得实际服务地址与对应凭据。远程调用使用经过证书验证的 HTTPS 地址。
2. 完成连接验证或所选指南中的最小示例。
3. 检查实际响应与结果交付。遇到失败时参见[错误与排查](./03-errors-and-troubleshooting.md)。

:::tip 文档地址与实例地址
`https://docs.desirecore.com/api` 是文档页面。调用接口时，使用你自己的实例地址，例如 `https://agent.example.com`。
:::
