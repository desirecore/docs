---
title: Prompt Center and Prompt Layers
description: Manage global, team, and Agent prompts, understand L0/L1/L2 loading, and preview the combined system prompt.
keywords: [Prompt Center, system prompt, global prompt, team prompt, Persona, Principles, L0, L1, L2]
---

# Prompt Center and Prompt Layers

Prompt Center brings prompts stored across the user, team, and Agent directories into one management surface. Open **Explorer -> Prompt Center**, select a scope on the left, and edit or preview it on the right.

## Three Scopes

| Layer | Scope | Content |
|---|---|---|
| **Global** | All Agents owned by the current user | General preferences, working style, and cross-Agent rules |
| **Team** | Every member and supervisor of the team; multiple memberships can produce multiple sections | Collaboration rules, shared terminology, and delivery standards |
| **Agent** | One Agent | `persona.md` and `principles.md` |

At runtime, DesireCore combines editable sections in this order: **global -> team -> Agent persona -> Agent principles**, then adds team identity, tools, skills, memory, conversation, and other runtime context. A team prompt cannot forge or replace real team identity; membership, supervisor, and peer relationships come from team configuration.

## L0 / L1 / L2

The global and team editors support both form and Markdown source modes. A layered file must use exact second-level headings:

```md
## L0
One-sentence core summary

## L1
- Key points needed in every normal run

## L2
Longer background, examples, exceptions, and operating detail
```

| Level | Runtime Behavior |
|---|---|
| **L0** | Always injected into the system prompt |
| **L1** | Injected by default |
| **L2** | Not injected by default; retained for on-demand reading |

L0/L1/L2 describes loading granularity, not permission or safety levels. Saving a global, team, or Agent file does not expand tool permissions, file scope, or approval authority.

If no layer headings are recognized in source mode, DesireCore injects the whole file as one prompt section and reports a format warning during validation or save.

## Edit and Preview

1. Select **Global Prompt**, a team, or expand an Agent.
2. Fill L0/L1/L2 in form mode, or edit the full Markdown in source mode.
3. Save the content.
4. For an Agent, select **Prompt Preview** and inspect the global, team, Agent, and system groups.

Preview shows section sources and character counts, making duplicated, conflicting, or oversized content easier to spot. It represents the static context available at query time. A live request may also add inbox, handoff, voice, tools, or newer team state, so use the system-prompt summary in Interface Audit as the final reference for live diagnosis.

## Writing Guidance

- Put only rules that apply to every Agent in the global layer.
- Put collaboration and delivery conventions in the team layer; do not duplicate membership identity.
- Keep role-specific personality and boundaries in the Agent layer.
- Put short, frequently needed content in L0/L1 and long explanations or examples in L2.
- Do not use prompt text as a substitute for permissions, approval policies, or code-level safety controls.

## Next Steps

- [Edit Persona](./04-edit-persona.md)
- [Edit Principles](./05-edit-principles.md)
- [Agent Files](./06-agent-files.md)
