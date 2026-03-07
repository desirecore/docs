---
title: 系统要求
description: 运行 DesireCore 所需的硬件和软件环境，涵盖 macOS、Windows、Linux。
keywords: [系统要求, 硬件, 操作系统, 兼容性]
---

# 系统要求

DesireCore 桌面客户端支持 macOS、Windows、Linux 三大平台。下面列出了各平台的环境要求。

## 桌面版

### macOS

| 项目 | 最低要求 | 推荐配置 |
|------|---------|---------|
| 系统版本 | macOS 14 (Sonoma) | macOS 26 (Tahoe) 及以上 |
| 处理器 | Intel Core i5 第 10 代 | Apple M1 及以上 |
| 架构 | x86_64 / arm64 | arm64 |
| 内存 | 8 GB | 16 GB 及以上 |
| 磁盘空间 | 2GB | 20 GB 及以上 |

:::info Apple Silicon 原生支持
DesireCore 为 Apple Silicon（M1/M2/M3/M4/M5）提供原生 arm64 版本，运行更快、更省电。安装时会自动识别你的芯片架构。
:::

### Windows

| 项目 | 最低要求 | 推荐配置 |
|------|---------|---------|
| 系统版本 | Windows 10 (64 位) | Windows 11 |
| 处理器 | Intel Core i5 第 10 代 / AMD Ryzen 5 第三代 | Intel Core i7 第 13 代及以上 / AMD Ryzen 7 第五代及以上 |
| 架构 | x86_64 / arm64 | x86_64 / arm64 |
| 内存 | 8 GB | 16 GB 及以上 |
| 磁盘空间 | 2GB | 20 GB 及以上 |

### Linux

| 项目 | 最低要求 | 推荐配置 |
|------|---------|---------|
| 系统版本 | Ubuntu 20.04 / Fedora 36 等主流发行版 | Ubuntu 22.04+ / Fedora 38+ |
| 处理器 | Intel Core i5 第 10 代 / AMD Ryzen 5 第三代 | Intel Core i7 第 13 代及以上 / AMD Ryzen 7 第五代及以上 |
| 架构 | x86_64 / arm64 | x86_64 / arm64 |
| 内存 | 8 GB | 16 GB 及以上 |
| 磁盘空间 | 2GB | 20 GB 及以上 |

:::info 更多版本
Web、Android、iOS、鸿蒙版本正在开发中，敬请期待。详见 [更多版本](./02-installation/04-more-versions.md)。
:::

## 网络要求

DesireCore 需要连接互联网来调用 AI 服务。请确保你的网络环境满足以下条件：

- **能够访问 AI 供应商的 API**：例如 OpenAI（`api.openai.com`）、Anthropic（`api.anthropic.com`）、DeepSeek（`api.deepseek.com`）等
- **能够访问 DesireCore 的更新服务器**：例如 `download.desirecore.net`，以便获取最新版本和安全补丁
- **能够访问 Github 代码托管服务**：如果你需要从 Github 获取市场Agent或Skills等资源，确保能够访问 `github.com` 和相关的 CDN 服务。系统会自动检测网络环境，并在无法访问某些服务时提供替代方案（如使用安全的CDN访问白名单中的仓库）。

**注意：** DesireCore 不内置 AI 模型，而是通过 API 接入第三方服务来提供智能能力。截至当前版本（v10.1.0），DesireCore 仍为纯客户端软件，不包含任何服务器组件；官方也未提供后端 API，更新服务依赖对象存储与 CDN。因此，无需额外部署服务器环境，只要能够访问上述 API，即可正常使用。

:::tip 网络不太好？
如果你的网络访问海外服务不太顺畅，可以考虑使用国内供应商（如 阿里云、智谱 GLM、月之暗面 Kimi、DeepSeek、MiniMax、硅基流动等），它们的 API 服务器在国内，延迟更低。
:::

如需了解软件依赖、存储空间分析、端口使用等更多技术细节，请参阅 [详细系统要求](../05-reference/08-system-requirements-detail.md)。

确认你的环境满足要求后，就可以开始 [安装 DesireCore](./02-installation/index.md) 了。
