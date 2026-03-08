---
title: Delegation Model
description: Understanding DesireCore's unique delegation interaction paradigm — evolving from "Q&A" to "I teach, you do"
keywords: [delegation, Delegation, interaction model, six primitives, teaching]
---

# Delegation Model

## Traditional Dialogue Mode vs. Delegation Interaction

Most AI products follow a **Q&A pattern**: you ask a question, AI gives an answer. It's like walking into a government service hall every time — taking a new number, waiting in a new queue, re-explaining your needs.

DesireCore uses a **Delegation pattern**: you "assign" tasks to your companion, which plans, executes, and delivers results — like delegating work to a reliable colleague.

| Dimension | Q&A Pattern | Delegation Pattern |
|-----------|-------------|-------------------|
| Interaction Essence | You ask, I answer | You teach, I do |
| Knowledge Accumulation | Start from zero each time | Gets more skilled with use |
| Execution Capability | Only outputs text | Can call tools, execute tasks |
| Quality Assurance | You judge for yourself | Has receipts, auditable |
| Applicable Scenarios | One-time questions | Repetitive, process-oriented tasks |

## Understanding Through an Internship Analogy

Imagine you've just hired an intern. Your collaboration process looks like this:

### 1. Teach — Teach (You teach them the rules)

> "When reviewing contracts, first look at payment terms and breach clauses. If the penalty exceeds 30% of the contract amount, mark it in red to alert me."

You tell the companion **how to do things**, **why to do them this way**, and **what exceptions apply**. These rules are persistently saved, and the companion will follow them for similar tasks in the future.

### 2. Demonstrate — Demonstrate (You show examples)

> "Here's a contract I reviewed last time. Look at how I annotated it."

You give the companion examples, counter-examples, and historical materials, letting it learn your working style through imitation and induction.

### 3. Clarify — Clarify (It asks follow-up questions)

> Companion: "This contract has two signing parties. Should I review them separately or treat them as related parties?"

When encountering uncertainty, the companion won't guess — it will proactively ask you to fill in key information needed for the task.

### 4. Plan — Plan (It formulates a plan)

> Companion: "I plan to complete this contract review in three steps: 1) Structure check 2) Clause risk analysis 3) Generate review report. Step 2 involves modification suggestions and requires your confirmation before execution."

The companion presents a plan, breaks down steps, and marks risk points and areas requiring your confirmation.

### 5. Execute — Execute (It carries out the task)

After you confirm the plan, the companion executes step by step. During the process, deterministic operations are done directly, operations requiring judgment are handled intelligently, and high-risk operations pause for your confirmation.

### 6. Reflect — Reflect (It delivers receipts and reviews)

> Companion: "Review complete. Found 3 high-risk clauses, 5 medium-risk clauses. Review report generated. Also, I noticed that this type of contract often has confidentiality period settings that are too short. I suggest adding confidentiality period checks next time."

The companion submits a work receipt, reviews deviations, and writes new experiences back to the "behavior manual."

## Complete Delegation Flow

```
You initiate task → Companion asks for clarification → Companion formulates plan
                                    ↓
                          You confirm/modify plan
                                    ↓
                          Companion executes task
                                    ↓
                          Companion reviews + delivers receipt
                                    ↓
                          Did it learn something new?
                            ↓           ↓
                           Yes          No
                            ↓           ↓
                      Write to memory/skill    Task complete
```

## Two Types of Conversation Intent

In DesireCore, you don't need to manually switch "modes." The companion automatically recognizes your current intent:

### Teaching Intent

When you're teaching the companion new rules, new skills, or correcting its behavior, the companion recognizes this as teaching intent. It will distill what you taught into persistent rules or skills and feedback "what was learned."

Example conversations:
- "Write all emails to me in formal tone from now on"
- "When reviewing this type of contract, pay special attention to non-compete clauses"
- "That answer just now was wrong, it should be like this..."

### Delegation Intent

When you're assigning tasks, the companion follows the six-primitive flow: ask, plan, execute, review.

Example conversations:
- "Help me review this contract"
- "Translate this requirements document into English"
- "Organize last week's meeting minutes"

## Why Delegation is More Efficient Than Q&A

1. **Knowledge Reusability**: Rules you teach once, the companion remembers forever. No need to repeat them in prompts every time
2. **Execution Traceability**: The companion doesn't just "talk," it "does." What it did, why it did it, and the results — all recorded in receipts
3. **Capability Growth**: The companion's capabilities are cumulative. Today you taught contract review, tomorrow email writing, the day after it can handle more complex integrated tasks
4. **Risk Controllability**: Through combinations of hardened steps, flexible steps, and human gates, you can precisely control the companion's autonomy

## Next Steps

- Want to understand how companions control risk? Read [Hardened/Flexible/Human Gate](./step-types)
- Want to understand the "work report" after companions finish tasks? Read [Receipt System](./receipt-system)
- Want to understand how companions get smarter? Read [Self-Evolution](./self-evolution)
