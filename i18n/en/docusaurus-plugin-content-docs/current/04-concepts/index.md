---
title: Concept Map
description: Overview of DesireCore core concepts and how they work together
keywords: [concepts, architecture, overview, DesireCore]
sidebar_position: 0
---

# Concept Map

DesireCore is built around the core philosophy of "cultivating and hosting digital companions," forming a complete conceptual system. These concepts are interconnected and progressive, collectively defining a new relationship between you and intelligent agents.

## Concept Relationship Diagram

```
                    ┌──────────────────────┐
                    │   Digital Companion  │ ← The starting point of everything
                    │  (Digital Companion)  │
                    └─────────┬────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
     ┌────────────┐  ┌──────────────┐  ┌───────────┐
     │Delegation  │  │  AgentFS     │  │ Compute   │
     │ Model      │  │  Filesystem  │  │ Model     │
     └──────┬─────┘  └──────┬───────┘  └───────────┘
            │               │
     ┌──────┴──────┐  ┌─────┴──────┐
     ▼             ▼  ▼            ▼
┌─────────┐ ┌──────────┐ ┌──────────┐
│Hardened/│ │ Receipt  │ │ Self-    │
│Flexible/│ │ System   │ │Evolution │
│Human Gate│ │          │ │          │
└─────────┘ └──────────┘ └──────────┘
     │             │           │
     └─────────────┼───────────┘
                   ▼
          ┌────────────────┐
          │ Three-Layer    │
          │ Controllability│
          │ Visible/       │
          │ Controllable/  │
          │ Reversible     │
          └────────────────┘
```

## Quick Navigation

| Concept | One-Sentence Explanation | When to Read |
|---------|------------------------|--------------|
| [Digital Companion](./digital-companion) | DesireCore agents are not tools, but "digital colleagues" you cultivate | Want to understand product positioning |
| [Delegation Model](./delegation-model) | From "Q&A" to "I teach, you do" | Want to understand interaction patterns |
| [AgentFS Filesystem](./agentfs) | Each agent's "home" where all capabilities and memories exist as files | Want to understand data storage |
| [Hardened/Flexible/Human Gate](./step-types) | Making agents as flexible as humans yet as controllable as software | Want to understand control mechanisms |
| [Receipt System](./receipt-system) | Agents submit "work reports" after completing tasks | Want to understand audit trails |
| [Self-Evolution](./self-evolution) | The secret to understanding you better over time | Want to understand agent growth |
| [Three-Layer Controllability](./three-layer-control) | Visible, Controllable, Reversible — you always hold the initiative | Want to understand safety guarantees |
| [Compute Model](./compute-model) | Bring your own keys, choose your own engines | Want to understand AI model configuration |

## Reading Recommendations

If you're new to DesireCore, we recommend reading in this order:

1. Start with **Digital Companion** — understand "what makes it different"
2. Then read **Delegation Model** — understand "how to use it"
3. Next read **Three-Layer Controllability** — address concerns about "can I trust it"
4. Finally, explore other concepts based on your interests

If you have a technical background, you can jump directly to **AgentFS Filesystem** and **Receipt System** — these two concepts best demonstrate DesireCore's technical innovations.
