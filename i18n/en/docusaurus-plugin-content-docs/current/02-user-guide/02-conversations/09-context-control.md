---
title: Context Control
description: Use /new, /compact, and automatic compaction to manage long conversations.
keywords: [context, compaction, /new, /compact, CompactSession, long conversations]
---

# Context Control

DesireCore keeps the visible conversation history, but each model call has a finite context window. Context control lets long conversations continue without deleting the visible history.

![Context lifecycle diagram](/img/user-guide/conversations/context-lifecycle-en.svg)

## `/new`

`/new` creates a new context boundary in the same conversation.

- Visible history remains available
- Future model calls stop automatically reading the full content before the boundary
- Useful when switching topics or starting a fresh task

## `/compact`

`/compact` summarizes older messages and uses that summary as part of future context.

- Original history remains visible
- The model mainly reads the summary plus recent turns
- Useful for long tasks, writing sessions, and multi-step reviews

## Automatic Compaction

When a conversation approaches the model's context limit, DesireCore can compact old context automatically. This prevents sudden failures while retaining goals, decisions, completed steps, and open tasks.

## CompactSession

Some agents can call `CompactSession` themselves when they detect a long-running task. It keeps the UI history intact and only changes what future model calls read.

## Practical Recommendations

| Scenario | Recommended Action | Reason |
|----------|--------------------|--------|
| Switching topics, such as from coding to the weather | `/new` | Prevent old task context from interfering with the new topic |
| Working on a long task, such as writing a 20-page document | `/compact` | Free up context space while retaining a task summary |
| The conversation is long but still about the same task | Wait for automatic compaction | The system compacts context at an appropriate time |
| The agent went in the wrong direction and you want to try again | Rewind | Return to a checkpoint before the mistake |
| You no longer need the conversation at all | Clear chat history | Irreversible; use with care |

:::info Choosing Between `/new` and `/compact`
- **`/new`**: Breaks the context connection with earlier content. Use it when the next topic is unrelated to the previous discussion.
- **`/compact`**: Keeps a summary of earlier content. Use it when you are continuing the same task but the conversation has become too long.

If you are unsure, prefer `/compact`: it preserves the task context in a summary.
:::

:::tip Memory Is Unaffected by Compaction
A Companion's long-term memory (knowledge acquired through teaching or automatic learning) is stored in AgentFS and is unaffected by context compaction. Learned rules and preferences remain in effect after `/new` or `/compact`.
:::
