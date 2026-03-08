---
title: Execution Monitoring
description: Learn how to monitor progress while the agent executes tasks, understand the difference between deterministic and adaptive steps, and how to pause and resume execution.
keywords: [execution, monitoring, deterministic step, adaptive step, pause, resume, progress]
---

# Execution Monitoring

After confirming the plan, the agent begins executing the task. You can monitor the progress of each step in real time and intervene at any time when needed.

## Real-Time Display of Execution Process

When a task is executing, you will see a real-time updated progress panel:

```
┌──────────────────────────────────────────────────────┐
│  🔄 Executing: Review procurement contract            │
├──────────────────────────────────────────────────────┤
│                                                        │
│  ✅ Step 1/6  Parse contract file          Done (0.8s) │
│  ✅ Step 2/6  Check penalty percentage     Done (0.2s) │
│     └─ Result: 15%, meets standard (≤20%)            │
│  ✅ Step 3/6  Check payment terms          Done (0.2s) │
│     └─ Result: ⚠️ 15 days, below standard (≥30 days) │
│  🔄 Step 4/6  Analyze imported equipment clauses  In progress... │
│     └─ Analyzing clauses 12-15...                    │
│  ⏳ Step 5/6  Comprehensive risk assessment  Waiting │
│  ⏳ Step 6/6  Wait for confirmation before sending  Waiting │
│                                                        │
│  Total progress: ━━━━━━━━━━━━░░░░░░░░  60%            │
│  Time elapsed: 1 min 15 sec | Est. remaining: 1-2 min │
│                                                        │
│  ┌──────────┐  ┌──────────┐                            │
│  │  ⏸ Pause  │  │  ⏹ Stop  │                            │
│  └──────────┘  └──────────┘                            │
│                                                        │
└──────────────────────────────────────────────────────┘
```

### Step Status Indicators

| Status | Icon | Meaning |
|--------|------|---------|
| Completed | ✅ | Step executed successfully |
| In Progress | 🔄 | Currently processing |
| Waiting | ⏳ | Queued for execution |
| Needs Confirmation | 🚪 | Human Gate, waiting for your confirmation |
| Warning | ⚠️ | Execution successful but problem found |
| Failed | ❌ | Execution failed |

## Deterministic Steps vs. Adaptive Steps

This is one of DesireCore's core designs—each execution step is clearly categorized so you know which results are certain and which contain AI judgment.

### Deterministic Step

- **Characteristics**: Clear rules, certain results
- **Execution Method**: Executed precisely like a program
- **Predictability**: Execute 100 times, 100 times same result
- **Examples**: Check if value exceeds threshold, extract specific fields, format conversion

```
⚙️ [Deterministic] Check penalty percentage
  Rule: Penalty ≤ 20% → Compliant
  Input: Contract clause 8, penalty = 15%
  Result: ✅ Compliant (15% ≤ 20%)
```

### Adaptive Step

- **Characteristics**: Requires AI understanding and judgment
- **Execution Method**: Based on contextual reasoning
- **Predictability**: Different inputs may have different reasoning paths
- **Examples**: Analyze contract semantics, assess comprehensive risk, generate reports

```
🧠 [Adaptive] Analyze imported equipment clauses
  Basis: Contract clauses 12-15 content
  Reasoning process:
    - Clause 12 mentions "imported equipment" but doesn't specify country of origin
    - Clause 13 has installation acceptance terms but doesn't mention Chinese instruction manual
    - According to learned rules: imported equipment must have Chinese instruction manual clause
  Result: ⚠️ Missing Chinese instruction manual clause, suggest adding
```

:::info Why is the Distinction Important?
You can fully trust the results of deterministic steps—they're executed according to rules. Adaptive step results require more attention—AI judgment may have deviations. Knowing which steps are adaptive tells you which results need careful checking.
:::

## Pausing and Resuming Execution

### Pausing Execution

At any time, you can pause a task being executed:

```
[Click ⏸ Pause]

Agent: "Task paused.
        Current progress: Step 4/6 (Analyze imported equipment clauses)
        Completed steps are unaffected.

        You can:
        ▶️ Continue execution
        🔄 Retry current step
        ⏭️ Skip current step
        ⏪ Roll back to a step and restart
        ⏹️ Terminate task"
```

### Resuming Execution

After pausing, you have multiple resume options:

| Option | Behavior | Applicable Scenario |
|--------|----------|---------------------|
| **Continue** | Continue from pause point | Temporarily needed to handle other things |
| **Retry Current Step** | Re-execute current step | Temporary error in current step |
| **Skip Current Step** | Jump to next step | Current step unimportant or handled manually |
| **Roll Back** | Roll back to previous step | Found problems with previous steps |
| **Terminate** | End task | No longer need to execute this task |

## Exception Handling During Execution

When the agent encounters problems, it takes different handling approaches based on the situation:

### Automatic Retry

For temporary errors like network timeouts, the agent automatically retries:

```
⚠️ Step 4 execution failed: File read timeout
   Retrying automatically... (1/3)
   ✅ Retry successful
```

### Proactive Reporting

For problems it cannot solve on its own, the agent proactively tells you:

```
Agent: "Step 4 encountered a problem:

        ⚠️ Contract file clause 13 references an attachment (Attachment C: Equipment Specification),
        but I didn't find this attachment.

        Please choose:
        1. Provide Attachment C file
        2. Skip this step, mark 'missing Attachment C' in report
        3. Pause task, I'll handle it later"
```

### Inserting New Instructions During Execution

You can supplement instructions to the agent at any time during execution:

```
You: "Wait, clause 12's confidentiality period also needs special attention,
    if it exceeds 5 years mark it as a risk."

Agent: "Received, I will add confidentiality period check in subsequent steps.
        Current step unaffected, will incorporate in step 5 (comprehensive assessment)."
```

:::info Next Step
During execution, certain high-risk operations will trigger "Human Gate" confirmation. Go to [Human Gate Confirmation Mechanism](./04-human-gate.md) for details.
:::
