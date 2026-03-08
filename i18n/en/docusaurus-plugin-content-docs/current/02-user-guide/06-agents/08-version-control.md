---
title: Version Control
description: Learn about Git version management for Agents—viewing modification history, rolling back to historical versions, publishing and sharing Agents.
keywords: [Version Control, Git, Version History, Rollback, Publish, Share]
---

# Version Control

Each Agent in DesireCore is a Git repository. Every modification you make to the Agent—whether adjusting persona, teaching it new knowledge, or installing skills—is recorded as a Git commit. This means you can track complete modification history and return to any state at any time.

## Git Version Management for Agents

### What Gets Recorded

The following operations automatically generate commits:

| Operation | Commit Message Example |
|---|---|
| Modify Persona | "Update persona.md: Adjust response style to concise mode" |
| Add Principles | "Update principles.md: Add sensitive operation confirmation rule" |
| Write memory after conversation teaching | "Add memory: User project uses React 18" |
| Install/Remove skills | "Install skill: contract-review v1.2.0" |
| Upload resource files | "Add resource: Company Contract Template.docx" |

### What Doesn't Get Recorded

- Conversation content itself (conversation is temporary "working memory")
- Runtime artifacts (`runs/` directory)
- Cache data (`cache/` directory)

## Viewing Modification History

1. Enter the Agent details page
2. Click the "Versions" tab
3. View the commit list arranged in reverse chronological order

Each commit record displays:

- **Commit Message**: Describes what this modification did
- **Time**: When the modification occurred
- **Changed Files**: Which files were modified
- **Diff Preview**: Click to expand and view specific changes

## Rolling Back to Historical Versions

If the Agent's behavior has issues, you can roll back to a previous stable version.

### Rollback Steps

1. Find the target version in version history
2. Click "Preview" to view the Agent state at that version
3. After confirmation, click "Revert to this version"
4. The system creates a new commit to record the rollback operation

### Common Rollback Scenarios

| Scenario | Description |
|---|---|
| **Persona Drift** | Found Agent behavior deviated from expectations, return to last stable persona configuration |
| **Incorrect Teaching** | Accidentally taught wrong knowledge, undo that memory write |
| **Skill Conflict** | Newly installed skill caused issues, roll back to pre-installation state |
| **Failed Experiment** | Tried new principle configuration with poor results, restore original state |

:::tip Rollback is Safe
The rollback operation itself is also a commit; no historical records are lost. You can always return to the state before the rollback.
:::

## Publishing and Sharing Agents

When your Agent is well-tuned, you can share it with others.

### Publishing to Marketplace

1. Click "Publish" on the Agent details page
2. Fill in publication information:
   - Version number
   - Changelog
   - Category and tags
3. Submit for review
4. After approval, listed on the marketplace

### Publication Content

Publication **only includes Agent core domain** content:

- `agent.json` — Entry configuration
- `persona.md` — Persona
- `principles.md` — Principles
- `memory/` — General memories
- `skills/` — Skill packs
- `tools/` — Tool registration

**Does not include** content:

- User data (`users/`)
- Runtime logs
- Cache data

This means your personal data and privacy are completely secure.

### Local Export

If you just want to backup or migrate, you can export the Agent as a zip file:

1. Click "Export" on the Agent details page
2. Select export scope
3. Download the zip file

The exported file contains complete Git history and can be imported and used on another device.

## Next Steps

- [Agent Types](./01-agent-types.md) — Review Agent types and positioning
- [Create Custom Agent](./03-create-agent.md) — Create your own Agent
