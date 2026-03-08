---
title: Notification Management
description: Learn about DesireCore's three-tier notification system, notification settings, and notification history management.
keywords: [notification, alert, three-tier notification, do not disturb, notification history]
---

# Notification Management

Agents need to communicate important information to you at the right time. DesireCore designed a layered notification system to ensure important messages aren't missed while avoiding unnecessary interruptions.

## Three-Tier Notification System

DesireCore notifications are divided into three levels with different visual presentations and behaviors:

### Normal Notifications

Daily information notifications that don't require immediate processing.

- **Source**: Notify-level results from heartbeat checks, scheduled task completion reports, etc.
- **Visual**: Standard message card
- **Sound**: None
- **Behavior**: Appear in the conversation stream, you can view anytime

### Important Notifications

Notifications requiring your attention but not urgent.

- **Source**: Important emails arriving, PR review requests, schedule changes, etc.
- **Visual**: Prominently displayed message card
- **Sound**: Subtle alert sound
- **Behavior**: Appear in the conversation stream and show badge in notification center

### Urgent Notifications

Notifications requiring your immediate decision or action.

- **Source**: Action-level results from heartbeat checks, expiration reminders, etc.
- **Visual**: Eye-catching action request card with action buttons
- **Sound**: Clear alert sound
- **Behavior**: Pop up desktop notifications, highlighted display in the app

:::info Level Determined by Agent
Notification levels aren't fixed—agents autonomously judge which level to use based on content nature and urgency. The same email might be a normal notification for daily communication from a colleague, but an urgent notification if it's from the CEO.
:::

## Notification Settings

You can finely control notification behavior in settings:

### Global Settings

| Setting | Description | Options |
|---------|-------------|---------|
| Desktop Notifications | System native notification popups | On / Off |
| Sound Alerts | Notifications accompanied by sound | On / Off |
| App Badge | Unread count on app icon | On / Off |

### Per-Agent Settings

Each agent's notifications can be configured separately:

- Whether to receive notifications from this agent
- Mute specific agent (keep records but don't push)
- Set quiet hours for this agent

### Do Not Disturb Mode

When you need to focus on work:

1. Enable **Do Not Disturb Mode**
2. All normal and important notifications are silenced
3. Only urgent notifications (Action level) can break through
4. Suppressed notifications are presented together when you turn off Do Not Disturb

:::tip Quick Enable
You can quickly toggle Do Not Disturb mode in the status bar at the top of the app without entering the settings page.
:::

## Notification History

All notifications are recorded in the notification center for later review:

- **Timeline View** — View all notifications in chronological order
- **Filter by Agent** — Only see notifications from a specific agent
- **Filter by Level** — Only see important or urgent notifications
- **Search** — Search for specific content in notification history

The notification center also shows which notifications were suppressed by mute strategies (marked as "Suppressed"), and you can still view their content.

## Handling Action Requests

For Action-level operation requests, you have three handling options:

| Action | Description |
|--------|-------------|
| **Confirm Execution** | The agent will execute the corresponding operation |
| **Reject** | Operation won't execute, agent records your decision |
| **Handle Later** | Mark as pending, remind again at next heartbeat |

Each action request displays the **risk level** of the operation to help you make judgments:

- **Low Risk** (Green): e.g., "Mark email as read"
- **Medium Risk** (Orange): e.g., "Send email reply"
- **High Risk** (Red): e.g., "Payment confirmation," "Delete file"
