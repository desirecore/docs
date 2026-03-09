---
title: Windows 安装
description: 在 Windows 系统上下载、安装和卸载 DesireCore 的完整步骤。
keywords: [Windows, 安装, NSIS, SmartScreen]
---

# Windows 安装

本指南介绍如何在 Windows 上安装 DesireCore。

## 安装步骤

1. **下载安装包**

   前往 [官网](https://www.desirecore.cn)，点击下载按钮。网站会自动检测你的系统架构并提供对应的 `.exe` 安装文件。如需手动选择（x64 / ARM64），可点击"More download options"。

   <!-- 截图占位: 下载 Windows 安装包 (windows-download.png) -->

2. **运行安装程序**

   双击下载的 `.exe` 文件（如 `DesireCore_x64_版本号.exe`），启动安装向导。

3. **选择安装选项**

   - 你可以选择安装位置（默认为 `C:\Users\你的用户名\AppData\Local\Programs\DesireCore`）
   - 选择是否为当前用户或所有用户安装

   <!-- 截图占位: 安装选项 (windows-install-options.png) -->

4. **等待安装完成**

   安装过程通常只需要几秒钟。完成后点击"完成"按钮。

5. **启动 DesireCore**

   安装完成后，你可以通过以下方式启动：
   - 桌面快捷方式
   - 开始菜单中搜索"DesireCore"

## 处理 Windows SmartScreen 提示

首次运行时，Windows Defender SmartScreen 可能会弹出"Windows 已保护你的电脑"的提示。这是因为 DesireCore 是新发布的应用，Windows 还没有积累足够的信誉评分。

:::info 这不是病毒
这个提示只是说明 Windows 还不熟悉这个应用，并不意味着它是恶意软件。DesireCore 的安装包已经过数字签名。
:::

处理方法：

1. 点击"更多信息"
2. 点击"仍要运行"

<!-- 截图占位: SmartScreen 处理 (windows-smartscreen.png) -->

## 卸载

如果你需要卸载 DesireCore：

1. 打开 **设置** > **应用** > **已安装的应用**
2. 搜索"DesireCore"
3. 点击右侧的 **...** 按钮，选择"卸载"
4. 按照提示完成卸载

:::warning 数据清理
卸载时会提示是否同时删除应用数据。如果你计划重新安装，建议保留数据；如果确定不再使用，可以选择一并删除。
:::

安装完成后，前往 [首次启动](../03-first-run.md) 了解启动后的引导流程。
