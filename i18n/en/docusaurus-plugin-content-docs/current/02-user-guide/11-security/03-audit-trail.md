---
title: Audit Trail
description: Learn how DesireCore records every step of agent operations and how to view and export audit logs.
keywords: [audit, log, receipt, operation record, transparency, traceability]
---

# Audit Trail

DesireCore generates complete audit records (also called "action receipts") for each agent execution process, allowing you to clearly understand what the agent did and why afterward.

## What Operations Are Recorded

All agent execution processes involving tool calls or data writing automatically generate receipts. Specifically includes:

- File read/write operations
- Shell command execution
- API calls (including AI model calls)
- Search and information retrieval
- Configuration modifications
- Any operations using Tools

Pure text conversations (chat without tool calls) don't generate receipts.

## Viewing Audit Logs

1. Open the **Activity Records** panel (click the activity records entry in the main interface)
2. View all receipt records in the list
3. Each receipt shows: operation time, operation summary, tool call count, file change count, risk level

Click a single receipt to view complete details.

## Information in Receipts

Each receipt is a snapshot of a complete execution process, containing the following fields:

| Field | Description |
|-------|-------------|
| **Execution Goal** | Human-readable task description, explaining what this execution aims to accomplish |
| **Execution Plan** | Step-by-step plan formulated by the agent |
| **Tool Call Chain** | Parameters, return results, and time taken for each tool call |
| **Decision Basis** | What knowledge fragments or rules the agent referenced to make decisions |
| **Outputs and Changes** | Specific outputs such as file diffs, document changes |
| **Risks and Incomplete Items** | Potential risks or follow-up items requiring your attention |

## API Audit

In addition to tool call receipts, DesireCore also records audit information for all third-party API requests, helping you understand data flow.

In the **API Audit** Tab of activity records, you can see:

- Time, target model, and provider for each API request
- Request status code and time taken
- Token consumption statistics
- Success rate and average latency summary metrics

## Exporting Audit Records

You can export audit records for archiving or analysis:

1. In the activity records panel, click the **Export All** button
2. Select save location and format
3. Wait for export to complete

:::info
Audit records are stored locally and won't be automatically uploaded to the cloud. Only you can view these records. Regular export can help you review agent behavior patterns and optimize workflows.
:::

## Significance of Audit

Audit trail isn't just "recording"—it's an extension of "visibility" in DesireCore's three-layer controllability. Through audit records, you can:

- **Post-hoc Review**: Even if you didn't carefully view the confirmation dialog at the time, you can completely review afterward
- **Trace Problems**: When results don't meet expectations, find which step the problem occurred
- **Optimize Collaboration**: Understand the agent's decision-making patterns, adjust your instruction methods for better results
- **Compliance Documentation**: In scenarios requiring compliance audit, provide complete operation evidence chain
