---
title: Team Version Management FAQ
description: Frequently asked questions and troubleshooting for team version management — permissions, conflicts, member version divergence, and more.
keywords: [team version, FAQ, troubleshooting, conflicts, member version, permissions]
---

# Team Version Management FAQ

This page collects common questions about team version management. For the full operation guide, see [Team Version Management](./10-team-version-management.md).

## Connection & Push

### Push fails with "rejected - non-fast-forward"

The remote has commits your local copy does not. Pull first, then push:

1. Click **Pull**
2. Wait for the merge to complete (most cases merge automatically)
3. Click **Push** again

### Connecting a remote shows "authentication failed"

- Check whether your OAuth session has expired: go to **Settings → Connected Accounts** and re-authorize GitHub/Gitee
- If you use a PAT (personal access token), confirm it has not expired and has `repo` scope
- For private repositories, make sure the token has read/write access to that specific repository

### Push succeeds but the remote shows no changes

- Verify the target branch is correct (default is `main`; some repositories use `master`)
- Refresh the remote web page — there may be a cache delay

## Members & Versions

### Installing a team shows "cannot install: missing remote address"

The member agent is local-only (not pushed to any Git repository). You need to:

- Ask the team publisher to push the member to the marketplace or a Git remote
- Or create a local agent with the same configuration as a substitute

### Team member version shows "diverged"

You have locally modified that member agent's configuration (persona, skills, etc.), creating a difference from the team's locked version.

- **No impact on usage**: the local version works as usual
- **Not overwritten**: upgrading the team will not forcefully overwrite your changes
- **To sync**: manually push your changes from the member agent's version control, then upgrade the team

### After changing the team leader, is the old leader's config still there?

Yes. Changing the leader only updates the organizational relationship; it does not affect any member's configuration, memory, or skills. The leader change is recorded in version history.

## Conflict Resolution

### Pulling shows a conflict file list

This usually happens when two people modified the same team-shared resource (e.g., a shared skill or rule file).

| Strategy | When to use |
|----------|-------------|
| **Keep Local** | Your changes are newer or more complete |
| **Use Remote** | The other person's changes are what you want |
| **Manual Edit** | You need to merge changes from both sides |
| **Keep Both** | When unsure, keep both and clean up later |

### Two members each added a new agent — will it conflict?

Usually not. The member list merge strategy is **union** — if A added carol and B added dave, the merged team has both carol and dave. A true conflict only occurs when both modify the same record (e.g., both remove the same person).

## Publishing & Installation

### Publishing shows "member is missing a remote source"

The team contains a local-only agent. Before publishing:

1. Check each member's source (local / Git / marketplace / built-in)
2. Push local-only members to Git or publish them to the marketplace
3. Re-publish the team

### After installing from a link, is there still a connection to the original author?

No. The system automatically disconnects from the original remote during installation. You get a completely independent copy (similar to a Git fork); subsequent changes do not affect the original author.

### Can I publish an installed team to the marketplace?

Yes. As long as all members have remote sources, you can publish just like the original creator. Using a different team name is recommended to avoid confusion.

## Dissolve & Recovery

### Will dissolving a team lose data?

No. Dissolving is **archiving**, not deleting:

- The team directory is moved to an archive area and fully preserved on disk
- Version history, shared resources, and the member list are all retained
- Member agents themselves are unaffected — they simply no longer belong to that team

### How do I restore a dissolved team?

Move the team directory from the archive area back to the active directory. The system will re-recognize the version history and member relationships.

## Related Pages

- [Team Version Management Full Guide](./10-team-version-management.md)
- [Single Agent Version Management](./08-version-control.md)
- [Clone and Sync](./09-clone-and-sync.md)
- [Cross-Agent Collaboration](../04-delegation/06-cross-agent.md)
