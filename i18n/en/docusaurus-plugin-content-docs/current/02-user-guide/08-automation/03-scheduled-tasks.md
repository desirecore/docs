---
title: Scheduled Tasks
description: Learn how to create and manage scheduled tasks—letting agents automatically execute repetitive work according to your set schedule.
keywords: [scheduled task, scheduling, automation, timed reminder, periodic task]
---

# Scheduled Tasks

Repetitive work shouldn't occupy your attention. Through DesireCore's scheduling system, you can have agents automatically execute tasks according to a set schedule.

## Creating Tasks Through Conversation

In DesireCore, the most natural way to create scheduled tasks is to **simply talk to the agent**:

```
You: "Give me a daily briefing of today's todos and schedule every morning at 8 AM"

Agent: "Okay, I'll create a daily morning briefing task:
         ┌────────────────────────────────────────┐
         │  Scheduled Task · Create                │
         │  Daily Morning Briefing                 │
         │  Every day at 8:00 (Asia/Shanghai)      │
         │         [ Approve ]    [ Reject ]       │
         └────────────────────────────────────────┘"

You: [Click Approve]

Agent: "Created. Starting tomorrow, I'll prepare a work overview for you every morning at 8 AM."
```

You don't need to fill out complex forms or learn any syntax—describe your needs in natural language, and the agent will help convert them into scheduling rules.

## Five Scheduling Types

The scheduling system supports five time rules, covering almost all scenarios:

| Type | Use Case | Natural Language Example |
|------|----------|--------------------------|
| **at** | Trigger once at a specific time | "Remind me to submit the report tomorrow at 3 PM" |
| **delay** | Countdown from now | "Remind me about the meeting in 30 minutes" |
| **interval** | Repeat at fixed intervals | "Check email every 30 minutes" |
| **cron** | Calendar-aligned periodic tasks | "Every weekday at 9 AM" |
| **rrule** | Advanced recurrence rules | "First business day of every month at 9 AM" |

:::tip Selection Advice
- Only trigger once? → Use **at** or **delay**
- Fixed time intervals? → Use **interval**
- Fixed time daily/weekly? → Use **cron**
- More complex rules? → Use **rrule**

Don't worry about which to choose—just tell the agent your needs in natural language, and it will automatically select the appropriate type.
:::

## Typical Scenarios

### Daily Morning Briefing

> "Summarize today's schedule and todos every morning at 8 AM"

The agent will automatically every morning at 8 AM:
1. Check your calendar events
2. Organize todo items
3. Check important emails
4. Generate a structured briefing and push it to you

### Regular Checks

> "Check GitHub and email for new messages every 30 minutes"

The agent will every 30 minutes:
1. Check for new emails
2. Check GitHub notifications and PRs
3. Send notification when there are changes, remain silent when there aren't

### Delayed Reminder

> "Remind me to attend the meeting in 30 minutes"

The agent will set a 30-minute countdown and remind you via desktop notification and sound when time is up. This is a one-time task that automatically completes after triggering.

### Weekly Report Summary

> "Remind me to write the weekly report every Friday at 5 PM and help me summarize this week's work"

Every Friday at 5 PM, the agent will:
1. Review this week's conversations and tasks
2. Organize key achievements and decisions
3. Push to you as weekly report material

## Managing Scheduled Tasks

### Viewing Task List

In the agent's **Automation Panel**, you can see all created scheduled tasks:

- Task name and description
- Scheduling rule (e.g., "Every day at 8:00")
- Current status (Running / Paused / Completed)
- Next trigger time
- Last execution result

### Pausing and Resuming

When you don't need a task, you can pause it without deleting:

- **Pause** — Stop scheduling, but keep configuration
- **Resume** — Continue scheduling with original rules

### Modifying Tasks

Need to adjust a task? Just talk to the agent:

```
You: "Change the daily morning briefing time to 7:30 AM"
Agent: "Updated, starting tomorrow the briefing will be pushed at 7:30 AM."
```

### Deleting Tasks

Tasks that are no longer needed can be directly deleted. Find the corresponding task in the task list and click delete.

## Task Execution Records

Each schedule trigger generates an execution record, where you can view:

- Trigger time
- Execution status (Success / Failed)
- Execution result summary
- Detailed output content

:::info What if Execution Fails?
If a scheduled task execution fails (e.g., data source temporarily unavailable), the system records the failure reason. For periodic tasks, the next schedule will still trigger normally. You can view failure details in the execution records.
:::

## Scheduling and Notifications

Scheduled task execution results are pushed to you through the notification system:

1. Scheduling engine triggers task at scheduled time
2. Agent executes task content
3. After execution completes, results are pushed via notification
4. Notification records are saved in the notification center

Notification level depends on task results—daily reports are normal notifications, results requiring your action are urgent notifications.
