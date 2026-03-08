---
title: Managing Conversations
description: Learn how to create, switch, delete conversations and manage conversation context in DesireCore
keywords: [managing conversations, new conversation, delete conversation, clear context, conversation list, conversation switching]
---

# Managing Conversations

DesireCore organizes conversations by Companion — each Companion corresponds to an independent conversation window. You can quickly switch and manage these conversations in the conversation list.

## Conversation List

The left panel (290px wide) displays all your conversations.

### List Structure

The conversation list is divided into two areas by Companion type:

- **General Companion** — Located at the top of the list, no group title. Such as DesireCore general assistant
- **Pro Companion** — Below the "Pro Agent" separator title. Such as Legal Assistant, Property Agent, etc.

### Conversation Item Information

Each conversation item displays:

- Companion avatar (General is circular, Pro is rounded square)
- Companion name
- Preview of the last message
- Time of the last message
- Unread message badge (red circle, showing unread count)

### Switching Conversations

Click an item in the conversation list to switch to that Companion's conversation. When switching:

- Right chat panel content automatically updates
- Unread count of the target conversation is cleared
- Message list automatically scrolls to the bottom
- Messages enter with `fadeUp` animation sequentially

## New Conversation

Click the "+" button in the conversation list header to create a new conversation. After creating a new conversation, it automatically switches to that conversation window.

:::info
In DesireCore, conversations correspond one-to-one with Companions. Creating a new conversation is essentially starting to interact with a new or existing Companion.
:::

## Clear Chat History

If you want to clear all conversation records with a Companion:

1. Click the "More" button (three dots icon) in the chat header
2. Select "Clear Chat History" from the popup menu
3. After confirmation, all historical messages with that Companion will be cleared

:::warning
Clearing chat history is irreversible. Historical messages cannot be recovered after clearing, but knowledge the Companion has learned (Playbook) is not affected.
:::

## Delete Conversation

If you want to completely delete a Companion and its conversation:

1. Click the "More" button in the chat header
2. Select "Delete Agent"
3. You can choose whether to also delete run records
4. After confirmation, the Companion and conversation are removed from the list

## Conversation Context

DesireCore conversations support context continuation across sessions:

- **Same Companion** conversations automatically load historical context
- The Companion can reference previous conversation content and learning outcomes
- Each session has an independent Run ID, but shares the Companion's long-term memory

### Topic Recovery

If the Companion was previously processing a topic (Matter), you can view unfinished topics through the running status panel and choose to resume and continue processing.

## Online Status

Each Companion in the conversation list displays an online status indicator:

| Status | Indicator | Meaning |
|------|------|------|
| Online | Green dot + breathing animation | Companion started, ready to interact at any time |
| Working | Orange dot | Companion is executing tasks |
| Offline | Gray dot | Companion not started |

If the Companion is offline, a power-on button is displayed in the chat header, clicking it starts the Companion.

## Next Steps

- Return to view detailed operations for [Sending Messages](./01-sending-messages.md)
- Understand the meanings of [Interaction Cards](./03-cards.md)
- Have questions? Check [FAQ](../../06-faq/index.md)
