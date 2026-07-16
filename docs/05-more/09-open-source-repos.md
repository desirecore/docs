---
title: "开源仓库"
description: "DesireCore 官方开源仓库一览"
keywords: [开源, GitHub, 仓库, 源码, 贡献]
---

# 开源仓库

DesireCore 项目在 GitHub 上维护了多个官方仓库，欢迎关注和参与贡献。

> **GitHub 组织主页**：[github.com/desirecore](https://github.com/desirecore)

## 核心仓库

| 仓库 | 说明 | 状态 |
|------|------|------|
| `desirecore` | DesireCore 客户端软件主仓库 | 初步计划稳定后开源，根据公司融资情况和经营战略决定，不作为最终承诺。各可解耦模块会逐步开源 |
| `desirecore-hostagent` | 原生 HostAgent 平台代码，用于 GUI 操作、设备能力、发现、配对与常驻执行 | macOS 实现当前已作为 GUI 操作载体；Windows、Linux、其他桌面与移动端实现仍在开发。初步计划稳定后开源，根据公司融资情况和经营战略决定，不作为最终承诺 |

:::info 不同平台的当前载体
macOS 当前仍由 HostAgent 承载 GUI 操作。Windows 为了让用户在原生 HostAgent 完成前先使用本机 GUI 自动化，暂时采用 DesireCore 随附的独立第三方 CUA Driver；这不表示 HostAgent 已被弃用或替代。第三方组件不属于 DesireCore 官方仓库，详见 [第三方软件与许可](./09-third-party-software.md)。
:::

## 文档与分发

| 仓库 | 说明 | 状态 |
|------|------|------|
| [docs](https://github.com/desirecore/docs) | DesireCore 文档仓库（即本站） | 公开 |
| [agent-os](https://github.com/desirecore/agent-os) | DesireCore 官方分发 — 下载 Windows、macOS、Linux 安装包 | 公开 |

## 服务仓库

| 仓库 | 说明 | 状态 |
|------|------|------|
| `release-manager` | 灰度发布管理服务 — 多通道灰度推送、紧急刹车、版本管理 | 私有 |

## 生态仓库

| 仓库 | 说明 | 状态 |
|------|------|------|
| [registry](https://github.com/desirecore/registry) | DesireCore 官方应用与服务仓库 | 公开 |
| [market](https://github.com/desirecore/market) | DesireCore 官方市场仓库 | 公开 |
| [agent-desirecore](https://github.com/desirecore/agent-desirecore) | DesireCore 默认 Agent | 公开 |
| [config-center](https://github.com/desirecore/config-center) | DesireCore 配置中心 | 公开 |
