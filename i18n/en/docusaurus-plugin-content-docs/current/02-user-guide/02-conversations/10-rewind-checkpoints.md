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

## How Branching Works

Rewind creates a new execution branch from a checkpoint while preserving the existing history:

![Rewind branching diagram](/img/user-guide/conversations/rewind-branch-en.svg)

- **The old branch is preserved**: All messages and operation records from before the rewind remain in history.
- **A new branch is created**: After confirmation, the system starts a new execution path from the target checkpoint.
- **Repeated rewinds**: Each rewind creates another branch, forming a structure similar to Git branches.

```text
Timeline:
  Message 1 → Message 2 → Message 3 → Message 4 (original path)
                        ↘
                         Message 3' → Message 4' (after the first rewind)
                        ↘
                         Message 3'' → ... (after the second rewind)
```

:::tip Safety Net
Preserving old branches makes it easier to try another path. If the new path is unsatisfactory, rewind again to an earlier checkpoint or refer to content in the old branch. The external side-effect limits described above still apply.
:::
