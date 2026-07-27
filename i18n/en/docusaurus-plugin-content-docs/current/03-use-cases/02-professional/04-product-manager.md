---
title: Product Manager
description: Use the Product Manager agent to organize requirements, write PRDs, track iterations, and identify project risks.
keywords: [Product Manager, Requirements Document, Iteration Management, Sprint, Project Management]
---

# Product Manager

## Real Workflow

The Product Manager scenario is not "AI deciding product direction for you" — it's about organizing scattered requirements, progress, and risks into materials that the team can review and execute on.

| Dimension | Real Situation |
|-----------|----------------|
| Trigger Point | PRD review, Sprint planning meeting, pre-standup progress summary, launch coordination |
| Existing Materials | Requirements background, user feedback, PRD template, task lists, development progress, and blockers |
| Pain Point | User stories unclear, acceptance criteria vague, multiple projects competing for resources, risks discovered too late |
| DesireCore Intervention | Product Manager agent generates PRD drafts, breaks down acceptance criteria, summarizes progress, and flags resource conflicts |
| Acceptance Result | PM receives review-ready documents and risk lists, then confirms priorities, scheduling, and trade-offs |

## Recommended Agent

**Product Manager** — Suited for requirements documents, iteration planning, progress summaries, resource conflict analysis, and risk lists.

## Teaching First: Teaching the Agent Your Product Workflow

> Every team's iteration process and documentation standards are different. Teach your templates, priority definitions, and acceptance criteria first, and subsequent outputs will be more review-ready.

### Teach Rules

```
You: Let me teach you our team's product standards:
     [Upload PRD_Template_v3.docx]
     1. User story format: "As a [role], I want [feature], so that [value]" (mandatory)
     2. Priority definitions: P0 = must complete this iteration, P1 = try to complete, P2 = next iteration (mandatory)
     3. Iteration cadence: bi-weekly sprints, Monday planning meetings, Friday retrospectives (preference)
     4. Acceptance criteria: every requirement must have testable acceptance conditions — no vague descriptions like "improve experience" (mandatory)

Product Manager: 📝 New learning recorded
                  Source: PRD_Template_v3.docx + workflow notes
                  Type: Rule (Product workflow standards)
                  Level: Mandatory × 3, Preference × 1

                  My understanding:
                  Use the uploaded template format when writing PRDs. User stories
                  must follow the "As a... I want... so that..." pattern. Priorities
                  are split into P0/P1/P2 levels. Every requirement must include
                  testable acceptance criteria. Iterations follow a bi-weekly cadence.

                  [✓ Correct]  [✎ Modify]  [✗ Undo]

You: [✓ Correct]
```

Once teaching is complete, the Product Manager agent has learned your PRD standards and iteration workflow. From now on, just describe your requirements and it will produce standardized PRDs.

## Complete Conversation Example

```
You: How is Sprint-7 progressing?

Product Manager: Sprint-7 Progress Report

        Cycle: June 3 to June 14 (Day 6)
        Overall Progress: 85% (Time progress 60%, ahead of schedule)

        Task Completion Status
        - Completed: 18/24 (75%)
        - In Progress: 4
        - Not Started: 2

        Individual Progress
        Zhang San (Frontend): All completed 6/6
        Li Si (Backend): 4/5 in progress, remaining "Auth interface optimization"
        Wang Wu (Backend): 3/5 in progress, "Order module refactoring" estimated 2 days
        Zhao Liu (Testing): 4/6 completed, integration testing waiting for development completion

        Risk Warning
        - Order module refactoring progress slightly slow, suggest Zhang San assist Wang Wu
        - Integration testing depends on backend tasks, needs to be prioritized

        Estimated Completion Rate: 95%
        Suggestion: Move 1 low-priority task to next Sprint

You: Help me write a requirements document for the "User Tag System".

Product Manager: User Tag System -- Requirements Document

        I. Background
        The operations team needs to perform refined segmentation of users. Currently only manual
        filtering is possible, which is inefficient and cannot update in real-time...

        II. Core Features
        1. Tag creation and management
        2. Automatic tag rule engine
        3. User segment query
        4. Tag data dashboard

        III. User Stories
        As an operations staff, I want to be able to create custom tags and set
        automatic tagging rules for automated user segmentation...

        IV. Acceptance Criteria
        ...

        📋 Receipt Summary
        Rules applied: user story format · P0/P1/P2 priorities · acceptance criteria requirement
        Template used: PRD Template v3
        All from your teaching (last week) ✓
```

## Key Steps

1. **Define Problem and Goals** — Clarify user problems, business objectives, success metrics, and non-goals
2. **Break Down User Stories** — Decompose into user stories by role, behavior, and value — don't just pile up feature lists
3. **Define Acceptance Criteria** — Every requirement needs testable conditions, edge cases, and analytics/data requirements
4. **Sync Development Constraints** — Write dependent systems, resource conflicts, technical risks, and launch windows into the plan
5. **Track Iteration Risks** — Daily review of completed items, blockers, scope changes, and delay risks

## Final Deliverable

Progress reports, PRD drafts, user stories, acceptance criteria, resource allocation suggestions, and risk lists. Final scheduling should be confirmed based on actual team capacity and business priorities.

:::tip Best Practices
- Have the agent generate progress summaries before daily stand-ups to quickly see completed items, blockers, and pending decisions
- When writing requirements documents, first describe business scenarios and user pain points, and the agent will automatically decompose them into user stories and acceptance criteria
- When multiple projects run in parallel, have the agent analyze resource conflicts and recommend alternative allocation plans
- During quarterly planning with multiple feature requests, have the Product Manager agent generate PRD drafts for each feature in parallel, then conduct a unified priority review
- PRDs are not better when longer — the key is ensuring engineering, testing, design, and business have the same understanding of "done"
:::
