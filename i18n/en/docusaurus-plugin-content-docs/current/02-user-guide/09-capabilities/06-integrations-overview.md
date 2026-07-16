---
title: Integration Capabilities Overview
description: An overview of DesireCore's open integration architecture, from email and code repositories to desktop control and object storage.
keywords: [integration, open interface, API, Email, code repository, object storage, MCP, observability]
---

# Integration Capabilities Overview

## Open Integration Architecture

DesireCore connects to external systems through several layers: **built-in tools** provide core capability, **MCP** connects external services, **CUA Driver / HostAgent** serve different device-automation scenarios, and **skills** package specialized workflows.

MCP lets you connect services that expose APIs. Computer Use covers selected applications that have no suitable API, subject to platform, accessibility, permission, and UI limitations.

Newer DesireCore releases also include the [App and Service Catalog](./app-service-catalog), which manages app installation, service registration, health checks, lifecycle actions, and approval requests.

## Capability Map

| Integration | Description | Documentation |
|-------------|-------------|---------------|
| **Built-in tools** | Files, search, command execution, network requests, user questions, and workflows | [Built-in Tools](./builtin-tools) |
| **MCP services** | Connect external APIs and services through Model Context Protocol | [MCP Integration](./mcp-integration) |
| **Skills** | Package tools and instructions into reusable workflows | [Skill Packs](./skill-packs) |
| **Computer Use** | Local GUI control through HostAgent on macOS and temporarily through bundled CUA Driver on Windows; other HostAgent platforms are still evolving | [GUI Desktop Automation](./computer-use) |
| **Email** | Manage Gmail, Outlook, and IMAP accounts | [Email Management](../email/overview) |
| **Workflows** | Compose triggers, code, LLM, Agent, and human-confirmation nodes | [Task Orchestration](../../concepts/task-orchestration) |
| **App and Service Catalog** | Manage apps, derived services, approvals, and health | [App and Service Catalog](./app-service-catalog) |

## Email Integration

DesireCore supports Gmail, Outlook, and IMAP/SMTP accounts with a unified inbox, AI-assisted classification and summaries, drafting and replies, rules, offline cache, and incremental synchronization. See [Email Management](../email/overview).

## Code Repository Integration

Through MCP and supported services, Agents can participate in repository workflows such as pull requests, issues, and code search. Review the requested target and external side effects before approving writes, comments, merges, or releases. See [MCP Integration](./mcp-integration).

## Object Storage Integration

MCP services can connect S3-compatible and other object-storage systems for upload, download, listing, search, deletion, and batch organization. Credentials and external writes remain subject to the service's permissions and DesireCore approval policy.

## Desktop and Mobile Devices

When no suitable API or tool exists, Computer Use can operate a graphical interface. **macOS GUI operations currently run through HostAgent**. **Windows temporarily uses the bundled, default-enabled CUA Driver** so users have local capability before the native Windows HostAgent is complete. HostAgent implementations for Windows, Linux, other desktop systems, and mobile platforms remain under development.

- **Local macOS applications**: operated by HostAgent through native macOS capabilities and applicable system permissions
- **Local Windows applications**: temporarily operated by CUA Driver through accessibility elements, mouse, and keyboard
- **Linux, other desktops, and mobile devices**: part of the future HostAgent roadmap and should not be treated as currently available
- **Screen awareness**: screenshots and accessible UI text may enter model context and can contain sensitive data

Computer Use is not reliable for every interface. Custom-drawn controls, the UAC secure desktop, locked screens, elevated applications, and protected content may be unavailable. External effects such as sending, payment, deletion, or publication should remain user-confirmed. See [GUI Desktop Automation](./computer-use).

## Observability and Audit

DesireCore records supported tool calls, approvals, and external operations so users can review what was requested and executed. The exact detail depends on the tool and service; logs may contain sensitive metadata and should be protected. See [Audit Trail](../security/audit-trail).

## Custom Integrations

Choose the extension path that matches the task:

1. **Build an MCP service** for a stable internal or external API.
2. **Create a skill** for reusable instructions, scripts, and workflows.
3. **Use Computer Use** for occasional local Windows UI tasks without an API.
4. **Create a workflow** for repeatable trigger, code, LLM, Agent, and human-confirmation sequences.

## Next Steps

- [Tool System Overview](./tool-system)
- [MCP Integration](./mcp-integration)
- [Audit Trail](../security/audit-trail)
