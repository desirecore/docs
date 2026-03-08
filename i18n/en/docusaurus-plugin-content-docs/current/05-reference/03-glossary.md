---
title: Glossary
description: Complete definitions of DesireCore core terms, sorted alphabetically
keywords: [terms, glossary, definitions, Glossary]
---

# Glossary

This glossary contains core concepts and proprietary terms in DesireCore, arranged alphabetically.

## A

### AgentFS (Agent File System)
DesireCore's file system layer where each agent is an AgentFS repository. Contains all agent data including identity, persona, rules, skills, and memories, stored as files and version-controlled via Git.

### Agent
The core entity in DesireCore—a cultivatable, delegatable, and governable digital companion. Not just a chatbot, but an anthropomorphic assistant that accepts delegation, executes tasks, and delivers receipts.

### ASR (Automatic Speech Recognition)
The technology for converting speech to text. DesireCore supports voice input through ASR models from multiple providers.

### Assign (Task Assignment)
A core interaction action beyond the Six Primitives, where users delegate specific tasks to agents. Unlike traditional "questioning," "assigning tasks" means the agent needs to fully plan, execute, and deliver results.

## B

### BYOK (Bring Your Own Key)
"Bring Your Own Key" mode. Users use their own AI provider API keys; DesireCore does not act as an intermediary, and fees are settled directly between the provider and the user.

## C

### Clarify (Ask)
One of the Six Primitives. The agent proactively asks the user when information is incomplete, filling in key conditions required for the task. Good agents confirm before acting, rather than guessing.

### Companion
Short for Digital Companion. Another term DesireCore uses for agents, emphasizing their trait of "long-term companionship and continuous growth."

### Compute
The computing resources required for AI model operation. In DesireCore, compute is configured by users themselves through BYOK mode, supporting multiple providers and model types.

### Confirm
The user's approval action for agent operations. In human gate steps, the agent pauses execution and waits for user confirmation before continuing.

### Controllable
The second layer of Three-Layer Controllability. Users can intervene, confirm, or block agent behavior at any time, precisely controlling autonomy through permission levels (allow/ask/deny).

### Core Memory
The agent's core identity information and long-term knowledge, stored in the `memory/` directory of AgentFS. Includes role definitions, professional knowledge, and other infrequently changing information.

## D

### Delegation
DesireCore's core interaction paradigm. Not "I ask, you answer," but "I teach you to do." Users delegate tasks to agents, who autonomously plan and execute, ultimately delivering results and receipts.

### Demonstrate (Show/Give Examples)
One of the Six Primitives. Users help agents learn through imitation and induction by providing examples, counter-examples, or historical materials.

### Diff
A record of changes to files or content, with deletions marked in red and additions in green. In DesireCore, every agent modification is visualized as a Diff.

## E

### Embedding (Vectorization)
The process of converting text to numerical vectors for semantic search and similarity matching. DesireCore supports embedding models from multiple providers.

### Execute (Do)
One of the Six Primitives. After obtaining plan confirmation, the agent acts within allowed permissions and boundaries, invokes tools, and advances the task.

## F

### Feedback
User evaluation and correction of agent execution results. Positive feedback reinforces behavior; negative feedback triggers adjustment—an important signal for agent evolution.

### Flexible Step
One of three step types. Steps requiring AI model reasoning, generation, or induction, where the agent has autonomy within the behavioral guidelines framework.

### Forget
Actively deleting specific memories or learning outcomes of an agent. Users can make agents "forget" certain information, achieving memory manageability.

## H

### Hardened Step
One of three step types. Deterministic steps based on rules, decision trees, and fixed templates. Results are completely predictable and repeatable, without AI reasoning.

### Heartbeat
The agent's active monitoring mechanism. Agents can periodically check specific data sources or conditions, proactively notifying users or executing actions when trigger rules are met.

### Human Gate
One of three step types. Steps requiring user personal confirmation. Execution automatically pauses at this step, waiting for explicit user instruction before continuing.

## M

### MCP (Model Context Protocol)
Model Context Protocol. An open standard proposed by Anthropic that allows AI models to connect to external tools and data sources. DesireCore supports the MCP protocol to extend agent tool capabilities.

## P

### Persona
The agent's personality definition file (`persona.md`). Contains communication style, decision preferences, output specifications, etc.—the core definition of "who the agent is like." Not a "character setting copy," but executable behavioral specifications.

### Plan
One of the Six Primitives. The agent provides an execution plan, breaking down steps and marking risk points and areas requiring user confirmation.

### Principles
The agent's behavioral rules file (`principles.md`). Defines "must do," "never do," and "when to ask for confirmation" rules.

## R

### Receipt
A detailed record generated after an agent completes a task, containing input/output summaries, tool call lists, retrieval traces, step type statistics, and more. The evidence chain of "trustworthy delegation."

### Reflect
One of the Six Primitives. The agent submits receipts, reviews deviations, writes new experiences back to the behavior manual, and proposes improvement suggestions.

### Relational Memory
Records of interaction history and personalized information between users and agents. Stored in `users/<user_id>/agents/<agent_id>/memory/`.

### Reversible
The third layer of Three-Layer Controllability. Any operation can be undone or rolled back, including step-by-step rollback, turn-based rollback, and whole-session rollback.

## S

### Self-Evolution
The agent's ability to continuously learn and grow through interaction. Includes four modes: implicit learning, explicit teaching, reflection evolution, and collaborative evolution.

### Shared Memory
Team-shared knowledge and experiences that multiple users and agents can access together. Used for沉淀 team norms and best practices.

### Six Primitives
The six basic interaction primitives defined by DesireCore: Teach, Demonstrate, Clarify, Plan, Execute, Reflect.

### Skill
Specific capability modules learned by agents. Stored as folders in the `skills/` directory of AgentFS, containing instruction files (SKILL.md) and optional scripts, reference materials, etc.

### Super Document
DesireCore's collaborative writing feature. Based on a Markdown editor, supporting AI-assisted writing, Diff visualization, item-by-item review, and version history—like Code Review for documents.

## T

### Teach
One of the Six Primitives. Users tell agents how to do something, why to do it, and what exceptions apply. Teaching content is persisted as behavioral norms.

### Tool
External capabilities that agents can invoke. Includes built-in tools (file read/write, search, etc.), MCP tools, and custom tools. Unified registration and management through the Tool Registry.

### Tool Registry
A system for unified management of all tool registration, discovery, and invocation. Unifies built-in tools, MCP tools, and skill-defined tools to one management level.

### TTS (Text-to-Speech)
Text-to-Speech, the technology for converting text to voice.

## V

### Visible
The first layer of Three-Layer Controllability. All agent behavior is completely transparent to users, including real-time status, decision processes, modification content, and tool calls.

## W

### Workflow
A reusable execution unit that organizes multiple steps logically. Supports describing intent in natural language, with agents autonomously orchestrating (Vibe Workflow).
