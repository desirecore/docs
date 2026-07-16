---
title: Edit Principles
description: Learn about the Agent Principles system—L0/L1/L2 three-layer structure, and methods for adding and modifying principles.
keywords: [Principles, L0, L1, L2, Safety Rules, Priority]
---

# Edit Principles

Principles are the Agent's "behavior manual"—they specify the rules the Agent must follow, the red lines it must not cross, and the priority order when making decisions.

## What are Principles

Principles are saved in the `principles.md` file in the Agent directory. Unlike Persona, principles focus on "what to do and not do" rather than "how to do it."

For example:

| Persona | Principles |
|---|---|
| "Answers should be concise" | "Must not leak user privacy information" |
| "Tone should be friendly" | "Must confirm before involving paid operations" |
| "Give conclusion first, then reasons" | "Safety > Correctness > Efficiency" |

## L0/L1/L2 Content Levels

DesireCore uses L0/L1/L2 to control how much prompt content is loaded. These are **content levels**, not system permission levels.

### L0 — Core Summary

L0 is a sentence or very short summary of the most important role and rules. It is always injected into the system prompt.

- Must not help users engage in illegal activities
- Must not leak other users' private data
- Must not forge data or credentials

### L1 — Key Behavioral Guidelines

L1 contains the key points the Agent should see while doing normal work. It is injected by default:

- Must obtain user confirmation before executing delete, send, pay, and other operations
- Inform users of risks when involving sensitive data
- Mark uncertainty when giving advice

### L2 — Full Detail

L2 contains longer explanations, exceptions, examples, and operating detail. It is not injected by default and can be read on demand:

- Output format preferences (Markdown / plain text)
- Answer detail level (concise / detailed)
- Specific domain work habits

| Level | Default Loading | Recommended Content | Editable |
|---|---|---|---|
| **L0** | Always injected | One-sentence core summary | Yes |
| **L1** | Injected by default | Key rules and operating points | Yes |
| **L2** | Read on demand | Full explanations, examples, and exceptions | Yes |

:::warning Prompts are not permissions
Putting a rule in L0 does not grant tool, file, command, or external-service permission, and cannot override DesireCore's code-level security and approval policies. Conversely, an editable L0 should not be described as an immutable system safety boundary.
:::

## Adding and Modifying Principles

### Editing Through Interface

1. Open **Explorer -> Prompt Center**
2. Expand the Agent and choose **Principles**
3. Edit the complete `principles.md` Markdown file
4. Save it, then open **Prompt Preview** to inspect how it combines with global, team, and persona prompts

### Teaching Through Conversation

In conversation with the Agent, you can directly set principles:

> "When replying with any investment advice in the future, always add a risk warning."

> "Don't send emails proactively, ask me every time."

The Agent will recognize these as behavioral principles and write them to `principles.md` after review.

### Direct File Editing

Advanced users can edit the Agent's `principles.md` under the DesireCore data directory. Layered files must use exact second-level `## L0`, `## L1`, and `## L2` headings.

## Relationship to Other Prompt Layers

At runtime, DesireCore combines editable prompts in this order: **global -> team -> Agent persona -> Agent principles**, then adds team identity, tools, memory, and other system context. L0/L1/L2 controls how much of each file is loaded; global/team/Agent controls its scope. Avoid contradictory rules across layers, and use Prompt Preview to inspect the final combination.

:::tip Principle Writing Suggestions
- **Specific beats vague**: "Must confirm before operations involving amounts over 1000 yuan" is better than "Confirm for large amounts"
- **Testable**: Good principles should be able to clearly judge "whether violated"
- **No overlap**: Avoid defining the same content in both principles and persona
:::

## Next Steps

- [File Explorer](./06-agent-files.md) — Browse the Agent's file structure
- [Edit Persona](./04-edit-persona.md) — Adjust the Agent's tone and style
- [Prompt Center and Prompt Layers](./11-prompt-center.md) — Understand global, team, and Agent prompt composition
