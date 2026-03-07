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

## Handling Windows SmartScreen Prompts

On the first run, Windows Defender SmartScreen may display a "Windows protected your PC" warning. This happens because DesireCore is a newly released application and hasn't yet accumulated enough reputation with Windows.

:::info This is not a virus
This prompt only means Windows is not yet familiar with this application — it does not indicate malware. The DesireCore installer is digitally signed.
:::

To proceed:

1. Click "More info"
2. Click "Run anyway"

<!-- Screenshot placeholder: SmartScreen handling (windows-smartscreen.png) -->

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
