---
sidebar_position: 2
---

# 常见问题

### DesireCore 需要联网吗？

DesireCore 是本地优先（Local-first）架构，核心数据和 Companion 仓库都存储在本地。但 AI 推理需要调用云端模型 API，因此使用时需要网络连接。

### 支持哪些操作系统？

支持 macOS、Windows 和 Linux，同时提供 Web 版本。

### 我的数据安全吗？

所有 Companion 数据（记忆、配置、技能）存储在本地文件系统，不会上传到第三方服务器。AI 对话内容仅发送至你配置的模型 API 提供商。

### 如何给 Companion 添加新工具？

通过 MCP（Model Context Protocol）协议接入外部工具。在项目的 `.mcp.json` 中配置即可。

### 回执（Receipt）有什么用？

回执记录了 Companion 每次执行的完整证据链。你可以：
- 查看 Companion 具体做了什么
- 了解每个决策的推理过程
- 在出问题时回滚到之前的状态

### 支持哪些 AI 模型？

DesireCore 支持双运行时架构：
- **Claude Agent SDK**：使用 Anthropic Claude 系列模型
- **pi-agent-core**：支持多种模型供应商（OpenAI、Google、DeepSeek、MiniMax 等）

你可以在 Agent 配置中按需切换运行时和模型。

### Workflow 系统什么时候可用？

工作流系统不包含在 MVP 阶段。当前架构已预留了工作流目录和接口，完整功能将在后续版本中推出。

### 遇到问题怎么办？

- 查看 [GitHub Issues](https://github.com/desirecore/docs/issues) 提交反馈
