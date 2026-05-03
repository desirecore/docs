---
title: Built-in Tools Reference
description: Complete reference for DesireCore built-in tools, including functionality, usage scenarios, risk levels, and confirmation behavior.
keywords: [tools, Tool, built-in tools, Builtin Tools, reference]
---

# Built-in Tools Reference

DesireCore built-in tools ship with the client and require no extra installation. A tool appears in agent context only when it is available for the current platform, permission policy, runtime environment, and task context. For example, PowerShell and HttpRequest are primarily Windows-oriented.

## Quick Index

| Category | Tools |
|----------|-------|
| File Operations | Read, Write, Edit, NotebookEdit |
| Search and Discovery | Glob, Grep, Ls, ToolSearch |
| Commands, Waiting, and Network | Bash, PowerShell, Which, Sleep, WebFetch, WebSearch, HttpRequest |
| Agent Collaboration | Delegate, spawn_agent, handoff, request_help, SendMessage, SendUserMessage, AskUserQuestion, ManageTeam |
| Workspace and Data | ManageWorkDirs, GenerateUUID, RecallConversation, JsonRepair |
| Skills and Scheduling | Skill, CreateSchedule |
| MCP | McpListResources, McpReadResource, McpListPrompts, McpGetPrompt |
| Workflows | WorkflowCreate, WorkflowValidate, WorkflowTest, WorkflowRun, WorkflowView |

## Risk And Confirmation

| Risk Level | Common Tools | Default Confirmation |
|------------|--------------|----------------------|
| Low | Read, Glob, Grep, Ls, Which, Sleep, WebFetch, WebSearch, GenerateUUID, JsonRepair | Usually no |
| Medium | Write, Edit, NotebookEdit, ManageWorkDirs, CreateSchedule, WorkflowRun, HttpRequest | Use more care for writes, directory management, or background tasks |
| High | Bash, PowerShell | Usually yes |
| Inherited | Skill, MCP tools, workflow nodes | Depends on skill, MCP server, or workflow node declarations |

Actual confirmation behavior depends on permission settings, approval mode, and operation content. Before approving command execution, file writes, external sends, or high-impact operations, review the command, working directory, and intent.

## File Operations

### Read

| Attribute | Description |
|-----------|-------------|
| Function | Reads text, code, configuration files, images, and notebook content; supports ranged reads and pagination |
| Risk Level | Low |
| Requires Confirmation | No |
| Usage Scenarios | Inspect code, read docs, check configuration, preview images, understand notebooks |

### Write

| Attribute | Description |
|-----------|-------------|
| Function | Creates a new file or fully overwrites an existing file; missing directories can be created automatically |
| Risk Level | Medium |
| Requires Confirmation | Usually yes |
| Usage Scenarios | Create docs, generate reports, save configuration, write complete files |

### Edit

| Attribute | Description |
|-----------|-------------|
| Function | Performs precise text replacement for local patches |
| Risk Level | Medium |
| Requires Confirmation | Usually yes |
| Usage Scenarios | Patch code, update configuration, fix a section of a document |

### NotebookEdit

| Attribute | Description |
|-----------|-------------|
| Function | Replaces, inserts, or deletes a specific Jupyter Notebook cell |
| Risk Level | Medium |
| Requires Confirmation | Usually yes |
| Usage Scenarios | Adjust analysis notebooks, update experiments, organize computation steps |

## Search And Discovery

### Glob

| Attribute | Description |
|-----------|-------------|
| Function | Finds files with glob patterns such as `**/*.ts` |
| Risk Level | Low |
| Requires Confirmation | No |
| Usage Scenarios | Find config files, locate tests, inspect project structure |

### Grep

| Attribute | Description |
|-----------|-------------|
| Function | Searches text or regular expressions in files with context and file-type filters |
| Risk Level | Low |
| Requires Confirmation | No |
| Usage Scenarios | Find function calls, locate error messages, search documentation |

### Ls

| Attribute | Description |
|-----------|-------------|
| Function | Lists files and subdirectories, optionally recursively |
| Risk Level | Low |
| Requires Confirmation | No |
| Usage Scenarios | Browse workspaces, confirm paths, inspect folders |

### ToolSearch

| Attribute | Description |
|-----------|-------------|
| Function | Searches deferred tools, connectors, and external capabilities |
| Risk Level | Low |
| Requires Confirmation | No |
| Usage Scenarios | Find GitHub, browser debugging, documentation lookup, or other lazy-loaded tools |

## Commands, Waiting, And Network

### Bash

| Attribute | Description |
|-----------|-------------|
| Function | Runs shell commands; supports timeouts, background execution, and output truncation |
| Risk Level | High |
| Requires Confirmation | Usually yes |
| Usage Scenarios | Run tests, build projects, install dependencies, execute scripts |

### PowerShell

| Attribute | Description |
|-----------|-------------|
| Function | Runs PowerShell commands and scripts on Windows |
| Risk Level | High |
| Requires Confirmation | Usually yes |
| Usage Scenarios | Windows administration, PowerShell scripts, local environment checks |

### Which

| Attribute | Description |
|-----------|-------------|
| Function | Checks whether one or more command-line tools are installed and returns executable paths |
| Risk Level | Low |
| Requires Confirmation | No |
| Usage Scenarios | Verify dependencies before running commands |

### Sleep

| Attribute | Description |
|-----------|-------------|
| Function | Waits 0.1 to 300 seconds inside the current session, then continues the same task chain |
| Risk Level | Low |
| Requires Confirmation | No |
| Usage Scenarios | Wait for builds, poll deployment status, rate-limit requests |

:::tip Sleep vs. CreateSchedule
Use `Sleep` for a short wait before continuing the current task. Use `CreateSchedule` for independent background reminders, reports, and recurring tasks.
:::

### WebFetch

| Attribute | Description |
|-----------|-------------|
| Function | Fetches a web page and converts it to Markdown with content extraction, caching, and timeout controls |
| Risk Level | Low |
| Requires Confirmation | No |
| Usage Scenarios | Read online docs, inspect API references, extract page text |

### WebSearch

| Attribute | Description |
|-----------|-------------|
| Function | Searches the web with result limits and domain filters |
| Risk Level | Low |
| Requires Confirmation | No |
| Usage Scenarios | Find current information, public references, troubleshooting material |

### HttpRequest

| Attribute | Description |
|-----------|-------------|
| Function | Sends HTTP requests in Windows-oriented environments where common command-line network tools may be unavailable |
| Risk Level | Medium |
| Requires Confirmation | Depends on request content |
| Usage Scenarios | Call APIs, check service status, retrieve structured data |

## Agent Collaboration

### Delegate

| Attribute | Description |
|-----------|-------------|
| Function | Delegates work to another agent, a team, or a preset; supports sync, async, handoff, and Explore modes |
| Risk Level | Medium |
| Requires Confirmation | Depends on permissions and task content |
| Usage Scenarios | Cross-domain collaboration, parallel research, read-only Explore analysis |

### spawn_agent

| Attribute | Description |
|-----------|-------------|
| Function | Starts a temporary sub-agent with isolated context for a concrete subtask |
| Risk Level | Medium |
| Requires Confirmation | Depends on permissions |
| Usage Scenarios | Read multiple modules in parallel, split large investigations, isolate exploration |

### handoff

| Attribute | Description |
|-----------|-------------|
| Function | Transfers the current conversation to another agent with reason and context summary |
| Risk Level | Low |
| Requires Confirmation | Usually no |
| Usage Scenarios | Move a task to a more suitable specialist agent |

### request_help / SendMessage

| Attribute | Description |
|-----------|-------------|
| Function | Requests help from or sends messages to another persistent agent, optionally waiting for a reply |
| Risk Level | Low |
| Requires Confirmation | Usually no |
| Usage Scenarios | Multi-agent collaboration, specialist advice, result handoff |

### SendUserMessage

| Attribute | Description |
|-----------|-------------|
| Function | Sends a Markdown message to the user, optionally with file attachments and proactive status |
| Risk Level | Low |
| Requires Confirmation | No |
| Usage Scenarios | Report progress, send attached material, proactively surface important context |

### AskUserQuestion

| Attribute | Description |
|-----------|-------------|
| Function | Displays structured question cards to collect confirmation, choices, or extra fields |
| Risk Level | Low |
| Requires Confirmation | No |
| Usage Scenarios | Clarify requirements, confirm plans, collect multiple answers |

### ManageTeam

| Attribute | Description |
|-----------|-------------|
| Function | Creates and adjusts agent teams, supervisors, members, and team tasks |
| Risk Level | Medium |
| Requires Confirmation | Depends on operation content |
| Usage Scenarios | Form specialist teams, adjust members, assign team-level work |

## Workspace And Data

### ManageWorkDirs

| Attribute | Description |
|-----------|-------------|
| Function | Lists, adds, removes, and sets primary work directories |
| Risk Level | Medium |
| Requires Confirmation | Usually yes |
| Usage Scenarios | Add project folders, switch primary workspace, remove paths |

### GenerateUUID

| Attribute | Description |
|-----------|-------------|
| Function | Generates one or more UUID v4 identifiers |
| Risk Level | Low |
| Requires Confirmation | No |
| Usage Scenarios | Create IDs, generate test data, name resources |

### RecallConversation

| Attribute | Description |
|-----------|-------------|
| Function | Retrieves historical conversations by keyword and time range |
| Risk Level | Low |
| Requires Confirmation | No |
| Usage Scenarios | Review prior discussions, find past decisions, restore context |

### JsonRepair

| Attribute | Description |
|-----------|-------------|
| Function | Repairs common JSON formatting issues and can shape output toward an expected structure |
| Risk Level | Low |
| Requires Confirmation | No |
| Usage Scenarios | Fix model-generated JSON, clean configuration snippets |

## Skills And Scheduling

### Skill

| Attribute | Description |
|-----------|-------------|
| Function | Loads and executes an installed skill pack; skills may declare tools, trigger restrictions, context mode, model, and provider preferences |
| Risk Level | Inherits skill configuration |
| Requires Confirmation | Inherits the skill and any tools it invokes |
| Usage Scenarios | Run professional workflows, invoke custom capabilities, apply built-in global skills |

### CreateSchedule

| Attribute | Description |
|-----------|-------------|
| Function | Creates a background scheduled task using an exact time, delay, interval, or Cron rule |
| Risk Level | Medium |
| Requires Confirmation | Depends on approval policy |
| Usage Scenarios | Set reminders, generate periodic reports, schedule independent prompt checks |

## MCP Integration

### McpListResources / McpReadResource

| Attribute | Description |
|-----------|-------------|
| Function | Lists or reads resources exposed by MCP servers |
| Risk Level | Low |
| Requires Confirmation | No |
| Usage Scenarios | Inspect external service resources, read connector-provided data |

### McpListPrompts / McpGetPrompt

| Attribute | Description |
|-----------|-------------|
| Function | Lists or expands prompt templates provided by MCP servers |
| Risk Level | Low |
| Requires Confirmation | No |
| Usage Scenarios | Reuse prompt templates exposed by external services |

## Workflows

### WorkflowCreate

| Attribute | Description |
|-----------|-------------|
| Function | Creates a workflow DSL file and can write accompanying documentation |
| Risk Level | Low |
| Usage Scenarios | Build reusable automation flows |

### WorkflowValidate

| Attribute | Description |
|-----------|-------------|
| Function | Validates workflow DSL structure, nodes, edges, and references |
| Risk Level | Low |
| Usage Scenarios | Check workflow configuration before saving |

### WorkflowTest

| Attribute | Description |
|-----------|-------------|
| Function | Tests workflow execution paths with parameters |
| Risk Level | Low |
| Usage Scenarios | Debug automation flows, verify node output |

### WorkflowRun

| Attribute | Description |
|-----------|-------------|
| Function | Executes a workflow and returns structured results |
| Risk Level | Medium |
| Usage Scenarios | Run flows containing code, LLM, agent, or human-gate nodes |

### WorkflowView

| Attribute | Description |
|-----------|-------------|
| Function | Opens the workflow canvas for viewing without directly editing content |
| Risk Level | Low |
| Usage Scenarios | Inspect flow structure and node configuration |
