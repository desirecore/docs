---
title: 文件资源管理器
description: 了解 AgentFS 文件系统结构，学习如何在资源管理器中浏览和管理智能体的文件。
keywords: [AgentFS, 文件系统, 资源管理器, 智能体文件, 文件结构]
---

# 文件资源管理器

:::info 长期指令的版本支持
`instructions.md` 已在开发分支的 10.0.179 实现。截至 2026-10-09，最新公开发行版仍为 v10.0.177；正式发行版需要升级到包含这项能力的版本后才能使用。
:::

每个智能体的所有配置、记忆和技能都以文件的形式存储在 AgentFS（智能体文件系统）中。资源管理器让你可以直观地浏览和管理这些文件。

## AgentFS 文件结构概览

每个智能体的文件存放在 `~/.desirecore/agents/<agent_id>/` 目录下：

```
<agent_id>/
├── agent.json        # 入口配置
├── persona.md        # 人格设定
├── principles.md     # 行为准则
├── instructions.md   # 可选长期职责、工作策略与交付标准
├── memory/           # 记忆文件
│   └── *.md          # 每条记忆一个文件
├── skills/           # 技能目录
│   └── <skill_id>/   # 每个技能一个目录
│       └── SKILL.md  # 技能说明文档
├── skill_permissions.json # 技能启用、排除和权限策略
├── tools/            # 工具注册
├── workflows/        # 工作流定义
├── schedules/        # 定时任务定义
├── heartbeat/        # 心跳配置
├── resources/        # 资源文件
├── assets/           # 静态资源
└── .git/             # Git 版本管理
```

:::info 为什么用文件系统？
DesireCore 的设计理念是"一切皆文件"。文件比数据库更透明——你可以直接查看、编辑、备份和版本管理。智能体的每一次变化都记录在 Git 历史中。
:::

## 浏览智能体的文件

### 打开资源管理器

1. 进入智能体详情页
2. 点击"文件"标签页
3. 资源管理器以树形结构展示智能体的所有文件

### 文件预览

点击任意文件可以在右侧预览其内容：

- **Markdown 文件**（`.md`）：渲染后的富文本预览
- **JSON 文件**（`.json`）：语法高亮的 JSON 视图
- **YAML 文件**（`.yaml`）：语法高亮的 YAML 视图

### 文件编辑

对于 Markdown 和配置文件，你可以在预览界面直接编辑。编辑后保存会自动生成一个 Git commit，记录在版本历史中。

:::warning 修改配置文件请谨慎
直接编辑 `agent.json` 等核心配置文件可能影响智能体的正常运行。如果你不确定某个字段的含义，建议通过界面或对话来修改。
:::

### 编辑长期指令

已有 `instructions.md` 可以像其他 Markdown 一样在文件树中打开并编辑，也可以在[提示词中心](./12-prompt-center.md)选择智能体的“长期指令 instructions”。尚未创建文件时，可以通过对话要求保存长期职责，再编辑正文。

这份文件不分 L0/L1/L2。保存后的内容在下一次输入、显式继续或恢复被接纳时读取，当前执行轮次保留原快照。详细 SOP 放入技能，个人偏好保留在用户作用范围。完整的全文加载、预算和更新约定见[文件格式说明](../../05-more/06-file-formats.md)。

## 上传和管理资源文件

你可以将参考文档、模板、数据文件等上传到智能体的 `resources/` 目录，供智能体在工作时引用。

### 上传文件

1. 在资源管理器中导航到 `resources/` 目录
2. 点击"上传"按钮
3. 选择本地文件
4. 文件上传后自动生成 commit

### 管理文件

- **重命名**：右键点击文件，选择"重命名"
- **删除**：右键点击文件，选择"删除"（会记录在版本历史中，可恢复）
- **移动**：拖拽文件到目标目录

## 文件类型说明

| 文件 | 格式 | 说明 |
|---|---|---|
| `agent.json` | JSON | 入口配置：名称、版本、描述、默认模型、环境注入、心跳开关、权限和仓库配置 |
| `persona.md` | Markdown | 人格设定：语气、风格、回答策略 |
| `principles.md` | Markdown | 行为准则：规则、禁区、优先级 |
| `instructions.md` | 普通 Markdown | 可选的 Agent 专属长期职责、默认工作策略和交付标准，获准时全文加载 |
| `memory/_policy.json` | JSON | 记忆压缩与保留策略 |
| `memory/*.md` | Markdown | 记忆条目：学到的知识和偏好 |
| `skills/*/SKILL.md` | Markdown | 技能文档：技能说明和执行指令 |
| `skills/*/references/` | 任意 | 技能参考资料 |
| `skills/*/scripts/` | 脚本 | 技能可复用脚本 |
| `skill_permissions.json` | JSON | 全局技能排除、技能工具权限等策略 |
| `tools/*.json` | JSON | 工具注册：可调用工具的参数定义 |
| `heartbeat/HEARTBEAT.md` | Markdown | 心跳检查内容：智能体主动巡检时关注什么、如何判断和如何汇报 |
| `workflows/*.yaml` | YAML | 可视化工作流 DSL |
| `schedules/*.json` | JSON | 定时任务定义：触发规则、目标 Prompt、状态和生命周期控制 |
| `resources/*` | 任意 | 参考资源：文档、模板、数据文件 |

:::tip 直接编辑配置
调整默认模型时，请使用 `agent.json` 的 `llm` 字段；调整日期、时间和跨日提醒时，请使用 `env` 字段；调整心跳开关时优先使用心跳设置，也可以查看 `agent.json.heartbeat.enabled`；调整记忆自动压缩时，请编辑 `memory/_policy.json`。
:::

## 项目级 Skill 文件

除了智能体自己的 `skills/` 目录，当前工作目录也可以提供项目级 Skill：

```
<workdir>/
├── .agents/
│   └── skills/
│       └── <skill_id>/SKILL.md
└── .claude/
    └── skills/
        └── <skill_id>/SKILL.md
```

`.agents/skills` 是 DesireCore 推荐路径，`.claude/skills` 用于兼容已有项目。项目级 Skill 不属于某个智能体的 AgentFS，但会在该项目作为工作目录时参与能力加载。

## 下一步

- [技能管理](./07-skills-management.md) — 了解如何为智能体添加和管理技能
- [版本管理](./08-version-control.md) — 了解智能体的 Git 版本控制
