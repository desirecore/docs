---
title: Product Manager
description: Use the Product Manager agent to complete requirement document writing, iteration management, resource coordination, and risk control.
keywords: [Product Manager, Requirements Document, Iteration Management, Sprint, Project Management]
---

# Product Manager

## Scenario Description

You're managing a product's iterative development. This week you need to write requirement documents, track Sprint progress, coordinate next week's resource allocation, and prepare a cross-departmental launch coordination meeting. None of these tasks are difficult individually, but together they leave you overwhelmed.

The Product Manager agent can assist you with these daily tasks: writing structured requirement documents, tracking Sprint progress in real-time, reasonably allocating development resources, and identifying project risks.

## Recommended Agent

**Product Manager** -- Specializes in project management and coordination, excelling in progress tracking, resource allocation, risk control, and team coordination.

## Teaching First: Setting Your Product Workflow

> Every team has its own iteration process and documentation standards. Teach your standards once, and every PRD and schedule it produces will be ready to use without constant format adjustments.

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

1. **Check Iteration Progress** -- Ask about current Sprint completion and risks at any time
2. **Write Requirements Documents** -- Provide feature descriptions, the agent generates structured PRD
3. **Resource Scheduling** -- Analyze multi-project resource conflicts and provide allocation suggestions
4. **Risk Management** -- Automatically identify project risks and propose countermeasures

## Final Deliverable

Efficient iteration management support, including progress reports, requirements documents, resource allocation plans, and risk alerts.

:::tip Best Practices
- Have the agent generate progress summaries before daily stand-ups to quickly understand team status
- When writing requirements documents, first describe business scenarios and user pain points, and the agent will automatically break them down into user stories and acceptance criteria
- When multiple projects run in parallel, have the agent analyze resource conflicts and recommend optimal allocation plans
- **Generate PRDs in parallel**: During quarterly planning with multiple feature requests, tell the Product Manager agent about all of them at once — it will generate PRD drafts for each feature in parallel, all using the template and standards you taught it
:::
