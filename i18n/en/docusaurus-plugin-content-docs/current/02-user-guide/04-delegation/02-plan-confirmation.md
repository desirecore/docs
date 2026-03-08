---
title: Plan Confirmation
description: Learn how the agent creates execution plans, what information is included in plans, and how to review and modify plans.
keywords: [plan, Plan, confirmation, review, steps, execution plan]
---

# Plan Confirmation

When you assign a task, the agent won't start executing immediately—it will first create a plan and wait for your review and confirmation before proceeding.

## Why Plan Confirmation is Needed

In reality, you wouldn't let a new colleague start working immediately either. Good practice is: first have them explain what they plan to do, and only let them proceed when you think it's okay.

The benefits are:
- **Discover misunderstandings**: The agent may have misunderstood your intent
- **Fill gaps**: The agent may have missed an important step
- **Adjust strategy**: You may have a better execution approach
- **Set boundaries**: Mark in advance which steps need your confirmation

## What the Plan Contains

The plan created by the agent typically includes the following information:

```
┌──────────────────────────────────────────────────────┐
│  📋 Execution Plan                                     │
├──────────────────────────────────────────────────────┤
│                                                        │
│  Task: Review procurement contract XX-2025-001        │
│  Estimated steps: 6                                   │
│  Estimated time: About 3-5 minutes                    │
│                                                        │
│  Step list:                                           │
│                                                        │
│  1. ⚙️ [Deterministic] Parse contract file, extract key clauses │
│     Estimated time: 30 seconds                        │
│                                                        │
│  2. ⚙️ [Deterministic] Check penalty percentage (standard: ≤20%) │
│     Estimated time: 10 seconds                        │
│                                                        │
│  3. ⚙️ [Deterministic] Check payment terms (standard: ≥30 days) │
│     Estimated time: 10 seconds                        │
│                                                        │
│  4. 🧠 [Adaptive] Analyze imported equipment related clauses │
│     Estimated time: 1-2 minutes                       │
│     Note: Requires AI understanding of contract semantics │
│                                                        │
│  5. 🧠 [Adaptive] Comprehensive risk assessment, generate review report │
│     Estimated time: 1-2 minutes                       │
│                                                        │
│  6. 🚪 [Human Gate] Wait for confirmation before sending review report │
│     Note: Requires your confirmation of report content before sending │
│                                                        │
│  Risk warnings:                                       │
│  - Contract is a scanned document, OCR recognition may have errors │
│  - Imported equipment clauses require manual review   │
│                                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │  ✓ Confirm │  │  ✎ Modify │  │  ✗ Cancel  │            │
│  └──────────┘  └──────────┘  └──────────┘            │
│                                                        │
└──────────────────────────────────────────────────────┘
```

### Step Type Explanation

| Icon | Type | Meaning |
|------|------|---------|
| ⚙️ | **Deterministic Step** | Steps with clear rules and certain results, executed like a program |
| 🧠 | **Adaptive Step** | Steps requiring AI understanding and judgment, results may vary by situation |
| 🚪 | **Human Gate** | Pause when executing to this step, waiting for your confirmation |

## How to Review the Plan

When reviewing the plan, focus on the following points:

### 1. Are Steps Complete?

See if any important steps are missing. For example, if you taught "imported equipment must have Chinese instruction manual clause checked," is this step included in the plan?

### 2. Are Step Types Reasonable?

- Steps with clear rules should be "deterministic"
- Steps requiring understanding and judgment should be "adaptive"
- High-risk operations should have "human gates"

### 3. Are Risk Warnings in Place?

The agent will proactively mark possible risks. If you think there are other risks, you can add them.

### 4. Human Gate Settings

Confirm which steps need your intermediate confirmation. Too many will affect efficiency, too few may pose risks.

## Modifying the Plan

If the plan needs adjustment, you can simply say:

```
You: "The plan is basically fine, but make two changes:
    1. Change step 4 to deterministic step—the rules for checking imported equipment clauses were already
       taught before, just check according to the rules
    2. Add a step between step 5 and step 6: save the report as a
       draft first, don't send it directly"
```

The agent will update the plan and show it to you again for confirmation:

```
Agent: "Plan updated. Changes as follows:

        Step 4: 🧠 [Adaptive] → ⚙️ [Deterministic] Check imported equipment clauses according to existing rules
        New Step 6: ⚙️ [Deterministic] Save review report draft

        Confirm execution according to updated plan?"
```

## Quick Confirmation

For simple tasks or tasks you're already familiar with, you can skip detailed review:

```
You: "The plan is fine, start directly."
```

Or for low-risk routine tasks, you can inform the agent in advance that plan confirmation isn't needed:

```
You: "Help me review this contract, no need to confirm the plan with me, just follow the previous process."
```

:::warning Recommended to Confirm Plan for First-Time Execution of New Task Types
Even if you trust the agent, it's recommended to take a look at the plan when executing a new type of task for the first time. After confirming it truly understands your requirements, you can confidently skip it next time.
:::

:::info Next Step
After confirming the plan, the agent begins execution. Go to [Execution Monitoring](./03-execution-monitoring.md) to learn how to monitor the execution process.
:::
