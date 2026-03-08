---
title: Chat History
description: Learn how to view, search, and navigate historical conversation records in DesireCore
keywords: [chat history, chat records, search, session, historical messages, infinite scroll]
---

# Chat History

DesireCore saves all your conversation records with each Digital Companion. You can review past interactions at any time, search for specific content, or locate a specific historical message.

## Viewing Historical Conversations

There are two ways to view historical records:

### Method 1: Scroll in Conversation

In the current conversation interface, scroll up to load earlier messages. DesireCore uses an **Infinite Scroll** mechanism:

- Automatically loads more historical messages when scrolling to the top
- Loading animation appears at the top during loading
- Different sessions (Sessions) are marked with time separators

:::tip
Historical messages do not play entrance animations after loading to avoid visual distraction. Only new messages have the `fadeUp` entrance effect.
:::

### Method 2: Chat History Panel

Click "Chat History" in the "More" menu in the chat header to open the chat history panel.

**Chat History Panel** is a drawer-style panel sliding in from the right, listing historical record summaries by session:

- Each record displays: preview text, message count, creation time
- Click "Locate in Chat" to jump directly to the corresponding position in the conversation
- Supports deleting entire session records

## Searching Historical Messages

Click the search button in the chat history panel, or enter the chat history search modal through the More menu for full-text search.

**Search Function Features:**

- Real-time search, instant filtering as you type
- Supports filtering by category: All, Images, Files, Tool Calls
- Search results display matching message content previews
- Supports Markdown rendering preview, content fades at the bottom when too long
- Each search result can be clicked to "Locate in Chat" to jump

### Category Filtering

| Category | Description |
|------|------|
| All | Display all types of messages |
| Images | Only display messages containing images |
| Files | Only display messages containing files |
| Tool Calls | Only display messages where the Digital Companion used tools |

## Message Location

After clicking "Locate in Chat" from search results or the history panel:

1. The conversation area automatically scrolls to the target message
2. The target message has a highlight flash effect (lasting about 2 seconds)
3. The search modal automatically closes

## Session Separators

When viewing historical messages in the merged view, different sessions are marked with separators:

- Display session timestamps
- Label session IDs
- Help you understand the time context of messages

## Next Steps

- Learn how to [Manage Conversations](./06-managing-conversations.md), including creating new, deleting, and clearing context
