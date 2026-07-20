---
title: Built-in Tools Overview
description: Complete list of DesireCore built-in tools, including purpose, usage scenarios, and risk levels.
keywords: [built-in tools, tool list, file operations, search, command execution, web fetch]
---

# Built-in Tools Overview

Built-in tools ship with DesireCore and require no extra installation. Agents see only tools that are actually available in the current platform, permission policy, runtime environment, and task context.

## File Operations

### Read - Read Files

Reads text, code, configuration files, images, and notebook content. It supports ranged reads, pagination, image preview, and notebook cell reads.

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |
| Typical Use Cases | Inspect code, read documents, check configuration, preview images |

### Write - Write Files

Creates a new file or fully overwrites an existing file. Missing directories are created automatically.

| Attribute | Value |
|-----------|-------|
| Risk Level | Medium |
| Requires Confirmation | Yes |
| Typical Use Cases | Create documents, save reports, generate configuration files |

### Edit - Edit Files

Performs precise text replacement. It is better for small patches than rewriting an entire file.

| Attribute | Value |
|-----------|-------|
| Risk Level | Medium |
| Requires Confirmation | Yes |
| Typical Use Cases | Patch code, update configuration, fix a section of a document |

### NotebookEdit - Edit Jupyter Notebooks

Replaces, inserts, or deletes a specific Jupyter Notebook cell.

| Attribute | Value |
|-----------|-------|
| Risk Level | Medium |
| Requires Confirmation | Yes |
| Typical Use Cases | Adjust analysis notebooks, update experiments, organize computation steps |

## Search and Discovery

### Glob - Search File Names

Finds files with glob patterns such as `**/*.ts`.

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |
| Typical Use Cases | Find config files, locate tests, inspect project structure |

### Grep - Search File Contents

Searches text or regular expressions in files with context lines, type filters, case control, and multiple output modes.

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |
| Typical Use Cases | Find function calls, locate error messages, search documentation |

### Ls - List Directory

Lists files and subdirectories, with optional recursion.

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |
| Typical Use Cases | Browse workspaces, confirm paths, inspect folders |

### ToolSearch - Search Available Tools

Searches deferred tools and external capabilities that may be loaded on demand.

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |
| Typical Use Cases | Find GitHub, browser debugging, or documentation lookup tools |

## Command Execution

### Bash - Execute Shell Commands

Runs shell commands. It supports timeouts, background execution, and output truncation.

| Attribute | Value |
|-----------|-------|
| Risk Level | High |
| Requires Confirmation | Yes |
| Typical Use Cases | Run tests, build projects, install dependencies, execute scripts |

:::warning High-Risk Operation
Command execution can modify system state or access external networks. Review the command, working directory, and intent before approving.
:::

### PowerShell - Execute Windows PowerShell Commands

Available on Windows. Runs PowerShell commands and scripts with version-aware guidance, timeouts, background execution, and large-output handling.

| Attribute | Value |
|-----------|-------|
| Risk Level | High |
| Requires Confirmation | Yes |
| Typical Use Cases | Windows administration, PowerShell scripts, local environment checks |

### Which - Check Command Availability

Checks whether one or more command-line tools are installed and returns executable paths.

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |
| Typical Use Cases | Verify dependencies before running commands |

### Sleep - Wait in the Current Session

Waits from 0.1 to 300 seconds, then continues the same task chain. It does not occupy a shell process and can be interrupted.

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |
| Typical Use Cases | Wait for builds, poll deployment status, rate-limit requests |

:::tip Sleep vs. CreateSchedule
Use `Sleep` for a short wait before continuing the current task. Use `CreateSchedule` for independent background reminders, reports, and recurring tasks.
:::

## Network

### WebFetch - Fetch Web Pages

Fetches a web page and converts it to Markdown, with main-content extraction, caching, and timeout controls.

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |
| Typical Use Cases | Read online docs, inspect API references, extract article text |

### WebSearch - Search the Web

Searches the internet with result limits and domain filters.

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |
| Typical Use Cases | Find current information, public references, troubleshooting material |

### HttpRequest - Send HTTP Requests

Registered primarily on Windows for environments where common command-line network tools are unavailable.

| Attribute | Value |
|-----------|-------|
| Risk Level | Medium |
| Requires Confirmation | Depends on request content |
| Typical Use Cases | Call APIs, check service status, retrieve structured data |

## Agent Collaboration

### Delegate - Delegate Tasks

Delegates work to another agent, a team, or a preset such as Explore. Supports sync, async, and handoff-style flows.

| Attribute | Value |
|-----------|-------|
| Risk Level | Medium |
| Requires Confirmation | Depends on permissions and task content |
| Typical Use Cases | Cross-domain collaboration, parallel research, read-only Explore analysis |

### spawn_agent - Spawn Sub-Agent

Starts a temporary sub-agent with an isolated context for a concrete subtask.

| Attribute | Value |
|-----------|-------|
| Risk Level | Medium |
| Requires Confirmation | Depends on permissions and task content |
| Typical Use Cases | Read several modules in parallel, split large investigations |

### handoff - Handoff Session

Transfers the current conversation to a more suitable agent with reason and context summary.

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |
| Typical Use Cases | Move a task to a specialized agent |

### request_help - Request Help

Asks another persistent agent for advice or assistance.

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |
| Typical Use Cases | Consult a specialist agent |

### SendMessage - Agent-to-Agent Message

Sends a message to another agent with context, intent, and waiting behavior.

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |
| Typical Use Cases | Multi-agent collaboration, result handoff, team communication |

### SendUserMessage - Send Message to User

Sends a Markdown message to you, optionally with file attachments and proactive status.

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |
| Typical Use Cases | Report progress, send attached material, proactively surface important context |

### AskUserQuestion - Ask the User

Displays structured question cards in the current conversation.

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |
| Typical Use Cases | Clarify requirements, confirm choices, gather multiple fields |

### ManageTeam - Manage Team

Creates and adjusts agent teams, supervisors, members, and team tasks.

| Attribute | Value |
|-----------|-------|
| Risk Level | Medium |
| Requires Confirmation | Depends on operation |
| Typical Use Cases | Form specialist teams, assign team-level work |

## Context Management

### ManageContext - Manage Conversation Context

Lets an agent actively curate its own conversation context: pin key content it wants to keep around, discard tool results it no longer needs, or collapse history down to just the system layer plus whatever is pinned when things get too cluttered. It can also temporarily adjust how much context budget the current session is allowed to use. None of this physically deletes the original record - the full history remains available to look back on.

| Attribute | Value |
|-----------|-------|
| Risk Level | Medium |
| Requires Confirmation | Depends on the operation (actions with information loss, such as clearing history or discarding a tool result, require confirmation; other operations do not) |
| Typical Use Cases | Protect key conclusions from automatic pruning in long conversations, clean up oversized tool results, temporarily adjust the conversation's context budget |

### CompactSession - Compress Session History

Lets an agent proactively compress earlier conversation history into a summary, freeing up context space while preserving the important information.

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |
| Typical Use Cases | Trim down a long-running conversation once it has accumulated significant history |

## Workspace and Data

### ManageWorkDirs - Manage Work Directories

Lists, adds, removes, and sets primary work directories.

| Attribute | Value |
|-----------|-------|
| Risk Level | Medium |
| Requires Confirmation | Yes |
| Typical Use Cases | Add project folders, switch primary workspace, remove paths |

### GenerateUUID - Generate Unique IDs

Generates one or more UUID v4 identifiers.

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |
| Typical Use Cases | Create IDs, generate test data, name resources |

### RecallConversation - Retrieve Conversation History

Retrieves historical conversations by keyword and time range.

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |
| Typical Use Cases | Review prior discussions, find past decisions, restore context |

### JsonRepair - Repair JSON

Repairs common JSON formatting issues and can shape output toward an expected structure.

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |
| Typical Use Cases | Fix model-generated JSON, clean configuration snippets |

## Skills and Scheduling

### Skill - Load Skill

Loads and executes an installed skill pack. Skills may declare tools, trigger behavior, context mode, model, and provider preferences.

| Attribute | Value |
|-----------|-------|
| Risk Level | Inherited from skill configuration |
| Requires Confirmation | Inherited from skill and invoked tools |
| Typical Use Cases | Run professional workflows, invoke custom capabilities |

### CreateSchedule - Create Scheduled Task

Creates a background scheduled task using a specific time, delay, interval, or cron rule.

| Attribute | Value |
|-----------|-------|
| Risk Level | Medium |
| Requires Confirmation | Depends on approval policy |
| Typical Use Cases | Set reminders, generate periodic reports, schedule independent prompt checks |

## MCP Resources

### McpListResources / McpReadResource

Lists or reads resources exposed by MCP servers.

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |

### McpListPrompts / McpGetPrompt

Lists or expands prompt templates provided by MCP servers.

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |

## Workflows

### WorkflowCreate / WorkflowValidate / WorkflowTest / WorkflowRun / WorkflowView

Creates, validates, tests, runs, and opens workflow DSL files. Workflows can orchestrate triggers, code, LLM nodes, agents, and human gates.

| Attribute | Value |
|-----------|-------|
| Risk Level | Low to Medium |
| Requires Confirmation | No by default |
| Typical Use Cases | Build reusable automations, validate workflows, run structured processes |
