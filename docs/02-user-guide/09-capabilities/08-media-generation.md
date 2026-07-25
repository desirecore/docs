---
title: 媒体生成
description: 使用 GenerateImage、GenerateVideo 和 BeautifyImage 生成、编辑和优化图片视频。
keywords: [图像生成, 视频生成, GenerateImage, GenerateVideo, BeautifyImage, 文生图, 文生视频]
---

# 媒体生成

DesireCore 可以通过已配置的媒体 provider 生成图片、视频，并对已有图片做美化或修复。媒体生成通常由技能或智能体在合适的任务中调用。

## 前置条件

你需要在「设置 > 算力服务」中启用支持对应服务类型的 provider：

| 服务类型 | 用途 |
|----------|------|
| `image_gen` | 文生图、图生图、多图融合 |
| `video_gen` | 文生视频、图生视频、首尾帧视频 |
| `image_understanding` / `ocr` | 生成后复核、图片理解 |

官方云端算力、第三方 API Key 和自定义 OpenAI-compatible provider 都可以作为来源，具体取决于供应商能力。

## GenerateImage

`GenerateImage` 用于生成或编辑图片。常见能力包括：

- 根据文本提示词生成图片
- 使用一张或多张参考图生成新图（图生图 / 多图融合）
- 调整风格、构图、尺寸和细节
- 自动保存输出并在聊天中展示

### 图片生成 Provider 对比

| Provider | 模型 | 特色能力 |
|----------|------|----------|
| MiniMax | image-01 / image-01-live | 单主体一致性好；支持画风迁移（漫画、元气、中世纪、水彩） |
| Volcengine | Seedream 4.0 | 真正的图生图 / 局部重绘 / 多图融合（最多 10 张参考图） |
| DesireCore Cloud | wan2.7-image 等 | 官方云算力网关，OpenAI Images API 兼容 |
| newapi | 按 model 名路由 | new-api 网关中转，支持多厂商 |

### 使用示例

在对话中直接描述你想要的图片即可：

> "帮我生成一张赛博朋克风格的城市夜景，霓虹灯反射在雨后的街道上"

如果需要基于参考图生成：

> "参考这张产品照片，生成一张白底电商主图"（附带图片）

## GenerateVideo

`GenerateVideo` 用于生成视频。常见能力包括：

- 文生视频：纯文字描述生成视频
- 图生视频：以图片作为首帧生成视频
- 首尾帧约束：指定首帧和尾帧，控制镜头变化
- 多图主体参考：保持角色/物体一致性
- 参考视频/音频：以已有视频控制运镜风格

### 视频生成 Provider 对比

| Provider | 模型 | 支持素材 |
|----------|------|----------|
| MiniMax | Hailuo-02 | 首帧 / 首尾帧 / S2V 多图主体 |
| Volcengine | Seedance | 多图 + 首尾帧 + 参考视频/音频 |
| DashScope | 快乐马 (HappyHorse) | i2v 首帧 / r2v 多图 |
| DesireCore Cloud | happyhorse-1.1 / doubao-seedance-2.0 | 官方云算力，按模型选择 |

:::tip 异步生成
视频生成通常需要数分钟。提交后系统会在后台处理，完成后自动在对话中展示结果，你无需等待。
:::

## BeautifyImage

`BeautifyImage` 用于优化已有图片，例如：

- 图片居中和裁切
- 去除多余边框
- 质量增强或尺寸调整
- 输出体积保护，避免生成异常大文件

## 审批与费用

媒体生成可能消耗 API 额度或账号 credit。涉及付费 provider、上传参考素材或写入本地文件时，系统会按风险和权限策略请求确认。

## 使用建议

- 需要“看懂图片”时使用视觉模型，而不是图像生成模型
- 需要聊天回复时选择 chat 模型，图像/视频生成模型不会出现在普通对话模型选择器中
- 对正式素材，生成后让智能体用视觉理解工具复核一次，检查文字、构图和明显错误

