---
title: 常见问题
description: DesireCore 最常见的问题和解答，快速解决你在使用过程中遇到的困惑
keywords: [FAQ, 常见问题, 帮助, 疑难解答, DesireCore]
sidebar_position: 0
---

# 常见问题

在这里你可以找到使用 DesireCore 时最常见问题的答案。如果你的问题不在此列，欢迎通过反馈渠道联系我们。

## 快速回答

### DesireCore 需要联网吗？

DesireCore 是本地优先（Local-first）架构，核心数据和 Companion（智能体）仓库都存储在本地。但 AI 推理需要调用云端模型 API，因此**使用时需要网络连接**。如果只是查看历史记录或浏览已保存的 Companion 信息，可以离线使用。

### 支持哪些操作系统？

支持 **macOS**、**Windows** 和 **Linux** 三个桌面平台。Web、Android、iOS、鸿蒙版本正在开发中。

### 我的数据安全吗？

所有 Companion 数据（记忆、配置、技能）存储在你的本地文件系统（`~/.desirecore/` 目录下），不会上传到第三方服务器。AI 对话内容仅发送至你配置的模型 API 供应商。API Key 通过系统凭据管理器加密存储。详见 [数据与隐私问题](./05-data-privacy.md)。

### 如何给 Companion 添加新工具？

通过 MCP（Model Context Protocol）协议接入外部工具。在 Companion 的配置中添加 MCP 服务器配置即可，Companion 会自动发现并注册可用的工具。

### 支持哪些 AI 模型？

DesireCore 支持多家模型供应商，包括 OpenAI、Anthropic (Claude)、Google、DeepSeek、MiniMax 等。你需要自行配置各供应商的 API Key。详见 [API Key 与连接问题](./02-api-key.md)。

### 回执（Receipt）有什么用？

回执记录了 Companion 每次执行的完整证据链，是 DesireCore 可审计性的核心体现。你可以通过回执：查看 Companion 具体做了什么、了解推理过程、验证操作结果。

## 分类查找

遇到具体问题？前往对应分类查看详细解答：

| 分类 | 常见问题 |
|------|---------|
| [安装与启动](./01-installation.md) | 安装失败、启动白屏、版本更新 |
| [API Key 与连接](./02-api-key.md) | Key 无效、连接超时、模型不可用 |
| [对话问题](./03-conversations.md) | 消息失败、回复太慢、历史丢失 |
| [智能体问题](./04-agents.md) | 安装失败、重置智能体、记忆问题 |
| [数据与隐私](./05-data-privacy.md) | 数据存储位置、备份方法、完全删除 |
| [性能问题](./06-performance.md) | 内存占用、响应速度、优化方法 |
