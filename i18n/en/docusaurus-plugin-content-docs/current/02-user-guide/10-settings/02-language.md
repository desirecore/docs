---
title: Language Settings
description: Switch DesireCore's interface language and understand the scope and impact of multilingual support.
keywords: [language, internationalization, i18n, Chinese, English, settings]
---

# Language Settings

DesireCore supports multilingual interfaces, which you can switch at any time.

## Supported Languages

| Language | Language Code |
|----------|---------------|
| Simplified Chinese | `zh-CN` |
| English | `en-US` |

More languages will be added in future versions based on community feedback.

## How to Switch Language

1. Open the **Settings** panel
2. Find the **Language** section
3. Click the dropdown menu to the right of **Language**
4. Select your target language

After switching, all interface text will immediately update to the selected language.

## Scope of Language Switching

Switching the interface language only changes DesireCore's own UI text, including:

- Menus, buttons, prompt text
- Setting item names and descriptions
- System notifications and status prompts

:::info
Language switching **does not** affect the agent's conversation language. The language an agent uses to reply depends on its role setting (Persona) and the language you use in your prompts. Even if the interface is switched to English, the agent can still converse with you in Chinese.
:::

## Contributing Translations

DesireCore's interface text is stored in the `app/data/i18n/` directory. If you'd like to help improve translations or contribute new languages, welcome to submit a Pull Request via GitHub.
