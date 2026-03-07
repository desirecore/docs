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

### Windows

| Item | Minimum | Recommended |
|------|---------|-------------|
| OS Version | Windows 10 (64-bit) | Windows 11 |
| Processor | Intel Core i5 10th Gen / AMD Ryzen 5 3rd Gen | Intel Core i7 13th Gen+ / AMD Ryzen 7 5th Gen+ |
| Architecture | x86_64 / arm64 | x86_64 / arm64 |
| Memory | 8 GB | 16 GB or more |
| Disk Space | 2 GB | 20 GB or more |

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

**Note:** DesireCore does not include built-in AI models — it connects to third-party services via API to provide AI capabilities. As of the current version (v10.1.0), DesireCore remains a pure client-side application with no server components; the official team does not provide a backend API, and update services rely on object storage and CDN. Therefore, no server deployment is needed — as long as you can access the APIs listed above, everything will work.

:::tip Network Issues?
If you have difficulty accessing overseas services, consider using providers with servers in your region for lower latency.
:::

Once your environment meets the requirements, you can proceed to [Install DesireCore](./02-installation/index.md).
