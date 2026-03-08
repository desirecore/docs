---
title: Conversation List
description: Learn about the structure, search, grouping, and management operations of the DesireCore conversation list.
keywords: [conversation list, search, new chat, agent grouping, ConversationList]
---

# Conversation List

The conversation list is located in the middle column of the interface (290px wide) and serves as the central hub for managing all your Agent conversations.

## List Structure

The conversation list consists of two parts:

```
+----------------------------------+
|  Chat           [+]  [Search]    |  <- Header (title + action buttons)
+----------------------------------+
|  [Search box]                    |  <- Search input
+----------------------------------+
|                                  |
|  DesireCore       11:05          |  <- General Agent (top, no group title)
|  Last message preview...         |
|                                  |
|  --- Pro Agents ---              |  <- Group separator
|                                  |
|  Property Agent   Yesterday      |  <- Pro Agent list
|  Last message preview...         |
|                                  |
|  Legal Assistant  Monday         |
|  Last message preview...         |
|                                  |
+----------------------------------+
```

### Header Area

- **Title**: "Chat"
- **New Button** `[+]`: Creates a new Agent conversation, clicking opens the Agent picker
- Height aligns with the chat area header (70px)

### Conversation Items

Each conversation item contains the following information:

| Element | Description |
|------|------|
| Agent Avatar | General Agents are circular, Pro Agents are rounded square |
| Agent Name | Displayed in the upper left |
| Timestamp | Time of the last message, displayed in the upper right |
| Message Preview | Summary of the last message, single-line truncation |
| Online Status | Status dot in the lower right corner of the avatar |
| Unread Badge | Red numeric badge displayed when there are unread messages |

## Agent Grouping

The conversation list is divided into two groups by Agent type:

1. **General Agent** (e.g., DesireCore): Located at the very top of the list, no group title
2. **Pro Agent** (e.g., Property Agent, Legal Assistant, etc.): Below the "Pro Agent" separator title

This grouping allows you to distinguish system-level Agents from domain experts at a glance.

## Search Function

Click the search box or use keyboard shortcuts for quick search:

- **Search Scope**: Installed Agents (matched by name, description)
- **Real-time Filtering**: Matching results display immediately as you type
- **Keyboard Navigation**: Use up/down arrow keys to move through search results, Enter to select
- **Global Search**: The search panel can also display related results for skills, files, etc.

The search results panel replaces the conversation list area. Clear the search or press Esc to return to the conversation list.

## New Conversation

Clicking the `[+]` button in the header opens the Agent Picker:

1. Select an installed Agent
2. The system automatically creates a new conversation and switches to the chat interface
3. The Agent sends a welcome message

You can also click on an existing conversation item in the list to resume a previous conversation.

## Interaction States

Conversation items have three visual states:

| State | Appearance |
|------|------|
| Default | Transparent background |
| Hover | Light white semi-transparent background + thin border |
| Selected | White semi-transparent background + border + subtle shadow |

The currently selected conversation item is highlighted with a brighter background, letting you clearly know which Agent you are chatting with.

:::tip Conversation Persistence
DesireCore automatically saves all your conversations. When you reopen the application after closing it, both the conversation list and chat history are fully preserved.
:::
