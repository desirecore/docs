---
title: Giving Tasks
description: Learn how to clearly describe a task to your agent, and the difference between "giving a task" and "simple inquiry."
keywords: [giving tasks, delegation, task description, delegate, task scope]
---

# Giving Tasks

You've taught the agent rules and examples; now it's time to hand over the work.

## The Difference Between "Giving a Task" and "Simple Inquiry"

When conversing with the agent, your messages are automatically recognized as one of two intents:

| Type | What You're Doing | Agent's Response | Example |
|------|-------------------|------------------|---------|
| **Simple Inquiry** | Asking for information or advice | Direct answer | "What are the regulations about penalty fees in contract law?" |
| **Giving a Task** | Delegating work that needs execution | First creates a plan, then executes | "Help me review this procurement contract." |

You don't need to deliberately distinguish—the agent will automatically judge based on your expression. However, understanding this difference helps you use DesireCore more efficiently.

:::tip How to Let the Agent Know You're Giving a Task?
Use action-oriented expressions:

- "Help me review..." / "Help me write..." / "Help me organize..."
- "Take this document..." / "Check..."
- "I need you to complete..."

Instead of:
- "What is..." / "What do you think..." / "Explain..."
:::

## How to Clearly Describe a Task

A good task description lets the agent complete work faster and more accurately. A complete task description contains four elements:

### 1. What to Do (Goal)

Clearly state the result you want:

```
You: "Help me review the procurement contract in the attachment and output a review report."
```

### 2. How to Do It (Standards)

If you have specific requirements or standards:

```
You: "Focus on penalty clauses, payment terms, and warranty period when reviewing.
    Use the template I taught you last time for the report format."
```

:::info If You've Taught Rules Before
If you've already taught the agent contract review rules, you can skip this step—it will automatically apply what it learned.
:::

### 3. Scope and Boundaries

Let the agent know what should and shouldn't be done:

```
You: "Only look at the main body of the contract, no need to review appendices and attachments.
    If you find major risks, tell me first, don't directly send revision suggestions to the other party."
```

### 4. Time and Priority (Optional)

If there's urgency:

```
You: "This contract is quite urgent, need review results by 3 PM this afternoon."
```

## Good Task Description Examples

:::tip Good Task Description vs. Vague Task Description

**Good Description**:
> "Help me review the 'XX Technology Procurement Contract.pdf' in the attachment. Focus on checking whether penalty clauses and payment terms meet company standards. Use the review report template I taught you before for the output format. If there are high-risk clauses, highlight them in red in the report."

**Vague Description**:
> "Take a look at this contract and see if there are any problems."

---

**Good Description**:
> "Help me write an email to Director Zhang telling him that next Tuesday's meeting is moved to Wednesday at 2 PM because of a conference room conflict. Tone should be formal but friendly, keep it brief."

**Vague Description**:
> "Help me write an email."

---

**Good Description**:
> "Organize last week's sales data (Excel in attachment), group statistics by region, and find the 3 regions with the fastest year-over-year growth. Output as a concise data table plus a summary analysis."

**Vague Description**:
> "Help me analyze the data."
:::

## What Happens After Giving a Task

After you give a task, the agent operates according to the following process:

```
You give a task
    ↓
Agent may ask for clarification (Clarify) — if information is insufficient
    ↓
Agent creates a plan (Plan) — and waits for your confirmation
    ↓
You confirm or modify the plan
    ↓
Agent begins execution (Execute)
    ↓
Pauses for confirmation at key nodes (Human Gate)
    ↓
Execution complete, submits receipt (Reflect)
```

You can see and control every step. This is the difference between "delegation" and "handing it to AI and forgetting about it."

## Task Scope Control

You can control the agent's autonomy as needed:

| Control Level | Applicable Scenario | Expression |
|---------------|---------------------|------------|
| **Full Autonomy** | Low-risk, repetitive tasks | "Just help me do it directly, no need to ask me every step" |
| **Key Node Confirmation** | Medium-risk tasks | "Ask me about important decisions, use your judgment for the rest" |
| **Step-by-Step Confirmation** | High-risk or first-time execution | "Confirm with me before every step" |

:::info Next Step
After giving a task, the agent will first present you with a plan. Go to [Plan Confirmation](./02-plan-confirmation.md) to learn how to review and confirm the agent's execution plan.
:::
