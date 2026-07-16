---
title: GUI Desktop Automation
description: Learn how DesireCore uses HostAgent on macOS and the bundled CUA Driver as a temporary Windows carrier for local GUI automation.
keywords: [Computer Use, CUA Driver, GUI, Windows, macOS, desktop automation, HostAgent]
---

# GUI Desktop Automation

## Current Availability

DesireCore can currently operate native application interfaces on **local macOS and Windows computers**. It can inspect windows and accessibility elements, click controls, type text, send keys, and capture interface state. The execution carrier differs by platform:

- **macOS**: HostAgent is the current GUI-operation carrier and uses native macOS system capabilities.
- **Windows**: Until the Windows HostAgent is ready, DesireCore temporarily uses the bundled CUA Driver so Windows users can access local GUI automation now.

The Windows installer bundles and enables [CUA Driver](https://github.com/trycua/cua) by default. Under normal circumstances, Windows users do not need to install a separate driver or HostAgent.

:::info Why is HostAgent not required for local Windows automation?
CUA Driver has not replaced HostAgent: macOS GUI operations still run through HostAgent today. DesireCore uses the CUA Driver MCP subprocess on Windows only because the Windows HostAgent remains under development. The Windows carrier and capability boundary may change after that HostAgent is completed.
:::

| Scenario | Current status | Component |
|----------|----------------|-----------|
| Local macOS GUI automation | Supported | macOS HostAgent; applicable system permissions are required |
| Local Windows GUI automation | Supported as a transitional implementation | Bundled CUA Driver; no separate installation |
| Windows and Linux HostAgent | In development | Future native HostAgent implementations |
| HostAgent for other desktop systems, Android, iOS, and HarmonyOS | In development | Future platform implementations |

## How It Works

The entry point is the same on both supported platforms, but the execution path differs.

### macOS: HostAgent path

1. Describe a GUI task in DesireCore.
2. The Agent plans the steps and invokes macOS HostAgent through the device-capability path.
3. HostAgent uses native macOS frameworks and the granted Accessibility, Screen Recording, or other applicable permissions.
4. HostAgent returns interface or execution results so the Agent can continue and verify the state.

### Windows: transitional CUA Driver path

1. You describe a task in DesireCore, such as “Open Notepad and enter the meeting summary.”
2. The agent plans the steps and selects tools exposed by CUA Driver through the system MCP configuration.
3. DesireCore starts an independent `cua-driver` subprocess and communicates with it over standard input and output.
4. CUA Driver uses Windows UI Automation, window, and input capabilities, then returns window, element, or screenshot results.
5. The agent continues based on those results and verifies the final state.

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
The CUA Driver currently used on Windows is an independent third-party program supplied under its own license. It is not a DesireCore-owned component or HostAgent and serves as the transitional Windows carrier until Windows HostAgent is ready. Its version, compatibility, and upstream support may change. See the notices supplied with the software and [Third-Party Software and Licenses](../../05-more/09-third-party-software.md).
:::

## Next Steps

- Review [Detailed System Requirements](../../05-more/08-system-requirements-detail.md)
- Learn about the [Tool System](./01-tool-system.md)
- Learn about [MCP Integration](./03-mcp-integration.md)
- Read [Data Security](../11-security/04-data-security.md)
