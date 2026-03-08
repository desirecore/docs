---
title: Navigation Rail
description: Learn about each button and function entry in the DesireCore left navigation rail (NavRail).
keywords: [navigation rail, NavRail, Tab, function entry, settings, notifications]
---

# Navigation Rail

The Navigation Rail (NavRail) is located at the far left of the window, 62px wide, and serves as the unified entry point for all DesireCore functions.

## Structure Overview

The navigation rail is divided into three areas from top to bottom:

```
+--------+
| Traffic|  <- macOS window control buttons (macOS only)
| Lights |
+--------+
|  Logo  |  <- DesireCore brand identity
+--------+
|  Chat  |  Tab 0
|  Rel.  |  Tab 1
|  Res.  |  Tab 2
|  Apps  |  Tab 3
|  Mkt.  |  Tab 4
|        |
| (blank)|  <- Draggable area (desktop window dragging)
|        |
+--------+
|  Notif.|  Bell button + unread badge
|  Activ.|  Tab 5
|Settings|  Gear button (opens settings panel)
| Avatar |  User avatar (click to edit profile)
+--------+
```

## Function Navigation Buttons

| No. | Icon | Function | Description |
|------|------|------|------|
| Tab 0 | Bubble | **Chat** | Default page, displays conversation list and chat area |
| Tab 1 | Person | **Relationships** | Relationship graph of Agents and contacts |
| Tab 2 | Folder | **Resources** | Agent resource manager (skills, tools, files) |
| Tab 3 | Grid | **Apps** | Installed applications and services |
| Tab 4 | Bag | **Marketplace** | Agent and skill marketplace, browse and install new capabilities |
| Tab 5 | Pulse | **Activity** | Activity records and execution logs for all Agents |

## Bottom Toolbar Area

### Notification Bell

The bell icon at the bottom of the navigation rail is the entry point for the Notification Center.

- When there are unread notifications, a **red badge** appears in the upper right corner of the bell, showing the unread count
- When unread notifications exceed 99, the badge becomes a red dot (no number displayed)
- Clicking the bell slides out the notification panel from the right. See [Notification Center](./06-notifications.md) for details

### Settings Button

Gear icon, clicking it opens the settings panel. Here you can configure appearance themes, keyboard shortcuts, language, Compute services, etc.

### User Avatar

Your avatar (32x32 circular) is displayed at the bottom. Clicking the avatar allows you to edit your profile.

- In guest mode, a small green dot appears in the lower right corner of the avatar
- Hovering displays your username or guest mode prompt

## Interaction States

Navigation buttons have three visual states:

| State | Appearance |
|------|------|
| Default | Transparent background, gray icon |
| Hover | Light white semi-transparent background |
| Selected | White semi-transparent background + shadow, icon turns green |

The currently selected Tab is highlighted with a green icon, letting you know at a glance which function module you are in.

:::tip Drag Window
On desktop, the blank area in the middle of the navigation rail can be used to drag the entire window. On macOS, the three window buttons (red, yellow, green) are located at the top of the navigation rail; on Windows and Linux, window control buttons are in the upper right corner.
:::
