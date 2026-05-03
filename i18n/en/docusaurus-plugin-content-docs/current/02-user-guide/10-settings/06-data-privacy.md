---
title: Data and Privacy
description: Understand how DesireCore stores data and how to export, import, and clear it.
keywords: [data, privacy, backup, export, import, clear, local storage]
---

# Data and Privacy

DesireCore is local-first. Agents, skills, conversations, configuration, audit records, and caches are stored on your device by default. AI inference requests are sent only to the model providers you configure.

## Data Location

| OS | Path |
|----|------|
| macOS | `~/.desirecore/` |
| Windows | `%USERPROFILE%\.desirecore\` |
| Linux | `~/.desirecore/` |

| Directory | Content |
|-----------|---------|
| `agents/` | Agent repositories, persona, principles, memory, skills, workflows |
| `users/` | User profile, preferences, relationship memory |
| `skills/` | Global skills, including built-in and imported skills |
| `config/` | User settings, compute configuration, provider references |
| `runs/` | Conversations, execution records, receipts, audit data |
| `market/` | Marketplace cache |
| `cache/` | Rebuildable cache |
| `logs/` | Local logs and troubleshooting data |

## Exporting Data

Open **Settings** -> **Data and Privacy** to export data. Exports can be selected by category.

| Category | Includes |
|----------|----------|
| Agents and Teams | AgentFS repositories, persona, principles, memory, skills, workflows, team definitions, and relationship memory |
| Skills | Global and custom skills |
| Conversations | Session messages, receipts, history |
| System Configuration | User settings, non-plaintext compute configuration, UI preferences |
| Media | Media resources created or referenced in conversations and tools |
| Mail | Local mail data and rules |
| Workspace Files | Selected work directory files |
| Audit Logs | API audit, tool-call audit, and related metrics |

Exports exclude or separately handle runtime directories, caches, device identifiers, and plaintext secrets.

:::tip Backup Advice
Before upgrading, moving to a new device, or bulk-editing agents, export agents, user data, skills, system configuration, and audit logs.
:::

## Importing Data

When importing a backup, DesireCore reads the package and lets you choose which categories to restore. It checks structure, duplicate agents, skill or team conflicts, large workspace files, and path accessibility. When conflicts are found, the UI can offer options such as overwrite, skip, or keep both.

Import may require an app restart or background service refresh after files are restored. If the current device already has important data, export a backup before importing.

## Clearing Local Data

You can clear local data by category:

| Category | Includes |
|----------|----------|
| Conversations | Chat messages, session history, receipts |
| Agents | Agent configuration, persona, memory, and skills |
| Skills | Global skills; built-in skills reinstall automatically |
| Compute | LLM providers, model lists, compute nodes |
| Storage | S3 or object storage connection settings |
| Code Hosting | GitHub, Gitee, Gitea connection settings |
| User Profile | Identity, avatar, memory library, approval preferences |
| Market Data | Marketplace repository cache |
| Cache and Logs | Usage indexes, relation graph cache, logs, rebuildable data |

:::danger
Clearing data is irreversible. For troubleshooting, clear cache and logs first instead of deleting agents or user profiles.
:::

## Privacy Guarantees

- **Local storage**: core data stays on your device by default
- **Key protection**: API keys are stored in the system credential manager
- **Transparent calls**: AI requests, tool calls, and external service interactions can be audited
- **Minimal telemetry**: startup statistics do not include conversation content
- **Exportable audit**: audit logs can be exported as an independent category

## Sensitive Scenario Advice

- Use local models or trusted private model services for highly sensitive content
- Review API Audit in Activity to confirm which provider receives data
- Keep confirmation enabled for command execution, file writes, and external sends
- Export first, then selectively import when migrating devices
