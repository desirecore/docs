---
title: System Requirements
description: Hardware and software requirements for running DesireCore on macOS, Windows, and Linux.
keywords: [system requirements, hardware, operating system, compatibility]
---

# System Requirements

The DesireCore desktop client supports macOS, Windows, and Linux. Below are the environment requirements for each platform.

## Desktop

### macOS

| Item | Minimum | Recommended |
|------|---------|-------------|
| OS Version | macOS 14 (Sonoma) | macOS 26 (Tahoe) or later |
| Processor | Intel Core i5 10th Gen | Apple M1 or later |
| Architecture | x86_64 / arm64 | arm64 |
| Memory | 8 GB | 16 GB or more |
| Disk Space | 2 GB | 20 GB or more |

:::info Native Apple Silicon Support
DesireCore provides a native arm64 build for Apple Silicon (M1/M2/M3/M4/M5), offering faster performance and better power efficiency. The installer will automatically detect your chip architecture.
:::

macOS GUI automation currently runs through HostAgent. The first time you use the relevant capabilities, grant Accessibility, Screen Recording, and other permissions required by the task when macOS prompts you.

### Windows

| Item | Minimum | Recommended |
|------|---------|-------------|
| OS Version | Windows 10 (64-bit) | Windows 11 |
| Processor | Intel Core i5 10th Gen / AMD Ryzen 5 3rd Gen | Intel Core i7 13th Gen+ / AMD Ryzen 7 5th Gen+ |
| Architecture | x86_64 / arm64 | x86_64 / arm64 |
| Memory | 8 GB | 16 GB or more |
| Disk Space | 2 GB | 20 GB or more |

:::info Local Windows GUI automation
The Windows installer bundles and enables CUA Driver by default, so local GUI automation does not require a separate HostAgent installation. This is a transitional implementation until Windows HostAgent is complete. macOS still uses HostAgent today, while HostAgent implementations for Windows, Linux, and other platforms remain under development. See [GUI Desktop Automation](../02-user-guide/09-capabilities/05-computer-use.md).
:::

### Linux

| Item | Minimum | Recommended |
|------|---------|-------------|
| OS Version | Ubuntu 20.04 / Fedora 36 or equivalent | Ubuntu 22.04+ / Fedora 38+ |
| Processor | Intel Core i5 10th Gen / AMD Ryzen 5 3rd Gen | Intel Core i7 13th Gen+ / AMD Ryzen 7 5th Gen+ |
| Architecture | x86_64 / arm64 | x86_64 / arm64 |
| Memory | 8 GB | 16 GB or more |
| Disk Space | 2 GB | 20 GB or more |

:::info More Versions
Web, Android, iOS, and HarmonyOS versions are under development. See [More Versions](./02-installation/04-more-versions.md) for details.
:::

## Network Requirements

DesireCore requires an internet connection to access AI services. Ensure your network environment meets the following conditions:

- **Access to AI provider APIs**: e.g., OpenAI (`api.openai.com`), Anthropic (`api.anthropic.com`), DeepSeek (`api.deepseek.com`), etc.
- **Access to DesireCore's update server**: e.g., `download.desirecore.net`, for receiving the latest versions and security patches
- **Access to GitHub**: If you need to fetch marketplace Agents, Skills, or other resources from GitHub, ensure access to `github.com` and related CDN services. The system will automatically detect network conditions and provide fallback options when certain services are unavailable (e.g., using a secure CDN to access whitelisted repositories).

**Note:** DesireCore does not include built-in AI models. It connects to third-party APIs or official cloud compute for AI capabilities. Core data remains local-first; account sign-in, credits/subscriptions, cloud model lists, and update services require access to DesireCore online services. You can still use most core workflows with your own API keys and local data.

:::tip Network Issues?
If you have difficulty accessing overseas services, consider using providers with servers in your region for lower latency.
:::

Once your environment meets the requirements, you can proceed to [Install DesireCore](./02-installation/index.md).

For bundled Git, Python, Node.js, CUA Driver, and their license boundaries, see [Detailed System Requirements](../05-more/08-system-requirements-detail.md).
