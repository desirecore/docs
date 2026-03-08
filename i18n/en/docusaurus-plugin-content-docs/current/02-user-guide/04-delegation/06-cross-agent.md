---
title: Cross-Agent Collaboration
description: Learn how multiple agents collaborate to complete complex tasks—collaboration triggers, information transfer mechanisms, and progress monitoring.
keywords: [cross-agent, collaboration, multi-agent, coordination, task assignment]
---

# Cross-Agent Collaboration

Some tasks are too complex for one agent to handle. In these cases, multiple agents can divide the work and collaborate, each leveraging their expertise.

## When Multi-Agent Collaboration is Needed

| Scenario | Agents Involved | Collaboration Method |
|----------|-----------------|---------------------|
| Review contract + Generate report | Legal Advisor + Document Assistant | Legal advisor reviews, document assistant formats report |
| Analyze data + Write weekly report | Data Analyst + Work Assistant | Analyst processes data, assistant writes into weekly report |
| Translate document + Professional proofreading | Translation Assistant + Domain Expert | Translation assistant does initial translation, expert proofreads terminology |
| Competitive analysis + Strategy recommendations | Market Analysis + Strategy Consultant | Analyst collects data, consultant gives strategy |

## How to Trigger Collaboration

### Method 1: You Actively Arrange

You can directly specify which agents participate:

```
You: "Have the legal advisor review this contract first, then hand the results to the document assistant,
    to generate a formal review report."
```

### Method 2: Agent Automatically Identifies

When the agent finds it needs other expertise during task execution, it proactively suggests collaboration:

```
Agent (Legal Advisor): "I have completed the legal review of the contract, but found that the contract
    involves international trade clauses. This is beyond my expertise.

    Suggestion: Have the trade advisor assist in reviewing clauses 15-18 related to international trade.

    Allow?"
```

## Information Transfer in Collaboration

When multiple agents collaborate, information transfers between them in an orderly manner:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  Legal Advisor│ ───→ │  Trade Advisor│ ───→ │  Document Assistant│
│              │      │              │      │              │
│ Review contract clauses │      │ Review trade clauses │      │ Generate formal report │
│              │      │              │      │              │
│ Output:        │      │ Output:        │      │ Output:        │
│ - Penalty clause risks │      │ - Trade clause analysis │      │ - Complete review report │
│ - Payment term issues │      │ - Compliance suggestions │      │              │
└──────────────┘      └──────────────┘      └──────────────┘
```

### Content Transferred

What transfers between agents is not raw conversation content, but structured task handoffs:

| Transfer Item | Explanation |
|---------------|-------------|
| **Task description** | What needs to be done by the other party |
| **Input data** | Files or information the other party needs to process |
| **Completed work** | Output from previous agents |
| **Constraints** | Rules or requirements to follow |
| **Context** | Relevant background information |

## Monitoring Collaboration Progress

When multiple agents collaborate, you can see the overall progress panel:

```
┌──────────────────────────────────────────────────────┐
│  🤝 Collaboration Task: Comprehensive Contract Review  │
├──────────────────────────────────────────────────────┤
│                                                        │
│  Participating agents: 3                              │
│  Overall progress: ━━━━━━━━━━━━━━░░░░░░  75%          │
│                                                        │
│  ✅ Legal Advisor          Complete                    │
│     └─ Reviewed 15 clauses, found 2 risk points       │
│                                                        │
│  🔄 Trade Advisor          In progress                 │
│     └─ Analyzing international trade clauses...       │
│                                                        │
│  ⏳ Document Assistant       Waiting                   │
│     └─ Waiting for previous tasks to complete before starting │
│                                                        │
│  ┌──────────┐  ┌──────────┐                            │
│  │  View Details │  │  ⏸ Pause  │                            │
│  └──────────┘  └──────────┘                            │
│                                                        │
└──────────────────────────────────────────────────────┘
```

### View Detailed Progress of Each Agent

Click on an agent to view its detailed execution status, same as the single-agent execution monitoring interface.

### Intervening in Collaboration Process

You can intervene at any time during collaboration:

```
You: "The trade advisor's analysis doesn't need to be too detailed, just confirm whether
    export control risks exist, skip the rest."

Trade Advisor: "Received, I will focus on reviewing export control related clauses."
```

## Collaboration Receipts

After collaboration tasks complete, a comprehensive receipt is generated, containing contributions from all participating agents:

```
│  📋 Collaboration Receipt                               │
│                                                        │
│  Participants and contributions:                       │
│                                                        │
│  1. Legal Advisor                                      │
│     - Clauses reviewed: 15                            │
│     - Risks found: 2                                  │
│     - Time: 3 minutes                                 │
│                                                        │
│  2. Trade Advisor                                      │
│     - Clauses reviewed: 4                             │
│     - Compliance confirmation: No export control risks found │
│     - Time: 1.5 minutes                               │
│                                                        │
│  3. Document Assistant                                 │
│     - Report generated: 1 (2.3KB)                     │
│     - Time: 2 minutes                                 │
│                                                        │
│  Total time: 6.5 minutes                              │
│  If executed sequentially (non-collaboration): ~8 minutes │
```

:::tip Choose Appropriate Collaboration Methods
Not all tasks need multi-agent collaboration. Simple tasks are more efficient with one agent. Collaboration is only valuable when tasks involve multiple professional domains or require parallel processing of multiple subtasks.
:::

:::info Review
Congratulations on completing all the learning for "Delegating Tasks"! You now know:
- How to [Give Tasks](./01-giving-tasks.md)
- How to [Confirm Plans](./02-plan-confirmation.md)
- How to [Monitor Execution](./03-execution-monitoring.md)
- What is [Human Gate](./04-human-gate.md)
- How to interpret [Execution Receipts](./05-receipts.md)
- How to use [Cross-Agent Collaboration](./06-cross-agent.md)
:::
