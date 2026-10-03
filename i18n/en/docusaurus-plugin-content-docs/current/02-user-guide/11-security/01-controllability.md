---
title: Three-Layer Controllability
description: Learn how to inspect execution records, handle approvals, and restore local changes through checkpoints.
keywords: [controllability, security, visible, controllable, reversible, transparency]
---

# Three-Layer Controllability

Execution records, approval rules, and checkpoint restoration provide visibility, control, and reversibility. The sections below describe how to use them and their limits.

## Layer 1: Visible

> You can see what the agent is doing.

Tool cards, execution receipts, and activity records show operations and results.

**Specific manifestations:**

- **Pre-operation Confirmation**: Operations requiring approval show a confirmation card with their type, parameters, and risk. The current approval mode and permission rules determine whether approval is required
- **Source Tracing**: Every operation request explains "why this operation is being executed," tracing back to which of your instructions triggered it
- **Detail Expansion**: You can expand to view complete operation parameters, such as file content diff, full command text
- **Execution Receipt**: A detailed receipt is generated after each task completion, recording the tool call chain, decision basis, and outputs

:::tip
Visibility doesn't mean information overload. DesireCore decides the level of detail based on risk level—brief prompts for low-risk operations, detailed displays for high-risk operations.
:::

## Layer 2: Controllable

> You can intervene and modify at any time.

Seeing isn't enough—you also need to be able to influence the agent's behavior.

**Specific manifestations:**

- **Three-Choice Decision**: Faced with agent operation requests, you can choose "Allow," "Reject," or "Modify"
  - **Allow**: Let the agent execute the operation
  - **Reject**: Cancel the operation, agent needs to adjust the plan
  - **Modify**: Open the editing panel, manually adjust operation parameters before executing
- **Rule Memory**: For operations that support remembered rules, select "Allow and Remember"; later operations matching that rule follow its approval policy
- **Permission Rule Management**: View and manage all remembered permission rules centrally in settings, supporting editing, disabling, and deletion
- **Interrupt Capability**: During task execution, you can click the stop button to interrupt at any time

## Layer 3: Reversible

> Inspect and restore local changes through checkpoints.

Open [Rewind and Checkpoint](../02-conversations/10-rewind-checkpoints.md), inspect the differences and recovery scope, then decide whether to restore.

| Content | Recovery boundary |
|---|---|
| Conversation records and local files | Limited to records and recoverable files covered by the actual checkpoint |
| Sent email, payments, publications, and other external actions | Must be handled through the relevant service; local rollback cannot undo them |
| Interrupted tasks | Check outputs, execution records, and commands still running before continuing or retrying |

Restoring a conversation does not restart every step. Before continuing a task with external effects, check whether the action already happened to avoid duplicates.

## Three Layers Working Together

During execution, check the following in order:

```
Visible → You know what happened
  ↓
Controllable → You decide whether to continue
  ↓
Reversible → Check checkpoint scope, then restore local changes
```

Before changing approval settings, check which operations the current mode permits.

:::info
DesireCore's security design draws on the human-machine collaboration principles of the NIST AI Security Framework, while making localized adaptations for desktop applications. We believe good security mechanisms should make you feel assured, not constrained.
:::
