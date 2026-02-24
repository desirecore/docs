---
sidebar_position: 3
---

# 核心概念

## Companion（AI 伙伴）

Companion 是 DesireCore 的核心——你的专属 AI 伙伴。每个 Companion 拥有独立的人设、记忆和技能，存储在本地的 CompanionFS 仓库中：

```
companions/<agent_id>/
├── companion.json    # 配置信息
├── persona.md        # 人设与性格
├── principles.md     # 行为准则
├── memory/           # 记忆系统
│   ├── timeline/     # 时间线记忆
│   ├── topics/       # 主题记忆
│   ├── pinned/       # 置顶记忆
│   └── lessons/      # 经验教训
└── skills/           # 技能定义
```

## 回执系统（Receipts）

每次 Companion 执行任务，都会生成一份**回执**——完整的执行证据链，包括输入、输出、工具调用和推理过程。你可以随时查看"它做了什么、为什么这么做"。

## 工具系统（Tool Registry）

Companion 通过工具与外部世界交互。DesireCore 内置了 7 种基础工具：

| 工具 | 说明 |
|------|------|
| `Read` | 读取文件 |
| `Write` | 写入文件 |
| `Edit` | 编辑文件 |
| `Bash` | 执行命令 |
| `Glob` | 搜索文件 |
| `Grep` | 搜索内容 |
| `Ls` | 列出目录 |

同时支持通过 **MCP（Model Context Protocol）** 接入更多外部工具和服务。

## 双运行时

DesireCore 支持两种 AI 运行时，可按需切换：

- **Claude Agent SDK** — Anthropic Claude 驱动
- **pi-agent-core** — 多模型 LLM 驱动

## 步骤控制

每个执行步骤分为三类：

| 类型 | 说明 |
|------|------|
| **Frozen** | 确定性执行，严格按规则运行 |
| **Flexible** | 自适应执行，AI 自主决策 |
| **Human Gate** | 需要人工确认后才继续 |
