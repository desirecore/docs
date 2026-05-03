---
title: "Detailed System Requirements"
description: "Detailed hardware, software, and network requirements for DesireCore on all platforms"
keywords: [system requirements, hardware, software, network, compatibility]
---

# Detailed System Requirements

## Operating Systems

For supported OS versions and architectures on each platform, please refer to [System Requirements](../01-getting-started/01-system-requirements.md).

## Hardware Requirements

### Minimum Configuration

| Resource | Requirement | Notes |
|------|------|------|
| **CPU** | Dual-core | Supports SSE4.2 |
| **Memory** | 4 GB | Basic requirement to run the app |
| **Storage** | 500 MB | App itself + basic data |
| **Display** | 1280x720 | Minimum resolution |

### Recommended Configuration

| Resource | Requirement | Notes |
|------|------|------|
| **CPU** | Quad-core+ | Smoother multitasking |
| **Memory** | 8 GB+ | Multiple conversation windows + Super Documents |
| **Storage** | 2 GB+ | App + Agent data + cache |
| **Display** | 1920x1080+ | Best interface experience |

### Additional Requirements for Local Models (Ollama)

If you plan to use Ollama to run AI models locally, additional hardware resources are needed:

| Model Size | Memory Requirement | GPU VRAM | Notes |
|---------|---------|---------|------|
| 7B parameters | 8 GB | 6 GB+ | Lightweight model, entry-level |
| 13B parameters | 16 GB | 10 GB+ | Medium model, better results |
| 70B parameters | 64 GB | 40 GB+ | Large model, near commercial level |

## Software Dependencies

### Desktop Version

All dependencies for the DesireCore desktop version are built-in, and usually no additional installation is required.

| Dependency | Built-in | Notes |
|------|---------|------|
| Runtime Environment | Yes | Built-in |
| Git | No (recommended) | Used for Agent version management (optional) |

## Runtime Environment Detection

Open **Explorer** -> **Compute** -> **Runtime Environment** to inspect local toolchain status. The page detects common runtimes and command-line tools so you can tell whether agents can run scripts, code tasks, or container-related work.

| Item | Description |
|------|-------------|
| Node.js / npm | Common for frontend, MCP, and script tools |
| Python | Common for data analysis, document processing, and automation scripts |
| Git | Used for agent repository versioning, publishing, and import |
| Docker / Podman | Used for containerized builds and isolated tasks |
| PowerShell | Windows command and script execution environment |

Git detection shows installation state, version, path, and whether DesireCore is using native Git or a compatibility backend.

## Network Requirements

### Required Network Connections

DesireCore requires network access in the following scenarios:

| Scenario | Target Address | Notes |
|------|---------|------|
| AI Model Calls | Various provider API addresses | Depends on your configured provider |
| Update Check | `download.desirecore.net` | Check for client updates |
| Agent Marketplace | Marketplace GitHub repository address | Browse and install Agents/skills |

### Offline-Capable Features

The following features do not require network (when using Ollama local models):

- Browse and edit installed Agent configurations
- AgentFS file management
- Local model conversations (requires Ollama)
- View conversation history
- Data export

### Port Usage

| Port | Purpose | Notes |
|------|------|------|
| Any available port | Agent Service (Fastify + Socket.IO) | Internal app communication, auto-assigned |
| Any available port | Workflow Service | Workflow execution service, auto-assigned |
| Any available port | Mail Service | Mail service, auto-assigned |
| 11434 | Ollama local models | Only needed when using Ollama |
| 8080 | Local Whisper | Only needed when using local voice recognition |

## Storage Space Analysis

| Data Type | Estimated Size | Notes |
|---------|---------|------|
| App Installation | 500-900 MB | Varies by platform |
| Core Agents | 5-10 MB | DesireCore built-in Agents |
| Each Custom Agent | 1-50 MB | Depends on skills and memory |
| Conversation History | 10-100 MB/month | Depends on usage frequency |
| Cache | 50-200 MB | Can be safely cleared |
| Logs | 10-50 MB | Can be periodically cleared |
