---
title: Audit Trail
description: Learn how DesireCore records agent operations and how to view and export audit and error logs.
keywords: [audit, log, receipt, operation record, error log, transparency, traceability]
---

# Audit Trail

DesireCore records key operations during agent execution and turns them into audit records, also called action receipts. They let you review what the agent did, why it did it, which tools were called, where data went, and what failed.

## What Is Recorded

Any run that involves tool calls, external requests, data writes, background execution, or approval decisions can generate activity records. Common records include:

- tool calls and parameter summaries
- file reads, writes, edits, and work directory changes
- Shell and PowerShell command execution
- MCP, mail, repository, and other external service interactions
- AI model requests, response status, token usage, and latency
- approval requests and decisions
- scheduled task, heartbeat, and workflow results
- background service errors and tool failures

Plain chat without tool calls or external requests usually does not generate a full execution receipt.

## Activity Panel

Open **Activity** to view audit records:

| Area | Description |
|------|-------------|
| **Execution Records** | Agent tasks, tool calls, receipts, and artifacts |
| **API Audit** | Model and external API requests, status, latency, and usage |
| **Error Logs** | Background service, tool, model, and connector errors |

List items usually show operation time, summary, tool-call count, file-change count, risk level, and status. Click an item to inspect details such as time, provider, status, latency, token usage, or error reason.

## Receipts

Each receipt is a snapshot of an execution process. It can include:

| Field | Description |
|-------|-------------|
| **Task Goal** | Human-readable task description |
| **Execution Plan** | Steps planned by the agent |
| **Tool-Call Chain** | Tools called, parameter summary, result, and duration |
| **Outputs and Changes** | Generated files, diffs, messages, or workflow results |
| **Risks and Approvals** | Whether confirmation was required, approval result, and follow-up items |
| **Errors** | Failure location, error type, and readable reason |

For file writes and edits, receipts try to link change summaries or diffs. For commands, they record command text, working directory, exit status, and important output. For external sends, they record the target and operation summary so you can confirm data flow.

## API Audit

API audit tracks model and third-party service requests so you can understand where data was sent, whether requests succeeded, and how much resource was used.

API audit usually includes:

- request time, provider, and model
- status code, latency, and failure reason
- token or usage metrics
- success rate and average latency summaries
- target service for external APIs or connectors

Use it to investigate model errors, network timeouts, provider rate limits, insufficient key permissions, and unexpected usage.

## Error Logs

Error logs centralize system failures. You can filter by level, page through history, and use the message to jump back to related context. Common sources include model provider errors, failed tools, MCP connection failures, mail or repository integration errors, media proxy issues, and background service startup or port problems.

## Exporting Audit Records

Audit logs can be exported as an independent category or included in a full backup.

Common flow:

1. Open Activity or **Settings** -> **Data and Privacy**
2. Choose audit-log export, or include the audit category in a full backup
3. Select a save location
4. Wait for export to complete

Exports are useful for compliance, incident review, sharing troubleshooting material, and preserving execution history during device migration.

:::info Local Visibility
Audit records are stored locally and are not uploaded automatically. They leave your device only when you export or share them.
:::

## Why Audit Matters

Audit records help you:

- **Review after the fact**: inspect the full execution path even if you skipped details during approval
- **Trace problems**: identify whether an issue came from the model, a tool, a connector, or the input
- **Improve collaboration**: refine prompts, skills, and approval strategy based on history
- **Preserve evidence**: keep an operation chain for sensitive or compliance-heavy tasks
