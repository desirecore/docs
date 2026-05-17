---
title: Intelligent Task Orchestration
description: Understand DesireCore's intelligent task orchestration engine — how it automatically parses intent, decomposes tasks, and matches the best agents.
keywords: [Task Orchestration, Intent Recognition, SOP, Workflow, Task Decomposition, Intelligent Scheduling]
---

# Intelligent Task Orchestration

## Your "Project Manager"

In a real team, you usually don't assign work to each person individually — there's a project manager. When a request comes in, the project manager breaks it into subtasks, figures out who's best suited for what, sequences the work, tracks progress, and finally delivers the consolidated result back to you.

DesireCore's **intelligent task orchestration engine** is your "project manager". When you raise a complex request, you don't need to figure out which agent should do what — the orchestration engine handles the entire process from "a one-sentence request" to "multiple agents collaboratively delivering results".

You focus on stating the need; the engine handles breaking down work, dispatching it, tracking it, and collecting it.

## What the Orchestration Engine Does

The orchestration engine works in three core steps: **intent recognition → task decomposition → capability matching**. These three steps interlock and complete automatically the moment you make a request.

### Intent Recognition

The first thing the orchestration engine does with everything you say is judge: "What kind of thing does this person want me to do?"

Different intents flow through different processing channels. The engine distinguishes three core intent types:

| What you say | Recognized as | Handling |
|---|---|---|
| "From now on, use a formal tone in emails" | Teaching | Write to rules, no orchestration needed |
| "Help me write a weekly report" | Single-task delegation | Assign directly to the best-suited agent |
| "Help me prepare next week's client proposal — needs market analysis, competitor comparison, and the proposal write-up" | Complex orchestration | Decompose into subtasks, assign to multiple agents |

The first two are relatively simple: teaching flows through the teaching channel, and single tasks are delegated directly to the most appropriate agent. The orchestration engine truly shines in the third case — when a request needs multiple steps, multiple capabilities, or even multiple agents working together.

### Task Decomposition

Faced with a complex request, the orchestration engine thinks like a seasoned project manager, splitting the big task into independently executable subtasks.

Take "help me prepare next week's client proposal" as an example. The engine reasons like this:

1. **Decompose subtasks**: market trend analysis, competitor data collection, competitor strengths/weaknesses comparison, proposal framework, proposal write-up, final formatting
2. **Analyze dependencies**: competitor comparison depends on the results of competitor data collection; the proposal write-up depends on conclusions from market analysis and competitor comparison
3. **Determine execution order**: market analysis and competitor data collection can run **in parallel** (they don't depend on each other); competitor comparison must wait for data collection to finish (**serial**); the proposal write-up waits for all upstream analyses to complete

This automatic parallel/serial judgment minimizes total elapsed time — anything that can run simultaneously never has to queue.

### Automatic Capability Matching

Subtasks are decomposed; now the question is "who does what". The orchestration engine evaluates each agent on several dimensions:

- **Skill tags**: What is this agent good at? Does it have a market analysis skill pack?
- **Historical performance**: How well has it done on similar tasks in the past? Is the rework rate high?
- **Current load**: Is it currently busy with other tasks?

The engine combines these factors and automatically matches the best executor for each subtask. You don't need to remember every agent's capabilities — the engine knows better than you who fits what.

Continuing the client proposal example:

| Subtask | Matched agent | Why |
|---|---|---|
| Market trend analysis | Market Research Assistant | Has data retrieval and industry analysis skills |
| Competitor data collection | Market Research Assistant | Same as above, runs in parallel with the previous task |
| Competitor strengths/weaknesses | Business Analyst | Specializes in structured comparison and SWOT analysis |
| Proposal write-up | Copywriting Expert | High writing quality, low historical rework rate |
| Final formatting | Document Assistant | Expert in format conventions and visual layout |

If an agent is currently handling other tasks, the engine automatically picks the second-best option rather than letting subtasks wait idle.

## Two Execution Modes

The orchestration engine supports two fundamentally different execution modes, suited to different scenarios.

### Hardened Mode: SOP and Workflow

Picture a factory assembly line: what each station does, which tools are used, how long each step takes — it's all written in the operations manual. No matter who works today, the process is identical.

Hardened mode is that kind of "assembly line". You (or your team) predefine every step's operation, and the orchestration engine executes strictly according to the preset flow. Each step can be designated as a [hardened step, flexible step, or human gate](./step-types) to ensure the process is both efficient and controllable.

**When to use**:
- Business processes with high compliance requirements that need auditability
- Standardized tasks executed repeatedly (e.g., weekly report generation, customer onboarding)
- Scenarios where team collaboration requires unified standards

The biggest strength of hardened mode is being **predictable, auditable, and repeatable**.

### Flexible Mode: AI-Driven Orchestration

But not every task can have its flowchart drawn in advance. When you say "help me research what our competitors have been up to lately", even you may not know how many steps it'll take or which data sources are involved.

In flexible mode, the orchestration engine lets agents dynamically plan execution paths based on the current context. It might first search public information, discover that a competitor just released a new product, and then add a "product analysis" subtask — all decided dynamically during execution.

**When to use**:
- Exploratory and research-oriented tasks
- Creative work (e.g., brainstorming, copywriting)
- Tasks where information is incomplete and adjustments need to happen along the way

The biggest strength of flexible mode is being **adaptive and able to handle uncertainty**.

:::tip The two modes can be mixed
Within a single orchestration task, some subtasks can use hardened mode (e.g., data collection) while others use flexible mode (e.g., creative writing). The orchestration engine automatically picks the appropriate mode based on each subtask's characteristics.
:::

## End-to-End Status Tracking

A good project manager doesn't hand off work and walk away. The orchestration engine tracks the status of every subtask throughout and responds automatically when things go wrong:

| Situation | System behavior |
|---|---|
| Subtask completes normally | Update progress, trigger downstream tasks |
| Subtask times out | Notify you automatically; choose to wait or reassign |
| Subtask fails | Automatically attempt to reassign to another capability-matched agent |
| All subtasks complete | Consolidate receipts and deliver together |

You can check overall progress at any time: which subtasks are done, which are in progress, and which are still queued. When all subtasks finish, the orchestration engine consolidates everyone's output and delivers a complete receipt — you see the final result, not scattered fragments.

If a subtask hits trouble midway (say, an agent is taking too long), the engine doesn't let the whole chain stall. It notifies you with options: you can wait, or have it reassigned to another agent. Critical tasks won't collapse just because one link had a hiccup.

After the whole process finishes, the consolidated receipt the engine produces includes not just the final result but also each subtask's execution time, executor, and step-type statistics — giving you a complete picture of the orchestration at a glance. Accumulated over time, this data also helps you find links that can be further optimized, making the next orchestration faster and more stable.

## Next Steps

- Want to understand step controllability? Read [Hardened/Flexible/Human Gate](./step-types)
- Want to understand how multiple agents collaborate? Read [Cross-Agent Collaboration](../02-user-guide/04-delegation/06-cross-agent.md) in the user guide
- Want to understand the task receipt system? Read [Receipt System](./receipt-system)
