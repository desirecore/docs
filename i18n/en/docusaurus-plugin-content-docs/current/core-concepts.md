---
sidebar_position: 3
---

# Core Concepts

## Companion (AI Partner)

A Companion is the heart of DesireCore — your personal AI partner. Each Companion has its own persona, memory, and skills, stored locally in a CompanionFS repository:

```
companions/<agent_id>/
├── companion.json    # Configuration
├── persona.md        # Personality & character
├── principles.md     # Behavioral rules
├── memory/           # Memory system
│   ├── timeline/     # Chronological memory
│   ├── topics/       # Topic-based memory
│   ├── pinned/       # Pinned memories
│   └── lessons/      # Lessons learned
└── skills/           # Skill definitions
```

## Receipts

Every time a Companion executes a task, it generates a **Receipt** — a complete evidence chain including inputs, outputs, tool calls, and reasoning. You can always see "what it did and why."

## Tool Registry

Companions interact with the outside world through tools. DesireCore includes 7 built-in tools:

| Tool | Description |
|------|-------------|
| `Read` | Read files |
| `Write` | Write files |
| `Edit` | Edit files |
| `Bash` | Execute commands |
| `Glob` | Search for files |
| `Grep` | Search file contents |
| `Ls` | List directories |

Additional tools and services can be integrated via **MCP (Model Context Protocol)**.

## Dual Runtime

DesireCore supports two AI runtimes, switchable on demand:

- **Claude Agent SDK** — Powered by Anthropic Claude
- **pi-agent-core** — Multi-model LLM powered

## Step Control

Each execution step falls into one of three categories:

| Type | Description |
|------|-------------|
| **Frozen** | Deterministic execution, strictly follows rules |
| **Flexible** | Adaptive execution, AI decides autonomously |
| **Human Gate** | Requires human confirmation before proceeding |
