---
title: Agent Permission Boundaries
description: How permissions work when agents collaborate -- every agent acts within its own ceiling, and accountability for overreach lies with the agent that acted
keywords: [permission, boundary, delegation, collaboration, security, accountability]
---

# Agent Permission Boundaries

## The rule in one sentence

**Every agent acts within its own permission ceiling. If something is done that shouldn't have been, accountability lies with the agent that performed the action -- not with whoever asked for it.**

## Why this rule is needed

Once companions start collaborating -- one asking another for help, adding a remark to a companion that is mid-task, or interrupting it -- an unavoidable question appears:

> Companion A asks companion B to do something. Whose permissions apply?

There are two possible answers. DesireCore chose the second.

### Option 1: the requester's permissions apply (not adopted)

The requested companion would be capped by whatever the requester is allowed to do -- permissions could only ever shrink as they are passed along.

It sounds safer, but it falls apart immediately in real use:

- **Specialization stops working.** Your "calendar assistant" has narrow permissions -- it can only read your calendar. When it asks the "writing companion" to draft meeting notes, capping the writer at the assistant's level means the writer cannot write files at all -- which is precisely the job you gave it.
- **Accountability becomes ambiguous.** Whether an operation is allowed would depend on *who asked*, not *who is doing it*. The same operation would be permitted when A asks and refused when B asks -- so you could no longer tell what a companion can do by looking at its configuration.
- **Permissions only shrink, eventually to nothing.** Across multiple hops (A asks B, B asks C), the ceiling narrows at every step until nothing is possible. You would be forced to over-provision every companion to compensate -- making the overall permission surface *larger*, not smaller.

### Option 2: the executor's own permissions apply (DesireCore's choice)

**Whoever acts is bound by their own ceiling.**

- When companion B receives a request from companion A, it still acts entirely within the permissions **you** granted **B**: what it can read, what it can write, which tools it may call -- determined solely by B's own configuration.
- A cannot make B exceed B's own ceiling by asking, because that ceiling is absolute.
- Conversely, A cannot expand its own reach by asking B. Whatever B does is recorded against B, and the results come back to A -- but **the execution happened inside B's boundary**.

## Accountability for overreach lies with the executor

The other half of the rule matters just as much: **if a companion does something it shouldn't have, that is recorded against it.**

- Each companion's capability boundary lives in its own configuration (tool grants, file read/write scope, risk level) -- a configuration you set yourself.
- Every operation it performs enters **its own** receipts and audit trail. Reading one companion's receipts tells you everything it actually did; you never have to trace back "who told it to."
- Investigation therefore has a fixed path: **first identify which companion acted, then look at why its permission configuration allowed it.**

Put differently: a permission configuration is a **promise about that companion**, not a rule about who may command it. Adjusting a companion's permissions adjusts its behavioral ceiling in *every* situation -- whether the request came from you, from another companion, or from a scheduled job.

## Which situations this covers

The rule applies whenever one companion causes another to act:

| Situation | Description |
|-----------|-------------|
| **Delegating a task** | A hands work to B |
| **Sending a message** | A messages B, and B starts a turn to handle it |
| **Interjecting** | B is busy; A adds a remark into B's current turn |
| **Interrupting** | A aborts what B is currently doing |
| **Fan-out** | A sends the same work to several companions at once |

In every one of these, the acting party is bound by its own permissions.

## This does not weaken controllability

The rule is **not** a relaxation of limits -- it puts the limit in the right place:

- **Your grants remain the only source.** Companion permissions are configured only by you. Companions cannot grant permissions to each other, nor collaborate their way around your settings.
- **[Three-layer controllability](./three-layer-control) applies in full.** Regardless of whether a turn was started by you or by another companion, high-risk operations still hit the human gate, still produce receipts, and are still reversible.
- **Boundaries are easier to verify.** You only need to answer "what did I grant this companion," rather than simulating "what would its permissions become if some other companion invoked it."

If you don't want a companion to have a certain capability, the correct move is to **tighten that companion's own configuration** -- not to rely on other companions to gate it for you.

## A concrete example

Suppose you have two companions:

- **Calendar assistant**: can read your calendar; cannot write files
- **Writing companion**: can read and write under `~/Documents/`

When the calendar assistant asks the writing companion to "turn today's meeting into notes":

1. The writing companion acts under **its own** permissions -- it may write the notes file under `~/Documents/`;
2. It equally **cannot** exceed its own boundary -- it cannot touch `~/SystemConfig/`, even if the calendar assistant asks it to;
3. Writing the notes is recorded in the **writing companion's** receipts;
4. If you decide the writing companion shouldn't be able to write files at all, what you change is **the writing companion's configuration** -- not the calendar assistant's ability to ask.

## Next steps

- Want the full picture on safety? Read [Three-Layer Controllability](./three-layer-control)
- Want to understand how companions collaborate? Read [Delegation Model](./delegation-model)
- Want to know how work is routed to the right companion? Read [Task Orchestration](./task-orchestration)
