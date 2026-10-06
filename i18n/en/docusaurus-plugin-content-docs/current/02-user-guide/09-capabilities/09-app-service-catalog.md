---
title: Apps, Plugins, and Services
description: Distinguish app usage, plugin contribution management, marketplace acquisition, and service diagnostics.
keywords: [apps, plugins, services, activation, configuration, approvals, MCP, marketplace]
---

# Apps, Plugins, and Services

Apps provide standalone software or workspaces. Plugins are an app subtype that extends the DesireCore platform. Services provide MCP, HTTP, and other connection or execution interfaces. They are related, but their user-facing actions differ.

## Where to Go

| Goal | Entry and action |
|---|---|
| Use an installed app | **Apps** on the primary rail → **Apps** tab; select and open an application |
| Configure platform plugins | **Apps** → **Plugins** tab; inspect activation, enable or disable contributions, and configure them |
| Acquire apps or plugins | Marketplace → Apps; filter **Product type: Plugin** for plugins |
| Manage connections and runtime problems | Resources → Services; inspect connections, configuration, and diagnostics |

Apps and Plugins are peer tabs in one workspace. Switching tabs preserves visited views while keeping **Open** separate from **Enable**, **Configure**, and **Disable**. Plugin settings opened from another panel keep a return path to the original source.

Installation is an installation fact, not proof of activation. Configuration, compatibility, dependencies, and access permissions determine whether a plugin can contribute. The Plugins tab reports the activation outcome; an enabled setting is not current runtime evidence. With no installed plugins, use **Discover plugins** from the empty state to open the marketplace filter.

## What It Contains

| Entry | Description |
|-------|-------------|
| Apps | Standalone software or workspaces that users can open and use |
| Plugins | An app subtype that contributes platform capabilities, configured and managed in the Plugins tab |
| Services | MCP, HTTP, or local services registered after app installation |
| Pending approvals | Requests for service registration, invocation, privilege elevation, or test connections that require your confirmation |
| Install records | States including Installed, Failed, Running, Stopped, and Update available |

## Installation Flow

1. Choose an app or plugin in Marketplace
2. Click **Install**, choose the target device, and delegate installation to the core Agent
3. Follow progress in the delegated conversation or task; the Agent verifies the result before recording the installation
4. Open applications from the Apps tab; inspect plugin contributions and activation conditions in the Plugins tab
5. Configure and authorize MCP or HTTP services separately through their service integration flow
6. Current configuration, compatibility, and access permissions determine whether a plugin or service is usable

App opening and maintenance, plugin contribution activation, and service connections/runtime status remain separate. Installing one does not automatically authorize another. If a task is cancelled, fails to send, or is interrupted, check the actual target and installation record before retrying. Some compatibility installations provide declared services, but not every app has a service; verify service connections and access in their resource entries.

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

Operations follow the current approval mode and permissions. When confirmation is required, you can approve, reject, or inspect details. Installation, activation, and actual invocation each check authorization.

:::tip Authorization and Associations
App associations, plugin activation, and service connections do not replace actual access permissions. The shared workspace changes navigation and layout, not the capabilities an Agent is allowed to invoke.
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

**Q: I installed an app but cannot find it in the catalog?**

Check the Apps or Plugins tab, target device, and current connection first. Then inspect verification and registration in the original delegated task. A missing catalog or record does not prove the software is absent; do not repeat installation blindly.

**Q: The service shows Running but the agent says it cannot call it?**

A running service does not prove that the current Agent can use it. Check the connection, available tools, and approval state. Operations requiring confirmation use the existing approval flow.

**Q: Why are there multiple installation records for the same app?**

Records are managed separately by source and target device. Check both in the details before updating or uninstalling an instance.

**Q: How do I update an installed app?**

Request an update from the appropriate management entry. The Agent reads the current installation and maintenance materials, verifies the version and data-preservation scope, and performs the update. Recheck actual state after a failure; arbitrary software updates do not have automatic rollback guarantees.

**Q: Will uninstalling an app delete existing data?**

Uninstall the exact installation after checking shared users and data impact. User data is retained by default. Disabling plugin contributions does not uninstall the app or clean up data; any cleanup requires a separately defined scope.
