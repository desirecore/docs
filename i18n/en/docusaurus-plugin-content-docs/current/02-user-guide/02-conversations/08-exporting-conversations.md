---
title: Exporting Conversations
description: Export DesireCore conversations as Markdown or PDF with control over scope and detail.
keywords: [conversation export, Markdown export, PDF export, multi-select, chat history]
---

# Exporting Conversations

You can save conversations as Markdown or PDF for archiving, sharing, reports, or further editing.

## Entry Points

Open the chat header menu and choose Export Conversation. If multi-select mode is active, you can export the selected run range.

Before exporting, choose:

- Format: Markdown or PDF
- Scope: current session, full history, or selected run range
- Tool calls: hidden, summarized, or fully expanded
- Whether to include thinking / system details
- Whether to embed image attachments

:::info Multi-select scope
Multi-select export groups messages by their run so tool results, context, and image references remain complete. It is not a naive line-by-line message concatenation.
:::

## Markdown vs PDF

Markdown is best when you want to keep editing. PDF is best for sharing with people who do not need the source structure.

Desktop PDF export uses the unified document rendering pipeline and preserves common Markdown structures such as headings, tables, code blocks, images, and formulas.

## Step-by-Step Instructions

### Export a Full Conversation

1. Open the target Companion's chat.
2. Click the "More" button (three dots) on the right side of the chat header.
3. Choose "Export Conversation" from the menu.
4. In the export settings panel, select the full-history scope, a format (Markdown / PDF), and content options.
5. Confirm the export. The file is saved to your system's Downloads folder or the location you specify.

### Export Selected Messages

1. Choose "Multi-select" from the chat header's "More" menu to enter multi-select mode.
2. Check the messages you want to export using the checkboxes on their left.
3. Click "Export" in the bottom action bar.
4. Choose a format and content options, then confirm.

:::tip Export Scope
Multi-select export groups selected messages by run (a complete request-response cycle) to preserve context. For example, selecting a Companion reply also includes its corresponding user question and tool calls in the export.
:::

## Next Steps

- Learn about searching and locating messages in [Chat History](./05-chat-history.md).
- Use [Context Control](./09-context-control.md) to manage long conversations.
