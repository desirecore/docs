---
title: Hardened/Flexible/Human Gate
description: Understanding DesireCore's three step types — the core mechanism for making agents both flexible and controllable
keywords: [hardened step, flexible step, human gate, Hardened, Flexible, Human Gate, controllability]
---

# Hardened/Flexible/Human Gate

## Why Step Classification is Needed

Imagine: you ask AI to "process this month's expense reimbursements." In this task, some steps are deterministic (calculating amounts), some require AI judgment (categorizing expense items), and some must be decided by you (reimbursements over 5,000 yuan require approval).

Without distinguishing these steps, either you wouldn't dare delegate the task to AI (what if it makes decisions on its own?), or you'd have to watch the whole time (in which case you might as well do it yourself).

DesireCore solves this trust problem by explicitly categorizing each step of a task into one of three types.

## Three Step Types

### Hardened Step

**Deterministic execution like an assembly line.**

Hardened steps are completely deterministic operations: given an input, the output is uniquely determined. Like a machine on a factory assembly line, operating according to fixed rules with no "creative execution."

**Characteristics**:
- Based on rules, decision trees, fixed templates, or fixed API calls
- Results are completely predictable and repeatable
- No AI reasoning or judgment involved

**Examples**:
- Calculating reimbursement amounts (mathematical operations)
- Formatting documents according to templates (fixed templates)
- Querying records in a database (fixed queries)
- Sending notifications in standard formats (fixed content)

### Flexible Step

**The agent has room for autonomous judgment.**

Flexible steps require AI model reasoning, generation, or induction capabilities. Like an experienced employee, applying their judgment within guidelines to handle problems.

**Characteristics**:
- Involves AI/LLM reasoning, text generation, information induction
- Results may vary depending on context
- Autonomous operation within the framework of behavioral guidelines

**Examples**:
- Analyzing risky clauses in contracts (requires understanding and judgment)
- Writing email replies (requires text generation)
- Summarizing meeting points (requires information extraction)
- Deciding task priority sorting (requires comprehensive judgment)

### Human Gate

**Requires your personal confirmation to proceed.**

A Human Gate is a "safety door" — the task pauses at this step, waiting for your explicit instruction. Like important documents requiring a manager's signature, certain operations must be approved by a human.

**Characteristics**:
- Automatically pauses when execution reaches this step
- Requires user confirmation, issuance, or supplementary information
- Trigger conditions can be customized

**Examples**:
- Confirming content before sending emails (external communication)
- Payment operations exceeding amount thresholds (financial risk)
- Deleting or modifying important files (data security)
- Publishing content externally (brand risk)

## Comparison Table of Three Step Types

| Dimension | Hardened Step | Flexible Step | Human Gate |
|-----------|--------------|---------------|------------|
| **Executor** | Rules/Code | AI Model | Human |
| **Determinism** | Completely deterministic | Has flexibility | Depends on human judgment |
| **Speed** | Fastest | Relatively fast | Depends on human response |
| **Risk** | Extremely low | Controllable | Human-guarded |
| **Analogy** | Assembly line worker | Experienced employee | Node requiring approval |
| **Applicable Scenarios** | Operations with clear rules | Requires understanding and judgment | High-risk or sensitive operations |

## When to Use Which Step Type

### Scenarios Suitable for Hardened Steps

- Calculations with clear formulas or rules
- Data format conversion
- Template filling
- Status checks and conditional judgments

### Scenarios Suitable for Flexible Steps

- Text understanding and generation
- Information extraction and induction
- Multi-factor comprehensive judgment
- Creative work

### Scenarios Suitable for Human Gates

- Operations involving money
- External communication (emails, messages)
- Deletion or irreversible operations
- Involving privacy or sensitive information
- First-time execution of a new type of task

## Practical Operation Example

Taking "Help me review this contract" as an example:

| Step | Type | Description |
|------|------|-------------|
| 1. Parse contract format | Hardened | Extract contract section structure |
| 2. Identify key clauses | Flexible | AI understands clause meanings and marks risks |
| 3. Calculate penalty ratio | Hardened | Calculate according to formula, compare with threshold |
| 4. Write review comments | Flexible | AI generates professional review report |
| 5. Confirm whether to send to client | Human Gate | Manual confirmation before external sending |

You can see the type label for each step in the receipt, clearly knowing which were completed autonomously by AI and which were confirmed by you.

## Next Steps

- Want to understand the "work report" after companions finish? Read [Receipt System](./receipt-system)
- Want to understand overall safety guarantees? Read [Three-Layer Controllability](./three-layer-control)
