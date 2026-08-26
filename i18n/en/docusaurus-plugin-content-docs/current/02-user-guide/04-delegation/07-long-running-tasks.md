---
title: Long-running tasks
description: Use the Global Task Board to track builds, training runs, batch processing, and long research tasks, then resume from saved progress after an interruption.
keywords: [long-running tasks, background tasks, global task board, task manager, staged progress, resume, builds, training, batch processing]
sidebar_position: 7
last-reviewed: 2026-08-26
---

# Long-running tasks

Some work simply takes time: analyzing hundreds of files, running a full build, training a model, solving a large schedule, or researching a subject across many sources. It may take half an hour or several hours.

For this kind of task, do not focus on choosing a very large wait time. Ask the agent to leave its progress in the working directory. If the network drops, the app restarts, or a step fails, the agent can inspect what already exists and continue from there.

## A prompt you can copy

Add this after your task description:

```text
This is a long-running task. Before starting, write a plan and divide the work into stages that can be checked independently.
After each stage, save the results in the working directory and update the progress record. Do not report a stage as complete only in chat.
If the task is interrupted or restarted, inspect the existing files first and continue after the last completed stage. Do not redo finished work.
Ask me before overwriting files, sending anything externally, publishing, or spending money.
```

This tells the agent how to divide the work, where progress must be recorded, how to resume, and which actions still need your approval.

If you use this pattern often, you can [teach it to the agent](../03-teaching/03-teach-rules.md) once instead of repeating it in every task.

## Put each stage on the Global Task Board

The task list inside a chat is useful while you remain in that conversation. When work spans several hours, multiple conversations, or several agents, put the stages on the Global Task Board. You can then see who owns each stage, what is blocked, and which results need your approval without searching old chats.

Add this to your request:

```text
Create or reuse a Global Task Board for this work.
Create one task for every stage that can be reviewed independently. Record the assignee, completion criteria, result files, and prerequisites.
Move a task to “In progress” when work starts. If work cannot continue, mark it “Blocked” and record the reason. When a stage is ready, move it to “Needs review” and wait for my acceptance before marking it “Completed.”
Update the board whenever the state changes instead of filling it in after all work is done.
```

A batch contract review might use these tasks:

| Task | Assignee | Completion criteria | Prerequisite |
|---|---|---|---|
| Count and validate input files | Contract agent | File count and failure list are saved | None |
| Extract contract text in batches | Document agent | Every contract has readable text or a failure reason | Input validation |
| Review risk clauses | Contract agent | Per-contract findings are saved in a table | Text extraction |
| Prepare and submit the report | Contract agent | Report and summary table are ready for review | Risk review |

Do not represent “analyze 300 contracts” as one enormous In progress task. Two hours later, that card still cannot tell you whether extraction is slow, review is blocked, or the report is already waiting for approval.

### Reading the Global Task Board

Open Global Task Board from the left navigation and switch to Task overview:

- All Tasks searches across tasks, scopes, states, priorities, and participating agents.
- By owner groups work by agent or team and shows totals, active work, blockers, review, and overdue counts.
- Needs attention collects work that has not started, is blocked, awaits agent review, awaits your acceptance, failed automatic handling, or needs manual takeover.

After selecting a board, open Current board. Use the board or list view and filter by state, assignee, priority, or due date. To understand why work cannot continue, inspect prerequisites, comments, and linked records rather than relying on a percentage.

For long-running work, check In progress, Blocked, and Needs review most often:

- In progress should have an assignee and a recent update.
- Blocked should explain what is missing and who can resolve it.
- Needs review means a stage result is ready for you. It does not mean the entire project is complete.

### Global Task Board and Task Manager serve different purposes

| Surface | What it records | Use it for |
|---|---|---|
| Chat task list | Key work items in the current conversation | A quick progress view while chatting |
| Global Task Board | Business stages, owners, blockers, and review across conversations and agents | “How far has the work progressed?” |
| Task Manager | Live Agent Runs, background commands, terminals, and internal hosts | “What is still running?” |
| Terminal panel | Complete output and interaction for one terminal | Detailed logs or further input |

Changing a Global Task Board item to Canceled or Failed updates the business record. It does not guarantee that the related command or Agent Run has stopped. To terminate execution, open Task Manager and use Stop on the corresponding entry. Use Force stop only when the program does not respond; unsaved output may be lost.

## What to include in the task

Give the agent enough information to answer these questions:

| What to specify | Example |
|---|---|
| What should the final result be? | “Produce an analysis report and a cleaned data table.” |
| Where are the inputs? | “The original files are in `input/`. Do not modify them.” |
| What counts as complete? | “All 300 files have a result, and failed files have a recorded reason.” |
| Where should intermediate results go? | “Put working files in `work/` and final results in `output/`.” |
| Which actions require approval? | “Do not send email, publish, or overwrite original files.” |

For example:

```text
Analyze every contract in the input directory. Produce a risk summary table and a Markdown report.
Do not modify the original files. Extract the text first, review the contracts one by one, and then create the summary.
Save results and update progress after each batch. If one contract fails, record the reason and continue with the others.
```

If the scope is still unclear, ask the agent to stop after planning:

```text
Do not execute yet. Count the files, estimate the steps and risks, and show me the plan first.
```

See [Plan confirmation](./02-plan-confirmation.md) for where plans are stored and how to revise them.

## Commands that take a long time

Builds, tests, training jobs, data conversion, and solver runs can occupy a terminal for a long time. Instead of leaving the agent blocked in a short foreground wait, say:

```text
This command may take a long time. Start it as a managed background task.
Tell me the task name, where its output is saved, and how I can inspect or stop it later.
Do not give it a short execution limit.
```

Background execution does not mean giving up control. You can inspect the task and its output in Task Manager or the terminal panel, and you can ask the agent to stop it.

Commands that require administrator privileges are an exception. Someone must be present to approve the operating-system prompt, so these commands cannot run as unattended managed background tasks. Ask the agent to prefer a user-level install or write location, and run the small privileged step in the foreground only when it is unavoidable.

To stop safely, say:

```text
Stop the background task, but keep its output and progress records. Do not delete intermediate results.
```

DesireCore keeps the output produced by a managed process. It cannot always undo work already accepted by an external service. For example, stopping a local wait may not cancel a cloud training job that has already been submitted. Ask the agent to explain the cancellation method before starting such work.

## Checking progress

You do not need to keep refreshing the chat. Ask:

```text
Which stage are you working on now?
Where is the result from the previous stage?
What remains, and is anything blocked?
```

Look for concrete evidence:

- the plan or task list has been updated;
- stage results exist in the working directory;
- the background process is still running and producing useful status;
- failed items have recorded reasons instead of being hidden behind a vague percentage.

See [Execution monitoring](./03-execution-monitoring.md) for the progress panel and pause/resume controls.

For business-stage progress, check Global Task Board first. To confirm whether an Agent Run or background command is still alive, how long it has run, or whether it is producing output, open Task Manager. Task Manager also shows CPU, memory, process count, output rate, and recent output. “Not sampled” does not mean zero.

Stop asks the task to finish cleanly. Use Force stop only if it does not respond. A background command can open its log or working folder, an Agent Run can open its run record, and an interactive terminal can return to the terminal panel.

## Resuming after an interruption

After reopening a conversation, give the agent a recovery order instead of saying only “continue”:

```text
Continue the previous task. Read the plan, progress record, and existing results first, then identify the last completed stage.
Continue with the next stage. Do not overwrite accepted files or repeat completed external actions.
If the records are not sufficient to continue safely, tell me what is missing instead of guessing.
```

If a command may still be running in the background, ask the agent to check it before starting another copy. Duplicate training, publishing, or writes can be much worse than waiting a moment to verify.

If the Global Task Board still says In progress but Task Manager no longer has the related Run or command, ask the agent to inspect saved results and the termination reason before updating the board. If the board says Failed while a process is still running, decide whether to keep that process and stop it from Task Manager if necessary. Changing the task state alone is not process control.

When the conversation itself becomes long, use [`/compact`](../02-conversations/09-context-control.md). The visible history remains available while the agent works from a task summary and the most recent progress.

## What DesireCore handles automatically

DesireCore does not stop a healthy task merely because it has run for more than five minutes. It distinguishes slow work from a connection that has stopped responding:

- normal progress, streamed content, or status messages allow work to continue;
- a connection with no activity for a long time is handled as a network or service failure;
- managed background commands do not inherit the short default wait used for foreground commands;
- while a background command is running, DesireCore tries to prevent idle system sleep for a bounded safety period.

This does not override closing the laptop lid, manual sleep, shutdown, low battery, or device-management policy. For unattended work that will run for hours, connect the computer to power, leave DesireCore running, and make sure the machine will not be forced to sleep.

DesireCore also cannot infer what “one completed stage” means in your business. You still need to define which files must be saved, which model artifacts matter, or which external actions must not be repeated. Put those rules in the task or [teach them to the agent](../03-teaching/03-teach-rules.md).

## Long task, scheduled task, or heartbeat?

| Your need | Use |
|---|---|
| Start now and work until completion, even if it takes hours | A long-running task |
| Start tomorrow at 9:00, check every day, or run every Friday | A [scheduled task](../08-automation/03-scheduled-tasks.md) |
| Let the agent periodically review the current matter and contact you only when follow-up is worthwhile | A [heartbeat](../08-automation/01-heartbeat.md) |

“Analyze these 300 contracts now” is a long-running task. “Analyze the contracts added this week every Friday” and “Check every day for new high-risk contracts and notify me only when one appears” are scheduled tasks because both specify when to run. “Notify me only when one appears” is an output condition, not a different scheduling mechanism. Use a heartbeat when the agent should decide whether the current matter needs proactive follow-up, without a business instruction tied to a specific daily, weekly, or clock-based schedule.

## Common questions

### Will the task stop after five minutes?

No. Five minutes is not the total task limit. A task can still end because of a network failure, an unresponsive service, system sleep, missing permission, or your own stop request.

### Can I quit DesireCore?

It is safer to leave it running. Some managed commands can be recovered, but a complete task may also include model calls, file operations, and approval requests.

### The agent says it is done, but I cannot find the result

Ask for paths and verify the files:

```text
List the completed stages and the result file for each one. Verify that every file can be opened.
Do not count anything that exists only in chat as completed work.
```

### Will every failed task resume automatically?

No. DesireCore can preserve task state and output, but safe resumption depends on the business progress recorded by the agent. Payments, releases, messages, and submitted cloud jobs must be checked before retrying.
