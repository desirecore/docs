---
title: How Agents Remember You
description: Learn the basic principles of DesireCore's memory system—how agents accumulate experience, remember preferences, and the difference between memory and regular chat history.
keywords: [memory system, agent memory, personalization, learning mechanism]
---

# How Agents Remember You

DesireCore saves preferences and experiences that you review as memories for later conversations. Chat history stores individual messages; memory stores information collected from conversations. As you confirm more information, agents can learn more about your preferences and background.

## Memory vs. Chat History

| | Chat history | Memory |
|---|---|---|
| Stores | Messages from the conversation | Preferences, facts, and experiences collected from conversations |
| Used to | Continue the current conversation | Retrieve information in later conversations |
| Managed | View by conversation | View, edit, pin, or delete individual entries |

Think of chat history as a recording and memory as notes collected from it.

## Where Memory Comes From

After each conversation, the system reflects on it, collects information, and creates memories for you to review:

1. **Conversation Ends** — You complete an exchange with the agent
2. **Automatic Reflection** — The agent analyzes the conversation and extracts valuable information
3. **Generate Candidate Memories** — The system generates several candidate memory entries
4. **Your Review** — You can accept, reject, or edit these entries
5. **Formal Memory** — Approved entries are written to the agent's memory bank

:::tip You're Always in Control
Agents don't secretly remember things. Every new memory goes through your review, and you can view, modify, or delete any memory at any time.
:::

## How Memory Affects Agents

Memories you accept may be retrieved in later conversations. For example, they can help with:

- **Response style**: Refer to your preference for concise or detailed answers
- **Project background**: Recall saved information about a project
- **Deadlines**: Remind you of a date you mentioned in a relevant later conversation
- **Past decisions**: Find a saved choice or conclusion

For example, if you tell a legal advisor that you are a CTO at a technology company and accept that memory, the agent can refer to it in later related conversations.

## Memory Scope in Manual Conversations

In manual multi-conversation mode, automatically injected conversation summaries and active topics belong to the current conversation. Other conversations with the same agent, even within the same project, are not treated as the current discussion. To reference another conversation, explicitly ask the agent to recall it. The original history remains available; this scope does not delete history or isolate all long-term memory.

## Three memory domains

The Three-Domain Memory Model stores information in separate scopes, much like different kinds of human memory:

- **Core memory**: the agent's built-in knowledge and rules
- **Relationship memory**: information collected from a user's interactions with one agent, like personal notes from those exchanges
- **Shared memory**: information that multiple agents can use, like a team handbook

:::info Next Step
For what each domain stores and who can access it, see [Three-Domain Memory Explained](./02-three-domains.md).
:::

## How memory is maintained

- Frequently used memories are prioritized for retrieval.
- Memories that have not been used for a long time may be compressed and archived.
- Irrelevant memories may be cleaned up.

### Pin a memory
If a memory is important, pin it to prevent automatic cleanup. You can still unpin, edit, or delete it in the memory manager.
