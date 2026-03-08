---
title: Learning Feedback
description: Understand the agent's learning feedback mechanism—what it learned, whether it learned correctly, and how to confirm and correct.
keywords: [learning feedback, feedback card, confirm learning, correction, knowledge verification]
---

# Learning Feedback

Every time you teach the agent something new, it gives you feedback—telling you what it learned. This is the key step to ensure teaching quality.

## Learning Feedback Cards

When you teach a rule or give an example, the agent generates a **learning feedback card** summarizing what it understood:

```
┌──────────────────────────────────────────────────┐
│  📝 Learned New Content                           │
├──────────────────────────────────────────────────┤
│                                                    │
│  Type: Rule                                        │
│  Topic: Contract Review - Penalty Standards        │
│  Level: Mandatory                                  │
│                                                    │
│  My Understanding:                                 │
│  "When reviewing contracts, if the penalty         │
│   percentage exceeds 20% of the total contract     │
│   amount, mark as high risk and suggest revising   │
│   to not exceed 20%."                              │
│                                                    │
│  Applicable Scope: All procurement contracts       │
│  Source: This conversation                         │
│                                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  ✓ Correct │  │  ✎ Modify │  │  ✗ Undo  │        │
│  └──────────┘  └──────────┘  └──────────┘        │
│                                                    │
└──────────────────────────────────────────────────┘
```

### Information Included in the Card

| Field | Explanation |
|-------|-------------|
| **Type** | Rule / Example / Preference |
| **Topic** | Which domain this knowledge belongs to |
| **Level** | Mandatory / Recommended / Preference |
| **Understanding** | The agent restates what it understood in its own words |
| **Applicable Scope** | In what scenarios this knowledge will be used |
| **Source** | Which conversation it was learned from |

## How to Confirm Learning is Correct

After seeing the feedback card, you have three choices:

### Confirm Correct

If the agent's understanding matches your intention, click "Correct." This knowledge will be formally written into the agent's behavior manual.

```
You: [Click ✓ Correct]
Agent: "Okay, this rule has been recorded in the contract review standards. When reviewing contracts in the future,
        I will automatically check the penalty percentage."
```

### Modify Understanding

If the agent's understanding isn't quite right, you can modify it:

```
You: "The understanding is basically correct, but add one point: this rule only applies to procurement contracts.
    The penalty standard for sales contracts is 30%."

Agent:
┌──────────────────────────────────────────────────┐
│  📝 Updated                                       │
├──────────────────────────────────────────────────┤
│                                                    │
│  Rule (Modified):                                  │
│  "When reviewing procurement contracts, penalty    │
│   not exceeding 20% is normal.                     │
│   When reviewing sales contracts, penalty          │
│   not exceeding 30% is normal.                     │
│   Exceeding standard is marked as high risk."      │
│                                                    │
│  Change: Added distinction for sales contract      │
│          penalty standards                         │
│                                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  ✓ Correct │  │  ✎ Modify │  │  ✗ Undo  │        │
│  └──────────┘  └──────────┘  └──────────┘        │
│                                                    │
└──────────────────────────────────────────────────┘
```

### Undo Learning

If the agent's understanding is completely off, or you changed your mind, you can undo:

```
You: [Click ✗ Undo]
Agent: "Okay, this learning content has been undone. This rule will not be applied."
```

## Correcting Misunderstandings

Sometimes the agent may demonstrate incorrect understanding in subsequent tasks. You can correct it directly:

```
Agent: "[In review report] Clause 5 payment cycle is 25 days,
        below 30-day standard, marked as high risk."

You: "This is wrong. Although 25 days is below the 30-day standard, the gap is small,
    it should be marked as 'medium risk' not 'high risk.' High risk is when the gap
    exceeds 50%, like a payment cycle of only 10 days."

Agent:
┌──────────────────────────────────────────────────┐
│  📝 Corrected Previous Understanding              │
├──────────────────────────────────────────────────┤
│                                                    │
│  Original Understanding:                           │
│  "Below 30-day standard → High risk"              │
│                                                    │
│  Corrected:                                        │
│  "Deviation ≤50% → Medium risk (e.g., 25 vs 30)   │
│   Deviation >50% → High risk (e.g., 10 vs 30)"    │
│                                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  ✓ Correct │  │  ✎ Modify │  │  ✗ Undo  │        │
│  └──────────┘  └──────────┘  └──────────┘        │
│                                                    │
└──────────────────────────────────────────────────┘
```

## Viewing Learning History

You can view the agent's complete learning record at any time:

- In conversation: **"What have you learned recently?"** or **"List this week's learning record"**
- Browse in the **Behavioral Norms** page of agent settings

Each learning record contains:
- What was learned
- Learning time
- Source conversation
- Current status (Active / Undone / Modified)

:::tip Establish Regular Review Habits
We recommend spending a few minutes regularly (e.g., weekly) checking what the agent has newly learned to ensure everything is on track. Just like regular communication with an apprentice—the earlier you catch problems, the lower the cost of correction.
:::

:::info Next Step
What if you find the agent learned something wrong and need to undo or make it forget? Go to [Undo and Forget](./06-undo-forget.md) to learn the operations.
:::
