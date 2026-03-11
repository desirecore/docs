---
title: Legal Advisor
description: Use the Legal Advisor agent for contract review, regulation retrieval, and legal risk assessment.
keywords: [Legal Advisor, Contract Review, Regulation Retrieval, Risk Assessment, Compliance]
---

# Legal Advisor

## Scenario Description

You received a supplier contract that needs to be signed tomorrow, but your legal colleague is on a business trip. The contract is filled with dense clauses, and you're worried about unfavorable "traps" for the company.

The Legal Advisor agent can quickly review contracts, analyze the reasonableness of key clauses item by item, flag risk points, and provide modification suggestions. It's like having an experienced legal assistant by your side at all times.

## Recommended Agent

**Legal Advisor** -- Specializes in legal compliance, with capabilities in contract review, regulation retrieval, risk assessment, and compliance recommendations.

## Teaching First: Setting Your Review Standards

> Spend 10 minutes teaching once, and the agent will automatically apply these standards every time it reviews a contract — no need to repeat yourself.

### Teach Rules

```
You: Let me teach you our company's standards for reviewing procurement contracts:
     1. Payment terms: Must be "payment within 30 days after acceptance", advance payment no more than 30% (mandatory)
     2. Liquidated damages: No more than 20% of total contract value (mandatory)
     3. Contract duration: No longer than 3 years (mandatory)
     4. Intellectual property: Custom development deliverables belong to Party A (mandatory)
     5. Report format: Summary table first, then risk list, then overall rating (preference)

Legal Advisor: 📝 New learning recorded
               Type: Rule (Procurement contract review standards)
               Level: Mandatory × 4, Preference × 1

               My understanding:
               When reviewing procurement contracts, mandatory checks include
               payment terms (≤30% advance + payment within 30 days after
               acceptance), liquidated damages (≤20%), duration (≤3 years),
               and IP (custom deliverables belong to Party A). Reports follow
               the "summary table → risk list → overall rating" format.

               [✓ Correct]  [✎ Modify]  [✗ Undo]

You: [✓ Correct]
```

### Provide Examples

```
You: Here's a previous review report. Follow this format from now on.
     [Paste review report example]

Legal Advisor: 📝 New learning recorded
               Type: Example (Review report format)
               Summary table has 6 columns (Clause / Current / Standard /
               Risk Level / Suggestion / Basis), risk items labeled
               [High/Medium/Low], ending with a "Recommend signing /
               Do not recommend signing" conclusion.

               [✓ Correct]  [✎ Modify]  [✗ Undo]

You: [✓ Correct]
```

Once teaching is complete, the Legal Advisor has learned your company's contract review standards. From now on, just send the contract over directly.

## Complete Conversation Example

```
You: Please help me review this supplier contract. It needs to be signed tomorrow.
    [Paste contract content]

Legal Advisor: Let me help you quickly review this contract. Analyzing clauses...

        Review Summary

        Contract Subject: Clear and explicit
        Payment Terms: Risk present
        Liability for Breach: Basically reasonable
        Dispute Resolution: Suggest modification

        Key Items to Note

        1. Payment Terms -- Medium Risk
           Issue: Advance payment ratio too high (50%), no milestone nodes specified
           Suggestion: Change to 30% advance + 40% progress payment + 30% acceptance payment
           Basis: Relevant provisions of Civil Code Contract Section

        2. Dispute Resolution -- Low Risk
           Issue: Arbitration agreed but arbitration institution not specified
           Suggestion: Clearly specify the name of the arbitration commission

        3. Intellectual Property -- Attention needed
           Issue: Intellectual property ownership of custom development deliverables not specified
           Suggestion: Add agreement "Custom deliverables belong to Party A"

        Overall Assessment
        Contract is basically usable, suggest modifying the above 3 items before signing.
        Need me to generate a modification suggestion draft?

You: Help me generate a modification suggestion draft, focusing on the payment terms.

Legal Advisor: Generated modification suggestion draft.
        Payment Terms Modification Suggestion:
        Original: "Party A shall pay 50% of the total contract price
              as advance payment within 5 working days after contract signing..."
        Modified to: "Party A shall pay in installments according to the following nodes:
              (1) 30% as advance payment within 5 working days after contract signing;
              (2) 40% within 5 working days after Party B completes system deployment
                  and passes mid-term acceptance;
              (3) Remaining 30% within 10 working days after final project acceptance."
        ...

        📋 Receipt Summary
        Rules applied: Payment terms standard · Liquidated damages cap · IP ownership
        All from your teaching (3 days ago) ✓
```

## Key Steps

1. **Upload or Paste Contract** -- Provide the contract text to be reviewed
2. **Get Review Report** -- The agent analyzes item by item, flagging risk levels
3. **View Modification Suggestions** -- Specific modification text provided for each risk point
4. **Generate Modified Draft** -- Optionally generate a contract version with all modification suggestions

## Final Deliverable

A detailed contract review report, flagging all risk points and corresponding modification suggestions, so you know what you're getting into before signing.

:::warning Disclaimer
The Legal Advisor agent's suggestions are for reference only and do not constitute formal legal advice. For major legal decisions (such as large contract signing, litigation response, equity transactions, etc.), consult a licensed attorney.
:::

:::tip Best Practices
- When uploading contracts, also specify which clauses you're most concerned about (e.g., payment method, liability for breach), and the agent will focus on analyzing these sections
- If it involves specific industries (such as construction, IT outsourcing), tell the agent the industry background, and it will provide more precise suggestions based on industry practices
- You can have the Legal Advisor collaborate with the Finance Assistant, one reviewing clauses and the other calculating costs, for a comprehensive contract evaluation
- **Batch contract review**: When you receive multiple contracts at once, send them all to the Legal Advisor — it will review each one in parallel, applying the same set of standards you taught it
:::
