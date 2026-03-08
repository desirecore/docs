---
title: Agent Marketplace
description: Learn how to browse, search, install, update, and uninstall Agents in the DesireCore Agent Marketplace.
keywords: [Agent Marketplace, Agent Market, Install, Update, Uninstall]
---

# Agent Marketplace

The Agent Marketplace is the hub for discovering and acquiring Agents. You can browse official and community-provided Agents here and install them to your local environment with one click.

## Entering the Marketplace

Click the "Marketplace" icon in the main navigation bar to enter. The marketplace main interface contains three tabs:

| Tab | Content |
|---|---|
| **Agent** | Agent templates that become your exclusive assistants after installation |
| **Skill** | Skill packs that extend Agent capabilities |
| **Apps** | Third-party applications integrated with DesireCore |

## Browsing and Searching

### Category Browsing

Items in the marketplace are categorized by use case:

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

Each Agent is displayed as a card containing:

- Avatar and name
- Brief description
- Version number and update time
- Tags
- Installation status button

Click the card to enter the details page and view the full introduction, features, and changelog.

## Installing Agents

### Installation Steps

1. Find the Agent you want
2. Click the "Install" button
3. Wait for download and configuration to complete
4. After successful installation, switch to the new Agent on the conversation page to start using

:::info Installation Process
During installation, DesireCore downloads the Agent's configuration files and writes them to the local AgentFS file system. The entire process usually takes only a few seconds.
:::

### High-Risk Skill Confirmation

If the Agent contains high-risk skills (such as file writing, command execution), a security confirmation dialog will pop up during installation, informing you of the sensitive operations involved. You need to explicitly confirm before continuing installation.

### Dependency Check

Some Agents depend on specific tools or connections. If dependencies are missing, the system will prompt you to install the required components first.

## Updating and Uninstalling

### Updating

The system automatically detects available updates for installed Agents:

- Automatic check at startup
- The marketplace page displays an "Update" badge
- Click the "Update" button to view the changelog before confirming the update

:::tip Updates Won't Lose Your Modifications
If you have manually modified the Agent's configuration, the system will detect the deviation during update and skip overwriting to protect your custom content.
:::

### Uninstalling

1. Click the menu button on the installed Agent
2. Select "Uninstall"
3. Choose whether to keep configuration files
4. Confirm to complete uninstallation

## Next Steps

- [Create Custom Agent](./03-create-agent.md) — If the marketplace doesn't have an Agent that meets your needs, create one yourself
- [Skills Management](./07-skills-management.md) — Learn how to add and manage skills for Agents
