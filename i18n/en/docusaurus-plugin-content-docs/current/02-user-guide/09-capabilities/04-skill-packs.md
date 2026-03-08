---
title: Skill Packs
description: Learn about the concept of skill packs—how they differ from tools, how to install and manage skill packs, and how to create custom skills.
keywords: [skill pack, Skill, skill installation, custom skill, skill marketplace]
---

# Skill Packs

If tools are the agent's "hands," then skill packs are its "methodology." Skill packs tell agents **how to do things**, orchestrating multiple tools into a complete workflow.

## Tools vs. Skills

These two concepts are easily confused. Let's illustrate with an example:

| Dimension | Tool | Skill |
|-----------|------|-------|
| **Nature** | Atomic operation, does one thing | Process encapsulation, does a set of things |
| **Granularity** | Single call | Multi-step orchestration |
| **Example** | "Read file," "Search web" | "Data analysis report," "Contract review" |
| **Analogy** | A hammer | An operation manual |

For example:

- The tool "read file" only does one thing—open and return file content
- The skill "data analysis report" contains a complete workflow: read data file → data cleaning → statistical analysis → generate visualization → output report

Skills are "ways of doing things," telling the agent which steps to execute, in what order, and following what standards.

## What's in a Skill Pack

Each skill pack contains the following:

- **Purpose Description** — What scenarios this skill applies to
- **Execution Steps** — Detailed operation workflow
- **Tool Dependencies** — What tools are needed
- **Judgment Criteria** — When to use this skill
- **Notes** — Details to pay special attention to during execution

:::info Nature of Skills
From a technical perspective, a skill pack is a structured Markdown document. When an agent loads a skill, it strictly follows the instructions in the document. This means skill behavior is predictable and reviewable.
:::

## Two Activation Methods

Skills can take effect in two ways:

### Explicit Activation

You manually click "Enable" in the skill list, and the agent will actively load the skill when needed.

Suitable for: Scenarios where you clearly know what skill you need.

### Implicit Matching

The agent automatically determines whether a skill is needed based on your task and loads it on demand.

Suitable for: You only care about results, don't want to manage which skills are used.

## Browsing the Skill Marketplace

DesireCore provides a skill marketplace where you can discover and install new skills:

1. Open the skill marketplace
2. Browse by category: productivity, analysis, writing, development, etc.
3. View skill details:
   - Function description and applicable scenarios
   - Tool dependencies (whether installed)
   - Risk level
   - User reviews
4. Click "Install" to add to your agent

### Installation Process

When installing skills, the system automatically checks dependencies:

- **All dependency tools ready** → Install and enable directly
- **Missing some tools** → Prompt you to install missing tools first, then enable skill

:::tip Global Skills vs. Agent Skills
Some skills are **global skills**, all agents can use them; some are bound to specific agents. Global skills usually provide general capabilities (e.g., file management, search optimization), while agent skills provide professional capabilities (e.g., legal review, data analysis).
:::

## Managing Installed Skills

In Agent Settings → Skill Management, you can:

- **View All Skills** — List of installed skills
- **Enable/Disable** — Control whether a skill is available
- **View Usage** — Understand skill usage frequency
- **Uninstall** — Remove skills no longer needed

## Creating Custom Skills

If marketplace skills can't meet your special needs, you can create your own skill packs.

### Basic Steps

1. Go to Agent Settings → Skill Management → Create Skill
2. Fill in skill meta information:
   - **Name**: Concisely describe skill purpose
   - **Applicable Scenarios**: When to use
   - **Risk Level**: Low/Medium/High
3. Write skill instructions (Markdown format):
   - Execution steps
   - Judgment criteria
   - Notes
4. Declare tool dependencies
5. Add usage examples (optional)
6. Save and enable

### Skill Instruction Writing Tips

Good skill instructions should be clear, specific, and unambiguous:

- **Clear Steps** — What to do at each step, input what, output what
- **Condition Judgment** — Under what circumstances take which branch
- **Error Handling** — What to do if a step fails
- **Completion Criteria** — What counts as "done"

:::warning Test Your Skills
After creating custom skills, recommend testing in some simple scenarios first, confirming the agent can correctly understand and execute skill instructions before using for formal work.
:::

## Skill Updates

### Built-in Skills

DesireCore comes with a batch of built-in global skills. These skills sync automatically with client updates, but the system respects your modifications:

- If you modify a built-in skill's content, it **won't be overwritten** during updates
- Only skills you haven't modified will be automatically updated to new versions

### Marketplace Skills

Skills installed from the marketplace can get updates through the marketplace. When a skill has a new version, you'll receive an update notification.
