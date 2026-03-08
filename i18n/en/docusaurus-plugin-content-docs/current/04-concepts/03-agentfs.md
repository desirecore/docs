---
title: AgentFS Filesystem
description: Understanding AgentFS — each agent's "home" where all capabilities, memories, and rules exist as files
keywords: [AgentFS, filesystem, data storage, Git, agent repository]
---

# AgentFS Filesystem

## AgentFS is Like Each Agent's "Home"

If DesireCore is like a community, then AgentFS is each agent's "home" in that community. This home contains its personal profile, work manual, skill certificates, memory logs, and archived receipts from every job.

You might ask: why not use a database to store all this?

The answer is simple: **files are the most transparent form of data**. You can directly open files to see everything about the agent — its personality, the rules it learned, the things it remembers. No SQL queries needed, no specialized database management tools.

## Design Inspiration

AgentFS's design is inspired by the Linux operating system's file structure:

| Linux Filesystem | AgentFS | Analogy |
|------------------|---------|---------|
| `/usr/share/app/` | `agents/<id>/` | Application core, shareable |
| `/home/user/` | `users/<user_id>/` | User private data |
| `/var/run/` | `runs/` | Runtime temporary files |
| `/var/cache/` | `cache/` | Rebuildable cache |
| `/var/log/` | `logs/` | Log records |

## Overall Directory Structure

```
~/.desirecore/
├── config/                     # Global configuration (your personal settings)
│
├── agents/                     # All agents' "homes"
│   └── <agent_id>/
│       ├── agent.json          # ID card: basic info and configuration
│       ├── persona.md          # Personality profile: communication style, decision preferences
│       ├── principles.md       # Behavioral guidelines: rules, forbidden zones, baselines
│       ├── memory/             # Memory bank: facts and experiences it remembers
│       ├── skills/             # Skill packages: various skills it has learned
│       ├── workflows/          # Workflows: execution plans for complex tasks
│       ├── tools/              # Toolbox: external tools it can use
│       ├── heartbeat/          # Heartbeat: content it actively monitors
│       ├── resources/          # Reference materials: documents, knowledge bases
│       ├── assets/             # Static resources: images, templates
│       └── .git/               # Version control
│
├── users/                      # User-specific data
│   └── <user_id>/
│       ├── profile.md          # Your personal profile
│       ├── preferences.md      # Your preference settings
│       └── agents/             # Your "relationship" with each agent
│           └── <agent_id>/
│               ├── relationship.md  # Interaction records and relationship
│               ├── memory/          # Exclusive memories with this agent
│               └── preferences/     # Your exclusive settings for this agent
│
├── runs/                       # Execution records (temporary)
├── cache/                      # Cache (rebuildable)
└── logs/                       # Logs
```

## Core Directory Analysis

### agents/ — Agent Core

This is where the agent's "soul" resides. Each agent is a Git repository containing:

| File/Directory | Purpose | Analogy |
|----------------|---------|---------|
| `agent.json` | Agent's basic info, version number | ID card |
| `persona.md` | Personality, tone, decision preferences | Character traits |
| `principles.md` | Behavioral guidelines, red lines, baselines | Professional ethics |
| `memory/` | Accumulated knowledge and experience | Long-term memory |
| `skills/` | Various learned skills | Skill certificates |
| `tools/` | External tools it can use | Toolbox |

### users/ — User Private Data

Your personal data is stored completely independently, strictly isolated from the agent core. Even if you use the same agent, your data won't be mixed with others.

### runs/ — Execution Records

Detailed process of each task execution, including receipts, session records, etc. This is the data source for "post-hoc auditing."

## Why Filesystem Instead of Database

| Feature | Filesystem | Database |
|---------|-----------|----------|
| **Transparency** | Open files directly to view | Requires query tools |
| **Version Control** | Native Git support | Requires additional solution |
| **Portability** | Copy folder to migrate | Requires export/import |
| **Auditability** | Every modification has Git record | Requires audit logs |
| **AI-Friendly** | AI reads/writes files directly | Requires API adaptation |
| **Offline Available** | Local files always available | May depend on services |

## Benefits of File-Driven Architecture

### 1. Agents Can "Modify Themselves"

Because everything is files, agents can directly read and write their own files to learn and evolve. For example, when you teach it a new rule, it writes the rule to `principles.md`. This is much simpler than operating a database through APIs.

### 2. Humans Can Easily Review

All changes are file diffs. You can review the agent's every "learning outcome" like reviewing code. What was deleted, what was added — clear at a glance.

### 3. Distributable Like Software

The agent core is a Git repository — can be cloned, forked, published to marketplace. The agent you cultivated well can be shared with others.

### 4. Natural Rollback Support

Made a mistake? `git revert` and it's back. Not satisfied with recent "evolution"? Roll back to the previous version.

## Tiered Loading

To save AI model token consumption, AgentFS adopts a three-tier loading strategy:

| Tier | Content | Consumption | Purpose |
|------|---------|-------------|---------|
| **L0** | One-sentence summary | Minimal | Quick filtering, routing |
| **L1** | Core info + applicable scenarios | Low | Planning and decision-making |
| **L2** | Complete content | On-demand | Actual execution |

This means the agent doesn't need to read all files every time, but loads on demand — saving both cost and improving efficiency.

## Next Steps

- Want to understand the various memory types of agents? Go to the Memory System chapter in the User Guide
- Want to understand specific file formats? Read [File Format Reference](../05-reference/06-file-formats.md)
- Want to understand where data is stored? Read [Data Storage Locations](../05-reference/07-data-locations.md)
