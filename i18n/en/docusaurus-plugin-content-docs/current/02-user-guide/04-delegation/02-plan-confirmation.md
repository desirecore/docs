---
title: Plan Files and Natural Collaboration
description: Learn how agents keep versioned plans in the working directory and how to review, revise, and continue through natural conversation.
keywords: [plan, review, revision, steps, working directory, versioning]
last-reviewed: 2026-07-22
---

# Plan Files and Natural Collaboration

For work that calls tools, changes files, delegates work, has multiple delivery steps, or affects an external system, the agent first creates or reads a Plan in the current working directory before acting.

A Plan is an ordinary Markdown work file. It is not a mode and does not grant permission to execute. You can revise, pause, or redirect it in natural language at any time. When a sensitive or high-risk action is actually about to happen, DesireCore still applies the relevant permission check or Human Gate.

## Why Plans Live in the Project

- **Transparent**: open them in any editor without relying on the chat UI.
- **Editable**: you can edit a Plan directly, and the agent should reread it before continuing.
- **Traceable**: every substantive revision keeps an immutable historical version.
- **Project-local**: your team decides whether Plan files belong in Git.

## Which Requests Create a Plan

| Request type | Agent behavior |
|---|---|
| Change files, run action-oriented tools, or affect an external system | Create or read a Plan first |
| Delegate to another agent or deliver multi-step work | Create or read a Plan first |
| Missing information | Write a small Plan with open questions, ask for clarification, then revise it |
| Goal, constraints, or strategy changes during execution | Create a new revision before continuing |
| Pure Q&A, explanation, or casual conversation | Do not create a Plan file |

This is an agent behavior policy, not a session lock or read-only mode. It does not hide tools, and the presence of a Plan never bypasses permission checks.

## File Location

Each task uses its own directory:

```text
<current-workdir>/.desirecore/plans/<plan-id>/
├── PLAN.md
└── revisions/
    ├── 000001.md
    ├── 000002.md
    └── ...
```

- `PLAN.md` contains the current version.
- `revisions/` contains immutable history.
- On creation, `PLAN.md` and `revisions/000001.md` have the same content.
- Restoring older content creates a new revision instead of rewriting history.

DesireCore does not automatically change `.gitignore`, stage these files, or commit them.

### Multiple and Team Working Directories

- A normal conversation resolves cwd from the agent primary/first valid directory, then the global primary/first valid directory.
- Click a team shared directory in the input-area working-directory pill or resource panel to activate that team's scope for the conversation. Click the same team again to leave it.
- Team selection belongs to the specific conversation. DesireCore sends its `teamId`, and the backend revalidates membership and the shared directory instead of silently falling back.
- Even when several directories are accessible, a task has one authoritative Plan in the current cwd. Other directories are recorded in `related_workdirs`, and cross-directory work uses absolute paths.
- Changing a normal primary directory does not move an in-progress Plan. Continuing across teams creates a new Plan in the new team directory and links the old one through `continued_from`.

The working-directory scope cannot change while a conversation is running. After an idle conversation switches scope, its next message uses the new cwd, file permissions, project instructions, and Plan root together so old and new directory context cannot be mixed.

## What a Plan Contains

A typical Plan includes:

| Section | Content |
|---|---|
| **Goal** | The problem and completion criteria |
| **Constraints and decisions** | Known boundaries, chosen approach, and prohibited actions |
| **Implementation order** | Dependency order, not a priority ranking |
| **Open questions** | Information that is still missing |
| **Risks and verification** | Risks, concrete Human Gates, and how the result will be checked |

Plan frontmatter records `id`, `revision`, `parent_revision`, `workdir`, the absolute `plan_path`, `scope`, `related_workdirs`, and timestamps; team Plans also record `team_id`. It does not store workflow states such as `approved`, `rejected`, `mode`, or `phase`.

## Reviewing and Revising a Plan

There is no required “approve plan” button. Just tell the agent what you want:

```text
“Write the Plan only; do not execute yet.”
“Change step two so we back up before migrating.”
“Continue with this approach, but ask me before sending the email.”
“This direction is wrong. Keep the current revision and plan again.”
```

If your change affects the goal, constraints, strategy, steps, or verification, the agent creates a new revision. Ordinary progress updates do not create Plan versions.

You can also edit `PLAN.md` directly. Before continuing, the agent should reread the file and merge external edits instead of silently overwriting them.

## A Plan Is Not Authorization

These concepts remain separate:

| Concept | Purpose |
|---|---|
| **Plan** | Records what is intended, why, and how it will be verified |
| **Natural conversation** | Expresses revisions, continuation, pauses, or a change of direction |
| **Human Gate** | Allows or rejects a specific high-risk action |

Saying “the Plan looks good, continue” does not permanently open permissions. If later work deletes data, publishes a release, sends an email, or performs another high-risk action, DesireCore still follows the active approval policy.

## Plans vs Task Progress

Plans describe strategy. Tasks describe assignable ownership and execution state. A Plan with many steps does not automatically need a task list. Agents use Tasks when work needs cross-agent ownership, waiting or blocking, ongoing progress visibility, or when you explicitly request tracking.

:::info Next Step
See [Execution Monitoring](./03-execution-monitoring.md) to learn how to inspect active tasks, tool calls, and receipts.
:::
