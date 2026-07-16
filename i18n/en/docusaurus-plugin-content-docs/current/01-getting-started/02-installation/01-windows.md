---
title: Windows Installation
description: Complete steps to download, install, and uninstall DesireCore on Windows.
keywords: [Windows, installation, NSIS, SmartScreen]
---

# Windows Installation

This guide covers how to install DesireCore on Windows.

## Installation Steps

1. **Download the installer**

   Go to the [official website](https://www.desirecore.com) and click the download button. The website will automatically detect your system architecture and provide the corresponding `.exe` installer. To manually select a version (x64 / ARM64), click "More download options".

   <!-- Screenshot placeholder: Download Windows installer (windows-download.png) -->

2. **Run the installer**

   Double-click the downloaded `.exe` file (e.g., `DesireCore_x64_version.exe`) to launch the setup wizard.

3. **Choose installation options**

   - You can choose the installation location (defaults to `C:\Users\YourUsername\AppData\Local\Programs\DesireCore`)
   - Choose whether to install for the current user or all users

   <!-- Screenshot placeholder: Installation options (windows-install-options.png) -->

4. **Wait for installation to complete**

   The installation process usually takes only a few seconds. Click "Finish" when done.

5. **Launch DesireCore**

   After installation, you can launch DesireCore by:
   - Desktop shortcut
   - Searching for "DesireCore" in the Start menu

## Local Components Included in the Installer

The Windows package includes portable Git, recommended Python and Node.js runtime archives, and CUA Driver for local GUI automation. These are independent third-party components; you do not need to preinstall system Git, Python, Node.js, or HostAgent.

- After first startup, DesireCore imports the recommended Python and Node.js versions into its managed directories in the background. This does not replace system-wide installations.
- Git automatically selects an available, newer source between system and bundled Git by default. You can change the source on the Runtime Environment page.
- CUA Driver is enabled for GUI automation on the current Windows computer. It is a pragmatic transitional implementation that gives Windows users this capability before Windows HostAgent is complete. macOS still uses HostAgent for GUI operations, while HostAgent implementations for Windows, Linux, and other platforms remain under development.

These archives and executables increase installer and post-import disk usage. Security software may scan them again when they are extracted or first executed. Allow the scan to finish; do not disable system protection merely to bypass a warning. Open **Explorer** → **Compute** → **Runtime Environment** to inspect actual versions and paths. See [Third-Party Software and Licenses](../../05-more/09-third-party-software.md) for sources and license boundaries.

## Handling Windows SmartScreen Prompts

On the first run, Windows Defender SmartScreen may display a "Windows protected your PC" warning. This happens because DesireCore is a newly released application and hasn't yet accumulated enough reputation with Windows.

:::info Verify the source and signature first
The prompt by itself only means that Windows wants you to confirm reputation or source information; it does not by itself prove that a file is safe or unsafe. Download the installer only from the official DesireCore download page, and verify its publisher and digital signature before proceeding. Do not run copies from unknown sources or with an unexpected signature.
:::

To proceed:

1. Click "More info"
2. Click "Run anyway"

<!-- Screenshot placeholder: SmartScreen handling (windows-smartscreen.png) -->

## Updates and Protected Directories

Automatic updates normally do not require administrator privileges when DesireCore uses its default location under `%LOCALAPPDATA%\Programs\DesireCore`.

If you install DesireCore under a protected directory such as `C:\Program Files\`, the updater may require administrator approval. Windows will display a UAC prompt before the installer continues. Before updating, DesireCore attempts to stop the old process and related subprocesses. If an update fails, fully exit DesireCore and retry; restart Windows first if files remain locked.

## Uninstall

To uninstall DesireCore:

1. Open **Settings** > **Apps** > **Installed apps**
2. Search for "DesireCore"
3. Click the **...** button on the right and select "Uninstall"
4. Follow the prompts to complete the uninstallation

:::warning Data Cleanup
During uninstallation, you'll be asked whether to also delete application data. If you plan to reinstall, it's recommended to keep the data; if you're sure you won't use it again, you can choose to delete everything.
:::

After installation, head to [First Run](../03-first-run.md) to learn about the post-launch onboarding flow.
