---
title: Data Scientist
description: Use the Data Analyst agent to assist with user behavior analysis, predictive modeling, operational monitoring and experiment evaluation.
keywords: [Data Science, User Behavior Analysis, Predictive Models, Operational Monitoring, Visualization]
---

# Data Scientist

## Real Workflow

Data science scenarios aren't about "letting AI find insights"—they're about when teams already have data and competing hypotheses, using analysis to narrow down to verifiable directions.

| Dimension | Real Situation |
|-----------|----------------|
| Trigger Point | User churn rising, conversion declining, A/B experiment results unclear, operational strategy needs review |
| Existing Materials | Behavior logs, user profiles, channel sources, version changes, experiment groups and business hypotheses |
| Pain Point | Reasons behind metric changes unclear; different teams have different explanations; lack unified analysis framework |
| DesireCore Intervention | Data Analyst does funnels, segmentation, anomaly detection and predictive model first draft, organizes verifiable hypotheses |
| Acceptance Result | Team gets prioritized recommendations, experiment suggestions and monitoring metrics, then decides product or operational actions |

## Recommended Agent

**Data Analyst** — Suitable for statistical analysis, predictive models, user segmentation, anomaly detection and operational monitoring dashboards.

## Complete Conversation Example

```
You: Analyze our App's user behavior data and find the reasons for user churn.
    [Upload user_behavior.json]

Data Analyst: Conducting user behavior analysis...

        User Overview
        - Total users: 50,000
        - Monthly Active Users (MAU): 32,000 (64%)
        - Churned users this month: 3,200 (6.4%)

        User Journey Funnel
        Registration → First Use → Activation → Retention → Payment
        100%    78%       45%    32%    8%

        Key Churn Nodes
        Registration → First Use: 22% churn (industry average 15%)
        First Use → Activation: 42% churn (industry average 35%)

        Churn Reason Analysis
        1. Onboarding process too long (35% of users mentioned)
           Average completion time 8 minutes, suggest shortening to 3-5 minutes
        2. Core feature entry not obvious (28% of users mentioned)
           68% of users stay on homepage for over 30 seconds without action
        3. No value felt on first use (22% of users mentioned)
           72% exit without experiencing core features

        User Segmentation
        High-value users (8%): 30+ minutes daily usage
        Potential users (24%): 3+ times weekly but not paid
        Churn risk users (18%): Not logged in for 7 consecutive days

        Prediction
        Without action: Churn rate rises to 8.5% next month
        Optimize onboarding: Expected to reduce churn rate by 2-3%

You: Can you give a priority-ranked improvement plan?

Data Analyst: Improvement Priority Ranking (by expected effect):
        P0: Shorten onboarding process (largest impact)
        P1: Add core feature guidance on homepage
        P2: Design first-use reward mechanism
        P3: Push recall content to churn risk users
        ...
```

## Key Steps

1. **Define Business Problem** — First clarify whether it's churn, conversion, retention, payment or activity problem
2. **Organize Event Definitions** — Confirm user ID, event names, timestamps, channels, versions and experiment groups are consistent
3. **Build Funnels and Segmentation** — Break down changes by new/returning users, channels, devices, versions and behavior depth
4. **Form Testable Hypotheses** — Match hypotheses like "onboarding too long" or "entry not obvious" with data evidence
5. **Build Models and Monitoring** — Models only serve as risk ranking; ultimately land on monitorable metrics and experiment plans
6. **Output Action Priority** — Sort by impact scope, implementation cost, verification cycle and risk

## Final Deliverable

A user behavior analysis report containing data definitions, funnel analysis, churn attribution, user segmentation, predictive model first draft, monitoring metrics and prioritized experiment suggestions.

:::tip Best Practices
- The more complete the data, the more accurate the analysis. Ideally include user behavior events, timestamps, device information and other dimensions
- Start with global analysis to understand the overall situation, then dive deep into specific issues. Avoid getting into details from the start
- Analysis results should translate into executable product improvements—have the agent prioritize by impact scope, implementation cost and verification method
- User behavior analysis shouldn't jump directly to "reasons"—first confirm tracking definitions, version changes and sample composition are stable
:::