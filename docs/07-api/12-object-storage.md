---
title: 对象存储读取
description: 使用已配置的 S3 兼容连接读取连接摘要、分页浏览对象，并取得下载链接或文件内容。
slug: /api/object-storage
sidebar_position: 12
keywords: [API, S3, 对象存储, 下载, 分页, 预签名链接]
---

# 对象存储读取

通过这三个接口，外部程序可以使用实例已有的 S3 兼容连接浏览对象、取得下载链接或下载内容。先完成[连接与认证](./01-connection-and-auth.md)，所有请求使用实例的 `X-Agent-Service-Token`。

## 使用条件

- 当前用户已在“我的应用”中安装并启用“对象存储”。关闭、卸载或无法确认可用状态时，请求返回 `403 capabilityDisabled`。
- 在客户端的 **资源 → 对象存储** 中添加连接，配置存储桶及其访问凭据；执行读取前确认该账号拥有列出、读取目标对象的供应商权限。
- 调用方使用实例已有连接的 `id`。请求中不提交 AK/SK，连接摘要也不返回凭据；实例令牌可访问该实例配置的连接，不是某个对象或前缀的独立访问授权。

握手中的 `capabilities.objectStorageCapability` 表示实例支持对象存储的用户级开关，不表示当前用户已启用，也不证明某个连接可用。以接口实际响应为准。

| 用途 | 接口 |
|---|---|
| 查找连接 ID 与配置摘要 | `GET /api/s3/connections` |
| 按前缀分页浏览对象 | `GET /api/s3/list` |
| 取得链接或文件字节 | `GET /api/s3/download` |

## 连接摘要 {#connections}

### `GET /api/s3/connections`

无查询参数。返回配置中的连接摘要；没有连接时返回 `200` 和空数组。

```bash
curl --silent --show-error \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  "${BASE_URL}/api/s3/connections"
```

```json
{
  "success": true,
  "connections": [
    {
      "id": "storage-main",
      "label": "项目文件",
      "bucket": "project-files",
      "region": "us-east-1",
      "status": "connected",
      "is_default": true,
      "has_public_url": true
    }
  ]
}
```

`status` 是连接保存的状态，不是本次实时探测结果；`has_public_url` 只表示已配置公开访问地址。摘要存在不保证凭据仍有效、对象可读或最终使用公开链接。

后续请求可带 `connection_id`。省略时按**默认连接 → 首个 `connected` 连接 → 首个连接**选择；若选中的连接缺少配置或凭据，返回 `400 NO_CONNECTION`，不会逐个重试其他连接。为避免默认连接变化造成读取范围变化，集成程序应保存并显式传递选定的 ID。

## 浏览对象 {#list-objects}

### `GET /api/s3/list`

| 查询参数 | 规则 |
|---|---|
| `connection_id` | 可选，连接 ID；省略时按上述顺序选择 |
| `prefix` | 可选，对象键前缀，例如 `reports/` |
| `delimiter` | 默认 `/`，将下一层公共前缀放入 `common_prefixes`；传空字符串可不按目录分组 |
| `max_keys` | 默认 `100`，有效范围 `1`–`1000`；建议传十进制整数 |
| `continuation_token` | 可选，原样传回上一页的 `next_continuation_token` |

```bash
curl --silent --show-error --get \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  --data-urlencode 'connection_id=storage-main' \
  --data-urlencode 'prefix=reports/' \
  --data-urlencode 'max_keys=100' \
  "${BASE_URL}/api/s3/list"
```

```json
{
  "success": true,
  "objects": [
    { "key": "reports/summary.txt", "size": 120, "last_modified": "2026-10-25T00:00:00.000Z" }
  ],
  "common_prefixes": [{ "prefix": "reports/archive/" }],
  "key_count": 2,
  "is_truncated": true,
  "next_continuation_token": "opaque-provider-token",
  "bucket": "project-files",
  "prefix": "reports/"
}
```

`objects` 是对象项，`common_prefixes` 是分组前缀，均不是文件系统路径。`key_count` 沿用供应商的页计数，可能包含公共前缀，不是总量，也不保证等于 `objects.length`。`last_modified` 沿用供应商的时间字符串，缺失时可能为空。

当 `is_truncated` 为 `true` 时，保持同一连接、前缀、分隔符和页大小，原样带回令牌继续读取。不要解码令牌或用对象数量计算下一页。末页通常省略 `next_continuation_token`，不是返回 `null`；没有非空 `prefix` 时也省略 `prefix`。若提示还有后续页却没有令牌，停止并报告异常，避免循环。分页期间对象可能变化，接口不提供固定快照或总数。

服务端对 `max_keys` 先作数值转换；缺省、`0` 或无法转换时使用 `100`，之后夹限到 `1`–`1000`，不承诺对小数或格式错误统一返回 `400`。示例程序会提前拒绝非整数。

## 下载对象 {#download-object}

### `GET /api/s3/download`

| 查询参数 | 规则 |
|---|---|
| `key` | 必填，完整对象键，保留大小写及 `/` |
| `connection_id` | 可选，连接 ID |
| `mode` | 推荐显式传 `link` 或 `binary`，默认 `link`；只有精确的 `binary` 值返回文件，其他值按链接模式处理 |
| `expires_in` | 链接模式的签名有效秒数，默认 `3600`，范围 `60`–`604800`；公开链接不使用此有效期 |

### 取得链接

```bash
curl --silent --show-error --get \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  --data-urlencode 'connection_id=storage-main' \
  --data-urlencode 'key=reports/summary.txt' \
  --data-urlencode 'mode=link' \
  --data-urlencode 'expires_in=3600' \
  "${BASE_URL}/api/s3/download"
```

```json
{
  "success": true,
  "key": "reports/summary.txt",
  "download_url": "https://files.example.com/reports/summary.txt",
  "url_type": "public",
  "content_type": "text/plain",
  "content_length": 120
}
```

- `url_type: public`：已配置公开地址且本次可达性检查通过；响应省略 `expires_in`。API 不为该链接设置过期时间，实际可用性仍由对象和公开访问配置决定。
- `url_type: presigned`：返回有时限的签名链接，并包含 `expires_in`。公开地址未配置或不可达时会使用此方式；链接仍可能因凭据失效、供应商策略或对象变化提前不可用。
- `content_type`、`content_length` 可省略，例如供应商未提供元数据或长度为零。`expires_in` 的数值转换方式与列表类似：缺省、`0` 或无法转换时用 `3600`，然后夹限到 `60`–`604800`。

下载链接可能授予持有者读取权限，请限制转发范围。访问 S3/CDN 链接时不要附带实例的 `X-Agent-Service-Token`；这里的链接不是[附件媒体的签名地址](./09-attachments-and-media.md)。

### 直接下载字节

`mode=binary` 成功返回文件内容，而不是 JSON。响应带 `Content-Type`（缺失时为 `application/octet-stream`）、`Content-Length` 和附件下载的 `Content-Disposition`。对象可能本身就是 JSON、HTML 或其他任意内容，不能仅凭 MIME 类型当作 API 状态对象解析。当前下载接口不提供 Range 或断点续传合同。

使用下方示例显式指定本地输出文件，不根据服务端文件名选择落盘路径。收到非成功 HTTP 状态时先处理错误，不把错误正文保存成目标文件。

## 可运行读取示例 {#s3-example}

下载 **[s3.mjs](pathname:///api-examples/s3.mjs)**，使用 Node.js 22 或更高版本，无需安装 npm 包：

```bash
export DESIRECORE_URL='https://your-instance.example'
export DESIRECORE_TOKEN='your-existing-owner-token'

node s3.mjs connections
node s3.mjs list --connection-id storage-main --prefix reports/ --all
node s3.mjs download --connection-id storage-main --key reports/summary.txt
node s3.mjs download --connection-id storage-main --key reports/summary.txt \
  --mode binary --output ./summary.txt --max-bytes 10485760
```

示例先验证实例握手，再读取对象接口。列表默认只读一页，`--all` 最多读取 100 页（可用 `--max-pages` 调整）；缺少或重复令牌、达到页数上限时明确退出，已输出的页面仍是部分结果。`--delimiter ''` 可读取不按目录分组的列表。

链接模式只输出链接，不自动访问；二进制模式只向已验证的实例请求，拒绝重定向，默认最多保存 100 MiB，使用明确的输出路径且不覆盖已有文件。发生中途下载错误时删除本次未完成的文件。示例不重试、不上传或删除对象；输出的对象键和签名链接请按业务隐私保管。

## 常见错误

| 响应 | 处理方式 |
|---|---|
| `401` | 检查实例地址与实例令牌 |
| `403 capabilityDisabled` | 在“我的应用”检查对象存储是否安装、启用；响应为 `{error, code, capability, retryable}`，没有 `success` 字段，`retryable` 为 `false` |
| `400 INVALID_REQUEST` | 下载缺少非空 `key`；使用查询参数传递完整键 |
| `400 NO_CONNECTION` | 检查连接 ID、S3 配置及已保存凭据；摘要存在也可能发生此错误 |
| `404 NOT_FOUND`（链接模式） | 实例未能确认对象可读；检查键、供应商读取权限及连接状态，不能只据此认定对象已删除 |
| `500 LIST_FAILED` / `DOWNLOAD_FAILED` | 检查供应商权限、网络和实例日志；二进制模式的对象缺失也可能返回 `DOWNLOAD_FAILED` |
| `503 service_not_ready` | 根据 `Retry-After` 等待后重读 |

S3 领域错误使用 `{success:false, error, code}`；能力错误及认证错误外壳不同。错误文字可能包含连接或供应商信息，排查时保留状态与代码，分享日志前移除令牌和签名链接。更多连接排查见[错误与排查](./03-errors-and-troubleshooting.md)，结构定义见 [OpenAPI 下载](./07-openapi.md)。
