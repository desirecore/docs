---
sidebar_position: 4
---

# FAQ

### Does DesireCore require internet access?

DesireCore uses a local-first architecture — all core data and Companion repositories are stored locally. However, AI inference requires cloud model API calls, so an internet connection is needed during use.

### Which operating systems are supported?

macOS, Windows, and Linux are supported, along with a Web version.

### Is my data safe?

All Companion data (memory, configuration, skills) is stored on your local filesystem and is never uploaded to third-party servers. AI conversation content is only sent to your configured model API provider.

### How do I add new tools to a Companion?

Integrate external tools via the MCP (Model Context Protocol). Configure them in the project's `.mcp.json` file.

### What are Receipts for?

Receipts record the complete evidence chain for every Companion execution. You can:
- See exactly what the Companion did
- Understand the reasoning behind each decision
- Roll back to a previous state if something goes wrong

### Having issues?

- Submit feedback on [GitHub Issues](https://github.com/desirecore/docs/issues)
- Read [Core Concepts](./core-concepts) for more technical details
