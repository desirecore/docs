---
title: Interaction Cards Explained
description: Comprehensive guide to the 5 types of interaction cards in DesireCore conversations, their color meanings, and operation methods
keywords: [interaction cards, workflow cards, action receipts, teaching cards, learned cards, delegation cards, card types]
---

# Interaction Cards Explained

DesireCore conversations are not just simple text exchanges. When Digital Companions work, they generate various structured interaction cards, each with clear color coding and meaning. This page is your quick reference manual for understanding these cards.

## Card Overview

All function cards share a unified shell style: 18px rounded corners, semi-transparent glass material, with color-coded thin borders. You can identify the card type at a glance by its color.

| Card Type | Primary Color | Appearance Scenario | Meaning |
|---------|--------|---------|------|
| [Workflow Card](#workflow-execution-card) | Green | Digital Companion executes multi-step tasks according to plan | "I'm doing this step by step" |
| [Action Receipt](#action-receipt-card) | Green/Orange/Blue | Reports results after operation completion | "What I did and the results" |
| [Teaching Card](#teaching-card) | Purple | When you teach the Digital Companion new rules | "You taught me this" |
| [Learned Card](#learned-card) | Purple-Green Mix | Digital Companion confirms new knowledge learned | "I learned it" |
| [Delegation Card](#delegation-card) | Blue | Task is handed over to another Digital Companion | "I handed it over to a professional colleague" |

---

## Workflow Execution Card

**Primary Color: Green (#34C759)**

When the Digital Companion needs to complete a task step by step, it displays a workflow execution card.

**Visual Characteristics:**

- Light green background + green thin border
- Pulse line icon and title displayed at the top
- Steps arranged horizontally, each step contains:
  - Circular status icon (completed/in-progress/pending)
  - Step name
  - Step description
- Steps are connected by light green lines
- "Completed" status pill label may appear in the upper right corner

**What You Can Do:**

- View the execution status of each step
- Wait for the entire process to complete and view the final result
- If a step requires your confirmation, the card will prompt you to operate

:::info
Workflow cards are a visualization of the Digital Companion's autonomous planning execution path, helping you understand the Digital Companion's working thought process.
:::

---

## Action Receipt Card

**Primary Color: Changes based on result status**

Every time the Digital Companion completes an operation, it generates an action receipt to record execution evidence. Receipts are the core manifestation of DesireCore's auditability.

### Three States

| Status | Color | Label | Meaning |
|------|------|------|------|
| Success | Green (#34C759) | Completed | Operation completed successfully |
| Attention | Orange (#FF9500) | Attention | Operation completed but with items needing attention |
| Pending | Blue (#007AFF) | Pending | Operation in progress or waiting for your confirmation |

**Visual Characteristics:**

- Background and border colors change with status
- File icon + title
- Contains white semi-transparent sub-cards internally, each representing a specific operation item:
  - Left: Number pill + operation title + description
  - Right: Status pill label
- Summary area at the bottom, separated from the content above by a divider line

**What You Can Do:**

- View what was specifically done
- Understand the reasoning process
- Provide follow-up instructions for items with attention status

:::tip Value of Receipts
Receipts are the "black box" for understanding Digital Companion behavior. When you have questions about results, first check the detailed records in the receipt.
:::

---

## Teaching Card

**Primary Color: Purple (#AF52DE)**

When you teach the Digital Companion new rules, preferences, or knowledge, a teaching card appears below your message, confirming that the Digital Companion has received your teaching content.

**Visual Characteristics:**

- Light purple background + purple thin border
- Title format: `TEACH + Rule Type` (e.g., "TEACH Customer Communication Rules")
- Rule content is in a white semi-transparent box, displayed in italic text wrapped in quotes
- Appears below **your message** (because teaching is initiated by you)

**Trigger Method:**

Naturally tell the Digital Companion rules in the conversation, for example:

- "When replying to customers in the future, use a more formal tone"
- "When encountering contract clauses with amounts exceeding 100,000, mark them in red to remind me"
- "Our team's code standard is to use 2-space indentation"

DesireCore automatically recognizes this content as teaching intent without manually switching modes.

---

## Learned Card

**Primary Color: Purple + Green Mix**

When the Digital Companion confirms that your teaching content has been transformed into persistent knowledge, a learned card appears below the Digital Companion's reply.

**Visual Characteristics:**

- Light purple background + purple thin border
- Title: `LEARNED`, with green checkmark icon (indicating successful learning)
- Upper right corner: Purple pill label displaying Playbook name and version number
- Appears below **Digital Companion's message** (because learning outcomes are produced by the Digital Companion)

**What This Represents:**

The learned card means the Digital Companion has written your guidance into the Playbook (Operating Manual). This knowledge will be automatically applied in subsequent conversations and tasks.

:::warning Reversible
If you find the Digital Companion has learned incorrect rules, you can tell it "forget this rule" or "undo what you just learned".
:::

---

## Delegation Card

**Primary Color: Blue (#007AFF)**

When the General Digital Companion (DesireCore) determines that a task needs to be handled by a domain expert, a delegation card is displayed.

**Visual Characteristics:**

- Light blue background + blue thin border
- Bidirectional arrow icon
- Title format: `Delegate + Target Digital Companion Name` (e.g., "Delegate to Legal Assistant")
- Status pill label displays "Handed Over"
- Body shows the reason for delegation

**What You Can Do:**

- Understand why the task was delegated
- The delegated conversation will continue in the target Digital Companion's chat
- You can switch to the corresponding conversation at any time to view progress

---

## Card Color Quick Reference

| Color | Semantic | Corresponding Cards |
|------|------|---------|
| Green (#34C759) | Action, Success, Brand | Workflow cards, Success receipts |
| Blue (#007AFF) | System, General, Pending | Delegation cards, Pending receipts |
| Purple (#AF52DE) | Teaching, Learning, Knowledge | Teaching cards, Learned cards |
| Orange (#FF9500) | Warning, Attention Needed | Attention receipts |

Remember this simple rule: **Green = Doing, Blue = System Flow, Purple = Learning & Growth, Orange = Needs Attention**.

---

## Next Steps

- Learn how to [Select AI Model](./04-model-selection.md) for different response experiences
- Check [Chat History](./05-chat-history.md) to review past interaction cards
