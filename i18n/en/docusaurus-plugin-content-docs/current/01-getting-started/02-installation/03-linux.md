---
title: Linux Installation (Including Chinese OS)
description: Install and run DesireCore on Linux using AppImage, with support for x64 and ARM64 architectures. Compatible with Ubuntu, Fedora, UnionTech UOS, Kylin OS, Deepin, openKylin, and more.
keywords: [Linux, installation, AppImage, Ubuntu, Fedora, ARM64, UnionTech UOS, Kylin OS, Deepin, openKylin]
---

# Linux Installation (Including Chinese OS)

This guide covers how to install DesireCore on Linux. DesireCore is distributed as an AppImage, supporting both x64 and ARM64 architectures, and is compatible with most mainstream Linux distributions, including Chinese domestic operating systems such as UnionTech UOS, Kylin OS, Deepin, and openKylin.

:::tip Chinese Domestic OS Users
DesireCore has been tested and verified on UnionTech UOS, Kylin OS, Deepin, openKylin, and other Chinese domestic operating systems. For platform-specific installation instructions and compatibility details, please visit the [DesireCore China website](https://www.desirecore.cn).
:::

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

## Troubleshooting

### Sandbox Error: `chrome-sandbox` / `SUID sandbox helper`

If you see an error like this when running the AppImage:

```
The SUID sandbox helper binary was found, but is not configured correctly.
Rather than run without sandboxing I'm aborting now.
You need to make sure that /tmp/.mount_Desire.../chrome-sandbox is owned by root and has mode 4755.
Trace/breakpoint trap (core dumped)
```

This occurs because DesireCore is built on Electron, whose Chromium engine requires Linux **unprivileged user namespaces** for sandboxing. Some distributions (especially Ubuntu 24.04+) restrict this feature by default via AppArmor.

#### Step 1: Diagnose the Issue

Run the following commands to check your system's user namespaces status:

```bash
sysctl kernel.unprivileged_userns_clone
sysctl kernel.apparmor_restrict_unprivileged_userns
```

- If `kernel.unprivileged_userns_clone = 0`, user namespaces are disabled — see [Option 1](#option-1-enable-unprivileged-user-namespaces).
- If `kernel.unprivileged_userns_clone = 1` but `kernel.apparmor_restrict_unprivileged_userns = 1`, AppArmor is blocking it — see [Option 2](#option-2-add-an-apparmor-profile-for-desirecore-recommended).

#### Option 1: Enable unprivileged user namespaces

```bash
# Temporary (resets on reboot)
sudo sysctl -w kernel.unprivileged_userns_clone=1

# Permanent
echo kernel.unprivileged_userns_clone = 1 | sudo tee /etc/sysctl.d/00-local-userns.conf
sudo sysctl --system
```

#### Option 2: Add an AppArmor profile for DesireCore (Recommended)

This option is for Ubuntu 24.04 and later. It grants user namespace access only to DesireCore without affecting system-wide security policies.

1. Move the AppImage to a fixed path (so the profile doesn't break on version updates):

   ```bash
   mkdir -p ~/Apps/DesireCore
   mv ~/DesireCore_x86_64_version.AppImage ~/Apps/DesireCore/DesireCore.AppImage
   chmod +x ~/Apps/DesireCore/DesireCore.AppImage
   ```

2. Create an AppArmor profile:

   ```bash
   sudo tee /etc/apparmor.d/desirecore-appimage >/dev/null <<'EOF'
   abi <abi/4.0>,

   include <tunables/global>

   /home/yourusername/Apps/DesireCore/DesireCore.AppImage flags=(unconfined) {
     userns,

     include if exists <local/desirecore-appimage>
   }
   EOF
   ```

   Replace `yourusername` with your actual username.

3. Load the profile and run:

   ```bash
   sudo apparmor_parser -r /etc/apparmor.d/desirecore-appimage
   ~/Apps/DesireCore/DesireCore.AppImage
   ```

#### Quick Test: Verify the App Can Run

If you just want to confirm the application itself works, you can temporarily disable sandboxing (**for testing only, not recommended for daily use**):

```bash
./DesireCore_x86_64_version.AppImage --no-sandbox
```

Or temporarily disable the system-level AppArmor restriction:

```bash
# Effective only for current boot session, resets on reboot
echo 0 | sudo tee /proc/sys/kernel/apparmor_restrict_unprivileged_userns
```

:::warning
`--no-sandbox` disables Chromium's process sandbox isolation, reducing security. Use it only for troubleshooting. For regular use, configure Option 1 or Option 2 above.
:::

## Uninstall

Since AppImage doesn't require installation, uninstalling is simply deleting the files:

1. Delete the AppImage file
2. Delete the desktop entry file (if created): `rm ~/.local/share/applications/desirecore.desktop`
3. Delete application data (optional): `rm -rf ~/.desirecore/`
4. Delete the AppArmor profile (if created): `sudo rm /etc/apparmor.d/desirecore-appimage`

After installation, head to [First Run](../03-first-run.md) to learn about the post-launch onboarding flow.
