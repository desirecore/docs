---
title: Installation and Startup Issues
description: Resolve common problems during DesireCore installation, startup, and updates
keywords: [installation, startup, update, white screen, installation failure, macOS, Windows, Linux]
---

# Installation and Startup Issues

## Download failed or very slow?

DesireCore installation packages are hosted on multiple download sources (CDN, build servers, GitHub Releases, etc.). The client and website automatically **speed-test** each source before downloading and pick the fastest one.

If you still experience download issues, you can try:

- Check if your network connection is normal
- Try using a VPN or switching network environments
- Get the latest download link from the official download page (the website also supports multi-source speed testing)

## macOS shows "Cannot open because the developer cannot be verified"?

This is caused by macOS's Gatekeeper security mechanism. Solutions:

1. Open "System Settings > Privacy & Security"
2. Scroll to the bottom and find the prompt about DesireCore
3. Click "Open Anyway"
4. Or execute in terminal: `xattr -cr /Applications/DesireCore.app`

## Windows shows "Windows protected your PC"?

This is a Windows SmartScreen source or reputation prompt. First confirm that the installer came from the official DesireCore download page, then inspect its publisher and digital signature in file properties. Proceed through the system UI only after those details match. Do not select “Run anyway” for an unknown source, missing signature, or unexpected publisher.

## Do I need to install Git, Python, or Node.js separately?

Usually not. The desktop package includes portable Git and recommended offline Python and Node.js archives. After first startup, DesireCore imports the recommended runtimes into Hatch/Volta-managed user directories in the background. It does not replace system-wide installations.

You can still install or use system versions. Git compares system and bundled sources by default and chooses an available, newer version. Manage additional Python and Node.js versions under **Explorer** → **Compute** → **Runtime Environment**. Tasks that explicitly require Docker, Podman, a specific runtime, or a system-level dependency still require separate setup.

## Does Windows GUI automation require HostAgent?

No. The Windows installer bundles and enables CUA Driver by default, so GUI automation on the current computer can be used directly. CUA Driver is a pragmatic transitional implementation that gives Windows users this capability before Windows HostAgent is complete; it does not mean HostAgent has been deprecated. macOS GUI operations still run through HostAgent, while HostAgent implementations for Windows, Linux, other desktops, and mobile platforms remain under development.

If an agent cannot find the GUI tools, open **Explorer** → **Compute** → **Runtime Environment**, refresh, and check CUA Driver:

- Update to the latest Windows release of DesireCore and restart it.
- Check whether security software quarantined `cua-driver.exe` in the installation directory. Verify the file's source and signature/hash record before acting; do not simply disable system protection.
- If you installed CUA Driver separately, verify that the version on `PATH` runs correctly. DesireCore prefers the `PATH` version, then falls back to its bundled copy.

See [GUI Desktop Automation](../02-user-guide/09-capabilities/05-computer-use.md).

## Why does security software scan several command-line programs?

DesireCore agents need local version control, scripting, and Windows GUI capabilities, so the package includes independent Git, Python/Node.js archives, and CUA Driver. Security software may scan each file during installation, extraction, or first execution. A scan by itself is not a malware finding.

Always use the official installer and keep system protection enabled. If security software reports a specific threat, do not blindly add an exclusion. Record the path, DesireCore version, detection name, and file hash, then report it through an official support channel. See [Third-Party Software and Licenses](../05-more/09-third-party-software.md) for component sources and license boundaries.

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

DesireCore supports automatic updates, checking every 5 minutes after startup:

1. When a new version is detected, the system automatically downloads the update from the fastest source
2. On Windows, select **Exit App and Upgrade Automatically** after the download. The main app closes and a separate upgrade-progress window opens; wait for it to finish, then launch the new version from that window
3. On other platforms, follow the displayed restart or installation flow. Selecting **Later** temporarily suppresses repeated reminders

While the Windows upgrade-progress window is running, do not start DesireCore again or terminate update-related processes. If it fails, preserve the displayed error and use the window action to open the installation directory for troubleshooting.

You can also manually check for updates on the "Settings > About" page.

**Update channels**: DesireCore offers **Stable** and **Beta** channels. Stable is used by default. You can switch to Beta in "Settings > About > Update Channel" to get early access to new features. See [About & Updates](../02-user-guide/10-settings/08-about.md#update-channels) for details.

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
3. If you used a sign-in managed by OAuth, a CLI, or a subscription tool, sign out and clear that external credential according to the tool's instructions (optional)
