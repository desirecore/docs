---
title: Object storage reads
description: Use configured S3 compatible connections to read connection summaries, browse objects by page, and obtain download links or file content.
slug: /api/object-storage
sidebar_position: 12
keywords: [API, S3, object storage, download, pagination, presigned URL]
---

# Object storage reads

These three endpoints let an external program browse objects and obtain links or content using the instance's existing S3 compatible connections. Complete [connection and authentication](./01-connection-and-auth.md) first. Every request uses the instance's `X-Agent-Service-Token`.

## Requirements

- The current user has installed and enabled **Object Storage** in **My Apps**. Disabled, uninstalled, or uncertain availability returns `403 capabilityDisabled`.
- Add a connection in the client under **Resources → Object Storage**, with the bucket and access credentials. Confirm that the provider account can list and read the target objects.
- Use an existing connection's `id`. Requests do not submit an access key or secret key, and connection summaries do not return credentials. An instance token accesses the instance's configured connections; it is not a separate grant for one object or prefix.

The handshake's `capabilities.objectStorageCapability` indicates support for the user capability switch. It does not mean the current user enabled the feature or that a connection works. Use the actual endpoint response.

| Purpose | Endpoint |
|---|---|
| Find connection IDs and configuration summaries | `GET /api/s3/connections` |
| Browse objects by prefix and page | `GET /api/s3/list` |
| Obtain a link or file bytes | `GET /api/s3/download` |

## Connection summaries {#connections}

### `GET /api/s3/connections`

No query parameters. Returns configured connection summaries. An instance with no connections returns `200` with an empty array.

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
      "label": "Project files",
      "bucket": "project-files",
      "region": "us-east-1",
      "status": "connected",
      "is_default": true,
      "has_public_url": true
    }
  ]
}
```

`status` is the saved connection state, not a fresh probe. `has_public_url` only means a public address is configured. A summary does not prove that credentials are valid, an object is readable, or a download will use a public URL.

Pass `connection_id` on subsequent requests. When omitted, selection follows **default connection → first `connected` connection → first connection**. If the selected connection lacks configuration or credentials, the request returns `400 NO_CONNECTION` without trying other connections. Store and explicitly pass the selected ID so that a default change does not change your read target.

## Browse objects {#list-objects}

### `GET /api/s3/list`

| Query parameter | Rules |
|---|---|
| `connection_id` | Optional connection ID; selection when omitted follows the order above |
| `prefix` | Optional object key prefix, such as `reports/` |
| `delimiter` | Defaults to `/`, grouping the next level into `common_prefixes`; an empty string disables directory grouping |
| `max_keys` | Defaults to `100`; range `1`–`1000`; use a decimal integer |
| `continuation_token` | Optional; pass back the previous page's `next_continuation_token` unchanged |

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

`objects` contains object entries and `common_prefixes` contains grouped prefixes. They are not filesystem paths. `key_count` preserves the provider's page count and may include common prefixes; it is neither a total nor necessarily `objects.length`. `last_modified` preserves the provider's timestamp string and can be empty when unavailable.

When `is_truncated` is `true`, keep the connection, prefix, delimiter and page size unchanged, and pass the token back. Do not decode it or calculate a next page from object counts. The final page normally omits `next_continuation_token`, rather than returning `null`. `prefix` is also omitted without a nonempty prefix. If a truncated page has no token, stop and report the inconsistency. Objects may change between pages; there is no fixed snapshot or total count contract.

The server converts `max_keys` to a number. An omitted value, `0`, or a value that cannot be converted uses `100`, then the result is clamped to `1`–`1000`. Decimal fractions and malformed input are not uniformly rejected with `400`. The example rejects nonintegers before connecting.

## Download objects {#download-object}

### `GET /api/s3/download`

| Query parameter | Rules |
|---|---|
| `key` | Required full object key; preserve case and `/` |
| `connection_id` | Optional connection ID |
| `mode` | Explicit `link` or `binary` is recommended; defaults to `link`. Only the exact value `binary` returns bytes; other values use link mode |
| `expires_in` | Signed link lifetime in seconds; defaults to `3600`, range `60`–`604800`; does not set a lifetime on public URLs |

### Obtain a link

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

- `url_type: public`: a configured public address passed this request's reachability check. The response omits `expires_in`. The API sets no expiry on this link; availability still depends on the object and public access configuration.
- `url_type: presigned`: a time limited signed URL, with `expires_in`. This is used when a public address is absent or unreachable. Credentials, provider policy or object changes may invalidate it earlier.
- `content_type` and `content_length` can be omitted, for example when provider metadata is absent or length is zero. Numeric conversion for `expires_in` follows the same pattern as listing: an omitted value, `0`, or an unconvertible value uses `3600`, then it is clamped to `60`–`604800`.

A download URL can grant read access to its holder. Limit sharing, and do not send the instance's `X-Agent-Service-Token` to an S3/CDN URL. These URLs are separate from [signed attachment media URLs](./09-attachments-and-media.md).

### Download bytes directly

With `mode=binary`, success returns file content instead of a JSON wrapper. Headers include `Content-Type` (falling back to `application/octet-stream`), `Content-Length`, and an attachment `Content-Disposition`. An object can itself contain JSON, HTML or any other data; its MIME type alone does not identify an API status response. This endpoint provides no Range or resume contract.

The example below requires an explicit local filename and does not derive a destination from a server filename. Handle unsuccessful HTTP responses before writing a target file.

## Runnable read example {#s3-example}

Download **[s3.mjs](pathname:///api-examples/s3.mjs)**. Use Node.js 22 or later; no npm packages are required:

```bash
export DESIRECORE_URL='https://your-instance.example'
export DESIRECORE_TOKEN='your-existing-owner-token'

node s3.mjs connections
node s3.mjs list --connection-id storage-main --prefix reports/ --all
node s3.mjs download --connection-id storage-main --key reports/summary.txt
node s3.mjs download --connection-id storage-main --key reports/summary.txt \
  --mode binary --output ./summary.txt --max-bytes 10485760
```

The example verifies the instance handshake before reading storage endpoints. Listing reads one page by default. `--all` reads at most 100 pages, adjustable with `--max-pages`. Missing or repeated tokens and page limits produce an error; previously emitted pages remain partial results. Use `--delimiter ''` for an ungrouped list.

Link mode prints the returned URL without visiting it. Binary mode requests only the verified instance, refuses redirects, defaults to a 100 MiB limit, requires an explicit output path and never overwrites existing files. An interrupted download removes the incomplete file created by that request. The example does not retry, upload or delete objects. Protect object keys and signed links in its output as business data.

## Common errors

| Response | Action |
|---|---|
| `401` | Check the instance address and token |
| `403 capabilityDisabled` | Check that Object Storage is installed and enabled in My Apps. The body is `{error, code, capability, retryable}` without `success`; `retryable` is `false` |
| `400 INVALID_REQUEST` | Download requires a nonempty `key` query parameter |
| `400 NO_CONNECTION` | Check the connection ID, S3 configuration and saved credentials; an existing summary can still produce this error |
| `404 NOT_FOUND` (link mode) | The instance could not confirm readable object metadata. Check the key, provider read permissions and connection state; this response alone does not prove deletion |
| `500 LIST_FAILED` / `DOWNLOAD_FAILED` | Check provider permissions, network and instance logs; a missing object in binary mode can also return `DOWNLOAD_FAILED` |
| `503 service_not_ready` | Wait according to `Retry-After` before reading again |

S3 domain errors use `{success:false, error, code}`. Capability and authentication errors have different wrappers. Error text can contain connection or provider details. Keep status and code when investigating, and remove tokens and signed links before sharing logs. See [errors and troubleshooting](./03-errors-and-troubleshooting.md) and the [OpenAPI downloads](./07-openapi.md) for more details.
