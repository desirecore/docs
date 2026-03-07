---
title: 数据与隐私问题
description: 了解 DesireCore 的数据存储位置、安全措施和隐私保护
keywords: [数据安全, 隐私保护, 数据存储, 备份, 删除数据, API Key 安全]
---

# 数据与隐私问题

## 数据存储在哪里？

DesireCore 采用本地优先（Local-first）架构，所有数据存储在你的本地文件系统中：

| 数据类型 | 存储位置 | 说明 |
|---------|---------|------|
| Companion 数据 | `~/.desirecore/agents/` | 配置、技能、记忆等 |
| 技能文件 | `~/.desirecore/skills/` | 全局技能 |
| 用户配置 | `~/.desirecore/config/` | 用户资料、头像 |
| 市场缓存 | `~/.desirecore/market/` | 市场仓库本地副本 |
| 应用缓存 | 系统应用数据目录 | 临时缓存，可安全删除 |

## API Key 存储安全吗？

DesireCore 使用操作系统的凭据管理器（Credential Manager）来安全存储 API Key：

- **macOS**: Keychain
- **Windows**: Windows Credential Manager
- **Linux**: libsecret / GNOME Keyring

API Key 不会以明文形式存储在配置文件中，也不会传输到 DesireCore 的服务器。

## 对话内容会被发送到哪里？

对话内容仅发送至你配置的 AI 模型供应商 API。DesireCore 不会将你的对话内容转发到任何其他服务器。

具体的数据处理政策取决于你选择的模型供应商：

- **OpenAI**: 请参阅 OpenAI 的数据使用政策
- **Anthropic (Claude)**: 请参阅 Anthropic 的隐私政策
- **其他供应商**: 请参阅对应供应商的隐私条款

:::tip
如果你对数据隐私有严格要求，可以考虑使用本地部署的模型（如 Ollama），所有推理在本地完成，不发送任何数据到外部。
:::

## 如何备份数据？

备份 `~/.desirecore/` 整个目录即可保存所有数据。推荐的备份方式：

1. **手动复制** --- 将 `~/.desirecore/` 目录复制到安全位置
2. **定期备份** --- 使用系统的备份工具（如 Time Machine、Windows 备份）包含此目录
3. **版本控制** --- Companion 仓库本身使用 Git 进行版本管理，重要的 Companion 可以推送到远程仓库

:::warning
备份时请注意，`~/.desirecore/` 目录中可能包含临时文件和缓存。核心数据主要在 `agents/`、`skills/` 和 `config/` 子目录中。
:::

## 如何将数据迁移到另一台电脑？

1. 在旧电脑上备份 `~/.desirecore/` 目录
2. 在新电脑上安装 DesireCore
3. 将备份的目录复制到新电脑的 `~/.desirecore/` 位置
4. 重新配置 API Key（API Key 通过系统凭据管理器存储，无法直接迁移）
5. 启动 DesireCore，数据会自动加载

## 如何完全删除所有数据？

要彻底清除 DesireCore 的所有本地数据：

1. 关闭 DesireCore 应用
2. 删除 `~/.desirecore/` 目录
3. 清除系统凭据管理器中存储的 API Key：
   - macOS: 打开「钥匙串访问」，搜索 "desirecore" 并删除
   - Windows: 打开「凭据管理器」，搜索并删除相关条目
   - Linux: 使用 `secret-tool` 命令删除
4. 卸载应用程序
5. 清除应用缓存目录（可选）

## 第三方 API 的数据安全怎么保证？

DesireCore 在发送数据到第三方 API 时：

- 使用 HTTPS 加密传输
- 仅发送当前对话上下文必需的内容
- 不发送 Companion 的本地文件内容（除非你明确要求）
- 不发送你的个人配置信息

但请注意，一旦数据发送到第三方 API，其处理方式由该供应商的政策决定。建议：

- 不要在对话中包含敏感的个人信息（如密码、银行卡号）
- 了解你使用的供应商的数据保留政策
- 对于高敏感场景，使用本地部署的模型

## DesireCore 本身会收集哪些数据？

DesireCore 作为客户端应用，除了你主动发送到 AI 供应商 API 的内容外，不会收集或上传你的任何数据。应用的更新检查仅获取版本信息，不传输用户数据。
