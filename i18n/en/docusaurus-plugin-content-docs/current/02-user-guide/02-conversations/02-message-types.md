---
title: Message Type Recognition
description: Learn about the visual styles and meanings of different message types in DesireCore conversations
keywords: [message types, user messages, agent replies, system messages, message bubbles, tool calls]
---

# Message Type Recognition

There are multiple message types in DesireCore's conversation interface, each with unique visual styles to help you quickly distinguish the source and nature of messages.

## User Messages

Messages you send are displayed on the **right** side of the conversation, with a green gradient background.

**Visual Characteristics:**

- Green gradient background, white text
- Top-right corner is pointed (4px), other corners are rounded (20px), creating a visual direction pointing to the right
- Maximum width is 70% of the chat area
- Your avatar is displayed on the right

If you send an image, it is embedded and displayed in the message. If you reference a file, the file information is also displayed.

## Agent Replies

Digital Companion replies are displayed on the **left** side of the conversation, with a white semi-transparent glass material background.

**Visual Characteristics:**

- Semi-transparent white background with blur effect
- Top-left corner is pointed (4px), other corners are rounded (20px), pointing to the left avatar
- Maximum width is 78% of the chat area
- Digital Companion's avatar is displayed on the left
- Supports Markdown rich text rendering (headings, lists, code blocks, tables, etc.)

### Thinking Process

When the Digital Companion is processing your request, the header status area displays the current status:

| Status | Display | Meaning |
|------|------|------|
| Thinking | Green wave animation + "Thinking" | Digital Companion is understanding and planning |
| Using Tools | Blue animation + tool name | Currently calling a tool to execute an operation |
| Working | Orange indicator + activity description | Currently executing complex multi-step tasks |

### Tool Call Display

When the Digital Companion uses tools to complete tasks, consecutive tool calls are merged into a collapsible **Process Group**. The process group displays the Digital Companion's execution steps, and you can expand it to view detailed tool call information and thinking process.

If a reply contains both text and tool calls, they are displayed in the order they were actually produced: text explanation first, then tool execution.

## System Messages

System messages are displayed centered and used to prompt changes in conversation status.

**Visual Characteristics:**

- Centered pill-shaped label
- Semi-transparent glass material background
- Smaller font size (11px), light gray text
- Not interactive

Common system messages include:

- Session separators (displaying date and session ID)
- Status change notifications
- Operation confirmation prompts

## Error Messages

When message sending fails or the Digital Companion encounters an error, the message contains error information. You can view specific error codes and descriptions to understand the cause of the problem.

## Execution Approval Messages

When the Digital Companion needs to execute potentially risky operations, it sends you an approval request card. You can choose to approve or reject, and can also view the specific operation content. Operations that have been automatically approved by AI are marked as "Auto-approved" or "Auto-rejected".

## Heartbeat Messages

The Digital Companion's Heartbeat system periodically checks status and reports. Heartbeat messages are displayed in a special card format, containing status summaries and items that may require your attention.

## Session Separators

When you view historical messages across multiple sessions, different sessions are marked with separators displaying the session timestamp and identifier. This helps you understand the timeline of messages.

## Message Entrance Animation

New messages have a `fadeUp` animation effect sliding in from bottom to top, with each message having a slight delay offset, creating a natural conversation rhythm. Animations are not played when loading historical messages to avoid visual distraction.

## Next Steps

- Deep dive into [Interaction Cards Explained](./03-cards.md) to master the uses of various function cards
- Learn how to [Select AI Model](./04-model-selection.md)
