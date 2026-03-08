---
title: Permission Settings
description: Manage system permissions required by DesireCore to ensure all functions work properly.
keywords: [permissions, system permissions, microphone, screen recording, accessibility, settings]
---

# Permission Settings

Some DesireCore features require the operating system to grant corresponding permissions to work properly. The permission settings page centrally displays all required system permissions and their purposes, making it convenient for you to authorize as needed.

## Opening Permission Settings

1. Open the **Settings** panel
2. Click **System Permissions** in the **Permission Management** section

## Permission List

| Permission | Purpose | When Needed |
|------------|---------|-------------|
| **Screen Recording** | Screenshot, screen sharing, and other functions | When using screenshot or screen sharing features |
| **Microphone** | Voice input, voice calls | When using voice conversation features |
| **Camera** | Video calls, taking photos | When using video-related features |
| **Accessibility** | Automated operations, global shortcuts | When using automation tools or global hotkeys |
| **Notifications** | Desktop notification push | When needing to receive background task completion reminders |

:::info
The permissions listed above are for macOS. Windows and Linux have different permission mechanisms, so the actual displayed permission items may vary by operating system.
:::

## How to Authorize

1. In the permission list, find the permission item you need to authorize
2. Click that permission item
3. The system will pop up a guide dialog explaining why this permission is needed
4. Click **Go to Authorize**, system settings will automatically open to the corresponding page
5. Check the permission for DesireCore in system settings

:::tip
You don't need to enable all permissions at once. DesireCore follows the principle of least privilege—only requesting permissions when you use the relevant feature. If you don't need a feature temporarily, you can choose "Authorize Later."
:::

## Permission Status

Each permission item displays its current status:

- **Authorized**: This permission is enabled, related functions can be used normally
- **Not Authorized**: This permission is not yet enabled, related functions are unavailable
- **Restricted**: System has partially granted the permission (e.g., microphone only allowed when app is in foreground)

## Web Mode Note

When running DesireCore in Web mode, permissions are managed by the browser. Browsers usually automatically popup to ask when you first use hardware like microphone or camera. You can view and manage granted permissions in the browser's site settings.
