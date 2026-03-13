---
title: "Changelog"
description: "DesireCore version changelog"
keywords: [changelog, version history, release notes]
---

# Changelog

This page records important changes in each version of DesireCore.

## Version Index

| Version | Date | Summary |
|---------|------|---------|
| [v10.0.10](./v10.0.10) | 2026-03-13 | Persistent message queueing |
| [v10.0.9](./v10.0.9) | 2026-03-12 | 修复Windows编译构建nsis异常 |
| [v10.0.8](./v10.0.8) | 2026-03-12 | Bulk email optimization, fix file picker and Ubuntu compatibility issues |
| [v10.0.7](./v10.0.7) | 2026-03-11 | NSIS 安装包启动时检测 Windows 版本，低于 Win10 提示不支持 (#232) |
| [v10.0.6](./v10.0.6) | 2026-03-09 | Unified delegation tool, OpenClaw import, multi-source heartbeat and registry unification |
| [v10.0.5](./v10.0.5) | 2026-03-08 | Heartbeat system enhancements — timezone support, transient retry, suppression engine and scheduler integration |
| [v10.0.4](./v10.0.4) | 2026-03-08 | Fix Windows packaged build certificate directory permission issue |
| [v10.0.3](./v10.0.3) | 2026-03-07 | Skill import and file reference passing support |
| [v10.0.2](./v10.0.2) | 2026-03-06 | Conversation draft persistence and email virtual scrolling |
| [v10.0.1](./v10.0.1) | 2026-03-06 | Version check and update in About page |
| [v10.0.0](./v10.0.0) | 2026-03-06 | Mail center, HostAgent pairing, approval system and more |

---

## v10.1.0 (In Development)

The first public release of DesireCore, including the following core features:

### New Features

- **Delegated Interaction**: Interact with agents through six primitives (teach rules, give examples, assign tasks, confirm, feedback, forget)
- **Agent System**: Create, edit, and import custom agents
- **Three-Domain Memory**: Core memory, relationship memory, shared memory
- **Super Document**: Code Review-style document collaboration mode
- **Multi-Provider Support**: Connect to 20+ AI providers including OpenAI, Anthropic, DeepSeek
- **Cross-Platform**: Desktop apps for macOS, Windows, Linux
- **Local-First**: All data stored locally by default for privacy

### Known Limitations

- Some advanced scheduling features will be available in future releases

---

:::info Version Notes
DesireCore follows Semantic Versioning. Each version number follows the format `major.minor.patch`.
:::
