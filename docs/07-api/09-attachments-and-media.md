---
title: 附件与媒体
description: 上传通用附件或图片、音频、视频，将附件引用用于对话，并安全读取文件和签名媒体链接。
slug: /api/attachments-and-media
sidebar_position: 9
---

# 附件与媒体

通用文件先上传为附件，再将返回的文件参考交给智能体；图片、音频和视频也可以上传为媒体，再取得供原生媒体标签使用的短期链接。上传成功只表示文件已存储，不能据此判断智能体已经读取或处理文件。

先按[连接实例与认证](./01-connection-and-auth.md)准备 `BASE_URL` 和实例访问令牌。`BASE_URL` 是目标 Agent Service 的地址，不含 `/api`；远程访问使用 HTTPS。除签名媒体读取外，本页请求均使用 `X-Agent-Service-Token`，身份由服务解析。

| 用途 | 方法与路径 | 成功响应 |
|---|---|---|
| 存储 PDF、文本等通用文件 | `POST /api/attachments` | `201`，附件收据 |
| 下载自己的附件 | `GET /api/attachments/:attachmentId` | `200`，原始文件字节 |
| 存储图片、音频或视频 | `POST /api/media/upload` | `200`，媒体元信息 |
| 为可读取的媒体取得短链 | `POST /api/media/access-urls` | `200`，`items` 与 `missing` |
| 通过短链读取媒体 | `GET /media/:filename` | `200` 或单段 Range 的 `206` |

## 上传通用附件 {#upload-attachment}

### `POST /api/attachments`

发送一个 `multipart/form-data` 文件。使用 `curl --form`、浏览器 `FormData` 或下面的上传示例时，让工具自动生成包含 boundary 的 `Content-Type`；不要手写成不带 boundary 的 `multipart/form-data`。

```bash
curl --fail-with-body --silent --show-error \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  --form 'file=@./report.txt;type=text/plain' \
  "${BASE_URL}/api/attachments"
```

成功返回直接的收据对象，没有 `data` 或 `success` 外壳：

```json
{
  "attachmentId": "00000000-0000-4000-8000-000000000001",
  "name": "report.txt",
  "mimeType": "text/plain",
  "size": 18,
  "sha256": "0932d7133fdafd99d58020fca2539266aa11731a72f741067b1009c4c8c66553",
  "fileReference": "/srv/desirecore/attachments/owner/00000000-0000-4000-8000-000000000001/data"
}
```

| 字段 | 含义 |
|---|---|
| `attachmentId` | 服务签发的 UUID，用于下载；不是本地文件名 |
| `name` | 清理路径分隔符和控制字符后的显示名称，最长 240 个字符 |
| `mimeType` | 上传时的内容类型描述，最长 128 个字符 |
| `size` | 完整文件的字节数，整数且至少为 `1` |
| `sha256` | 文件字节的小写 SHA-256 摘要，64 个十六进制字符 |
| `fileReference` | 目标服务上的文件参考；原样放入同一实例 Query 的 `options.fileReferences`，不要在调用方机器上打开它或自行拼接 |

此入口接受通用文件，不采用下方媒体入口的 MIME 清单。它只存储文件，不解压、不执行，也不保证模型或工具能解析相应格式。把参考交给智能体不会自动授予工具执行、文件编辑或跨用户读取权限。

单次只上传一个非空文件，最大 **20 MiB（20,971,520 字节）**。每个用户最多保留 256 个附件目录，总文件内容最多 **512 MiB**。额度不足返回 `429`。本页没有附件删除接口，不要靠反复上传相同文件做重试；每次成功 POST 都会创建新附件。没有收到完整收据时，保留上传结果未知的状态，检查错误后再决定是否重新上传。

## 上传后交给智能体 {#upload-and-query}

[下载附件上传示例](pathname:///api-examples/attachments.mjs)，保存为 `attachments.mjs`。它使用 **Node.js 22+**，不需要安装依赖；校验本地文件大小，以及成功收据中的大小和 SHA-256。示例不自动重试 POST，已有输出文件也不会被覆盖。

```bash
export DESIRECORE_URL='https://agent.example.com'
export DESIRECORE_TOKEN='replace-with-your-existing-instance-token'
export DESIRECORE_AGENT_ID='your-agent-id'

node attachments.mjs --file ./report.txt --mime text/plain --out ./attachment.json
```

`attachment.json` 是直接收据对象。按[对话与运行](./04-conversations-and-runs.md)下载 `agent-client.mjs`、安装其依赖，再提交：

```bash
node agent-client.mjs \
  --prompt '请阅读附件并概括要点。' \
  --attachment-receipt ./attachment.json \
  --state ./request-with-attachment.json
```

可重复提供 `--attachment-receipt` 添加多个收据。示例仅将这些附件用于首轮 start，后续 `--follow-up` 是文本续问。请求状态保存已选文件参考，恢复或传输重试沿用同一参考，不重新上传。收据和状态文件可能暴露文件参考或消息内容，请妥善保存，并只用于原实例。

自己实现客户端时，将收据放到以下位置；`originSocketId` 必须是已认证 Socket.IO 连接的当前 ID，其他提交、摘要与终态处理按[对话指南](./04-conversations-and-runs.md)执行：

```json
{
  "prompt": "Summarize the attachment.",
  "options": {
    "agentId": "your-agent-id",
    "conversationId": "your-agent-id",
    "fileReferences": [
      "/srv/desirecore/attachments/owner/00000000-0000-4000-8000-000000000001/data"
    ]
  },
  "clientRequestId": "00000000-0000-4000-8000-000000000002",
  "userMessageId": "00000000-0000-4000-8000-000000000003",
  "originSocketId": "current-authenticated-socket-id"
}
```

`fileReference` 不是公开 URL。HTTP `202` 表示请求被接纳；仍需观察本轮终态或读取可关联的回执，确认是否已处理附件。

## 下载通用附件 {#download-attachment}

### `GET /api/attachments/:attachmentId`

使用同一实例、同一用户身份读取上传收据中的 `attachmentId`：

```bash
curl --fail-with-body --silent --show-error \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  --output ./downloaded-report.txt \
  "${BASE_URL}/api/attachments/${ATTACHMENT_ID}"
```

成功正文是文件字节，`Content-Type: application/octet-stream`，带文件名的 `Content-Disposition`、实际 `Content-Length`、`Cache-Control: no-store` 和 `X-Content-Type-Options: nosniff`。不要把它当 JSON 解析。本端点没有媒体的 Range 合同。

ID 非法、不存在、属于另一个用户，或文件/收据不可读时返回 `404 attachment_not_found`。[历史消息](./08-session-history-and-messages.md#session-messages)中出现的路径或附件 ID 不代替本次下载的身份检查。

## 上传图片、音频和视频 {#upload-media}

### `POST /api/media/upload`

同样使用单文件 multipart，但只接受以下 MIME：

| 类别 | MIME |
|---|---|
| 图片 | `image/jpeg`、`image/png`、`image/gif`、`image/webp` |
| 音频 | `audio/mpeg`、`audio/mp3`、`audio/opus`、`audio/aac`、`audio/flac`、`audio/wav`、`audio/ogg` |
| 视频 | `video/mp4`、`video/webm` |

不支持的 MIME 返回 `415`；空文件返回 `400`。此入口使用服务的单文件 multipart 上限 **2 GiB（2,147,483,648 字节）**，不是通用附件的 20 MiB；反向代理和部署限制可能更小。大文件应先压缩或缩短时长。

```bash
curl --fail-with-body --silent --show-error \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  --form 'file=@./diagram.png;type=image/png' \
  "${BASE_URL}/api/media/upload"
```

```json
{
  "type": "image",
  "mediaId": "00000000-0000-4000-8000-000000000004.png",
  "name": "diagram.png",
  "mimeType": "image/png",
  "size": 68,
  "width": 1,
  "height": 1
}
```

`type` 为 `image`、`audio` 或 `video`；`width`、`height` 仅在取得图片尺寸时存在。保存完整元信息；需要随 Query 发送媒体时，把它放入顶层 `mediaRefs` 数组，通用文件参考仍放在 `options.fileReferences`。上传成功不保证后续模型支持该媒体格式。

新上传媒体归当前认证用户所有。签发链接时会核对归属和媒体实际内容，不能只凭猜到的 `mediaId` 为别人的新媒体换链接。旧实例保存的部分媒体没有用户归属记录，读取保留兼容行为；不要把历史媒体 ID 当成跨用户隔离的凭证。

## 为原生媒体取得签名链接 {#signed-media}

### `POST /api/media/access-urls`

携带实例访问令牌，发送 1–100 个 `mediaId`。重复项按第一次出现的顺序去重，额外顶层字段不接受。

```bash
curl --fail-with-body --silent --show-error \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  --header 'Content-Type: application/json' \
  --data '{"mediaIds":["00000000-0000-4000-8000-000000000004.png"]}' \
  "${BASE_URL}/api/media/access-urls"
```

```json
{
  "items": [
    {
      "mediaId": "00000000-0000-4000-8000-000000000004.png",
      "url": "/media/00000000-0000-4000-8000-000000000004.png?expires=1792112700&signature=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      "expiresAt": "2026-10-16T01:05:00.000Z"
    }
  ],
  "missing": []
}
```

使用真实响应中的 `url`，不要复制上述示例签名。`url` 相对于 Agent Service 地址，`expiresAt` 是到期时间。缺失文件列入 `missing`，其他可用文件仍可以得到链接。语法非法的 ID 使整次请求失败为 `400`；可用文件中存在无权读取的媒体时返回 `403`，不要假设这时仍有部分 `items`。

### `GET /media/:filename`

将返回的 URL 交给 `<img>`、`<audio>` 或 `<video>`：

```javascript
// item 来自已认证的 /api/media/access-urls 响应。
image.src = new URL(item.url, BASE_URL).href;
```

此 GET 用 URL 内的 `expires` 与 `signature` 认证，无需 `X-Agent-Service-Token`。长期令牌只在签发请求的请求头中发送，不能写入媒体 URL。签名链接五分钟有效，可以重复读取并用于单段 byte Range；持有完整链接的人可以在有效期内读取该媒体，请勿公开转发。实例令牌轮换后旧签名失效，已缓存的副本可能保留到缓存过期。

只有单段 `/media/:filename` 的 GET/HEAD 使用此合同；`/api/media/*` 不因此免除实例认证，其他方法和多段路径也不获得同样的豁免。应用连接凭据不能借媒体链接升级为实例用户权限。浏览器来源限制、实例尚未就绪等条件仍可能使请求失败。

| 读取方式 | 响应 |
|---|---|
| 完整 GET | `200`，媒体字节、按扩展名确定的类型、长度 |
| `Range: bytes=0-1023`，或合法开放/后缀范围 | `206`、`Content-Range`、本段长度；仅支持一个范围 |
| 非法或越界范围 | `416`，`Content-Range: bytes */<文件长度>` |
| HEAD | 与读取使用相同签名及元信息，不返回媒体正文 |

成功读取带 `Accept-Ranges: bytes`、`X-Content-Type-Options: nosniff`，缓存为 private，最长不超过签名剩余有效期。默认反向代理配置包含 `/media/*`；自建代理也需将此路径转发到同一个 Agent Service。

## 错误与处理 {#attachment-media-errors}

| HTTP / 错误 | 处理方式 |
|---|---|
| 附件 `400 attachment_file_required` / `attachment_empty` | 选择一个非空文件，使用 multipart 上传 |
| 附件 `401 attachment_identity_required` | 检查实例凭据能否解析当前用户；一般认证失败也可能更早返回 `401` |
| 附件 `413 attachment_too_large`，或上传解析器的 `413` | 通用附件缩小到 20 MiB 内；同时检查代理限制 |
| 附件 `429 attachment_limit` / `attachment_storage_limit` | 已达到数量或容量限制，请管理员处理；不要循环上传 |
| 附件 `503 attachment_storage_unavailable` | 存储未成功完成；保留错误并请管理员检查磁盘 |
| 下载 `404 attachment_not_found` | 检查 ID、原实例与身份，不能从其他用户的收据读取 |
| 媒体 `400` / `415` | 检查 ID、请求结构、非空内容及 MIME；不要仅改扩展名冒充媒体类型 |
| 媒体 `403 media_owner_forbidden` | 换回上传用户身份，或请拥有者在自己的权限范围内操作 |
| 签名 GET `401 media_signature_expired` / `invalid_media_signature` | 重新通过已认证接口换链接；不要手改签名和到期参数 |
| 媒体 `404 media_not_found` / `416 range_not_satisfiable` | 文件可能已移除；或修正 Range 后重试 |
| 媒体 `503 media_signing_unavailable` | 请管理员检查实例签名所需的访问令牌配置 |

媒体内部失败可能返回 `500 media_internal_error`。上传解析器、反向代理和通用认证的错误结构与这些路由错误不同；保留 HTTP 状态及实际正文，参见[错误与排查](./03-errors-and-troubleshooting.md)。
