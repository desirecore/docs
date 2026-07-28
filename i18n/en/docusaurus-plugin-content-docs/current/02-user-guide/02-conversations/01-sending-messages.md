---
title: Sending Messages
description: Learn how to send text, images, files, and use shortcuts and slash commands in DesireCore
keywords: [sending messages, text input, image upload, file reference, screenshot, slash commands, keyboard shortcuts]
last-reviewed: 2026-07-23
---

# Sending Messages

DesireCore's input area supports multiple message sending methods, including text, image upload, file reference, and screenshots. This chapter introduces all the sending methods and shortcuts you can use.

## Text Messages

Type directly in the input box at the bottom of the chat interface to send messages to your Digital Companion.

- The input box automatically expands in height as text increases, up to a maximum of 120px
- Press `Enter` to send message (default shortcut, can be modified in settings)
- Press `Shift + Enter` for a new line

:::tip Custom Shortcuts
Send and newline shortcuts can be customized in "Settings > Keyboard Shortcuts". For example, you can change send to `Ctrl + Enter` and set `Enter` for newline.
:::

### Quick History Recall

Similar to terminal history commands, press the `Up` arrow key in the input box to quickly recall messages you previously sent. Press the `Down` arrow key to move forward to more recent messages, until you return to the current input draft.

## Image Upload

You can send images to your Digital Companion in the following ways:

1. **Click Image Button** — The image icon on the left side of the input box, clicking opens the system file picker, supports selecting multiple images
2. **Paste Image** — Directly use `Ctrl/Cmd + V` in the input box to paste images from the clipboard
3. **Drag and Drop Image** — Drag image files into the input box area

Uploaded images are displayed as thumbnails above the input box. You can:

- Click the thumbnail to view a larger preview
- Hover over the thumbnail and click the close button in the upper right corner to remove the image
- View upload progress and compressed file size before sending
- When editing a sent user message, remove existing images or add new ones

:::info Supported Image Formats
Common image formats are supported, including JPEG, PNG, WebP, GIF, etc. Images are sent to the AI model in Base64 encoding for visual understanding.
:::

## Screenshot

Click the screenshot button on the left side of the input box, or use the screenshot shortcut, to enter area selection screenshot mode. After selecting an area, you can annotate it, and the completed screenshot is automatically added to the image list in the input box.

:::tip
Even if you are not on the chat page (such as on the settings page), after taking a screenshot, it will automatically be added to the input area of the current conversation, and a prompt will pop up informing you that the screenshot has been added.
:::

## File Reference

Click the "+" button on the left side of the input box to open the system file picker to reference files or folders:

- **Select File** — The file path is displayed as a tag above the input box, and the Digital Companion can see which local files you have referenced
- **Select Folder** — The folder is added as a Working Directory, and the Digital Companion can operate files within that directory

File reference tags support hovering to view the full path, and can also be removed by clicking the close button.

### Editing References in a Sent Message

For a sent **text + document references** message, hover over the message and select **Edit**. You can edit the text and the reference list together:

- Remove one or every document reference with the close button on its chip
- After removing a reference, use the dashed **+** button to select one or more documents again
- Newly selected files are deduplicated by path; directories are not added as document references
- Confirm an edit even when only the reference list changed and the text did not

DesireCore resends the message with the edited text and authoritative document-reference list. Canceling keeps the original message and references unchanged. This control is available for messages that already contained document references; use the input area to add references to a new message.

:::warning Difference Between File Reference and Image Upload
"File Reference" only tells the Digital Companion the path of the file you referenced, and the Digital Companion will read it itself. "Image Upload" actually reads the image content and sends it to the AI model. If you want the AI to analyze an image, please use image upload instead of file reference.
:::

### Dragging into the Chat Area

When you drag local files or folders over the chat area, it becomes highlighted. After you drop them:

- Images are added as image attachments
- Other files are added as file references
- Folders are added as Working Directories

## Switching Working Directories

The working-directory pill below the input and the resource panel show agent directories, global directories, and shared directories for teams the current agent belongs to.

- Clicking an agent or global directory makes it the primary directory for normal conversations.
- Clicking a team shared directory activates that team for the specific conversation. The input pill then shows the directory with a Team label, and the resource button in the upper-right shows a team badge. Click the same team again to leave the team scope.
- Team directories are not read-only labels. On the next message, DesireCore sends the corresponding `teamId` for backend validation; only a validated directory becomes the real cwd.
- Directory scope cannot change while the agent is running, which prevents relative paths and file permissions from changing mid-execution.

Team selection is independent for each conversation. In manual multi-conversation mode, different conversations with the same agent can use different team directories.

When a team is created, DesireCore automatically establishes one shared-directory binding for the team. The supervisor, initial members, later-added members, and a replacement supervisor all inherit that same directory from team membership; non-members do not see it. If the directory cannot be bound, team creation fails instead of leaving a team without a shared directory.

## Slash Commands

Typing `/` (slash) in the input box pops up the command auto-completion menu. Slash commands let you quickly call system functions and Digital Companion skills.

### Command Navigation

- `Up/Down` arrow keys — Move up and down in the command list
- `Tab` or `Enter` — Select the currently highlighted command
- `Esc` — Close the command menu

### Command Types

| Type | Syntax | Description |
|------|------|------|
| System Commands | `/command_name` | Built-in functions, such as `/help`, `/skill`, `/new`, and `/compact` |
| Skill Invocation | `/skill:skill_name` | Call installed skills |
| Quick Invocation | `/skill_name` | Directly input skill name for quick calling |

After typing `/skill:`, the list of skills available to the current Digital Companion is automatically displayed, and continuing to input filters the matches.

### Built-in System Commands

| Command | Purpose |
|---------|---------|
| `/new` | Start a new conversation, isolated from the current context |
| `/compact` | Manually compact the current conversation history to free up context space |
| `/steer` | Inject a guiding message while the Companion is thinking (without interrupting generation) |
| `/help` | View the full list of available commands |

If you want the agent to write a Plan without executing, say so naturally—for example, “Write the Plan first; do not execute yet.” Plans are versioned files in the working directory and do not require a mode or special command. See [Plan Files and Natural Collaboration](../04-delegation/02-plan-confirmation.md).

## Shortcut Quick Reference

| Action | Default Shortcut (macOS) | Default Shortcut (Windows/Linux) |
|------|-------------------|--------------------------|
| Send Message | `Enter` | `Enter` |
| New Line | `Shift + Enter` | `Shift + Enter` |
| Open Command Menu | `/` | `/` |
| Cancel/Close | `Esc` | `Esc` |
| Screenshot | Configurable in settings | Configurable in settings |
| Paste Image | `Cmd + V` | `Ctrl + V` |

The bottom of the input box also displays current shortcut hints for easy reference.

## Next Steps

- Learn about [Message Type Recognition](./02-message-types.md) to distinguish messages from different roles
- Check out [Interaction Cards Explained](./03-cards.md) to understand the various cards in Digital Companion replies
