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
- 使用一张或多张参考图生成新图
- 调整风格、构图、尺寸和细节
- 自动保存输出并在聊天中展示

## GenerateVideo

`GenerateVideo` 用于生成视频。常见能力包括：

- 文生视频
- 以图片作为首帧或参考素材生成视频
- 使用首尾帧约束镜头变化
- 输出后作为媒体文件附加到对话

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

