---
title: Main Interface Layout
description: Learn about the three-column main interface layout structure and the responsibilities of each area in DesireCore.
keywords: [layout, three-column layout, interface structure, NavRail, conversation list, chat area]
---

# Main Interface Layout

DesireCore uses a **single-window three-column layout**, where all functions are completed within one window without switching between multiple windows.

When the right-side tool workspace is expanded in chat, its header shows a **workspace tab strip**. Each tab opens a file, terminal, web page, or review. You can switch between, create, and close resource tabs. These differ from the left-side navigation tabs such as Chat, Resources, and Apps: navigation switches feature areas, while workspace tabs switch resources within the current conversation.

## Layout Diagram

![DesireCore three-column layout](/img/user-guide/interface/three-column-layout-en.svg)

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
| Apps | Apps & Plugins workspace, with peer tabs for installed apps and plugins |
| Marketplace | Agent/Skill marketplace |
| Activity | Activity record timeline |

When you are in the "Chat" tab, this area displays your conversation list with all Agents.

### Right: Main Content Area

Occupies the remaining space (**flex-1 adaptive**), this is your main workspace. In chat mode, this is the chat area; when switching to other tabs, it displays the full interface for the corresponding function.

In chat mode, the expanded tool workspace appears in a panel beside the chat area, with resource tabs in the panel header. Opening a file, terminal, web page, or review adds its tab. Select a tab to switch resources. Closing a tab follows the close behavior for that resource type, including unsaved or running content. Workspace tabs are restored with the conversation so you can return to registered resources when you reopen it.

## File Workspace

Open a file tab, then click the floating **File actions** button in the content area. Markdown, Super Document, code, PDF, and board views share this entry; available editing and preview features depend on the format.

| Goal | Action or behavior |
|---|---|
| Find the outline, task links, or file actions | Open **File actions** and select an action available for the format |
| Locate a document section | Expand the outline, which starts collapsed |
| Browse a PDF | Use the page navigation in the preview |
| Operate the menu with a keyboard | Focus and open its entry; closing the menu returns focus to the entry |
| Switch tabs in a narrow panel | The active tab scrolls into view; file actions leave the tab strip available for navigation |

### Output Omitted When a Terminal Reconnects

After an application restart, a terminal may reconnect with output missing from its replay. If output produced while the application was closed exceeded the retention limit, the active terminal tab shows an omission banner with the dropped byte count. Review the notice, then dismiss it when ready.

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
