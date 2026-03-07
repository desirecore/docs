---
title: Linux 安装
description: 在 Linux 上使用 AppImage 安装和运行 DesireCore。
keywords: [Linux, 安装, AppImage, Ubuntu, Fedora]
---

# Linux 安装

本指南介绍如何在 Linux 上安装 DesireCore。DesireCore 以 AppImage 格式分发，支持大多数主流 Linux 发行版。

## 安装步骤

1. **下载 AppImage**

   前往 [下载页面](https://www.desirecore.com/download)，下载 Linux 版本的 `.AppImage` 文件。

2. **添加执行权限**

   打开终端，进入下载目录，为 AppImage 文件添加执行权限：

   ```bash
   chmod +x DesireCore_x64_版本号.AppImage
   ```

3. **运行 DesireCore**

   双击 AppImage 文件，或在终端中运行：

   ```bash
   ./DesireCore_x64_版本号.AppImage
   ```

:::tip 什么是 AppImage？
AppImage 是一种便携式应用格式——不需要安装，下载后直接运行。你可以把它放在任何你喜欢的目录里。
:::

## 创建桌面快捷方式

如果你希望从应用菜单中启动 DesireCore，可以手动创建一个桌面入口文件：

1. 将 AppImage 文件移动到一个固定位置，例如：

   ```bash
   mkdir -p ~/Applications
   mv DesireCore_x64_版本号.AppImage ~/Applications/DesireCore.AppImage
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

## 卸载

由于 AppImage 不需要安装，卸载只需要删除文件：

1. 删除 AppImage 文件
2. 删除桌面入口文件（如果创建了）：`rm ~/.local/share/applications/desirecore.desktop`
3. 删除应用数据（可选）：`rm -rf ~/.desirecore/`

安装完成后，前往 [首次启动](../03-first-run.md) 了解启动后的引导流程。
