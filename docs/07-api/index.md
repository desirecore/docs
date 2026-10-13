---
title: 集成与 API
description: 从外部程序连接 DesireCore 实例、验证连接并调用已配置的 Agent Webhook。
slug: /api
sidebar_position: 0
keywords: [API, 集成, Webhook, Agent Service, 接入, 认证]
---

# 集成与 API

你可以从自己的脚本或服务连接 DesireCore 实例，验证实例身份，或向已经配置的 Webhook 发送事件，让智能体在后台处理。先确认实例的访问地址、授权凭据和目标事件，再根据用途选择下方指南。

## 选择接入方式

| 你想做什么 | 所需条件 | 阅读指南 |
|---|---|---|
| 用自己的程序连接一个实例 | 部署管理员提供 HTTPS 地址和实例访问令牌 | [连接与认证](./01-connection-and-auth.md) |
| 从外部事件触发智能体 | 管理员已启用并验证事件，提供 Agent ID、事件名和 Webhook secret | [Agent Webhook](./02-agent-webhook.md) |
| 让 DesireCore 调用你的业务服务 | 服务提供 MCP 接口，或通过工具与技能连接 | [MCP 服务器连接](../02-user-guide/09-capabilities/03-mcp-integration.md)与[集成能力概览](../02-user-guide/09-capabilities/06-integrations-overview.md) |

Webhook 当前的自助创建与运行权限配置暂不可用。本指南说明已有有效配置的调用方法；准备接入时，请向实例管理员取得已验证的事件参数。

## 当前接口参考

| 方法与路径 | 用途 | 成功响应的含义 |
|---|---|---|
| `GET /api/client-handshake` | 验证实例访问权限，读取实例身份和能力信息 | 已通过认证并取得服务信息 |
| `POST /api/webhook/:agent_id` | 向目标智能体发送已配置的事件 | 触发已接收；不代表后台执行完成 |

两个接口使用不同凭据。实例读取使用 `X-Agent-Service-Token`，外部 Webhook 使用该事件所属配置的 `Authorization: Bearer <Webhook secret>`。模型供应商的 API Key 用于连接 AI 模型，不能代替这些实例接入凭据。

## 开始接入

1. 向实例管理员取得访问地址和对应用途的凭据。远程调用使用经过证书验证的 HTTPS 地址。
2. 按[连接与认证](./01-connection-and-auth.md)验证实例连接，或按[Agent Webhook](./02-agent-webhook.md)验证事件调用。
3. 检查实际响应和结果交付方式。遇到认证失败、网页响应或调用超时，参见[错误与排查](./03-errors-and-troubleshooting.md)。

:::tip 文档地址与实例地址
`https://docs.desirecore.com/api` 是文档页面。调用接口时，使用你自己的实例地址作为 `BASE_URL`，例如 `https://agent.example.com`；不要向文档站点发送业务请求。
:::
