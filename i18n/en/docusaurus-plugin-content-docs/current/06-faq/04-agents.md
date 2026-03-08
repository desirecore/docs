---
title: Agent Issues
description: Resolve common issues with DesireCore Agent installation, configuration, and usage
keywords: [Agent, Companion, installation failure, reset, marketplace, skills, memory]
---

# Agent Issues

## Failed to install Companion from marketplace?

Common causes and solutions for marketplace installation failures:

1. **Network issues** — Marketplace resources need to be downloaded from remote repositories; check network connection
2. **Insufficient disk space** — Companion resources are stored in the `~/.desirecore/agents/` directory; ensure sufficient disk space
3. **Version incompatibility** — Some Companions may require higher versions of the DesireCore client. Check if the error message contains `clientUpgradeRequired` information; if so, please update the client first
4. **Directory permissions** — Ensure the `~/.desirecore/` directory has read/write permissions

## How to reset Companion to initial state?

If a Companion is behaving abnormally, you can reset it:

1. Click the "More" menu in the chat header
2. Select "Delete Agent" and check "Delete runtime records"
3. Reinstall the Companion from the marketplace

:::warning
Resetting will delete all conversation records, learning results, and custom configurations for that Companion. It's recommended to back up important conversation content before proceeding.
:::

## Companion doesn't remember previous conversations?

Companion memory is divided into two levels:

| Memory Type | Persistence | Description |
|---------|--------|------|
| Conversation Context | Temporary | Limited by model context window; earlier messages may be truncated |
| Long-term Memory | Persistent | Content written to Memory Ledger; retained across sessions |

If the Companion forgets content from conversations, it may be caused by context window limits. You can:

- Explicitly tell the Companion to remember important information (trigger teaching/memory writing)
- Choose models supporting larger context windows

## How to add skills to a Companion?

There are two ways:

1. **Install from marketplace** — Browse and install skills in the marketplace; they will automatically be associated with the Companion after installation
2. **Manual import** — Click "Import Skill" in the runtime status panel and select the skill file

Skills are stored as SKILL.md files in the `~/.desirecore/skills/` directory.

## What's the difference between global skills and exclusive skills?

| Type | Storage Location | Scope | Management Method |
|------|---------|---------|---------|
| Global Skills | `~/.desirecore/skills/` | Available to all Companions | Automatically synced with client updates |
| Exclusive Skills | Within Companion repository | Only available to corresponding Companion | Managed by the Companion itself |

## What do Companion online/offline statuses mean?

| Status | Meaning |
|------|------|
| Online (Green) | Companion is started and can receive messages and execute tasks |
| Working (Orange) | Companion is executing a task |
| Offline (Gray) | Companion is not started and needs to be manually powered on |

If the Companion is in offline status, a "Start" button will be displayed in the conversation header.

## How to view Companion profile information?

Click the "Agent Profile" button (book icon) in the chat header to view the Companion's:

- Basic information (name, role, description)
- Installed skills
- Memory entries
- Runtime status

## How to check progress after delegating to a professional Companion?

When the DesireCore general assistant delegates a task to a professional Companion, you'll see a blue delegation card. To check progress after delegation:

1. Find the delegated professional Companion in the left conversation list
2. Click to switch to that Companion's conversation
3. Subsequent progress and receipts for the task will be displayed there

## Customize Companion avatar and name?

The Companion's avatar and name are determined by its `agent.json` configuration file. You can:

1. Open the `~/.desirecore/agents/<companion-id>/` directory
2. Edit the `name` and `avatar` fields in `agent.json`
3. Restart the application to take effect

:::info
Companions installed from the marketplace may overwrite your customizations after updates. It's recommended to only make custom modifications to locally created Companions.
:::
