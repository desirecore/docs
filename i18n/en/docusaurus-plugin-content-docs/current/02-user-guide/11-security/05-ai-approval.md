---
title: Tool and Command Approval Modes
description: Which Agent supplies approval settings and how seven modes behave in attended and unattended runs.
keywords: [AI approval, tool approval, unattended, delegation, permissions]
---

# Tool and Command Approval Modes

Each Agent has independent approval preferences. Approval decides whether an operation may proceed; the executor must still satisfy tool access, file scope, deny rules, and dedicated authorization gates.

:::info Version scope
Reading the immediate parent's settings for unattended delegation is a development change for client versions that include it. Earlier clients may still read the executor's settings. Documentation updates and development-branch merges do not mean an installer has been released.
:::

## Whose settings apply?

Attendance is determined by the run entry and calling relationship: whether the user can participate in this run. It does not detect whether someone is physically at the screen. Foreground display does not prove an approval card is attended.

| Scenario | Settings source | Behavior |
|---|---|---|
| Attended: A delegates to B | B's existing source | Preserve current behavior; human approvals go directly to the user |
| Unattended: A delegates to B | Immediate parent A | Read A's mode and remembered approval rules, then apply the mapping below |
| Unattended A → B → C | C reads B | No automatic escalation to A or new conversation with B |
| Unattended root run without a parent | Original executor | Preserve existing unattended behavior |
| `SendMessage` input | Original executor | Messages convey information, not approval-setting authority |
| Worker during synchronous waiting | Existing attendance test | Retain human participation when the parent is participatory and registered as waiting |
| Detached/background Worker or absent parent | Immediate caller | Apply unattended mapping; the Worker's existing execution identity is unchanged |
| Restored delegation | Preserve parent attribution | Re-read settings through the existing flow |
| New human conversation turn | Current executor | Clear previous delegation attribution |

Cross-Agent resource operations that previously read the target Agent's settings retain that original source when attended or without a parent. Only genuine unattended delegation uses the immediate parent's settings.

## File access is independent of approval

The approval pill in the chat composer and the resource panel offer quick choices for both approval mode and **file access**. The agent detail approval picker and configuration form also expose the setting. File access defaults to **Unrestricted**; existing restricted configurations remain restricted. A successfully saved choice applies on the next turn. This capability requires a client version containing the change.

| File access option | Read/write inside the workspace | Read outside | Write outside with file tools |
|---|---|---|---|
| **Unrestricted** (default) | Allowed | Allowed | Allowed |
| **Workspace only** | Allowed | Denied except existing read grants | Denied except legacy explicit directory read/write grants |
| **Workspace read/write, outside read-only** | Allowed | Allowed | Denied; referencing an outside directory only grants reading |

All allowed operations remain subject to sensitive path protection, platform resource grants, team isolation and the current run's permission ceilings. Platform data such as agent memory retains its existing grants. Workspaces come from configured work directories; explicitly add an outside project before modifying it with file tools.

| Operation | With the new outside read-only option | Approval |
|---|---|---|
| Read inside the workspace | Allowed | Unchanged |
| Write or edit inside the workspace | Allowed | Existing mode still applies; writable does not mean approval-exempt |
| Read outside | Ordinary files allowed; sensitive paths remain protected | Unchanged |
| Write outside with file tools | Denied | Allow-all, AI and human decisions cannot expand file scope |
| Bash, PowerShell, terminals and external executors | Existing execution permissions | Command rules, approval and elevation remain unchanged |
| Unattended delegation | Executor's file scope and the current run's ceilings | Ordinary approval still uses the immediate parent's settings |

This option controls file tools; **it does not isolate the filesystem access of command processes**. Approved commands may still write outside the workspace. Temporary Workers and already-created background tasks retain their existing ceilings rather than gaining authority from the new selection. Legacy `restrictToWorkDirs=true` remains Workspace only; omission/false remains Unrestricted. Explicit `file_security.accessMode` takes precedence. The seven approval modes and unattended mappings do not change.

## Seven approval modes

This table describes ordinary tool and command approval. Remembered rules, command allowlists, and existing non-gated operations are evaluated according to their own rules first.

| Configured mode | Attended | Unattended |
|---|---|---|
| **AI Approval** `ai-approve` (default) | Retain the human-first window; use AI after the window, continuing to wait if AI has not returned | Decide when a valid AI result arrives, without a human window |
| **AI Automatic** `ai-auto` | Decide when AI returns; the user can decide earlier | Apply the existing AI-approval mapping, without a human window |
| **AI Assisted** `ai-assist` | AI advises only; wait for the user | Convert to AI approval |
| **Always Ask** `ask-always` | Wait for the user | Convert to AI approval rather than waiting indefinitely for an absent user |
| **Allowlist** `allow-listed` | Matching rules allow; otherwise wait for the user | Matching rules allow; otherwise ask AI |
| **External Tools Only** `ask-external` | Exempt internal operations under existing rules; wait for the user for external executors | Exempt internal operations under existing rules; ask AI for external executors |
| **Allow All** `allow-all` | Exempt ordinary approval | Exempt ordinary approval, without an AI request |

External executors are MCP, HTTP, and script tools, not every operation that involves the internet. Shell is an internal capability. Explicit denials, sensitive paths, execution scope, tool availability, and dedicated gates such as administrator elevation remain effective under `allow-all`.

## AI and user decisions

The default human-first window is 30 seconds. It is a user decision window, not an AI response deadline. If AI is still running at expiry, the system waits for the actual result. Explicit AI unavailability follows the mode's failure rules; missing results never count as approval. Attended `ai-assist` continues waiting for a human.

Unattended delegation changes only the settings source. AI still evaluates the executor's task and actual effects. Execution identity, compute calls, timeout rules, and the existing settlement flow are not replaced by those of the parent.

Cards can offer Allow, Deny, and Always Allow when safe to remember. Command rules match the complete command exactly. Unattended delegation reads the immediate parent's remembered rules; the executor's remembered allowance cannot replace the parent's rules. Remembered approval never expands execution permissions.

## Delegation, permissions, and audit

Cards and receipts can be mirrored to the parent conversation. Mirroring keeps one request and does not add approval levels. Valid user and AI decisions share authoritative settlement; late or repeated decisions do not repeat execution.

| Question | Authority |
|---|---|
| Can the operation execute? | Executor tool access, file scope, hard denials, and existing invocation boundaries |
| Does ordinary approval allow it? | Selected settings source, rules, and effective mode |
| Who executes and owns the effects? | Original executor; changing settings source does not change identity |

Records distinguish the executor, settings source, and user/AI/interruption decision sources. Credential visibility, destination, and entry denials are still checked first. A one-time `allow-all` approval does not create permanent credential grants.

## Next steps

- [Human Gate confirmation](../04-delegation/04-human-gate.md)
- [Agent permission boundaries](../../04-concepts/12-agent-permission-boundary.md)
- [Audit trail](./03-audit-trail.md)
