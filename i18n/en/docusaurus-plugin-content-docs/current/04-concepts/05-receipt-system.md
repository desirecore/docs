---
title: Receipt System
description: Understanding DesireCore's receipt mechanism — every task has a complete "work report"
keywords: [receipt, Receipt, audit, trace, rollback, transparency]
---

# Receipt System

## What is a Receipt

Imagine you hand a package to a courier. From sending to signing, every step has a logistics record: pickup, transport, arrival, delivery, signing. You can check at any time where the package is, whose hands it passed through.

DesireCore's **Receipt** is the agent's "logistics record." Every time a companion completes a task, it generates a detailed receipt recording the entire process of that task.

## Why Receipts are Needed

Delegation without receipts is like handing something to someone and then completely losing contact:

- "What did it do?" — Don't know
- "Why did it do this?" — Don't know
- "Did it do it correctly?" — Don't know
- "Can it be changed back?" — Don't know

With receipts, all these questions have answers. Receipts make **delegation trustworthy**, which is why we say "without receipts, delegation cannot scale."

## Information Contained in Receipts

A complete receipt includes the following:

### Basic Information

| Field | Description | Analogy |
|-------|-------------|---------|
| Receipt ID | Unique identifier | Tracking number |
| Version Snapshot | Bound Git Commit | "Snapshot" at that time |
| Session Info | Which user, which companion, which session | Sender/recipient info |

### Task Summary

| Field | Description |
|-------|-------------|
| Input Summary | What you asked the companion to do |
| Output Summary | What result the companion produced |
| Completion Status | Successfully completed / Rejected / Modified / Needs escalation |
| User Modification Count | How many adjustments you made to the result |

### Tool Call List

Records which tools the companion used, what inputs were given, what outputs were produced, how long it took, and whether it went through your confirmation.

### Retrieval Trail

Records what the companion searched for in memory and knowledge bases, what content was matched. This is particularly useful for understanding "why the companion did this."

### Step Type Statistics

Statistics on how many hardened steps, flexible steps, and human gates were in this task. Helps you understand the companion's autonomy level.

### Memory/Skill Patches

If this task taught the companion something new, the receipt records the specific diff — what was changed and why.

### Risk and Rollback

Marks risk levels and provides rollback points, allowing you to quickly recover when problems occur.

## Uses of Receipts

### 1. Post-hoc Auditing

"How was that contract reviewed yesterday?" — Open the receipt, every operation is crystal clear.

### 2. Problem Troubleshooting

"Why is the tone of this email off?" — Check the retrieval trail and flexible step decision process in the receipt to find the root cause.

### 3. One-Click Rollback

"Not satisfied with this modification, restore the original version." — The receipt contains precise rollback points.

### 4. Efficiency Analysis

Through time data in receipts, you can quantify how much time the companion saved you:

```
Estimated time to do yourself: 30 minutes
Actual intervention time: 2 minutes
Companion execution time: 45 seconds
Time saved: 28 minutes
```

### 5. Continuous Improvement

Receipt data accumulates over time, allowing analysis of the companion's performance trends: Is the rework rate decreasing? Is the automatic completion rate increasing? Which types of tasks still need more training?

## Immutable Audit Log

Once generated, receipts cannot be modified. This is like blockchain's immutability:

- Each receipt has a unique ID and timestamp
- Receipts are bound to Git Commits, ensuring traceability
- All receipts are archived chronologically, forming a complete audit log

This means you can backtrack to any operation at any time, viewing the complete context at that moment.

## The Relationship Between Receipts and Trust

The receipt system is a key mechanism for building user trust in intelligent agents:

```
With receipts → Behavior transparent → Can verify → Build trust → Dare to delegate more tasks
Without receipts → Behavior black box → Cannot verify → Lack trust → Only dare simple tasks
```

As trust builds, you can gradually放开 the companion's permissions, letting it handle increasingly complex tasks — because you know everything is receipt-documented.

## Next Steps

- Want to understand the overall trust-building framework? Read [Three-Layer Controllability](./three-layer-control)
- Want to understand how companions continuously improve through receipts? Read [Self-Evolution](./self-evolution)
