---
title: Data Analysis
description: Use the Data Analyst agent to quickly analyze sales data, user behavior, etc., and obtain visual reports and trend insights.
keywords: [Data Analysis, Reports, Visualization, Trend Prediction, Data Analyst]
---

# Data Analysis

## Scenario Description

You have a sales data spreadsheet, and your boss wants trend analysis and next quarter's forecast by this afternoon. Manually organizing data, creating charts, and writing analysis conclusions would take at least half a day.

The Data Analyst agent can complete this work in minutes: automatically identifying data formats, cleaning outliers, generating statistical summaries, creating visual charts, and providing actionable analysis conclusions.

## Recommended Agent

**Data Analyst** -- Specializes in data cleaning, statistical analysis, trend prediction, and visual report generation, supporting CSV, Excel, JSON, and other data formats.

## Teaching First: Setting Your Business Metrics

> Every company calculates GMV, conversion rates, and other metrics differently. Teach your definitions once, and every future analysis will use the correct standards -- no more "the numbers don't match" moments.

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

1. **Upload Data** -- Upload CSV, Excel, or JSON files to the agent
2. **Describe Analysis Needs** -- Explain what you want to understand (trends, comparisons, predictions, etc.)
3. **Get Analysis Results** -- The agent automatically generates statistical summaries, charts, and insights
4. **Deep Dive** -- Ask follow-up questions about discovered issues for deeper analysis

## Final Deliverable

A complete analysis report with key metrics, regional comparisons, trend charts, anomaly detection, and improvement recommendations, ready for team presentations.

:::tip Best Practices
- Ensure clear column names before uploading (e.g., "Sales Amount" instead of "col_1") so the agent can better understand data meaning
- The more specific your analysis requirements, the more precise the results. "Analyze sales trends" is less effective than "Compare Q3 and Q4 growth rates by region, identifying the fastest and slowest growing regions"
- If the data volume is large, have the agent do a data overview first, then dive deeper into directions of interest
- **Batch analyze multi-department data**: When you need to review data across departments or product categories on Monday morning, send everything to the Data Analyst at once -- it will analyze each dataset in parallel, all using the same metric standards and report template you taught
:::
