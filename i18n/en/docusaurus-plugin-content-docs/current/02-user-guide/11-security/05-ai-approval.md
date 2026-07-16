---
title: Tool and Command Approval Modes
description: Understand AI Approval, Always Ask, Allowlist, External Tools Only, and Allow All modes.
keywords: [AI approval, tool approval, command approval, ask-external, allowlist, permissions]
---

# Tool and Command Approval Modes

DesireCore stores an independent tool and command approval preference for each Agent. Approval occurs before an operation is executed; prompts, skills, and delegation cannot bypass this execution boundary.

## Five Modes

| Mode | Behavior | Waiting behavior |
|---|---|---|
| **AI Approval** (default) | Shows an approval card and asks AI to evaluate the command or tool operation | You can decide first within 30 seconds; at expiry, the AI suggestion is applied, or the operation is denied if no suggestion is available |
| **Always Ask** | Sends every confirmation-required operation to you | No automatic timeout; waits for your decision or session interruption |
| **Allowlist** | Commands matching an administrator allowlist or an exact remembered rule run directly; other operations require confirmation | Non-matching operations wait for you |
| **External Tools Only** | Built-in/system tools and shell commands run without confirmation; MCP, HTTP, and script executors still require confirmation | External tools wait for you |
| **Allow All** | Skips ordinary tool and command confirmations | No ordinary approval card, but code-level deny rules still apply |

These are Agent-level preferences; an Agent without a saved preference uses AI Approval. Built-in patterns such as protection for `secrets.json`, user or administrator deny lists, file scope, tool availability, and other code-level checks take precedence. Allow All cannot override them.

:::warning External Tools Only boundary
“External” means MCP, HTTP, and script executors. It does not mean “ask only when an operation affects the internet.” Shell commands are treated as a built-in execution capability and run directly in this mode, so enable it only for trusted Agents.
:::

## How AI Approval Works

AI Approval is not a preference model that silently learns and expands authority over time. For an operation that requires confirmation, DesireCore starts a separate risk judgment and displays its suggestion and reason on the card:

```text
Approval request
  |-- You decide within 30 seconds -> apply your decision immediately
  `-- 30 seconds expires
       |-- AI suggestion is ready -> approve or reject as suggested
       `-- No AI suggestion -> deny; do not execute the operation
```

The AI suggestion can be wrong. For irreversible actions, sensitive data, publishing, external communication, or payment, review the request before the countdown expires or switch that Agent to Always Ask.

## Approve, Reject, and Remember

The card shows the operation, risk, source Agent, and remaining time in AI Approval mode. You can:

- **Allow** only this operation.
- **Reject** this operation.
- **Always Allow** when the card permits remembering; command approval records an exact rule for the complete command.

Always Allow does not broaden wildcard text into wider authority and cannot override deny lists. When a non-shell tool cannot be generalized safely, an `approved_always` response approves only the current invocation.

## Approval in Delegated Tasks

When a child Agent or temporary worker requests approval, both the request and its decision receipt are mirrored into the parent Agent conversation that started the delegation. You can stay in the parent conversation; deciding in either panel resolves the same unique request.

In AI Approval mode, a delegated request converges after 30 seconds to the AI suggestion or a denial. Other human-confirmation modes do not reject merely because they have waited for a while. If a synchronous delegation reaches its own wait limit first, the child can remain in the background waiting for approval; the parent receives a timeout notice and can continue waiting or terminate the child task.

## Audit

Approval requests, user and AI decisions, timeouts, and session interruption retain distinct sources. A session interruption is not recorded as a user rejection, and late or duplicate decisions cannot re-execute an operation that already ended.

## Next Steps

- [Human Gate Confirmation](../04-delegation/04-human-gate.md)
- [Execution Monitoring](../04-delegation/03-execution-monitoring.md)
- [Audit Trail](./03-audit-trail.md)
