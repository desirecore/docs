---
title: Review Changes
description: Learn how to review Agent changes item by item in Super Document—accepting, rejecting, and batch operations.
keywords: [Review, Accept Changes, Reject Changes, Batch Operations, Item-by-item Review]
---

# Review Changes

Inspect the Agent's changes in the review panel. Accept the changes you want to keep and reject the others.

## Open the Review Panel

When the Agent proposes changes, the document highlights the differences. Wait for output to finish before confirming changes; review buttons are unavailable while output is streaming.

1. Find the collapsed floating review panel in the document area.
2. Click the pending review count to expand its controls.
3. Select a change to inspect, then use the accept or reject button.

The pending review count shows how many changes remain. You can review them in any order; start with passages that have the greatest impact.

| View | Where differences appear |
|---|---|
| Inline | In the document text |
| Side-by-side | In a separate diff panel |

Each change batch uses one review interface. With focus inside the panel, press `Esc` to collapse it and return focus to its entry. You can review changes in any order.

## Accept/Reject Single Changes

Inspect the difference, then accept or reject it. For a revision, describe the change you need to the Agent.

### Accept

Click the green "Accept" button, and the change takes effect immediately:

- If it's added content, the green highlight disappears, content merges into the main text
- If it's deleted content, the red-marked content is removed
- If it's a replacement, original text is replaced with new content

### Reject

Click the red "Reject" button, restoring the original text:

- Added content is removed
- Deleted content is restored
- Replaced content is restored to original text

### Request Further Changes

If a change has the right direction but needs different wording, identify the passage and the revision you need in the conversation. Confirm the current changes before asking the Agent to continue; review the next suggestions as well.

You can also edit the document text directly. Saving is unavailable while review items remain or the Agent is still streaming; save your manual edits after review is complete.

## Batch Operations

In inline mode, expand the review panel when more than one item is pending and the Agent has finished output. Batch buttons are available there.

| Action | Result |
|---|---|
| Click **Accept All** | Accept all pending changes |
| Click **Reject All** | Reject all pending changes and restore their original text |

Inspect important changes first, then handle the remaining items. If a button is unavailable, wait for Agent output and the current review operation to finish before trying again.

When there are only a few changes, review them one by one. For a larger set, scan the document first, review important passages individually, then batch-accept or batch-reject the rest when the same decision applies. A batch action affects every pending item, so check them before clicking.

## Give Revision Feedback

In the same conversation, identify the passage and the change you need, for example: “The second paragraph is too formal; keep the original tone.” The Agent can use that instruction for the next revision.

## Keyboard Navigation

Use `Tab` to focus a review button and `Enter` or Space to activate that button. Press `Esc` inside the floating review panel to collapse it. In the document editor, `Enter` and `Backspace` continue to edit text.


## Keyboard controls

| Key | Action |
|---|---|
| Tab | Focus the next review control |
| Enter or Space | Activate the focused button |
| Esc | Collapse the focused review panel |
| Enter / Backspace in the document | Insert a line break / delete the character before the cursor |

## Save or Continue Editing

1. Check that all pending review items have been handled.
2. Use the editor's save action or `Cmd/Ctrl + S` to save the document.
3. To continue editing, give the next instruction in the same conversation or edit the text directly.

If saving reports pending review items, accept or reject those changes first. Saving is also unavailable while the Agent is still streaming; wait for output to finish.

Use **History** to revisit earlier content. See [Version History](./05-version-history.md).

## Next Steps

- [Version History](./05-version-history.md) — Learn how to view and manage document version history
- [Collaborative Writing](./02-collaborative-writing.md) — Review the complete collaboration workflow
