---
title: Translation Assistant
description: Use the translation assistant to handle technical documents, business emails and localized text with unified terminology and style.
keywords: [Translation, Multilingual, Localization, Glossary, Translator]
---

# Translation Assistant

## Real Workflow

This scenario isn't about single-sentence translation—it's about delivery-oriented translation for real readers, focusing on terminology, tone and contextual consistency.

| Dimension | Real Situation |
|-----------|----------------|
| Trigger Point | Sending API documentation to overseas clients, replying to foreign-language emails, preparing product localization content |
| Existing Materials | Source text, target language, reader identity, product terminology glossary, historical translation style |
| Pain Point | Inconsistent terminology, stiff literal translations, code/API names/legal/business wording prone to errors |
| DesireCore Intervention | Translator generates translation based on glossary, lists key terminology, style choices and ambiguous sentences |
| Acceptance Result | User receives reviewable translation, focusing on professional terminology, client-sensitive expressions and contextual consistency |

## Recommended Agent

**Translator** — Supports mutual translation among Chinese, English, Japanese, Korean, French, German, Spanish, Russian and other mainstream languages; suitable for business documents, technical materials, product localization and cross-language email communication.

## Teaching First: Master Your Terminology and Style

> The biggest challenge in long-term translation projects is terminology inconsistency. The same product name, feature name or industry term should maintain the same translation across documents.

### Teaching Rules

```
You: Here's our official product glossary. From now on, always follow it strictly for translations.
     [Upload Product Glossary (Chinese-English).xlsx]
     I also have a few style requirements:
     1. Always use American English spelling, e.g., "organize" not "organise" (mandatory)
     2. Technical docs: concise and direct, avoid overly polite phrasing (preference)
     3. Marketing docs: upbeat tone, use short sentences for better rhythm (preference)

Translator: 📝 New learning recorded
            Source: Product Glossary (Chinese-English).xlsx (247 term pairs) + style notes
            Type: Rule (Translation standards)
            Level: Mandatory × 1 (including glossary), Preference × 2

            My understanding:
            Strictly use glossary translations -- no improvising. Spelling follows
            American English. Technical docs go concise, marketing docs go lively.

            [✓ Correct]  [✎ Modify]  [✗ Undo]

You: [✓ Correct] By the way, I'll send you updated glossaries whenever they change.
```

Once teaching is complete, the Translator has learned your glossary and style preferences. From now on, just send documents for translation—terminology will be applied automatically.

## Complete Conversation Example

```
You: Help me translate this API documentation into English. Make sure technical terms are accurate.

    "User Authentication
    All API requests must include an authentication token in the request header.
    Request rate limits:
    - Free tier: 100 requests per hour
    - Pro tier: 10,000 requests per hour"

Translator: Text type identified: Technical Documentation
         Translation result:

         Authentication
         All API requests must include an authentication token
         in the request header.

         Rate Limiting:
         - Free tier: 100 requests per hour
         - Pro tier: 10,000 requests per hour

         Terminology:
         - 认证令牌 → authentication token
         - 请求头 → request header
         - 请求频率限制 → rate limiting

         Code snippets kept as-is without translation.

You: Also help me translate a client email from Chinese to English,
    make it formal, business style.

    "感谢贵方对我司产品的关注。关于定制化需求，
    我们的技术团队已完成评估，预计开发周期为 2 周。"

Translator: Text type identified: Business Email (Formal)

         Thank you for your interest in our products.
         Regarding your customization requirements,
         our technical team has completed the evaluation.
         The estimated development timeline is two weeks.

         Translation notes:
         - "贵方" doesn't need an equivalent expression in English, use "your" directly
         - "我司" translates to "our" only, avoiding over-formality
         - Number "2 周" uses "two weeks" spelled out, more appropriate for formal emails

        📋 Receipt Summary
        Glossary applied: Product Glossary v2.1 (23 terms matched)
        Rules applied: American English spelling · Technical doc concise style
        All from your teaching (last month) ✓
```

## Key Steps

1. **Define Reader and Purpose** — The same Chinese text will be translated differently for developers, clients, legal or marketing
2. **Prepare Localization Package** — Provide glossary, product names, variable/placeholder rules, style guide and historical translations
3. **Translate by Context** — Technical docs preserve code and API names, marketing copy preserves tone, UI text considers length and button context
4. **Terminology and Format QA** — Check terminology consistency, number units, links, variables, punctuation and untranslatable content
5. **Consolidate Translation Memory** — Store confirmed terminology and expressions for consistent batch translation later

## Final Deliverable

A reviewable translation, usually accompanied by terminology mapping, style notes, untranslatable items and sentences that could be ambiguous in the source text.

:::tip Best Practices
- Before translation, tell the agent the document's purpose and target audience (e.g., "API documentation for American developers"), the translation style will be more stable
- If you have internal company glossaries, provide them upfront, and the agent will strictly follow them
- For long documents, translate in batches and confirm terminology consistency between each batch
- Legal documents, contracts and other critical translations should be reviewed by legal professionals for final approval
- Before batch translation, confirm unified glossary and style requirements, then send multiple documents to the translator for processing
- For product interface and help center translations, check variables, button lengths, links and screenshot context—don't just look at the sentences themselves
:::