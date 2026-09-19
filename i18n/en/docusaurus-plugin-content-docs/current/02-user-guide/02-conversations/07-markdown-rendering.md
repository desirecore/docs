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

## Rendering Examples

The following examples show common Markdown elements in Companion replies:

**Code blocks** (with syntax highlighting and one-click copying):

````markdown
```python
def hello():
    print("Hello, DesireCore!")
```
````

**Tables** (automatically aligned, with horizontal scrolling on narrow screens):

```markdown
| Feature | Status |
|---------|--------|
| Rendering | ✅ |
| Copying | ✅ |
```

**Mermaid diagrams** (automatically rendered as visual diagrams):

````markdown
```mermaid
graph LR
    A[User input] --> B[Companion processing]
    B --> C[Return results]
```
````

**Math formulas** (typeset with KaTeX):

```markdown
Inline: $E = mc^2$
Block: $$\int_0^1 x^2 dx = \frac{1}{3}$$
```

## Troubleshooting Rendering

| Issue | What Happens | What to Do |
|-------|--------------|------------|
| Invalid Mermaid syntax | The original code block is kept instead of a diagram | Ask the Companion to correct the syntax and output it again |
| Invalid LaTeX formatting | The raw LaTeX source is displayed | Check that the `$` delimiters are paired |
| Inconsistent table column counts | Some columns may be misaligned | Make sure each row has the same number of `\|` characters |
| Unclosed code block | Subsequent content is treated as code | Make sure opening and closing triple backticks (`` ``` ``) are paired |

:::tip Practical Tips
- If a Companion's Mermaid diagram does not render, tell it: "The Mermaid syntax is invalid. Please fix it."
- To copy diagram source, use "Copy Markdown" instead of "Copy".
- Long formulas scroll horizontally inside the message bubble without breaking the layout.
:::

## Copying

| Action | Result |
|--------|--------|
| Copy | Plain text for chat or regular documents |
| Copy Markdown | Preserves headings, lists, code blocks, tables, and diagram source |

