---
title: Data & Privacy
description: Learn about DesireCore's data storage methods, manage data export, import, and deletion.
keywords: [data, privacy, backup, export, import, deletion, local storage]
---

# Data & Privacy

DesireCore adopts a **Local-first** architecture, your data is stored locally on your device by default. This page introduces how to manage your data.

## Data Storage Location

DesireCore's data is stored in the following directories by default:

| Operating System | Path |
|------------------|------|
| macOS | `~/.desirecore/` |
| Windows | `%USERPROFILE%\.desirecore\` |
| Linux | `~/.desirecore/` |

This directory contains:

- **Agent Configuration**: `agents/` — Agent personas, memories, and settings
- **Skill Definitions**: `skills/` — Global and agent-specific skills
- **User Configuration**: `config/` — User profiles, avatars, compute configurations
- **Conversation Records**: Session history and execution receipts
- **Market Cache**: `market/` — Resources downloaded from the marketplace

## Exporting Data

You can export DesireCore's data as a backup file for migrating to another device or regular backup.

1. Open **Settings** → **Data & Privacy**
2. Click **Export Data**
3. Select save location
4. Wait for export to complete

The export file contains your agent configurations, conversation records, skills, and user settings.

:::tip
We recommend regularly exporting data as backup, especially before upgrading the system or changing devices.
:::

## Importing Data

Restore data from a backup file:

1. Open **Settings** → **Data & Privacy**
2. Click **Import Data**
3. Select the previously exported backup file
4. Wait for import to complete, the app will automatically restart

:::warning
Importing will overwrite current local data. If there is important data on the current device, we recommend exporting a backup first.
:::

## Clearing Local Data

If you need to reset DesireCore to its initial state, you can selectively clear local data.

1. Open **Settings** → **Data & Privacy**
2. Click **Clear Local Data**
3. Select data categories to clear:

| Data Category | Contains |
|---------------|----------|
| **Conversation Records** | All chat messages, session history, and execution receipts |
| **Agents** | Agent configurations, personas, and memories (core agents will be automatically reinstalled) |
| **Skills** | Global skill definitions (built-in skills will be automatically reinstalled) |
| **Compute** | LLM providers, model lists, and compute node configurations |
| **Storage** | S3 object storage connection configurations |
| **Code Hosting** | GitHub/Gitee/Gitea connection configurations |
| **User Profile** | User identity, avatar, personal memory library, and command approval settings |
| **Market Data** | Official marketplace repository cache |
| **Cache & Logs** | Usage statistics indexes, relationship graph cache, and log files |

4. After confirming selection, click **Clear Selected Data**
5. The system will stop background services, delete data, and restart the app in sequence

:::danger
Data clearing **cannot be undone**. Cleared data will be permanently deleted. If you just want to resolve app anomalies, we recommend trying to clear the "Cache & Logs" category first, which usually solves most problems without losing important data.
:::

## Privacy Protection

DesireCore's design principles for privacy protection:

- **Data Doesn't Leave Local**: All data is stored on your device by default, not automatically uploaded to the cloud
- **API Key Secure Storage**: Uses operating system credential manager for encrypted storage
- **AI Call Transparency**: Every AI model call request and response has audit records, viewable in activity records
- **No Telemetry Collection**: DesireCore does not collect usage telemetry data
