---
title: Self-Evolution
description: Understanding how DesireCore agents continuously learn and grow through interaction
keywords: [self-evolution, Self-Evolution, learning, memory, experience accumulation]
---

# Self-Evolution

## Agents Are Not Static

Most AI products are "static" — using them 100 times is the same as using them once. Every conversation is like meeting for the first time.

DesireCore's agents are **dynamically evolving**. They learn, accumulate, and grow through every interaction with you. Like a good employee, they may know nothing on day one, but after three months can work independently.

## Three-Layer Evolution Mechanism

Agent evolution is divided into three layers:

### Layer 1: Rule Learning (What You Teach)

This is the most direct evolution method — you explicitly tell the companion how to do things.

**Trigger**: You actively teach during conversation

**Examples**:
- "When writing weekly reports for me in the future, follow this format: first what was completed this week, then next week's plan, finally problems encountered"
- "When reviewing contracts, if you find unclear intellectual property ownership, you must mark it in red as a warning"

**Output**: The companion generates a rule/skill modification proposal (diff), which takes effect after your confirmation.

### Layer 2: Experience Accumulation (Learned from Interaction)

This is implicit evolution — the companion automatically captures useful information through daily interaction with you.

**Triggers**:
- Automatically updates user profile after each conversation
- Automatically reviews and extracts experience after task completion
- Periodic capability self-check

**What the companion learns**:
- Your communication style: "User prefers concise, direct answers"
- Your professional preferences: "User cares more about financial risk than legal compliance"
- Your work habits: "User typically schedules tasks for the week on Monday mornings"
- Common problem patterns: "This type of contract often has confidentiality clause omissions"

### Layer 3: Capability Expansion (New Skills and Tools)

By installing new skill packages or connecting new tools, the companion's capability boundaries are expanded.

**Methods**:
- Install professional skill packages from the agent marketplace
- Connect new MCP tools
- Companion proactively suggests "I need to learn this capability"

## Four Evolution Modes

| Mode | Trigger Condition | Output | Requires Confirmation |
|------|-------------------|--------|---------------------|
| **Implicit Learning** | Automatically triggered after each conversation | Update user profile and relationship memory | No (low risk) |
| **Explicit Teaching** | You actively "teach" the companion | Rule/skill diff | Yes |
| **Review Evolution** | Automatic review after task completion | Experience summary, improvement suggestions | Partial (depends on risk level) |
| **Collaborative Evolution** | Multi-user/multi-agent interaction | Team consensus, best practices | Yes |

## Evolution Safety Boundaries

Free evolution sounds great, but without constraints, it could lead to companion "personality drift" or "memory pollution." Therefore, DesireCore sets strict evolution governance mechanisms.

### Untouchable Baselines

The following **cannot** be automatically overridden by evolution:

- **Core Personality** (core part of `persona.md`): The companion's basic character won't change due to evolution
- **Safety Red Lines** ("never do" in `principles.md`): Absolutely prohibited behaviors won't be relaxed
- **Permission Configuration**: Permission levels won't be automatically elevated

### Changes Reviewable

All modifications produced by evolution generate diffs, allowing you to:

- **View change content**: What was deleted, what was added — clear at a glance
- **Accept or reject**: Selectively accept partial modifications
- **Rollback**: Roll back to previous versions if not satisfied

### Risk Grading

| Risk Level | Handling Method | Example |
|------------|-----------------|---------|
| Low risk | Can be automatically applied | Update user preference memory |
| Medium risk | Requires your confirmation | Modify behavioral rules |
| High risk | Must have explicit consent | Modify skill parameters, adjust permissions |

## You Always Maintain Control

Evolution doesn't mean losing control. In DesireCore:

1. **You decide what the companion can learn** — You can define the scope of evolution
2. **You review what the companion learned** — All changes require your approval (or post-hoc review)
3. **You can undo at any time** — Unsatisfactory "learning outcomes" can be rolled back with one click
4. **You can see the evolution history** — When the companion learned what, all recorded

The purpose of evolution is to make the companion **increasingly like what you want**, not to turn it into an uncontrollable "free will entity."

## Next Steps

- Want to know where the companion's evolution results are stored? Read [AgentFS Filesystem](./agentfs)
- Want to understand how you can intervene at any time? Read [Three-Layer Controllability](./three-layer-control)
