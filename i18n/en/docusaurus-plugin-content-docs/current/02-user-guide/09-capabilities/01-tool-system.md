---
title: Tool System Overview
description: Learn about DesireCore's three-layer capability system—how built-in tools, MCP tools, and custom tools give agents rich execution capabilities.
keywords: [tool system, capability system, built-in tools, MCP, custom tools, tool permissions]
---

# Tool System Overview

Agents can accomplish tasks because they have **Tools**. Tools are the agent's "hands and feet"—conversation capabilities let agents understand your needs, while tools let them take action.

## What is a Tool

A tool is a capability unit for agents to execute specific operations. Each tool does one thing:

- "Read file" is a tool
- "Search web" is a tool
- "Send email" is also a tool

When you tell an agent "help me check the content of this document," the agent will:

1. Understand your intent
2. Select the "read file" tool from available tools
3. Call the tool to execute the operation
4. Tell you the result in natural language

Throughout this process, you don't need to care which tool the agent used—it will automatically select the appropriate tool to complete the task.

## Three-Layer Capability System

DesireCore's tool system is divided into three layers, from inner to outer, with capabilities gradually expanding:

```
┌───────────────────────────────────────────────┐
│         Layer 3: Custom Tools                 │
│         HTTP API / Local Scripts              │
│  ┌───────────────────────────────────────┐    │
│  │        Layer 2: MCP Tools             │    │
│  │      Provided by external MCP Server  │    │
│  │  ┌───────────────────────────────┐   │    │
│  │  │      Layer 1: Built-in Tools  │   │    │
│  │  │   Built into DesireCore       │   │    │
│  │  │   File ops / Search / Commands│   │    │
│  │  └───────────────────────────────┘   │    │
│  └───────────────────────────────────────┘    │
└───────────────────────────────────────────────┘
```

### Layer 1: Built-in Tools

Basic capabilities built into DesireCore, ready to use out of the box without additional configuration. Includes core functions like file read/write, directory browsing, content search, command execution, and web fetching.

These tools update with the client version, ensuring basic capabilities are always available.

### Layer 2: MCP Tools

Connect to external services through MCP (Model Context Protocol). MCP is an open standard that lets agents securely access third-party services like GitHub, file systems, databases, and Slack.

You can add different MCP servers as needed, greatly expanding the agent's capability range.

### Layer 3: Custom Tools

When built-in tools and MCP can't meet your needs, you can create custom tools for agents:

- **HTTP Tools** — Call your own API services
- **Script Tools** — Execute local scripts (run in sandbox environment)

## Tool Security System

When agents use tools, safety is always the first priority. Each tool has a clear risk level and confirmation rules:

### Risk Levels

| Level | Meaning | Typical Tools | Default Behavior |
|-------|---------|---------------|------------------|
| **Low Risk** | Read-only operations, no side effects | Read file, search content | Execute directly |
| **Medium Risk** | Write operations, but recoverable | Create file, send message | Confirm first use |
| **High Risk** | Irreversible operations or external impact | Delete file, execute command | Confirm every time |

### Permission Hierarchy

Tool actual availability is determined by three layers of policies:

```
Global Policy (Agent default configuration)
    ∩
User Policy (Your personalized configuration)
    ∩
Session Policy (Current conversation permission mode)
    ─────────────
    = Final available tool set
```

You can configure the following:

| Configuration | Description |
|---------------|-------------|
| Disable specific tools | Add to blacklist, agent will never use |
| Force confirm specific tools | Must click confirm every use |
| Set call limit | Maximum daily calls, prevent accidental consumption |
| Restrict access paths | Only allow tools to operate specific directories |

### Usage Records

Every tool call has complete records, where you can view:

- Call time and parameters
- Execution results
- Statistics by tool type and time period

:::tip Smart Expansion
When an agent finds it lacks tools needed to complete a task, it will proactively request expansion from you, explaining what tool is needed, why, and what the risks are. Only after your confirmation will the agent gain new capabilities.
:::
