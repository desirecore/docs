---
title: Markdown and Chart Rendering
description: Learn how DesireCore renders Markdown, Mermaid, KaTeX, local file paths, and chart previews.
keywords: [Markdown, Mermaid, KaTeX, LaTeX, charts, formulas, file links]
---

# Markdown and Chart Rendering

Companion replies are rendered as rich Markdown. Headings, lists, tables, code blocks, formulas, and diagrams can be read directly in the chat, and copied either as plain text or as Markdown.

## Supported Content

| Content | Behavior |
|---------|----------|
| Markdown | Headings, lists, tables, and code blocks are formatted automatically |
| Mermaid | Rendered as diagrams with fullscreen preview |
| KaTeX / LaTeX | Inline and block math are typeset |
| `.md` paths | Trusted assistant replies can expose clickable local Markdown paths |
| Images | Image attachments can be previewed and exported |

## Mermaid Diagrams

Mermaid blocks are rendered inline. Click a diagram to open fullscreen preview, then zoom with the wheel, drag to pan, or reset the view to fit the screen.

If rendering fails, DesireCore keeps the original code block so you can ask the Companion to fix it.

## Math Formulas

DesireCore supports common LaTeX syntax:

- Inline: `$E = mc^2$`
- Block: `$$\int_a^b f(x) dx$$`

Long formulas scroll inside the message bubble instead of breaking the layout.

## Copying

| Action | Result |
|--------|--------|
| Copy | Plain text for chat or regular documents |
| Copy Markdown | Preserves headings, lists, code blocks, tables, and diagram source |

