---
title: 配置 API Key
description: 详细指引如何获取和配置各 AI 供应商的 API Key，让 DesireCore 连接 AI 服务。
keywords: [API Key, 配置, OpenAI, Claude, DeepSeek, Gemini, 硅基流动, 供应商]
---

# 配置 API Key

DesireCore 是一个本地优先的应用——你的核心数据存储在本地。AI 能力可以通过两种方式接入：登录后使用官方云端算力，或配置你自己的 API Key。配置 API Key 仍然是高级用户和企业用户最常用的方式，但它已经不是唯一入口。

:::info 本页目录
- [快速开始：云端算力或自备 Key](#快速开始云端算力或自备-key)
- [什么是 API Key？](#什么是-api-key)
- [在 DesireCore 中配置](#在-desirecore-中配置)
- [各供应商 API Key 获取指南](#各供应商-api-key-获取指南)
- [更多供应商](#更多供应商)
- [验证连接](#验证连接)
- [常见问题](#常见问题)
:::

## 快速开始：云端算力或自备 Key

| 方式 | 适合谁 | 说明 |
|------|--------|------|
| 官方云端算力 | 不想先注册各家供应商的新用户 | 登录后自动绑定 `desirecore-cloud`，按订阅或 credit 使用 |
| 自备 API Key | 已有供应商账号、需要自控成本或企业合规 | API Key 存储在本机受权限保护的 `secrets.json` 中，供应商配置只保存引用 |

### 使用官方云端算力（推荐新手）

如果你不想先注册各家供应商的账号，可以使用 DesireCore 官方云端算力：

1. **登录 DesireCore 账号**
   - 点击左下角的 **头像** 图标
   - 选择 **登录** 或 **注册**
   - 使用邮箱或第三方账号登录

2. **自动绑定云端算力**
   - 登录成功后，资源面板会自动出现 **官方云端算力** 分组
   - 系统会同步你当前账号可用的模型
   - 显示余额、credit、临期额度和消耗信息

3. **开始使用**
   - 云端算力会自动配置为默认供应商
   - 你可以直接开始 [第一次对话](./05-first-conversation.md)，无需额外配置

:::tip 云端算力优势
- **无需注册**：不需要在多个供应商网站注册账号
- **统一计费**：通过 DesireCore 账号统一管理消耗
- **快速开始**：登录后即可使用，无需手动配置 API Key
- **灵活切换**：后续可以随时添加自备 API Key 作为补充
:::

### 使用自备 API Key

如果你已有供应商账号，或需要自控成本、企业合规，可以配置自己的 API Key：

1. **获取 API Key**：参考下方的 [各供应商 API Key 获取指南](#各供应商-api-key-获取指南)
2. **配置到 DesireCore**：参考 [在 DesireCore 中配置](#在-desirecore-中配置)
3. **验证连接**：参考 [验证连接](#验证连接)

:::note 混合使用
手动 API Key 和官方云端算力可以并存。你可以为某些任务指定自己的供应商，其他任务使用云端算力。
:::

## 本页导航

| 快速跳转 | 说明 |
|----------|------|
| [什么是 API Key？](#什么是-api-key) | 概念解释 |
| [在 DesireCore 中配置](#在-desirecore-中配置) | 配置步骤 |
| [OpenAI](#openaigpt-系列) · [Anthropic](#anthropicclaude-系列) · [DeepSeek](#deepseek) · [Google](#googlegemini-系列) · [硅基流动](#硅基流动siliconflow) | 热门供应商获取指南 |
| [更多供应商](#更多供应商) | 其他 16+ 供应商列表 |
| [验证连接](#验证连接) | 配置后验证 |
| [常见问题](#常见问题) | 排查指引 |

## 什么是 API Key？

API Key 就像是你访问 AI 服务的"钥匙"。每个 AI 供应商（如 OpenAI、Anthropic、DeepSeek 等）都提供 API 服务，你需要在它们的网站上注册并获取一个 API Key，然后在 DesireCore 中填入，DesireCore 就能调用对应的 AI 模型了。

:::info 费用说明
使用自备 API Key 调用 AI 服务会按用量计费，费用直接由对应供应商收取。使用官方云端算力时，会消耗你的订阅额度或 credit。不同模型的价格和消耗倍率差异很大。
:::

## 在 DesireCore 中配置

1. 点击左下角的 **设置** 图标（齿轮图标）
2. 选择 **算力服务** 选项卡
3. 在供应商列表中，点击你想配置的供应商
4. 填入你的 API Key
5. 点击 **验证** 确认 Key 是否有效

<!-- 截图占位: 配置 API Key (configure-api-key.png) -->

:::note 密钥安全
你的 API Key 仅保存在本机的 `~/.desirecore/secrets.json` 中（文件权限为 `600`，仅当前用户可读），不会上传到 DesireCore 服务器或任何第三方。
:::

## 各供应商 API Key 获取指南

DesireCore 支持超过 20 个 AI 供应商。下面是最常用的几个供应商的获取方法。

### OpenAI（GPT 系列）

<details>
<summary>点击展开 OpenAI API Key 获取指南</summary>

OpenAI 提供 GPT-5、GPT-4 等模型，是全球最知名的 AI 供应商之一。

| 项目 | 信息 |
|------|------|
| 官网 | [platform.openai.com](https://platform.openai.com) |
| 计费货币 | 美元 (USD) |
| 代表模型 | GPT-5、GPT-4.1、GPT-4o |
| 特色能力 | 对话、代码、推理、视觉、语音、图像生成 |

**获取步骤**：

1. 访问 [platform.openai.com](https://platform.openai.com)，注册或登录
2. 点击左侧导航中的 **API keys**
3. 点击 **Create new secret key**
4. 为 Key 取一个名字（如"DesireCore"），点击创建
5. 复制生成的 Key（以 `sk-` 开头），妥善保存

:::warning 保管好你的 Key
API Key 只会显示一次，请立即复制并保存。如果丢失了，你需要重新创建一个。
:::

</details>

### Anthropic（Claude 系列）

<details>
<summary>点击展开 Anthropic API Key 获取指南</summary>

Anthropic 提供 Claude 系列模型，以安全性和长文本处理能力著称。

| 项目 | 信息 |
|------|------|
| 官网 | [console.anthropic.com](https://console.anthropic.com) |
| 计费货币 | 美元 (USD) |
| 代表模型 | Claude Opus 4.6、Claude Sonnet 4.5 |
| 特色能力 | 对话、代码、推理、视觉、长文本 |

**获取步骤**：

1. 访问 [console.anthropic.com](https://console.anthropic.com)，注册或登录
2. 进入 **Settings** > **API keys**
3. 点击 **Create Key**
4. 复制生成的 Key（以 `sk-ant-` 开头）

</details>

### DeepSeek

<details>
<summary>点击展开 DeepSeek API Key 获取指南</summary>

DeepSeek 是国内领先的 AI 公司，提供高性价比的对话和推理模型，API 服务器在国内，延迟低。

| 项目 | 信息 |
|------|------|
| 官网 | [platform.deepseek.com](https://platform.deepseek.com) |
| 计费货币 | 人民币 (CNY) |
| 代表模型 | DeepSeek V3.2、DeepSeek R1 |
| 特色能力 | 对话、代码、推理、多语言 |

**获取步骤**：

1. 访问 [platform.deepseek.com](https://platform.deepseek.com)，注册或登录
2. 进入控制台，点击 **API Keys**
3. 创建新的 API Key 并复制

</details>

### Google（Gemini 系列）

<details>
<summary>点击展开 Google API Key 获取指南</summary>

Google 提供 Gemini 系列模型，拥有超长上下文窗口（最高 100 万 Token）。

| 项目 | 信息 |
|------|------|
| 官网 | [aistudio.google.com](https://aistudio.google.com) |
| 计费货币 | 美元 (USD) |
| 代表模型 | Gemini 2.5 Pro、Gemini 2.5 Flash |
| 特色能力 | 对话、代码、推理、视觉、超长上下文 |

**获取步骤**：

1. 访问 [aistudio.google.com](https://aistudio.google.com)
2. 点击 **Get API Key**
3. 选择或创建 Google Cloud 项目
4. 复制生成的 API Key

</details>

### 硅基流动（SiliconFlow）

<details>
<summary>点击展开硅基流动 API Key 获取指南</summary>

硅基流动是国内的 AI 推理服务平台，聚合了多种开源模型（如 Qwen），部分模型提供免费额度。

| 项目 | 信息 |
|------|------|
| 官网 | [siliconflow.cn](https://siliconflow.cn) |
| 计费货币 | 人民币 (CNY) |
| 代表模型 | Qwen3 Coder 480B、Qwen3 235B |
| 特色能力 | 代码、推理、多语言、免费 Embedding |

**获取步骤**：

1. 访问 [siliconflow.cn](https://siliconflow.cn)，注册或登录
2. 进入控制台，找到 **API 密钥** 页面
3. 创建新的密钥并复制

</details>

## 更多供应商

除了上面列出的供应商，DesireCore 还支持以下服务：

| 供应商 | 特点 | 计费货币 |
|--------|------|----------|
| 通义千问（DashScope） | 阿里云出品，国内模型 | CNY |
| 豆包（Volcengine） | 字节跳动出品 | CNY |
| Moonshot（月之暗面） | Kimi 背后的公司 | CNY |
| 智谱 AI（Zhipu） | GLM 模型系列 | CNY |
| 百川（Baichuan） | 国产大模型 | CNY |
| 零一万物（Lingyiwanwu） | Yi 模型系列 | CNY |
| MiniMax | 国产多模态模型 | CNY |
| 百度（文心一言） | 百度出品 | CNY |
| 腾讯（混元） | 腾讯出品 | CNY |
| 讯飞（星火） | 科大讯飞出品 | CNY |
| Mistral | 欧洲 AI 公司 | USD |
| xAI（Grok） | Elon Musk 创立 | USD |
| Cohere | 企业级 AI 服务 | USD |
| OpenRouter | AI 模型聚合平台 | USD |
| Perplexity | 搜索增强型 AI | USD |
| Ollama | 本地运行开源模型 | 免费 |

配置方法与上面类似：进入设置 > 算力服务，选择对应供应商，填入 API Key 即可。

## 验证连接

配置完 API Key 后，建议立即验证一下：

1. 在供应商详情页面，点击 **验证** 按钮
2. DesireCore 会向 AI 服务发送一个测试请求
3. 如果显示"已验证"，说明配置成功

<!-- 截图占位: 验证结果 (api-key-verify.png) -->

## 常见问题

### API Key 填入后提示无效

- 检查 Key 是否复制完整（开头和结尾没有多余的空格）
- 确认 Key 还在有效期内，且账户余额充足
- 确认网络能够访问对应的 API 端点

### 网络连接失败

- 确认你的网络能访问对应供应商的 API 地址
- 如果访问海外服务有困难，可以尝试国内供应商（DeepSeek、硅基流动等）
- 检查是否有防火墙或代理设置阻止了 HTTPS 请求

### 不知道选哪个供应商

:::tip 新手推荐
- **追求性价比 + 国内网络**：选 **DeepSeek**，价格低、延迟低、中文能力强
- **追求最强能力**：选 **Anthropic Claude** 或 **OpenAI GPT**，在复杂推理和代码任务上表现最佳
- **想免费试试**：选 **硅基流动**，部分模型提供免费额度
- **追求超长文本**：选 **Google Gemini**，支持 100 万 Token 上下文
:::

配置好 API Key 后，你就可以开始 [第一次对话](./05-first-conversation.md) 了！
