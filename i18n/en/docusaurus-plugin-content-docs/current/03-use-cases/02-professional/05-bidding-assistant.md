---
title: Bidding Assistant
description: Use the Bidding Assistant agent to complete bid document preparation, qualification review, pricing strategy analysis, and bid document checking.
keywords: [Bidding, Bid Document Preparation, Qualification Review, Pricing Strategy, Bid Management]
---

# Bidding Assistant

## Scenario Description

Your company received a project bidding document with 18 days until the bid deadline. You need to understand qualification requirements, write technical proposals, develop pricing strategies, and ensure the bid documents are flawless. Any oversight in any step could lead to disqualification.

The Bidding Assistant agent can help you systematically complete the entire bidding process: interpreting bidding documents, self-reviewing bidding qualifications, generating technical proposal frameworks, analyzing optimal pricing, and item-by-item checking bid document completeness.

## Recommended Agent

**Bidding Assistant** -- Bidding process management expert, responsible for bid document preparation, qualification review, and pricing strategy.

## Teaching First: Building Your Company Profile

> The most time-consuming part of bidding is repeatedly compiling company qualifications and past performance. Teach once, and every new project gets automatic matching from then on.

### Teaching Rules

```
You: Let me teach you about our company profile for future bids:
     [Upload Company Qualifications.pdf]
     [Upload Recent Projects.xlsx]
     A few rules to add:
     1. Minimum profit margin on quotes: no less than 15%, skip the bid if below (mandatory)
     2. When citing past performance in technical proposals, prioritize projects from the same industry and similar scale (preference)
     3. All bid documents must use the company template format, with company logo and qualification number on the cover (mandatory)

Bidding Assistant: 📝 New learning recorded
                   Source: Company Qualifications.pdf + Recent Projects.xlsx + strategy notes
                   Type: Rule (Bidding strategy)
                   Level: Mandatory × 2, Preference × 1

                   My understanding:
                   Automatically match relevant company qualifications and similar
                   past projects when bidding. Ensure profit margin ≥15% during
                   pricing, otherwise recommend passing. Prioritize same-industry
                   cases in technical proposals. Use company template for all
                   document formatting.

                   Qualifications recorded: Business license, ISO 9001/14001/45001,
                   System Integration Level 3, 12 software copyrights...
                   Track record recorded: 47 awarded contracts across 6 industries.

                   [✓ Correct]  [✎ Modify]  [✗ Undo]

You: [✓ Correct]
```

Once teaching is complete, the Bidding Assistant has your company's qualifications and bidding strategy on file. From now on, just send any new RFP directly for analysis.

## Complete Conversation Example

```
You: Help me analyze the key content of this bidding document.
    [Paste bidding document]

Bidding Assistant: Let me help you deeply interpret this bidding document.

        Project Basic Information
        Project Name: Smart City Data Center Construction Project
        Budget Amount: 25 million CNY
        Bidding Method: Open Tender

        Key Timeline
        Bid Deadline: June 20, 09:30 (18 days remaining)
        Q&A Deadline: June 10, 17:00 (8 days remaining)

        Qualification Requirements (All Required)
        - Independent legal person qualification
        - Electronic and Intelligent Engineering Professional Contracting Level 1 qualification
        - Safety production license
        - ISO9001 Quality Management System certification
        - Similar project track record in past 3 years >= 3

        Scoring Criteria
        Business Section (30 points): Price 20 points + Performance 10 points
        Technical Section (50 points): Proposal 25 points + Implementation 15 points + After-sales 10 points

        Risk Alerts
        - Joint ventures not accepted
        - Warranty period requires 3 years (industry standard usually 2 years)
        - Performance bond is 10% of contract amount

        Suggested Actions
        1. Immediately verify if qualifications are met
        2. Complete site survey within 3 days
        3. Determine technical proposal framework within 7 days
        4. Complete bid document draft within 15 days

You: Do we meet the bidding qualifications for this project?

Bidding Assistant: Qualification Self-Review Results: Basically Qualified (3 items need supplementation)
        Qualified Items: 8/11
        Need Supplementation:
        1. Performance proof: 2 completed projects, need to supplement ongoing project contracts
        2. Project Manager: Need to replace with personnel holding Mechanical and Electrical Engineering certificate
        3. Credit rating: Current AA level, need explanation or improvement
        ...

        📋 Receipt Summary
        Qualifications cited: System Integration Level 3 · ISO 9001 + 3 others
        Past projects cited: 3 projects from the same industry
        Rules applied: 15% profit floor · Company template format
        All from your teaching (2 weeks ago) ✓
```

## Key Steps

1. **Bidding Document Interpretation** -- The agent extracts key requirements, timeline, and scoring criteria
2. **Qualification Self-Review** -- Item-by-item check if bidding conditions are met, flag missing items
3. **Technical Proposal Generation** -- Generate proposal framework based on bidding requirements, highlighting scoring focus
4. **Pricing Strategy Analysis** -- Based on cost estimation and competitive analysis, recommend optimal pricing
5. **Document Completeness Check** -- Item-by-item check if all documents are complete before bidding

## Final Deliverable

A complete set of bidding materials, including bidding document interpretation report, qualification self-review checklist, technical proposal, pricing analysis, and bid document check list.

:::tip Best Practices
- Have the agent analyze immediately after receiving the bidding document to discover qualification gaps early and allow time for supplementation
- Focus technical proposal efforts on high-scoring chapters, the agent will highlight which sections need focused writing based on scoring criteria
- Be sure to do a completeness check the day before bidding to avoid disqualification due to formal issues (such as missing signatures/stamps)
- **Parallel bidding**: When handling multiple RFPs simultaneously, send them all to the Bidding Assistant at once -- it will analyze each bidding document in parallel and automatically match the required qualifications and track record from your taught company profile
:::
