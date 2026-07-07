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

