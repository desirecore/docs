---
title: Delegation and Collaboration Issues
description: Resolve common issues with Agent delegation, team collaboration, and task assignment in DesireCore
keywords: [delegation, collaboration, team, task, receipt, delegate, agent communication]
---

# Delegation and Collaboration Issues

## What's the difference between delegation and direct conversation?

| Comparison | Direct Conversation | Delegation |
|------------|-------------------|------------|
| Interaction | You chat with an Agent in real-time | One Agent passes a task to another |
| Context | You manually provide background | Delegator automatically passes task description and context |
| Use case | Simple Q&A, instant feedback | Complex tasks, specialized expertise, multi-step work |
| Result | Real-time streaming output | Returns result on completion (sync) or async report |

Simply put: direct conversation is "you chatting with an Agent," delegation is "having one Agent ask another for help."

## How do I check delegation progress?

1. **Synchronous delegation**: The delegator waits for the result. You'll see a "Delegating to XXX..." indicator in the conversation, and the result appears directly when complete
2. **Asynchronous delegation**: The task runs in the background; you'll receive a notification upon completion. View the full execution via Receipts
3. **InspectRuns**: The delegator can use the InspectRuns tool to view sub-task execution history and summaries

## How do I cancel a running delegation?

- **Synchronous delegation**: Click the "Stop" button in the conversation; this interrupts both the current Agent and its delegated sub-tasks
- **Asynchronous delegation**: The delegator can use the Delegate tool's `terminate` action with the run_id or correlation_id to stop the background sub-task
- **Note**: Already-completed steps are not undone; cancellation only affects subsequent execution

## How do team members communicate?

Agents in a DesireCore team can communicate through:

| Method | Tool | Use Case |
|--------|------|----------|
| Delegate task | Delegate | Need the other to execute a complete workflow |
| Send message | SendMessage | Lightweight notifications, questions, reports |
| Shared files | Working directory | Exchange file artifacts via shared directory |

The supervisor (team lead) coordinates task assignment and progress tracking.

## Where do I view Receipts?

Receipts record the complete evidence chain of each Agent execution. Viewing methods:

1. Receipts are automatically generated in the conversation after an Agent completes operations
2. Receipts include: list of executed operations, tool call records, and final results
3. After async delegation completes, the report message includes a runId for tracing the full execution

## What if delegation fails or times out?

Common causes and solutions:

1. **Target Agent offline** --- Check if the target Agent is in idle status
2. **Unclear task description** --- Provide more specific task descriptions and necessary context
3. **Timeout** --- Complex tasks may need more time; async delegation is not limited by conversation timeout
4. **Insufficient permissions** --- The target Agent may lack tools or skills needed for the task

:::tip
If delegation frequently fails, try breaking complex tasks into smaller sub-tasks and delegating them separately for higher success rates.
:::

## How do I create a team for multi-Agent collaboration?

1. Ensure all needed Agents are already created (using ManageAgent)
2. Use ManageTeam to create a team, specifying the supervisor and members
3. The supervisor assigns tasks to members via Delegate
4. Members report results back to the supervisor upon completion

:::warning
ManageTeam does not automatically create missing members. All Agents must exist before creating the team.
:::
