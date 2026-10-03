---
title: App and Service Catalog
description: Check app installations, manage app services, and handle approval requests.
keywords: [apps, services, catalog, approvals, MCP, marketplace, app store]
---

# App and Service Catalog

Use the App and Service Catalog to install apps, check installation records, manage running services, and handle pending approvals.

## What It Contains

| Entry | Description |
|-------|-------------|
| Apps | Installable third-party capability packages or integration entry points |
| Services | MCP, HTTP, or local services registered after app installation |
| Pending approvals | Requests for service registration, invocation, privilege elevation, or test connections that require your confirmation |
| Install records | States including Installed, Failed, Running, Stopped, and Update available |

## Installation Flow

1. Open an app's details in the Marketplace or App Catalog.
2. Select **Install** and choose the target device.
3. Follow progress while the core agent performs the installation.
4. When it finishes, check the installation record for the correct source and device.

An agent performs installations and updates. If a task is cancelled, fails to send, or is interrupted, check the installation record before retrying.

Some apps provide services that are discovered and registered automatically after installation. Services requiring permission appear in pending approvals; the agent can use them after approval. Not every app provides a service.

After installation, open the entry's details for available actions, such as start, stop, restart, or update.

:::info Installation Failed?
If installation fails, open the details to read the reason and logs. Select **Retry** if you want to try again.
:::

## Service Approvals

When a service requests access or an operation, open the approval details. Check the source and requested permissions before deciding whether to approve.

| Request | What to check | Risk level |
|---------------|---------|------------|
| Register a service | Which service the app connects to and why | Low |
| Call an external API | Which third-party service it will access | Medium |
| Access local files or ports | Which local resources it may read or change | Medium |
| Request higher privileges | Why extra permission is needed and what it affects | High |
| Health check | What status the service will check | Low |

You can inspect, approve, or reject a request. A service that requires approval is unavailable to agents until you approve it.

:::tip Batch Approval
If you trust all services from a particular app, select **Trust this app** in the approval panel. Future service registrations from that app will be approved automatically.
:::

## Status and Troubleshooting

| Status | Meaning | Next step |
|--------|---------|-----------|
| Installed | Installed but not necessarily running | Open details for available actions |
| Running | Service is active | If unavailable, check approval and health status |
| Stopped | Not running | Check the start action in details when needed |
| Failed | Installation or startup failed | Read the error and logs before retrying |
| Update available | A newer version is available | Open details and select **Update** |
| Pending approval | Awaiting your approval | Inspect and handle the request in the approval panel |

## FAQ

**Q: The service shows Running but the agent says it cannot call it?**

Check whether the service has been approved. An unapproved service runs as a process, but the agent cannot access its capabilities. Go to the approval panel to see if there are pending items.

**Q: Why are there multiple installation records for the same app?**

Records are managed separately by source and target device. Check both in the details before updating or uninstalling an instance.

**Q: Will uninstalling an app delete existing data?**

Uninstalling stops the app's derived services. Before confirming, read the dialog: linked agents lose the app entry, while the agents and their data remain. Follow the app's instructions if you also need to remove other local files.
