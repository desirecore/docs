---
title: Prompt Center and Content Ownership
description: Manage global, team, and agent prompts, distinguish layered prompts from full-body standing instructions, and preview their composition.
keywords: [Prompt Center, system prompt, global prompt, team prompt, Persona, Principles, instructions.md, L0, L1, L2]
---

# Prompt Center and Content Ownership

:::info Standing instructions version support
`instructions.md` is implemented in development version 10.0.179. As of 2026-10-09, the latest public release is still v10.0.177. Release users need a version that includes this capability before using it.
:::

Prompt Center brings prompt sources stored across user, team, and agent directories into one management surface. Open **Explorer → Prompt Center**, select a scope on the left, and edit or preview it on the right.

## Three Scopes

| Scope | Applies To | Content |
|---|---|---|
| **Global** | All agents owned by the current user | User preferences, working style, and cross-agent rules |
| **Team** | Every member and supervisor; multiple memberships can produce multiple sections | Collaboration rules, shared terminology, and delivery standards |
| **Agent** | One agent | `persona.md` for role and expression, `principles.md` for boundaries and priorities, and optional `instructions.md` for stable responsibilities and delivery requirements |

In a version supporting standing instructions, editable sections are combined in this order: **global → team → agent persona → agent principles → agent standing instructions**. Runtime context such as team identity, tools, skills, memory, and conversation is then added. A team prompt cannot forge or replace real team identity; membership and relationships come from team configuration. Keep project rules in files such as `AGENTS.md` in the project working directory.

## L0 / L1 / L2 in Layered Files

Global and team editors support form and Markdown source modes. Persona and principles also support layered Markdown. Layered content must use exact second-level headings:

```md
## L0
One-sentence core summary

## L1
- Key points needed in every normal run

## L2
Longer background, examples, and exceptions
```

| Level | Runtime Behavior |
|---|---|
| **L0** | Injected into the system prompt |
| **L1** | Injected by default |
| **L2** | Not injected by default; available for on-demand reading |

L0/L1/L2 describes loading granularity, not permission or safety levels. A layered file without recognized headings is loaded as one complete prompt section. Global and team editors may report a format warning.

## Standing Instructions Use Ordinary Markdown

`instructions.md` does not use these loading tiers and does not require or parse frontmatter. It stores this agent's stable responsibilities, default work strategies, and delivery standards. Even content under `## L2` is part of the body: when the source is allowed, the entire body is loaded as a separate section without summarization or truncation. If it exceeds the context budget, the operation fails explicitly. Put detailed methods, long SOPs, and reference material in skills instead of creating summary tiers for standing instructions.

Saved changes are reread when new input, explicit continuation, or restoration is accepted. The same execution turn keeps its snapshot. Normal heartbeats load the full body; lightweight heartbeats with `lightContext=true` skip it. See [File Format Reference](../../05-more/06-file-formats.md) for the full format and tool update contract.

## Edit and Preview

1. Select **Global Prompt**, a team, or expand an agent.
2. Use the relevant editor for L0/L1/L2 or Markdown in layered files. For the agent's **Standing Instructions**, edit the complete Markdown body.
3. Save the content.
4. Select the agent's **Prompt Preview** to inspect global, team, agent, and system groups.

Preview shows sources and character counts so you can spot duplication, conflicts, and oversized content. It represents static context available at query time. A live request may add inbox, handoff, voice, tools, or newer team state, so use Interface Audit records when diagnosing the actual request. Standing instructions are one source for the dynamic system prompt; they do not store or replace the complete `systemPrompt`.

## Writing Guidance

- Put the user's general requirements in the global scope and collaboration conventions in the team scope. Keep personal and project content out of the shareable agent body.
- Put role and expression in persona, boundaries and priorities in principles, and stable responsibilities, default strategies, and delivery standards in standing instructions.
- In layered files, keep content needed on every run in L0/L1. Standing instructions load in full; detailed methods belong in skills and reference material.
- Do not use prompt text as a substitute for permissions or approval policies.

## Example

A documentation engineer can keep each requirement in its own scope instead of putting everything in persona:

| Location | Example |
|----------|---------|
| User global prompt | The user prefers Chinese replies with technical terms in their original English form. |
| Team prompt | The documentation team uses shared terminology and document formats. |
| `persona.md` | A technical documentation engineer who writes concisely and accurately for developers. |
| `principles.md` | Do not describe unverified capabilities as implemented or invent sources. |
| `instructions.md` | Deliver actionable explanations, necessary examples, and validation results. Identify verified and unresolved boundaries. |
| Skills and reference material | Detailed build, link-checking, image-location, and publishing procedures. |

## Common Questions

| Question | Cause and Resolution |
|----------|----------------------|
| Key content in a layered file does not take effect | L2 is not injected by default; put always-needed rules in L0/L1. |
| The current task still uses old standing instructions after saving | The current execution turn keeps its snapshot. New content is read when new input, explicit continuation, or restoration is accepted. |
| Preview shows duplicate content | The same requirement is stored in multiple scopes. Keep it in the scope that owns it. |
| A team prompt does not take effect | Confirm membership and check the corresponding source when the agent belongs to multiple teams. |
| Layered source reports a format issue | Check for exact `## L0`, `## L1`, and `## L2` headings; standing instructions need none. |
| Standing Instructions is unavailable | Check whether the client includes the capability implemented in development version 10.0.179. |
| Standing instructions exceed the budget | Shorten the body and move detailed steps into skills. Execution does not proceed by truncating it or hiding an L2 section. |

:::caution Prompts Are Not Permissions
Editing prompts does not change tool permissions, file access, or approval policy. Use the relevant permission settings to change permissions.
:::

## Next Steps

- [Edit Persona](./04-edit-persona.md)
- [Edit Principles](./05-edit-principles.md)
- [Agent Files](./06-agent-files.md)
