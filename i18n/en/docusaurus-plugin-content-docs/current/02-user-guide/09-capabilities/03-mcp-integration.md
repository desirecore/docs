---
title: MCP Server Integration
description: Learn about the MCP protocol and how to expand agent capabilities by adding MCP servers.
keywords: [MCP, Model Context Protocol, external services, server connection, capability expansion]
---

# MCP Server Integration

If built-in tools can't meet your needs, MCP (Model Context Protocol) lets agents securely access almost any external service.

## What is MCP

MCP is an open standard protocol that defines how AI applications communicate with external tools and data sources. You can think of it as a "universal socket" between agents and external services—whether the service is GitHub, Slack, a database, or your own API, as long as it provides an MCP interface, the agent can use it.

**Advantages of MCP:**

- **Standardization**: All MCP servers use a unified protocol, agents don't need to write specialized integration code for each service
- **Security**: Tool calls are controlled by the permission system, you can finely control what agents can do
- **Rich Ecosystem**: The community already has many ready-made MCP servers covering common scenarios like file systems, Git, databases, and communication tools

## Adding MCP Servers

1. Go to agent settings page
2. Find the **MCP Server Management** area
3. Click "Add Server"
4. Fill in connection information:

| Configuration | Description |
|---------------|-------------|
| **Server Name** | Give this service an easily identifiable name |
| **Connection Method** | stdio (local process) / HTTP / SSE (server-side push) |
| **Start Command or Endpoint** | Start command for local process, or URL for remote service |
| **Authentication Info** | If service requires authentication (API Key, etc.) |

5. Click "Connect" to test connection
6. After successful connection, tools provided by the server will automatically import into the tool list

:::tip Three Connection Methods
- **stdio**: Most commonly used. MCP Server starts as local process, communicates through standard input/output. Suitable for local tools.
- **HTTP**: Communicate with remote MCP Server through HTTP requests. Suitable for cloud services.
- **SSE**: Use Server-Sent Events, supports server-initiated push. Suitable for scenarios requiring real-time updates.
:::

## Managing MCP Tools

After connecting an MCP Server, tools it exposes appear in the agent's tool list. You can:

- **View Tool List** — See what tools each MCP Server provides
- **Enable/Disable Specific Tools** — Disable tools you don't need
- **View Tool Descriptions** — Understand each tool's function and parameters

MCP tools are named in the format `{server_name}__{tool_name}`, for example `filesystem__read_file` represents the read_file tool from the filesystem server.

## Common MCP Servers

Below are some commonly used MCP servers in the community, you can choose based on your needs:

### Files and Development

| Server | Function | Connection Method |
|--------|----------|-------------------|
| **Filesystem** | Secure file system access | stdio |
| **GitHub** | GitHub repository, Issue, PR management | stdio |
| **Git** | Local Git repository operations | stdio |

### Data and Storage

| Server | Function | Connection Method |
|--------|----------|-------------------|
| **SQLite** | SQLite database queries | stdio |
| **PostgreSQL** | PostgreSQL database operations | stdio |

### Communication and Collaboration

| Server | Function | Connection Method |
|--------|----------|-------------------|
| **Slack** | Slack message sending and receiving | stdio |
| **Google Drive** | Google Drive file access | stdio |

:::info Find More
The MCP ecosystem is rapidly developing. You can discover more available servers in the MCP official repository and community.
:::

## Connection Management

### Connection Status

On the MCP Server management page, you can see each server's connection status:

- **Connected** — Working normally
- **Connecting** — Establishing connection
- **Disconnected** — Connection broken, needs reconnection
- **Error** — Connection problem occurred

### Auto Reconnect

If an MCP Server connection accidentally disconnects (e.g., process crash), the system will automatically attempt to reconnect when the tool is needed next time. You can also manually click "Reconnect."

### Security Notes

- MCP Servers can access resources depending on their configuration and permissions you grant
- Only connect MCP Servers you trust
- For servers accessing sensitive data, recommend using the principle of least privilege
- Regularly check connected server list, remove connections no longer needed

:::warning Third-Party Servers
Before installing third-party MCP Servers, please confirm their source is reliable. MCP Servers running as local processes can theoretically access resources on your system. Recommend prioritizing servers widely validated by the community.
:::
