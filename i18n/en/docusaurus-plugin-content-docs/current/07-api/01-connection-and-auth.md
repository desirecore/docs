---
title: Connect to an Instance and Authenticate
description: Verify a standalone Agent Service connection using its deployment address and instance token, and distinguish instance authentication from a Webhook secret.
slug: /api/connection-and-auth
sidebar_position: 1
keywords: [API, standalone, Agent Service, instance token, authentication, client-handshake]
---

# Connect to an Instance and Authenticate

Deployment owners can access their own DesireCore instance from a program or command line. This page uses an already running **standalone Agent Service** to explain where to obtain its address and credentials and perform a read-only connection check.

## Obtain the Address and Token

You need two pieces of deployment information:

| Information | Purpose | Where to obtain it |
|---|---|---|
| Public instance address | `BASE_URL` in the examples | Use the HTTPS address delivered for this instance, including its nonstandard port if applicable |
| Instance access token | The `X-Agent-Service-Token` header | Use the `AGENT_SERVICE_TOKEN` configured when starting the instance |

If the instance provisioning tool saved a deployment manifest, its `token` field is in `.deploy/instances/<instance-name>/instance.json` in the deployment project. Use the address in that instance's delivery information. For a manually started instance, obtain `AGENT_SERVICE_TOKEN` from the process or container startup configuration you maintain. Use the existing deployment token; generating a new value does not authenticate requests to the running instance.

For example, use `https://agent.example.com` as `BASE_URL` if that is the public address. Preserve any port included in the delivered address. `BASE_URL` contains no `/api`, page path, query parameters, or trailing slash. Container service ports are different from the public delivery address and do not determine its external port.

`https://docs.desirecore.com/api` is the documentation address. Send the requests below to your own instance.

## Choose the Appropriate Credential

| What you want to do | Credential | How to send it |
|---|---|---|
| Call instance APIs as the deployment owner | Instance access token | `X-Agent-Service-Token: <instance-token>` |
| Trigger an Agent Webhook configured and verified by an administrator | The target Agent's Webhook secret supplied by the administrator | `Authorization: Bearer <webhook-secret>` |
| Connect DesireCore to a model provider | Provider API key | Configure it in [Configure API Key](../01-getting-started/04-configure-api-key.md) |

The instance access token represents the instance owner's access and should be held by the deployment owner or a trusted service. A Webhook secret is used for the corresponding Agent's trigger endpoint; a service that only needs to trigger events can use that secret. Each endpoint still has its own configuration, execution permissions, and approval requirements.

Desktop instance addresses and credentials are managed by the desktop connection mechanism. The deployment manifest path above does not apply to desktop clients. Credentials obtained through desktop pairing remain valid until revoked; restarting does not revoke them. The `interactive` label does not imply strictly minimal permissions. Pairing credentials are not interchangeable with the owner token, so the owner connection procedure below does not directly apply to them.

## Verify the Connection

Replace the placeholders with your existing instance address and token, then run:

```bash
BASE_URL='https://agent.example.com'
AGENT_SERVICE_TOKEN='replace-with-your-existing-instance-token'

curl --silent --show-error --include \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  "${BASE_URL}/api/client-handshake"
```

### `GET /api/client-handshake`

| Item | Description |
|---|---|
| Request body | None |
| Required header | `X-Agent-Service-Token` |
| Success status | `200 OK` with a JSON response |
| Response caching | `Cache-Control: no-store, private` |

The following illustrates the response structure. Use your instance's actual version, identifier, time, and capability values:

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

Check these fields before calling a specific feature:

| Field | How to use it |
|---|---|
| `service` | Must be `desirecore-agent-service`; reject a different service or a web page |
| `instanceId` | Identifies the instance's data space; saving it helps detect a connection to a different instance |
| `deploymentMode` | `external` and `owner` are standalone modes; `embedded` indicates a desktop instance |
| `apiProtocolVersion` | Handshake and connection protocol identifier, currently the string `"1"` |
| `serverVersion` | Instance software version, useful for diagnosing compatibility issues |
| `clientCompatibility` | Connection compatibility range for DesireCore clients; `maximumVersion: null` means no upper bound is set |
| `capabilities` | Capabilities of the current deployment; a successful connection alone does not make an unavailable feature usable |
| `authentication` | Authentication type and instance scope for the deployment; specific operations still require their corresponding permissions |
| `serverTime` | Response time on the server, useful for diagnosing clock differences |

The handshake verifies existing credentials and the target service. It does not issue a new token or confirm that model services, Agent permissions, or all optional features have been configured. Interpret client connection compatibility and individual feature effective versions separately.

### Responses During Startup

An authenticated handshake can return the following while the instance is starting:

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

Wait as directed by `Retry-After`, then retry this read-only handshake. If the response persists, inspect the instance startup logs. Missing or invalid tokens still return `401`; waiting repeatedly does not resolve an authentication failure.

## Health Checks and Connection Verification

`GET /health` is for probes connecting directly to the service listener. It does not require an instance access token and only reports service status. The default standalone reverse proxy does not expose this path as a public API. Use the authenticated handshake above for external calls.

A direct probe also receives `503 service_not_ready` during startup. Once the service can accept requests, its response looks like this:

```json
{
  "status": "ok",
  "service": "agent-service",
  "protocol": "http",
  "fullReady": true
}
```

`protocol` identifies the HTTP or HTTPS listener being probed. `fullReady` is a background initialization diagnostic and can remain `false` while the service is already accepting requests. A successful health check does not verify the instance token, target instance identity, or an Agent's execution result. A `200` from `/health` on the public address may also contain a web page, so it is insufficient to establish an API connection.

## Store and Update Tokens

Keep the instance token in trusted service configuration. Avoid placing it in page source, public repositories, URLs, or shared logs. Standalone startup logs state that a token is configured without printing its value.

To update the instance token, change `AGENT_SERVICE_TOKEN` in the startup configuration you maintain, restart or recreate the corresponding service process, and update callers. Restarting with unchanged configuration does not revoke the old token. If you use a deployment manifest, update its token as well to prevent a later startup from restoring the old value. An administrator updates the Webhook secret separately in the target Agent's Webhook configuration and informs callers of the replacement.

Browser calls also depend on HTTPS, browser cross-origin rules, and any allowed origins configured by the deployment owner. When origin restrictions are enabled, `AGENT_SERVICE_CORS_ORIGIN` contains the calling page's exact origin, such as `https://app.example.com`, without a page path. An allowed origin still needs valid credentials. Do not embed an owner token in a page delivered to other users.

## Next Steps

- [Agent Webhook](./02-agent-webhook.md): trigger events with the target Agent's dedicated secret.
- [Errors and Troubleshooting](./03-errors-and-troubleshooting.md): resolve authentication, startup, request, and asynchronous execution issues.
