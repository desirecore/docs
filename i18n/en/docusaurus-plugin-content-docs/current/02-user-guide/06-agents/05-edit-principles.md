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

## L0/L1/L2 Three-Layer Principle Structure

DesireCore's principles use a layered structure to ensure Agents have clear priorities when facing conflicts:

### L0 — Absolute Hard Rules

L0 principles are **absolute bottom lines** that the Agent cannot violate under any circumstances:

- Must not help users engage in illegal activities
- Must not leak other users' private data
- Must not forge data or credentials

:::warning L0 Principles Cannot Be Modified
L0 layer principles are set by the system and cannot be deleted or modified by users. This ensures all Agents adhere to basic safety and ethical bottom lines.
:::

### L1 — Important Behavioral Guidelines

L1 principles are **strong constraints** that the Agent should follow, but can negotiate adjustments when explicitly requested by the user:

- Must obtain user confirmation before executing delete, send, pay, and other operations
- Inform users of risks when involving sensitive data
- Mark uncertainty when giving advice

### L2 — Preferences and Style Guidelines

L2 principles are **soft constraints** that define the Agent's work preferences and style, which can be flexibly adjusted according to the scenario:

- Output format preferences (Markdown / plain text)
- Answer detail level (concise / detailed)
- Specific domain work habits

| Level | Constraint Strength | Modifiable | Example |
|---|---|---|---|
| **L0** | Absolute bottom line | No | "Must not help with illegal activities" |
| **L1** | Strong constraint | Yes | "Must confirm before sensitive operations" |
| **L2** | Soft constraint | Yes | "Keep answers within 500 words" |

## Adding and Modifying Principles

### Editing Through Interface

1. Enter the Agent details page
2. Click the "Principles" tab
3. You can see the current list of L1 and L2 principles
4. Click "Add Principle" to create a new entry
5. Select the level (L1 or L2), enter the principle content
6. Takes effect immediately after saving

### Teaching Through Conversation

In conversation with the Agent, you can directly set principles:

> "When replying with any investment advice in the future, always add a risk warning."

> "Don't send emails proactively, ask me every time."

The Agent will recognize these as behavioral principles and write them to `principles.md` after review.

### Direct File Editing

Advanced users can directly edit the `~/.desirecore/agents/<agent_id>/principles.md` file. The file uses Markdown format with a clear and readable structure.

## Principle Priority

When multiple principles may conflict, priority from high to low is:

1. **L0 Hard Rules** — Always prioritized
2. **L1 Strong Constraints** — Unless user explicitly requests exception
3. **L2 Soft Constraints** — Can be flexibly handled according to specific scenarios

If the user's instruction conflicts with an L1 principle, the Agent will remind the user of the conflict and wait for user confirmation. If the user's instruction conflicts with an L0 principle, the Agent will refuse to execute.

:::tip Principle Writing Suggestions
- **Specific beats vague**: "Must confirm before operations involving amounts over 1000 yuan" is better than "Confirm for large amounts"
- **Testable**: Good principles should be able to clearly judge "whether violated"
- **No overlap**: Avoid defining the same content in both principles and persona
:::

## Next Steps

- [File Explorer](./06-agent-files.md) — Browse the Agent's file structure
- [Edit Persona](./04-edit-persona.md) — Adjust the Agent's tone and style
