---
title: Skills Management
description: Learn about the Agent Skill system—what skills are, how to view and manage skills, and installing skill packs from the marketplace.
keywords: [Skill, Skill Pack, Skills Management, Skill Marketplace]
---

# Skills Management

Skills are the Agent's "capability modules." A skill defines the Agent's behavior in specific scenarios, the tools used, and execution steps. By adding skills, you can quickly extend the Agent's capabilities.

## What are Skills

Skills are essentially structured instruction documents (`SKILL.md`) that tell the Agent what to do when facing a certain type of task.

For example, a "Contract Review" skill might include:

- **Trigger Condition**: When user submits a contract document
- **Execution Steps**: Check clauses one by one, identify risk points, provide modification suggestions
- **Tools Used**: Document parsing, legal knowledge base retrieval
- **Output Format**: Structured review report

Difference between Skills and Tools:

| Dimension | Skill | Tool |
|---|---|---|
| Essence | High-level behavior instruction | Low-level capability interface |
| Granularity | A complete task workflow | A specific operation |
| Example | "Contract Review" | "PDF Parsing", "Text Search" |
| Contains | Can reference multiple tools | Independent capability unit |

## Viewing Agent Skills

1. Enter the Agent details page
2. Click the "Skills" tab
3. View the list of installed skills

Each skill card displays:

- Skill name and icon
- Brief description
- Risk level (Low / Medium / High)
- Version information

Click the skill card to view detailed skill documentation (`SKILL.md`).

## Adding and Removing Skills

### Installing from Skill Marketplace

1. Enter the Agent's skills management page
2. Click "Add Skill"
3. Browse or search the skill marketplace
4. Click "Install" to add the skill to the current Agent

### Removing Skills

1. Find the skill to remove in the skills list
2. Click the menu button on the right side of the skill
3. Select "Remove"
4. After confirmation, the skill file is deleted

:::info Removal is Recoverable
Since Agents use Git to manage files, you can still recover through version history after removing a skill.
:::

## Skill Risk Levels

Each skill is marked with a risk level to help you understand the types of operations it involves:

| Risk Level | Meaning | Example |
|---|---|---|
| **Low Risk** | Only reads data, does not modify system state | Information retrieval, text analysis |
| **Medium Risk** | Requires network access or external service connection | API calls, online search |
| **High Risk** | Involves sensitive data operations or system modifications | File writing, command execution |

High-risk skills require your explicit confirmation each time they are executed.

## Built-in Skills vs. Custom Skills

### Built-in Skills

DesireCore comes with a set of Global Skills that all Agents can use. These skills are updated with the client version and include basic capabilities such as:

- Document reading and writing
- Web search
- Code execution

### Custom Skills

Advanced users can manually create skills. Each skill is a directory containing:

```
<skill_id>/
├── SKILL.md          # Required: Skill description + metadata
├── skill.yaml        # Optional: Dependency declaration
├── scripts/          # Optional: Executable scripts
├── references/       # Optional: Reference documents
├── assets/           # Optional: Templates and resources
└── evals/            # Optional: Evaluation test cases
```

:::tip SKILL.md is Core
All skill behaviors are defined by instructions in `SKILL.md`. Writing a good SKILL.md is equivalent to teaching the Agent a new capability.
:::

## Next Steps

- [Version Control](./08-version-control.md) — Learn about Git version control for Agents
- [Agent Marketplace](./02-marketplace.md) — Discover more skills from the marketplace
