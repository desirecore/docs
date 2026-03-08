---
title: Viewing and Managing Memory
description: Learn how to view agent memory content, edit memory entries, delete unwanted memories, and use the memory search function.
keywords: [memory management, view memory, edit memory, delete memory, memory search]
---

# Viewing and Managing Memory

Agent memory is completely transparent and controllable. You can view what the agent remembers at any time, modify inaccurate content, or delete memories that are no longer needed.

## Accessing Memory Management

You can access agent memory in the following ways:

1. Open the agent details page
2. Switch to the **Memory** tab
3. You'll see a memory list categorized by domain

The memory management interface displays content from three domains:

- **Relationship Memory** — Interaction experiences between you and this agent
- **Shared Memory** — Knowledge shared across agents
- **Core Memory** — Factory knowledge of the agent (usually read-only)

## Viewing Memory Content

Each memory contains the following information:

- **Content Summary** — The core point of the memory
- **Type Tag** — preference / fact / decision / commitment / milestone / lesson
- **Importance Score** — The importance level automatically assessed by the system
- **Creation Time** — When the memory was generated
- **Source Session** — Which conversation this memory was extracted from

:::tip Trace to Source
Click the "Source Session" link to return to the original conversation context that generated this memory and understand the full discussion background.
:::

## Searching Memory

When there are many memory entries, you can use the search function to quickly locate them:

**Natural Language Search** — Enter what you want to find in the search box:

- "Preferences about report format"
- "Decisions about Project Alpha"
- "Technical solution discussed last time"

The system performs semantic searches across all domains, returning the most relevant results. High-confidence memories are prioritized.

## Editing Memory

If you find a memory entry inaccurate, you can edit it directly:

1. Find the memory entry that needs editing
2. Click the edit button
3. Modify the memory content
4. Save changes

:::info What Can Be Edited
You can edit content in **Relationship Memory** and **Shared Memory**. Core memory is defined by the agent developer and usually doesn't support user editing.
:::

## Deleting Memory

If a memory entry is no longer needed or you don't want the agent to remember it:

1. Find the memory entry to delete
2. Click the delete button
3. Confirm deletion

After deletion, this memory will no longer affect the agent's behavior.

:::warning Deletion Cannot Be Undone
After deleting a memory, the agent will no longer be able to reference this information. Please confirm you no longer need it. However, memory history is still retained in version control and can technically be recovered.
:::

## Marking Important Memories

For particularly important memories, you can mark them as **Pin**:

1. Find the important memory entry
2. Click the pin/top button
3. This memory will receive "never forget" protection

Pinned memories won't be compressed or cleaned up by the automatic forgetting mechanism. Suitable for:

- Key business decisions
- Important personal preferences
- Commitments and agreements that cannot be forgotten

## Reviewing Candidate Memories

After each conversation ends, the system may generate candidate memories for your review:

1. At the end of the conversation, a memory review panel pops up at the bottom of the interface
2. Each candidate memory displays:
   - Memory content preview
   - Suggested domain to write to
   - Memory type and importance score
3. You can perform actions on each candidate memory:
   - **Accept** — Confirm recording this memory
   - **Edit and Accept** — Modify content before recording
   - **Reject** — Don't record this information

:::tip Batch Operations
If there are many candidate memories, you can use "Accept All" or "Reject All" to process them quickly.
:::
