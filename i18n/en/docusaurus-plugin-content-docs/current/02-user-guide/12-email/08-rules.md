---
title: Mail Rules
description: Learn how to create mail rules that automatically classify, label, archive, and process new emails based on conditions.
keywords: [mail rules, auto-classify, filters, automation]
---

# Mail Rules

When you receive many emails daily, manual sorting is time-consuming and easy to overlook. DesireCore's mail rules system automatically performs specified actions on new emails based on conditions you define.

## How Rules Work

![Rule execution flow](/img/user-guide/email/rule-flow.svg)

Rules execute automatically during background sync—each time new emails arrive, the system matches them against rules in priority order.

## Creating Rules

### Setting Conditions

Each rule contains one or more conditions. A condition has three parts:

| Component | Description | Example |
|-----------|-------------|---------|
| **Field** | Which part of the email to match | Sender, recipient, subject, body, has attachments |
| **Operator** | How to match | Contains, does not contain, equals, starts with, ends with, regex |
| **Value** | Content to match | `newsletter@example.com`, `[Notification]` |

Multiple conditions can be combined with a logic operator:

- **All match (AND)** — Rule triggers only when all conditions are met
- **Any match (OR)** — Rule triggers when any single condition is met

### Setting Actions

When conditions are met, the following actions are available (multiple can be combined):

| Action | Description |
|--------|-------------|
| **Add label** | Apply a specified label to the email |
| **Remove label** | Remove a specified label from the email |
| **Move to folder** | Move the email to a specified folder |
| **Mark read** | Automatically mark as read |
| **Mark unread** | Mark as unread |
| **Star** | Add star/flag |
| **Archive** | Remove from inbox without deleting |
| **Forward** | Automatically forward to a specified address |
| **Delete** | Move to trash |

## Rule Examples

### Auto-Classify Subscription Emails

> **Condition**: Sender contains `newsletter` OR `noreply`
>
> **Action**: Add label "Subscriptions", mark as read

### Highlight VIP Client Emails

> **Condition**: Sender equals `vip@client.com`
>
> **Action**: Add label "VIP Client", star

### Filter Notification Emails

> **Condition**: Subject starts with `[Notification]` **AND** Sender contains `system`
>
> **Action**: Move to "Notifications" folder, mark as read

## Managing Rules

### Rule Priority

Rules execute in priority order from highest to lowest. You can reorder rules to control execution sequence.

### Stop on Match

Each rule has a `stopOnMatch` option:

- **Enabled** — After this rule matches, no further rules are checked
- **Disabled** — Even after matching, subsequent rules are still checked

:::tip When to Use "Stop on Match"
When you have a "catch-all" rule (e.g., "Label all uncategorized emails as Other"), ensure it has the lowest priority and that all preceding rules have "Stop on Match" enabled—otherwise every email gets labeled "Other."
:::

### Manual Rule Execution

In addition to automatic execution, you can manually apply a rule to existing emails. This is useful when you create a new rule and want to retroactively process historical emails.

## Next Steps

- [Sync and Offline](./09-sync-offline.md) — Learn about email sync and offline operations
- [Labels and Folders](./07-labels-folders.md) — Understand the label system for use with rules
