---
title: 内置工具参考
description: DesireCore 内置工具的参考说明，包含功能、风险等级和使用场景。
keywords: [工具, Tool, 内置工具, Builtin Tools, 参考]
---

# 内置工具参考

DesireCore 的内置工具会随客户端版本更新。本文按能力域列出常用工具和用户需要理解的边界；实际可用工具会根据智能体、已启用技能、权限策略和当前平台动态变化。

## 文件与搜索

| 工具 | 功能 | 风险 | 确认 |
|------|------|------|------|
| `Read` | 读取文本、图片、PDF 和大文件片段 | 低 | 否 |
| `Write` | 创建或覆盖文件 | 中 | 默认需要 |
| `Edit` | 精确替换文件中的文本片段 | 中 | 默认需要 |
| `NotebookEdit` | 编辑 Jupyter Notebook 单元格 | 中 | 默认需要 |
| `Ls` | 列出目录内容 | 低 | 否 |
| `Glob` | 按文件名模式搜索 | 低 | 否 |
| `Grep` | 按文本或正则搜索文件内容 | 低 | 否 |
| `ToolSearch` | 搜索延迟加载的工具、连接器和外部能力 | 低 | 否 |

`Read` 会按文件类型选择策略：文本走分页读取，图片走视觉输入，PDF 会在文本提取、按页渲染、目录定位和大文件分段读取之间切换。

## 系统与工作目录

| 工具 | 功能 | 风险 | 确认 |
|------|------|------|------|
| `Bash` | 执行 Shell 命令 | 高 | 是 |
| `PowerShell` | 在 Windows 上执行 PowerShell 命令 | 高 | 是 |
| `Which` | 检查命令是否可用 | 低 | 否 |
| `ManageWorkDirs` | 添加、移除或设置工作目录 | 中 | 默认需要 |
| `GenerateUUID` | 生成 UUID | 低 | 否 |
| `JsonRepair` | 修复常见 JSON 格式问题 | 低 | 否 |

在默认的审批模式下，命令执行需要你查看完整命令后确认（「外部工具审批」「全部放行」等模式会按其规则放行命令，见安全设置中的审批模式说明）。工作目录为智能体提供默认的操作上下文；若在智能体配置中开启「仅允许访问工作目录」，文件读写会被严格限制在工作目录白名单内（默认不开启时智能体可访问常规本机文件，敏感路径始终受保护）。

## 网络与浏览器

| 工具 | 功能 | 风险 | 确认 |
|------|------|------|------|
| `WebFetch` | 获取网页并转换为 Markdown | 低 | 否 |
| `WebSearch` | 搜索互联网 | 低 | 否 |
| `HttpRequest` | 发起 HTTP 请求，主要用于 Windows 环境 | 中 | 视请求而定 |
| `Browser*` | 控制浏览器标签页、点击、滚动、截图 | 低 - 中 | 视操作而定 |
| `SitePattern*` | 读取或写入站点经验 | 低 - 中 | 写入时可能需要 |
| `LocalBookmarks` | 查询本机浏览器书签和历史线索 | 低 | 否 |

`Browser*`、`SitePattern*` 和 `LocalBookmarks` 属于 Web Access v2 的 Skill-scoped 工具，只有对应技能启用后才会暴露。详见 [Web Access](../user-guide/capabilities/web-access)。

## 协作与任务

| 工具 | 功能 | 风险 | 确认 |
|------|------|------|------|
| `Delegate` | 委派任务给其他智能体、团队或预设流程 | 中 | 视任务而定 |
| `SpawnAgent` | 创建临时子智能体 | 中 | 默认需要 |
| `Handoff` | 把任务移交给另一个智能体 | 中 | 默认需要 |
| `RequestHelp` | 向持久智能体请求协助 | 中 | 默认需要 |
| `SendMessage` / `SendUserMessage` | 智能体间沟通或主动向用户发送消息 | 低 | 否 |
| `AskUserQuestion` | 向用户发起结构化问答 | 低 | 否 |
| `ManageTeam` | 创建或调整智能体团队 | 中 | 视操作而定 |
| `TaskCreate` / `TaskUpdate` | 维护悬浮任务板 | 低 | 否 |
| `TaskList` / `TaskGet` | 查询任务板状态 | 低 | 否 |

任务工具用于让长任务透明可见，不会自行执行外部副作用。真正有影响的文件、命令、网络或服务调用仍受对应工具权限控制。

## 上下文、记忆与技能

| 工具 | 功能 | 风险 | 确认 |
|------|------|------|------|
| `RecallConversation` | 检索历史对话 | 低 | 否 |
| `ManageContext` | 钉住/丢弃对话内容、清空历史、调整上下文容量 | 中 | 视操作而定 |
| `CompactSession` | 压缩长会话上下文 | 低 | 否 |
| `Skill` | 加载或调用技能 | 视技能而定 | 视技能而定 |

`ManageContext` 让智能体主动整理自己的对话上下文：钉住需要长期保留的关键内容、丢弃不再需要的工具调用结果、必要时清空历史为仅保留系统层与已钉住内容、临时调整当前会话允许使用的上下文容量；这些操作不会物理删除原始记录，历史中始终可以完整回看（清空历史、丢弃工具结果等有信息损失的操作需要你确认，其余操作无需确认）。`CompactSession` 会保留可见历史，只改变后续模型读取旧消息的方式。技能可以携带自己的工具声明和风险策略。

## 自动化

| 工具 | 功能 | 风险 | 确认 |
|------|------|------|------|
| `CreateSchedule` | 创建延迟、指定时间、间隔或 cron 调度 | 中 | 是 |
| `HeartbeatRespond` | 提交心跳巡检结果、通知和文件链接 | 低 | 否 |
| `WorkflowCreate` | 创建工作流定义 | 中 | 默认需要 |
| `WorkflowValidate` / `WorkflowTest` | 校验或测试工作流定义 | 低 | 否 |
| `WorkflowRun` | 运行已定义工作流 | 中 | 默认需要 |
| `WorkflowView` | 打开工作流画布查看结构 | 低 | 否 |

监控类需求优先使用心跳；定时执行类需求使用调度。调度触发后会在新会话里执行，不继承你当前输入框里的临时上下文。

## 文档、PDF 与媒体

| 工具 | 功能 | 风险 | 确认 |
|------|------|------|------|
| `ExportDocument` | 导出 PDF、DOCX 等文档 | 低 - 中 | 视目标路径而定 |
| `GenerateImage` | 生成或编辑图片 | 中 | 视费用和 provider 而定 |
| `GenerateVideo` | 生成视频 | 中 | 视费用和 provider 而定 |
| `BeautifyImage` | 美化、裁切或优化图片 | 中 | 视费用和 provider 而定 |
| `UnderstandImage` | 调用视觉理解 provider | 低 - 中 | 视 provider 而定 |
| `MathCalc` | 高精度确定性计算 | 低 | 否 |

媒体生成工具需要对应的 `image_gen`、`video_gen` 或图像处理 provider。详见 [媒体生成](../user-guide/capabilities/media-generation)。

## MCP 资源

| 工具 | 功能 | 风险 | 确认 |
|------|------|------|------|
| `McpListResources` / `McpReadResource` | 列出和读取 MCP 资源 | 低 | 否 |
| `McpListPrompts` / `McpGetPrompt` | 列出和展开 MCP Prompt | 低 | 否 |

MCP 工具来自你连接的外部服务。它们的权限、风险和审批策略由服务声明与 DesireCore 的本地权限层共同决定。
