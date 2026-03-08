---
title: Three-Layer Controllability
description: Understanding DesireCore's three-layer safety guarantee of Visible, Controllable, and Reversible
keywords: [controllability, visible, controllable, reversible, Visible, Controllable, Reversible, safety]
---

# Three-Layer Controllability

## Core Question: Can I Trust AI

The biggest obstacle to letting AI help you isn't "can it do it," but "do I dare let it do it."

- "Is it doing something behind my back that I don't know about?"
- "What if it makes a mistake?"
- "If it messes up, can it be fixed?"

DesireCore answers these questions through the **Three-Layer Controllability** model, letting you enjoy AI efficiency while always maintaining initiative.

## Three-Layer Controllability Model

```
          ┌───────────────┐
          │  L3: Reversible│  ← Can fix mistakes
          │  Reversible   │
          └───────┬───────┘
        ┌─────────┴─────────┐
        │    L2: Controllable│  ← Can decide what it does
        │    Controllable   │
        └─────────┬─────────┘
    ┌─────────────┴─────────────┐
    │       L1: Visible          │  ← Can see what it's doing
    │       Visible             │
    └───────────────────────────┘
```

### L1: Visible — "I Can See What It's Doing"

**Core Meaning**: All agent behavior is completely transparent to you.

**Specific Manifestations**:

- **Real-time status visible**: What the companion is doing, how it's progressing — you can see anytime
- **Decision process visible**: Why the companion made this decision, what rules it followed, what memories it referenced
- **Modification content visible**: Every file modification by the companion is shown as diff (red for deletion, green for addition)
- **Tool calls visible**: Which tools the companion used, what parameters were input, what results were obtained

**Analogy**: Like an employee working with the door open — you can walk by anytime to see what they're doing.

### L2: Controllable — "I Can Decide What It Can Do"

**Core Meaning**: You can intervene, confirm, or block agent behavior at any time.

**Specific Manifestations**:

- **Permission grading**: Different operations have different permission requirements
  - `allow`: Automatically allowed (low-risk operations)
  - `ask`: Ask every time (default mode, sensitive operations)
  - `deny`: Automatically denied (prohibited operations)
- **Real-time interruption**: You can pause or terminate executing tasks at any time
- **Human Gate**: High-risk steps automatically pause, waiting for your confirmation
- **Configurable rules**: "Allow it to read files, but ask me before writing files"

**Analogy**: Like giving employees different levels of access cards — some places they can freely enter, some places require you to swipe the card.

### L3: Reversible — "If It Does Wrong, I Can Change It Back"

**Core Meaning**: Any operation can be undone or rolled back.

**Specific Manifestations**:

- **Step-by-step rollback**: Undo single modifications (Patch level)
- **Turn-level rollback**: Return to state before a certain conversation turn (Turn level)
- **Session rollback**: Return to state before the entire session began (Session level)
- **Version snapshot**: Can return to any historical version of the agent at any time

**Analogy**: Like a document's "undo" function, but covering all agent behavior — not just undoing text modifications, but undoing operations, undoing learning, undoing memories.

## Why These Three Layers Are So Important

These three layers form a **trust ladder**:

```
Visible → Understand behavior → Establish preliminary trust
  ↓
Controllable → Set boundaries → Trust further enhanced
  ↓
Reversible → Eliminate worries → Complete trust
  ↓
Dare to delegate more tasks → Gain greater value
```

All three layers are indispensable:

- Only visible but not controllable? Can see but can't manage, equals forced旁观
- Only controllable but not reversible? Can manage but can't recover, mistake cost too high
- Only reversible but not visible? Can recover but can't see, don't know when to recover

## Comparison with Other AI Products

| Controllability Dimension | Traditional Chat AI | Low-code/RPA | DesireCore |
|---------------------------|---------------------|--------------|------------|
| Behavior Visibility | Only see output | See flowchart | See every step in real-time |
| Permission Control | None | Fixed flow | Flexible grading |
| Real-time Interruption | Can only stop generation | Can pause flow | Interrupt any operation anytime |
| Rollback Capability | None | Re-run flow | Step-by-step/turn-level/session-level rollback |
| Decision Transparency | Black box | See rules | See rules + AI decision basis |

## Controllability in Practice

In daily use, three-layer controllability manifests as:

1. **Confirmation dialogs**: When the companion wants to do sensitive operations, a confirmation box pops up telling you the operation content, risk level, and impact scope
2. **Diff preview**: Before the companion modifies files, it shows the diff first — you review item by item before applying
3. **Receipt system**: Every task has complete records, checkable anytime
4. **Version history**: Every change to the agent is traceable and rollback-capable

## Next Steps

- Want to understand specific step types? Read [Hardened/Flexible/Human Gate](./step-types)
- Want to understand task audit records? Read [Receipt System](./receipt-system)
