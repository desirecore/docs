---
title: Skills Management
description: Learn about the Agent Skill system - what skills are, how to view, install, import, and manage them.
keywords: [Skill, Skill Pack, Skills Management, Skill Marketplace]
---

# Skills Management

Skills are capability modules for agents. A skill is usually defined by `SKILL.md`, which describes when to use it, what steps to follow, which tools are available, and what output is expected.

## What Are Skills

A skill is not a single tool call. It is a reusable method for a task type. For example, a "Contract Review" skill may include:

- **Trigger conditions**: when the user submits a contract or asks for clause review
- **Steps**: read the file, split clauses, identify risks, produce suggestions
- **Tools**: Read, Edit, WebFetch, MCP legal references
- **Output format**: risk summary, clause-by-clause comments, suggested edits

| Dimension | Skill | Tool |
|---|---|---|
| Essence | High-level behavior instruction | Low-level capability interface |
| Granularity | A complete task workflow | One concrete operation |
| Example | Contract Review, Web Research, PPT Editing | Read, Grep, PowerShell, WebFetch |
| Contents | Instructions, steps, constraints, references, scripts | Parameters, executor, permission, result |

## Skill Sources

DesireCore discovers skills from several locations:

| Source | Location | Scope |
|--------|----------|-------|
| Global Skills | `~/.desirecore/skills/` | Available to all agents |
| Agent Skills | The agent repository's `skills/` directory | Available to that agent |
| Project Skills | `.agents/skills/` or `.claude/skills/` in the work directory | Available in that project context |

Disabled skills are not injected into the agent context. Skills with tool restrictions, model preferences, or provider preferences are matched against the current runtime and compute configuration.

## Viewing Skills

1. Open the agent details page
2. Open **Skills** or **Skills Management**
3. Review available, disabled, and updateable skills

Skill cards can show name, description, source, version, author, status, direct-invocation setting, and tool or provider requirements. Click a skill to inspect `SKILL.md`, references, and scripts.

## Adding Skills

### From the Marketplace

1. Open the skill marketplace or the agent skills panel
2. Search or browse by category
3. Review the skill description, dependencies, and risk notes
4. Install and confirm when prompted

Global marketplace skills are installed into the global skills directory. Agent-bound skills are written into the corresponding agent repository.

### Local Import

**Import Skill** supports three local formats:

| Format | Description |
|--------|-------------|
| `.md` file | Import a single Markdown skill file; DesireCore creates the skill directory |
| Folder | Import a folder containing `SKILL.md`, scripts, references, or templates |
| `.zip` package | Import a compressed skill directory for migration or sharing |

The import flow validates structure, path safety, and required fields. If it fails, the UI shows the specific reason.

## Enable, Disable, Export, Remove

- **Enable / Disable**: controls whether a skill can be loaded. Disabling does not delete files.
- **Export**: in the skill detail panel, click **Export** to download a global skill or the current agent's embedded skill as a ZIP package. The package includes `SKILL.md` plus scripts, references, and assets under that skill directory, so it can be backed up, moved, or reinstalled through local import.
- **Remove**: deletes the skill files. Agent repository skills can be recovered from version history.
- **Update**: built-in and marketplace skills can detect updates. User-modified skills are not silently overwritten.

:::info Built-in Global Skills
DesireCore includes global skills for skill creation, document processing, PDF, PPT, spreadsheet, web access, frontend design, and mail operations. Built-in skills are maintained automatically through the client and marketplace sync, while user edits are preserved where possible.
:::

## Skill Risk And Confirmation

A skill is instruction and resources; it does not bypass tool permissions. Runtime risk comes from the tools it calls, the data it touches, and the external effects it produces.

| Risk Level | Meaning | Common Examples |
|---|---|---|
| Low | Mainly reads or organizes information without changing system state | Summarization, information lookup, format checks |
| Medium | Uses network access, writes files, or connects external services | Web research, report generation, API calls |
| High | May modify the system, run commands, send external messages, or handle sensitive data | Command execution, bulk file edits, mail sending, publishing |

High-risk actions still follow tool approvals, permission settings, and human gates. Installing or enabling a skill does not approve every operation inside it; when a skill triggers sensitive tools, DesireCore applies the corresponding tool and approval policy.

## Skill Metadata

`SKILL.md` can declare metadata in frontmatter:

| Field | Description |
|-------|-------------|
| `name` / `metadata.name` | Display name |
| `description` / `metadata.description` | Description used for matching |
| `version` / `metadata.version` | Skill version |
| `author` / `metadata.author` | Author |
| `allowed-tools` | Tools allowed while running this skill |
| `provider` | Preferred model or media provider slug |
| `model` | Model to use when this skill is triggered |
| `user-invocable` | Whether users can call it directly |
| `disable-model-invocation` | Whether automatic model-triggered invocation is disabled; `disable_model_invocation` is also accepted |
| `context` | Execution context mode, such as default or fork |

These fields affect card display, command completion, automatic triggering, tool availability, and provider selection.

## Custom Skill Structure

```text
<skill_id>/
+-- SKILL.md
+-- scripts/
+-- references/
+-- assets/
+-- evals/
```

:::tip Clear Trigger Conditions
The clearer the skill description, the easier it is for the agent to choose it at the right time. State when to use it and when not to use it near the top of `SKILL.md`.
:::

## Next Steps

- [Skill Packs](../09-capabilities/04-skill-packs.md) - Understand skills vs. tools
- [Version Control](./08-version-control.md) - Track skill edits with Git
- [Agent Marketplace](./02-marketplace.md) - Discover more capabilities
