---
title: Execution Receipts
description: Learn about the agent's execution receipt mechanism—what receipts are, what information they contain, how to view and interpret them, and how to roll back through receipts.
keywords: [receipt, Receipt, audit, rollback, execution record, traceability]
---

# Execution Receipts

Receipts are one of DesireCore's core mechanisms—after each agent operation, a complete execution record is automatically generated. It's the "receipt" for your delegated tasks.

## What Are Receipts

A receipt is a detailed "work report" recording what the agent did in a task, why it did it, what tools it used, and what the results were.

You can analogize it to:
- Bank transaction receipts
- Courier delivery receipts
- Code commit records

**With receipts, delegation is trustworthy.** Delegation without receipts is like giving money to someone without getting a receipt—you don't know where the money was spent.

## What Receipts Contain

A complete receipt contains the following:

### Basic Information

```
┌──────────────────────────────────────────────────────┐
│  📋 Execution Receipt                                  │
├──────────────────────────────────────────────────────┤
│                                                        │
│  Receipt ID: RCPT-20250315-143022                     │
│  Task: Review procurement contract XX-2025-001        │
│  Execution time: 2025-03-15 14:30 - 14:35             │
│  Total time: 5 min 12 sec                             │
│  Status: ✅ Completed                                  │
│                                                        │
└──────────────────────────────────────────────────────┘
```

### Input and Output Summary

```
│  📥 Input                                              │
│  User instruction: "Help me review the procurement contract in the attachment" │
│  Attachment: XX Technology Procurement Contract.pdf (128KB) │
│                                                        │
│  📤 Output                                             │
│  Review report saved to: docs/review-report-XX-2025-001.md │
│  Found 2 risks, 4 compliant items                     │
│  Comprehensive risk level: Medium                     │
```

### Step Execution Details

```
│  📝 Execution Steps                                    │
│                                                        │
│  1. ⚙️ [Deterministic] Parse contract file        ✅ 0.8s    │
│  2. ⚙️ [Deterministic] Check penalty percentage   ✅ 0.2s    │
│     └─ 15% ≤ 20% → Compliant                          │
│  3. ⚙️ [Deterministic] Check payment terms        ⚠️ 0.2s    │
│     └─ 15 days < 30 days → Risk                       │
│  4. 🧠 [Adaptive] Analyze imported equipment clauses ⚠️ 1.5min │
│     └─ Missing Chinese instruction manual clause      │
│  5. 🧠 [Adaptive] Comprehensive risk assessment   ✅ 1.2min  │
│  6. 🚪 [Human Gate] Save report after confirmation ✅ 3.5s   │
│     └─ User confirmation: Approved                    │
```

### Basis Traceability

```
│  📚 Basis                                              │
│                                                        │
│  Rules referenced:                                     │
│  - Penalty standard (≤20%) — from March 1 teaching    │
│  - Payment terms standard (≥30 days) — from March 1 teaching │
│  - Imported equipment Chinese instruction manual — from March 5 teaching │
│                                                        │
│  Examples referenced:                                  │
│  - Review report template — from March 2 teaching     │
```

### Change Records

```
│  📂 File Changes                                       │
│                                                        │
│  New file: docs/review-report-XX-2025-001.md          │
│  Change size: 2.1KB                                   │
│  [View file content]                                   │
```

## How to View Receipts

### View in Conversation

After task completion, the agent displays a receipt summary in the conversation. You can click to expand and view complete information.

### View Historical Receipts

```
You: "Show the last 5 receipts."

Agent: "Recent execution receipts:

        1. RCPT-20250315-143022  Review procurement contract     ✅ Complete
        2. RCPT-20250315-140055  Write meeting minutes           ✅ Complete
        3. RCPT-20250314-163200  Organize weekly report data     ✅ Complete
        4. RCPT-20250314-100830  Translate technical document    ✅ Complete
        5. RCPT-20250313-153045  Send client email               ✅ Complete

        Click receipt ID to view details."
```

### Search Receipts

```
You: "Find all receipts about contract review from last week."
```

## How to Interpret Receipts

Focus on the following aspects:

| Focus Point | Why It's Important |
|-------------|-------------------|
| **Step type distribution** | Many deterministic steps indicate high rule-based task structure, many adaptive steps indicate high AI judgment component |
| **Human Gate trigger count** | Too many triggers may indicate overly strict permission configuration, too few may indicate security risks |
| **Warnings and risk items** | Content needing careful checking |
| **Basis traceability** | Confirm whether the agent made judgments based on correct rules |
| **Execution time** | Abnormally long execution may indicate task complexity exceeded expectations |

## Rolling Back Through Receipts

If you're unsatisfied with execution results, you can roll back based on receipts. DesireCore supports multiple granularity rollbacks:

| Rollback Level | Meaning | Applicable Scenario |
|----------------|---------|---------------------|
| **Single-step rollback** | Undo result of a specific step | Result of a specific step is wrong, other steps are fine |
| **Round rollback** | Undo all operations of the most recent conversation round | Unsatisfied with entire task result |
| **Session rollback** | Restore to state at session start | All operations in the session need to be redone |
| **Version rollback** | Restore to any historical version | Need to return to an earlier state |

```
You: "Roll back the result of step 4 of this contract review."

Agent: "Will undo the result of step 4 (analyze imported equipment clauses).
        Specific changes:
        - Import equipment related analysis content will be removed from review report
        - Comprehensive risk assessment will be recalculated

        Confirm rollback?"
```

:::tip Check Receipts Before Rolling Back
Before deciding to roll back, carefully review the step details and basis traceability in the receipt. Sometimes the problem isn't with execution but with rules—in this case, modifying rules is more effective than rolling back.
:::

:::info Next Step
When you have multiple agents, they can collaborate to complete complex tasks. Go to [Cross-Agent Collaboration](./06-cross-agent.md) to learn about multi-agent collaboration mechanisms.
:::
