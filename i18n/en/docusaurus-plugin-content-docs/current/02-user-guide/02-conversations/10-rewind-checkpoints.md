---
title: Rewind and Checkpoints
description: Use rewind checkpoints to restore conversation and agent working state.
keywords: [Rewind, Checkpoint, rollback, restore state]
---

# Rewind and Checkpoints

Rewind / Checkpoint lets you return to a stable point when an agent goes in the wrong direction. It can restore conversation state as well as files, media, AgentFS, memory, and skills managed by DesireCore.

## Entry Points

- Type `/rewind`
- Use the message action bar
- Open the chat header menu
- Press `Cmd + Alt + Z` on macOS or `Ctrl + Alt + Z` on Windows/Linux

## Modes

| Mode | Effect |
|------|--------|
| Conversation only | Return to before a selected user message |
| State only | Restore files, media, AgentFS, memory, or skills |
| Conversation + state | Restore both |

Before applying, DesireCore shows an impact preview. The old branch remains in history.

## Limits

Rewind restores DesireCore-managed local state. It usually cannot undo external side effects such as sent emails, pushed commits, external API calls, or third-party approvals.

