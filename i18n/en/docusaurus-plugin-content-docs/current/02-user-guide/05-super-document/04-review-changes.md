---
title: Review Changes
description: Learn how to review Agent changes item by item in Super Document—accepting, rejecting, editing, and batch operations.
keywords: [Review, Accept Changes, Reject Changes, Batch Operations, Item-by-item Review]
---

# Review Changes

Review is the core interaction of Super Document. After the Agent proposes modifications, you can review each change item by item, deciding whether to accept, reject, or further edit.

## Review Mode Introduction

When the Agent completes modifications, Super Document automatically enters review mode. At this time:

- All changes are highlighted in Diff form
- The first change is automatically selected
- A review progress bar is displayed at the top of the editor (e.g., "0/8 reviewed")
- Operation buttons appear next to each change

You can start reviewing from any change, not necessarily in order.

## Accept/Reject Single Changes

For each change, you have three options:

### Accept

Click the green "Accept" button (or press `Enter`), and the change takes effect immediately:

- If it's added content, the green highlight disappears, content merges into the main text
- If it's deleted content, the red-marked content is removed
- If it's a replacement, original text is replaced with new content

### Reject

Click the red "Reject" button (or press `Backspace`), restoring the original text:

- Added content is removed
- Deleted content is restored
- Replaced content is restored to original text

### Edit

Click the "Edit" button (or press `E`), manually adjusting based on the Agent's modification:

1. The change enters editable state
2. You can modify the text content
3. Press `Esc` to cancel editing, press `Enter` to confirm

:::tip When to Use Edit?
When the Agent's modification direction is correct, but the wording needs fine-tuning—for example, AI changed "good" to "excellent", but you think "outstanding" is more appropriate.
:::

## Batch Operations

If there are many changes, you can use batch operations to improve efficiency:

| Operation | Shortcut | Description |
|---|---|---|
| Accept All | `Ctrl+Shift+Enter` | One-click acceptance of all pending changes |
| Reject All | `Ctrl+Shift+Backspace` | One-click rejection of all pending changes |

:::warning Use Batch Operations with Caution
Batch accept or reject operations can be undone (`Ctrl+Z`), but it's recommended to at least quickly browse through them before deciding.
:::

You can also review important changes item by item first, then use batch operations for the remaining changes.

## Adding Comments and Feedback

During review, you can add comments to specific changes. These comments are passed to the Agent as reference for the next round of modifications:

1. Select a change
2. Click the "Comment" button
3. Enter your feedback, for example: "This change is too formal, keep the original tone."
4. The Agent will reference your comments in the next round of modifications

:::info Comments Aren't Just for the Agent
Comments are also preserved in version history. If you use Super Document in a team, others can see your review comments.
:::

## Shortcut Quick Reference

| Operation | Shortcut |
|---|---|
| Accept current change | `Enter` |
| Reject current change | `Backspace` |
| Edit current change | `E` |
| Accept all | `Ctrl+Shift+Enter` |
| Reject all | `Ctrl+Shift+Backspace` |
| Jump to next change | `]` |
| Jump to previous change | `[` |

## Next Steps

- [Version History](./05-version-history.md) — Learn how to view and manage document version history
- [Collaborative Writing](./02-collaborative-writing.md) — Review the complete collaboration workflow
