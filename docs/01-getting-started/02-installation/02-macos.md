---
title: macOS 安装
description: 在 macOS 上下载、安装和卸载 DesireCore，包含 Gatekeeper 处理和芯片说明。
keywords: [macOS, 安装, DMG, Gatekeeper, Apple Silicon, Intel]
---

# macOS 安装

本指南介绍如何在 macOS 上安装 DesireCore。

## Apple Silicon vs Intel

DesireCore 为两种架构分别提供了原生版本：

| 芯片类型 | 对应版本 | 如何判断 |
|---------|---------|---------|
| Apple Silicon (M1/M2/M3/M4) | `DesireCore_arm64_版本号.dmg` | 2020 年末及之后的 Mac |
| Intel | `DesireCore_x64_版本号.dmg` | 2020 年之前的 Mac |

:::tip 不确定是哪种芯片？
点击屏幕左上角  > **关于本机**，查看"芯片"或"处理器"一栏。显示"Apple M1/M2/M3/M4"则选 arm64 版本，显示"Intel"则选 x64 版本。
:::

## 安装步骤

1. **下载 DMG 文件**

   前往 [下载页面](https://www.desirecore.com/download)，选择适合你芯片的 macOS 版本。

2. **打开 DMG 文件**

   双击下载的 `.dmg` 文件，会弹出一个安装窗口。

3. **拖入 Applications 文件夹**

   将 DesireCore 图标拖拽到 Applications（应用程序）文件夹中。

   <!-- 截图占位: 拖拽安装 (macos-drag-install.png) -->

4. **启动 DesireCore**

   打开"应用程序"文件夹，双击 DesireCore 启动。

## 处理 Gatekeeper 提示

首次打开时，macOS 可能会提示"无法打开 DesireCore，因为无法验证开发者"。这是因为 macOS 的安全机制 Gatekeeper 对新下载的应用会进行检查。

:::info DesireCore 已经过 Apple 公证
DesireCore 的安装包已经过 Apple 公证（Notarization），是安全的。首次打开时系统需要额外验证。
:::

处理方法：

**方法一**（推荐）：右键点击打开
1. 在应用程序文件夹中找到 DesireCore
2. 按住 **Control** 键点击（或右键点击）DesireCore
3. 选择"打开"
4. 在弹出的对话框中再次点击"打开"

**方法二**：通过系统设置
1. 打开 **系统设置** > **隐私与安全性**
2. 向下滚动，找到关于 DesireCore 被阻止的提示
3. 点击"仍要打开"

## 卸载

如果你需要卸载 DesireCore：

1. 打开 **Finder** > **应用程序**
2. 将 DesireCore 拖入废纸篓
3. 清空废纸篓

如果你还想清除应用数据，可以删除以下目录：

```
~/Library/Application Support/DesireCore/
~/.desirecore/
```

安装完成后，前往 [首次启动](../03-first-run.md) 了解启动后的引导流程。
