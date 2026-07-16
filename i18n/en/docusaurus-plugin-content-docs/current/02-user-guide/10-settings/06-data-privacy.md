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

### Backup vs. Device Migration

**Export Data** and **Migrate to New Device** have different semantics:

| | Regular backup | Migrate to New Device |
|---|---|---|
| Primary purpose | Create a restore point for this device and identity | Carry identity and data to another device |
| Identity handling | Does not replace or remap the user identity | The target can replace its identity or merge into its current identity |
| Required content | Categories are selectable | Agents and system configuration are required; other categories are optional |
| API keys | Not included | Eligible user-managed compute Provider API keys can be included explicitly and encrypted |
| Conflicts | Handled by imported category | Merge mode resolves user data, Agents, Teams, and keys as semantic units |

Use a regular backup as a same-device restore point. For another device, use the migration wizard so the package contains source identity and version metadata. That metadata lets the target correctly handle identity-scoped profiles, preferences, private memory, and related data.

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

Exports exclude or separately handle runtime directories, caches, device identifiers, and the original local secrets store.

:::tip Backup Advice
Before upgrading or bulk-editing Agents, create a regular backup. When migrating onto a device that already contains data, the import flow also requires a restore point unless you explicitly accept the risk and skip it.
:::

### Optional Compute API Key Migration

API keys never follow a regular backup automatically. The device-migration wizard can optionally carry only keys that you entered for a compute Provider, manage yourself, and that can be explicitly bound to that Provider configuration.

It excludes:

- DesireCore account sessions and official cloud-compute credentials
- Credentials managed by OAuth, a CLI, or another external sign-in flow
- Sign-in state managed by subscription or command-line tools such as Claude or Codex
- Object storage, code hosting, mail, and other non-compute-Provider credentials

When you opt in, DesireCore still never archives the original `config/secrets.json`. Eligible keys are deduplicated into a separate encrypted payload. The migration passphrase is processed with scrypt (`N=2^17`, `r=8`, `p=1`) and the payload is protected with AES-256-GCM authentication and encryption. The passphrase must contain at least 12 characters. DesireCore neither saves it nor can recover it if lost.

On import, you may skip keys without affecting any other migrated data. To import them, unlock the payload with the migration passphrase. An incorrect passphrase, tampered package, or damaged payload prevents key import. If the target already has a key for the same Provider, choose per key whether to keep the local value or use the imported value. Replace mode defaults to the imported value; merge mode defaults to the local value. Imported keys are marked unverified, so verify connectivity and permissions again on the new device.

:::warning An encrypted migration package is still sensitive
Encryption reduces exposure if the package leaks; it does not replace careful handling. Store the package separately from its passphrase, do not import an untrusted or suspicious package, and securely remove copies you no longer need. Copying the entire data root manually instead of using in-app export may also copy the local secrets store, so treat that copy as credential-bearing data.
:::

## Importing Data

DesireCore reads the package marker and distinguishes a regular backup from a migration package. A backup lets you choose categories to restore. A migration package enters the identity-migration flow. It checks structure, duplicate Agents, skill or Team conflicts, large workspace files, and path accessibility.

For a migration package from a different identity, choose one of two modes:

- **Use as this device's new identity**: use the package identity and data; data under the current identity is no longer accessed as the active identity
- **Merge into current identity**: retain the local identity, remap imported user data to it, and resolve conflicts item by item

When the target already has user-created Agents, the flow requires a regular backup as a rollback point unless you explicitly accept the risk and skip it. Import stops the Agent service and interrupts running tasks. Restart the app after migration completes.

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
- **Key protection**: in-app export always excludes the original local secrets store; eligible compute API keys enter a migration package only as a separate encrypted payload after explicit opt-in
- **Transparent calls**: AI requests, tool calls, and external service interactions can be audited
- **Minimal telemetry**: startup statistics do not include conversation content
- **Exportable audit**: audit logs can be exported as an independent category

## Sensitive Scenario Advice

- Use local models or trusted private model services for highly sensitive content
- Review API Audit in Activity to confirm which provider receives data
- Keep confirmation enabled for command execution, file writes, and external sends
- Use a regular backup for same-device recovery and the migration wizard for moving devices
- Create a rollback point first, and keep a key-bearing migration package separate from its passphrase
