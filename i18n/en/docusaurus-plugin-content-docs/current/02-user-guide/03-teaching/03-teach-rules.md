---
title: Teaching Rules (Teach)
description: Learn how to teach effective rules to your agent through natural language, including rule hierarchies, characteristics of good rules, and common teaching pitfalls.
keywords: [Teach, teaching rules, behavioral norms, rule hierarchy, teaching]
---

# Teaching Rules (Teach)

Teaching rules is the most direct teaching method—using natural language to tell the agent "when encountering this situation, do this."

## What Are Rules

Rules are behavioral guidelines you tell the agent. Each rule answers a core question: **In what situation, do what, and why.**

When you say to the agent:

> "When writing emails, if it's for clients, use a formal tone; if it's for internal team members, it can be more casual."

This is teaching a rule. The agent will record this rule in its behavior manual, and automatically apply it for all future email-related tasks.

## How to Teach a Good Rule

Good rules have three characteristics: **Specific, Executable, and Bounded.**

:::tip Good Rules vs. Vague Rules

**Good Rule—Specific, Executable**:
> "When reviewing contracts, if the penalty percentage exceeds 20% of the total contract amount, mark it as 'high risk' and provide revision suggestions in the review report."

**Vague Rule—Not Specific, Hard to Execute**:
> "Pay attention to penalty fees when reviewing contracts."

---

**Good Rule—Has Clear Boundaries**:
> "When replying to client emails, use a formal tone and avoid internet slang and emojis. But if the client uses a casual tone first, you can relax appropriately."

**Vague Rule—No Boundaries**:
> "Make the email a bit more formal."

---

**Good Rule—Explains "Why"**:
> "Numbers in financial reports must be kept to two decimal places because this is a company financial policy requirement that will be checked during audits."

**Vague Rule—Only "What" Without "Why"**:
> "Keep numbers to two decimal places."
:::

### Formula for Good Rules

```
When [trigger condition], execute [specific action], because [reason].
If [exception situation], then [alternative solution].
```

**Example**:

> "When the received contract amount exceeds 500,000 yuan, manual confirmation must be triggered (cannot be automatically approved), because company regulations require large contracts to be approved by the Chief Legal Officer. If it's a contract renewal with exactly the same terms as the previous one, it can be downgraded to regular confirmation."

## Rule Hierarchy

Not all rules are equally important. DesireCore supports three levels of rules:

| Level | Meaning | Agent Behavior | Applicable Scenario |
|-------|---------|----------------|---------------------|
| **Mandatory** | Must be followed, cannot be violated | Will execute regardless, violation triggers alerts | Safety red lines, compliance requirements |
| **Recommended** | Follow by default, can be flexible in special cases | Usually executes, but asks you when conflicts arise | Business best practices |
| **Preference** | Your personal preference, not a hard requirement | Tries to follow, but won't affect task completion | Format preferences, style preferences |

### How to Specify Levels

You can naturally express levels when teaching rules:

```
Mandatory rules: "Never send emails without my confirmation."
                 "Confidentiality clauses in contracts are mandatory and cannot be deleted."

Recommended rules: "Review reports are best presented in table format."
                   "Generally, handle urgent tasks first."

Preference rules: "I prefer using Markdown format."
                  "If possible, write reports in Chinese."
```

:::warning Note
If you don't explicitly specify a level, the agent will automatically judge based on tone and context. Words like "must," "never," and "prohibited" will be recognized as mandatory rules; words like "better," "generally," and "if possible" will be recognized as recommended or preference rules.
:::

## Common Scenarios for Teaching Rules

### Scenario 1: Teaching Business Rules

```
You: "When helping me review contracts, pay attention to the following rules:
    Mandatory: Payment terms must be 'payment within 30 days after acceptance,' no prepayment accepted
    Mandatory: Contract term not exceeding 3 years
    Recommended: Penalty clauses should be reciprocal, not just binding on us
    Preference: Contract summary in table format"
```

### Scenario 2: Teaching Communication Style

```
You: "When writing reports in the future:
    - Start with the conclusion directly, no preamble
    - Speak with data, use fewer adjectives
    - If there's anything uncertain, clearly mark it
    - Don't use openings like 'Dear leaders'"
```

### Scenario 3: Teaching Exception Handling

```
You: "If a client requests early delivery:
    1. First assess if there are sufficient resources
    2. If the gap is within 1 week, you can agree directly
    3. If the gap exceeds 1 week, you need to tell me and wait for my confirmation
    4. In any case, don't directly refuse the client"
```

## Viewing Taught Rules

You can view all rules the agent has learned at any time:

- In conversation: **"List all the rules you've learned"** or **"Show rules related to contract review"**
- In agent settings, view the **Behavioral Norms** section

The agent will display all rules in a clear list, noting the source (which conversation it was taught in) and level.

:::info Rules Can Also Be Modified
Taught rules are not set in stone. You can always say "Change that rule about penalty fees to 25%" or "Delete the preference about email format." See [Undo and Forget](./06-undo-forget.md) for details.
:::

## Common Pitfalls in Teaching Rules

| Pitfall | Problem | Suggestion |
|---------|---------|------------|
| Teaching too much at once | Agent has difficulty distinguishing rule priorities | Focus on one topic each time, teach in batches |
| Conflicting rules | Agent doesn't know which rule to follow | Review existing rules before teaching, ensure consistency |
| Only "what" without "why" | Agent cannot flexibly handle edge cases | Explain the reason for each rule |
| Rules too general | Agent's interpretation may differ from your expectations | Be as specific as possible, examples work better |

:::tip Next Step
Rules work better with examples. Go to [Giving Examples (Demonstrate)](./04-demonstrate.md) to learn how to reinforce the agent's understanding through concrete cases.
:::
