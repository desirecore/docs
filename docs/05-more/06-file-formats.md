---
title: 文件格式说明
description: AgentFS 中各文件的格式规范和结构说明
keywords: [文件格式, AgentFS, agent.json, SKILL.md, 记忆, 准则]
---

# 文件格式说明

AgentFS 把智能体的身份、行为、记忆、技能和运行策略保存为普通文件。你可以通过界面编辑，也可以在了解字段含义后直接修改文件。

## agent.json -- 智能体入口配置

每个智能体根目录下都有 `agent.json`，用于定义智能体身份、默认模型、权限和运行时注入策略。

```json
{
  "$schema": "https://desirecore.net/schemas/agentfs/v1/agent-config.json",
  "name": "法律顾问",
  "version": "1.2.0",
  "description": "专业合同审查与法律咨询",
  "avatar": {
    "char": "法",
    "color": "blue"
  },
  "llm": {
    "provider": "anthropic",
    "providerId": "provider-anthropic-001",
    "model": "claude-sonnet-4-5",
    "thinkingBudgets": {
      "low": 1024,
      "medium": 4096,
      "high": 8192,
      "xhigh": 16384
    },
    "maxRetryDelayMs": 32000
  },
  "env": {
    "enabled": true,
    "includeWeekday": true,
    "includeLocalTime": true,
    "includeSessionStart": true
  },
  "heartbeat": {
    "enabled": false
  },
  "tool_permissions": {
    "denied": ["PowerShell"]
  },
  "mcp_servers": {},
  "accepts_handoff": true,
  "accepts_messages": true,
  "max_concurrent_sessions": 3
}
```

### 常用字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | string | 智能体显示名称，必填 |
| `version` | string | 智能体内容版本号，使用 semver |
| `description` | string | 一句话描述，显示在详情页和市场 |
| `avatar` | object | 头像字符和颜色 |
| `llm` | object | 当前智能体默认模型配置 |
| `env` | object | systemPrompt 中的日期、时间和会话起点注入配置 |
| `heartbeat` | object | 心跳能力开关；检查内容写在 `heartbeat/HEARTBEAT.md` |
| `tool_permissions` | object | 工具白名单或黑名单 |
| `mcp_servers` | object | 智能体专属 MCP Server 配置 |
| `webhooks` | object | 外部 Webhook 触发配置 |
| `agents` | object | 子代理定义 |
| `capabilities` | string[] | 能力标签 |
| `trigger_patterns` | string[] | 简单触发词匹配 |
| `repository` | object | 远程仓库、分支和发布连接配置 |

### `llm` 模型配置

`llm` 是智能体级默认模型配置。旧的 `runtime` 模型字段只作为兼容输入，保存和新建配置时应使用 `llm`。

| 字段 | 说明 |
|------|------|
| `provider` | 供应商协议标识，例如 `anthropic`、`openai`、`deepseek` |
| `providerId` | 供应商实例唯一 ID，用于同协议多供应商或同名模型场景下精确绑定 API Key |
| `model` | 默认模型名称 |
| `thinkingBudgets` | 按 `low`、`medium`、`high`、`xhigh` 设置推理预算 |
| `maxRetryDelayMs` | API 调用失败时的最大重试延迟 |

### `env` 环境注入

`env` 控制智能体是否在 systemPrompt 中获得当前日期、本地时间、时区和会话起始时间。跨日继续会话时，系统会自动追加提醒，避免智能体误以为仍是旧日期。

| 字段 | 默认值 | 说明 |
|------|--------|------|
| `enabled` | `true` | 是否启用环境信息注入和跨日检测 |
| `includeWeekday` | `true` | 日期中是否包含星期 |
| `includeLocalTime` | `true` | 是否包含本地时间和时区 |
| `includeSessionStart` | `true` | 是否包含会话起始时间 |
| `template` | 无 | 自定义 env 模板，支持 `{date}`、`{weekday}`、`{localTime}`、`{tz}`、`{sessionStart}` |

### `heartbeat` 心跳开关

`heartbeat.enabled` 是智能体级心跳开关。心跳的检查清单写在 `heartbeat/HEARTBEAT.md`，用户级频率、安静时段、Snooze 和冷却时间等偏好由心跳设置保存。

| 字段 | 默认值 | 说明 |
|------|--------|------|
| `enabled` | `false` | 是否允许该智能体运行心跳巡检 |

## persona.md -- 人格档案

`persona.md` 定义智能体如何表达、如何组织回答、偏好什么沟通方式。它应该是可执行规范，而不是营销文案。

```markdown
## 我希望你怎么回答
- 先给结论，再给理由；少客套。
- 有歧义时先问关键问题；不影响推进时标注假设继续。

## 我不想看到什么
- 模板腔或过度共情
- 没有结论的泛泛分析

## 安全与确认
- 读文件、整理、生成草稿、做分析：可以直接做，并写回执。
- 发消息/邮件、删除/付费、线上变更、对外发布：必须先过人闸门确认。

## 不确定时
- 说明不确定点，并给验证路径；必要时升级给人。
```

`persona.md` 是可执行沟通规范，不是“人设文案”。建议写得短、硬、可测试，让智能体能稳定遵守。

## principles.md -- 行为准则

`principles.md` 定义必须遵守的规则、安全红线和升级路径。

```markdown
## 必须做
- 涉及金额操作前必须确认
- 修改文件前说明将改动的范围
- 任务完成后生成回执

## 绝不做
- 不发送未经确认的对外消息
- 不删除用户文件，除非用户明确要求并确认

## 升级路径
- 遇到法律风险判断不确定时，升级给用户
- 金额超过 10,000 元的操作必须升级
```

`绝不做` 和安全红线通常应保持简洁明确。这类约束会影响智能体的长期行为，不应该写成模糊建议。

## SKILL.md -- 技能定义

每个技能包至少包含一个 `SKILL.md`。frontmatter 可使用根级字段，也可使用 `metadata` 包裹字段。

```markdown
---
name: 合同审查
description: 审查合同条款、识别风险并输出修改建议
version: 1.0.0
author: DesireCore Team
allowed-tools: [Read, Write, Edit]
user-invocable: true
risk_level: medium
provider: anthropic
---

# 合同审查

## 何时使用
当用户要求审查合同、分析条款风险或生成修改建议时使用。

## 执行步骤
1. 文件解析（确定性步骤）：读取合同文件，解析文档结构，识别章节和条款编号。
2. 条款分析（灵活步骤）：逐条分析付款、违约、知识产权、保密和争议解决条款。
3. 风险标注（灵活步骤）：按高/中/低风险分组，并说明判断依据。
4. 报告生成（确定性步骤）：按固定模板输出风险汇总、逐条意见和修改建议。
5. 用户确认（人闸门）：如需对外发送、改写原文件、执行命令或提交正式意见，先请求确认。

## 参考资料
- `references/` 目录下的法律模板和案例
```

技能正文可以用自然语言标注确定性步骤、灵活步骤和人闸门。工作流 DSL 中的 `human_gate` 节点会正式阻断等待用户响应；普通技能里的类似标注用于指导智能体和审计人员理解流程边界。

### SKILL.md 常用字段

| 字段 | 说明 |
|------|------|
| `name` / `metadata.name` | 技能显示名称 |
| `description` / `metadata.description` | 技能描述，影响自动匹配 |
| `version` / `metadata.version` | 技能版本 |
| `author` / `metadata.author` | 作者 |
| `tags` | 标签列表，用于搜索和市场展示 |
| `requires.tools` | 技能依赖的工具列表 |
| `requires.optional_tools` | 可选工具列表 |
| `requires.connections` | 依赖的外部连接或账号 |
| `risk_level` | 风险等级：`low`、`medium`、`high` |
| `status` | 技能状态：`enabled` 或 `disabled` |
| `allowed-tools` | 技能执行时允许使用的工具 |
| `provider` | 偏好的供应商标识 |
| `model` | 技能触发时使用的模型 |
| `user-invocable` | 是否允许用户直接调用 |
| `disable-model-invocation` | 是否禁止模型自动触发；也兼容 `disable_model_invocation` |
| `context` | 执行上下文模式，例如 `default` 或 `fork` |
| `agent` | `context=fork` 时的子 Agent 角色说明 |
| `argument-hint` | 命令补全或显式调用时的参数提示 |
| `market` | 市场展示信息，如分类、维护者和最低客户端版本 |
| `json_output` | 声明技能期望 JSON 输出，并启用自动修复策略 |

## schedules/*.json -- 定时任务定义

每个定时任务保存为 `schedules/<schedule_id>.json`。它描述触发规则、执行动作、状态和生命周期控制。

```json
{
  "id": "daily-briefing",
  "display_name": "每日早报",
  "enabled": true,
  "status": "active",
  "schedule": {
    "kind": "cron",
    "cron": "0 8 * * 1-5",
    "timezone": "Asia/Shanghai",
    "missed_fire_policy": "fire_once",
    "no_overlap": true
  },
  "action": {
    "type": "query",
    "prompt": "汇总今天的日程、待办和需要关注的邮件。"
  },
  "tags": ["report"]
}
```

| 字段 | 说明 |
|------|------|
| `id` | 智能体内唯一的调度 ID |
| `display_name` | 在自动化面板显示的名称 |
| `enabled` | 是否启用 |
| `status` | `pending`、`active`、`paused`、`completed` 或 `cancelled` |
| `schedule.kind` | 触发类型，常用 `at`、`delay`、`interval`、`cron` |
| `schedule.at` / `delay` / `interval` / `cron` | 对应触发类型的时间参数 |
| `schedule.timezone` | IANA 时区，常用于 `at` 和 `cron` |
| `schedule.starts_at` / `expires_at` | 生效和过期时间 |
| `schedule.max_fires` | 最大触发次数 |
| `schedule.missed_fire_policy` | 错过触发时的处理策略：`skip`、`fire_once`、`fire_all` |
| `schedule.no_overlap` | 上一次执行未结束时是否跳过本次触发 |
| `action.type` | 通常为 `query`，表示到点后向智能体发送 Prompt；schema 也保留 `heartbeat` 兼容类型，心跳巡检推荐通过心跳配置入口管理 |
| `action.prompt` | 到点执行的指令 |
| `retry` | 可选重试配置 |
| `failureAlert` | 可选连续失败告警配置 |

常规界面和 `CreateSchedule` 工具主要创建 `at`、`delay`、`interval`、`cron` 四类任务。底层调度定义也包含 `rrule` 结构，用于更复杂的 iCalendar 规则。

## memory/_policy.json -- 记忆策略

`memory/_policy.json` 控制对话记忆的自动压缩和保留策略。

```json
{
  "compression": {
    "enabled": true,
    "max_recent_matters": 20,
    "strategy": "summarize"
  },
  "retention": {
    "pinned": "forever",
    "topics": "forever",
    "timeline": {
      "recent": "90d",
      "archive_after": "180d"
    }
  }
}
```

| 字段 | 说明 |
|------|------|
| `compression.enabled` | 是否自动压缩 recent 话题；手动压缩不受此开关影响 |
| `compression.max_recent_matters` | recent 区最多保留的话题数量，超过后归档最旧话题 |
| `compression.strategy` | 压缩策略，当前为 `summarize` |
| `retention.pinned` | 置顶记忆保留策略 |
| `retention.topics` | 话题摘要保留策略 |
| `retention.timeline` | 时间线 recent/archive 保留窗口 |

旧字段 `threshold_days` 会被兼容读取为 `max_recent_matters`，新文件应使用 `max_recent_matters`。

## 记忆文件

记忆文件使用 Markdown，存放在 `memory/` 目录。每条记忆可以包含类型、重要性、创建时间和来源。

```markdown
---
type: preference
importance: high
created: 2026-01-15T10:30:00Z
source: user_teaching
---

# 用户偏好：合同审查

用户偏好先看付款条件和违约责任，再看保密、知识产权和争议解决。
违约金超过合同金额 30% 时需要标红。
保密期限低于 2 年时需要特别提醒。
报告格式偏好：先总结，后细节。
```

| frontmatter 字段 | 说明 |
|-----------------|------|
| `type` | 记忆类型，例如 `fact`、`preference`、`experience`、`rule` |
| `importance` | 重要性：`high`、`medium`、`low` |
| `created` | 创建时间 |
| `source` | 来源，例如 `user_teaching`、`interaction`、`reflection` |

## 回执文件

回执记录一次执行过程的目标、步骤、工具调用、产物、风险和耗时。它们保存在运行记录中，用于审计和追溯。

```yaml
receipt_id: "rcpt_20260115_143022_abc123"
repo_ref: "a1b2c3d4..."
session:
  session_id: "sess_xyz789"
  agent_id: "legal-advisor"
  user_id: "user_001"
task:
  input_summary: "审查供应商合同第三条"
  output_summary: "发现 2 个高风险条款"
  outcome:
    status: completed
step_types:
  deterministic: 3
  adaptive: 5
  human_gate: 1
time_metrics:
  agent_execution_time: 45
  actual_human_time: 120
```

回执可能还会记录会话 ID、智能体 ID、仓库引用、审批状态、工具调用链、文件变更摘要和错误原因。它们不是给用户手写的配置文件，而是系统生成的审计材料。

## 目录结构约定

| 目录/文件 | 管理方式 | 说明 |
|----------|---------|------|
| `agents/<id>/` | Git 管理 | 智能体本体，可共享、可发布 |
| `users/<id>/` | 本地私有 | 用户画像、偏好和关系记忆 |
| `runs/` | 本地运行记录 | 会话、执行回执和审计数据 |
| `cache/` | 可重建 | 索引、市场和临时缓存 |
| `logs/` | 本地日志 | 应用和服务日志 |
