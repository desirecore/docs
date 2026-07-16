---
title: Execution Monitoring
description: Learn how to monitor progress while the agent executes tasks, understand the difference between deterministic and adaptive steps, and how the task list makes every step transparent.
keywords: [execution, monitoring, deterministic step, adaptive step, pause, resume, progress, task list]
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
| Pending | 🔹 | Task created but not started |
| Waiting | ⏳ | Queued (waiting on a dependency or an earlier step to finish) |
| In Progress | 🔄 | Currently processing |
| Completed | ✅ | Step executed successfully |
| Needs Confirmation | 🚪 | Human Gate, waiting for your confirmation |
| Warning | ⚠️ | Execution successful but problem found |
| Failed | ❌ | Execution failed |
| Discarded | 🗑️ | Task soft-deleted (still visible in the audit log) |

## Task List (Transparent Progress)

Once execution begins, the agent **converts each step in the plan into a task** on its own "task list". You can ask "where are we?" / "what's left?" any time—the agent doesn't need to recall anything; it just queries the list.

### What the Task List Looks Like

Each task has a clear title, status, and links to related context:

```
📋 Task List (agent "Contract Review Assistant")

🔄 #1 Parse contract file, extract key clauses
        In progress · linked to plans/review-procurement-contract.md step 1

🔹 #2 Check penalty percentage
        Pending · depends on #1 completing

🔹 #3 Check payment terms
        Pending · depends on #1 completing

🔹 #4 Analyze imported equipment clauses (adaptive)
        Pending · risk: med · depends on #1 #2 #3

🔹 #5 Comprehensive risk assessment (adaptive)
        Pending · risk: med · needs your confirmation

🔹 #6 Send review report
        Pending · risk: high · needs your confirmation
```

### Status Updates **Immediately**

The agent's discipline is:
- **Before starting a step**, immediately switch its status to "🔄 In Progress"
- **As soon as a step is done**, switch to "✅ Completed"
- **Never batch updates** across multiple steps

That means what you see is always current—no "looks stalled but actually working" situations.

### Task Dependencies

A task can declare "you must finish X before me". For example, "run database migration" depends on "backup complete"—if the dependency hasn't finished, the agent won't start the dependent step, preventing out-of-order execution.

Dependencies appear in the list as "depends on #X" so you can see the full task graph at a glance.

### Deviations from the Plan Reflect in the List

If the agent needs to adjust steps mid-flight, it will:

1. Proactively tell you "I'm going to deviate from the original plan, because X"
2. After your agreement, update the task list (add new tasks or modify existing ones)
3. Append the deviation log to the `## Execution Notes` section at the end of the plan file

This way, looking at the plan file + task list later gives you a complete reconstruction of "what actually happened".

### Task Lists Are Private to Each Agent

Each agent can see and modify **only its own** task list. By design:

- **No interference**: Switching to another agent shows you its list—you won't see another agent's to-dos mixed in
- **Clear accountability**: Each task traces back to a specific agent (no "who did this?")
- **Isolated audit**: Task records travel with the agent, making it easy to audit per-agent

:::tip What about multi-agent collaboration?
When several agents work on a big task (e.g. a team task), each agent manages its own list and **shares progress via messages and receipts**—not by reading each other's lists. This mirrors real teamwork: each person has their own to-do list and aligns through updates and receipts. See [Cross-Agent Collaboration](./06-cross-agent.md).
:::

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

## Approval and Waiting in Delegated Tasks

A child Agent may request approval while executing a command or tool. DesireCore displays the request and final decision in the child conversation and **mirrors both into the parent Agent conversation that started the delegation**. Notifications also prefer the parent conversation, so you do not need to switch panels just to approve the child operation.

| Approval mode | Waiting behavior during delegation |
|---|---|
| **AI Approval** | You can decide within 30 seconds; at expiry, the AI suggestion approves or rejects, or the operation is denied when no suggestion is available |
| **Always Ask / Allowlist miss / External Tools Only** | Waits for a human decision and does not reject merely because an ordinary approval countdown elapsed |
| **Allow All** | Skips ordinary confirmation, while deny lists, file scope, and tool permissions remain active |

A synchronous delegation has a separate wait limit. If the parent receives a “wait timed out” result first, the child task has not necessarily ended: it may still be running in the background or waiting for your approval. The timeout notice includes an available task reference; the parent can continue waiting, ignore a later result, or terminate the child task when supported.

:::info Next Step
During execution, certain high-risk operations will trigger "Human Gate" confirmation. Go to [Human Gate Confirmation Mechanism](./04-human-gate.md) for details.
:::
