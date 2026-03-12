---
title: Linux 安装（含国产操作系统）
description: 在 Linux 上使用 AppImage 安装和运行 DesireCore，支持 x64 和 ARM64 架构，兼容 Ubuntu、Fedora 及统信 UOS、银河麒麟、深度 Deepin、openKylin 等国产操作系统。
keywords: [Linux, 安装, AppImage, Ubuntu, Fedora, ARM64, 统信UOS, 银河麒麟, 深度Deepin, openKylin, 国产操作系统]
---

# Linux 安装（含国产操作系统）

本指南介绍如何在 Linux 上安装 DesireCore。DesireCore 以 AppImage 格式分发，支持 x64 和 ARM64 架构，兼容大多数主流 Linux 发行版，同时也支持统信 UOS、银河麒麟、深度 Deepin、openKylin 等国产操作系统。

:::tip 国产操作系统用户
DesireCore 已在统信 UOS、银河麒麟（Kylin）、深度 Deepin、openKylin 等国产操作系统上完成适配测试。如需了解国产系统专属的安装说明和兼容性信息，请访问 [DesireCore 中国官网](https://www.desirecore.cn)。
:::

## 安装步骤

1. **下载 AppImage**

   前往 [官网](https://www.desirecore.cn)，点击下载按钮。网站会自动检测你的架构并提供对应的 `.AppImage` 文件。如需手动选择（x64 / ARM64），可点击"More download options"。

2. **添加执行权限**

   打开终端，进入下载目录，为 AppImage 文件添加执行权限：

   ```bash
   chmod +x DesireCore_x86_64_版本号.AppImage
   ```

   如果你使用的是 ARM64 架构（如树莓派等），文件名为 `DesireCore_arm64_版本号.AppImage`。

3. **运行 DesireCore**

   双击 AppImage 文件，或在终端中运行：

   ```bash
   ./DesireCore_x86_64_版本号.AppImage
   ```

:::tip 什么是 AppImage？
AppImage 是一种便携式应用格式——不需要安装，下载后直接运行。你可以把它放在任何你喜欢的目录里。
:::

## 创建桌面快捷方式

如果你希望从应用菜单中启动 DesireCore，可以手动创建一个桌面入口文件：

1. 将 AppImage 文件移动到一个固定位置，例如：

   ```bash
   mkdir -p ~/Applications
   mv DesireCore_x86_64_版本号.AppImage ~/Applications/DesireCore.AppImage
   ```

2. 创建桌面入口文件：

   ```bash
   cat > ~/.local/share/applications/desirecore.desktop << 'EOF'
   [Desktop Entry]
   Type=Application
   Name=DesireCore
   Comment=AI Agent Operating System
   Exec=/home/你的用户名/Applications/DesireCore.AppImage
   Icon=desirecore
   Terminal=false
   Categories=Utility;
   EOF
   ```

   请将 `你的用户名` 替换为你的实际用户名。

3. 之后你就可以在应用菜单中搜索"DesireCore"来启动了。

## 依赖项

AppImage 通常已包含所有必要的依赖，但在某些精简版发行版上，你可能需要安装 FUSE：

```bash
# Ubuntu / Debian
sudo apt install libfuse2

# Fedora
sudo dnf install fuse
```

## 常见问题排查

### 沙箱错误：`chrome-sandbox` / `SUID sandbox helper`

运行 AppImage 时如果出现类似以下报错：

```
The SUID sandbox helper binary was found, but is not configured correctly.
Rather than run without sandboxing I'm aborting now.
You need to make sure that /tmp/.mount_Desire.../chrome-sandbox is owned by root and has mode 4755.
Trace/breakpoint trap (core dumped)
```

这是因为 DesireCore 基于 Electron 构建，其 Chromium 内核需要 Linux **unprivileged user namespaces** 支持来运行沙箱。部分发行版（尤其是 Ubuntu 24.04+）默认通过 AppArmor 限制了此功能。

#### 第一步：诊断问题

在终端运行以下命令，确认系统的 user namespaces 状态：

```bash
sysctl kernel.unprivileged_userns_clone
sysctl kernel.apparmor_restrict_unprivileged_userns
```

- 如果 `kernel.unprivileged_userns_clone = 0`，说明 user namespaces 被禁用，请参照 [方案一](#方案一启用-unprivileged-user-namespaces)。
- 如果 `kernel.unprivileged_userns_clone = 1` 但 `kernel.apparmor_restrict_unprivileged_userns = 1`，说明 AppArmor 在限制，请参照 [方案二](#方案二为-desirecore-添加-apparmor-配置推荐)。

#### 方案一：启用 unprivileged user namespaces

```bash
# 临时生效（重启后失效）
sudo sysctl -w kernel.unprivileged_userns_clone=1

# 永久生效
echo kernel.unprivileged_userns_clone = 1 | sudo tee /etc/sysctl.d/00-local-userns.conf
sudo sysctl --system
```

#### 方案二：为 DesireCore 添加 AppArmor 配置（推荐）

此方案适用于 Ubuntu 24.04 及以上版本，仅对 DesireCore 放行 user namespaces，不影响系统整体安全策略。

1. 将 AppImage 放到固定路径（避免每次更新版本后 profile 失效）：

   ```bash
   mkdir -p ~/Apps/DesireCore
   mv ~/DesireCore_x86_64_版本号.AppImage ~/Apps/DesireCore/DesireCore.AppImage
   chmod +x ~/Apps/DesireCore/DesireCore.AppImage
   ```

2. 创建 AppArmor profile：

   ```bash
   sudo tee /etc/apparmor.d/desirecore-appimage >/dev/null <<'EOF'
   abi <abi/4.0>,

   include <tunables/global>

   /home/你的用户名/Apps/DesireCore/DesireCore.AppImage flags=(unconfined) {
     userns,

     include if exists <local/desirecore-appimage>
   }
   EOF
   ```

   请将 `你的用户名` 替换为你的实际用户名。

3. 加载 profile 并运行：

   ```bash
   sudo apparmor_parser -r /etc/apparmor.d/desirecore-appimage
   ~/Apps/DesireCore/DesireCore.AppImage
   ```

#### 临时验证：快速测试应用能否运行

如果你只想先确认应用本身是否正常，可以临时禁用沙箱运行（**仅用于测试，不建议日常使用**）：

```bash
./DesireCore_x86_64_版本号.AppImage --no-sandbox
```

或临时关闭系统级 AppArmor 限制：

```bash
# 仅当前启动周期有效，重启后恢复
echo 0 | sudo tee /proc/sys/kernel/apparmor_restrict_unprivileged_userns
```

:::warning
`--no-sandbox` 会关闭 Chromium 的进程沙箱隔离，降低安全性。请仅用于排查问题，不要作为日常启动方式。建议按照上述方案一或方案二进行正式配置。
:::

## 卸载

由于 AppImage 不需要安装，卸载只需要删除文件：

1. 删除 AppImage 文件
2. 删除桌面入口文件（如果创建了）：`rm ~/.local/share/applications/desirecore.desktop`
3. 删除应用数据（可选）：`rm -rf ~/.desirecore/`
4. 删除 AppArmor profile（如果创建了）：`sudo rm /etc/apparmor.d/desirecore-appimage`

安装完成后，前往 [首次启动](../03-first-run.md) 了解启动后的引导流程。
