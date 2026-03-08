---
title: Data and Privacy Issues
description: Learn about DesireCore's data storage locations, security measures, and privacy protection
keywords: [data security, privacy protection, data storage, backup, delete data, API Key security]
---

# Data and Privacy Issues

## Where is data stored?

DesireCore adopts a local-first architecture; all data is stored in your local file system:

| Data Type | Storage Location | Description |
|---------|---------|------|
| Companion Data | `~/.desirecore/agents/` | Configuration, skills, memory, etc. |
| Skill Files | `~/.desirecore/skills/` | Global skills |
| User Configuration | `~/.desirecore/config/` | User profile, avatar |
| Marketplace Cache | `~/.desirecore/market/` | Local copy of marketplace repository |
| App Cache | System app data directory | Temporary cache, can be safely deleted |

## Is API Key storage secure?

DesireCore uses the operating system's credential manager to securely store API Keys:

- **macOS**: Keychain
- **Windows**: Windows Credential Manager
- **Linux**: libsecret / GNOME Keyring

API Keys are not stored in plaintext in configuration files, nor are they transmitted to DesireCore's servers.

## Where is conversation content sent?

Conversation content is only sent to the AI model provider API you configure. DesireCore will not forward your conversation content to any other servers.

Specific data processing policies depend on the model provider you choose:

- **OpenAI**: Please refer to OpenAI's data usage policy
- **Anthropic (Claude)**: Please refer to Anthropic's privacy policy
- **Other providers**: Please refer to the corresponding provider's privacy terms

:::tip
If you have strict data privacy requirements, consider using locally deployed models (such as Ollama), where all inference is completed locally without sending any data externally.
:::

## How to back up data?

Backing up the entire `~/.desirecore/` directory will save all data. Recommended backup methods:

1. **Manual copy** — Copy the `~/.desirecore/` directory to a safe location
2. **Regular backup** — Use system backup tools (such as Time Machine, Windows Backup) to include this directory
3. **Version control** — Companion repositories themselves use Git for version management; important Companions can be pushed to remote repositories

:::warning
Please note when backing up that the `~/.desirecore/` directory may contain temporary files and cache. Core data is mainly in the `agents/`, `skills/`, and `config/` subdirectories.
:::

## How to migrate data to another computer?

1. Back up the `~/.desirecore/` directory on the old computer
2. Install DesireCore on the new computer
3. Copy the backed-up directory to the `~/.desirecore/` location on the new computer
4. Reconfigure API Keys (API Keys are stored through the system credential manager and cannot be directly migrated)
5. Start DesireCore, data will be automatically loaded

## How to completely delete all data?

To thoroughly clear all local data from DesireCore:

1. Close the DesireCore application
2. Delete the `~/.desirecore/` directory
3. Clear API Keys stored in the system credential manager:
   - macOS: Open "Keychain Access", search for "desirecore" and delete
   - Windows: Open "Credential Manager", search and delete relevant entries
   - Linux: Use the `secret-tool` command to delete
4. Uninstall the application
5. Clear application cache directory (optional)

## How is third-party API data security ensured?

When DesireCore sends data to third-party APIs:

- Uses HTTPS encrypted transmission
- Only sends content necessary for the current conversation context
- Does not send Companion's local file content (unless you explicitly request it)
- Does not send your personal configuration information

However, please note that once data is sent to a third-party API, its processing is determined by that provider's policy. Recommendations:

- Do not include sensitive personal information (such as passwords, bank card numbers) in conversations
- Understand the data retention policy of the provider you use
- Use locally deployed models for highly sensitive scenarios

## What data does DesireCore itself collect?

As a client application, DesireCore does not collect or upload any of your data beyond what you actively send to AI provider APIs. The application's update check only retrieves version information and does not transmit user data.
