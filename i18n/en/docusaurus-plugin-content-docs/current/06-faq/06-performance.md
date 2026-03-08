---
title: Performance Issues
description: Resolve memory usage, response speed, and performance optimization issues when running DesireCore
keywords: [performance, memory usage, response speed, optimization, GPU, lag]
---

# Performance Issues

## Application using too much memory?

The DesireCore desktop client will occupy a certain amount of base memory. If memory usage is abnormally high:

1. **Check version** — Ensure you're using the latest version; the development team continuously optimizes performance
2. **Check number of Agents** — Running more than 300 Agents simultaneously will significantly increase memory overhead
3. **Restart application** — Memory may gradually grow after long periods of running; periodic restarts can release accumulated memory

## AI reply response speed is slow?

Response speed mainly depends on the AI model API's performance and has little to do with the DesireCore client itself. Optimization suggestions:

1. **Change API endpoint** — Switch to a faster AI model provider
2. **Check network quality** — Use a stable network connection to reduce packet loss and latency
