---
title: Auto-Learning and Forgetting
description: Learn how agents automatically learn from conversations, the memory forgetting mechanism, weight system, and how to control learning behavior.
keywords: [auto-learning, forgetting mechanism, memory weight, foresight signals, user profile]
---

# Auto-Learning and Forgetting

DesireCore's memory system doesn't just remember—it also automatically learns and appropriately forgets, just like the human brain, retaining important experiences while letting outdated details naturally fade.

## How Agents Automatically Learn

### Conversation Reflection

Agent learning occurs during the **Reflect** phase after each conversation ends. The system automatically analyzes conversation content and identifies the following valuable information:

- Preferences you express ("I prefer concise reports")
- Important facts ("Our company has 200 employees")
- Key decisions ("We decided to rewrite the backend in TypeScript")
- Commitments and agreements ("Submit the proposal before next Wednesday")
- Milestone events ("Product v3.0 officially launched")
- Lessons learned ("Last deployment failed because we didn't test the rollback script")

### Foresight Signals

In addition to retrospective learning, agents also capture **Foresight Signals** from conversations—events that need attention in the future:

| Signal Type | Description | Example |
|-------------|-------------|---------|
| **deadline** | Deadline | "Contract expires on March 15" |
| **followup** | Follow-up item | "Need to confirm technical solution next week" |
| **reminder** | General reminder | "Client visit on Tuesday" |
| **risk** | Risk warning | "Supplier may delay delivery" |
| **opportunity** | Opportunity lead | "Client mentioned new cooperation intention" |

When the corresponding time approaches, the agent will proactively remind you—naturally integrated into the conversation, rather than mechanically listing items.

:::tip Control Reminders
If a foresight signal isn't important to you, you can click "Ignore" to dismiss it, and the agent won't remind you about this matter again.
:::

## Forgetting Mechanism

### Why Forgetting is Needed

If agents remembered everything forever, problems would quickly arise:

- **Information Overload**: Too many memories slow down retrieval and worsen results
- **Outdated Information Interference**: Technical decisions from three months ago may have been overturned
- **Storage Bloat**: Unlimited memory growth consumes significant space

Therefore, DesireCore designed a natural forgetting mechanism that mimics the human brain.

### Memory Lifecycle

Each memory goes through the following stages:

```
Active → Recent → Archived → Compressed → Pruned
```

| Stage | Description | What You Can See |
|-------|-------------|------------------|
| **Active** | Memories related to current topics | Full content |
| **Recent** | Recently used memories | Summary visible |
| **Archived** | Memories not used for a while | Only visible through active search |
| **Compressed** | Already compressed memories | Only key summary retained |
| **Pruned** | Physically deleted | Only recoverable from version history |

### When Forgetting Occurs

Forgetting doesn't happen arbitrarily. The system triggers memory compression in three situations:

1. **Storage Over Budget** — Total memory exceeds the set limit
2. **Memory Too Old** — A memory hasn't been referenced for a long time, and there are enough similar memories
3. **Manual Organization** — You actively click the "Organize Memory" button

### Never-Forget Protection

The following memories are protected and won't be automatically forgotten:

- Memories you manually **Pin**
- High-confidence objective facts
- Relationship milestone events
- Memories retrieved within the last 30 days (temporary protection)
- High-severity lessons learned (automatically protected for 1 year)

## Memory Weights

Each memory has an **importance weight** that affects its priority for retrieval and retention:

| Memory Type | Base Weight | Description |
|-------------|-------------|-------------|
| milestone | 0.9 | Milestone events are most important |
| decision | 0.8 | Key decisions aren't easily forgotten |
| commitment | 0.7 | Commitments and agreements need to be kept |
| lesson | 0.7 | Lessons learned have long-term value |
| preference | 0.6 | Preference habits continuously affect behavior |
| fact | 0.5 | General facts may become outdated |

Weights dynamically adjust over time and with usage frequency—frequently referenced memories see their weights increase, while long-unused memories see their weights decrease.

## User Profile

On top of memory, the system also maintains a **User Profile**—a comprehensive cognition automatically extracted and evolved from all your interactions:

- **Explicit Information**: Profession, field, preferences you actively share
- **Implicit Traits**: Communication style, decision patterns inferred by the system
- **Preference Records**: Code style, document format, feedback methods

The user profile automatically updates after a certain number of topics, with new interaction experiences incrementally merged into the existing profile.

## Controlling Learning Behavior

You can control agent learning through the following methods:

| What You Want to Do | How to Operate |
|---------------------|----------------|
| Prevent a memory from being recorded | Click "Reject" during memory review |
| Delete an already recorded memory | Find and delete it in memory management |
| Protect important memories from being forgotten | Mark the memory as "Pin" |
| Manually trigger memory organization | Click "Organize Memory" in memory management |
| Restore memories from archive | Search archived memories and click "Restore" |

:::warning Memory and Privacy
Agents only remember information relevant to their function. You can review and delete any memory at any time. Memory data is stored on your local device and won't be uploaded to the cloud.
:::
