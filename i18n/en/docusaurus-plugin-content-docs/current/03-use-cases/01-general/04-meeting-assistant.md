---
title: Meeting Assistant
description: Use the AI Assistant to complete agenda preparation before meetings and minutes organization, action item extraction after meetings.
keywords: [Meeting Assistant, Meeting Minutes, Agenda, Action Items, Efficiency]
---

# Meeting Assistant

## Scenario Description

You have an important project coordination meeting this afternoon and need to prepare an agenda. After the meeting, you also need to organize meeting minutes, extract everyone's action items, and send them to all attendees. These administrative tasks, while not difficult, are very time-consuming.

The AI Assistant can help you efficiently complete the before and after of meetings: generating structured agendas before the meeting, and organizing formal minutes from your notes or transcription after the meeting, automatically extracting action items assigned to specific responsible parties.

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

1. **Meeting Agenda Generation** -- Provide attendees and discussion topics, the agent generates a structured agenda
2. **Meeting Notes Organization** -- After the meeting, provide notes or transcription, the agent organizes into formal minutes
3. **Action Item Extraction** -- Automatically extract action items from minutes, assigning responsible persons and deadlines

## Final Deliverable

A formal meeting minutes document ready to be sent, including decisions, action items, and next follow-up arrangements.

:::tip Best Practices
- Meeting notes don't need to record every word, just key decisions and assignments, the agent will help organize into complete minutes
- If you have meeting recording transcription, paste it directly to the agent for better results
- You can have the agent remember your preferred minutes format (e.g., "always list action items in a table"), so you don't need to repeat instructions next time
:::
