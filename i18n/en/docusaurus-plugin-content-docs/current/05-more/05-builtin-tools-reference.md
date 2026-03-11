---
title: Built-in Tools Reference
description: Complete reference for DesireCore built-in tools, including functionality and usage scenarios
keywords: [tools, Tool, built-in tools, Builtin Tools, reference]
---

# Built-in Tools Reference

DesireCore provides **20 built-in tools**, automatically updated with the client version. These tools require no installation—agents can use them out of the box.

## File Operations

### Read (Read File)

| Property | Description |
|----------|-------------|
| **Function** | Read file content from the file system |
| **Risk Level** | Low |
| **Requires Confirmation** | No |
| **Usage Scenario** | View documents, read configurations, analyze code |

### Write (Write File)

| Property | Description |
|----------|-------------|
| **Function** | Create new files or completely overwrite existing files |
| **Risk Level** | Medium |
| **Requires Confirmation** | Yes by default (ask mode) |
| **Usage Scenario** | Create documents, generate reports, save results |

### Edit (Edit File)

| Property | Description |
|----------|-------------|
| **Function** | Perform precise text replacements in files (send diff only) |
| **Risk Level** | Medium |
| **Requires Confirmation** | Yes by default (ask mode) |
| **Usage Scenario** | Modify configurations, update documents, code patching |

### Ls (List Directory)

| Property | Description |
|----------|-------------|
| **Function** | List files and subdirectories in the specified directory |
| **Risk Level** | Low |
| **Requires Confirmation** | No |
| **Usage Scenario** | Browse project structure, find files |

### NotebookEdit (Edit Jupyter Notebook)

| Property | Description |
|----------|-------------|
| **Function** | Replace, insert, or delete specific cells in a Jupyter Notebook |
| **Risk Level** | Medium |
| **Requires Confirmation** | Yes by default |
| **Usage Scenario** | Data analysis, editing computational notebooks |

## Search Tools

### Glob (File Search)

| Property | Description |
|----------|-------------|
| **Function** | Quickly search files using wildcard patterns |
| **Risk Level** | Low |
| **Requires Confirmation** | No |
| **Usage Scenario** | Find files by name pattern, e.g., `*.md`, `src/**/*.ts` |

### Grep (Content Search)

| Property | Description |
|----------|-------------|
| **Function** | Search for regex matches in file contents |
| **Risk Level** | Low |
| **Requires Confirmation** | No |
| **Usage Scenario** | Search for function definitions in code, find configuration items |

## System Tools

### Bash (Execute Command)

| Property | Description |
|----------|-------------|
| **Function** | Execute shell commands |
| **Risk Level** | High |
| **Requires Confirmation** | Yes |
| **Usage Scenario** | Run scripts, install dependencies, execute system operations |

### Which (Find Command)

| Property | Description |
|----------|-------------|
| **Function** | Check if a specified command is available on the system |
| **Risk Level** | Low |
| **Requires Confirmation** | No |
| **Usage Scenario** | Check if tools are installed |

### GenerateUuid (Generate UUID)

| Property | Description |
|----------|-------------|
| **Function** | Generate unique identifiers |
| **Risk Level** | Low |
| **Requires Confirmation** | No |
| **Usage Scenario** | Create unique IDs |

## Network Tools

### WebFetch (Web Fetch)

| Property | Description |
|----------|-------------|
| **Function** | Fetch content from a specified URL, converting HTML to Markdown |
| **Risk Level** | Low |
| **Requires Confirmation** | No |
| **Usage Scenario** | Fetch web information, read online documentation |

### WebSearch (Web Search)

| Property | Description |
|----------|-------------|
| **Function** | Search the internet and return results |
| **Risk Level** | Low |
| **Requires Confirmation** | No |
| **Usage Scenario** | Query real-time information, search documentation |

## Agent Collaboration

### SpawnAgent (Spawn Sub-Agent)

| Property | Description |
|----------|-------------|
| **Function** | Create sub-agents to process tasks in parallel |
| **Risk Level** | Medium |
| **Requires Confirmation** | Yes by default |
| **Usage Scenario** | Complex task decomposition, parallel processing |

### Handoff (Handoff Task)

| Property | Description |
|----------|-------------|
| **Function** | Hand over the current task to another agent |
| **Risk Level** | Medium |
| **Requires Confirmation** | Yes by default |
| **Usage Scenario** | Cross-domain task transfer |

### RequestHelp (Request Help)

| Property | Description |
|----------|-------------|
| **Function** | Agent requests help or confirmation from the user |
| **Risk Level** | Low |
| **Requires Confirmation** | No |
| **Usage Scenario** | Escalate to user when encountering uncertain situations |

## Knowledge & Memory

### RecallConversation (Recall Conversation)

| Property | Description |
|----------|-------------|
| **Function** | Retrieve historical conversation records |
| **Risk Level** | Low |
| **Requires Confirmation** | No |
| **Usage Scenario** | Review previous discussions |

### Skill (Invoke Skill)

| Property | Description |
|----------|-------------|
| **Function** | Invoke installed skill packs |
| **Risk Level** | Depends on skill |
| **Requires Confirmation** | Depends on skill configuration |
| **Usage Scenario** | Execute professional tasks in specific domains |

## MCP Integration

### MCPListResources / MCPReadResource

| Property | Description |
|----------|-------------|
| **Function** | List and read resources provided by MCP servers |
| **Risk Level** | Low |
| **Requires Confirmation** | No |

### MCPListPrompts / MCPGetPrompt

| Property | Description |
|----------|-------------|
| **Function** | List and get prompt templates provided by MCP servers |
| **Risk Level** | Low |
| **Requires Confirmation** | No |

## Work Management

### ManageWorkDirs (Manage Work Directories)

| Property | Description |
|----------|-------------|
| **Function** | Manage agent work directory configuration |
| **Risk Level** | Low |
| **Requires Confirmation** | No |
| **Usage Scenario** | Set root directory for file operations |

### Schedule (Create Scheduled Task)

| Property | Description |
|----------|-------------|
| **Function** | Create tasks that execute on a schedule |
| **Risk Level** | Medium |
| **Requires Confirmation** | Yes |
| **Usage Scenario** | Set reminders, periodic data checks |
