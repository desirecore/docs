---
title: Main Interface Layout
description: Learn about the three-column main interface layout structure and the responsibilities of each area in DesireCore.
keywords: [layout, three-column layout, interface structure, NavRail, conversation list, chat area]
---

# Main Interface Layout

DesireCore uses a **single-window three-column layout**, where all functions are completed within one window without switching between multiple windows.

## Layout Diagram

```
+--------------------------------------------------------------+
|  +------+--------------+----------------------------------+   |
|  | Nav  | Conversation |          Chat Area               |   |
|  | Rail |    List      |                                  |   |
|  |      |              |  Header (Agent info + actions)   |   |
|  | 62px |    290px     |  --------------------------------|   |
|  |      |              |  Message List                    |   |
|  |      |              |                                  |   |
|  |      |              |  --------------------------------|   |
|  |      |              |  Input Area                      |   |
|  +------+--------------+----------------------------------+   |
+--------------------------------------------------------------+
```

## Three-Column Responsibilities

### Left: Navigation Rail (NavRail)

Fixed width of **62px**, this is the entry point for all application functions. From top to bottom, it displays the Logo, function navigation buttons, and bottom toolbar area. See [Navigation Rail](./02-navigation-rail.md) for details.

### Middle: Content List Area

Default width **290px**, displays different content based on the current function module:

| Navigation Tab | Middle Column Content |
|----------|--------------|
| Chat | Conversation list (grouped by Agent) |
| Relationships | Agent/Contact relationship graph |
| Resources | Resource manager |
| Apps | Installed applications list |
| Marketplace | Agent/Skill marketplace |
| Activity | Activity record timeline |

When you are in the "Chat" tab, this area displays your conversation list with all Agents.

### Right: Main Content Area

Occupies the remaining space (**flex-1 adaptive**), this is your main workspace. In chat mode, this is the chat area; when switching to other tabs, it displays the full interface for the corresponding function.

## Responsive Behavior

DesireCore automatically adjusts the layout based on window size:

- **Navigation Rail** always maintains 62px width
- **Conversation List** can be collapsed when the window is narrow
- **Chat Area** adapts to the remaining width
- Minimum window size is **960 x 640 pixels**
- Chat header enters compact mode when window width is below 640px, with some buttons moved to the "More" menu

:::info Flip View
In the chat interface, clicking the "Immersive Interaction" button in the header flips to the Digital Avatar interface, which is an independent 3D interaction view. The flip animation takes about 1 second, and the background color changes accordingly. See [Digital Avatar Interface](./05-digital-avatar.md) for details.
:::

## Design Style

DesireCore's interface adopts the **Liquid Glass** design language. You will notice the following visual characteristics:

- **Semi-transparent glass material**: Panels and cards have Gaussian blur effects, with background colors subtly visible
- **Fine borders**: 0.5px thin divider lines between panels
- **Highlight reflections**: Some elements have subtle glossy effects at the top
- **Soft shadows**: Multi-layered shadows create a sense of depth

This design makes the interface look lightweight and transparent, while establishing clear visual hierarchy through different levels of blur intensity.
