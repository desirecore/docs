---
title: 文件格式说明
description: AgentFS 中各文件的格式规范和结构说明
keywords: [文件格式, AgentFS, agent.json, SKILL.md, 记忆, 准则]
---

# 文件格式说明

本文档说明 AgentFS 中各核心文件的格式和结构。

## agent.json -- 智能体身份配置

每个智能体的根目录下都有一个 `agent.json`，定义了智能体的基本信息。

```json
{
  "name": "法律顾问",
  "version": "1.2.0",
  "description": "专业合同审查与法律咨询",
  "role": "法律顾问",
  "author": "DesireCore Team",
  "traits": ["严谨", "专业", "耐心"],
  "risk_level": "medium",
  "greeting": "你好！我是你的法律顾问，专注合同审查和法律风险评估。有什么可以帮你的？",
  "access_control": {
    "owner": "user_001",
    "visibility": "private"
  }
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | 是 | 智能体的显示名称 |
| `version` | string | 是 | 版本号（semver 格式） |
| `description` | string | 否 | 一句话描述 |
| `role` | string | 是 | 角色定位 |
| `author` | string | 否 | 作者 |
| `traits` | string[] | 否 | 性格特征标签列表 |
| `risk_level` | enum | 否 | 风险等级：`low`/`medium`/`high`/`critical` |
| `greeting` | string | 否 | 首次对话时的问候语 |
| `access_control` | object | 否 | 权限控制配置 |

## persona.md -- 人格档案

定义智能体的沟通风格和行为规范。建议结构：

```markdown
## 我希望你怎么回答
- 先给结论，再给理由；少客套。
- 有歧义：先问 1 个关键问题；否则按默认假设推进，并标注假设。

## 我不想看到什么
- 模板腔/客服腔/过度共情
- "两种方案各有优劣"式回避结论

## 安全与确认
- 读文件、整理、生成草稿、做分析：直接做，并写回执。
- 发消息/邮件、删除/付费、线上变更、对外发布：必须先过人闸门确认。

## 不确定时
- 说明不确定点，并给验证路径；必要时升级给人。
```

**重要原则**：人格档案是**可执行规范**，不是"人设文案"。应做到短、硬、可测试。

## principles.md -- 行为准则

定义智能体的行为规则和安全红线：

```markdown
## 必须做
- 涉及金额操作前必须确认
- 修改文件前先展示 diff
- 任务完成后生成回执

## 绝不做
- 不删除用户文件（除非用户三次确认）
- 不发送未经确认的对外消息
- 不修改其他智能体的配置

## 升级路径
- 遇到法律风险判断不确定时，升级给用户
- 金额超过 10,000 元的操作必须升级
```

**注意**："绝不做"部分受进化保护，不会被智能体的自我进化覆盖。

## SKILL.md -- 技能定义

每个技能包的核心文件，使用 YAML frontmatter + Markdown 正文：

```markdown
---
metadata:
  id: contract-review
  version: 1.0.0
  name: 合同审查
  description: 专业合同审查技能，支持风险识别和条款分析
  author: DesireCore Team
  tags: [法律, 合同, 审查]
  dependencies: []
  requiredTools: [Read, Write, Edit]
---

# 合同审查

## 触发条件
当用户提到"审查合同""看看这份合同""合同有没有问题"等时触发。

## 执行步骤

### 1. 文件解析（固化步骤）
- 读取合同文件
- 解析文档结构，识别各章节

### 2. 条款分析（灵活步骤）
- 逐条分析合同条款
- 标注风险等级：高/中/低
- 关注重点：付款条件、违约责任、知识产权、保密条款

### 3. 生成报告（固化步骤）
- 按模板生成审查报告
- 包含：风险汇总、逐条意见、修改建议

### 4. 用户确认（人闸门）
- 展示审查报告供用户确认
- 等待用户反馈后再执行后续操作

## 参考资料
- references/ 目录下的法律模板和案例
```

### SKILL.md frontmatter 字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `metadata.id` | string | 是 | 技能唯一标识 |
| `metadata.version` | string | 是 | 版本号（semver） |
| `metadata.name` | string | 是 | 显示名称 |
| `metadata.description` | string | 是 | 简要描述 |
| `metadata.author` | string | 否 | 作者 |
| `metadata.tags` | string[] | 否 | 标签列表 |
| `metadata.dependencies` | string[] | 否 | 依赖的其他技能 |
| `metadata.requiredTools` | string[] | 否 | 需要的工具 |

## 记忆文件

记忆文件使用 Markdown 格式，存放在 `memory/` 目录中：

```markdown
---
type: fact
importance: high
created: 2026-01-15T10:30:00Z
source: user_teaching
---

# 用户偏好：合同审查

用户在审查合同时有以下偏好：
- 优先关注付款条件和违约责任
- 违约金超过合同金额 30% 需标红
- 保密期限低于 2 年需要特别提醒
- 报告格式：先总结，后细节
```

| frontmatter 字段 | 说明 |
|-----------------|------|
| `type` | 记忆类型：`fact`(事实)、`preference`(偏好)、`experience`(经验)、`rule`(规则) |
| `importance` | 重要性：`high`/`medium`/`low` |
| `created` | 创建时间 |
| `source` | 来源：`user_teaching`(用户教学)、`interaction`(交互推断)、`reflection`(自省复盘) |

## 回执文件

回执以 YAML 格式存储在 `runs/<run_id>/receipts/` 目录中：

```yaml
receipt_id: "rcpt_20260115_143022_abc123"
repo_ref: "a1b2c3d4..."

session:
  session_id: "sess_xyz789"
  agent_id: "legal-advisor"
  user_id: "user_001"

task:
  input_summary: "审查供应商合同第三条"
  output_summary: "已完成审查，发现 2 个高风险条款"
  outcome:
    status: completed
    auto_completed: true
    user_edits: 0

step_types:
  deterministic: 3
  adaptive: 5
  human_gate: 1

time_metrics:
  agent_execution_time: 45
  actual_human_time: 120
```

## 目录结构约定

| 目录/文件 | 管理方式 | 说明 |
|----------|---------|------|
| `agents/<id>/` | Git 管理 | 智能体本体，可共享、可发布 |
| `users/<id>/` | 无 Git | 用户私有数据 |
| `runs/` | 无 Git | 运行时临时数据 |
| `cache/` | 无 Git | 可重建的缓存 |
| `logs/` | 无 Git | 日志文件 |
