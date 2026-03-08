---
title: Frequently Asked Questions
description: The most common questions and answers about DesireCore, quickly resolving your confusion during use
keywords: [FAQ, frequently asked questions, help, troubleshooting, DesireCore]
sidebar_position: 0
---

# Frequently Asked Questions

Here you can find answers to the most common questions when using DesireCore. If your question is not listed here, feel free to contact us through feedback channels.

## Quick Answers

### Does DesireCore require an internet connection?

DesireCore uses a local-first architecture — core data and Companion (Agent) repositories are stored locally. However, AI inference requires calling cloud model APIs, so **an internet connection is required during use**. You can use it offline if only viewing history or browsing saved Companion information.

### Which operating systems are supported?

**macOS**, **Windows**, and **Linux** desktop platforms are supported. Web, Android, iOS, and HarmonyOS versions are under development.

### Is my data secure?

All Companion data (memory, configuration, skills) is stored in your local file system (under the `~/.desirecore/` directory) and will not be uploaded to third-party servers. AI conversation content is only sent to the model API provider you configure. API Keys are encrypted and stored through the system credential manager. See [Data and Privacy Issues](./05-data-privacy.md) for details.

### How do I add new tools to a Companion?

Access external tools through the MCP (Model Context Protocol). Simply add MCP server configuration in the Companion's settings, and the Companion will automatically discover and register available tools.

### Which AI models are supported?

DesireCore supports multiple model providers, including OpenAI, Anthropic (Claude), Google, DeepSeek, MiniMax, and others. You need to configure the API Key for each provider yourself. See [API Key and Connection Issues](./02-api-key.md) for details.

### What is the purpose of Receipts?

Receipts record the complete evidence chain of each Companion execution and are the core embodiment of DesireCore's auditability. Through receipts, you can: see what the Companion specifically did, understand the reasoning process, and verify operation results.

## Browse by Category

Have a specific issue? Go to the corresponding category for detailed answers:

| Category | Common Questions |
|------|---------|
| [Installation and Startup](./01-installation.md) | Installation failure, startup white screen, version updates |
| [API Key and Connection](./02-api-key.md) | Invalid key, connection timeout, model unavailable |
| [Conversation Issues](./03-conversations.md) | Message failure, slow replies, lost history |
| [Agent Issues](./04-agents.md) | Installation failure, reset Agent, memory issues |
| [Data and Privacy](./05-data-privacy.md) | Data storage location, backup methods, complete deletion |
| [Performance Issues](./06-performance.md) | Memory usage, response speed, optimization methods |
