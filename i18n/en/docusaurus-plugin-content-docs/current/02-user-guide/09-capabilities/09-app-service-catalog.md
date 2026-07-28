---
title: App and Service Catalog
description: Manage app installation, service registration, runtime status, approvals, and updates.
keywords: [apps, services, catalog, approvals, MCP, marketplace, app store]
---

# App and Service Catalog

The App and Service Catalog centrally manages third-party apps, MCP services, and local services derived from installed apps. It is not just a list—it provides a closed loop from installation and registration through approval to lifecycle management.

## What It Contains

| Entry | Description |
|-------|-------------|
| Apps | Installable third-party capability packages or integration entry points |
| Services | MCP, HTTP, or local services registered after app installation |
| Pending approvals | Requests for service registration, invocation, privilege elevation, or test connections that require your confirmation |
| Install records | States including Installed, Failed, Running, Stopped, and Update available |

## Installation Flow

1. Select an app in the Marketplace or App Catalog
2. Click **Install**; DesireCore delegates to a core agent to perform the installation
3. The installation process is recorded locally (progress is visible in the catalog)
4. After installation, services derived from the app are automatically discovered and registered by a watcher
5. Services requiring permissions enter the pending-approval panel
6. After approval, the service becomes available
7. Agents can then use the service's capabilities in conversation

Once installed, you can open, start, stop, restart, or update the app/service from the catalog.

:::info Installation Failed?
If the installation is interrupted or fails, the catalog displays a **Failed** status with an error summary. Click **Retry** to reinstall, or check the logs for details.
:::

## Service Approvals

Services may request the following operations:

| Approval type | Trigger | Risk level |
|---------------|---------|------------|
| Register new service | App first exposes an MCP/HTTP endpoint | Low |
| Invoke external API | Service needs to access a third-party interface | Medium |
| Access local files or ports | Service needs to read/write local resources | Medium |
| Elevate privileges | Service requests higher execution permissions | High |
| Health probe | Periodic check whether a service is alive | Low |

These requests enter the approval flow. You can approve, reject, or inspect details. Unapproved stdio services are not executed silently in the background.

:::tip Batch Approval
If you trust all services from a particular app, select **Trust this app** in the approval panel. Future service registrations from that app will be approved automatically.
:::

## Status and Troubleshooting

| Status | Meaning |
|--------|---------|
| Installed | Installed but not necessarily running |
| Running | Service is active |
| Stopped | Manually stopped |
| Failed | Installation or startup failed |
| Update available | A newer version is available |
| Pending approval | Awaiting your approval |

If a service is unavailable, check the detail page for health-check results, log summaries, and approval status.

## FAQ

**Q: I installed an app but cannot find it in the catalog?**

Check whether installation completed. Progress is shown during installation; if you cancelled or it failed, the app will not appear in the installed list. Try reinstalling.

**Q: The service shows Running but the agent says it cannot call it?**

Check whether the service has been approved. An unapproved service runs as a process, but the agent cannot access its capabilities. Go to the approval panel to see if there are pending items.

**Q: How do I update an installed app?**

When a new version is available, the catalog displays an **Update available** badge. Click the app, go to its detail page, and select **Update**. Updates do not discard your configuration data.

**Q: Will uninstalling an app delete existing data?**

Uninstalling stops the app's derived services, but files and data already written locally are not deleted. If you need a thorough cleanup, manually remove the relevant data directories.
