---
title: 连接实例与认证
description: 使用部署者提供的实例地址和访问令牌，验证 standalone Agent Service 连接，区分实例认证与 Webhook secret。
slug: /api/connection-and-auth
sidebar_position: 1
keywords: [API, standalone, Agent Service, 实例令牌, 认证, client-handshake]
---

# 连接实例与认证

部署所有者可以从自己的程序或命令行访问独立部署的 DesireCore 实例。本页以已经运行的 **standalone Agent Service** 为例，说明地址和凭据的来源，并完成一次只读连接验证。

## 准备地址和令牌

你需要两项部署信息：

| 信息 | 用途 | 获取方式 |
|---|---|---|
| 实例对外地址 | 示例中的 `BASE_URL` | 使用该实例交付的 HTTPS 地址，包含实际使用的非标准端口 |
| 实例访问令牌 | 请求头 `X-Agent-Service-Token` | 使用启动实例时配置的 `AGENT_SERVICE_TOKEN` |

如果使用开实例工具保存了部署清单，可以在部署项目的 `.deploy/instances/<实例名>/instance.json` 中查看 `token` 字段，地址以该实例的交付信息为准。手动启动的实例则从你保管的进程或容器启动配置中取得 `AGENT_SERVICE_TOKEN`。这是已有部署的令牌；临时生成一个新值不能认证正在运行的实例。

例如，对外地址为 `https://agent.example.com` 时，使用这个地址作为 `BASE_URL`；交付地址带有端口时保留端口。`BASE_URL` 不包含 `/api`、页面路径、查询参数或末尾斜杠。容器内服务端口不是对外交付地址，不能据此猜测外部调用端口。

`https://docs.desirecore.com/api` 是文档阅读地址。下面的请求应发往你自己的实例。

## 选择对应的凭据

| 你要做什么 | 使用的凭据 | 发送方式 |
|---|---|---|
| 以部署所有者身份调用实例 API | 实例访问令牌 | `X-Agent-Service-Token: <实例令牌>` |
| 从外部服务触发管理员已配置并验证的 Agent Webhook | 管理员提供的目标 Agent Webhook secret | `Authorization: Bearer <Webhook secret>` |
| 让 DesireCore 连接模型供应商 | 供应商 API Key | 在[配置 API Key](../01-getting-started/04-configure-api-key.md)中设置 |

实例访问令牌代表实例所有者的访问权限，应由部署所有者或受信任的服务保管。Webhook secret 只用于对应 Agent 的触发入口；仅需要触发事件的服务使用该 secret 即可。各接口仍有自己的配置、执行权限和审批要求。

桌面客户端的实例地址和凭据由其连接机制管理，本页的部署清单路径不适用于桌面客户端。桌面配对取得的客户端凭据持续有效至撤销，重启不会自动撤销；`interactive` 标记不代表严格的最小权限。配对凭据不能与所有者令牌互换，也不能直接套用下面的所有者接入流程。

## 验证连接

将下列占位值替换为你已有实例的地址和令牌，在命令行执行：

```bash
BASE_URL='https://agent.example.com'
AGENT_SERVICE_TOKEN='replace-with-your-existing-instance-token'

curl --silent --show-error --include \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  "${BASE_URL}/api/client-handshake"
```

### `GET /api/client-handshake`

| 项目 | 说明 |
|---|---|
| 请求体 | 无 |
| 必需请求头 | `X-Agent-Service-Token` |
| 成功状态 | `200 OK`，JSON 响应 |
| 响应缓存 | `Cache-Control: no-store, private` |

以下为响应结构示例，版本、实例标识、时间和能力值以你的实例实际响应为准：

```json
{
  "service": "desirecore-agent-service",
  "apiProtocolVersion": "1",
  "serverVersion": "10.0.180",
  "instanceId": "inst_0123456789abcdefghijklmnopqrstuv",
  "deploymentMode": "external",
  "clientCompatibility": {
    "minimumVersion": "0.0.0",
    "maximumVersion": null
  },
  "capabilities": {
    "workflow": false,
    "mediaSignedUrl": true,
    "pdfRendering": false,
    "localPairing": true,
    "queryRequestIdEcho": true
  },
  "authentication": {
    "kind": "instance-token",
    "scopes": ["owner"]
  },
  "serverTime": "2026-10-13T08:00:00.000Z"
}
```

确认以下字段后，再继续调用具体功能：

| 字段 | 如何使用 |
|---|---|
| `service` | 必须为 `desirecore-agent-service`，避免连接到其它服务或网页 |
| `instanceId` | 标识该实例的数据空间；保存后可用于发现是否连到了另一个实例 |
| `deploymentMode` | `external` 和 `owner` 均为 standalone 形态；`embedded` 表示桌面实例 |
| `apiProtocolVersion` | 握手与连接协议编号，当前为字符串 `"1"` |
| `serverVersion` | 实例的软件版本，用于排查兼容问题 |
| `clientCompatibility` | DesireCore 客户端的连接兼容范围，`maximumVersion: null` 表示未设上限 |
| `capabilities` | 当前部署的能力信息；功能不可用时不能仅凭连接成功推断可用 |
| `authentication` | 部署形态的认证类型和实例作用域，具体操作还需满足相应接口的权限要求 |
| `serverTime` | 服务端响应时间，可用于排查时钟差异 |

握手验证已有凭据和目标服务，成功后不会签发新令牌，也不代表模型服务、Agent 权限或所有可选功能都已经配置完成。客户端连接兼容范围与单个功能的生效版本分别按各自含义使用。

### 启动期间的响应

实例尚未完成启动时，带有效令牌的握手可能返回：

```http
HTTP/1.1 503 Service Unavailable
Retry-After: 1
Cache-Control: no-store
```

```json
{
  "status": "starting",
  "service": "agent-service",
  "code": "service_not_ready"
}
```

按 `Retry-After` 等待后重试这次只读握手。持续返回该响应时，检查实例的启动日志。令牌缺失或错误仍会返回 `401`，不能通过反复等待解决认证失败。

## 探活与连接验证

`GET /health` 供直连服务监听地址的探针使用，不要求实例访问令牌；它只报告服务状态。在默认 standalone 反向代理部署中，该路径没有作为对外 API 转发，外部调用使用上面的认证握手。

直连探针在启动未就绪时也会收到 `503 service_not_ready`；可以接收请求后，响应示例如下：

```json
{
  "status": "ok",
  "service": "agent-service",
  "protocol": "http",
  "fullReady": true
}
```

`protocol` 表示被探测的 HTTP 或 HTTPS 监听服务；`fullReady` 是后台初始化的诊断信息，可以在服务已经接收请求时仍为 `false`。探活成功不能验证实例令牌、目标实例身份或某个 Agent 的运行结果。对外地址的 `/health` 即使返回 `200`，也可能是网页 HTML，不能作为 API 连接成功依据。

## 保管与更新令牌

把实例令牌保存在受信任的服务配置中，避免写入网页源码、公开仓库、URL 或共享日志。standalone 启动日志只说明令牌已设置，不回显令牌值。

更新实例令牌时，修改你保管的启动配置中的 `AGENT_SERVICE_TOKEN`，重新启动或重建对应服务进程，再更新调用方配置。仍使用原配置重启不会撤销旧令牌。使用部署清单时也要同步维护其中的令牌，避免下次启动恢复旧值。Webhook secret 由管理员在目标 Agent 的 Webhook 配置中单独更新，并通知调用方替换。

浏览器页面调用还受 HTTPS、浏览器跨域规则以及部署者配置的允许来源影响。实例启用来源限制时，`AGENT_SERVICE_CORS_ORIGIN` 使用调用页面的精确来源，例如 `https://app.example.com`，不包含页面路径。来源获准仍需要有效凭据；不要把所有者令牌嵌入提供给其他用户的网页。

## 下一步

- [Agent Webhook](./02-agent-webhook.md)：通过目标 Agent 的专用 secret 触发事件。
- [错误与排查](./03-errors-and-troubleshooting.md)：处理认证、启动、请求和异步执行问题。
