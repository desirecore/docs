---
title: Notification Center
description: Learn about the location, notification types, and management operations of the DesireCore Notification Center.
keywords: [notification center, notifications, unread, message alerts, NotificationCenter]
---

# Notification Center

The Notification Center is DesireCore's unified message alert system, centrally displaying various notifications from Agents, the system, and tasks.

## Entry Location

The entry to the Notification Center is the **bell icon** at the bottom of the left navigation rail:

- When there are unread notifications, a red badge and unread count appear in the upper right corner of the bell
- When unread notifications exceed 99, the badge becomes a red dot
- Clicking the bell slides out the notification panel from the right

## Panel Layout

The notification panel slides in from the right, 320px wide, containing the following areas:

```
+----------------------------------+
|  Notifications  [Read All] [Clear]|  <- Top bar
+----------------------------------+
|  [All] [Messages] [System] [Tasks]|  <- Category Tabs
+----------------------------------+
|                                  |
|  [Icon] Title           3m ago    |  <- Notification item
|         Body content...   (unread)|
|                                  |
|  [Icon] Title           1h ago    |
|         Body content...           |
|                                  |
+----------------------------------+
```

## Notification Types

Notifications are divided into three categories:

| Category | Description | Example |
|------|------|------|
| **Messages** | Conversation message notifications from Agents | "Legal Assistant sent you a contract review result" |
| **System** | System-level notifications | "DesireCore has been updated to v2.1.0" |
| **Tasks** | Task execution related notifications | "Data analysis report generation completed" |

Each type has a unique icon and color identifier for quick distinction.

## Notification Management

### Viewing Notifications

- Click a notification item to mark it as read and jump to related content
- Unread notifications have a light highlight background, read notifications have a normal background

### Batch Operations

- **Read All**: Mark all notifications as read with one click
- **Clear All**: Clear all notifications

### Category Filtering

The category tabs at the top can quickly filter notifications of specific categories:
- Selected categories are highlighted in green
- The "All" tab displays notifications of all categories

## Closing the Notification Panel

The following actions close the notification panel:
- Click the mask area outside the panel
- Press **Esc** key
- Click a notification item to jump to related content (auto-closes)

## Time Display

Notification times are displayed in relative format, closer to daily reading habits:

| Time Range | Display Format |
|---------|---------|
| Less than 1 minute | "Just now" |
| 1-59 minutes | "X minutes ago" |
| 1-23 hours | "X hours ago" |
| 1-29 days | "X days ago" |
| 30+ days | Specific date (e.g., "2026/2/15") |

:::info Notifications Won't Be Lost
Notification data is persistently stored locally. Even if you close the application, all notifications are retained when you reopen it, and unread status is restored.
:::
