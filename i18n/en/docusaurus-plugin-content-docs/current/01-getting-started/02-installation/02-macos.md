---
title: macOS Installation
description: Download, install, and uninstall DesireCore on macOS, including Gatekeeper handling.
keywords: [macOS, installation, DMG, Gatekeeper, Apple Silicon, Intel]
---

# macOS Installation

This guide covers how to install DesireCore on macOS.

## Installation Steps

1. **Download the DMG file**

   Go to the [official website](https://www.desirecore.com) and click the download button. The website will automatically detect your Mac's chip type (Apple Silicon or Intel) and provide the corresponding `.dmg` installer.

   :::tip Manually select architecture
   If the auto-detection is inaccurate, click "More download options" to choose manually. Click  > **About This Mac** in the top-left corner and check the "Chip" field: select the ARM64 version for "Apple M series", or the x64 version for "Intel".
   :::

2. **Open the DMG file**

   Double-click the downloaded `.dmg` file to open the installer window.

3. **Drag to Applications folder**

   Drag the DesireCore icon into the Applications folder.

   <!-- Screenshot placeholder: Drag to install (macos-drag-install.png) -->

4. **Launch DesireCore**

   Open the Applications folder and double-click DesireCore to launch.

## Handling Gatekeeper Prompts

On the first launch, macOS may display a prompt saying "DesireCore can't be opened because the developer cannot be verified." This is macOS's security mechanism (Gatekeeper) checking newly downloaded applications.

:::info DesireCore is Apple Notarized
The DesireCore installer has been notarized by Apple and is safe. The system needs additional verification on the first launch.
:::

To proceed:

**Method 1** (recommended): Right-click to open

1. Find DesireCore in the Applications folder
2. Hold **Control** and click (or right-click) DesireCore
3. Select "Open"
4. Click "Open" again in the dialog that appears

**Method 2**: Via System Settings

1. Open **System Settings** > **Privacy & Security**
2. Scroll down to find the prompt about DesireCore being blocked
3. Click "Open Anyway"

## Uninstall

To uninstall DesireCore:

1. Open **Finder** > **Applications**
2. Drag DesireCore to the Trash
3. Empty the Trash

To also remove application data, delete the following directories:

```
~/Library/Application Support/DesireCore/
~/.desirecore/
```

After installation, head to [First Run](../03-first-run.md) to learn about the post-launch onboarding flow.
