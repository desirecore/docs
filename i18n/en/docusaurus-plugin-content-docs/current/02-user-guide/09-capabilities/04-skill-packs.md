---
title: Skill Packs
description: Understand skill packs - how they differ from tools, how to install and manage them, and how to create custom skills.
keywords: [Skill Pack, Skill, skill installation, custom skill, skill marketplace]
---

# Skill Packs

If tools are the agent's "hands," skill packs are the agent's method. Tools answer "can the agent perform this action?" Skill packs answer "how should the agent handle this class of task?" They package judgment criteria, steps, references, and tool usage rules into auditable instructions.

## Tools vs. Skills

| Dimension | Tool | Skill |
|-----------|------|-------|
| Essence | Atomic capability | Task method |
| Granularity | Single call | Multi-step workflow |
| Example | Read, Grep, PowerShell, WebFetch | Contract review, PDF form filling, web research |
| Risk | Determined by tool and parameters | Determined by tools used in the skill flow |
| Analogy | A hammer or pen | An operating manual |

For example, Read only reads files. A "Data Analysis Report" skill tells the agent how to read data, clean it, analyze it, visualize it, and write the report. A skill does not create new permissions; it tells the agent how to combine available tools, in what order, and what to do when the flow hits an exception.

## What a Skill Pack Contains

The core file is `SKILL.md`; a complete skill can also include scripts, references, templates, and evals:

```text
my-skill/
+-- SKILL.md
+-- scripts/
+-- references/
+-- assets/
+-- evals/
```

`SKILL.md` usually defines:

- Usage and non-usage criteria
- Required inputs and execution steps
- Available tools and permission boundaries
- Output format and completion criteria
- Failure handling and escalation paths
- Metadata such as version, author, provider, or model preference

:::info What Skills Are
Technically, a skill pack is structured instruction plus related resources. When the agent loads a skill, its steps, constraints, and completion criteria become task context, so the behavior is reviewable and reusable.
:::

## How Skills Become Active

| Method | Description | Best For |
|--------|-------------|----------|
| Explicit invocation | The user selects or calls a skill directly | You know exactly which skill to use |
| Automatic matching | The agent chooses a skill based on task and description | You describe the goal, not the implementation |

Skills can declare `user-invocable`, `disable-model-invocation`, `allowed-tools`, and `context` to control direct invocation, automatic triggering, tool scope, and forked execution. `disable_model_invocation` is also accepted as a compatibility alias for `disable-model-invocation`.

### Explicit Invocation

When you select a skill in the list or explicitly ask for it in chat, the system adds that skill to the current task context. This is useful when you already know the workflow you want, such as "use the contract review skill on this agreement."

### Automatic Matching

Automatic matching depends on the skill description and trigger conditions. You describe the goal, and the agent decides whether an enabled skill should be loaded.

Only enabled skills enter the candidate set. If a skill declares `allowed-tools`, the agent stays within that tool scope while following the skill. If a skill disables model invocation, the model will not select it automatically; it must be invoked by the user or UI.

## Skill Sources

| Source | Location | Notes |
|--------|----------|-------|
| Global Skills | `~/.desirecore/skills/` | Shared by all agents, including built-in skills |
| Agent Skills | Inside the agent repository | Available only to that agent and can be published with it |
| Project Skills | `.agents/skills/` or `.claude/skills/` in a work directory | Active only in that project context |

Only enabled skills are injected into the agent context. Capability declarations are gated by actual tool availability, so agents do not see tools that cannot be called in the current environment.

:::tip Global Skills vs. Agent Skills
Global skills are best for general capabilities such as file handling, search optimization, and web access. Agent skills are best for a specific agent's professional workflow, project release process, or team convention.
:::

## Installing and Importing Skills

You can install skills from the marketplace or import local skills.

Marketplace details usually show:

- What the skill does and when to use it
- Required tools and permissions
- Author, source, version, and update information
- Provider, model, or runtime preferences

Local import supports:

- A single `.md` skill file
- A folder containing `SKILL.md`
- A `.zip` package

The import flow checks path safety, file structure, and required metadata. If a skill declares a provider preference, runtime selection prefers matching providers with available keys. If it declares a tool allowlist, the agent executes inside that scope.

Dependency checks surface problems before you rely on a skill:

- **Required tools are ready**: the skill can be enabled or imported
- **Tools or capabilities are missing**: the UI explains which part cannot run in the current environment
- **The package is incomplete**: import fails when `SKILL.md` is missing, metadata is invalid, or the archive layout is unsupported

Installing a skill does not grant system permissions by itself. High-risk actions still go through tool permissions, user confirmation, and approval flows.

## Built-in Global Skills

DesireCore includes global skills for skill creation, Word / Excel / PowerPoint document processing, PDF reading and forms, web access, frontend design, and mail operations. These skills are maintained through client and marketplace sync. You can inspect, disable, copy, or replace them with your own workflows.

## Managing Installed Skills

Skill management lets you maintain availability and provenance:

- **View skills**: inspect installed, built-in, project, and agent skills
- **Enable or disable**: control whether a skill enters the agent context or matching set
- **Review details**: check descriptions, dependencies, invocation mode, allowed tools, and resource files
- **Copy or customize**: create your own version of a built-in skill when you need local workflow changes
- **Uninstall or remove**: delete marketplace or local skills you no longer need

Project skills also depend on the current work directory and whether the agent is using that project context.

## Creating Custom Skills

Before writing a skill, answer:

1. When should this skill be used?
2. What steps should it follow?
3. What output counts as done?

Good skills are clear to trigger, executable, bounded, verifiable, and focused. Put long background material in `references/`.

### Basic Creation Flow

1. Create a skill directory or a single Markdown skill file
2. Write `SKILL.md` with the name, purpose, triggers, and execution steps
3. Put long references in `references/` and reusable scripts in `scripts/`
4. Declare tool boundaries, provider preferences, or context settings when needed
5. Import and enable the skill
6. Test trigger behavior, execution steps, and output format with simple examples

### Writing Tips

Skill instructions should be clear, specific, and unambiguous:

- **Clear steps**: what each step does, what it takes as input, and what it returns
- **Branches**: when to take each path
- **Error handling**: whether to retry, skip, or ask the user for confirmation
- **Completion criteria**: what counts as done and where deliverables should go
- **Permission boundaries**: which actions must ask the user first and which tools are off limits

:::warning Test First
Custom skills influence agent behavior. Test them on simple examples before using them for important work.
:::

## Skill Updates

Built-in and marketplace skills can detect available updates. Unmodified skills can sync automatically; modified skills are not silently overwritten. Copy a skill and give it your own name and ID if you want to keep local customization.
