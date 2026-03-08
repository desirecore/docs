---
title: Conversation Issues
description: Resolve common issues with message sending, reply speed, and conversation history in DesireCore
keywords: [conversation issues, message sending failure, slow replies, lost history, context length]
---

# Conversation Issues

## What to do if message sending fails?

When message sending fails, an error prompt will appear next to the message. Common causes and solutions:

1. **Network interruption** — Check network connection and resend after recovery
2. **API service unavailable** — The model provider may be under maintenance; try again later
3. **Token limit exceeded** — The number of Tokens in a single request exceeds the model limit; try shortening the message or clearing some context
4. **Insufficient API Key balance** — Check your provider account balance

:::tip
Failed message content is not lost. You can quickly retrieve and resend it through the input box history feature (press `Up` arrow key).
:::

## Companion replies too slowly?

Reply speed is affected by multiple factors:

| Factor | Description | Optimization Suggestion |
|------|------|---------|
| Model selection | Flagship models have slower inference speeds | Use lightweight models for simple tasks |
| Message length | Long text input/output requires more processing time | Break questions into steps when necessary |
| Context length | The longer the conversation history, the slower the processing | Regularly clear unnecessary context |
| Network latency | API server is geographically distant | Choose a Provider closer to your location |
| Tool calls | Using tools adds extra time | If tools aren't needed, explicitly tell the Companion |

## Conversation history lost?

First confirm whether the history is actually lost:

1. **Check if you're in the correct Companion** — Each Companion has independent conversation history
2. **Scroll up to load more** — History messages are loaded on demand; scroll up to trigger loading
3. **Use conversation history search** — Open the conversation history panel to search for keywords

If history is confirmed lost, possible causes:

- Manually cleared conversation history
- `~/.desirecore/` directory was moved or deleted
- App version update caused data migration issues (rare)

:::warning
It's recommended to regularly back up the `~/.desirecore/` directory, especially before major version updates.
:::

## Context too long causing errors?

When conversations accumulate large amounts of context, they may exceed the model's context window limit. Solutions:

1. **Clear current conversation context** — Select clear conversation history from the more menu to start a new conversation
2. **Switch to a model supporting longer context** — Such as the Claude series which supports larger context windows
3. **Streamline questions** — Avoid including too much content in a single message

## Why does the Companion seem to forget what was said before?

This may be related to context window limits. When conversation content exceeds the model's context length, earlier messages are truncated. The Companion's long-term memory (Memory) system can compensate for this — important information is written to memory and automatically referenced in subsequent conversations.

## How to make the Companion forget certain content?

If the Companion has learned incorrect rules or knowledge, you can tell it in conversation:

- "Forget the rules about XX"
- "Undo what you just learned"
- "Delete the memory about XX"

The Companion will remove the corresponding entries from the Playbook or memory.

## Companion didn't analyze the image after sending it?

Confirm the following:

1. **You used image upload rather than file reference** — File reference only passes the path, not the image content
2. **The current model supports visual understanding** — Not all models support image input; select a multimodal model (such as GPT-4o, Claude series)
3. **Image format is correct** — Supports JPEG, PNG, WebP, GIF

## Abnormal behavior when typing Chinese?

DesireCore's input box has special handling for Chinese input methods (IME Composition). If you still encounter issues:

- Ensure you're using the system native input method
- Try disabling candidate word preview in input method settings
- If using third-party input methods, try switching to the system built-in input method
