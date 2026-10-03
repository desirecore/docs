---
title: Tool System Overview
description: Learn about DesireCore's three-layer capability system - how built-in tools, MCP tools, and custom tools give agents rich execution capabilities.
keywords: [tool system, capability system, built-in tools, MCP, custom tools, tool permissions]
---

# Tool System Overview

Agents can accomplish tasks because they have **Tools**. Tools are the agent's "hands and feet" - conversation capabilities let agents understand your needs, while tools let them take action.

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

Throughout this process, you don't need to care which tool the agent used - it will automatically select the appropriate tool to complete the task.

## Three-Layer Capability System

DesireCore's tool system is divided into three layers, from inner to outer, with capabilities gradually expanding:

```
+-----------------------------------------------+
|         Layer 3: Custom Tools                 |
|         HTTP API / Local Scripts              |
|  +---------------------------------------+    |
|  |        Layer 2: MCP Tools             |    |
|  |      Provided by external MCP Server  |    |
|  |  +-------------------------------+   |    |
|  |  |      Layer 1: Built-in Tools  |   |    |
|  |  |   Built into DesireCore       |   |    |
|  |  |   File ops / Search / Commands|   |    |
|  |  +-------------------------------+   |    |
|  +---------------------------------------+    |
+-----------------------------------------------+
```

### Layer 1: Built-in Tools

Basic capabilities built into DesireCore, ready to use out of the box without additional configuration. They include file read/write, directory browsing, content search, command execution, web fetching, user questions, agent collaboration, workflows, and scheduling.

Whether a tool enters the agent context depends on the current platform, permissions, and runtime environment. For example, PowerShell is only registered on Windows; when a tool is unavailable, its capability declaration is not injected into the agent context.

### Preparing tools when needed

The agent inspects and loads tools as the task requires. You usually do not need to do this manually.

1. Inspect the purpose and parameters of authorized tools.
2. Load the tools needed for this task.
3. After loading succeeds, call the tools to perform the work.

Finding documentation does not mean a tool is ready to call. Loading does not grant additional permission; platform and permission restrictions still apply.

### Layer 2: MCP Tools

Connect to external services through MCP (Model Context Protocol). MCP is an open standard that lets agents securely access third-party services like GitHub, file systems, databases, and Slack.

You can add different MCP servers as needed, greatly expanding the agent's capability range.

### Layer 3: Custom Tools

When built-in tools and MCP can't meet your needs, you can create custom tools for agents:

- **HTTP Tools** - Call your own API services
- **Script Tools** - Execute local scripts (run in sandbox environment)

## Tool Security System

Tool risk levels and approval rules describe which effects to inspect and when confirmation is required.

### Risk levels and approval

Risk levels describe impact. Whether confirmation is required also depends on the current approval mode and the operation.

| Level | What to inspect |
|---|---|
| Low | Read scope and whether the result fits the task |
| Medium | Written content, destination, and recovery options |
| High | External effects, irreversible outcomes, and execution scope |

External actions such as sending messages cannot be undone through local restoration. See [Tool and command approval modes](../11-security/05-ai-approval.md) for approval rules.

### Permission Hierarchy

Tool actual availability is determined by three layers of policies:

```
Global Policy (Agent default configuration)
    AND
User Policy (Your personalized configuration)
    AND
Session Policy (Current conversation permission mode)
    -------------
    = Final available tool set
```

You can configure the following:

| Configuration | Description |
|---------------|-------------|
| Disable specific tools | Add to blacklist, agent will never use |
| Force confirm specific tools | Must click confirm every use |
| Set call limit | Maximum daily calls, prevent accidental consumption |
| Restrict access paths | Only allow tools to operate specific directories |

An agent's `agent.json` can also restrict tool scope for that single agent through `tool_permissions.allowed` or `tool_permissions.denied`.

### Usage Records

Every tool call has complete records, where you can view:

- Call time and parameters
- Execution results
- Statistics by tool type and time period

:::tip Smart Expansion
When an agent finds it lacks tools needed to complete a task, it will proactively request expansion from you, explaining what tool is needed, why, and what the risks are. Only after your confirmation will the agent gain new capabilities.
:::
