---
title: Chat Area
description: Learn about the header information, message list, input box, and various interaction features in the DesireCore chat area.
keywords: [chat area, message input, message bubble, model selection, ChatArea, slash commands]
---

# Chat Area

The chat area is your main workspace for interacting with Agents, occupying most of the space on the right side of the interface.

## Area Structure

```
+------------------------------------------+
|  [Avatar] Agent Name · Online            |  <- Header (70px)
|                    [Interact] [Buttons] [More] |
+------------------------------------------+
|                                          |
|    [Agent Avatar]  Hello, how can I help?|  <- Agent message (left)
|                                          |
|            I want to learn about contract review [My Avatar] |  <- User message (right)
|                                          |
|    [Agent Avatar]  Okay, let me analyze... |
|                                          |
+------------------------------------------+
|  Query Summary Bar                        |  <- Displayed when not thinking
+------------------------------------------+
|  [+] [Img] [Scr] [Type text...]   [Send] |  <- Input area
|         / commands  Enter send  Shift+Enter newline |
+------------------------------------------+
```

## Header Information Bar

The header is 70px high and contains Agent information and action buttons.

### Left: Agent Information

- **Avatar**: General Agents are circular, Pro Agents are rounded square, colors vary by Agent
- **Name**: 15px bold font
- **Running Status**: Current status indicator of the Agent

| Status | Dot Color | Description |
|------|---------|------|
| Online | Green + breathing animation | Agent ready, can receive instructions |
| Working | Orange | Currently executing tasks or thinking |
| Using Tools | Blue | Currently calling external tools |
| Offline | Gray | Agent not started, click "Start" button to power on |

- **Description**: Brief introduction text of the Agent

### Right: Action Button Group

Buttons from left to right:

| Button | Function |
|------|------|
| **Immersive Interaction** | Flip to Digital Avatar 3D interface |
| **Agent Profile** | View detailed configuration information of the current Agent |
| **Resource Management** | Manage Agent files and resources |
| **Running Status** | View currently running tasks and historical topics |
| **Publish/API** | Publish Agent or view API access information |
| **More** | Expand more actions (chat history, clear history, delete Agent, etc.) |

:::info Compact Mode
When the chat area width is less than 640px, the middle buttons are automatically moved to the "More" menu, leaving only the "More" button to avoid interface clutter.
:::

## Message List

The message list is the core area of the chat, supporting scrolling through historical messages.

### Message Types

**Agent Messages** (Left):
- With Agent avatar (28x28)
- Semi-transparent white glass bubble
- Top-left corner is right-angled, other corners rounded, creating a visual effect pointing to the avatar
- Can contain rich content such as text, code blocks, function cards, etc.

**User Messages** (Right):
- Green gradient background, white text
- Top-right corner is right-angled, other corners rounded
- Supports plain text and image attachments

**System Messages** (Center):
- Pill shape
- Semi-transparent glass material
- Used for time separators, status prompts, etc.

### Function Cards

In conversations, Agents may return various function cards:

- **Workflow Cards** (green border): Display task execution steps and progress
- **Action Receipt Cards** (green/orange/blue borders): Display operation results (success/warning/pending)
- **Teaching Cards** (purple border): Display rules you have taught the Agent
- **Learned Cards** (purple border): Confirm content the Agent has learned
- **Delegation Cards** (blue border): Display task flow between different Agents

### Message Animation

New messages enter with a **fadeUp** animation — fading in and rising from 8px below, with each message appearing sequentially at 40ms intervals, creating a smooth conversation experience.

## Input Area

The input area is located at the bottom and has rich input capabilities.

### Text Input

- Auto-expanding text box, minimum one line, maximum height 120px
- Border turns green with outer glow effect when focused
- Supports multi-line input

### Left Buttons

| Button | Function |
|------|------|
| **+** | Add file or folder reference |
| **Image** | Upload image (supports JPEG, PNG, WebP) |
| **Screenshot** | Area selection screenshot and annotation |

### Send Button

Green circular button (36x36), click or press shortcut to send message. Button turns gray and disabled when there is no content.

### Keyboard Shortcuts

| Action | Default Shortcut |
|------|-----------|
| Send Message | `Enter` |
| New Line | `Shift + Enter` |
| Slash Commands | Input `/` to summon command panel |
| History Recall | `Up Arrow` recalls last sent message |

### Slash Commands

Typing `/` in the input box pops up the command auto-completion panel, allowing you to quickly use:

- `/skill:skill_name` — Call a specific skill
- `/skill_name` — Direct shortcut syntax to call a skill
- Other built-in commands

Use up/down arrow keys to navigate, Tab or Enter to confirm selection, Esc to close the panel.

### Images and Files

You can attach images in the following ways:

- Click the image button to select files
- Directly **paste** images into the input box (Ctrl/Cmd + V)
- **Drag and drop** images into the input area

Attached images are displayed as thumbnails above the input box. Hover to delete, click to preview larger image.

:::warning File Reference vs Image Upload
The "+" button adds files as **path references** — only telling the Agent where the file is; the image button is **actual upload** — the Agent can see the image content.
:::
