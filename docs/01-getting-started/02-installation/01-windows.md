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

## 随安装包提供的本地组件

Windows 版会随包提供可移植 Git、推荐的 Python/Node.js 运行时归档，以及用于本机 GUI 自动化的 CUA Driver。它们是独立第三方组件，不会要求你提前安装系统 Git、Python、Node.js 或 HostAgent。

- 首次启动后，DesireCore 会在后台把推荐的 Python 和 Node.js 导入其管理目录；这不会替换系统全局版本。
- Git 默认在系统版本与内置版本中自动选择可用且较新的来源，你也可以在运行环境页手动切换。
- CUA Driver 仅用于当前 Windows 电脑的 GUI 自动化，默认启用。它是 Windows HostAgent 完成前的权宜/过渡实现，让 Windows 用户先具备相关能力；macOS 当前仍由 HostAgent 承载 GUI 操作，Windows、Linux 和其他平台的 HostAgent 仍在开发。

这些归档和可执行程序会增加安装包与首次启动后的磁盘占用。安全软件也可能在首次解包或运行时再次扫描它们；请等待扫描完成，不要通过关闭系统防护来强行绕过告警。你可以在 **资源管理器** → **算力** → **运行环境** 查看实际版本与路径。许可和来源说明见 [第三方软件与许可](../../05-more/09-third-party-software.md)。

## 处理 Windows SmartScreen 提示

首次运行时，Windows Defender SmartScreen 可能会弹出"Windows 已保护你的电脑"的提示。这是因为 DesireCore 是新发布的应用，Windows 还没有积累足够的信誉评分。

:::info 先核对来源和签名
这个提示本身只表示 Windows 的信誉或来源校验需要你确认，并不能单独证明文件安全或不安全。请只从 DesireCore 官方下载页获取安装包，并在继续前核对发布者与数字签名；不要运行来源不明或签名异常的副本。
:::

处理方法：

1. 点击"更多信息"
2. 点击"仍要运行"

<!-- 截图占位: SmartScreen 处理 (windows-smartscreen.png) -->

## 更新和受保护目录

如果使用默认安装位置（`%LOCALAPPDATA%\Programs\DesireCore`），自动更新通常不需要管理员权限。

如果你把 DesireCore 安装到 `C:\Program Files\` 等受保护目录，更新安装器需要管理员权限。此时 Windows 会弹出 UAC 确认窗口；确认后安装器会以管理员身份继续更新。

更新前 DesireCore 会尝试关闭旧进程和相关子进程，避免旧文件被占用。如果更新失败，可以先完全退出 DesireCore，必要时重启电脑后重新运行安装包。

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
