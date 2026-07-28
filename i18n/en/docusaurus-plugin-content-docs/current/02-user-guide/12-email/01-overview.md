---
title: Email Management Overview
description: Learn how DesireCore email management unifies Gmail, Outlook, and IMAP accounts in a single interface.
keywords: [email management, multiple accounts, Gmail, Outlook, IMAP]
---

# Email Management Overview

**DesireCore Email Management** brings all your email accounts together in one unified interface.

## Supported Account Types

| Account type | Authentication | Typical use |
|-------------|---------------|-------------|
| **Gmail** | OAuth 2.0 | Personal Google accounts, Google Workspace |
| **Outlook** | OAuth 2.0 | Personal Outlook/Hotmail, Microsoft 365 |
| **IMAP/SMTP** | Username & password | QQ Mail, 163 Mail, corporate email, etc. |

:::tip Quick Understanding
Gmail and Outlook connect through official OAuth authorization—secure and fully featured. IMAP/SMTP is a universal protocol that supports virtually every email provider.
:::

## Core Features

- **Multi-account management** — Add multiple accounts of different types; view and switch between them in one place
- **Unified inbox** — Aggregate emails from all accounts into a single view, sorted by time
- **Send and receive** — Read, reply to, and compose emails with rich-text editing and attachments
- **Messages and conversations** — Two browsing modes: individual messages or thread-based conversations
- **Search and filtering** — Keyword search plus multi-dimension advanced filters for quick discovery
- **Labels and categories** — Custom label system that syncs with Gmail labels and Outlook categories
- **Mail rules** — Set conditions to automatically classify, label, archive, or forward messages
- **Batch operations** — Multi-select emails to mark as read or delete in bulk
- **Drafts and signatures** — Auto-save drafts; manage multiple email signatures
- **Real-time sync** — Background polling with instant push notifications for new messages
- **Offline access** — View previously synced emails offline; operations execute automatically when back online
- **Local storage** — Email data is encrypted and stored on your device, never passing through third-party servers

## Navigation Structure

Email management consists of three main views:

![Navigation structure](/img/user-guide/email/navigation-structure.svg)

## Data Security

Your email data always stays on your local device:

- **Encrypted tokens**: OAuth tokens and IMAP passwords are stored with AES-256-GCM encryption
- **Local-first**: Email content and indexes are stored under `~/.desirecore/mail/`
- **Direct communication**: DesireCore communicates directly with your email provider—no third-party servers involved

:::info Privacy Note
DesireCore does not upload your email content to the cloud. All synchronization happens directly between your device and the email provider.
:::

## Next Steps

- [Accounts Home](./02-accounts-home.md) — Understand the account management interface
- [Add Accounts](./03-add-accounts.md) — Learn how to add your first email account
