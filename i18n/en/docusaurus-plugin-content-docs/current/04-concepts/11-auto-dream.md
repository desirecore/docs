---
title: Auto Dream — Lossless Forgetting
description: Understanding the Auto Dream mechanism — how agents "dream" to consolidate memories and preserve value through compression
keywords: [Auto Dream, Lossless Forgetting, memory consolidation, memory compression, knowledge distillation]
---

# Auto Dream — Lossless Forgetting

## Why Do We Need "Dreaming"

You may know that during deep sleep, the human brain isn't idle — it's organizing the day's experiences, weaving fragments into complete memories, discarding irrelevant details, and strengthening what truly matters. Neuroscientists call this "memory consolidation."

DesireCore's agents face a similar challenge. As your interactions accumulate, the memory library continuously grows:

- **Slower retrieval** — When memories grow from hundreds to tens of thousands, finding relevant memories means sifting through more "old notes"
- **Higher costs** — A larger memory library means more storage and compute overhead
- **Noise interference** — A flood of trivial, scattered memories can drown out truly important information

But brutally deleting old memories would discard valuable experience and patterns — the things you spent months "teaching" the agent shouldn't just vanish.

**Auto Dream is the best balance between the two**: instead of deleting, it consolidates scattered memories into more refined knowledge, just like dreaming.

## What is Auto Dream

Auto Dream is a **memory consolidation mechanism** that runs periodically in the background. Its approach isn't simple compression or deletion — instead, it:

1. Identifies thematically related scattered memories
2. Extracts common patterns and core information
3. Restructures multiple fragmented memories into organized knowledge

For example: you have a stack of sticky notes that read "user likes short sentences," "user dislikes exclamation marks," "user prefers active voice," "user requires paragraphs under three lines." Auto Dream takes these four notes and merges them into a clear "Writing Style Guide" — no information is lost, but the form is more refined and useful.

### How It Differs from Ordinary Forgetting

| | Ordinary Forgetting (Compression/Cleanup) | Auto Dream (Lossless Forgetting) |
|---|---|---|
| **How it works** | Reduces precision or deletes directly | Extracts essence, then reorganizes |
| **Information loss** | Lossy — details are unrecoverable | Lossless — semantics fully preserved |
| **Trigger condition** | Storage limit / memory age | Periodic automatic trigger |
| **Output** | Compressed summary or empty | Structured knowledge entry |
| **Traceability** | Original text unrecoverable after compression | Original memories retained in version history |

In short, ordinary forgetting is "losing things," while Auto Dream is "organizing the bookshelf" — the books are still there, just arranged more neatly.

## How Auto Dream Works

### The Consolidation Process

Auto Dream's work proceeds in four phases:

**Scan** — The system periodically scans memories in "archived" status, identifying groups of thematically similar memories that can be merged. For example, 20 scattered memories about your writing habits would be grouped together.

**Associate** — Within each group, the system analyzes semantic relationships between memories: which are complementary? Which are duplicates? Which contain contradictions where the newer one should take precedence? This step is similar to how the brain builds associations between memories during dreaming.

**Distill** — The system extracts core patterns and key information from the associated memory group, removing redundancy and noise. It doesn't delete details — it concentrates information scattered across multiple memories into a more refined expression.

**Reorganize** — The distilled information is reorganized into a structured knowledge entry and written to the memory library. The original scattered memories are not deleted — they're marked as "consolidated" and retained in version history for future reference.

### Memory Lifecycle (Including the Dream Phase)

In [Auto-Learning and Forgetting](../user-guide/memory/auto-learning), we introduced the five-stage memory lifecycle. With Auto Dream, the complete lifecycle becomes:

```
Active → Recent → Archived → 💤 Dream → Compressed → Cleaned
```

The Dream phase is inserted **between Archived and Compressed**. When a group of archived memories meets the Dream criteria, the system attempts consolidation first, rather than compressing directly. After successful consolidation, the resulting structured knowledge re-enters the lifecycle as "Recent" status — because it's newly generated, valuable knowledge that deserves higher priority.

## Dream Output Example

Suppose your writing advisor agent has accumulated these scattered memories from conversations over the past month:

> - "User wants articles to get straight to the point, no preamble"
> - "User prefers short paragraphs, no more than 3 sentences each"
> - "User doesn't like passive voice"
> - "User requires headings to start with verbs"
> - "User mentioned the target audience is technical managers"
> - "User wants a call-to-action at the end"
> - ... along with a dozen other similar fragments

After Auto Dream consolidation, these memories are distilled into a structured **Writing Style Profile**:

> **User Writing Style Profile**
>
> - **Target audience**: Technical managers
> - **Overall style**: Concise and direct, conclusions over preambles
> - **Paragraph structure**: Short paragraphs (≤3 sentences), headings use verbs
> - **Voice preference**: Active voice preferred, avoid passive constructions
> - **Article structure**: Straight to the point at the start, call-to-action at the end

20 scattered memories become 1 clear profile. The information volume hasn't decreased, but retrieval efficiency and usability are dramatically improved — the agent only needs to reference this one profile next time it helps you write, instead of sifting through 20 sticky notes.

## Relationship with Self-Evolution

Auto Dream isn't just a memory management tool — it's also essential nourishment for the agent's [Self-Evolution](./self-evolution).

When Dream consolidates scattered experiences into structured knowledge, the evolution mechanism can further leverage these results:

- **Rule extraction** — If a pattern in the profile is stable enough (e.g., "user consistently requires short paragraphs"), the evolution mechanism may suggest elevating it to a formal behavioral rule
- **Skill optimization** — Consolidated knowledge helps the agent adjust existing skill execution strategies
- **Contradiction discovery** — If Dream finds contradictions between memories (e.g., the user early on said "be detailed" but later said "be concise"), it flags them for the evolution mechanism to handle

You could say Auto Dream is the "preprocessor" for evolution — it processes raw materials into semi-finished products, allowing the evolution mechanism to more efficiently transform them into genuine capability improvements.

## User Control

Auto Dream is completely under your control. You can:

| What You Want to Do | How to Do It |
|---------------------|-------------|
| View Dream logs | Switch to the "Dream Records" tab in memory management |
| Manually trigger Dream | Click "Organize Memories" and select "Deep Consolidation" mode |
| Protect memories from consolidation | Mark memories as "Pinned" — pinned memories don't participate in Dream |
| Adjust Dream frequency | Modify the automatic consolidation trigger interval in settings |
| Trace back to original memories | Click "View Sources" in Dream-produced knowledge entries to expand all original memories |

:::tip Let It Dream Freely
Auto Dream never deletes any original memory. Even if you're not satisfied with the consolidation result, you can always view and restore the original scattered memories.
:::

## Next Steps

- Want to understand how memory works end-to-end? Read [How the Agent Remembers You](../user-guide/memory/how-memory-works) in the User Guide
- Want to understand the ordinary forgetting mechanism? Read [Auto-Learning and Forgetting](../user-guide/memory/auto-learning)
- Want to understand the evolution mechanism? Read [Self-Evolution](./self-evolution)
