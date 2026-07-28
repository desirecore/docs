---
title: What is Super Document
description: Learn about the core concept of DesireCore Super Document—reviewing documents like Code Review, making AI collaborative writing transparent and controllable.
keywords: [Super Document, Diff, Collaborative Writing, AI Writing]
---

# What is Super Document

Have you used Code Review? After developers submit code, colleagues review it line by line, accepting or rejecting each change. **Super Document** brings this decades-proven collaboration mechanism to document writing—AI writes, you review.

## Core Concept: Review Documents Like Code Review

The problem with traditional AI writing tools is that AI gives you a large block of text, and you don't know what it changed or why. Accept or rewrite? You can only guess.

Super Document takes a completely different approach:

| Traditional AI Writing | Super Document |
|---|---|
| AI outputs an entire document, you find differences yourself | Every change made by AI is marked |
| Can only accept or rewrite entirely | Can accept, reject, or edit item by item |
| Don't know why AI made these changes | Each change comes with a reason |
| If it's wrong, start over from scratch | Complete version history, rollback anytime |

## Super Document vs. Regular Text Editing

Super Document is not just another Markdown editor. Its core value lies in **visualization and control of the modification process**:

- **Visible**: What changes AI made is clear at a glance
- **Controllable**: You decide what to accept and what to reject
- **Reversible**: Any operation can be undone, any version can be restored
- **Explainable**: AI doesn't just change, it tells you why

:::tip One Sentence Summary
If conversation is "verbal communication" between you and the Agent, then Super Document is your "written collaboration"—all changes are tracked, all decisions are traceable.
:::

## Use Cases

Super Document is suitable for any document work involving AI:

- **Daily Writing**: Emails, reports, proposals—let AI help you polish and improve
- **Professional Documents**: Contracts, bids, legal documents—AI assists with writing, you review and approve
- **Team Collaboration**: Documents with multiple contributors, track every change through version history
- **Knowledge Documentation**: Organize scattered ideas into structured documents

## Super Document Workflow at a Glance

```mermaid
flowchart TD
    A[You initiate writing task] --> B[Agent generates or modifies content]
    B --> C[Diff view displays all changes]
    C --> D{You review item by item}
    D -->|Accept| E[Change takes effect]
    D -->|Reject| F[Restore original text]
    D -->|Edit| G[Manual adjustment]
    E --> H[Confirm to form a new version]
    F --> H
    G --> H
    H --> I[Continue conversation, further iteration...]

    style C fill:#fff3cd,stroke:#ffc107
    style H fill:#d4edda,stroke:#28a745
```

> 💡 In the **Diff view**, <span style={{color: '#dc3545'}}>red = deletion</span> and <span style={{color: '#28a745'}}>green = addition</span>, making every change clear at a glance.

Each round of changes is recorded as a version. You can return to any historical version at any time, just like Git history for code.

## Next Steps

- [Collaborative Writing](./02-collaborative-writing.md) — Learn how to write documents with Agents
- [Diff Visualization](./03-diff-view.md) — Understand how to use the modification comparison view
