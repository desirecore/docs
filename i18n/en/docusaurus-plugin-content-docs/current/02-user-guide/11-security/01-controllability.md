---
title: Three-Layer Controllability
description: Learn about DesireCore's core security philosophy—Visible, Controllable, Reversible—keeping you always in control.
keywords: [controllability, security, visible, controllable, reversible, transparency]
---

# Three-Layer Controllability

DesireCore's security design revolves around one core philosophy: **You are always the final decision-maker.** Agents are your assistants, not your managers. To ensure this, we built a three-layer controllability system.

## Layer 1: Visible

> You can see what the agent is doing.

Every step of the agent's operation is transparently visible to you—there are no "black box" operations.

**Specific manifestations:**

- **Pre-operation Confirmation**: When the agent needs to execute operations like writing files or calling APIs, a confirmation dialog pops up clearly showing the operation type, impact scope, and risk level
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
- **Rule Memory**: For trusted operations, check "Allow and Remember," similar operations will automatically proceed next time
- **Permission Rule Management**: View and manage all remembered permission rules centrally in settings, supporting editing, disabling, and deletion
- **Interrupt Capability**: During task execution, you can click the stop button to interrupt at any time

## Layer 3: Reversible

> Any operation can be undone.

Even if you allowed an operation, it's okay if you later find it wrong—all changes can be rolled back.

**Specific manifestations:**

DesireCore supports four levels of rollback granularity:

| Rollback Level | Description | Recovery Speed |
|----------------|-------------|----------------|
| **Patch Level** | Undo the most recent single file modification | < 100ms |
| **Turn Level** | Undo all modifications from the most recent conversation round | < 500ms |
| **Session Level** | Restore to state at the beginning of the current session | < 2s |
| **Version Level** | Select any historical snapshot to restore | Depends on difference size |

**Interrupt Recovery**: After you interrupt a running task, the system provides a recovery options panel where you can choose:

- Continue execution
- Retry current step
- Skip current step
- Roll back all modifications from this task
- Abandon task but keep existing modifications

## Three Layers Working Together

The three layers of controllability aren't independent—they build on each other and work together:

```
Visible → You know what happened
  ↓
Controllable → You decide whether to continue
  ↓
Reversible → Even if the decision was wrong, you can safely roll back
```

This mechanism ensures you don't lose control of the system while enjoying the convenience brought by agents. No matter how "smart" the agent is, the final decision always rests with you.

:::info
DesireCore's security design draws on the human-machine collaboration principles of the NIST AI Security Framework, while making localized adaptations for desktop applications. We believe good security mechanisms should make you feel assured, not constrained.
:::
