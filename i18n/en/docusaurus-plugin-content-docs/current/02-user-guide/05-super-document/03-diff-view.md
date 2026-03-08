---
title: Diff Visualization
description: Learn how Super Document's Diff view displays AI modifications—color coding, view modes, and navigation tips.
keywords: [Diff View, Modification Comparison, Visualization, Change Tracking]
---

# Diff Visualization

Super Document's Diff view lets you clearly see what the Agent has modified. Every addition, deletion, and replacement is marked with colors, as intuitive as code diffs.

## What is Diff View

When the Agent modifies your document, Super Document doesn't directly replace the original text. Instead, it shows a comparison between before and after in Diff (difference) format. This allows you to:

- Precisely see what content was changed
- Understand the scope and impact of modifications
- Decide item by item whether to accept

## Color Coding Meanings

Diff view uses four colors to distinguish different types of changes:

| Change Type | Color | Marking Method | Meaning |
|---|---|---|---|
| **Deletion** | Red | Red background + red vertical line on left | This content was removed |
| **Addition** | Green | Green background + green vertical line on left | This is newly added content |
| **Replacement** | Red + Green combo | Red first then green, gradient transition | Original content replaced with new content |
| **Movement** | Blue | Blue background + arrow indicator | Content position has changed |

:::tip Quick Reading Tips
- Red parts are "old", green parts are "new"
- If a section has both red and green, it's a replacement—red is original text, green is modified content
- Blue arrows indicate content was moved to another location
:::

## Three View Modes

Depending on the type of modification and your reading habits, Super Document provides three view modes:

### Inline Mode

Deletions and additions are displayed on the same line. Suitable for small-range wording adjustments:

```
The implementation cycle for this plan is [-three months-]{+six months+},
requiring a team of [-5 people-]{+8 people+}.
```

> Mobile defaults to this mode.

### Side by Side Mode

Original text is shown on the left, modified content on the right. Suitable for large-scale rewrites, convenient for paragraph-by-paragraph comparison:

```
Original (Left)           |  Modified (Right)
--------------------------|---------------------------
Project started last year,|  Project started in Q3 2025,
progress is smooth.       |  80% of milestones completed.
```

> PC defaults to this mode.

### Unified Mode

Only displays the final result, with changed parts highlighted. Suitable for quickly browsing overall effect:

> This mode is also used for pre-export preview.

You can switch view modes at any time in the toolbar at the top of the editor.

## Navigating in Diff

When the Agent makes multiple changes, you can use shortcuts to quickly jump between changes:

| Action | Shortcut | Description |
|---|---|---|
| Jump to next change | `]` | Cursor moves to next change |
| Jump to previous change | `[` | Cursor moves to previous change |

:::info Change Count
The top of the editor displays the total number of pending changes (e.g., "3/12 changes"), helping you track review progress.
:::

## Reason for Change

Each change comes with a reason explanation, telling you why the Agent made this modification. A qualified reason contains three elements:

| Element | Meaning | Example |
|---|---|---|
| **Purpose** | Why the change was made | "Make expression more formal,符合商务文书规范" |
| **Basis** | What decision was based on | "Reference user preference: formal tone" |
| **Scope** | What was modified | "Only affects second paragraph, doesn't change overall structure" |

You can click the reason icon next to the change to view the full explanation. If the reason is insufficient, this can be your basis for rejecting the change.

## Next Steps

- [Review Changes](./04-review-changes.md) — Learn how to accept, reject, and edit changes
- [Version History](./05-version-history.md) — Learn how to manage document versions
