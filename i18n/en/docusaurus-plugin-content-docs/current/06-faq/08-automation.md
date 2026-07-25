---
title: Automation Issues
description: Resolve common issues with scheduled tasks, heartbeat monitoring, and automation in DesireCore
keywords: [schedule, heartbeat, timed tasks, automation, cron, periodic]
---

# Automation Issues

## What's the difference between Schedule and Heartbeat?

| Comparison | Schedule | Heartbeat |
|------------|----------|-----------|
| Trigger | Time-based (timed/delay/interval/cron) | System wakes Agent at fixed intervals |
| Purpose | Execute a specific task at a future time | Let Agent proactively check status and monitor changes |
| Context | Each trigger creates a brand-new session with no inherited context | Executes within the current Agent's context |
| Typical use | "Remind me in 3 minutes", "Generate daily report at 9 AM" | "Monitor build status", "Periodically check email" |
| Management | ManageSchedule tool | Configuration in heartbeat/ directory |

Simple memory aid: **Schedule = alarm clock** (do a specific thing at a specific time), **Heartbeat = patrol** (periodically check if anything needs attention).

## Why didn't my scheduled task trigger?

Troubleshooting steps:

1. **Confirm schedule exists** --- Use ManageSchedule (action=list) to check the schedule list; ensure the task wasn't deleted or cancelled
2. **Check trigger time** --- Confirm the trigger_value timezone is correct (use timezone-aware ISO format, e.g., `2026-07-26T09:00:00+08:00`)
3. **Check if app is running** --- Schedules require DesireCore to be running; schedules that expire while the app is closed will trigger on next launch
4. **Check execution permissions** --- Schedule execution is subject to approval mode settings

## How do I view schedule execution history?

Each schedule trigger creates a new session (Run). Viewing methods:

1. Find the corresponding session in the Agent's conversation history at the trigger time
2. The schedule's prompt appears as the first message in that session
3. If execution failed, error information is visible in the session record

## Heartbeat notifications are too frequent — how do I adjust?

If an Agent's heartbeat checks produce excessive notifications:

1. **Adjust heartbeat interval** --- Modify the check frequency in heartbeat configuration
2. **Use notify=false** --- Silently record when there's no change, without sending notifications
3. **Optimize check logic** --- Only set notify=true when there's an actual change or something requiring attention

:::tip
Good heartbeat practice: Return `no_change` (silent) most of the time; only notify the user when an anomaly or important change is detected.
:::

## Should I use Sleep or Schedule?

| Scenario | Choice | Reason |
|----------|--------|--------|
| Wait 5 seconds then check build status | Sleep | Need the result to continue the current task |
| Remind me to join a meeting in 3 minutes | Schedule | Independent task, doesn't need current context |
| Poll waiting for download to complete | Sleep | Loop-checking within the same task chain |
| Generate report every day at 9 AM | Schedule (cron) | Periodic independent task |

Core difference: Sleep blocks in the current session (preserves context); Schedule creates a brand-new session on trigger (no context).

## How do I create a periodic scheduled task?

Use the ManageSchedule tool with four trigger types:

| Type | Description | Example |
|------|-------------|---------|
| `delay` | Execute once after delay | ISO Duration: `PT30M` (30 minutes later) |
| `at` | Execute once at specific time | `2026-07-26T09:00:00+08:00` |
| `interval` | Repeat at fixed interval | `PT1H` (every hour) |
| `cron` | Cron expression | `0 9 * * 1-5` (weekdays at 9 AM) |

Example prompt: "Remind me to check the weekly report every Monday at 9 AM" → trigger_type=cron, trigger_value="0 9 * * 1"

## How do I troubleshoot failed schedule executions?

1. **Check session records** --- Find the session created by the schedule trigger and review error messages
2. **Check if prompt is clear** --- Schedule prompts should contain sufficient context since new sessions don't inherit previous conversations
3. **Check dependent services** --- If the task needs network, specific files, or APIs, confirm they're available at trigger time
4. **Check approval mode** --- In confirmation-required modes, unattended schedules may timeout waiting for approval

:::warning
Don't reference "content from the last conversation" or "previous context" in schedule prompts — each trigger is a brand-new session with no history. Include needed information directly in the prompt.
:::
