---
title: GUI 桌面自动化
description: 了解 DesireCore 如何在 macOS 上通过 HostAgent、在 Windows 上暂时通过内置 CUA Driver 操作本机图形界面。
keywords: [Computer Use, CUA Driver, GUI, Windows, macOS, 桌面自动化, HostAgent]
---

# GUI 桌面自动化

## 当前可用范围

DesireCore 当前可以在 **macOS 和 Windows 本机**操作原生应用的图形界面，例如读取窗口与可访问性元素、点击控件、输入文字、发送按键以及获取界面状态。两个平台使用的执行载体不同：

- **macOS**：HostAgent 是现行 GUI 操作载体，通过 macOS 原生系统能力执行操作。
- **Windows**：在 Windows HostAgent 完成前，DesireCore 暂时使用内置 CUA Driver，让 Windows 用户可以先使用本机 GUI 自动化。

Windows 安装包已内置并默认启用 [CUA Driver](https://github.com/trycua/cua)。正常情况下，Windows 用户不需要另行下载安装驱动或 HostAgent，直接向智能体描述任务即可。

:::info 为什么 Windows 本机不需要 HostAgent？
HostAgent 并未被 CUA Driver 取代：macOS 当前仍通过 HostAgent 承载 GUI 操作。只是 Windows 版 HostAgent 尚在开发，DesireCore 才暂时通过 CUA Driver MCP 子进程提供本机能力。待 Windows HostAgent 完成后，平台载体和能力边界可能继续调整。
:::

| 场景 | 当前状态 | 所需组件 |
|------|---------|---------|
| macOS 本机 GUI 自动化 | 已支持 | macOS HostAgent；需授予相应系统权限 |
| Windows 本机 GUI 自动化 | 已支持（过渡实现） | DesireCore 内置 CUA Driver，零安装 |
| Windows、Linux HostAgent | 开发中 | 后续原生 HostAgent 实现 |
| 其他桌面系统与 Android、iOS、HarmonyOS HostAgent | 开发中 | 后续平台实现 |

## 工作原理

两个已支持平台的任务入口相同，但执行路径不同。

### macOS：HostAgent 路径

1. 你在 DesireCore 中描述 GUI 操作任务。
2. 智能体规划步骤，并通过设备能力链路调用 macOS HostAgent。
3. HostAgent 使用 macOS 原生 Framework 和已授予的辅助功能、屏幕录制等权限执行操作。
4. HostAgent 返回界面或执行结果，智能体据此继续任务并核对状态。

### Windows：CUA Driver 过渡路径

1. 你在 DesireCore 中描述任务，例如“打开记事本并输入会议摘要”。
2. 智能体规划步骤，并从系统 MCP 中选择 CUA Driver 提供的工具。
3. DesireCore 在本机启动独立的 `cua-driver` 子进程，通过标准输入输出与其通信。
4. CUA Driver 调用 Windows UI Automation、窗口和输入相关能力，返回窗口、元素或截图结果。
5. 智能体根据结果继续操作并核对最终状态。

如果你的 `PATH` 中已有自行安装的 `cua-driver`，DesireCore 会优先使用它；否则回退到安装包内置版本。两者都不可用时，系统会跳过该能力，不会反复弹出连接错误。

## 可以完成的操作

| 操作类型 | 示例 |
|---------|------|
| 窗口与应用 | 列出窗口、启动应用、切换或聚焦窗口 |
| 界面读取 | 获取窗口截图、可访问性元素树、控件名称和值 |
| 鼠标操作 | 点击、双击、右键、拖拽、滚动 |
| 键盘输入 | 输入文字、发送单键或组合键 |
| 控件操作 | 在应用支持相应平台可访问性模式时读取或设置控件值 |

你可以这样发起任务：

> “列出当前桌面上打开的主要窗口。”

> “打开系统文本编辑器，输入这段内容，然后重新读取窗口确认结果。保存前先问我。”

## 检查是否可用

### macOS

- 确认 macOS HostAgent 正在运行并已连接到 DesireCore。
- 在 **系统设置 → 隐私与安全性** 中检查屏幕录制、辅助功能等任务所需权限；权限变化后可能需要重新启动 HostAgent 或 DesireCore。
- 如果 HostAgent 离线，先在 DesireCore 的设备或基础设施入口检查连接状态，再重新尝试任务。

### Windows

打开 **资源管理器** → **算力** → **运行环境**，刷新环境检测并查看 **CUA Driver**：

- 显示版本和路径：能力可用；路径可能指向用户自行安装的版本，也可能指向 DesireCore 的内置目录。
- 显示不可用：先更新到最新 Windows 版 DesireCore并重新启动，再刷新检测。

安装包已包含当前支持架构的驱动。只有在内置文件缺失、被安全软件隔离，或你明确需要自行测试上游新版本时，才需要参考 CUA 项目的官方安装说明。不要从不明来源下载可执行文件。

## 已知边界

GUI 自动化依赖目标平台提供的可访问性、窗口和输入能力，结果会因系统、应用、权限和当前界面状态而变化：

- 某些新版、旧版或自绘界面未暴露足够的平台可访问性能力，智能体可能需要改用“点击后键盘输入”，也可能无法可靠完成操作。
- 后台操作并非对所有应用都可靠；窗口置前、弹窗或新窗口可能打断你当前的操作。
- macOS 未授予辅助功能或屏幕录制权限时，HostAgent 无法完成相应读取或操作；Windows 管理员应用、UAC 安全桌面、锁屏界面和受保护内容也可能无法访问。不要仅为绕过限制而扩大系统权限。
- 屏幕缩放、应用升级、界面加载延迟和遮挡都可能让元素定位失效。重要操作应在执行后重新读取界面确认。
- 支付、发布、删除、发送消息和修改系统设置等操作会产生真实外部影响；本地状态回撤通常无法撤销这些结果。

## 隐私与安全

窗口标题、可访问性文本、截图和你要求输入的内容可能包含个人信息、账号信息或商业数据。为完成任务，这些内容可能随对话上下文发送给你当前选择的模型或相关服务。使用前请确认目标窗口中没有不希望处理或传输的敏感内容，并遵守所属组织的安全制度。

建议遵循以下做法：

- 在发送、付款、删除、授权或公开发布前，要求智能体暂停并由你确认。
- 不要让智能体在截图可见时处理明文密码、恢复码、私钥或一次性验证码。
- 操作过程中保留对设备的控制；发现目标窗口或步骤不对时立即停止任务。
- 对业务关键流程先在测试账号或副本数据上验证。

:::warning 第三方组件
Windows 当前使用的 CUA Driver 是由其权利人提供、按其自身许可证分发的独立第三方程序，并非 DesireCore 自有组件或 HostAgent。它是 Windows HostAgent 完成前的过渡载体；其版本、兼容性和上游支持可能变化，具体以随软件提供的第三方声明及 [第三方软件与许可](../../05-more/09-third-party-software.md) 为准。
:::

## 下一步

- 查看 [详细系统要求](../../05-more/08-system-requirements-detail.md)
- 了解 [工具系统](./01-tool-system.md)
- 了解 [MCP 集成](./03-mcp-integration.md)
- 阅读 [数据安全](../11-security/04-data-security.md)
