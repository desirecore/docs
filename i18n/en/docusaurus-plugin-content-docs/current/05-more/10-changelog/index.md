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
| [v10.0.41](./v10.0.41) | 2026-04-28 | Alpha Internal Testing Channel，修复 4 项问题 |
| [v10.0.40](./v10.0.40) | 2026-04-28 | 修复：Fixed an issue in multi-turn conversations where follow-up questions could... |
| [v10.0.39](./v10.0.39) | 2026-04-27 | Enhanced Cloud Publishing and Importing、Agent Version Management、Media Genera... |
| [v10.0.38](./v10.0.38) | 2026-04-27 | Agent Cloud Publishing and Importing、Agent Version Management、Media Generatio... |
| [v10.0.37](./v10.0.37) | 2026-04-25 | Approval Notification System、Memory Write Cards、Audit Log Export，修复 7 项问题，改进 2 项 |
| [v10.0.36](./v10.0.36) | 2026-04-21 | 修复：When encountering an empty stream during a conversation, a long period of ... |
| [v10.0.35](./v10.0.35) | 2026-04-20 | Built-in Windows PowerShell Tool、Continue Generating Button in the Input Box，... |
| [v10.0.34](./v10.0.34) | 2026-04-17 | 修复：When an error occurs midway through a streaming reply, the error message w... |
| [v10.0.33](./v10.0.33) | 2026-04-16 | Workflow System、Workflow Execution and Tracking、Workflow Result Cards、PowerSh... |
| [v10.0.32](./v10.0.32) | 2026-04-15 | 修复：Fixed issues during Agent delegation handoff where background information ... |
| [v10.0.31](./v10.0.31) | 2026-04-14 | Quick actions for user message cards，修复 6 项问题，改进 1 项 |
| [v10.0.30](./v10.0.30) | 2026-04-14 | 修复：Fixed an issue where the protocol-compatible proxy could unexpectedly inte... |
| [v10.0.29](./v10.0.29) | 2026-04-13 | Team Import/Export、Automatic Update Checks for Built-in Skills、Copy Audit Det... |
| [v10.0.28](./v10.0.28) | 2026-04-13 | Structured Follow-up and Confirmation Interactions、Git Runtime Environment De... |
| [v10.0.27](./v10.0.27) | 2026-04-10 | Global built-in email skills、Inline review of editor changes、Selective data i... |
| [v10.0.26](./v10.0.26) | 2026-04-09 | Built-in Global Skill Expansion、Explore Delegation Preset、Dedicated SendUserM... |
| [v10.0.25](./v10.0.25) | 2026-04-08 | Agent Proactive Messages、In-Session Waiting，修复 2 项问题，改进 1 项 |
| [v10.0.24](./v10.0.24) | 2026-04-06 | Error Log Panel、Tool Search，修复 3 项问题，改进 3 项 |
| [v10.0.23](./v10.0.23) | 2026-04-01 | ZIP Agent Import，修复 3 项问题，改进 2 项 |
| [v10.0.22](./v10.0.22) | 2026-03-31 | 修复：In Windows environments, `.md` files in AI responses can now be correctly ... |
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

## Version Management Architecture

The diagram below summarizes DesireCore's branching model, release channels, and tag conventions. The overall strategy: **any branch can be tagged into Alpha/Beta, with manual promotion to Stable, while the main branch (`main`) drives stable releases**.

![DesireCore Version Management Architecture](/img/changelog/version-architecture.png)

### Branching & Development Flow

- **`main`**: The stable trunk. Only accepts PRs from `dev` or `hotfix/*`, and is the source for Stable releases.
- **`dev`**: The integration branch. All `feature/*` work merges here via PR; its HEAD maps to the Alpha channel by default.
- **`feature/*`**: Feature branches forked from `dev`. PR back to `dev` once complete.
- **`hotfix/*`**: Emergency fix branches forked from `main`. After merging into `main`, fixes are back-merged into `dev` to avoid regressions in upcoming releases.

### Release & Channel Flow

DesireCore releases progress through three channels — Alpha → Beta → Stable:

- **Alpha**: Development channel tracking the current commit on `dev`, used for day-to-day verification.
- **Beta**: Pre-release channel where maintainers pick a commit on `main` and tag it `vX.Y.Z-beta.N` for early adopters.
- **Stable**: Stable channel where, after Beta validation, maintainers manually promote the build to `vX.Y.Z`.

### Core Rules

- **Tags derive from commits**: Each release maps to a unique, reproducible commit.
- **No direct pushes to `main`**: All changes land via PR, gated by code review and CI.
- **Promotion, not rebuilding**: Beta → Stable is a channel switch — the binaries are byte-identical to the Beta build, so upgrading users receive exactly what was tested.
- **Hotfix back-merge**: After a `hotfix/*` lands on `main`, it must be back-merged into `dev` so the next release does not regress the fix.

### Build Artifacts & Version Conventions

Each Stable release ships multi-platform artifacts (macOS arm64/x64, Windows, Linux deb, etc.), distinguished by version number and platform identifier in the filename. Version numbers follow Semantic Versioning (`major.minor.patch`), with pre-release suffixes appended as `-alpha.N` / `-beta.N`.

---

:::info Version Notes
DesireCore follows Semantic Versioning. Each version number follows the format `major.minor.patch`.
:::
