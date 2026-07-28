---
title: "Use Cases"
description: "Understand DesireCore's common use cases, input materials, and deliverables by real workflow"
keywords: [Use Cases, Scenarios, DesireCore, AI Agent]
slug: /use-cases
sidebar_position: 0
---

# Use Cases

This chapter doesn't introduce DesireCore by feature buttons, but organizes by real workflows: why a task occurs, what materials users already have, where the original process gets stuck, which steps the agent takes over, and what result counts as complete.

If a page just says "AI helps you write documents, analyze data, handle emails," that's not yet a real scenario. A real scenario must answer: at what work node does this happen? Where do upstream materials come from? Who receives the deliverable? Which steps are most time-consuming? Which results need human confirmation?

---

## Scenario Categories

| Category | Description | Included Scenarios |
|------|------|---------|
| [General Scenarios](./01-general/01-document-writing.md) | Daily office work and information processing, suitable for individuals or small teams to get started quickly | Document Writing, Data Analysis, Email Management, Meeting Assistant, Translation, Flowchart, Web Scraping |
| [Professional Scenarios](./02-professional/01-legal-advisor.md) | Auxiliary work requiring industry rules, team standards, or professional judgment | Contract Review, Code Development, Financial Audit, Product Management, Bidding, Real Estate Analysis, User Behavior Analysis |
| [Industry Solutions](./03-solutions/01-ai-copyright.md) | Long-process tasks completed by multiple agents collaborating | Software Copyright Materials, Bidding Collaboration, Enterprise Service Coordination |

## How to Choose a Scenario

| If you are | What you're dealing with | Recommended Entry |
|------------|--------------------------|-------------------|
| Project Manager / Product Manager | Writing PRDs, holding launch meetings, drawing business flows, tracking Sprint risks | [Document Writing](./01-general/01-document-writing.md), [Meeting Assistant](./01-general/04-meeting-assistant.md), [Flowchart Generation](./01-general/07-flowchart-agent.md), [Product Manager](./02-professional/04-product-manager.md) |
| Operations / Data Analyst | Explaining sales fluctuations, generating monthly reports, analyzing user churn | [Data Analysis](./01-general/02-data-analysis.md), [Data Analysis Reports](./01-general/06-data-analysis-agent.md), [Data Scientist](./02-professional/07-data-scientist.md) |
| Sales / Business / Bidding Lead | Handling client emails, writing proposals, interpreting tender documents, checking bidding materials | [Email Management](./01-general/03-email-management.md), [Document Writing](./01-general/01-document-writing.md), [Bidding Assistant](./02-professional/05-bidding-assistant.md), [AI Bidding](./03-solutions/02-ai-bidding.md) |
| Legal / Finance / Manager | Reviewing contract risks, auditing reimbursements, estimating budgets, coordinating cross-department tasks | [Legal Advisor](./02-professional/01-legal-advisor.md), [Finance Assistant](./02-professional/03-finance-assistant.md), [Enterprise Coordination](./03-solutions/03-enterprise-coordination.md) |
| Startup Team / Admin / IP Manager | Preparing software copyright materials, organizing product descriptions, completing screenshots and manuals | [AI Copyright Registration](./03-solutions/01-ai-copyright.md) |

## How to Read a Scenario

Each scenario follows the same workflow framework to understand:

| Dimension | What to Look For |
|-----------|------------------|
| Trigger Point | Why this task must be done now, e.g., regular meeting, approval, bidding deadline, monthly report cycle |
| Existing Materials | Real inputs users bring, e.g., spreadsheets, contracts, meeting notes, templates, policies, historical projects |
| Pain Point | Where the original process is time-consuming or error-prone, e.g., inconsistent metrics, scattered materials, multi-person coordination, format checking |
| Intervention Method | Which steps DesireCore connects to, not replacing the entire role |
| Acceptance Result | What's delivered at the end, who decides if it can proceed to the next step |

## DesireCore Capabilities in Use Cases

DesireCore isn't just a single chat assistant—it's an Agent OS that "teaches rules, breaks down tasks, enables multi-agent collaboration, solidifies workflows, ensures controllable execution, and accumulates assets." Use cases should be understood through these capabilities:

| Official Capability | How It Manifests in Scenarios | Typical Pages |
|---------------------|-------------------------------|---------------|
| Natural Language Teaching | Teach rules, templates, terminology, policies, and styles first; subsequent tasks follow the same standards | Document Writing, Translation Assistant, Legal Advisor, Finance Assistant, Bidding Assistant |
| Multi-Agent Collaboration | Split one task to different roles for parallel processing, then consolidate into a unified deliverable | AI Bidding, Enterprise Coordination, Data Analysis Reports |
| Workflow / SOP | Solidify repetitive processes into executable steps, suitable for weekly reports, inspections, bidding checks, compliance reviews | Data Analysis Reports, Web Scraping, Enterprise Coordination |
| Super Document | Document modifications are visible, controllable, and reversible; suitable for reports, tenders, contract review reports | Document Writing, AI Bidding, AI Copyright Registration |
| Email Center | Multi-email unified inbox, categorization and summaries, draft replies, confirmation before sending important emails | Email Management |
| Scheduled Inspection | Periodically check data sources or page changes, notify only when changes occur | Web Scraping, Data Analysis Reports |
| Code & Desktop Automation | Read/write local files, execute commands, operate GUI, screenshot recognition, save results to real workspace | Code Assistant, AI Copyright Registration, Web Scraping |
| Security Approval & Audit | Low-risk auto-execute, high-risk wait for confirmation, process traceable | Legal Advisor, Finance Assistant, Enterprise Coordination |

:::tip Usage Suggestion
First teach your agent fixed standards, such as report templates, terminology glossaries, expense policies, code standards, or bidding qualification libraries. The more repetitive rules appear, the more worthwhile it is to consolidate them in advance—subsequent tasks will be more stable.
:::