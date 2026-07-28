---
title: Data Analysis
description: Use the Data Analyst agent to clean spreadsheets, calculate metrics, generate charts and organize analysis conclusions.
keywords: [Data Analysis, Reports, Visualization, Trend Prediction, Data Analyst]
---

# Data Analysis

## Real Workflow

This scenario usually happens when "data exists but explanation is missing." Users don't want a vague analysis—they want a specific business question answered.

| Dimension | Real Situation |
|-----------|----------------|
| Trigger Point | Weekly meeting, business review, abnormal metrics review, boss suddenly asks about a business fluctuation |
| Existing Materials | CSV/Excel data, metric definitions, target values, historical comparison periods, business context |
| Pain Point | Data cleaning, metric definitions, chart selection and anomaly attribution all pile together, very time-pressured |
| DesireCore Intervention | Data Analyst first does data overview and definition confirmation, then generates charts, comparisons and preliminary explanations by question |
| Acceptance Result | User gets metric tables, charts and conclusion hypotheses that support discussion, then decides which ones go into the report |

## Recommended Agent

**Data Analyst** — Suitable for data cleaning, statistical analysis, trend comparison, anomaly detection and visual report generation; supports CSV, Excel, JSON and other common data formats.

## Teaching First: Master Your Business Metrics

> Every company calculates GMV, conversion rates and other metrics differently. Teach your definitions once, and every future analysis will use the correct standards—no more "the numbers don't match" moments.

### Teaching Rules

```
You: Let me teach you our company's core data analysis definitions:
    1. GMV standard: We use "Net GMV" (amount after deducting refunds), not Gross GMV (mandatory)
    2. Conversion rate: Order UV / Visit UV, not Payment UV / Visit UV (mandatory)
    3. Anomaly alerts: Flag metrics with day-over-day fluctuation exceeding 20% in red (mandatory)
    4. Data sources: Sales data exported from "Business Platform", user data exported from "Data Warehouse" (preference)

Data Analyst: 📝 New learning recorded
              Type: Rule (Business metric definitions)
              Level: Mandatory × 3, Preference × 1

              My understanding:
              GMV always uses net value (after refunds). Conversion rate
              denominator is Visit UV, numerator is Order UV (not Payment UV).
              Metrics with >20% day-over-day fluctuation are auto-flagged
              in red. Two data sources map to different data types.

              [✓ Correct]  [✎ Modify]  [✗ Undo]

You: [✓ Correct] Let me also show you our weekly report template.
    [Upload E-commerce_Weekly_Report_Template.xlsx]

Data Analyst: 📝 New learning recorded
              Type: Example (Weekly report template)
              Contains: trend charts + TOP 10 products ranking + anomaly root cause analysis.

              [✓ Correct]  [✎ Modify]  [✗ Undo]

You: [✓ Correct]
```

After teaching, the Data Analyst has mastered your company's metric standards and report format. From now on, just send data and get reports directly.

## Complete Conversation Example

```
You: Help me analyze this Q4 sales data. I want to understand regional performance and trends.
    [Upload sales_q4.csv]

Data Analyst: Analyzing the sales data you uploaded...

        Data Overview
        - Total rows: 15,234
        - Time range: 2024-10-01 to 2024-12-31
        - Products involved: 128 SKUs
        - Sales regions: East China, South China, North China, West China

        Key Metrics
        ┌──────────────┬───────────┬──────────┬──────────┐
        │ Metric       │ Q4 Actual │ Q3 Comp  │ YoY      │
        ├──────────────┼───────────┼──────────┼──────────┤
        │ Total Sales  │ 25.8M     │ +18.5%   │ +32.1%   │
        │ Order Volume │ 15,234    │ +12.3%   │ +28.4%   │
        │ Avg Order    │ 1,694 CNY │ +5.5%    │ +2.9%    │
        └──────────────┴───────────┴──────────┴──────────┘

        Regional Performance Ranking
        1. East China: 9.8M (38%) -- Exceeded target
        2. South China: 7.2M (28%) -- Met target
        3. North China: 5.8M (22%) -- 5% below target
        4. West China: 3.0M (12%) -- 15% below target

        Anomaly Detected
        Sales on December 25 were abnormally low (only 80k), suggest verifying data completeness.

        Would you like me to further analyze a specific region or product line?

You: Why is West China so far below target? Can you do a deep dive?

Data Analyst: West China deep dive analysis results:
        - Main product sales dropped 22%, possibly affected by competitor promotions
        - New customer acquisition in November decreased 35% month-over-month
        - But average order value increased 8% against the trend, indicating high loyalty among existing customers
        Recommendation: Increase customer acquisition investment in West China while maintaining existing customers...

        📋 Receipt Summary
        Rules applied: Net GMV metric · Conversion rate definition (order UV) · 20% anomaly threshold
        Template used: E-commerce Weekly Report Template
        All from your teaching (2 weeks ago) ✓
```

## Key Steps

1. **Define Business Question** — First clarify what question needs answering, e.g., "which region dragged down sales targets" rather than just "analyze data"
2. **Confirm Metric Definitions** — Specify time range, metric definitions, refund/cancellation handling and target value sources
3. **Data Health Check** — First check column names, missing values, duplicates, outliers and category naming consistency
4. **Explore and Compare** — Compare by time, region, channel, product, demographic and other dimensions to find major differences
5. **Form Verifiable Conclusions** — Write conclusions as "phenomenon + data evidence + possible causes + next verification steps", avoid just giving subjective judgments

## Final Deliverable

An analysis report containing key metrics, data quality notes, comparison dimensions, trend charts, anomaly explanations and next-step verification suggestions.

:::tip Best Practices
- Ensure clear column names before uploading (e.g., "Sales Amount" instead of "col_1") so the agent can better understand data meaning
- The more specific your analysis requirements, the more precise the results. "Analyze sales trends" is less effective than "Compare Q3 and Q4 growth rates by region, identifying the fastest and slowest growing regions"
- If the data volume is large, have the agent do a data overview first, then dive deeper into directions of interest
- When batch analyzing multi-department data, first confirm all spreadsheets use the same metric definitions and time range, then have the agent process in parallel
- Don't skip data health checks. Many "business anomalies" actually come from empty values, duplicate orders, definition changes or export scope inconsistencies
:::