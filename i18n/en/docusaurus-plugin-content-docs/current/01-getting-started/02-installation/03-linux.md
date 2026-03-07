---
title: Linux Installation
description: Install and run DesireCore on Linux using AppImage, with support for x64 and ARM64 architectures.
keywords: [Linux, installation, AppImage, Ubuntu, Fedora, ARM64]
---

# Linux Installation

This guide covers how to install DesireCore on Linux. DesireCore is distributed as an AppImage, supporting both x64 and ARM64 architectures, and is compatible with most mainstream Linux distributions.

## Installation Steps

1. **Download the AppImage**

   Go to the [official website](https://www.desirecore.com) and click the download button. The website will automatically detect your architecture and provide the corresponding `.AppImage` file. To manually select a version (x64 / ARM64), click "More download options".

2. **Add execute permission**

   Open a terminal, navigate to the download directory, and add execute permission to the AppImage file:

   ```bash
   chmod +x DesireCore_x86_64_version.AppImage
   ```

   If you're on an ARM64 architecture (e.g., Raspberry Pi), the filename will be `DesireCore_arm64_version.AppImage`.

3. **Run DesireCore**

   Double-click the AppImage file, or run it from the terminal:

   ```bash
   ./DesireCore_x86_64_version.AppImage
   ```

:::tip What is AppImage?
AppImage is a portable application format — no installation required, just download and run. You can place it in any directory you prefer.
:::

## Creating a Desktop Shortcut

If you'd like to launch DesireCore from the application menu, you can manually create a desktop entry file:

1. Move the AppImage file to a permanent location, for example:

   ```bash
   mkdir -p ~/Applications
   mv DesireCore_x86_64_version.AppImage ~/Applications/DesireCore.AppImage
   ```

2. Create a desktop entry file:

   ```bash
   cat > ~/.local/share/applications/desirecore.desktop << 'EOF'
   [Desktop Entry]
   Type=Application
   Name=DesireCore
   Comment=AI Agent Operating System
   Exec=/home/yourusername/Applications/DesireCore.AppImage
   Icon=desirecore
   Terminal=false
   Categories=Utility;
   EOF
   ```

   Replace `yourusername` with your actual username.

3. You can now search for "DesireCore" in the application menu to launch it.

## Dependencies

AppImage typically bundles all necessary dependencies, but on some minimal distributions you may need to install FUSE:

```bash
# Ubuntu / Debian
sudo apt install libfuse2

# Fedora
sudo dnf install fuse
```

## Uninstall

Since AppImage doesn't require installation, uninstalling is simply deleting the files:

1. Delete the AppImage file
2. Delete the desktop entry file (if created): `rm ~/.local/share/applications/desirecore.desktop`
3. Delete application data (optional): `rm -rf ~/.desirecore/`

After installation, head to [First Run](../03-first-run.md) to learn about the post-launch onboarding flow.
