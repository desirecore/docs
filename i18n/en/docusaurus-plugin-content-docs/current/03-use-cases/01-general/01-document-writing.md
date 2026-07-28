---
title: Document Writing
description: Use the AI Copywriter agent to organize ideas, generate outlines, draft project reports and proposal documents.
keywords: [Document Writing, AI Copywriter, Reports, Writing Assistant, Content Creation]
---

# Document Writing

## Real Workflow

This scenario doesn't work by "letting AI write a report from scratch"—it requires the user to already have a batch of scattered but real materials that need to be organized into deliverable documents.

| Dimension | Real Situation |
|-----------|----------------|
| Trigger Point | Project review, client report, quarterly summary, proposal review requiring formal materials |
| Existing Materials | Project background, key data, meeting minutes, chat conclusions, existing PPTs or spreadsheets |
| Pain Point | Information scattered, structure undecided, tone and audience unclear, repeated format changes time-consuming |
| DesireCore Intervention | AI Copywriter first organizes outline, then generates drafts by chapter; data or charts can be delegated to Data Analyst when needed |
| Acceptance Result | Person in charge receives a reviewable document draft, then supplements facts, sets conclusions, adjusts tone |

## Recommended Agent

**AI Copywriter** — Suitable for reports, proposals, announcements, marketing copy and other text tasks; generates drafts according to your specified audience, tone and template.

## Complete Conversation Example

```
You: I need to write a Q4 project summary report. The project is "Customer Management System Upgrade",
    mainly completed refactoring of three modules, performance improved by 40%, delivered 2 weeks ahead of schedule.

AI Copywriter: Okay, let me help you plan the structure of this report. Based on the information you provided,
        I suggest the following outline:

        I. Project Overview
        - Project background and objectives
        - Key metrics (40% performance improvement, 2 weeks early)

        II. Completed Work
        - Module A refactoring: specific improvements
        - Module B refactoring: specific improvements
        - Module C refactoring: specific improvements

        III. Key Achievements
        - Performance data comparison (before vs. after refactoring)
        - Delivery timeline analysis

        IV. Lessons Learned
        - What went well
        - Areas for improvement

        V. Next Steps

        Does this structure work for you? Which parts need adjustment?

You: The outline looks good. Please help me expand the "Completed Work" section,
    the three modules are User Management, Order System, and Data Reports.

AI Copywriter: Okay, here is the draft for the "Completed Work" section:

        II. Completed Work

        2.1 User Management Module Refactoring
        This refactoring migrated the user management module from monolithic architecture to microservices architecture.
        Main improvements include:
        - User query interface response time reduced from 800ms to 200ms
        - Supports paginated retrieval for million-level user data
        - Added user tag system for refined operations
        ...

        Should I continue with the other modules?

You: Well written, but make the tone more formal and add specific data metrics.

AI Copywriter: Adjusted to a more formal business style and added quantitative metrics...
```

## Key Steps

1. **Define Deliverable Audience** — First clarify who the document is for: client, boss, review committee, archiving system; different audiences mean different structure and tone
2. **Organize Fact Package** — List project scope, deliverables, timeline, budget, key data, outstanding issues and lessons learned
3. **Review Structure Before Writing** — Confirm chapters cover background, completed work, result comparison, issues and next steps before expanding each section
4. **Complete Evidence Chain** — For each conclusion, add data, screenshots, links or sources to avoid just having nice words
5. **Generate Versions by Use Case** — The same materials can generate formal reports, summary briefs, email versions or archive versions

## Final Deliverable

A complete, well-structured document draft with traceable factual basis, chapter logic and reusable versions. You can continue having the AI Copywriter supplement data, adjust tone, compress length or create presentation versions.

## DesireCore Capabilities Used

- **Super Document**: View AI modifications in Diff format, accept, reject or continue editing each change individually
- **Natural Language Teaching**: Teach report templates, word prohibitions, writing styles to the AI Copywriter for future reuse
- **Multi-Agent Collaboration**: Data, charts, legal clauses etc. can be delegated to corresponding agents first, then integrated by AI Copywriter

:::tip Best Practices
- Provide background information, data, timeline and key people in your first communication; minimize having the agent fill in assumptions
- When dissatisfied with a paragraph, point out specific issues like "tone too casual", "lacks data support", "this section doesn't match facts"
- For charts, data conclusions or contract clauses, let corresponding agents process them first in Super Document mode, then have AI Copywriter integrate into the report
- Project summary documents should not just list "what was done"—also include whether scope was completed, timeline/budget deviations, outstanding issues and lessons learned
:::