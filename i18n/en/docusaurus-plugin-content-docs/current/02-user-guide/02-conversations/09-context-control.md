---
title: Context Control
description: Use /new, /compact, and automatic compaction to manage long conversations.
keywords: [context, compaction, /new, /compact, CompactSession, long conversations]
---

# Context Control

DesireCore keeps the visible conversation history, but each model call has a finite context window. Context control lets long conversations continue without deleting the visible history.

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

