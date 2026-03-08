---
title: Edit Persona
description: Learn what Agent Persona is and how to edit name, avatar, role positioning, and personality traits.
keywords: [Persona, Role Positioning, Personality Traits, Agent Configuration]
---

# Edit Persona

Persona defines "who" the Agent is—its tone, style, professional domain, and behavior. This is not a character description, but an **executable behavioral specification**.

## What is Persona

Persona is saved in the `persona.md` file in the Agent directory. It tells the Agent:

| Aspect | Description | Example |
|---|---|---|
| **Response Strategy** | How to answer questions | "Give conclusion first, then reasons; less formalities" |
| **Tone Style** | What tone to use | "Professional but not rigid, concise but not perfunctory" |
| **Confirmation Strategy** | When to ask the user | "Must confirm before sending messages, deleting, or paid operations" |
| **Forbidden Zones** | What not to do | "Don't use template clichés, don't avoid giving conclusions" |
| **Uncertainty Handling** | What to do when unsure | "Explain uncertainty and provide verification path" |

:::info Persona vs. Principles
**Persona** defines "how to do it"—tone, style, response methods. **Principles** define "what to do and not do"—rules, boundaries, priorities. They complement each other without overlapping.
:::

## Editing Name, Avatar, Description

On the Agent details page, you can modify basic information:

### Name

The display name of the Agent. Choose a concise and clear name for easy identification in the conversation list.

### Avatar

The visual identifier of the Agent. You can:

- Use a text avatar (a Chinese character or emoji)
- Upload a custom image

### Description

A one-sentence introduction to the Agent's purpose. A good description helps you quickly identify the Agent's positioning, for example:

- "Professional assistant focused on contract review and legal consultation"
- "Efficiency manager that helps you plan schedules and track tasks"

## Role Positioning and Personality Traits

In the Persona editor, you can configure the Agent's role and personality:

### Role Positioning

Role positioning determines the Agent's professional direction. For example:

- **Legal Advisor**: Focus on legal domain, rigorous wording, emphasizes risk warnings
- **Technical Assistant**: Focus on programming and technology, good at providing code examples
- **Writing Coach**: Focus on written expression, emphasizes structure and wording

### Personality Traits

Personality traits affect the Agent's interaction style. You can add multiple tags to the Agent:

| Trait | Effect |
|---|---|
| Rigorous | Answers emphasize accuracy, will mark uncertain areas |
| Concise | Answers are brief and to the point, no nonsense |
| Friendly | Tone is gentle, appropriate use of encouraging expressions |
| Decisive | Tend to give clear conclusions, avoid ambiguity |
| Cautious | Actively remind risks when involving sensitive operations |

## Greeting Settings

The greeting is the Agent's first sentence at the start of a new conversation. A good greeting should:

- Be short and natural, not overly formal
- Let the user know what this Agent can do
- Guide the user to start the conversation

For example:

> "Hello, I'm your legal advisor. Contract review, legal consultation—what can I help you with?"

:::tip Modify Persona Through Conversation
You can also directly teach the Agent to adjust its style in conversation:

> "Keep replies concise in the future, no more than three paragraphs."

> "Stop using 'First... Second... Finally'套路."

The Agent will record your preferences and apply them in subsequent conversations.
:::

## Next Steps

- [Edit Principles](./05-edit-principles.md) — Set behavioral boundaries for the Agent
- [Create Custom Agent](./03-create-agent.md) — Review the creation process
