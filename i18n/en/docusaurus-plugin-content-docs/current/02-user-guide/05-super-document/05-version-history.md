---
title: Version History
description: Learn about Super Document's version management features—viewing history, comparing versions, and reverting to any point in time.
keywords: [Version History, Version Management, Revert, Version Comparison, Rollback]
---

# Version History

Every modification in Super Document is recorded as a version. You can view the complete modification history at any time, compare any two versions, or revert to a previous state.

## Viewing Document Version History

Click the "Version History" button in the upper right corner of the editor to open the version timeline panel. You will see:

- **Version List**: Arranged in reverse chronological order, with the latest version at the top
- **Version Summary**: Each version comes with a brief description (e.g., "Polish wording in second paragraph")
- **Operator**: Marked as Agent modification or your manual edit
- **Timestamp**: Accurate to the minute

Super Document versions are divided into three granularity levels:

| Granularity | Description | Example |
|---|---|---|
| **Patch** | Single modification operation | "Replace 'good' with 'excellent'" |
| **Turn** | All modifications in one round of conversation | "Polish paragraphs 2-4 as requested by user" |
| **Session** | All changes in one complete writing session | "Writing session on March 5, 2026 afternoon" |

You can switch between these three levels to view, choosing the appropriate granularity as needed.

## Version Comparison

Select any two versions, click the "Compare" button, and Super Document will display the differences between the two versions in Diff view:

1. Click the first version in the version list (marked as "Base")
2. Click the second version (marked as "Compare")
3. The editor area switches to side-by-side comparison view

This is particularly useful in the following scenarios:

- Viewing the complete impact of a round of modifications
- Comparing differences between two consecutive Agent modifications
- Evaluating document changes before and after a session

## Reverting to Historical Versions

If you're not satisfied with the current document, you can revert to any historical version:

1. Find the target version in the version list
2. Click "Preview" to view the complete content of that version
3. After confirmation, click "Revert to this version"

:::warning Reverting Doesn't Lose History
The revert operation itself is also recorded as a new version. This means you can always revert back to the state before the revert—no operation is irreversible.
:::

Rollback at three granularities corresponds to different scenarios:

| Rollback Granularity | Applicable Scenario | Operation |
|---|---|---|
| Undo single Patch | One change is wrong, keep the rest | Select this Patch in version history, click "Undo" |
| Revert to a Turn | A round of modifications is not good, return to previous round | Select the starting version of the target Turn, click "Revert" |
| Revert to a Session | This writing session went off track | Select the starting version of the Session, click "Revert" |

## Version Management Best Practices

:::tip Develop Good Habits
1. **Modify step by step, review step by step**: Don't ask the Agent to change too much at once. Modifications in segments are easier to track and control.
2. **Manually mark important nodes**: Add notes to satisfactory versions for easy future reference.
3. **Review before modifying**: Complete one round of review before initiating the next round of modifications to avoid version confusion.
4. **Check before exporting**: Before exporting the final document, switch to "Unified Mode" to read through the entire text.
:::

## Exporting Documents

When the document is complete, you can export it in the following formats:

| Format | Description |
|---|---|
| **docx** | Word document format, supports headings, paragraphs, lists, images, and tables |
| **PDF** | PDF generated through Markdown rendering |

Click the "Export" button in the upper right corner of the editor and select the target format.

## Next Steps

- [Super Document Overview](./01-overview.md) — Review the core concept of Super Document
- [Agent Management](../06-agents/01-agent-types.md) — Learn how to manage your Agents
