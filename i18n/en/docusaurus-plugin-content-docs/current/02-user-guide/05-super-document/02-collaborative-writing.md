---
title: Collaborative Writing
description: Learn how to collaborate with Agents to complete document writing, from initiating tasks to multi-round iteration.
keywords: [Collaborative Writing, AI Writing, Document Editing, Multi-round Iteration]
---

# Collaborative Writing

The core experience of Super Document is **collaborating with Agents**—you describe your needs, the Agent writes the draft; you review and edit, the Agent revises. This process can be repeated iteratively until the document meets your requirements.

## How to Start a Document Writing Task

There are two ways to enter Super Document:

### Method 1: Initiate from Conversation

In a conversation with an Agent, directly describe your writing needs. When the Agent recognizes that you need to generate or modify a document, it will automatically switch to Super Document mode.

For example:

> "Help me write a weekly project report, including three features completed this week and plans for next week."

> "Make the third clause of this contract more rigorous."

### Method 2: Open an Existing Document

If you already have a document, you can open it in the Super Document editor, then send modification instructions to the Agent through the conversation panel on the right.

## Collaboration Workflow with Agents

A typical collaboration workflow is as follows:

### Step 1: Describe Your Needs

Tell the Agent what you want in the conversation area. The more specific, the better:

:::tip Good Requirement Descriptions
- "Change the second paragraph to formal business tone, but keep the original data and arguments."
- "Add a summary paragraph at the end, extracting three core points."
- "Check the entire text, fix all grammatical errors and awkward phrasing."
:::

:::warning Vague Requirement Descriptions
- "Help me fix this." (Fix what? How?)
- "Make it better." (What's the standard for "better"?)
:::

### Step 2: View Changes

After the Agent completes modifications, all changes are presented in Diff view in the document area. You can see:

- **Red marks**: Deleted content
- **Green marks**: Added content
- **Reason for change**: Each change comes with an explanation

### Step 3: Review Decisions

For each change, you can:

- **Accept** — Approve this change, let it take effect
- **Reject** — Disagree, restore original text
- **Edit** — Further adjust based on the AI's modification

### Step 4: Continue Iteration

After reviewing, you can continue the conversation and propose new modification requirements. The Agent will make the next round of modifications based on the current latest document content.

## Document Format Support

Super Document is based on Markdown format and supports the following content types:

| Content Type | Support Status | Notes |
|---|---|---|
| Headings and Paragraphs | Full Support | Multi-level headings, paragraphs, quotes |
| Lists | Full Support | Ordered lists, unordered lists, nested lists |
| Tables | Full Support | Standard Markdown tables |
| Code Blocks | Full Support | Syntax highlighting, multiple languages |
| Images | Full Support | Local and online images |
| Flowcharts | Full Support | Mermaid syntax |
| Math Formulas | Full Support | LaTeX syntax |

:::info About Export
After completing the document, you can export it as docx or PDF format for use in other scenarios. See [Version History](./05-version-history.md) for details.
:::

## Editing and Modifying

In addition to having the Agent modify through conversation, you can also directly edit document content manually in the editor. Manual edits are also recorded in version history.

**Agent modifications and manual edits can be mixed**—for example, let the Agent generate a draft, you manually fine-tune the wording, then have the Agent add a paragraph.

## Next Steps

- [Diff Visualization](./03-diff-view.md) — Deep dive into how to read the modification comparison view
- [Review Changes](./04-review-changes.md) — Learn how to efficiently review modifications
