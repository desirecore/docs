---
title: Translation Assistant
description: Use the Translator agent to translate technical documents, business emails, etc., preserving original style and professional terminology.
keywords: [Translation, Multilingual, Localization, Glossary, Translator]
---

# Translation Assistant

## Scenario Description

You need to translate a technical document into English for the overseas team, but regular translation tools produce "Chinglish" results with inconsistent professional terminology. Or you received an email in Japanese and need to quickly understand the content and reply.

The Translator agent supports mutual translation among 12 mainstream languages, understands contextual nuances, preserves original style, and supports custom glossaries to ensure consistent professional vocabulary.

## Recommended Agent

**Translator** -- Supports mutual translation among 12 languages including Chinese, English, Japanese, Korean, French, German, Spanish, and Russian, excelling in professional translation of business documents, technical materials, and legal files.

## Teaching First: Setting Your Terminology and Style

> The biggest challenge in professional translation is inconsistency -- the same term translated differently across documents. Take a few minutes to upload your glossary once, and every translation after that will follow it precisely.

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

Once teaching is complete, the Translator has learned your glossary and style preferences. From now on, just send documents for translation -- terminology will be applied automatically.

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

1. **Upload or Paste Document** -- Provide the text content to be translated
2. **Set Translation Preferences** -- Specify target language, style (formal/neutral/casual), and glossary
3. **Get Translation Result** -- The agent returns translated text and terminology glossary
4. **Review and Adjust** -- Provide revision suggestions for the translation, the agent makes precise adjustments

## Final Deliverable

An idiomatic, professional translated document with a terminology glossary to ensure consistency in subsequent translations.

:::tip Best Practices
- Before translation, tell the agent the document's purpose and target audience (e.g., "API documentation for American developers"), the translation style will be more appropriate
- If you have internal company glossaries, provide them upfront, and the agent will strictly follow them
- For long documents, suggest translating in batches and confirming terminology consistency between batches
- For legal documents, contracts, and other critical translations, the results should be reviewed by legal professionals
- **Batch translation**: When you have multiple documents to translate, send them all at once -- the Translator will process them in parallel with globally consistent terminology, ensuring the same term is never translated differently across documents
:::
