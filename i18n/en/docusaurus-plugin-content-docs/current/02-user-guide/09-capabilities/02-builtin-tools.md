---
title: Built-in Tools Reference
description: Complete list of all tools built into DesireCore, including each tool's function description, use cases, and risk level.
keywords: [built-in tools, tool list, file operations, search, command execution, web fetch]
---

# Built-in Tools Reference

Built-in tools are basic capabilities that come with DesireCore, installed with the client, ready to use without additional configuration. Below is the complete list of all built-in tools.

## File Operations

### Read — Read File

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |

Read content of file at specified path. Supports line number display and pagination for text files, automatically detects image files and presents them visually. For very large files, can specify read range (offset + limit).

**Typical Use Cases**: View code files, read documents, view configuration files, preview images.

### Write — Write File

| Attribute | Value |
|-----------|-------|
| Risk Level | Medium |
| Requires Confirmation | Yes |

Write content to file at specified path. Automatically creates directory if it doesn't exist. This operation overwrites existing file content.

**Typical Use Cases**: Create new files, save generated content, update configuration files.

### Edit — Edit File

| Attribute | Value |
|-----------|-------|
| Risk Level | Medium |
| Requires Confirmation | Yes |

Precise text replacement tool. Modifies files by specifying original text and new text, safer than full file overwrite. Supports smart matching (e.g., automatically handling quote style differences).

**Typical Use Cases**: Modify specific functions in code, update configuration items, fix errors in documents.

### NotebookEdit — Edit Jupyter Notebook

| Attribute | Value |
|-----------|-------|
| Risk Level | Medium |
| Requires Confirmation | Yes |

Edit specified cells in Jupyter Notebook (.ipynb) files. Supports replace, insert, and delete modes.

**Typical Use Cases**: Modify data analysis scripts, update experiment code, organize Notebook structure.

## Search and Browse

### Glob — Search File Names

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |

Search files in directory by pattern. Supports glob wildcard patterns (e.g., `**/*.ts`). Prioritizes high-performance fd tool, automatically respects .gitignore rules.

**Typical Use Cases**: Find specific file types, locate configuration files in projects, search for test files.

### Grep — Search File Content

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |

Search for matching text content in files. Supports regular expressions and context line count. Prioritizes high-performance ripgrep, automatically respects .gitignore rules.

**Typical Use Cases**: Search for function calls in code, find specific error messages, locate keywords in documents.

### Ls — List Directory Contents

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |

List all files and subdirectories in specified directory. Shows file sizes, supports recursive mode. Skips hidden files by default.

**Typical Use Cases**: Browse project structure, view file lists in directories, understand project organization.

## Command Execution

### Bash — Execute Command

| Attribute | Value |
|-----------|-------|
| Risk Level | High |
| Requires Confirmation | Yes |

Execute shell commands. Supports pipes, redirects, and other shell features. Cross-platform support (bash on macOS/Linux, Git Bash on Windows). Has timeout protection and output truncation mechanism.

**Typical Use Cases**: Run build commands, execute tests, install dependencies, view system status.

:::warning High Risk Operation
Command execution is a high-risk operation requiring your confirmation every time. The agent will display the complete command to be executed in the confirmation dialog—please read carefully before confirming.
:::

### Which — Check Command Availability

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |

Check if one or more command-line tools are installed in the system and return executable file paths.

**Typical Use Cases**: Check if tools are installed before executing commands.

## Network

### WebFetch — Fetch Webpage

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |

Fetch webpage content and convert to Markdown format. Supports smart content extraction (automatically removes ads and navigation bars), built-in 15-minute cache.

**Typical Use Cases**: Consult online documentation, get blog article content, view API references.

### WebSearch — Web Search

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |

Search the internet for latest information. Supports domain whitelist and blacklist filtering.

**Typical Use Cases**: Find latest technical materials, search for problem solutions, get real-time information.

## Agent Collaboration

### spawn_agent — Spawn Sub-agent

| Attribute | Value |
|-----------|-------|
| Risk Level | Medium |
| Requires Confirmation | Yes |

Spawn a temporary sub-agent to handle specific subtasks. Sub-agents have independent context and tool sets, suitable for breaking complex tasks into independent sub-problems.

**Typical Use Cases**: Process multiple independent subtasks in parallel, split complex problems to specialized sub-agents.

### handoff — Handoff Session

| Attribute | Value |
|-----------|-------|
| Risk Level | Medium |
| Requires Confirmation | Yes |

Transfer current session to another agent, carrying context summary. Used when current agent believes another agent is better suited to handle your needs.

**Typical Use Cases**: Problem exceeds current agent's professional scope, need another agent's specialized tools.

### request_help — Request Assistance

| Attribute | Value |
|-----------|-------|
| Risk Level | Medium |
| Requires Confirmation | Yes |

Request professional assistance from another persistent agent. Unlike spawn_agent, the requested agent has its own memory and professional knowledge—similar to "asking a colleague."

**Typical Use Cases**: Need opinions from other domain experts, cross-agent collaboration to complete complex tasks.

## Workspace Management

### ManageWorkDirs — Manage Working Directories

| Attribute | Value |
|-----------|-------|
| Risk Level | Medium |
| Requires Confirmation | Yes |

Manage user's working directory configuration. Supports listing, adding, removing, and setting primary directories.

**Typical Use Cases**: Switch project workspaces, add new project directories.

### GenerateUUID — Generate Unique Identifier

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |

Generate UUID v4 unique identifiers for scenarios requiring unique IDs.

**Typical Use Cases**: Create new agents, generate session identifiers.

## Memory and Skills

### recall_conversation — Retrieve Conversation History

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |

Retrieve topic records from conversation history. Can search for specific topics or browse by time range.

**Typical Use Cases**: Review previously discussed solutions, find past decision records, reference historical conversations.

### Skill — Load Skill

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |

Load and execute specified skill pack. Skill packs contain complete instructions that agents will strictly follow.

**Typical Use Cases**: Execute predefined workflows, apply professional skills.

### CreateSchedule — Create Scheduled Task

| Attribute | Value |
|-----------|-------|
| Risk Level | Medium |
| Requires Confirmation | No |

Create scheduled tasks. Supports delayed execution, specified time, periodic scheduling, and other modes.

**Typical Use Cases**: Set timed reminders, create periodic report tasks, configure automatic checks.

## MCP Resources

### McpListResources — List MCP Resources

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |

List readable resources exposed by connected MCP Servers.

### McpReadResource — Read MCP Resource

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |

Read content of specified resource provided by MCP Server.

### McpListPrompts — List MCP Prompt Templates

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |

List prompt templates provided by MCP Server.

### McpGetPrompt — Get MCP Prompt

| Attribute | Value |
|-----------|-------|
| Risk Level | Low |
| Requires Confirmation | No |

Get and expand specified prompt template from MCP Server.
