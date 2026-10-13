---
title: 智能体 Webhook
description: 创建智能体 Webhook 事件、选择运行权限和轮换密钥，并从外部触发及查看主动交付。
slug: /api/agent-webhook
---

# 智能体 Webhook

外部系统可以向 DesireCore 发送一个已配置的事件，让目标智能体在后台处理事件内容。适合将业务通知、监控事件或其他应用的消息交给智能体处理。

实例所有者可以通过管理接口创建事件、选择工具并取得专用密钥。仅负责发送事件的外部服务，则向管理员取得已配置的事件参数和密钥。

先调用[认证握手](./01-connection-and-auth.md)，检查 `capabilities.webhookManagement`。只有值为 `true` 的实例支持下方管理步骤；字段缺失或为 `false` 时，当前实例暂不可通过这些接口创建或修改事件。已有有效配置仍可按[触发请求](#请求)调用。

## 调用前准备

| 信息 | 获取方式与要求 |
| --- | --- |
| `BASE_URL` | 管理员提供的 Agent Service 地址；参见[连接与认证](./01-connection-and-auth.md)。公开文档站点的地址不能用于调用。 |
| `AGENT_ID` | 管理员提供的目标智能体 ID，不能用显示名称替代。该智能体必须已启用 Webhook。 |
| `event` | 管理员提供的已配置事件名称，必须完全匹配，例如 `demo.ping`。 |
| `WEBHOOK_SECRET` | 目标智能体的专用 Webhook 密钥。发送方通过自己的密钥管理方式保存和注入；需要轮换时联系管理员，并同步更新发送方。 |
| 事件处理约定 | 确认事件使用的字段、可执行操作及结果观察方式。触发请求本身不提供工具或文件权限设置；实际操作取决于已选工具和文件范围。 |

外部调用必须配置 Webhook 密钥。远程实例未配置密钥时会拒绝触发；本机实例没有密钥时，也不能通过本页的外部调用方式触发。这份密钥与实例访问令牌、模型供应商 API Key 的用途不同；发送方应使用管理员提供的专用 Webhook 密钥。

发送方需要能访问实例地址。桌面实例的本机回环地址只适用于同一台电脑上的调用；外部服务器需要管理员提供可访问的服务地址。DesireCore 服务必须保持运行。

## 创建事件并选择运行权限

本节由 standalone 实例所有者操作，使用[连接与认证](./01-connection-and-auth.md)中的 `X-Agent-Service-Token`。Webhook 密钥只用于触发，不授予事件管理或回执读取权限。命令示例需要 `curl` 和 `jq`。

### 1. 查看事件与可选工具

使用已有实例地址、所有者令牌和目标智能体 ID。智能体 ID 可从[智能体列表](./04-conversations-and-runs.md)取得。下面保存的管理响应只包含密钥是否存在，不包含密钥正文。

```bash
BASE_URL='https://your-instance.example'
AGENT_ID='your-agent-id'
AGENT_SERVICE_TOKEN='replace-with-your-existing-instance-token'
umask 077

curl --fail-with-body --silent --show-error \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  "${BASE_URL}/api/agents/${AGENT_ID}/webhooks" \
  --output webhook-config.json

jq '{enabled,hasSecret,events,availableTools}' webhook-config.json
```

| 响应字段 | 说明 |
| --- | --- |
| `enabled` | 该智能体的 Webhook 入口是否启用。 |
| `hasSecret` | 是否已配置密钥；读取不会再次返回密钥。 |
| `events` | 已有事件的 `event`、`promptTemplate`、`maxTurns` 和 `toolIds`。 |
| `availableTools` | 当前可选择工具的 `id`、`name`、`riskLevel` 与 `requiresConfirmation`。 |

选择事件实际需要的工具 ID。`toolIds: []` 表示不允许使用工具。本例选择 `SendUserMessage`，用于把测试结果主动发送到用户对话；如果它不在 `availableTools` 中，请先调整目标智能体的工具配置，再重新读取。

只为事件完成工作所需的操作选择工具。本例只需 `SendUserMessage`；确实需要写文件或执行命令时，再添加 `Write`、`Bash` 等工具。这些工具可以修改有效文件范围内的配置文件，包括该范围中的智能体与事件配置。工具选择和文件范围沿用实例现有的权限机制，授予写入能力时需要同时考虑它能修改哪些配置。

### 2. 保存 `demo.ping`

管理接口接受事件模板、所选工具 ID 和最多执行轮数；保存时由服务确定对应工具和当前文件范围。你不需要填写工具定义或权限对象。运行时仍受目标智能体的当前权限限制。

| 字段 | 要求 |
| --- | --- |
| 事件名称（路径中的 `:event`） | 长度 1–128；首字符为英文字母或数字，其余可用英文字母、数字、`.`、`_`、`-`；不能为 `constructor`、`prototype` 或 `__proto__`。 |
| `promptTemplate` | 必填非空字符串，最多 32,768 个字符；支持下文的 `{{key}}` 模板字段。 |
| `toolIds` | 必填，来自 `availableTools` 的 ID 数组，不能重复；最多 512 项，空数组表示不授予工具权限。 |
| `maxTurns` | 可选整数，范围 1–100，省略时为 5。 |

`PUT` 新建或替换同名事件，并启用该智能体的 Webhook 入口。替换会同时更新模板和工具选择；再次保存时会重新采集当前文件访问范围。请求体上限为 128 KiB。

如果保存返回 `409` 和 `error: "webhook_configuration_changed"`，说明智能体配置在保存期间发生变化，本次事件修改未提交。重新 `GET` 读取事件和可选工具，确认模板、工具选择及当前文件权限后，再发起保存。

```bash
SEND_USER_MESSAGE_TOOL_ID="$(jq -er \
  '[.availableTools[] | select(.name == "SendUserMessage")] | if length == 1 then .[0].id else error("SendUserMessage is not available") end' \
  webhook-config.json)"

jq -n --arg tool "${SEND_USER_MESSAGE_TOOL_ID}" \
  --arg prompt '收到消息：{{message}}。请使用 SendUserMessage 向用户发送这条收到的消息。' \
  '{promptTemplate:$prompt,toolIds:[$tool],maxTurns:5}' \
  > webhook-event.json

curl --fail-with-body --silent --show-error --request PUT \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  --header 'Content-Type: application/json' \
  --data-binary @webhook-event.json \
  "${BASE_URL}/api/agents/${AGENT_ID}/webhooks/events/demo.ping" \
  --output webhook-write.json
```

保存成功返回 `200`：

```json
{
  "success": true,
  "enabled": true,
  "event": "demo.ping",
  "secret": "<generated-webhook-secret>"
}
```

`secret` **仅在这次保存首次生成密钥时出现**。立即通过发送方的密钥管理方式保存这个值；不要把包含密钥的响应文件放入公开仓库或日志。已有密钥时，响应只有 `success`、`enabled` 和 `event`。

如果已保存的密钥丢失，或首次生成密钥的响应丢失，请按[轮换密钥](#轮换密钥)取得新值。重新 `GET` 或再次保存事件不会取回旧密钥。

### 3. 触发并查看主动交付

将生成或轮换得到的密钥设置为 `WEBHOOK_SECRET`，按下方[发送一次请求](#发送一次请求)触发 `demo.ping`，然后按[查看处理结果](#查看处理结果)确认主动消息已交付。智能体需要可用的模型配置，并且实际调用了获准的发送消息工具；保存和接收成功都不能代替这一步确认。

## 暂停、删除与密钥轮换

以下管理操作均使用实例访问令牌。它们改变之后的触发配置，不会停止已经接收的后台执行。

| 操作 | 请求 | 成功响应 |
| --- | --- | --- |
| 暂停全部事件 | `PATCH /api/agents/:id/webhooks`，JSON `{"enabled":false}` | `{"success":true,"enabled":false}` |
| 恢复已有事件 | 同一路径，JSON `{"enabled":true}` | `{"success":true,"enabled":true}`；需要已有事件和密钥。 |
| 删除一个事件 | `DELETE /api/agents/:id/webhooks/events/:event`，无请求体 | `{"success":true,"enabled":...}`；删除最后一个事件后自动暂停入口。 |

### 轮换密钥

一个智能体的事件共用同一份 Webhook 密钥。轮换后旧密钥立即不能用于之后的触发，所有发送方都要更新；已有运行继续处理。

```bash
curl --fail-with-body --silent --show-error --request POST \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  "${BASE_URL}/api/agents/${AGENT_ID}/webhooks/secret/rotate" \
  --output webhook-secret.json
```

此请求不发送正文，成功返回 `200 {"secret":"<new-webhook-secret>"}`。将新值保存到发送方的密钥管理配置。轮换响应丢失时，读取配置也不能取回密钥，需要再次轮换并同步全部发送方。

## 请求

```http
POST /api/webhook/:agent_id
Authorization: Bearer <Webhook secret>
Content-Type: application/json
```

`Authorization` 使用上面的 `Bearer ` 前缀，后面紧接密钥。请求体上限为 **1 MiB（1,048,576 字节）**；这是整个 JSON 请求的大小上限。

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `event` | string | 是 | 目标智能体中已配置的事件名称。 |
| `payload` | object | 否 | 提供事件模板需要的字段；省略时按空对象处理。 |

顶层只接受 `event` 和 `payload`。`payload` 内可以包含事件约定的 JSON 字段，但它必须是对象，不能直接传数组或字符串。

```json
{
  "event": "demo.ping",
  "payload": {
    "message": "测试事件：请确认已收到。"
  }
}
```

第三方系统的原始通知需要先转换成这个结构。例如，使用 GitHub 推送事件时，发送方需要映射事件名和负载，并添加这里要求的 Bearer 密钥；本接口不直接校验 GitHub 的签名头。

### 模板字段

管理员配置的提示模板通过 `{{key}}` 读取 `payload` 中同名的顶层字段。例如，模板 `收到消息：{{message}}` 会从上面的请求得到 `收到消息：测试事件：请确认已收到。`。

- 字符串、数字和布尔值转换为文本；对象和数组转换为 JSON 文本。
- 字段缺失或值为 `null` 时，原占位符保留，例如 `{{message}}`。
- `{{user.name}}` 这样的嵌套字段路径不支持。需要使用的值应由发送方放入约定的顶层字段。

发送方应按事件约定填写所需字段，避免将未替换的占位符交给智能体处理。

## 发送一次请求

下面的示例使用上方创建的 `demo.ping`，或管理员已经配置的同名事件，并约定使用 `payload.message`。替换实例地址和智能体 ID，通过发送方的密钥管理方式设置 `WEBHOOK_SECRET`。如果实际事件名称或字段不同，同步修改 JSON 请求体。

```bash
BASE_URL='https://your-instance.example'
AGENT_ID='your-agent-id'

curl --include --request POST \
  "${BASE_URL%/}/api/webhook/${AGENT_ID}" \
  --header "Authorization: Bearer ${WEBHOOK_SECRET}" \
  --header 'Content-Type: application/json' \
  --data '{"event":"demo.ping","payload":{"message":"测试事件：请确认已收到。"}}'
```

正常接收时返回 `200 OK`：

```json
{
  "accepted": true,
  "agentId": "your-agent-id",
  "event": "demo.ping"
}
```

`accepted: true` 表示事件已接收，后台处理随后进行。它不代表模型已启动、工具调用成功或任务已经完成。响应没有 Run ID、请求 ID 或最终回答；后台失败也不会将这次已经返回的 `200` 改成错误响应。

## 查看处理结果

调用前，让管理员明确这个事件预期如何交付结果。如果事件获准使用 **SendUserMessage（向用户发送消息）**，并在运行中调用了它，已成功写入的消息或附件会出现在与该实例连接的 DesireCore 中，目标智能体的对话里。重新进入目标智能体的对话可以读取已有交付。

普通的模型最终回答不会自动变成这里的用户交付。没有看到消息可能是事件尚在处理、事件没有发送消息、权限或交付失败，不能单凭界面没有消息判断任务成败。已有交付也不代表该次运行的后续操作全部完成。

实例所有者也可以读取持久交付记录：

```bash
curl --fail-with-body --silent --show-error \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  "${BASE_URL}/api/agents/${AGENT_ID}/schedule-messages?limit=20&offset=0"
```

响应为 `{"items":[...],"total":...,"limit":20,"offset":0}`。Webhook 交付条目的 `origin` 为 `webhook`、`displayName` 为事件名，正文通常在 `delivery.message`；附件引用在 `delivery.attachments`。降级为纯文本的交付记录使用 `text`。只返回当前身份有权读取的条目。默认 `limit` 为 50，最大 200，`offset` 从 0 开始。

记录是该智能体的交付列表，并非按本次触发查询的终态。相同事件多次触发的记录可能混在一起，列表为空也不代表执行失败。需要区分业务事件时，可在约定负载和交付正文中携带发送方的业务编号；它不会使触发接口具备去重或唯一运行查询能力。

如果该事件未提供用户交付，本页调用方只能取得 `accepted` 接收反馈，执行情况需要管理员查看日志。本接口没有提供按本次请求查询完成状态或最终结果的方式。需要核实失败或超时时，请把目标智能体 ID、事件名称、发送时间和 HTTP 响应交给实例管理员，由管理员检查服务运行日志。不要在排查记录中包含密钥。

如果业务要求每次调用都取得唯一执行编号、可轮询的终态或结果回调，请先与管理员确认是否有适合该需求的接入方式。

## 重复调用与超时

本接口没有幂等键或请求去重功能。相同请求发送两次，可能触发两次执行；在 `payload` 中放入业务事件 ID 也不会自动启用去重。

发送方超时或连接中断时，接收结果可能未知：服务有可能已经接收事件并开始执行。先保存发送时间、事件名称和可用的响应信息，再核实处理情况。对于会产生外部操作的事件，不应仅因没有收到响应就无条件重发。

后台处理有自己的执行超时控制，失败或超时可能发生在接收成功之后。延长发送方的 HTTP 等待时间不能让这个异步接口返回最终结果。

## 管理接口错误

管理接口使用 `error` 中的稳定标识；字段校验失败可能还返回 `details`。

| HTTP 状态 | `error` | 处理方法 |
| --- | --- | --- |
| `400` | `invalid_webhook_management_request` | 核对必填字段、类型和限制；轮换请求不要发送正文。 |
| `400` | `invalid_webhook_event` | 使用符合事件命名规则的名称。 |
| `400` | `webhook_tool_unavailable` | 重新读取 `availableTools`，只选择仍可用的准确 ID。 |
| `400` | `webhook_events_required` | 恢复前先保存事件并确认已有密钥。 |
| `400` | `invalid_agent_id` | 核对目标智能体 ID。 |
| `401` / `403` | 认证或治理拒绝，或 `webhook_owner_required` | 使用目标实例所有者的访问令牌；Webhook 密钥不能用于管理。 |
| `404` | `agent_not_found` / `webhook_event_not_found` | 核对目标智能体与待删除事件。 |
| `409` | `webhook_configuration_changed` | 本次保存未提交；重新读取配置和可选工具，确认权限后重试保存。 |
| `409` | `webhook_configuration_invalid` | 请实例管理员修复已有配置后再保存。 |
| `413` | 保存请求体过大 | 缩小整个事件保存请求到 128 KiB 以内。 |
| `500` | `webhook_management_failed` | 请管理员查看服务日志，核实修改是否生效后再处理。 |

## 触发接口错误

优先检查 HTTP 状态和实际返回的 `error`。部分错误还带有 `message` 或 `details`；不要按固定的 `success/data/error` 包装解析所有响应。

| HTTP 状态 | 错误或现象 | 调用方操作 |
| --- | --- | --- |
| `400` | `Invalid request body`，可能带校验 `details` | 确认 JSON 顶层为对象、`event` 为字符串、`payload` 为对象，移除其他顶层字段。 |
| `400` | `Unknown event type: ...` | 核对管理员提供的事件名称、大小写和目标智能体。 |
| `400` | JSON 无法解析 | 修正 JSON 语法后重新发送。 |
| `401` | `Invalid webhook secret` | 检查 `Authorization: Bearer ...` 和当前密钥，确认发送方已同步管理员的密钥轮换。 |
| `401` | `Invalid embedded instance token` | 该本机事件没有外部调用所需的密钥；请管理员提供已配置密钥的事件。 |
| `403` | `webhook_secret_required` | 远程实例上的目标智能体没有有效 Webhook 密钥；请管理员完成配置。 |
| `404` | `Agent not found` | 核对实例地址与目标智能体 ID。 |
| `404` | `Webhook not enabled for this agent` | 请管理员确认目标智能体的事件已启用。 |
| `413` | 请求体过大 | 缩小整个 JSON 请求到 1 MiB 以内，按事件约定减少负载。 |
| `415` | 请求媒体类型不支持 | 使用 `Content-Type: application/json`。 |
| `500` | `Failed to parse agent.json` | 请管理员检查目标智能体配置；反复重发不能修复配置。 |

反向代理和服务连接故障还可能返回其他错误，参见[错误与排查](./03-errors-and-troubleshooting.md)。修复明确拒绝接收的请求后再发送；响应丢失的情况按上面的未知结果规则处理。
