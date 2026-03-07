---
title: 智能体问题
description: 解决 DesireCore 智能体安装、配置和使用中的常见问题
keywords: [智能体, Companion, 安装失败, 重置, 市场, 技能, 记忆]
---

# 智能体问题

## 从市场安装 Companion 失败？

市场安装失败的常见原因和解决方法：

1. **网络问题** --- 市场资源需要从远程仓库下载，检查网络连接
2. **磁盘空间不足** --- Companion 资源存储在 `~/.desirecore/agents/` 目录，确保磁盘有足够空间
3. **版本不兼容** --- 某些 Companion 可能要求更高版本的 DesireCore 客户端。检查错误提示中是否有 `clientUpgradeRequired` 信息，如有请先更新客户端
4. **目录权限** --- 确保 `~/.desirecore/` 目录有读写权限

## 如何重置 Companion 到初始状态？

如果 Companion 的行为异常，你可以重置它：

1. 在聊天头部点击「更多」菜单
2. 选择「删除智能体」，勾选"删除运行记录"
3. 从市场重新安装该 Companion

:::warning
重置会删除该 Companion 的所有对话记录、学习成果和自定义配置。操作前建议备份重要的对话内容。
:::

## Companion 不记得之前的对话？

Companion 的记忆分为两个层次：

| 记忆类型 | 持续性 | 说明 |
|---------|--------|------|
| 对话上下文 | 临时 | 受模型上下文窗口限制，较早的消息可能被截断 |
| 长期记忆 | 持久 | 写入 Memory Ledger 的内容，跨会话保留 |

如果 Companion 忘记了对话中的内容，可能是上下文窗口限制导致的。你可以：

- 将重要信息明确告诉 Companion 让它记住（触发教学/记忆写入）
- 选择支持更大上下文窗口的模型

## 如何给 Companion 添加技能？

有两种方式：

1. **从市场安装** --- 在市场中浏览和安装技能，安装后会自动关联到 Companion
2. **手动导入** --- 在运行状态面板中点击「导入技能」，选择技能文件

技能以 SKILL.md 文件形式存储在 `~/.desirecore/skills/` 目录下。

## 全局技能和专属技能有什么区别？

| 类型 | 存储位置 | 适用范围 | 管理方式 |
|------|---------|---------|---------|
| 全局技能 | `~/.desirecore/skills/` | 所有 Companion 都可使用 | 随客户端更新自动同步 |
| 专属技能 | Companion 仓库内 | 仅对应的 Companion 可使用 | 由 Companion 自行管理 |

## Companion 的在线/离线状态是什么意思？

| 状态 | 含义 |
|------|------|
| 在线（绿色） | Companion 已启动，可以接收消息和执行任务 |
| 工作中（橙色） | Companion 正在执行任务 |
| 离线（灰色） | Companion 未启动，需要手动开机 |

如果 Companion 处于离线状态，在对话头部会显示「启动」按钮。

## 如何查看 Companion 的档案信息？

在聊天头部点击「智能体档案」按钮（书本图标），可以查看 Companion 的：

- 基本信息（名称、角色、描述）
- 已安装的技能
- 记忆条目
- 运行状态

## 委派给专业 Companion 后如何查看进展？

当 DesireCore 通用助手将任务委派给专业 Companion 时，你会看到一个蓝色的委派卡片。要查看委派后的进展：

1. 在左侧对话列表中找到被委派的专业 Companion
2. 点击切换到该 Companion 的对话
3. 任务的后续进展和回执都会显示在那里

## 自定义 Companion 的头像和名称？

Companion 的头像和名称由其 `agent.json` 配置文件决定。你可以：

1. 打开 `~/.desirecore/agents/<companion-id>/` 目录
2. 编辑 `agent.json` 中的 `name` 和 `avatar` 字段
3. 重启应用生效

:::info
从市场安装的 Companion 更新后可能覆盖你的自定义。建议仅对本地创建的 Companion 做自定义修改。
:::
