---
title: File Format Reference
description: Format and structure reference for core AgentFS files
keywords: [file format, AgentFS, agent.json, instructions.md, SKILL.md, memory, principles]
---

# File Format Reference

:::info Standing instructions version support
`instructions.md` is implemented in development version 10.0.179. As of 2026-10-09, the latest public release is still v10.0.177. Release users need a version that includes this capability before using it.
:::

AgentFS stores agent identity, behavior, memory, skills, and runtime policy as ordinary files. You can edit them through the UI or directly when you understand the fields.

## agent.json -- Agent Entry Configuration

Every agent has an `agent.json` at its root. It defines identity, default model, permissions, and runtime environment injection.

```json
{
  "$schema": "https://desirecore.net/schemas/agentfs/v1/agent-config.json",
  "name": "Legal Advisor",
  "version": "1.2.0",
  "description": "Contract review and legal risk analysis",
  "avatar": {
    "char": "L",
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

| Field | Description |
|-------|-------------|
| `name` | Agent display name, required |
| `version` | Agent content version, semver |
| `description` | One-line description |
| `avatar` | Avatar character and color |
| `llm` | Agent-level default model configuration |
| `env` | Date, time, timezone, and session-start injection policy |
| `heartbeat` | Heartbeat capability switch; inspection content lives in `heartbeat/HEARTBEAT.md` |
| `tool_permissions` | Tool allowlist or denylist |
| `mcp_servers` | Agent-specific MCP server configuration |
| `webhooks` | External webhook triggers |
| `agents` | Sub-agent definitions |
| `capabilities` | Capability labels |
| `trigger_patterns` | Simple trigger patterns |
| `repository` | Remote repository, branch, and publishing connection |

### `llm` Model Configuration

`llm` is the current agent-level model configuration. Legacy `runtime` model fields are accepted for compatibility, but new files should use `llm`.

| Field | Description |
|-------|-------------|
| `provider` | Provider protocol or type, such as `anthropic`, `openai`, or `deepseek` |
| `providerId` | Concrete provider instance ID, used to bind the correct Base URL and API Key |
| `model` | Default model name |
| `thinkingBudgets` | Budgets for `low`, `medium`, `high`, and `xhigh` reasoning levels |
| `maxRetryDelayMs` | Maximum retry delay for failed API calls |

### `env` Environment Injection

`env` controls whether the agent receives current date, local time, timezone, and session start time in the system prompt. When a continued session crosses into a new day, DesireCore appends a reminder so the agent does not keep using the old date.

| Field | Default | Description |
|-------|---------|-------------|
| `enabled` | `true` | Enable environment injection and date rollover detection |
| `includeWeekday` | `true` | Include weekday in the date |
| `includeLocalTime` | `true` | Include local time and timezone |
| `includeSessionStart` | `true` | Include session start time |
| `template` | none | Custom template using `{date}`, `{weekday}`, `{localTime}`, `{tz}`, `{sessionStart}` |

### `heartbeat` Heartbeat Switch

`heartbeat.enabled` is the agent-level heartbeat switch. The inspection checklist lives in `heartbeat/HEARTBEAT.md`; user-level preferences such as frequency, quiet hours, Snooze, and cooldown are saved by heartbeat settings.

| Field | Default | Description |
|-------|---------|-------------|
| `enabled` | `false` | Whether this agent may run heartbeat inspections |

## persona.md -- Persona

`persona.md` defines how the agent communicates and structures answers.

```markdown
## How I Want You to Respond
- Start with the conclusion, then give the reasoning.
- Ask the one blocking question when ambiguity matters; otherwise state assumptions and continue.

## What I Do Not Want
- Template-like empathy or generic encouragement
- Analysis with no decision or next action

## When Uncertain
- State what is uncertain and give a verification path. Escalate to the user when the uncertainty affects risk.
```

`persona.md` stores role, expression style, and communication preferences. Put safety boundaries and confirmation rules in `principles.md`, and stable responsibilities and delivery requirements in `instructions.md`, so each requirement has one home.

## principles.md -- Behavioral Rules

`principles.md` defines hard rules, safety boundaries, and escalation paths.

```markdown
## Must Do
- Confirm before any money-moving operation
- Explain the file change scope before editing files
- Generate a receipt after task completion

## Never Do
- Do not send external messages without confirmation
- Do not delete user files unless the user explicitly asks and confirms

## Escalation Path
- Escalate uncertain legal-risk judgments to the user
- Escalate operations above USD 10,000
```

`Never Do` rules and safety boundaries should stay concise and unambiguous. These constraints affect long-running agent behavior, so avoid writing them as vague preferences.

## instructions.md -- Agent Standing Instructions

`instructions.md` is an optional file at the agent root. It stores stable responsibilities, default work strategies, and delivery standards. For example, it can define what a legal advisor should deliver in every contract review:

```markdown
# Contract Review Responsibilities

Before reviewing, establish the transaction goal, contract version, and priority clauses.

Deliver a risk summary, itemized comments, suggested revisions, and questions for the user.
Include the source location for each comment. State uncertainty when evidence is missing;
do not invent clauses or facts.
```

### Where Content Belongs

| Content | Location |
|---------|----------|
| Role, tone, and expression style | `persona.md` |
| Behavioral boundaries, prohibited actions, and priorities | `principles.md` |
| This agent's stable responsibilities, default work strategies, and delivery standards | `instructions.md` |
| Detailed procedures, long SOPs, templates, and reference material | `skills/*/SKILL.md` and its `references/` |
| User preferences, team conventions, and project rules | `prompt.md`, `rules.md`, or `AGENTS.md` in the relevant scope; do not copy them into the shareable agent body |

### File and Update Contract

- Use ordinary UTF-8 Markdown. Frontmatter is not required or parsed, and L0/L1/L2 headings have no loading semantics. Content under `## L2` is still part of the full body.
- When the current runtime context allows this source, its nonempty body is loaded in full as a separate prompt section. It is never automatically summarized or truncated. If it cannot fit the context budget, the operation fails explicitly; shorten the instructions and move detailed methods into skills.
- Saved content is reread when new input, explicit continuation, or restoration is accepted. Tool loops, retries, and fallback models within the same execution turn retain the accepted snapshot.
- Normal heartbeats also load the full instructions. Lightweight heartbeats with `lightContext=true` skip them.
- The `ManageAgent` `instructions` parameter is a string: omission preserves the file, a string replaces the whole body, and an empty string clears it. Omitting it during creation does not require the file to be generated. The body must not contain NUL characters.

This file is one source for the dynamically assembled system prompt; it does not store or replace the complete `systemPrompt`. Editing it grants no tools, file access, or approval authority. See [File Explorer](../02-user-guide/06-agents/06-agent-files.md) and [Prompt Center](../02-user-guide/06-agents/12-prompt-center.md) for editing.

## SKILL.md -- Skill Definition

Each skill pack must include `SKILL.md`. Frontmatter can use top-level fields or a `metadata` wrapper.

```markdown
---
name: Contract Review
description: Review contract clauses, identify risks, and suggest edits
version: 1.0.0
author: DesireCore Team
allowed-tools: [Read, Write, Edit]
user-invocable: true
risk_level: medium
provider: anthropic
---

# Contract Review

## When to Use
Use when the user asks for contract review, clause risk analysis, or suggested edits.

## Execution Steps
1. File parsing (deterministic step): read the contract, parse document structure, and identify sections and clause numbers.
2. Clause analysis (adaptive step): review payment, breach, intellectual property, confidentiality, and dispute-resolution clauses.
3. Risk labeling (adaptive step): group findings by high, medium, and low risk, with reasoning.
4. Report generation (deterministic step): produce risk summary, itemized comments, and revision suggestions from a fixed template.
5. User confirmation (human gate): ask for confirmation before external sending, rewriting source files, running commands, or issuing final formal advice.

## References
- Legal templates and examples under `references/`
```

Skill bodies can mark deterministic steps, adaptive steps, and human gates in prose. Workflow DSL uses `human_gate` nodes to formally block until the user responds; similar labels inside a skill help the agent and auditors understand process boundaries.

| Field | Description |
|-------|-------------|
| `name` / `metadata.name` | Display name |
| `description` / `metadata.description` | Matching description |
| `version` / `metadata.version` | Skill version |
| `author` / `metadata.author` | Author |
| `tags` | Search and marketplace tags |
| `requires.tools` | Required tool list |
| `requires.optional_tools` | Optional tool list |
| `requires.connections` | Required external connections or accounts |
| `risk_level` | Risk level: `low`, `medium`, or `high` |
| `status` | Skill status: `enabled` or `disabled` |
| `allowed-tools` | Tools allowed while running the skill |
| `provider` | Preferred provider slug |
| `model` | Model to use when triggered |
| `user-invocable` | Whether users can call it directly |
| `disable-model-invocation` | Whether automatic model invocation is disabled; `disable_model_invocation` is also accepted |
| `context` | Execution context mode, such as `default` or `fork` |
| `agent` | Child-agent role description when `context=fork` |
| `argument-hint` | Argument hint for command completion or explicit invocation |
| `market` | Marketplace metadata, such as category, maintainer, and minimum client version |
| `json_output` | Declares expected JSON output and enables automatic repair strategy |

## schedules/*.json -- Scheduled Task Definition

Each scheduled task is stored as `schedules/<schedule_id>.json`. It describes the trigger rule, action, status, and lifecycle controls.

```json
{
  "id": "daily-briefing",
  "display_name": "Daily Briefing",
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
    "prompt": "Summarize today's calendar, todos, and important mail."
  },
  "tags": ["report"]
}
```

| Field | Description |
|-------|-------------|
| `id` | Schedule ID, unique inside the agent |
| `display_name` | Name shown in the Automation panel |
| `enabled` | Whether the schedule is enabled |
| `status` | `pending`, `active`, `paused`, `completed`, or `cancelled` |
| `schedule.kind` | Trigger type, commonly `at`, `delay`, `interval`, or `cron` |
| `schedule.at` / `delay` / `interval` / `cron` | Time parameter for the selected trigger type |
| `schedule.timezone` | IANA timezone, commonly used by `at` and `cron` |
| `schedule.starts_at` / `expires_at` | Active and expiry windows |
| `schedule.max_fires` | Maximum number of fires |
| `schedule.missed_fire_policy` | Missed-fire policy: `skip`, `fire_once`, or `fire_all` |
| `schedule.no_overlap` | Whether to skip a fire while the previous execution is still running |
| `action.type` | Usually `query`, meaning the scheduler sends a prompt to the agent; the schema also keeps `heartbeat` as a compatibility action type, while heartbeat monitoring should be managed through heartbeat settings |
| `action.prompt` | Instruction sent at trigger time |
| `retry` | Optional retry configuration |
| `failureAlert` | Optional consecutive-failure alert configuration |

The regular UI and `CreateSchedule` tool mainly create `at`, `delay`, `interval`, and `cron` schedules. The lower-level schedule definition also includes `rrule` for more complex iCalendar rules.

## memory/_policy.json -- Memory Policy

`memory/_policy.json` controls conversation memory compression and retention.

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

| Field | Description |
|-------|-------------|
| `compression.enabled` | Enables automatic compression; manual compression can still be called |
| `compression.max_recent_matters` | Maximum recent topics before older ones are archived |
| `compression.strategy` | Compression strategy, currently `summarize` |
| `retention.pinned` | Retention for pinned memories |
| `retention.topics` | Retention for topic summaries |
| `retention.timeline` | Recent/archive windows for timelines |

Legacy `threshold_days` is read compatibly as `max_recent_matters`; new files should use `max_recent_matters`.

## Memory Files

Memory files are Markdown files under `memory/`, with optional frontmatter for type, importance, creation time, and source.

```markdown
---
type: preference
importance: high
created: 2026-01-15T10:30:00Z
source: user_teaching
---

# User Preference: Contract Review

The user prefers seeing payment terms and breach liability first, then confidentiality, intellectual property, and dispute resolution.
Mark penalties above 30% of contract value in red.
Call out confidentiality periods shorter than 2 years.
Preferred report format: summary first, then details.
```

| Frontmatter Field | Description |
|-------------------|-------------|
| `type` | Memory type, such as `fact`, `preference`, `experience`, or `rule` |
| `importance` | Importance: `high`, `medium`, or `low` |
| `created` | Creation time |
| `source` | Source, such as `user_teaching`, `interaction`, or `reflection` |

## Receipts

Receipts record task goals, steps, tool calls, outputs, risks, and timing. They are used for audit and traceability.

```yaml
receipt_id: "rcpt_20260115_143022_abc123"
repo_ref: "a1b2c3d4..."
session:
  session_id: "sess_xyz789"
  agent_id: "legal-advisor"
  user_id: "user_001"
task:
  input_summary: "Review supplier contract clause 3"
  output_summary: "Found 2 high-risk clauses"
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

Receipts may also include session ID, agent ID, repository reference, approval state, tool-call chain, file-change summary, and error reasons. They are system-generated audit material rather than files users normally write by hand.

## Directory Conventions

| Path | Management | Description |
|------|------------|-------------|
| `agents/<id>/` | Git-managed | Agent body; shareable and publishable |
| `users/<id>/` | Local private | User profile, preferences, relationship memory |
| `runs/` | Local runtime records | Sessions, receipts, audit records |
| `cache/` | Rebuildable | Indexes, market cache, temporary data |
| `logs/` | Local logs | App and service logs |
