---
title: Giving Examples (Demonstrate)
description: Learn how to help your agent understand your intentions and standards more accurately by providing concrete examples and counter-examples.
keywords: [Demonstrate, examples, counter-examples, teaching, pattern recognition]
---

# Giving Examples (Demonstrate)

If "teaching rules" is telling the agent "what should be done," then "giving examples" is letting it **see with its own eyes** what the correct approach looks like.

## What Are Examples

Examples are specific cases you provide to the agent—work you've done, results you approve of, or negative examples you're dissatisfied with. The agent generalizes patterns from these cases and learns to make correct judgments in similar situations.

:::tip Why Are Examples More Effective Than Rules?
Rules tell the agent "penalty fees cannot exceed 20%"—this is very clear.

But if you want to teach it "what makes a good review report," it's hard to describe clearly with just rules. Show it a high-quality review report you wrote, and it immediately understands what the format, tone, and level of detail should look like.

**Rules define the "bottom line," examples define the "standard." They work best together.**
:::

## How to Give an Effective Example

### Positive Examples

Show the agent results you're satisfied with:

```
You: "This is a contract review report I wrote before. All future review reports should follow
    this format:

    -----
    [Contract Review Report]
    Contract Number: HC-2025-001
    Review Date: 2025-03-15

    I. Basic Information
    Party A: XX Technology Co., Ltd.
    Party B: YY Trading Co., Ltd.
    Contract Amount: 158,000 yuan

    II. Risk Points (2 total)
    1. [High Risk] Clause 8 penalty 30%, exceeds company standard (20%)
       Suggestion: Change to 'not exceeding 20% of contract amount'
    2. [Medium Risk] Clause 5 payment cycle 15 days, below company standard (30 days)
       Suggestion: Change to 'within 30 days after acceptance'

    III. Compliance Items (4 total)
    ✅ Warranty period 24 months (standard: ≥12 months)
    ✅ Confidentiality clause complete
    ✅ Intellectual property ownership clear
    ✅ Dispute resolution clause reasonable

    IV. Comprehensive Evaluation
    Overall risk level: Medium
    Suggestion: Can sign after revising 2 risk clauses
    -----"
```

From this example, the agent learns not just the format, but also:
- What sections the report should include
- Risk points and compliance items listed separately
- Each risk point should be labeled with level and specific suggestions
- The ending should give a comprehensive evaluation

### Negative Examples

Tell the agent what **should not** be done:

```
You: "This kind of review report is bad, don't learn from it:

    -----
    The contract is basically fine, just the penalty fee is a bit high, suggest negotiating.
    Everything else is okay.
    -----

    The problems with this report are:
    - No specific data
    - No risk level labels
    - 'Basically fine' is too vague
    - No specific revision suggestions"
```

:::warning When Giving Negative Examples, Always Explain Why
Giving negative examples without explaining why—the agent may not understand what you're dissatisfied with. Be sure to clearly point out "what's bad" and "how it should be changed."
:::

## Combining Examples with Rules

The most effective teaching method is the **rules + examples** combination:

```
Step 1 (Teach Rules):
You: "When writing weekly reports, use this structure: this week's accomplishments, next week's plans,
    support needed. No more than 5 items per section, each explained in one sentence."

Step 2 (Give Examples):
You: "For example, write it like this:

    [This Week's Accomplishments]
    1. Completed database design for Module A, passed code review
    2. Fixed login timeout issue reported by users (#1234)
    3. Aligned requirements for Feature B with product team, confirmed MVP scope

    [Next Week's Plans]
    1. Start backend development for Module A
    2. Prepare technical solution review for Feature B
    3. Optimize login module performance (target: response time < 200ms)

    [Support Needed]
    1. Design drafts for Feature B haven't come out yet, need to follow up with design team"
```

This way, the agent knows both "what the structure is" (rules) and "what it specifically looks like when written" (examples).

## Multiple Examples Help Understand Patterns

If one example isn't enough, give several examples from different scenarios to help the agent generalize more universal patterns:

```
You: "Let me show you a few more customer email replies with different styles.
    Notice how the tone adjusts based on the situation:

    Situation 1: Customer complaint (tone should be sincere, action should be quick)
    'We sincerely apologize for the inconvenience. I have arranged for the team to prioritize this issue,
     and we expect to give you feedback by 5 PM this afternoon.'

    Situation 2: Customer inquiry (tone should be professional, information should be complete)
    'Thank you for your inquiry. Regarding XX product pricing, there are currently three options:
     Plan A... Plan B... Plan C...
     You can choose based on actual needs. If you need a detailed comparison, I can organize it for you.'

    Situation 3: Customer praise (tone should be humble, guide to next step)
    'Thank you for your recognition. This is the result of our team's joint efforts. Next, we
     also plan to make improvements in XX, and will communicate with you as soon as possible.'"
```

Through three examples of different situations, the agent learns the **pattern**: reply tone should adjust based on customer emotion, rather than using a fixed template.

## Best Practices for Giving Examples

| Practice | Explanation |
|----------|-------------|
| **Combine positive and negative** | Give positive examples to show "what should be done," give negative examples to show "what should not be done" |
| **Label key points** | Clearly indicate in the example which parts are critical |
| **Cover boundaries** | Give examples of both routine and edge cases |
| **Progressive escalation** | Start with simple examples, then give complex ones |
| **Explain context** | Tell the agent what background this example was produced in |

:::info Next Step
After teaching rules and giving examples, you need to confirm whether the agent learned correctly. Go to [Learning Feedback](./05-learning-feedback.md) to learn how to check learning effectiveness.
:::
