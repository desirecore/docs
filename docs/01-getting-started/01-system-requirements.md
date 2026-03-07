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
| 系统版本 | macOS 11 (Big Sur) | macOS 14 (Sonoma) 及以上 |
| 处理器 | Intel Core i5 / Apple M1 | Apple M1 及以上 |
| 内存 | 4 GB | 8 GB 及以上 |
| 磁盘空间 | 500 MB | 1 GB 及以上 |

:::info Apple Silicon 原生支持
DesireCore 为 Apple Silicon（M1/M2/M3/M4）提供原生 arm64 版本，运行更快、更省电。安装时会自动识别你的芯片架构。
:::

### Windows

| 项目 | 最低要求 | 推荐配置 |
|------|---------|---------|
| 系统版本 | Windows 10 (64 位) | Windows 11 |
| 处理器 | Intel Core i5 / AMD Ryzen 5 | Intel Core i7 / AMD Ryzen 7 及以上 |
| 内存 | 4 GB | 8 GB 及以上 |
| 磁盘空间 | 500 MB | 1 GB 及以上 |

### Linux

| 项目 | 最低要求 | 推荐配置 |
|------|---------|---------|
| 系统版本 | Ubuntu 20.04 / Fedora 36 等主流发行版 | Ubuntu 22.04+ / Fedora 38+ |
| 处理器 | x86_64 | x86_64 / arm64 |
| 内存 | 4 GB | 8 GB 及以上 |
| 磁盘空间 | 500 MB | 1 GB 及以上 |

:::info 更多版本
Web、Android、iOS、鸿蒙版本正在开发中，敬请期待。详见 [更多版本](./02-installation/04-more-versions.md)。
:::

## 网络要求

DesireCore 需要连接互联网来调用 AI 服务。请确保你的网络环境满足以下条件：

- **稳定的互联网连接**：AI 对话需要与云端 API 通信
- **能够访问 AI 供应商的 API**：例如 OpenAI（`api.openai.com`）、Anthropic（`api.anthropic.com`）、DeepSeek（`api.deepseek.com`）等
- **无特殊端口限制**：DesireCore 使用标准 HTTPS（端口 443）通信

:::tip 网络不太好？
如果你的网络访问海外服务不太顺畅，可以考虑使用国内供应商（如 DeepSeek、硅基流动等），它们的 API 服务器在国内，延迟更低。
:::

确认你的环境满足要求后，就可以开始 [安装 DesireCore](./02-installation/index.md) 了。
