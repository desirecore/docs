---
title: Risk Levels
description: Learn about DesireCore's four-level risk classification system and confirmation methods for different levels.
keywords: [risk level, security, permissions, confirmation, operation]
---

# Risk Levels

DesireCore classifies all agent operations into four risk levels based on potential impact. Different levels have different confirmation methods, ensuring high-risk operations receive sufficient review while low-risk operations don't overly disturb you.

## Four-Level Risk Classification

### Low Risk

**Meaning**: Read-only operations or pure information queries with no substantial impact on the system.

**Example Operations**:
- Read file content
- Search for information
- View configuration

**Confirmation Method**: Usually executes automatically without popping up confirmation dialogs. You can view them afterward in execution receipts.

### Medium Risk

**Meaning**: Operations that modify data but have limited impact scope.

**Example Operations**:
- Modify document content
- Create new files
- Modify configuration items

**Confirmation Method**: Popup confirmation dialog showing operation type and impact scope. You can choose to allow, reject, or modify.

### High Risk

**Meaning**: Operations that may have significant impact, involving important data or system resources.

**Example Operations**:
- Execute Shell commands
- Batch modify multiple files
- Operate Git repositories

**Confirmation Method**: Popup detailed confirmation dialog, showing complete operation parameters and source tracing in addition to operation type and impact scope. Strongly recommend expanding to view details before confirming.

### Critical Risk

**Meaning**: Irreversible or extremely high-impact operations requiring extra caution.

**Example Operations**:
- Delete important files
- Execute dangerous commands involving `rm -rf`
- Modify environment variable files

**Confirmation Method**: Popup prominent warning dialog requiring your explicit confirmation. Some critical operations are directly blocked by system preset rules (e.g., modifying `.env` files, executing dangerous deletion commands).

## Confirmation Dialog

When an agent requests to execute medium/high/critical risk operations, the confirmation dialog contains the following information:

| Information Item | Description |
|------------------|-------------|
| **Operation Type** | The specific operation to execute, such as "write file," "execute command" |
| **Impact Scope** | Resources involved in the operation, such as target file path |
| **Risk Level** | The risk level of the current operation |
| **Source Tracing** | Why the agent wants to execute this operation (traces back to which of your instructions) |
| **Detail Expansion** | Complete parameters, such as file diff preview, full command text |

You have three choices:

- **Allow**: Execute the operation
- **Reject**: Cancel the operation, agent needs to replan
- **Modify**: Manually adjust parameters before executing

## "Allow and Remember"

If you trust a certain type of operation, you can check **Allow and Remember** when confirming. The system will save this decision as a permission rule, automatically approving similar operations next time.

For example, after checking "Allow writing Markdown files in `docs/` directory," the agent no longer needs confirmation each time it modifies documents.

Saved rules can be viewed, edited, and deleted in **Settings → Permission Management**.

:::tip
Reasonable use of "Allow and Remember" can greatly reduce confirmation popup interference while maintaining review of high-risk operations. We recommend only enabling this for operation patterns you explicitly trust.
:::

## System Preset Rules

DesireCore has some unmodifiable built-in security rules to block clearly dangerous operations:

- Prohibit modifying environment variable files (`.env*`)
- Prohibit executing destructive commands like `rm -rf *`
- More rules continuously improving

These rules are marked as "System Preset Rules" in the permission management page and cannot be edited or deleted.
