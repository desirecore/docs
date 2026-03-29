---
title: 安装与启动问题
description: 解决 DesireCore 安装、启动和更新过程中常见的问题
keywords: [安装, 启动, 更新, 白屏, 安装失败, macOS, Windows, Linux]
---

# 安装与启动问题

## 安装包下载失败或速度很慢？

DesireCore 的安装包托管在多个下载源上（CDN、构建服务器、GitHub Releases 等）。客户端和官网在下载前会**自动测速**，选择最快的源进行下载。

如果仍然遇到下载问题，可以尝试：

- 检查网络连接是否正常
- 尝试使用 VPN 或切换网络环境
- 从官方下载页面获取最新下载链接（官网同样支持多源测速选优）

## macOS 上提示"无法打开，因为无法验证开发者"？

这是 macOS 的 Gatekeeper 安全机制导致的。解决方法：

1. 打开「系统设置 > 隐私与安全性」
2. 滚动到底部，找到关于 DesireCore 的提示
3. 点击「仍然打开」
4. 或者在终端中执行：`xattr -cr /Applications/DesireCore.app`

## Windows 上提示"Windows 已保护你的电脑"？

这是 Windows SmartScreen 筛选器的提示。点击「更多信息」，然后选择「仍要运行」即可。

## 启动后显示白屏？

白屏通常是渲染进程加载失败导致的。尝试以下步骤：

1. **完全关闭并重新启动** --- 确保进程已完全退出（检查系统托盘/任务管理器）
2. **清除缓存** --- 删除应用缓存目录：
   - macOS: `~/Library/Application Support/desirecore/Cache`
   - Windows: `%APPDATA%/desirecore/Cache`
   - Linux: `~/.config/desirecore/Cache`
3. **检查 GPU 加速** --- DesireCore 使用 GPU 加速渲染玻璃材质。如果你的显卡驱动过旧，尝试更新显卡驱动
4. **禁用硬件加速** --- 如果更新驱动后仍有问题，尝试以 `--disable-gpu` 参数启动

## 启动时卡在加载界面？

如果应用一直停留在加载界面，可能的原因和解决方法：

- **Agent 服务启动失败** --- 检查 `~/.desirecore/` 目录是否有写入权限
- **端口被占用** --- DesireCore 的 Agent 服务需要使用本地端口。检查是否有其他程序占用了相同端口
- **数据文件损坏** --- 尝试重命名 `~/.desirecore/` 目录为备份（如 `~/.desirecore.bak/`），然后重新启动应用

## 如何更新到最新版本？

DesireCore 支持自动更新，启动后每 5 分钟自动检查一次：

1. 检测到新版本后，系统会从最快的下载源自动下载更新包
2. 下载完成后弹出提示，选择「立即重启」即可安装
3. 选择「稍后」则 24 小时内不再弹窗提醒

你也可以在「设置 > 关于」页面手动检查更新。

**更新通道**：DesireCore 提供 **Stable（稳定版）** 和 **Beta（测试版）** 两个通道。默认使用 Stable 通道，你可以在「设置 > 关于 > 更新通道」中切换到 Beta 抢先体验新功能。详见[关于与更新](../02-user-guide/10-settings/08-about.md#更新通道)。

如果自动更新失败，可以从官方网站手动下载最新安装包覆盖安装。

:::tip
更新不会影响你的数据。所有 Companion 数据存储在 `~/.desirecore/` 目录中，独立于应用程序。
:::

## Linux 上 AppImage 无法启动？

确保你已经给 AppImage 文件添加了执行权限：

```bash
chmod +x DesireCore-*.AppImage
```

如果仍然无法启动，尝试添加 `--no-sandbox` 参数运行。

## 安装后找不到应用图标？

- **macOS**: 检查 `/Applications/` 目录
- **Windows**: 检查桌面快捷方式或开始菜单
- **Linux**: AppImage 不会自动创建桌面快捷方式，你可以手动创建 `.desktop` 文件，或使用 AppImageLauncher 工具

## 如何彻底卸载？

1. 删除应用程序本身（与其他应用相同的卸载方式）
2. 如果要同时删除所有数据，删除 `~/.desirecore/` 目录
3. 清理系统凭据管理器中存储的 API Key（可选）
