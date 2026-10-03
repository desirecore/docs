---
title: Agent Marketplace
description: Learn how to browse, search, install, update, and uninstall Agents in the DesireCore Agent Marketplace.
keywords: [Agent Marketplace, Agent Market, Install, Update, Uninstall]
---

# Agent Marketplace

Use the Agent Marketplace to find and install Agents, teams, Skills, and apps from official and community listings. Open an item's details to review its source, maintainer, version, and available actions.

## Entering the Marketplace

Click **Marketplace** in the main navigation. Browse items by type, or use search and filters:

| Type | Content |
|---|---|
| **Agents** | Agents you can install and use |
| **Teams** | Collaboration setups with a supervisor and members |
| **Skills** | Skills that can be installed globally or for a selected Agent |
| **Apps and services** | Installable integrations and services that an app may provide |

## Browsing and Searching

### Category Browsing

Categories depend on the item type and publisher-provided information, and may change with catalog contents. Common categories include:

| Category | Description |
|---|---|
| Productivity | Tool-type Agents that improve work efficiency |
| Development | Software development assistance |
| Communication | Language and communication related |
| Learning | Knowledge and learning assistance |
| Creative | Creativity and design related |

### Search and Filter

- **Keyword Search**: Search in names, descriptions, and tags
- **Filter Conditions**: Filter by category, installation status, and source repository
- **Sort Options**: Sort by update time, name, or popularity

### Item Cards

Click a card to view the full introduction, features, and changelog. Cards show the name, summary, maintainer, content source, version, and category. Icon badges and a separate text hint explain acquisition status.

| Item status | Card action |
|---|---|
| Available to install | **Install** |
| Eligible update available | **Update** |
| Installed | **Manage**, or **Open** when available |
| Installation in progress | Progress is shown; duplicate actions are disabled |
| Catalog-only or temporarily unavailable | View details |

For installed items, **More actions** provides the currently available management, details, and uninstallation actions. Manage Agents, teams, and Skills directly in the marketplace. App and service management opens the resource center.

Team cards preview the supervisor separately from the remaining members, without repeating the supervisor. The total member count is separate from the avatar overflow count. A maintainer verification badge does not guarantee a license or safe installation.

## Where Installation Content Comes From

The marketplace catalog stores descriptions, sources, versions, verification information, and installation entries. Some items keep their actual content in the publisher's repository and download it during installation. The catalog also provides source, verification, and license notices.

:::info Catalog terminology
Technical documentation calls the marketplace catalog a metadata registry and a record pointing to actual content a pointer.
:::

## Installing Items

### Installation Steps

1. Search or browse items, open the Agent or team details, and review its purpose, source, and version.
2. Select **Install** and confirm the requested options.
3. Wait for download and configuration to complete, then review dependency results.
4. Switch to the new Agent on the conversation page. If dependencies are incomplete, use the next section to install the required Skills first.

:::info Where to Check Installation Results
Agent configuration is stored in local files (AgentFS). Choose a global or Agent-specific location when installing Skills, then view them in [Skills Management](./07-skills-management.md). For marketplace apps, select a target device; the core Agent performs installation and shows progress. Confirm completion in the [App and Service Catalog](../09-capabilities/09-app-service-catalog.md), which records verified results by source and device. An app may provide services, but not every app does.
:::

### High-Risk Skill Confirmation

If the Agent contains high-risk skills (such as file writing, command execution), a security confirmation dialog will pop up during installation, informing you of the sensitive operations involved. You need to explicitly confirm before continuing installation.

### Dependency Check

After installing or updating an Agent, open its details to check required Skills. **Agent installed, dependencies incomplete** means the Agent is installed but the listed Skills still need attention.

1. Review missing Skills and their reasons.
2. Select **Install missing dependencies** for retryable items.
3. Select **Refresh dependency status** to check again.

A failed repair retains completed dependencies and displays the failure reason. Tool and connection setup still follows their own requirements.

### Adjust Download and Extraction Limits

1. Open marketplace settings to manage source repositories.
2. Select **Source download and extraction settings**.
3. Adjust the limits and save. Settings apply to new requests; adjust the budget and retry if a limit is exceeded.

| Setting | Available adjustment |
|---|---|
| ZIP and web / Markdown downloads | Separate size limits, or unlimited download size |
| Total extracted size, individual file size, ZIP entry count | Separate limits that still apply when downloads are unlimited |

### View Progress or Cancel Acquisition

The acquisition panel shows download, checkout, verification, extraction, and installation stages, with byte or Git object progress when available. A cache hint means previously downloaded and verified content is being used.

| Panel message or action | What to do |
|---|---|
| **Cancel acquisition** | Cancel the current acquisition; cancellation may no longer be available during installation |
| Progress connection interrupted | Wait for the interface to reconnect |
| **Result unconfirmed** | Refresh the marketplace to check the actual installed state before retrying |

## Importing Agents

Besides installing from the marketplace, you can import Agents from local files or public locations:

| Method | Description |
|--------|-------------|
| Folder import | Select a local AgentFS folder |
| ZIP import | Select a packaged Agent archive |
| Public URL import | Enter a public repository or reachable Agent address |

During import, DesireCore checks `agent.json`, repository structure, and agent ID. If a local Agent already uses the same UUID or path, the interface prompts you to overwrite, skip, or keep the existing content.

## Updating and Uninstalling

### Updating

The system automatically detects available updates for installed Agents:

- Automatic check at startup
- An icon badge on the marketplace card indicates an available update, with an **Update** action
- Click the "Update" button to view the changelog before confirming the update

:::info When You Have Local Edits
Updates check local changes. Review any differences or conflicts shown before choosing to keep local content, use the remote version, or merge manually. For important configurations, first review history or export a backup using [Version Control](./08-version-control.md).
:::

If local changes conflict with an update, use the conflict resolution flow described in [Version Control](./08-version-control.md).

### Why Updates Are Paused

Marketplace-installed Agents whose content comes from a publisher's repository update to the currently approved marketplace version. New repository commits must be reviewed and listed by the marketplace before they become available as updates.

If the catalog is unavailable, acquisition is blocked, or version validation fails, the interface shows **Updates are paused** and explains why. A paused update does not mean the Agent is up to date. Restore source access or upgrade the client as prompted, then check again.

### Uninstalling

1. Find the installed Agent in the marketplace and open **More actions**
2. Select "Uninstall"
3. Choose whether to keep configuration files
4. Confirm to complete uninstallation

## Next Steps

- [Create Custom Agent](./03-create-agent.md) - If the marketplace doesn't have an Agent that meets your needs, create one yourself
- [Skills Management](./07-skills-management.md) - Learn how to add and manage skills for Agents
