---
title: Finance Assistant
description: Use the Finance Assistant agent to assist with budget preparation, expense review, report organization, and cost analysis.
keywords: [Finance Assistant, Budget Preparation, Expense Review, Financial Reports, Cost Analysis]
---

# Finance Assistant

## Real Workflow

Financial scenarios truly exist in "well-defined policies but tedious manual verification" work, such as budget drafts, expense reviews, cost attribution, and report compilation.

| Dimension | Real Situation |
|-----------|----------------|
| Trigger Point | Month-end expense review, quarterly budget preparation, expense overrun analysis, departmental cost analysis |
| Existing Materials | Historical budgets, actual expenditures, business plans, expense policies, invoices, and approval records |
| Pain Point | Policy details are intricate, documents are numerous, over-limit reasons and missing materials require line-by-line review |
| DesireCore Intervention | Finance Assistant checks expenses against policies, summarizes over-limit items, missing invoices, budget variances, and adjustment suggestions |
| Acceptance Result | Finance staff receives a budget draft or review report, then handles exceptions and approval opinions |

## Recommended Agent

**Finance Assistant** — Suited for budget estimation, expense policy compliance, report archiving, cost analysis, and anomaly flagging.

## Teaching First: Teaching the Agent Your Financial Policies

> Every company's reimbursement standards are different. Teach the company policies clearly first, and subsequent reviews will follow your rules instead of generic standards.

### Teach Rules

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

1. **Define Accounting Scope** — First clarify department, project, period, budget categories, and approval criteria
2. **Align Budget with Actuals** — Compare budget, actual, forecast, and same-period historical data; identify major variances
3. **Explain Variance Causes** — Break down variances into business growth, price changes, one-time expenses, over-limit costs, or accounting differences
4. **Review Policy Compliance** — Check expense documents for invoice types, amount limits, approval chains, and supplementary explanations
5. **Output Approval Recommendations** — Categorize into approved, returned for materials, over-limit requiring approval, and rejected

## Final Deliverable

A budget draft or expense review report containing budget-actual variances, calculation basis, over-limit items, missing materials, and items pending confirmation.

:::warning Disclaimer
The Finance Assistant provides supplementary organization and preliminary analysis, and does not constitute professional financial, audit, or tax advice. For major financial decisions, tax filings, and external disclosures, consult qualified professionals.
:::

:::tip Best Practices
- Provide as complete historical data as possible when preparing budgets — budget accuracy will significantly improve
- Expense review can be configured with your company's reimbursement standards (such as travel standards, entertainment limits), and the agent will strictly review according to standards
- At month-end and quarter-end, have the Finance Assistant compile financial reports with key metrics and anomaly alerts
- During month-end batch reviews, have the Finance Assistant first summarize over-limit items, missing invoices, and items needing supplementary explanations, then have finance staff make final decisions
- Financial analysis should not only look at variance amounts — also explain the nature of variances: temporary expenses, structural changes, revenue growth-driven, or budget planning bias
:::
