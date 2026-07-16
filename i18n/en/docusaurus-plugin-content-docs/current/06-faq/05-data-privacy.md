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

DesireCore keeps the API keys it manages in a protected local secrets store. Compute Provider configuration contains references rather than key values. Agent file tools and commands are restricted from directly reading that secrets file, and platforms with POSIX permissions limit it to the current user. Configuring a compute Provider does not upload the key to DesireCore servers.

OAuth, CLI, or subscription sign-in credentials may be managed by the corresponding external tool or operating-system mechanism. They are outside the API-key migration scope.

:::warning
Local protection does not make the data root safe to share. Copying all of `~/.desirecore/` may also copy `config/secrets.json`. Protect your OS account, enable full-disk encryption, and treat a raw directory copy as credential-bearing data.
:::

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

Create a regular backup from **Settings > Data & Privacy > Export Data**. This is the recommended restore point for the same device and identity. It supports category selection and excludes caches, device identifiers, and the original local secrets store.

Other backup methods:

1. **System backup** — Protect the data directory with tools such as Time Machine or Windows Backup
2. **Manual copy** — Quit DesireCore, then copy `~/.desirecore/` to a controlled location
3. **Version control** — Companion repositories use Git; push only content you have explicitly determined is safe to share

:::warning
A system backup or raw directory copy is different from in-app export and may contain `config/secrets.json`, account sessions, logs, and caches. Encrypt the backup medium, restrict access, and never commit or send the entire data directory.
:::

## How to migrate data to another computer?

1. On the old computer, open **Settings > Data & Privacy > Migrate to New Device**
2. Choose the migration categories; Agents and system configuration are required
3. To carry eligible keys, explicitly select API-key migration and set a migration passphrase of at least 12 characters
4. Install DesireCore on the new computer and preferably update it to the same or a newer version than the exporter
5. Open **Import Data**, select the migration package, and choose whether to use the package identity or merge into the local identity
6. If importing keys, enter the migration passphrase and resolve same-Provider conflicts by keeping the local or imported value
7. Restart DesireCore, then verify connectivity and permissions for each imported key

A regular backup and a device migration have different semantics. A backup is for same-device recovery and never carries API keys. A migration package contains identity metadata and carries only eligible user-managed compute Provider API keys after explicit opt-in. The original `config/secrets.json` is never placed in an in-app package.

The key payload uses a migration passphrase processed with scrypt and is encrypted with AES-256-GCM. DesireCore does not save or recover the passphrase. Account sessions, official cloud compute, OAuth- or CLI-managed credentials, and other non-compute credentials are excluded and must be authorized again.

:::warning
If the target already has important data, create the regular backup required by the import flow. Migration stops the Agent service, interrupts running tasks, and may replace identity or configuration. Never import a migration package from an untrusted source.
:::

## How to completely delete all data?

To thoroughly clear all local data from DesireCore:

1. Close the DesireCore application
2. Delete the `~/.desirecore/` directory
3. If you used a sign-in managed by OAuth, a CLI, or a subscription tool, sign out and clear its credentials according to that tool's instructions
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

As a client application, DesireCore only sends anonymous installation statistics to the update server on launch (device hash identifier, version number, operating system platform, and CPU architecture), used for counting unique installations. Beyond this, it does not collect or upload any of your data. The application's update check only retrieves version information and does not transmit user data.
