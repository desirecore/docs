---
title: Finance Assistant
description: Use the Finance Assistant agent to complete budget preparation, expense review, financial report generation, and cost analysis.
keywords: [Finance Assistant, Budget Preparation, Expense Review, Financial Reports, Cost Analysis]
---

# Finance Assistant

## Scenario Description

It's the end of the quarter, and you need to prepare the department budget for next quarter. You need to reference historical data, consider business growth plans, and reasonably allocate various expenses. At the same time, there's a pile of reimbursement documents waiting for review.

The Finance Assistant agent can help you scientifically prepare budgets based on historical data, intelligently review the compliance of reimbursement documents, generate standardized financial reports, and identify cost optimization opportunities.

## Recommended Agent

**Finance Assistant** -- Specializes in financial management, handling budget preparation, expense approval, report archiving, and cost analysis.

## Teaching First: Setting Your Financial Policies

> Every company has different reimbursement standards. Spend a few minutes teaching the Finance Assistant your company's policies, and it will review expense reports against your specific rules instead of generic standards.

### Teaching Rules

```
You: I'm sharing our company's expense reimbursement policy for you to learn.
     [Upload Company_Expense_Policy_2024.pdf]
     A few key points to note:
     1. Local transportation: Only accept e-receipts from ride-hailing apps, no paper taxi receipts (mandatory)
     2. Meals: Weekday limit $15/person, client entertainment limit $40/person (mandatory)
     3. Business travel accommodation: Tier-1 cities max $80/night, other cities max $55/night (mandatory)
     4. Over-limit expenses: Must include a written explanation and department manager approval (preference)

Finance Assistant: 📝 New learning recorded
                   Source: Company_Expense_Policy_2024.pdf + supplementary notes
                   Type: Rule (Expense reimbursement standards)
                   Level: Mandatory × 3, Preference × 1

                   My understanding:
                   When reviewing expense reports, only accept e-receipts from
                   ride-hailing apps for transportation; meals capped at $15/person
                   on weekdays, $40/person for client entertainment; accommodation
                   tiered by city (Tier-1 $80, others $55). Over-limit claims
                   require written justification with manager sign-off.

                   [✓ Correct]  [✎ Modify]  [✗ Undo]

You: [✓ Correct]
```

Once teaching is complete, the Finance Assistant has learned your company's reimbursement standards. You can now send expense reports directly for review.

## Complete Conversation Example

```
You: Help me prepare next quarter's budget for the sales department. Last quarter's total budget was 1.8M,
    actual expenditure was 1.82M. Next quarter's sales target is 20% growth,
    planning to hire 2 new salespeople.

Finance Assistant: Okay, let me prepare next quarter's budget.

        Historical Data Reference (Last Quarter)
        | Expense Category | Budget | Actual | Execution Rate |
        |---------|------|------|---------|
        | Personnel Costs | 800k | 780k | 97.5% |
        | Travel | 250k | 320k | 128% |
        | Business Entertainment | 150k | 180k | 120% |
        | Marketing | 500k | 450k | 90% |
        | Office Expenses | 100k | 90k | 90% |

        Next Quarter Budget Draft:

        1. Personnel Costs: 950k
           - Existing team: 780k
           - 2 new hires (2 months salary): 120k
           - Performance bonus: 50k

        2. Travel: 400k
           - Note: Last quarter exceeded budget by 28%, this quarter has 3 trade shows

        3. Business Entertainment: 200k
        4. Marketing: 600k (aligned with sales target growth)
        5. Office Expenses: 120k

        Total Budget: 2.27M (+24.7% QoQ)

        Risk Alert
        Travel expenses increased 60%, suggest setting monthly budget warning lines.

        Need me to generate a formal budget application form?

You: Can travel expenses be controlled at 350k? Also help me review these reimbursement forms.

Finance Assistant: Travel expenses adjusted to 350k. Reduction suggestions:
        - Replace some business trips with remote meetings, saving 30k
        - Choose economy hotels for trade shows, saving 20k

        Reimbursement Review Results:
        Approved 12 | Returned 2 | Rejected 1
        Detailed explanation...

        📋 Receipt Summary
        Rules applied: Meal limits · Accommodation standards · Transportation receipt requirements
        All from your teaching (last week) ✓
```

## Key Steps

1. **Provide Basic Information** -- Historical data, business plans, budget constraints
2. **Generate Budget Draft** -- The agent generates itemized budget based on data
3. **Adjust and Optimize** -- Adjust various amounts based on your feedback
4. **Expense Review** -- Batch review reimbursement documents, check compliance

## Final Deliverable

A data-driven scientific budget plan and compliance review report.

:::warning Disclaimer
The Finance Assistant's suggestions are for reference only and do not constitute professional financial or tax advice. For major financial decisions, consult a professional accountant.
:::

:::tip Best Practices
- Provide as complete historical data as possible when preparing budgets, budget accuracy will significantly improve
- Expense review can be configured with your company's reimbursement standards (such as travel standards, entertainment limits), and the agent will strictly review according to standards
- At month-end and quarter-end, have the Finance Assistant automatically generate financial reports with key metrics and anomaly alerts
- **Month-end batch review**: Send all expense reports for the month to the Finance Assistant at once — it will check each one against the policies you taught it, automatically flag over-limit items, and typically complete the entire review within minutes
:::
