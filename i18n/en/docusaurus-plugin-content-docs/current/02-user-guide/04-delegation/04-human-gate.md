---
title: Human Gate Confirmation Mechanism
description: Learn what operations trigger the Human Gate, what information the confirmation dialog contains, and how to handle confirmation requests.
keywords: [Human Gate, Human Gate, confirmation, permissions, risk level, security]
---

# Human Gate Confirmation Mechanism

Human Gate is the core mechanism of DesireCore's security system—forcing a pause and requesting your confirmation before the agent executes high-risk operations.

## What Operations Trigger Human Gate

When the agent executes tasks, the following types of operations automatically trigger Human Gate:

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

:::info Not All Operations Need Confirmation
Read-only operations like reading files, analyzing data, and generating drafts usually don't need confirmation. The agent autonomously completes these low-risk operations to improve efficiency.
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

## Three Choices

### Approve

Confirm execution of this operation:

```
You: [Click ✓ Allow]
Agent: "Okay, executing now..."
```

If you check **"Allow and remember,"** similar operations next time (e.g., writing files in the same directory) will be automatically allowed without popping up confirmation.

### Deny

Block this operation:

```
You: [Click ✗ Deny]
Agent: "Okay, I won't execute this operation.
        I will adjust the plan: change to displaying report content in conversation,
        instead of writing to file. Continue?"
```

The agent will adjust subsequent behavior based on your reason for denial.

### Modify

You agree to execute but want to modify some parameters:

```
You: [Click ✎ Modify]

[Edit panel opens]
File path: docs/review-report-XX-2025-001.md
→ Change to: docs/drafts/review-report-XX-2025-001-draft.md

You: "Save to drafts directory and mark 'draft' in the filename."
```

## Risk Levels and Confirmation Frequency

Different risk level operations trigger confirmation at different frequencies:

| Risk Level | Indicator | Confirmation Strategy | Examples |
|------------|-----------|----------------------|----------|
| **Low** | 🟢 | Auto-allowed by default | Read files, search information |
| **Medium** | 🟡 | Ask by default, can be set to auto-allow | Write files, run safe commands |
| **High** | 🟠 | Always ask, can check "remember" | Send emails, call external APIs |
| **Critical** | 🔴 | Always ask, cannot skip | Delete data, financial operations, permission changes |

:::danger Critical Risk Operations Cannot Be Auto-Approved
Operations involving finance, deletion, permission changes, and other critical risks will require confirmation every time, even if you check "remember." This is to protect you from unrecoverable losses.
:::

## Managing "Remember" Rules

Rules you previously created through "Allow and remember" can be managed in settings:

```
You: "List all auto-allow rules."

Agent: "Currently have 3 auto-allow rules:

        1. ✅ Allow writing .md files in docs/ directory
           Created: 3 days ago

        2. ✅ Allow executing git related commands
           Created: 1 week ago

        3. ✅ Allow calling translation API
           Created: 2 weeks ago

        You can edit or delete these rules."
```

You can delete any rule at any time, making the agent revert to asking every time.

:::tip Trust is Gradual
When first using the agent, it's recommended to maintain more confirmations. As your trust in it increases, gradually expand the scope of auto-allows. This is like mentoring a new person in reality—first watch them work, confirm there are no problems, then slowly let go.
:::

:::info Next Step
After the agent completes the task, it generates a detailed execution receipt. Go to [Execution Receipts](./05-receipts.md) to learn how to interpret receipt information.
:::
