---
title: Legal Advisor
description: Use the Legal Advisor agent to assist with contract pre-review, regulation retrieval, and legal risk assessment.
keywords: [Legal Advisor, Contract Review, Regulation Retrieval, Risk Assessment, Compliance]
image: /img/use-cases/covers/cover-legal-advisor.jpg
---

# Legal Advisor

## Real Workflow

The core of the legal scenario is "pre-review" — the agent doesn't replace legal counsel to make final decisions. It's suited for organizing contract issues before formal legal review.

| Dimension | Real Situation |
|-----------|----------------|
| Trigger Point | Procurement contracts, outsourcing agreements, NDAs, and client agreements entering the approval process |
| Existing Materials | Contract text, company review standards, historical review reports, business background, and contract value information |
| Pain Point | Too many clauses, business owners unsure which points need legal counsel involvement, high communication costs with legal |
| DesireCore Intervention | Legal Advisor flags risks per company standards, suggests revisions, identifies missing background info, and marks items needing legal confirmation |
| Acceptance Result | Business owner receives a pre-review checklist, then discusses key clauses with legal counsel in a focused session |

## Recommended Agent

**Legal Advisor** — Suited for contract clause review, regulation research, compliance checklist preparation, and risk flagging.

## Teaching First: Teaching the Agent Your Review Standards

> It's recommended to first teach the agent your company's contract review standards, red-line clauses, and report format. It will then apply the same rules consistently for every pre-review.

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

Legal Advisor: Let me do a contract pre-review. Analyzing clauses...

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

1. **Confirm Contract Background** — First clarify contract type, value, counterparty, business purpose, and clauses you're most concerned about
2. **Apply Company Red Lines** — Check payment, breach, duration, IP, confidentiality, and dispute resolution clauses against your company standards
3. **Generate Risk Matrix** — For each issue, annotate clause location, risk level, business impact, suggested revision, and whether legal counsel confirmation is needed
4. **Output Negotiation Text** — Generate ready-to-use replacement language for high-risk clauses
5. **Prepare Legal Consultation List** — Separately list issues that AI cannot judge and require additional business or legal background

## Final Deliverable

A contract pre-review report containing risk points, risk levels, suggested revision text, and a checklist of items requiring legal counsel confirmation.

:::warning Disclaimer
The Legal Advisor agent provides supplementary analysis and does not constitute formal legal advice. For major contracts, litigation, equity transactions, labor disputes, and similar matters, final review should be conducted by a licensed attorney or in-house legal counsel.
:::

:::tip Best Practices
- When uploading contracts, also specify which clauses you're most concerned about (e.g., payment method, liability for breach), and the agent will focus on analyzing these sections
- If it involves specific industries (such as construction, IT outsourcing), tell the agent the industry background and applicable region so it can organize risks based on more relevant rules
- You can have the Legal Advisor collaborate with the Finance Assistant — one reviewing clauses and the other calculating costs — for a comprehensive contract evaluation
- When batch-reviewing contracts, first unify the review standards, then have the Legal Advisor output risk lists against the same criteria
- The most important thing in contract pre-review is not "pointing out many issues" but distinguishing which must be changed, which can be negotiated, and which only need business awareness
:::
