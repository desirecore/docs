---
title: 模型协议代理
description: 取得本机模型代理地址与 Provider 绑定的安全令牌，调用 Messages、Chat Completions 和 Models，并处理流式与兼容限制。
slug: /api/model-proxy
sidebar_position: 5
keywords: [API, Compat Proxy, 模型代理, 安全令牌, Provider, Messages, Chat Completions]
---

# 模型协议代理

DesireCore 的 **Compat Proxy** 让本机程序使用已配置的模型供应商，以 Messages 或 Chat Completions 格式发起请求。调用方使用 `desirecore_` 开头的安全令牌，代理负责取得对应供应商凭据并转发或转换请求。

本页适用于与代理运行在同一台机器上的受信任程序。默认入口只监听 `127.0.0.1`，端口动态分配；它与 Agent Service 的 `/api` 及实例访问令牌分别使用。代理请求体上限为 `256 MiB`。

## 获取地址、模型与安全令牌 {#proxy-credentials}

1. 在[算力服务](../02-user-guide/10-settings/04-compute-service.md)中配置并验证目标供应商。
2. 在 DesireCore 对话中，请受信任智能体调用 `InspectModels`，核对目标 **Provider ID** 与准确的 `modelName`。同名模型可能属于不同 Provider，使用具体配置的 ID。
3. 请智能体调用 `ComputeCredential` 的 `action: "list"`，确认可取得凭据的 Provider，并读取当前本机兼容代理的 Base URL。这个地址已包含 `/v1`。
4. 对选定 Provider 调用 `ComputeCredential`，参数为 `{"action":"get","provider":"<Provider ID>"}`，不设置 `raw: true`。默认返回可撤销的 `desirecore_` 安全句柄。
5. 请智能体将句柄注入你指定的受保护本机程序配置，并用下面的小请求验证。工具卡可能显示敏感结果占位，安全 Token 面板也只展示识别片段；不以它们作为复制完整句柄的入口。

可以这样提出任务：

> 查询我已配置的对话模型，确认 Provider ID 和 modelName。用 ComputeCredential list 取得当前本机兼容代理 Base URL，再为选定 Provider 获取默认安全 token，将它注入我指定的本机程序配置，并验证一次只回复 OK 的请求。

如果工具显示代理未运行，先恢复服务再调用；如果已有实例的工具结果没有地址，请管理员提供已确认的当前回环地址。`InspectModels` 的模型元数据不代替代理地址；供应商上游 `baseUrl` 也不能用于发送这个安全句柄。

| 示例变量 | 来源与含义 |
|---|---|
| `PROXY_BASE_URL` | 当前代理返回或管理员确认的本机 Base URL，已含 `/v1`，不带末尾斜杠 |
| `PROXY_TOKEN` | `ComputeCredential` 默认 `get` 返回的完整安全句柄 |
| 模型名 | 选定 Provider 中准确的 `modelName`；示例中的占位值需替换 |

同一个安全令牌只绑定签发时指定的 **Provider 配置 ID**。即使请求传入其它 `x-desirecore-provider-id`，也不能改换它所绑定的 Provider；绑定的 Provider 不服务该模型时不会转到另一家。当前不能把这种绑定理解为模型级白名单、调用预算或自动到期限制。

句柄是一份可使用的访问凭据，保存在受保护本机配置中。任何可访问该本机入口且持有句柄的程序都能使用其绑定的 Provider；签发记录中的 Agent 名称不代表每次 HTTP 调用都重新验证了该程序的身份。

## 查看模型列表 {#proxy-models}

### `GET /v1/models`

使用 Bearer 令牌或 `x-api-key` 认证，无请求体和分页参数：

```bash
PROXY_BASE_URL='replace-with-the-returned-local-base-url'
PROXY_TOKEN='replace-with-your-desirecore-safe-token'

curl --silent --show-error \
  --header "Authorization: Bearer ${PROXY_TOKEN}" \
  "${PROXY_BASE_URL}/models"
```

```json
{
  "object": "list",
  "data": [
    {
      "id": "your-model-name",
      "object": "model",
      "created": 1791943200,
      "owned_by": "openai"
    }
  ]
}
```

`id` 为模型名，`owned_by` 为供应商类型，不是 Provider 配置 ID；`created` 是列举时生成的 Unix 时间，不能当作模型发布时间。

当前模型列表汇总所有启用 Provider 的配置模型，**没有按安全令牌绑定的 Provider 筛选**。列表出现某个模型不证明这枚令牌可调用它，也不证明该模型当前可用；调用仍受 Provider 绑定、配置与供应商状态约束。用 `InspectModels` 的 Provider 信息核对你的目标。

## Messages 请求 {#proxy-messages}

### `POST /v1/messages`

使用 Anthropic Messages 请求格式。下面使用文本消息、不启用流式，并将输出上限设为 `64`：

```bash
curl --silent --show-error --include --request POST \
  --header "x-api-key: ${PROXY_TOKEN}" \
  --header 'anthropic-version: 2023-06-01' \
  --header 'Content-Type: application/json' \
  --data '{"model":"your-model-name","max_tokens":64,"stream":false,"messages":[{"role":"user","content":"Reply only with OK."}]}' \
  "${PROXY_BASE_URL}/messages"
```

| 字段 | 用途 |
|---|---|
| `model` | 绑定 Provider 中的准确模型名 |
| `messages` | Messages 消息数组，本例为一条 user 文本消息 |
| `max_tokens` | Messages 格式的输出上限 |
| `system` | 可选系统提示；字符串或符合该协议的系统内容块 |
| `stream` | 可选布尔值，默认 `false`；为 `true` 时接收 SSE |
| `temperature`、`top_p`、`stop_sequences` | 可选生成参数，须符合目标模型的限制 |
| `tools`、`tool_choice`、`thinking`、`output_config` | 可选工具与思考/输出配置，受协议转换及目标后端支持范围约束 |

非流式响应结构示例：

```json
{
  "id": "msg_example",
  "type": "message",
  "role": "assistant",
  "content": [{ "type": "text", "text": "OK" }],
  "model": "your-model-name",
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": { "input_tokens": 6, "output_tokens": 1 }
}
```

读取 `content` 和 `stop_reason`。例如 `tool_use` 表示模型请求工具调用，不表示工具已经执行；程序需要自己执行获准工具并按协议提交工具结果。`max_tokens` 等停止原因也不能当成完整业务成功。

## Chat Completions 请求 {#proxy-chat-completions}

### `POST /v1/chat/completions`

使用 OpenAI Chat Completions 请求格式：

```bash
curl --silent --show-error --include --request POST \
  --header "Authorization: Bearer ${PROXY_TOKEN}" \
  --header 'Content-Type: application/json' \
  --data '{"model":"your-model-name","max_completion_tokens":64,"stream":false,"messages":[{"role":"user","content":"Reply only with OK."}]}' \
  "${PROXY_BASE_URL}/chat/completions"
```

| 字段 | 用途 |
|---|---|
| `model`、`messages` | 目标模型与 Chat Completions 消息数组 |
| `max_completion_tokens` | 可选输出上限，符合目标模型和后端约束 |
| `stream`、`stream_options` | 可选流式设置；支持的用量信息取决于后端 |
| `temperature`、`top_p`、`stop` | 可选生成参数 |
| `tools`、`tool_choice`、`parallel_tool_calls` | 可选 function 工具定义和选择；转换不代表代理替程序执行工具 |
| `reasoning_effort`、`response_format` | 可选思考与输出约束，须符合目标模型和转换后端的支持范围 |

```json
{
  "id": "chatcmpl_example",
  "object": "chat.completion",
  "created": 1791943200,
  "model": "your-model-name",
  "choices": [
    {
      "index": 0,
      "message": { "role": "assistant", "content": "OK" },
      "finish_reason": "stop"
    }
  ],
  "usage": { "prompt_tokens": 6, "completion_tokens": 1, "total_tokens": 7 }
}
```

读取 `choices[].message`、`finish_reason` 和实际返回的用量；`tool_calls`、`length` 等结束原因需要分别处理。用量字段缺席不能当作零消耗。

## 流式与协议范围 {#proxy-streaming}

将请求中的 `stream` 改为 `true`，用支持 SSE 的客户端读取；curl 可添加 `--no-buffer`。Messages 与 Chat Completions 各自返回对应协议的流式数据。代理会按目标供应商的接入格式选择转发或转换，因此它们不是完整供应商 API 的通用替代。

HTTP `200` 或第一段文本不能证明流正常结束。客户端需要读取该协议的结束标记，同时检查流内错误；中途断线、超时、空响应或未收到结束信息时，保留已读内容并报告未完整完成。错误可能发生在响应头已经发出之后，不能只检查最初的 HTTP 状态。

跨协议工具定义和结构化输出受转换器及目标后端约束。尤其是订阅后端可能拒绝不支持的 Schema、工具选择或参数；不要把给 DesireCore 内部工具生成的标记、beta 参数或复杂 Schema 当成外部接口普遍支持。先使用本页的文本小请求，再按目标后端逐项验证所需能力。

本页公开的入站接口为 `/v1/models`、`/v1/messages`、`/v1/chat/completions`。没有 `/v1/responses` 入站接口承诺；配置中使用 Responses 的供应商不意味着代理接受同名请求。

## 更新与吊销令牌 {#proxy-token-lifecycle}

安全句柄没有自动过期时间，可能在同一执行会话内复用，也不会因会话结束或服务重启自动作废。服务重启后端口可能变化，需要重新取得当前代理地址。

在算力资源的 **安全 Token** 面板可以吊销相应条目，或将全部未吊销句柄作废；随后需要重新取得句柄并更新调用方。若页面提示当前环境不支持管理，使用管理员支持的桌面管理入口处理。面板不是令牌签发或复制完整句柄的入口。

吊销影响后续认证，不保证终止已经转发的请求。Provider 的停用、模型移除、登录状态、上游凭据刷新或额度限制也可能使后续调用失败；它们与安全句柄是否已吊销分别排查。

## 错误与使用条件 {#proxy-errors}

鉴权失败采用下列格式，即使请求的是 Chat Completions：

```json
{
  "type": "error",
  "error": {
    "type": "authentication_error",
    "message": "Unauthorized compat-proxy request"
  }
}
```

| 状态或现象 | 处理方式 |
|---|---|
| `401 authentication_error` | 核对本机入口、安全句柄及吊销状态；实例令牌与供应商真实 Key 不能代替这里的句柄 |
| `400 Missing required field: model` | 使用绑定 Provider 中准确的模型名 |
| `400`，绑定 Provider 不服务该模型 | 核对目标 Provider、启用状态及模型配置；不会切换其它 Provider |
| 参数或工具 Schema 被拒绝 | 根据实际错误和后端兼容范围修正，不能用内部请求标记绕过限制 |
| `413` / `415` | 缩小请求体到 `256 MiB` 以内，并使用 `Content-Type: application/json` |
| 上游认证、限流或额度错误 | 检查供应商配置、账户资格与实际错误，遵守返回的重试条件 |
| `502` / `504` 或流内错误 | 检查网络、上游响应和超时；保存未完成状态，不把部分文本当成完整结果 |
| 未注册路径 | 修正到本页已列出的接口；有效凭据不保证未知路径存在 |

代理接受 `x-api-key` 或 Bearer 认证，同时发送两者时优先使用非空的 `x-api-key`。错误格式也随 Messages、Chat Completions、上游响应与流式阶段不同，按实际正文处理。

使用既有供应商账户、订阅或云端算力仍受相应账户、额度和授权条件限制。安全句柄与协议转换不授予新的供应商使用资格；详见[算力服务的授权条件](../02-user-guide/10-settings/04-compute-service.md)和[使用条款](../terms.md)。

## 相关参考

- [连接实例与认证](./01-connection-and-auth.md)：Agent Service 地址与实例凭据。
- [OpenAPI 下载](./07-openapi.md)：代理操作的独立规范与覆盖范围。
