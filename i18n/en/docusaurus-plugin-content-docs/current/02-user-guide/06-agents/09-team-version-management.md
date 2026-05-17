---
title: Team Version Management
description: Manage an entire Agent team as a single versioned unit — track organizational changes, sync to GitHub/Gitee, publish to the community, or install from someone else's link in one click.
keywords: [Team Version Management, Team Collaboration, Team Publishing, Team Install, Cross-Device Sync, Team Git]
---

# Team Version Management

If every Agent is a single colleague, a team is a small group with its own formation, rules, and shared memory. Once you've spent time getting that group right — choosing a leader, building out the roster, writing shared principles — you'll want to preserve the whole group as "a finished result": carry it to another machine, let a friend clone it in one click, and know exactly who changed what along the way.

That's what team version management is for: **giving teams the same version history, remote sync, and sharing capabilities that individual Agents already have**.

## Why Teams Need Version Management

| Your situation | How team version management helps |
|---|---|
| You built a team on a laptop and want to keep using it on your desktop | Push it to GitHub/Gitee, then pull it on the other machine — organization and shared resources arrive intact |
| Two people are tuning a customer-support team at work | Each side pushes/pulls to merge — who added whom, who changed the leader, all visible |
| You want to share a carefully built sales team with the community | Publish once; anyone with the link can install the complete team, including all member Agents |
| You accidentally replaced a key leader | Find that change in the version history and return to the prior organization |
| You see someone published a great ops team | Paste their link, fork it to your machine, modify freely without affecting the original author |

## Two Layers: Team and Member

DesireCore manages teams in two layers:

| Layer | What it tracks | Who maintains it |
|---|---|---|
| **The team itself** | Who's the leader, who's a member, shared skills/memory/rules, the team's remote repo address | Team version management (this chapter) |
| **Each member Agent** | Its own persona, principles, memory, skills, learned conversation knowledge | Each Agent's own version management ([previous chapter](./08-version-control.md)) |

This means the team repository **does not embed copies of member Agents**. It only keeps a "roster" pointing to where each member lives (locally, in a git repo, or at a specific marketplace version). This way you can package and share a team as a whole without any Agent ending up duplicated and out of sync.

:::info An analogy
A team repository is like a band's "setlist" — it lists who plays what and which arrangement to use. Each musician still has their own practice book (the member's Agent repo); the setlist just references them.
:::

## Four Member Sources

When you add an Agent to a team, the system records where it comes from. Four options:

| Source | When to use |
|---|---|
| **Local** | The Agent only exists on your machine — not in a git repo, not in the marketplace. Fine for personal use, but **a team containing local members cannot be shared** |
| **Git Repo** | The Agent is already pushed to GitHub/Gitee/etc., with a public or private address. The most common collaboration and sharing format |
| **Marketplace** | An Agent installed from the DesireCore marketplace, with a specific version |
| **Built-in Core** | DesireCore's built-in core Agent (`desirecore`) — everyone has it, no upload needed |

:::tip For a team to be shareable, every member needs a "remote source"
If you plan to share a team with others, make sure every member is published or pushed to git first. Purely local Agents can't be installed by anyone else.
:::

## Connecting a Team Remote Repository

To sync a team across devices or share it with others, first connect a remote repository (GitHub, Gitee, Gitea, etc.).

1. Open team settings, or click "More" in the leader's top-right menu
2. Choose "Connect Remote Repository"
3. Pick a connected OAuth account (add GitHub/Gitee accounts in settings first if you don't have one)
4. Fill in the repository URL and branch name (defaults to `main`)
5. Mark whether it's a private repository
6. Save

Once saved, the system commits the team's current state as a snapshot, ready to sync the next time you push.

:::tip You can version-manage without a remote
Even without a remote, local version history is recorded as usual. A remote just adds cloud backup for cross-device sync and external sharing — it's not required.
:::

## Viewing Team Modification History

Every time someone joins the team, gets removed, gets promoted to leader, or the team is pushed/pulled, the system automatically leaves a record.

1. Open the team settings panel and expand the "Version History" section; or click "Team Version History" in the leader's More menu
2. The status card at the top shows the current sync state:
   - **Synced** — local and remote are identical
   - **N ahead** — local has new changes, ready to push
   - **N behind** — remote has new changes, ready to pull
   - **Diverged** — both sides changed, needs merging
3. Below is a reverse-chronological list of all modifications, each showing:
   - What was done (e.g., "added member alice", "changed leader: alice → bob")
   - Who did it, when
   - Which team files were affected at the time

Actions that automatically leave a record:

| Your action | Record example |
|---|---|
| Create a new team | Initialize team repository |
| Add member | Add member: alice |
| Remove member | Remove member: bob |
| Change leader | Change organization: leader alice → bob |
| Bulk add/remove | Add members in bulk (N people) |
| Configure / remove remote | Modify remote configuration |
| Upgrade member versions | Upgrade member versions |
| Publish a new version | Release vX.Y.Z |
| Disband and archive | Archive team |

## Push and Pull a Team

Just like individual Agents, teams sync with the remote via "push" and "pull".

- **Push** — send your local changes (added members, leader changes, shared skill updates, etc.) to the remote
- **Pull** — bring remote changes down to your local

The "Push" and "Pull" buttons are at the top of the team version history panel (visible only after connecting a remote).

### When conflicts happen

If both you and someone else changed the same part of the same team, pulling will produce a conflict. DesireCore first tries to merge automatically with "prefer remote" strategy; if that still fails, it lists the conflicting files for manual resolution.

:::info Team conflicts are usually mild
Because the team repository only records "the roster and shared resources" — not the contents of member Agents — most conflicts are around the member list (e.g., two people each added a different member). The system takes the union and merges automatically.
:::

## Upgrading Team Members to Their Latest Version

When a member Agent in a team gets a new version published in its own repo, the team still points at the old version by default — this is intentional, and **guarantees reproducibility**: the team you publish today will still install the same member versions for someone six months from now, instead of drifting whenever individual members update.

When you want to bring the team in sync with members' latest versions:

1. Click "Upgrade Members" at the top of the team version history
2. The system re-checks each member's latest version
3. The team's "roster" updates to the new versions and a record is added
4. The corresponding member Agents on your machine are also updated

:::warning Locally diverged members are not overwritten
If you've modified a member Agent on your machine, the system marks it as "diverged" and **won't automatically overwrite your changes** during upgrade. It just flags the difference; whether to sync is up to you.
:::

## Publishing a New Team Version

When a team reaches a stable state and is ready to share externally or freeze as a milestone, "publish" it:

1. Click "Release New Team Version" in the leader's More menu
2. The system calculates the next version number automatically (e.g., 0.1.0 → 0.1.1)
3. The system drafts a changelog based on modifications since the last release; you can edit it
4. Check "Push to remote after release" (recommended) so the release reaches the remote too
5. Click "Release vX.Y.Z" to finish

The release leaves a record in the team version history with the version number, and creates a corresponding "version tag" so you can revisit the exact state at release time later.

:::tip A failed release won't leave the team in a half-state
If something goes wrong during release (e.g., tagging fails or the remote push fails), the system automatically rolls the team back to its pre-release state, keeping the version number and changelog consistent.
:::

## Installing a Team From Someone Else's Link

If someone published a great team and gave you a git link, you can clone it to your machine in one click:

1. In the team list, click "Add Team" → "Install From Link"
2. Paste the team's git repository URL
3. Optional: give the team a new name (leave blank to use the original)
4. Check "Also install member Agents" (recommended) — the system pulls the team's required members to your machine
5. Confirm → wait for installation

:::tip Installed teams are independent copies
DesireCore automatically disconnects the original author's remote and clears the repository address. You can modify freely, connect your own remote, and nothing affects the original author. This is the same idea as a "fork" on GitHub.
:::

During installation, each member is handled individually:

| Status | Meaning |
|---|---|
| **Installed** | The member Agent didn't exist before — just downloaded from the remote |
| **Already present (matching version)** | The Agent already exists locally at the version the team needs — skipped |
| **Local version is older** | You have this Agent locally but at a lower version than the team needs. **Your local version is not overwritten**, just flagged |
| **Locally diverged** | You have the same Agent ID locally but modified its content. **Not overwritten** |
| **Skipped (core Agent)** | DesireCore's built-in core Agent — everyone has it, no download needed |
| **Cannot install** | The team needs this member, but it has no remote address (purely local). You'll need to contact the author |

## Disbanding a Team Is Reversible

When you no longer need a team, "disband" it:

1. Click "Disband Team" in the team settings panel
2. After confirmation, the system:
   - Leaves a disband record in the team version history
   - Creates an "archive tag"
   - Moves the entire team folder to the archive area (**not actually deleted**)

If you change your mind later, you can manually restore it from the archive — all version history, shared resources, and member roster are preserved intact.

:::info Archived teams don't clutter the main list
A disbanded team disappears from the team list but stays on disk. To permanently clean up, delete the archive folder manually.
:::

## Common Scenarios

### Scenario 1: Same team on laptop and desktop

1. Connect the team to a private GitHub repo on the laptop
2. Push once after finishing the setup
3. On the desktop, "Add Team → Install From Link" with the same GitHub URL
4. After that, any change on either machine syncs via push/pull

### Scenario 2: A friend sent me a team link — how do I install it?

1. Get the link (something like `https://github.com/xxx/team-xxx.git`)
2. "Add Team → Install From Link", paste the URL
3. Check "Also install member Agents"
4. Confirm → wait — all members arrive, ready to use immediately

### Scenario 3: Publish a team for the community

1. Confirm every member is already published to the marketplace or pushed to git (no local-source members)
2. Configure the team's remote repository
3. Click "Release New Team Version", fill in the version notes
4. Share the team's git URL

### Scenario 4: Two people changed the team at the same time — how to merge?

A added carol, B added dave. When the second person tries to push, they're told "the remote moved first".

The second person:

1. Pull first — the system auto-merges (union: includes both carol and dave)
2. Push again

No manual git operations required.

### Scenario 5: The new release has a bug — how do I revert?

Every "release" in the team version history has a version tag. To return to the previous version:

1. Find the previous release tag in the version history
2. Click "Revert to this version"
3. The system creates a "rollback" record and restores the team configuration to that state

Member versions revert to the roster from that point in time. You can choose whether to roll back the local member Agents too.

## Next Steps

- [Version Control](./08-version-control.md) — Version management for an individual Agent
- [Cross-Agent Collaboration](../04-delegation/06-cross-agent.md) — How multiple Agents work together
- [Intelligent Task Orchestration](../../04-concepts/10-task-orchestration.md) — Team mode vs. swarm mode explained
