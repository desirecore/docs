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
           Issue: Intellectual property ownership of custom development成果not specified
           Suggestion: Add agreement "Custom成果belongs to Party A"

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
:::
