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

The DesireCore desktop package includes the baseline components needed for core workflows, so you normally do not need to prepare a development environment first. Existing system tools are still detected and used when appropriate.

| Dependency | Built-in | Notes |
|------|---------|------|
| Git | Yes | Portable Git is bundled; system Git can also be selected |
| Python | Yes | A recommended offline archive is bundled and silently imported into a Hatch-managed directory after first startup |
| Node.js | Yes | A recommended official archive is bundled and silently imported into a Volta-managed directory after first startup |
| macOS HostAgent | Used on macOS | Current carrier for macOS GUI operations; applicable system permissions are required |
| CUA Driver | Windows only | Transitional local GUI carrier until Windows HostAgent is complete; enabled by default |

The current bundled manifest identifies Git 2.53.0, Python 3.13.9, Node.js 24.18.0, and CUA Driver 0.7.1. Exact patch versions can change with a DesireCore release. Check **Explorer** → **Compute** → **Runtime Environment** and the notices supplied with your installer.

Python and Node.js imports run asynchronously after the service starts and do not block the main interface. If an offline import fails, DesireCore attempts an online installation. You can still select a version manually on the Runtime Environment page if both attempts fail. These runtimes are installed in DesireCore/Hatch/Volta-managed user directories; they do not replace the system-wide Python or Node.js installation.

## Runtime Environment Detection

Open **Explorer** -> **Compute** -> **Runtime Environment** to inspect local toolchain status. The page detects common runtimes and command-line tools so you can tell whether agents can run scripts, code tasks, or container-related work.

| Item | Description |
|------|-------------|
| Node.js / npm | Common for frontend, MCP, and script tools |
| Python | Common for data analysis, document processing, and automation scripts |
| Git | Used for agent repository versioning, publishing, and import |
| Docker / Podman | Used for containerized builds and isolated tasks |
| PowerShell | Windows command and script execution environment |
| Homebrew | Detected on macOS to identify a common software-installation environment |
| CUA Driver | Detected on Windows for local GUI automation |

Git detection shows the version, path, and actual source. In the default Auto mode, DesireCore validates both system and bundled Git and uses the newer version; if their versions match, it prefers system Git. You can explicitly choose System or Bundled on the Runtime Environment page. If that source is unavailable, DesireCore reports the fallback and uses the other source.

macOS currently uses HostAgent for local GUI operations and requires applicable permissions such as Accessibility and Screen Recording. On Windows, CUA Driver prefers a usable user-installed version on `PATH`, then falls back to the bundled version. It is a transitional implementation until Windows HostAgent is complete and controls only the current Windows computer. HostAgent implementations for Windows, Linux, other desktops, and mobile platforms remain under development. See [GUI Desktop Automation](../02-user-guide/09-capabilities/05-computer-use.md).

Docker, Podman, and task-specific runtime versions may still need to be installed separately.

## Third-Party Components

“Bundled” does not mean that DesireCore owns these programs. CUA Driver, Git, Python, and Node.js are independent third-party components owned by their respective rights holders and governed by their own licenses and accompanying third-party terms.

Git is GPLv2 software. Python and Node.js binary distributions also contain dependencies under licenses in addition to the main project license. DesireCore records release-specific sources and license materials, but terms can vary by platform, version, and archive. Refer to the complete text supplied with the installer, component archive, and corresponding release page. Ordinary use normally requires no extra action from you. If you extract, modify, or redistribute a component, you are responsible for reviewing attribution, license-text, corresponding-source, and other applicable obligations.

See [Third-Party Software and Licenses](./09-third-party-software.md) and the [Terms of Service](../terms.md).

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
