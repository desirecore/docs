---
title: GUI Desktop Automation
description: Learn how DesireCore uses HostAgent on macOS and the bundled CUA Driver on Windows for local GUI automation.
keywords: [Computer Use, CUA Driver, GUI, Windows, macOS, desktop automation, HostAgent]
---

# GUI Desktop Automation

## Current Availability

DesireCore can currently operate native application interfaces on **local macOS and Windows computers**. It can inspect windows and accessibility elements, click controls, type text, send keys, and capture interface state. The setup requirements differ by platform:

- **macOS**: Connect HostAgent and grant the permissions your task requires, such as Accessibility and Screen Recording.
- **Windows**: The bundled CUA Driver operates local application interfaces; no separate HostAgent installation is required.

The Windows installer bundles and enables [CUA Driver](https://github.com/trycua/cua) by default. Under normal circumstances, Windows users do not need to install a separate driver or HostAgent.

| Scenario | Current status | Component |
|----------|----------------|-----------|
| Local macOS GUI automation | Supported | macOS HostAgent; applicable system permissions are required |
| Local Windows GUI automation | Supported | Bundled CUA Driver; no separate installation |
| GUI automation on Linux, other desktop systems, Android, iOS, and HarmonyOS | Not yet available | — |

## How It Works

### macOS: HostAgent path

1. Describe the task in DesireCore.
2. With HostAgent connected and the required permissions granted, the agent reads the interface and performs the requested clicks, typing, or screenshots.
3. The agent checks the interface after each step and reports the result or asks for confirmation when needed.

### Windows: CUA Driver path

1. Describe the task, for example: “Open Notepad and type the meeting summary.”
2. The agent uses the available desktop tools to read windows, click controls, type text, and take screenshots.
3. It checks the interface after each step and confirms the final result.

If a separately installed `cua-driver` is already on your `PATH`, DesireCore prefers it. Otherwise, it falls back to the bundled version. If neither is available, the capability is skipped without repeatedly producing connection errors.

## Supported Operations

| Operation | Examples |
|-----------|----------|
| Windows and apps | List windows, launch an app, switch or focus a window |
| Interface inspection | Capture a window, inspect its accessibility tree, read control names and values |
| Pointer input | Click, double-click, right-click, drag, and scroll |
| Keyboard input | Type text and send individual or combined keys |
| Control operations | Read or set a value when the target app supports the required platform accessibility pattern |

Example requests:

> “List the main windows currently open on this desktop.”

> “Open the system text editor, enter this text, then inspect the window again to confirm it. Ask me before saving.”

## Check Availability

### macOS

- Confirm that macOS HostAgent is running and connected to DesireCore.
- In **System Settings → Privacy & Security**, check Screen Recording, Accessibility, and other permissions required by the task. A permission change may require restarting HostAgent or DesireCore.
- If HostAgent is offline, check its connection in the device or infrastructure area before retrying.

### Windows

Open **Explorer** → **Compute** → **Runtime Environment**, refresh detection, and check **CUA Driver**:

- If a version and path are shown, the capability is available. The path may point to a user-installed version or DesireCore's bundled directory.
- If it is unavailable, update to the latest Windows version of DesireCore, restart the app, and refresh detection.

The installer contains the driver for supported architectures. Refer to the CUA project's official installation instructions only when the bundled file is missing or quarantined, or when you deliberately need to test a newer upstream version. Do not download executables from untrusted sources.

## Known Boundaries

GUI automation depends on the accessibility, window, and input capabilities exposed by the platform and target app. Results vary by system, app, permissions, and current UI state:

- Some modern, legacy, or custom-drawn interfaces expose insufficient platform accessibility capability. The Agent may need to click and type instead, or may be unable to complete the action reliably.
- Background actions are not reliable in every app. Raising a window, opening a dialog, or creating a new window may interrupt your current work.
- On macOS, HostAgent cannot perform the corresponding reads or actions without Accessibility or Screen Recording permission. On Windows, elevated applications, the UAC secure desktop, locked screens, and protected content may also be inaccessible. Do not broaden system permissions merely to bypass a restriction.
- Display scaling, app updates, loading delays, and overlapping windows can invalidate element locations. Important actions should be followed by another interface inspection.
- Payments, publishing, deletion, messages, and system changes have real external effects. Rewinding local state generally cannot reverse them.

## Privacy and Safety

Window titles, accessibility text, screenshots, and text you ask the agent to enter may contain personal, account, or business information. To complete the task, this material may be sent in conversation context to your selected model or related service. Before use, make sure the target window does not expose information you do not want processed or transmitted, and follow your organization's security requirements.

Recommended practices:

- Require the agent to pause for your confirmation before sending, paying, deleting, authorizing, or publishing.
- Do not expose plaintext passwords, recovery codes, private keys, or one-time codes in captured windows.
- Retain control of the device and stop the task immediately if the target window or step is wrong.
- Test business-critical workflows with a test account or copied data first.

:::warning Third-party component
The CUA Driver currently used on Windows is an independent third-party program supplied under its own license. It is not a DesireCore-owned component or HostAgent. Its version, compatibility, and upstream support may change. See the notices supplied with the software and [Third-Party Software and Licenses](../../05-more/10-third-party-software.md).
:::

## Next Steps

- Review [Detailed System Requirements](../../05-more/08-system-requirements-detail.md)
- Learn about the [Tool System](./01-tool-system.md)
- Learn about [MCP Integration](./03-mcp-integration.md)
- Read [Data Security](../11-security/04-data-security.md)
