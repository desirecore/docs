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

- **System Credential Manager**: API Keys are stored in the operating system's secure credential manager
  - macOS: Keychain
  - Windows: Credential Manager
  - Linux: Secret Service (e.g., GNOME Keyring)
- **No Plaintext in Config Files**: Configuration files only store encrypted references, not API Key plaintext
- **Not Uploaded to Remote**: API Keys are not sent to DesireCore servers or any third parties

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

- **Transmission Encryption**: All communication with AI providers is encrypted via HTTPS
- **Credential Encryption**: API Keys are encrypted and stored through the operating system's credential manager
- **Local Data**: Currently local data files are stored in plaintext in the file system, relying on operating system file permissions for protection. If your device has risk of physical access by others, we recommend enabling the operating system's disk encryption feature (such as macOS FileVault, Windows BitLocker)

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
2. **Regular Backup**: Regularly back up through the "Export Data" feature in settings
3. **Review API Calls**: Regularly check API audits in activity records to confirm data flow meets expectations
4. **Use Local Models**: For highly sensitive tasks, consider using locally deployed models like Ollama
5. **Manage API Key Permissions**: Set minimum necessary permissions for API Keys in AI provider backends

:::info
DesireCore's security design philosophy is "You don't need to trust us, because we don't hold your data." Local-first architecture means even the DesireCore team cannot access any of your data. Your data, only on your device.
:::
