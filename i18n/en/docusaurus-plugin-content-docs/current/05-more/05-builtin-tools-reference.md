---
title: Built-in Tools Reference
description: Reference for DesireCore built-in tools, including function, risk level, and use cases.
keywords: [tools, built-in tools, reference]
---

# Built-in Tools Reference

DesireCore built-in tools evolve with the client. This page groups common tools by capability area; the exact tools available to an agent depend on the agent, enabled skills, permissions, and platform.

## Files and Search

| Tool | Function | Risk | Confirmation |
|------|----------|------|--------------|
| `Read` | Read text, images, PDFs, and large file ranges | Low | No |
| `Write` | Create or overwrite files | Medium | Usually |
| `Edit` | Replace precise text ranges | Medium | Usually |
| `NotebookEdit` | Edit Jupyter Notebook cells | Medium | Usually |
| `Ls` | List directory contents | Low | No |
| `Glob` | Search by filename pattern | Low | No |
| `Grep` | Search file contents | Low | No |
| `ToolSearch` | Search deferred tools, connectors, and external capabilities | Low | No |

`Read` chooses a strategy by file type. PDFs may be read as text, rendered page by page for vision models, or loaded by range for large files.

## System and Workspace

| Tool | Function | Risk | Confirmation |
|------|----------|------|--------------|
| `Bash` | Run shell commands | High | Yes |
| `PowerShell` | Run PowerShell commands on Windows | High | Yes |
| `Which` | Check command availability | Low | No |
| `ManageWorkDirs` | Manage working directories | Medium | Usually |
| `GenerateUUID` | Generate UUIDs | Low | No |
| `JsonRepair` | Repair common JSON formatting problems | Low | No |

Under the default approval mode, command execution asks you to review the full command before it runs (modes such as External Tools Only or Allow All follow their own rules — see the approval modes in the security settings). Work directories provide the agent's default operating context; if you enable "restrict to work directories" in an agent's configuration, file reads and writes are strictly confined to the work-directory whitelist (with it disabled — the default — the agent may access regular local files while sensitive paths stay protected).

## Web and Browser

| Tool | Function | Risk | Confirmation |
|------|----------|------|--------------|
| `WebFetch` | Fetch a webpage as Markdown | Low | No |
| `WebSearch` | Search the web | Low | No |
| `HttpRequest` | Send HTTP requests, primarily for Windows environments | Medium | Depends |
| `Browser*` | Control browser tabs, clicks, scrolling, screenshots | Low-Medium | Depends |
| `SitePattern*` | Read or write site usage patterns | Low-Medium | May be needed |
| `LocalBookmarks` | Search local browser bookmarks/history hints | Low | No |

Browser, SitePattern, and LocalBookmarks tools are Web Access skill-scoped tools. See [Web Access](../user-guide/capabilities/web-access).

## Collaboration and Tasks

| Tool | Function | Risk | Confirmation |
|------|----------|------|--------------|
| `Delegate` | Delegate work to another agent, team, or preset flow | Medium | Depends |
| `SpawnAgent` | Create a temporary sub-agent | Medium | Usually |
| `Handoff` | Transfer work to another agent | Medium | Usually |
| `RequestHelp` | Ask a persistent agent for help | Medium | Usually |
| `SendMessage` / `SendUserMessage` | Communicate between agents or proactively message the user | Low | No |
| `AskUserQuestion` | Ask the user a structured question | Low | No |
| `ManageTeam` | Create or adjust an agent team | Medium | Depends |
| `TaskCreate` / `TaskUpdate` | Maintain the floating task board | Low | No |
| `TaskList` / `TaskGet` | Query task board state | Low | No |

## Context, Memory, and Skills

| Tool | Function | Risk | Confirmation |
|------|----------|------|--------------|
| `RecallConversation` | Retrieve conversation history | Low | No |
| `ManageContext` | Pin/discard conversation content, clear history, adjust context budget | Medium | Depends |
| `CompactSession` | Compact long conversation context | Low | No |
| `Skill` | Load or invoke a skill | Depends | Depends |

`ManageContext` lets an agent actively curate its own conversation context: pin key content it wants to keep around, discard tool results it no longer needs, collapse history down to just the system layer plus whatever is pinned, or temporarily adjust how much context budget the current session is allowed to use. None of this physically deletes the original record — the full history remains available to look back on (actions with information loss, such as clearing history or discarding a tool result, require confirmation; other operations do not).

## Automation

| Tool | Function | Risk | Confirmation |
|------|----------|------|--------------|
| `CreateSchedule` | Create delay, at, interval, or cron schedules | Medium | Yes |
| `HeartbeatRespond` | Submit heartbeat outcome, notifications, and file links | Low | No |
| `WorkflowCreate` | Create workflow definitions | Medium | Usually |
| `WorkflowValidate` / `WorkflowTest` | Validate or test workflow definitions | Low | No |
| `WorkflowRun` | Run workflows | Medium | Usually |
| `WorkflowView` | Open the workflow canvas for inspection | Low | No |

## Documents and Media

| Tool | Function | Risk | Confirmation |
|------|----------|------|--------------|
| `ExportDocument` | Export PDF, DOCX, or related formats | Low-Medium | Depends |
| `GenerateImage` | Generate or edit images | Medium | Depends on provider/cost |
| `GenerateVideo` | Generate videos | Medium | Depends on provider/cost |
| `BeautifyImage` | Improve, crop, center, or optimize images | Medium | Depends |
| `UnderstandImage` | Use a vision provider | Low-Medium | Depends |
| `MathCalc` | Deterministic high-precision calculation | Low | No |

Media generation tools require a configured `image_gen`, `video_gen`, or image processing provider. See [Media Generation](../user-guide/capabilities/media-generation).

## MCP Resources

| Tool | Function | Risk | Confirmation |
|------|----------|------|--------------|
| `McpListResources` / `McpReadResource` | List and read MCP resources | Low | No |
| `McpListPrompts` / `McpGetPrompt` | List and expand MCP prompts | Low | No |

MCP tools come from connected external services. Their permissions, risks, and approval behavior depend on the service declaration and DesireCore local permission policy.
