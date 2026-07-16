---
title: Data Security
description: Learn how DesireCore protects your data security, including local storage, encryption, and API call data flow.
keywords: [data security, encryption, local storage, API Key, privacy, third-party]
---

# Data Security

Data security was a core consideration from the beginning of DesireCore's design. This page helps you understand how your data is protected.

## Local-First Architecture

DesireCore adopts a **Local-first** architecture, which means:

- **Data stored on your device**: All agent configurations, conversation records, skill definitions, and user settings are saved in the local file system (`~/.desirecore/` directory)
- **No internet needed for core functions**: If you use locally deployed AI models (like Ollama), DesireCore can run completely offline
- **You have full control over your data**: You can view, export, back up, or delete your data at any time

:::info Why Local-First?
Cloud architecture means your conversations, instructions, and file content all have to be uploaded to remote servers, bringing data leakage risks. Local-first architecture fundamentally eliminates this problem—data is always in your hands.
:::

## API Key Secure Storage

When you configure AI providers, you need to enter an API Key. DesireCore's protection measures for API Keys:

- **Centralized local store**: Keys managed by DesireCore are kept in `config/secrets.json`; compute Provider configuration stores only an `apiKeyRef`
- **File permissions**: Platforms with POSIX permissions restrict the secrets file to the current user; other platforms rely on OS account and directory access controls
- **Agent access controls**: Built-in file tools, content search, and command approval block Agents from directly reading the protected secrets file
- **Constrained destination**: A BYOK value is not uploaded to DesireCore servers as configuration. When a model request is made, it is used only as authentication for the endpoint configured for that Provider

OAuth, CLI, or subscription sign-in may be managed by the corresponding external tool or operating-system mechanism. These credentials are different from API keys managed by DesireCore and are excluded from optional API-key migration.

## Third-Party API Data Flow

When agents call AI models, data is sent to the AI providers you configure. Here's what you need to know:

```
Your Input → DesireCore (Local) → AI Provider API → Response Returns → DesireCore (Local)
```

**Data Sent to AI Providers**:
- Your conversation messages (for generating responses)
- Relevant context (such as file content fragments, for task execution)
- System prompts (agent's role settings)

**Data Not Sent**:
- Your API Key is not shared with anyone except the target provider
- Your local files are not uploaded in bulk
- Other providers' configuration information is not sent

:::tip
Every AI call's request and response is recorded in the "API Audit" of activity records, where you can view what data was sent where at any time.
:::

## Data Encryption

- **Transmission encryption**: Supported online services use HTTPS/TLS by default. The final security of a custom Provider depends on the user-configured endpoint; do not use plaintext HTTP in production
- **Local secrets protection**: The secrets file relies on the OS account, file permissions, and device security. Enable FileVault, BitLocker, or equivalent full-disk encryption
- **Migration encryption**: A regular backup excludes the original secrets file. Only after explicit opt-in are eligible compute API keys processed with scrypt and placed in a separate AES-256-GCM migration payload
- **Local data**: Other local files primarily rely on operating-system permissions. Do not assume that the whole data directory or a regular backup is encrypted by DesireCore

:::warning Responsibility when migrating keys
DesireCore does not save the migration passphrase. Store it separately from the migration package and never import an untrusted package. Imported keys are reset to an unverified state; verify their permissions, billing ownership, and connectivity on the new device. A raw copy of the whole data directory may contain the local secrets file and has a different risk profile from an in-app regular backup.
:::

## Minimal Anonymous Statistics

DesireCore only sends anonymous installation statistics to the update server on each launch, including:

- A SHA-256 hashed device identifier based on hardware information (irreversible, cannot be associated with personal identity)
- Client version number, operating system platform, and CPU architecture

We do not:

- Track your usage behavior
- Collect crash reports (unless you actively submit)
- Analyze your conversation content
- Upload any user content such as conversations, configurations, or files

## Update Security

DesireCore's automatic updates ensure security through:

- Update packages are downloaded from the official server (`download.desirecore.net`)
- macOS versions are notarized by Apple
- You can manually control update timing on the "About" page

## Security Recommendations

To maximize protection of your data security, we recommend:

1. **Enable Disk Encryption**: Turn on the operating system's full-disk encryption feature
2. **Regular Backup**: Use **Export Data** for same-device recovery, and use **Migrate to New Device** with a rollback point when changing devices
3. **Review API Calls**: Regularly check API audits in activity records to confirm data flow meets expectations
4. **Use Local Models**: For highly sensitive tasks, consider using locally deployed models like Ollama
5. **Manage API Key Permissions**: Set minimum necessary permissions for API Keys in AI provider backends

:::info
DesireCore's security design philosophy is "You don't need to trust us, because we don't hold your data." Local-first architecture means even the DesireCore team cannot access any of your data. Your data, only on your device.
:::
