---
title: Media Generation
description: Generate, edit, and improve images or videos with GenerateImage, GenerateVideo, and BeautifyImage.
keywords: [image generation, video generation, GenerateImage, GenerateVideo, BeautifyImage, text-to-image, text-to-video, AI art]
---

# Media Generation

DesireCore can use configured media providers to generate images, generate videos, and improve existing images. Media generation is typically invoked by skills or agents within appropriate tasks.

## Prerequisites

Enable a provider for the relevant service type in **Settings > Compute Service**:

| Service type | Use |
|--------------|-----|
| `image_gen` | Text-to-image, image-to-image, multi-image fusion |
| `video_gen` | Text-to-video, image-to-video, first/last-frame video |
| `image_understanding` / `ocr` | Post-generation review and image understanding |

Official cloud compute, third-party API keys, and custom OpenAI-compatible providers can all serve as backends depending on the supplier's capabilities.

## GenerateImage

`GenerateImage` creates or edits images. Common capabilities include:

- Generate images from text prompts
- Use one or more reference images for image-to-image or multi-image fusion
- Adjust style, composition, size, and detail
- Auto-save output and display it in the chat

### Image Generation Provider Comparison

| Provider | Model | Specialty |
|----------|-------|-----------|
| MiniMax | image-01 / image-01-live | Strong single-subject consistency; style transfer (manga, genki, medieval, watercolor) |
| Volcengine | Seedream 4.0 | True image-to-image / inpainting / multi-image fusion (up to 10 reference images) |
| DesireCore Cloud | wan2.7-image etc. | Official cloud compute gateway, OpenAI Images API compatible |
| newapi | Routed by model name | new-api gateway relay, multi-vendor support |

### Usage Examples

Describe the image you want directly in conversation:

> "Generate a cyberpunk city nightscape with neon lights reflecting on rain-soaked streets."

To generate based on a reference image:

> "Using this product photo as reference, generate a white-background e-commerce hero image." (attach the image)

## GenerateVideo

`GenerateVideo` creates videos. Common capabilities include:

- **Text-to-video**: generate video from a text description
- **Image-to-video**: use an image as the first frame
- **First/last-frame constraints**: specify both frames to control camera movement
- **Multi-image subject reference**: maintain character/object consistency
- **Reference video/audio**: use existing media to control camera style

### Video Generation Provider Comparison

| Provider | Model | Supported inputs |
|----------|-------|-----------------|
| MiniMax | Hailuo-02 | First frame / first-last frame / S2V multi-image subject |
| Volcengine | Seedance | Multi-image + first-last frame + reference video/audio |
| DashScope | HappyHorse | i2v first frame / r2v multi-image |
| DesireCore Cloud | happyhorse-1.1 / doubao-seedance-2.0 | Official cloud compute, model-based selection |

:::tip Asynchronous Generation
Video generation typically takes several minutes. After submission, processing runs in the background; the result is displayed in the conversation automatically once complete—you do not need to wait.
:::

## BeautifyImage

`BeautifyImage` optimizes existing images, for example:

- Centering and cropping
- Removing excess borders
- Quality enhancement or size adjustment
- Output-size protection to prevent abnormally large files

## Approvals and Costs

Media generation may consume API quota or account credits. When a paid provider is used, reference material is uploaded, or local files are written, the system requests confirmation based on risk and permission policies.

## Best Practices

- Use a vision model when you need to "understand" an image; image generation models are for creating images
- Choose a chat model for conversation; image/video generation models do not appear in the regular model selector
- For production assets, have the agent review the output with a visual understanding tool to check text, composition, and obvious errors
