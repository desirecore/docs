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

这是 Windows SmartScreen 的来源或信誉提示。先确认安装包来自 DesireCore 官方下载页，并在文件属性中核对发布者和数字签名；确认无误后，再按系统界面继续。若来源不明、签名缺失或发布者异常，不要选择「仍要运行」。

## 需要另外安装 Git、Python 或 Node.js 吗？

通常不需要。桌面安装包提供可移植 Git，以及推荐的 Python 和 Node.js 离线归档。首次启动后，DesireCore 会在后台将推荐运行时导入 Hatch/Volta 管理的用户目录，不会替换系统全局版本。

你仍可安装或使用系统版本：Git 默认比较系统和内置来源并选择可用且较新的版本；Python 和 Node.js 可在 **资源管理器** → **算力** → **运行环境** 中管理其他版本。任务明确要求 Docker、Podman、特殊运行时或系统级依赖时，仍需单独准备。

## Windows GUI 自动化还需要安装 HostAgent 吗？

不需要。Windows 安装包已内置并默认启用 CUA Driver，当前电脑上的 GUI 自动化可直接使用。CUA Driver 是 Windows HostAgent 完成前的权宜/过渡实现，让 Windows 用户先具备相关能力；它不代表 HostAgent 被弃用。macOS 当前仍由 HostAgent 承载 GUI 操作，Windows、Linux、其他桌面与移动端 HostAgent 仍在开发。

如果智能体找不到 GUI 工具，请打开 **资源管理器** → **算力** → **运行环境**，刷新并检查 CUA Driver：

- 更新 DesireCore 到最新 Windows 版本并重新启动。
- 检查安全软件是否隔离了安装目录中的 `cua-driver.exe`；先核对文件来源和签名/哈希记录，不要直接关闭系统防护。
- 如果你自行安装过 CUA Driver，检查 `PATH` 中版本是否能正常运行。DesireCore 会优先使用 `PATH` 版本，再回退内置版本。

详见 [GUI 桌面自动化](../02-user-guide/09-capabilities/05-computer-use.md)。

## 为什么安全软件会扫描多个命令行程序？

DesireCore 的智能体需要在本地执行版本管理、脚本和 Windows GUI 操作，因此安装包中包含独立的 Git、Python/Node.js 归档和 CUA Driver。首次安装、解包或执行时，安全软件可能分别扫描这些文件，这不等同于检测到恶意行为。

请始终使用官方安装包并保留系统防护。如果安全软件明确报告威胁，不要盲目加入白名单；先记录文件路径、DesireCore 版本、检测名称和文件哈希，通过官方渠道反馈。第三方组件来源与许可见 [第三方软件与许可](../05-more/09-third-party-software.md)。

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
2. Windows 下载完成后选择「退出应用并自动升级」，主应用会退出并打开独立升级进度窗；等待完成后从进度窗启动新版本
3. 其他平台按界面提示完成重启或安装；选择「稍后」会暂时停止重复提醒

Windows 升级进度窗仍在运行时，不要重复启动 DesireCore 或手动结束安装进程。失败时请保留进度窗的错误信息，再使用其中的入口打开安装目录排查。

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
3. 如果使用过 OAuth、CLI 或订阅工具管理的登录，按对应工具说明退出登录并清理其外部凭据（可选）
