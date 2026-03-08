---
title: File Explorer
description: Learn about the AgentFS file system structure and how to browse and manage Agent files in the file explorer.
keywords: [AgentFS, File System, File Explorer, Agent Files, File Structure]
---

# File Explorer

Each Agent's configuration, memory, and skills are stored as files in AgentFS (Agent File System). The file explorer lets you intuitively browse and manage these files.

## AgentFS File Structure Overview

Each Agent's files are stored in the `~/.desirecore/agents/<agent_id>/` directory:

```
<agent_id>/
├── agent.json        # Entry configuration
├── persona.md        # Persona
├── principles.md     # Principles
├── memory/           # Memory files
│   └── *.md          # One file per memory
├── skills/           # Skills directory
│   └── <skill_id>/   # One directory per skill
│       └── SKILL.md  # Skill documentation
├── tools/            # Tool registration
├── workflows/        # Workflow definitions
├── heartbeat/        # Heartbeat configuration
├── resources/        # Resource files
├── assets/           # Static resources
└── .git/             # Git version management
```

:::info Why Use File System?
DesireCore's design philosophy is "everything is files." Files are more transparent than databases—you can directly view, edit, back up, and version manage them. Every change to an Agent is recorded in Git history.
:::

## Browsing Agent Files

### Opening the File Explorer

1. Enter the Agent details page
2. Click the "Files" tab
3. The file explorer displays all the Agent's files in a tree structure

### File Preview

Click any file to preview its content on the right:

- **Markdown files** (`.md`): Rendered rich text preview
- **JSON files** (`.json`): Syntax-highlighted JSON view
- **YAML files** (`.yaml`): Syntax-highlighted YAML view

### File Editing

For Markdown and configuration files, you can edit directly in the preview interface. After editing and saving, a Git commit is automatically generated and recorded in version history.

:::warning Edit Configuration Files with Caution
Directly editing core configuration files like `agent.json` may affect the Agent's normal operation. If you're unsure about the meaning of a field, it's recommended to modify through the interface or conversation.
:::

## Uploading and Managing Resource Files

You can upload reference documents, templates, data files, etc. to the Agent's `resources/` directory for the Agent to reference during work.

### Uploading Files

1. Navigate to the `resources/` directory in the file explorer
2. Click the "Upload" button
3. Select local files
4. Files are automatically committed after upload

### Managing Files

- **Rename**: Right-click the file, select "Rename"
- **Delete**: Right-click the file, select "Delete" (recorded in version history, recoverable)
- **Move**: Drag and drop files to the target directory

## File Type Reference

| File | Format | Description |
|---|---|---|
| `agent.json` | JSON | Entry configuration: metadata such as name, version, description, category |
| `persona.md` | Markdown | Persona: tone, style, response strategy |
| `principles.md` | Markdown | Principles: rules, forbidden zones, priorities |
| `memory/*.md` | Markdown | Memory entries: learned knowledge and preferences |
| `skills/*/SKILL.md` | Markdown | Skill documentation: skill description and execution instructions |
| `tools/*.json` | JSON | Tool registration: parameter definitions for callable tools |
| `heartbeat/HEARTBEAT.md` | Markdown | Heartbeat configuration: automatic tasks and trigger conditions |
| `resources/*` | Any | Reference resources: documents, templates, data files |

## Next Steps

- [Skills Management](./07-skills-management.md) — Learn how to add and manage skills for Agents
- [Version Control](./08-version-control.md) — Learn about Git version control for Agents
