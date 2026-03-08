---
title: Installation and Startup Issues
description: Resolve common problems during DesireCore installation, startup, and updates
keywords: [installation, startup, update, white screen, installation failure, macOS, Windows, Linux]
---

# Installation and Startup Issues

## Download failed or very slow?

DesireCore installation packages are hosted on Qiniu Cloud CDN. If download speeds are slow, you can try:

- Check if your network connection is normal
- Try using a VPN or switching network environments
- Get the latest download link from the official download page

## macOS shows "Cannot open because the developer cannot be verified"?

This is caused by macOS's Gatekeeper security mechanism. Solutions:

1. Open "System Settings > Privacy & Security"
2. Scroll to the bottom and find the prompt about DesireCore
3. Click "Open Anyway"
4. Or execute in terminal: `xattr -cr /Applications/DesireCore.app`

## Windows shows "Windows protected your PC"?

This is a prompt from Windows SmartScreen filter. Click "More info", then select "Run anyway".

## White screen after startup?

White screens are usually caused by renderer process loading failures. Try the following steps:

1. **Completely close and restart** — Ensure the process has fully exited (check system tray/task manager)
2. **Clear cache** — Delete the application cache directory:
   - macOS: `~/Library/Application Support/desirecore/Cache`
   - Windows: `%APPDATA%/desirecore/Cache`
   - Linux: `~/.config/desirecore/Cache`
3. **Check GPU acceleration** — DesireCore uses GPU acceleration for glass material rendering. If your graphics driver is outdated, try updating it
4. **Disable hardware acceleration** — If issues persist after driver update, try starting with the `--disable-gpu` parameter

## Stuck on loading screen at startup?

If the app stays on the loading screen, possible causes and solutions:

- **Agent service startup failed** — Check if the `~/.desirecore/` directory has write permissions
- **Port occupied** — DesireCore's Agent service needs to use local ports. Check if other programs are occupying the same ports
- **Data file corruption** — Try renaming the `~/.desirecore/` directory as a backup (e.g., `~/.desirecore.bak/`), then restart the application

## How to update to the latest version?

DesireCore supports automatic updates:

1. After starting the app, if a new version is available, an update prompt will appear on the "Settings > About" page
2. Click the update button to download and install the latest version
3. Restart the application after the update is complete

If automatic update fails, you can manually download the latest installation package from the official website and install over the existing version.

:::tip
Updating will not affect your data. All Companion data is stored in the `~/.desirecore/` directory, independent of the application.
:::

## AppImage won't start on Linux?

Make sure you have added execute permissions to the AppImage file:

```bash
chmod +x DesireCore-*.AppImage
```

If it still won't start, try running with the `--no-sandbox` parameter.

## Can't find the application icon after installation?

- **macOS**: Check the `/Applications/` directory
- **Windows**: Check desktop shortcuts or Start Menu
- **Linux**: AppImage does not automatically create desktop shortcuts. You can manually create a `.desktop` file or use the AppImageLauncher tool

## How to completely uninstall?

1. Delete the application itself (same uninstall method as other apps)
2. To also delete all data, remove the `~/.desirecore/` directory
3. Clear API Keys stored in the system credential manager (optional)
