---
title: Meeting Assistant
description: Use the meeting assistant to prepare agendas, organize minutes, extract to-dos and follow-up checklists.
keywords: [Meeting Assistant, Meeting Minutes, Agenda, Action Items, Efficiency]
---

# Meeting Assistant

## Real Workflow

The real value of a meeting assistant isn't expanding a few sentences into minutes—it's completing the information loop before and after the meeting.

| Dimension | Real Situation |
|-----------|----------------|
| Trigger Point | Launch coordination meeting, requirement review, project retrospective, client meeting—any meeting needing pre-meeting preparation and post-meeting tracking |
| Existing Materials | Meeting objectives, attendee roles, topics, handwritten notes, audio transcription, decisions made during meeting |
| Pain Point | Pre-meeting topics not organized; post-meeting decisions and to-dos mixed together; responsible persons and deadlines easily missed |
| DesireCore Intervention | Pre-meeting: generate agenda and items to be decided; post-meeting: organize minutes, to-do list and follow-up checklist |
| Acceptance Result | Host gets a minutes document ready to send to attendees, plus a task list that can be synced to project management tools |

## Complete Conversation Example

```
You: There's a product launch coordination meeting tomorrow afternoon. Attendees include the product manager, development lead,
    test manager, and operations manager. We'll mainly discuss launch timing and grayscale plan.
    Help me prepare an agenda.

AI Assistant: Okay, here is the draft meeting agenda:

        Product Launch Coordination Meeting
        Time: Tomorrow 14:00-15:30
        Location: [To be confirmed]

        Agenda:
        14:00-14:10  Opening: Project progress overview (Product Manager)
        14:10-14:30  Development completion status and outstanding issues (Development Lead)
        14:30-14:50  Testing progress and quality report (Test Manager)
        14:50-15:10  Launch plan and grayscale strategy (Operations Manager)
        15:10-15:25  Discussion: Confirm launch time and rollback plan
        15:25-15:30  Summary: Clarify action items for all parties and deadlines

        Items to be decided:
        1. Launch time choice (Friday afternoon or next Monday morning)
        2. Grayscale proportion (10% → 50% → 100%)
        3. Rollback trigger conditions

        Need any adjustments?

You: The agenda looks good. The meeting is over. I'll send you my notes to help organize the minutes.
    "Decided to launch next Monday. Start with 10% grayscale, observe for 2 hours, if no issues expand to 50%,
    full rollout the next day. Development still has 2 P1 bugs to fix by Friday,
    Testing will work overtime on the weekend for regression. Operations prepare rollback script, complete by Sunday."

AI Assistant: Meeting minutes have been organized:

        Meeting Minutes
        Meeting Topic: Product Launch Coordination Meeting
        Date: [Today's date]

        I. Decisions
        1. Launch time: Next Monday morning
        2. Grayscale strategy: 10% → observe 2 hours → 50% → 100% next day
        3. Rollback plan: Operations prepare automatic rollback script

        II. Action Items
        | Item | Responsible | Deadline |
        |------|--------|---------|
        | Fix 2 P1 Bugs | Development Lead | Friday |
        | Regression Testing | Test Manager | Weekend |
        | Prepare Rollback Script | Operations Manager | Sunday |

        III. Next Follow-up
        Final confirmation before launch at 9:00 Monday morning

        Can this be sent directly to attendees?
```

## Key Steps

1. **Pre-Meeting Goal Alignment** — Clarify what the meeting should produce: decisions, proposal review, risk sync or task assignment
2. **Carry Previous Action Items** — Include last meeting's action items, open issues and new topics in the agenda
3. **Distinguish Facts from Decisions** — In notes, separate discussion content, confirmed decisions, unconfirmed questions and risks
4. **Structure Action Items** — Each to-do needs task, sole responsible person, deadline, completion criteria and dependencies
5. **Post-Meeting Follow-Up Queue** — Minutes aren't just for sending; sync action items to project tools or next meeting agenda

## Final Deliverable

A clearly structured meeting minutes draft containing decisions, to-do checklist, responsible persons, deadlines, completion criteria and next follow-up arrangements. Can be further converted to email format, Feishu announcement or project task list.

:::tip Best Practices
- Meeting notes don't need to record every word, but key decisions, responsible persons and deadlines should be as clear as possible
- If you have meeting audio transcription, paste it directly to the agent for better results
- Minutes format can be remembered by the agent (e.g., "always list to-dos in a table"), so no need to repeat instructions next time
- Meeting action items without a sole responsible person and completion criteria easily become "everyone knows but nobody pushes forward" items
:::