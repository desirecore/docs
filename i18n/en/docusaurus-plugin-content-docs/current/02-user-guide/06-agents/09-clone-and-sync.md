---
title: Clone and Sync
description: Clone agents, choose private data scope, and resolve remote sync conflicts.
keywords: [Clone, agent clone, sync, conflicts, Agent Git]
---

# Clone and Sync

Clone creates a new copy based on an existing agent. It is useful for experiments, preparing variants for different projects, or customizing a marketplace agent into your own version.

## When to Clone

| Scenario | Description |
|----------|-------------|
| **Experimental overhaul** | You want to make major changes to an agent's persona or skills but are unsure of the result — clone a "sandbox" first |
| **Project variants** | The same base agent needs to adapt to different projects (e.g., different client review standards) |
| **Marketplace localization** | You installed an agent from the marketplace and want deep customization without upstream interference |
| **Team collaboration template** | Create a standardized team agent template; members clone it and customize individually |

## Clone Steps

1. Open **Explorer → Agent List**
2. Right-click the target agent (or click the `⋯` menu) and select **Clone**
3. In the dialog, configure:
   - **New Name**: give the clone an easily distinguishable name
   - **Remote Relation** (only when the source agent has a remote origin):
     - *Keep Remote*: continue receiving upstream updates
     - *Fork*: create an independent branch, decoupled from the original remote
     - *Local Only*: completely disconnect from the remote
   - **Private Data Options** (see below)
4. Click **Confirm Clone** — the system creates a new agent ID and completes the copy

:::caution
The core DesireCore agent (the system scheduler) cannot be cloned, to avoid breaking the main control entry. If the clone option is greyed out in the menu, the agent is protected.
:::

## Private Data Options

When cloning, you can choose whether to copy private data between the current user and that agent:

| Data Type | Description | Recommendation |
|-----------|-------------|----------------|
| Memory (`memory/`) | Facts, preferences, and experience the agent learned during conversations | Keep for personal clones; uncheck when sharing with others |
| Preferences (`preferences/`) | User personalization settings | Depends on situation |
| Relationship contract (`relationship.md`) | Collaboration agreements between you and the agent | Usually needs to be re-established; not recommended to copy |
| Local resource files | Files in the work directory | Not recommended for large projects to save space |

**Rule of thumb**: creating a clone for yourself → keep memory and preferences; preparing a template for others or a team → do not copy private data.

## Syncing Updates

If a cloned agent still retains its remote source (i.e., you chose "Keep Remote"), it can continue receiving upstream updates:

1. Open the agent details page and check the **Source** area for the remote repository URL
2. Click **Check for Updates** — the system fetches the latest remote commits and compares them with local
3. If new content is available, a list of changed files and a diff summary are displayed
4. Click **Merge Updates** — the system performs a Git merge

:::info Update Strategy
- **Pure config updates** (persona, principles, skills): usually safe to merge
- **New skills/tools**: added automatically without affecting existing configs
- **Deletions or renames**: require manual confirmation; the system will not silently delete files you already have locally
:::

## Conflict Resolution

When both local and remote modify the same file, DesireCore prevents direct overwrite and opens a conflict resolver:

1. **View conflict file list** — highlighted files indicate both sides made changes
2. **Open Diff view** — side-by-side comparison of local and remote versions
3. **Choose a resolution strategy**:
   - **Keep Local**: discard remote changes, use your version
   - **Use Remote**: accept upstream update, overwrite local changes
   - **Manual Edit**: decide line by line in the editor which content to keep
   - **Keep Both**: append remote content as a new file (e.g., `persona-remote.md`)
4. After resolving all conflicts, click **Finish Merge** — the system commits automatically

:::tip Long-term Customization
If you plan to significantly modify a marketplace agent long-term, consider forking to your own remote repository. This way:
- Upstream updates are not pushed automatically; you choose when to sync
- Conflict scope is more controllable, since you know exactly what you changed
- Other team members can create their own versions based on your fork
:::

## FAQ

| Problem | Solution |
|---------|----------|
| Cloned agent behaves differently from the original | Check if you missed private data (memory, preferences), or the new ID caused relationship data not to migrate |
| Sync shows "cannot merge" | Usually because local has uncommitted changes; manually commit or stash on the agent files page first |
| Want to restore pre-clone state | Cloning does not modify the original agent — it remains unaffected at all times |
| Can a clone join a team? | Yes. After cloning, it is an independent agent and can join teams like any other agent |

---

:::info Next Steps
- [Version Control](./08-version-control.md): learn about the agent's Git version management
- [Team Version Management](./10-team-version-management.md): share and sync agent configurations within a team
:::
