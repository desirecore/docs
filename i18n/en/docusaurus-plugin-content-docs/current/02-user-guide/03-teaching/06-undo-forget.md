---
title: Undo and Forget
description: Learn how to undo the agent's recent learning, make it forget specific rules, and how to reset it to its initial state.
keywords: [undo, forget, reset, rollback, Undo, Forget]
---

# Undo and Forget

People make mistakes, and teaching is no exception. Maybe you taught a rule that wasn't quite right, or the agent misunderstood. DesireCore provides a comprehensive "regret" mechanism, allowing you to safely correct teaching content.

## Undoing Recent Operations

### Undo in Learning Feedback Card

This is the simplest way. When the agent has just learned something, there's an "Undo" button on the feedback card—just click it:

```
You: [Click ✗ Undo]
Agent: "Undone. This content will not affect my future behavior."
```

### Undo in Conversation

If you've already confirmed the learning but later found it wrong, you can undo directly in conversation:

```
You: "Undo that rule about penalty fees you just learned."
Agent: "Are you sure you want to undo the following content?

        Rule: When reviewing contracts, penalty exceeding 20% is marked as high risk
        Learning time: 10 minutes ago
        Source: This conversation

        Confirm undo?"

You: "Confirm."
Agent: "Undone."
```

## Making the Agent Forget Specific Rules

To delete a rule taught earlier:

```
You: "Forget that rule about 'emails must CC the manager' you learned before."

Agent: "Found this rule:

        Rule: Must CC manager when sending external emails
        Level: Mandatory
        Learning time: 2 weeks ago
        Source: March 1 conversation

        Confirm you want to forget this rule?"

You: "Confirm."
Agent: "Forgotten. I will no longer automatically CC the manager when sending emails in the future."
```

:::warning Forgetting is Permanent
Unlike undoing, forgetting permanently deletes the rule. If you need it again later, you'll have to re-teach it. Please confirm this is really what you want before confirming forget.
:::

### Batch Viewing and Managing Rules

If you want to systematically clean up the agent's rule library:

```
You: "List all rules about emails."

Agent: "Found 4 rules about emails:

        1. [Mandatory] External emails use formal tone
           Learning time: 1 month ago | Status: Active

        2. [Recommended] Email length controlled within 300 words
           Learning time: 3 weeks ago | Status: Active

        3. [Preference] Use 'Sincerely' at end of emails
           Learning time: 2 weeks ago | Status: Active

        4. [Mandatory] Need confirmation before sending emails to clients
           Learning time: 1 week ago | Status: Active

        What operation do you want to perform on which rule?"

You: "Delete rule 3, change rule 2's word limit to 500 words."

Agent: "Confirm the following operations:
        - Forget rule 3: Use 'Sincerely' at end of emails
        - Modify rule 2: Email length from 300 words to 500 words

        Confirm?"
```

## Resetting Agent to Initial State

:::danger This is Irreversible
Resetting will clear all the agent's learning content (rules, examples, preferences), restoring it to the state when first installed. Please confirm you really need to start from scratch before proceeding.
:::

If you want the agent to "start from zero":

```
You: "Reset all your learning content."

Agent: "⚠️ This will clear all content I have learned:
        - 42 rules
        - 15 examples
        - 8 preference settings

        After reset, I will return to initial state, and all previous teaching
        content will be lost.

        Please enter 'confirm reset' to continue."

You: "Confirm reset."

Agent: "Reset complete. All learning content has been cleared.
        You can start teaching me again."
```

### Partial Reset

You can also reset knowledge in a specific domain only:

```
You: "Only reset rules about contract review, keep everything else."

Agent: "Will reset the following content:
        - Contract review related rules: 12
        - Contract review related examples: 5

        Knowledge in other domains will be kept. Confirm?"
```

## Operation Comparison Table

| Operation | Scope | Recoverable | Applicable Scenario |
|-----------|-------|-------------|---------------------|
| **Undo** | Most recent learning | Yes (just re-teach) | Just taught and found it wrong |
| **Forget** | Specific rule | No (need to re-teach) | Delete outdated or wrong rules |
| **Modify** | Specific rule | Yes (has version record) | Adjust details of existing rules |
| **Partial Reset** | All knowledge in a domain | No | Completely redo teaching in a domain |
| **Full Reset** | All learning content | No | Start cultivating agent from zero |

:::tip Use Version History
In agent settings, you can view the change history of rules. Every modification is recorded, and you can compare different versions and restore to previous versions when necessary. This is much safer than full reset.
:::

:::info Finished Learning the Teaching Section?
Congratulations on mastering all the techniques for teaching an agent! Next, learn how to delegate tasks to your agent. Go to [Delegating Tasks](../04-delegation/01-giving-tasks.md) to start learning.
:::
