---
title: Heartbeat Monitoring
description: Learn about the agent's heartbeat inspection mechanism—how it proactively checks for external changes and notifies you when needed.
keywords: [heartbeat, inspection, proactive monitoring, three-level response, data source]
---

# Heartbeat Monitoring

Traditional AI assistants only passively wait for your instructions. DesireCore agents are different—they can **proactively inspect** the external environment and **restrainedly notify you** when changes are detected. The core of this capability is the Heartbeat System.

## What is Heartbeat

Heartbeat is the process of an agent periodically "opening its eyes to take a look." Like a security guard who patrols every once in a while, agents check their monitored data sources at set frequencies and then decide whether to tell you.

Each heartbeat flow:

1. **Check Data Sources** — Scan connected services like email, GitHub, calendar
2. **Judge Changes** — Compare with the last check's state to identify new content
3. **Decide Response** — Based on the importance of changes, choose to remain silent, notify, or request action

## Three-Level Response

Heartbeat check results are divided into three levels, each with different behaviors:

### OK — Everything Normal

When no changes are detected in any data source, the agent silently records an inspection receipt **without disturbing you**.

You can see these "OK" records in the heartbeat history, knowing the agent is always working quietly.

### Notify — New Messages

When changes are detected but don't require immediate action, the agent sends an **information notification**.

For example: "Received 3 new emails, new comment on PR #42 on GitHub, project weekly meeting at 2 PM."

You can:
- View details immediately
- Click "Snooze," and the agent will remind you again in 15 minutes, 1 hour, or 3 hours

### Action — Needs Your Confirmation

When changes requiring your personal decision or external action are detected, the agent sends an **action request**.

For example: "Email from CEO, need you to reply with budget confirmation before end of day."

Action requests display:
- Description of the operation to perform
- Risk level of the operation (Low/Medium/High)
- Your choices: **Confirm Execution** / **Reject** / **Handle Later**

:::warning Safety First
Action requests requiring external operations **never skip your confirmation**. Agents will never send emails, approve PRs, or execute any operations with actual impact without authorization.
:::

## Configuring Inspection

### Inspection Frequency

You can adjust how frequently agents check data sources:

- **Minimum Interval**: Set by the agent developer (usually 5 minutes)
- **Maximum Interval**: Up to 24 hours
- You can freely set within this range

Frequency choice depends on your needs—set shorter for scenarios requiring timely response, longer for less urgent scenarios.

### Data Source Toggles

Each agent may be connected to multiple data sources. You can enable or disable inspection for each data source individually:

- **Email Check** — On/Off
- **GitHub Check** — On/Off
- **Calendar Check** — On/Off

:::info Can New Data Sources Be Added?
Currently, you can only enable or disable data sources predefined by the agent. Adding new data sources requires installing the corresponding tools or MCP services.
:::

## Mute Strategies

Although agents proactively notify, they also understand "restraint." You can set various mute strategies:

| Strategy | Description | Default Value |
|----------|-------------|---------------|
| **Quiet Hours** | Only record, don't notify during this period | 23:00 - 08:00 |
| **Notification Cooldown** | Minimum interval between same-level notifications | 30 minutes |
| **Focus Mode** | Full mute, only Action level can still push | Off |
| **Temporary Snooze** | Temporarily block notifications, resume at set time | Off |

During **Quiet Hours**, agents continue heartbeat inspections but won't push any Notify-level notifications. All changes are recorded and reported together in the first heartbeat after quiet hours end.

In **Focus Mode**, only Action-level urgent operation requests will disturb you—all other notifications are silenced.

## Viewing Inspection Results

### Heartbeat Status Card

On the agent details page, you can see real-time heartbeat status:

- Last check time
- Next scheduled check time
- Today's check count
- Status distribution (how many OK / Notify / Action)

### Heartbeat History

History shows all recent heartbeat checks, supporting filtering by level. Each record includes:

- Check time
- Response level
- Change summary
- Processing status (e.g., whether Action level has been confirmed)

:::tip Traceable
Each heartbeat check generates an immutable receipt, ensuring all agent behavior is traceable and auditable.
:::
