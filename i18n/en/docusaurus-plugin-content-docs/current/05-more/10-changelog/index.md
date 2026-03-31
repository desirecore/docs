---
title: "Changelog"
description: "DesireCore version changelog"
keywords: [changelog, version history, release notes]
---

# Changelog

This page records important changes in each version of DesireCore.

## Version Index

<!-- Summary guideline: List all new feature keywords separated by commas; for fix-only releases, describe the fix. Keep within 30-80 characters, never omit major features. -->

| Version | Date | Summary |
|---------|------|---------|
| [v10.0.21](./v10.0.21) | 2026-03-31 | 修复：Fixed an issue on Windows where abnormal resolution of the user directory ... |
| [v10.0.20](./v10.0.20) | 2026-03-30 | 修复：Fixed an issue where, when creating an agent from the plus menu, the popup... |
| [v10.0.19](./v10.0.19) | 2026-03-29 | 修复：Fixed an issue where, during streaming output of conversation content, com... |
| [v10.0.18](./v10.0.18) | 2026-03-29 | Update Notes Pop-up、Team Organizational Chart、Enhanced Team Management、Tool T... |
| [v10.0.17](./v10.0.17) | 2026-03-29 | First-time onboarding, quick agent creation, team collaboration, agent messaging, HttpRequest tool, update channels, Mermaid rendering, SuperDoc DOCX/PDF export |
| [v10.0.16](./v10.0.16) | 2026-03-24 | Cloud publishing (GitHub/Gitee/Gitea), Markdown WYSIWYG editor, delegation UX upgrade |
| [v10.0.15](./v10.0.15) | 2026-03-22 | Agent folder import, built-in MCP tools by default, SuperDoc resizable split panes |
| [v10.0.14](./v10.0.14) | 2026-03-19 | Message read-aloud, `/new` context isolation, add GLM-5-Turbo & MiniMax-M2.7 models |
| [v10.0.13](./v10.0.13) | 2026-03-19 | Remove sub-agent 10-round tool call limit; complex delegated tasks run to completion |
| [v10.0.12](./v10.0.12) | 2026-03-19 | AI image display & one-click save, macOS screenshot permission guide, Gateway Protocol v3.6, Linux deb package |
| [v10.0.11](./v10.0.11) | 2026-03-17 | Email rule automation, image file-based transfer, real-time streaming token display, single message deletion |
| [v10.0.10](./v10.0.10) | 2026-03-13 | Persistent message queue (survives restart), SuperDoc granular review, delegation-aware collaboration, standalone Canvas |
| [v10.0.9](./v10.0.9) | 2026-03-12 | Fix Windows NSIS build compilation failure |
| [v10.0.8](./v10.0.8) | 2026-03-12 | Bulk email optimization, fix file picker, Outlook sync, Ubuntu compatibility and NSIS build issues |
| [v10.0.7](./v10.0.7) | 2026-03-11 | commandDescriptors protocol, Windows version detection, scheduler enhancements (overlap protection/overflow fix) |
| [v10.0.6](./v10.0.6) | 2026-03-09 | Unified delegation tool (sync/async/handoff), OpenClaw import, multi-source heartbeat & monitoring panel, registry unification |
| [v10.0.5](./v10.0.5) | 2026-03-08 | Heartbeat enhancements (timezone/retry/suppression), SuperDoc Diff & immersive mode, end-to-end Temperature control |
| [v10.0.4](./v10.0.4) | 2026-03-08 | Fix Windows packaged build certificate directory permission startup failure |
| [v10.0.3](./v10.0.3) | 2026-03-07 | Local folder skill import, followUp file reference passing, fix image upload discard issue |
| [v10.0.2](./v10.0.2) | 2026-03-06 | Conversation draft auto-save, email virtual scrolling with skeleton loading, auto-sync labels after email auth |
| [v10.0.1](./v10.0.1) | 2026-03-06 | Add version check and update in Settings About page |
| [v10.0.0](./v10.0.0) | 2026-03-06 | Mail center (Gmail/Outlook/IMAP), HostAgent device pairing, approval system upgrade, task scheduling, MCP service management, GUI desktop automation |

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
