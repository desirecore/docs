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
        - Integration testing depends on backend tasks, needs priority保障

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
:::
