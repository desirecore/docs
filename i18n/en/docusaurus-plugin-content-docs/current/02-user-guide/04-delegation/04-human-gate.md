---
title: Human Gate Confirmation Mechanism
description: Learn what operations trigger the Human Gate, what information the confirmation dialog contains, and how to handle confirmation requests.
keywords: [Human Gate, Human Gate, confirmation, permissions, risk level, security]
---

# Human Gate Confirmation Mechanism

Human Gate is DesireCore's pre-execution confirmation mechanism. Tool declarations, risk level, and the Agent's current [approval mode](../11-security/05-ai-approval.md) together decide whether an operation runs directly, is decided by AI, or pauses for you.

## What Operations Trigger Human Gate

The following operations are commonly marked as requiring confirmation. Whether a card actually appears depends on the tool rule and approval mode:

| Operation Type | Examples | Risk Level |
|----------------|----------|------------|
| **Send Message** | Send email, send message to others | Medium - High |
| **Modify File** | Write or delete files | Medium |
| **Execute Command** | Run scripts or system commands | Medium - High |
| **External Call** | Call third-party APIs or services | Medium - High |
| **Financial Operation** | Involving payment, transfer, etc. | High - Critical |
| **Publish/Public** | Publish content to external platforms | High |
| **Delete Operation** | Delete data or resources | High |
| **Permission Change** | Modify access permissions | Critical |

:::info Risk level is not the only switch
Read-only operations such as reading files, analyzing data, and generating drafts usually do not require confirmation. Conversely, External Tools Only and Allow All can reduce or skip ordinary prompts, while built-in deny rules, file scope, and tool permissions still apply.
:::

## Confirmation Dialog

When Human Gate is triggered, you will see a confirmation dialog:

```
┌──────────────────────────────────────────────────────┐
│  ⚠️ Needs Your Confirmation                    [Cancel] │
├──────────────────────────────────────────────────────┤
│                                                        │
│  Operation type: Write file                            │
│  Impact scope: docs/review-report-XX-2025-001.md      │
│  Risk level: 🟡 Medium                                 │
│                                                        │
│  ──────────────────────────────────────────────────    │
│                                                        │
│  Source trace:                                         │
│  According to your instruction "Help me review this procurement contract," the agent plans │
│  to generate a review report and save it to the documents directory.                      │
│                                                        │
│  ▼ View details                                        │
│  ┌──────────────────────────────────────────────┐      │
│  │  File content preview:                        │      │
│  │  # Contract Review Report                     │      │
│  │  ## I. Basic Information                      │      │
│  │  Party A: XX Technology Co., Ltd.             │      │
│  │  ...                                          │      │
│  └──────────────────────────────────────────────┘      │
│                                                        │
│  ☐ Allow and remember (don't ask again for similar operations) │
│                                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │  ✓ Allow  │  │  ✗ Deny  │  │  ✎ Modify  │            │
│  └──────────┘  └──────────┘  └──────────┘            │
│                                                        │
└──────────────────────────────────────────────────────┘
```

### Information Included in Confirmation Dialog

| Information | Explanation |
|-------------|-------------|
| **Operation Type** | What operation the agent wants to perform |
| **Impact Scope** | What resources this operation will affect |
| **Risk Level** | Risk degree of the operation (Low/Medium/High/Critical) |
| **Source Trace** | Why this operation is being performed, originating from which task |
| **Details** | Specific operation content (expandable for viewing) |

## Available Choices

### Approve

Confirm execution of this operation:

```
You: [Click ✓ Allow]
Agent: "Okay, executing now..."
```

For command approvals that support remembering, you can also choose **Always Allow**. The current implementation stores an exact rule for the complete command; it does not automatically broaden authority to every operation in the same directory or every invocation of the executable.

### Deny

Block this operation:

```
You: [Click ✗ Deny]
Agent: "Okay, I won't execute this operation.
        I will adjust the plan: change to displaying report content in conversation,
        instead of writing to file. Continue?"
```

The agent will adjust subsequent behavior based on your reason for denial.

## Risk Levels and Confirmation Frequency

Risk level is an important input, but the final behavior also depends on the Agent approval mode:

| Risk Level | Indicator | Confirmation Strategy | Examples |
|------------|-----------|----------------------|----------|
| **Low** | 🟢 | Auto-allowed by default | Read files, search information |
| **Medium** | 🟡 | Ask by default, can be set to auto-allow | Write files, run safe commands |
| **High** | 🟠 | Requires confirmation by default; AI Approval may decide after its countdown | Send emails, call external APIs |
| **Critical** | 🔴 | Prefer human confirmation; still verify the actual tool policy and Agent mode | Delete data, financial operations, permission changes |

:::danger Do not treat the risk label as an unskippable hard boundary
Allow All skips ordinary tool confirmations, and External Tools Only lets built-in tools and shell commands run directly. For Agents that can perform finance, deletion, publishing, or permission changes, use Always Ask and restrict their tools and file scope. Do not rely on a risk label or prompt text alone.
:::

## Managing "Remember" Rules

You can review or remove remembered command rules in the Agent's approval preferences. New rules created through Always Allow match the complete command exactly. Administrator allowlists and deny lists use their own patterns. Deny rules and code-level blocklists take precedence over allow rules.

:::tip Trust is Gradual
When first using the agent, it's recommended to maintain more confirmations. As your trust in it increases, gradually expand the scope of auto-allows. This is like mentoring a new person in reality—first watch them work, confirm there are no problems, then slowly let go.
:::

:::info Next Step
After the agent completes the task, it generates a detailed execution receipt. Go to [Execution Receipts](./05-receipts.md) to learn how to interpret receipt information.
:::
