---
title: Performance Issues
description: Resolve memory usage, response speed, and performance optimization issues in DesireCore
keywords: [performance, memory usage, response speed, optimization, GPU, lag, disk, fan]
---

# Performance Issues

## Is the app using too much memory?

The DesireCore desktop client is built on Electron and uses a baseline amount of memory (typically 200–400 MB). If memory usage is abnormally high:

1. **Check your version** --- Ensure you're running the latest version; the development team continuously optimizes performance
2. **Check Agent count** --- Running more than 300 Agents simultaneously significantly increases memory overhead
3. **Close unused conversations** --- Each active conversation occupies rendering memory; close tabs you don't need
4. **Restart the app** --- Memory may gradually grow over long sessions; periodic restarts release accumulated memory

## Is AI response speed slow?

Response speed depends primarily on the AI model API's performance, not the DesireCore client itself. Optimization suggestions:

1. **Switch API endpoint** --- Switch to a faster AI model provider
2. **Check network quality** --- Use a stable network connection to reduce packet loss and latency
3. **Check model load** --- Provider APIs may queue during peak hours; retry later

## Is disk usage too large?

DesireCore's data directory (`~/.desirecore/`) grows over time. Main sources of disk usage:

| Source | Typical Size | Cleanup Method |
|--------|-------------|----------------|
| App cache | Hundreds of MB | Delete system app cache directory (see paths below) |
| Market repo cache | 50–200 MB | Safe to delete; rebuilds automatically on next launch |
| Session records | Varies by usage | Clean history sessions in settings |
| Agent data | Varies by count | Delete unneeded Agents |

Cache directory paths:
- macOS: `~/Library/Application Support/desirecore/Cache`
- Windows: `%APPDATA%/desirecore/Cache`
- Linux: `~/.config/desirecore/Cache`

:::tip
Close DesireCore before deleting cache. Cache is automatically rebuilt on next launch without affecting your data.
:::

## Is GPU usage high or fans spinning loudly?

DesireCore uses GPU acceleration for UI rendering (glass materials, animations, etc.). If GPU usage is abnormal:

1. **Check GPU drivers** --- Outdated drivers may cause inefficient GPU usage; update to the latest version
2. **Close other GPU-intensive apps** --- Games, video editors compete for GPU resources
3. **Reduce motion effects** --- Enable "Reduce Motion" in system settings to decrease GPU load
4. **Disable hardware acceleration** --- Launch DesireCore with `--disable-gpu` flag to completely disable GPU acceleration (UI smoothness will decrease)

## Does the app slow down after running for a long time?

Electron applications may experience performance degradation after extended runtime. Recommendations:

1. **Restart periodically** --- Restart the app weekly or when noticeably slow
2. **Clean conversation history** --- Excessive history messages increase rendering load
3. **Check background tasks** --- Many concurrent scheduled tasks or heartbeats consume Agent Service resources

## What's the impact of many Agents online simultaneously?

Each online Agent occupies Agent Service memory and scheduling resources:

- **1–50 Agents**: Normal usage, no noticeable impact
- **50–200 Agents**: Increased memory usage; consider disabling rarely-used Agents
- **200+ Agents**: May affect response speed; consider trimming the Agent list

:::tip
Deleting unneeded Agents frees resources. Agent memory and configuration are permanently removed, so confirm before deleting.
:::

## How do I check resource usage?

- **macOS**: Open Activity Monitor, search for `DesireCore` to view CPU, memory, and GPU usage
- **Windows**: Open Task Manager (Ctrl+Shift+Esc), find DesireCore in the Processes tab
- **Linux**: Use `htop` or system monitor, search for `desirecore` processes

DesireCore consists of multiple sub-processes (main process, renderer process, Agent Service); total resource usage is the sum of all sub-processes.
