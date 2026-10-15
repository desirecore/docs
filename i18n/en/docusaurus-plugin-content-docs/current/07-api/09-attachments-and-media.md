---
title: Attachments and Media
description: Upload files, images, audio, and video, attach file references to conversations, and read files or signed media links.
slug: /api/attachments-and-media
sidebar_position: 9
---

# Attachments and Media

Upload a general file as an attachment, then give the returned file reference to an Agent. Images, audio, and video can also be uploaded as media, with short-lived links for native media elements. A successful upload means the file was stored; it does not mean an Agent has read or processed it.

Prepare `BASE_URL` and an instance access token using [Connect and Authenticate](./01-connection-and-auth.md). `BASE_URL` is the target Agent Service address without `/api`; use HTTPS remotely. Except for signed media reads, requests on this page use `X-Agent-Service-Token`, with identity resolved by the service.

| Purpose | Method and path | Success response |
|---|---|---|
| Store general files such as PDFs and text | `POST /api/attachments` | `201`, attachment receipt |
| Download your attachment | `GET /api/attachments/:attachmentId` | `200`, original file bytes |
| Store an image, audio, or video file | `POST /api/media/upload` | `200`, media metadata |
| Obtain short links for readable media | `POST /api/media/access-urls` | `200`, `items` and `missing` |
| Read media through a short link | `GET /media/:filename` | `200`, or `206` for a single Range |

## Upload a general attachment {#upload-attachment}

### `POST /api/attachments`

Send one file as `multipart/form-data`. With `curl --form`, browser `FormData`, or the example below, let the tool generate the `Content-Type` including its boundary; do not set a bare `multipart/form-data` header.

```bash
curl --fail-with-body --silent --show-error \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  --form 'file=@./report.txt;type=text/plain' \
  "${BASE_URL}/api/attachments"
```

Success returns the receipt directly, without a `data` or `success` wrapper:

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

| Field | Meaning |
|---|---|
| `attachmentId` | Service-issued UUID used for download, not a local filename |
| `name` | Display name with path separators and control characters removed, up to 240 characters |
| `mimeType` | Content type description from upload, up to 128 characters |
| `size` | Complete file size in bytes, an integer of at least `1` |
| `sha256` | Lowercase SHA-256 of the file bytes, 64 hexadecimal characters |
| `fileReference` | File reference on the target service; pass it unchanged in Query `options.fileReferences` on the same instance, rather than opening it on your own machine or constructing a path |

This endpoint accepts general files without the media MIME list below. It stores files without extracting or executing them, and does not guarantee that a model or tool can parse their format. Passing a reference to an Agent does not automatically grant tool execution, editing, or cross-user read permission.

Upload one non-empty file per request, at most **20 MiB (20,971,520 bytes)**. Each user can retain up to 256 attachment directories and **512 MiB** of file contents. Exceeding a quota returns `429`. This page provides no attachment deletion endpoint. Each successful POST creates a new attachment, so do not repeatedly upload a file as an automatic retry. If no complete receipt arrives, treat the upload outcome as unknown and inspect the error before deciding whether to upload again.

## Upload, then send to an Agent {#upload-and-query}

[Download the attachment uploader](pathname:///api-examples/attachments.mjs) as `attachments.mjs`. It needs **Node.js 22+**, with no dependencies to install. It checks the local file size and compares the successful receipt size and SHA-256 with the uploaded bytes. It does not retry POST automatically or overwrite an existing output file.

```bash
export DESIRECORE_URL='https://agent.example.com'
export DESIRECORE_TOKEN='replace-with-your-existing-instance-token'
export DESIRECORE_AGENT_ID='your-agent-id'

node attachments.mjs --file ./report.txt --mime text/plain --out ./attachment.json
```

`attachment.json` contains the direct receipt. Download `agent-client.mjs` and install its dependency as described in [Conversations and Runs](./04-conversations-and-runs.md), then submit:

```bash
node agent-client.mjs \
  --prompt 'Read the attachment and summarize its main points.' \
  --attachment-receipt ./attachment.json \
  --state ./request-with-attachment.json
```

Repeat `--attachment-receipt` to add several receipts. This example attaches files only to the initial start; subsequent `--follow-up` turns are text. Saved request state freezes the chosen references, so recovery and transport retries reuse them without uploading again. Receipts and state files can reveal file references or message contents; keep them private and use them with the original instance.

In your own client, place the receipt reference as shown below. `originSocketId` must be the current ID of an authenticated Socket.IO connection. Follow the [conversation guide](./04-conversations-and-runs.md) for submission, request digests, and terminal outcomes:

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

`fileReference` is not a public URL. HTTP `202` means the request was admitted; observe its terminal outcome or a correlated receipt to determine whether the attachment was processed.

## Download a general attachment {#download-attachment}

### `GET /api/attachments/:attachmentId`

Read the receipt's `attachmentId` using the same instance and user identity:

```bash
curl --fail-with-body --silent --show-error \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  --output ./downloaded-report.txt \
  "${BASE_URL}/api/attachments/${ATTACHMENT_ID}"
```

Success returns file bytes with `Content-Type: application/octet-stream`, a filename in `Content-Disposition`, actual `Content-Length`, `Cache-Control: no-store`, and `X-Content-Type-Options: nosniff`. Do not parse it as JSON. This endpoint does not provide the media Range contract.

An invalid, missing, other-user, or unreadable attachment returns `404 attachment_not_found`. Paths or attachment IDs in [message history](./08-session-history-and-messages.md#session-messages) do not replace the download's identity check.

## Upload images, audio, and video {#upload-media}

### `POST /api/media/upload`

Use single-file multipart again, with one of these MIME types:

| Category | MIME |
|---|---|
| Image | `image/jpeg`, `image/png`, `image/gif`, `image/webp` |
| Audio | `audio/mpeg`, `audio/mp3`, `audio/opus`, `audio/aac`, `audio/flac`, `audio/wav`, `audio/ogg` |
| Video | `video/mp4`, `video/webm` |

Unsupported MIME types return `415`; empty files return `400`. This endpoint uses the service's multipart file limit of **2 GiB (2,147,483,648 bytes)**, rather than the general attachment limit of 20 MiB. Reverse proxies and deployments may impose smaller limits. Compress large files or shorten their duration before uploading.

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

`type` is `image`, `audio`, or `video`; `width` and `height` appear only when image dimensions were obtained. Keep the metadata. To attach media to a Query, put it in the top-level `mediaRefs` array; general file references still belong in `options.fileReferences`. Upload success does not guarantee that the selected model supports the format.

New uploads belong to the authenticated user. Link issuance checks ownership and actual media contents, so guessing a `mediaId` is insufficient to obtain a link for another user's new media. Some media saved by older instances lacks ownership records and retains legacy read compatibility; do not treat historical media IDs as cross-user isolation credentials.

## Obtain a signed link for native media {#signed-media}

### `POST /api/media/access-urls`

Send 1–100 `mediaId` values with the instance access token. Duplicates are removed in first-occurrence order, and extra top-level fields are rejected.

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

Use the `url` from an actual response, not the example signature above. It is relative to Agent Service; `expiresAt` is the expiry time. Missing files appear in `missing`, while other readable files can receive links. A malformed ID fails the entire request with `400`. If any existing media is not readable by the user, the request returns `403`; do not expect partial `items` in that response.

### `GET /media/:filename`

Give the returned URL to an `<img>`, `<audio>`, or `<video>` element:

```javascript
// item comes from the authenticated /api/media/access-urls response.
image.src = new URL(item.url, BASE_URL).href;
```

This GET authenticates using `expires` and `signature` in the URL, without `X-Agent-Service-Token`. Send the long-lived token only in the issuance request header, never in a media URL. Links last five minutes, support repeated reads and single byte ranges, and permit anyone holding the complete link to read that media while valid. Do not publish them. Rotating the instance token invalidates old signatures; previously cached copies may remain until their cache entry expires.

This contract applies only to GET/HEAD on the single-segment `/media/:filename` path. It does not exempt `/api/media/*`, other methods, or multi-segment paths from instance authentication. Application connection credentials cannot use a media link to become an instance user. Browser origin restrictions and service readiness can still reject the request.

| Read | Response |
|---|---|
| Complete GET | `200`, media bytes, extension-based content type, and length |
| `Range: bytes=0-1023`, or a valid open-ended/suffix range | `206`, `Content-Range`, and segment length; one range only |
| Invalid or out-of-bounds range | `416`, `Content-Range: bytes */<file length>` |
| HEAD | Same signature and metadata checks, without media response bytes |

Successful reads include `Accept-Ranges: bytes` and `X-Content-Type-Options: nosniff`. Caching is private and lasts no longer than the signature's remaining validity. The default reverse proxy forwards `/media/*`; custom proxies must also route it to the same Agent Service.

## Errors and recovery {#attachment-media-errors}

| HTTP / error | Action |
|---|---|
| Attachment `400 attachment_file_required` / `attachment_empty` | Select one non-empty file and upload as multipart |
| Attachment `401 attachment_identity_required` | Check that the instance credential resolves the user; generic authentication may return `401` earlier |
| Attachment `413 attachment_too_large`, or a parser `413` | Reduce the general attachment to 20 MiB or less and check proxy limits |
| Attachment `429 attachment_limit` / `attachment_storage_limit` | Count or storage quota reached; ask the administrator to resolve it instead of repeatedly uploading |
| Attachment `503 attachment_storage_unavailable` | Storage did not complete; retain the error and ask the administrator to check disk storage |
| Download `404 attachment_not_found` | Check the ID, original instance, and identity; another user's receipt cannot be used to read their file |
| Media `400` / `415` | Check IDs, request shape, non-empty bytes, and MIME; renaming an extension does not turn a file into valid media |
| Media `403 media_owner_forbidden` | Use the uploader's identity or ask the owner to act within their permissions |
| Signed GET `401 media_signature_expired` / `invalid_media_signature` | Obtain a new link through the authenticated endpoint; do not edit the signature or expiry |
| Media `404 media_not_found` / `416 range_not_satisfiable` | The file may have been removed, or the Range needs correction |
| Media `503 media_signing_unavailable` | Ask the administrator to check the access-token configuration needed for signing |

Internal media failures may return `500 media_internal_error`. Upload parsers, reverse proxies, and generic authentication use different error bodies. Keep the HTTP status and actual response; see [Errors and Troubleshooting](./03-errors-and-troubleshooting.md).
