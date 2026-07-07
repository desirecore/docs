---
title: Media Generation
description: Generate, edit, and improve images or videos with GenerateImage, GenerateVideo, and BeautifyImage.
keywords: [image generation, video generation, GenerateImage, GenerateVideo, BeautifyImage]
---

# Media Generation

DesireCore can use configured media providers to generate images, generate videos, and improve existing images.

## Requirements

Enable providers for the relevant service type in Settings > Compute Service:

| Service type | Use |
|--------------|-----|
| `image_gen` | Text-to-image, image-to-image, multi-image fusion |
| `video_gen` | Text-to-video, image-to-video, first/last-frame video |
| `image_understanding` / `ocr` | Reviewing generated images and understanding input images |

## Tools

- `GenerateImage`: creates or edits images from prompts and references
- `GenerateVideo`: creates videos from text, images, or frame constraints
- `BeautifyImage`: centers, crops, removes borders, enhances quality, and guards output size

Media generation can consume API quota or account credits, so provider, cost, and file-write approvals may apply.

