---
title: Sending Messages
description: Learn how to send text, images, files, and use shortcuts and slash commands in DesireCore
keywords: [sending messages, text input, image upload, file reference, screenshot, slash commands, keyboard shortcuts]
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

:::warning Difference Between File Reference and Image Upload
"File Reference" only tells the Digital Companion the path of the file you referenced, and the Digital Companion will read it itself. "Image Upload" actually reads the image content and sends it to the AI model. If you want the AI to analyze an image, please use image upload instead of file reference.
:::

## Slash Commands

Typing `/` (slash) in the input box pops up the command auto-completion menu. Slash commands let you quickly call system functions and Digital Companion skills.

### Command Navigation

- `Up/Down` arrow keys — Move up and down in the command list
- `Tab` or `Enter` — Select the currently highlighted command
- `Esc` — Close the command menu

### Command Types

| Type | Syntax | Description |
|------|------|------|
| System Commands | `/command_name` | Built-in functions, such as `/help`, `/skill`, etc. |
| Skill Invocation | `/skill:skill_name` | Call installed skills |
| Quick Invocation | `/skill_name` | Directly input skill name for quick calling |

After typing `/skill:`, the list of skills available to the current Digital Companion is automatically displayed, and continuing to input filters the matches.

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
