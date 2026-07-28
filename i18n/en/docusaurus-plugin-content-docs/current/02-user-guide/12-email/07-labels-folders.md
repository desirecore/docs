---
title: Labels and Folders
description: Learn how to use labels and folders to organize emails, including system labels, custom labels, and global labels.
keywords: [email labels, folders, categories, global labels]
---

# Labels and Folders

As your mailbox grows, finding specific emails becomes harder. DesireCore provides a flexible label system to help you organize emails systematically.

## Folders

Each account has a set of folders displayed as horizontal tabs in the email view. Four default folders are always shown:

| Folder | Description |
|--------|-------------|
| 📥 Inbox | Received emails |
| 📤 Sent | Emails you sent |
| 📝 Drafts | Unsent drafts |
| 🗑️ Trash | Deleted emails |

Folder structure mirrors the native structure of your email provider and is synced automatically when the account is added.

## Label Types

DesireCore has three types of labels:

| Label type | Source | Description |
|-----------|--------|-------------|
| **System labels** | Email provider | Gmail's Inbox, Starred, Important, etc.—built in by the provider |
| **Account labels** | User-created | Custom labels bound to a specific email account |
| **Global labels** | User-created | Labels that work across all accounts; especially useful in the Unified Inbox |

## Creating and Managing Labels

### Creating a Label

You can create new labels in the label management area with these options:

- **Label name** — e.g., "To Reply", "Project A", "VIP Client"
- **Color** — Choose from 10 preset colors (red, orange, yellow, green, cyan, blue, indigo, purple, pink, gray)
- **Scope** — Current account only, or global
- **Visibility** — Whether to show in the label list
- **Sort weight** — Adjust display order in the list

### Editing and Deleting Labels

You can modify a label's name, color, and sort order at any time. Deleting a label does not delete the emails themselves—emails simply lose that label.

## Applying Labels to Emails

In the email preview panel toolbar, there is a label/category dropdown:

- **Gmail accounts** — Displays a multi-select label picker; you can assign multiple labels to an email
- **Outlook accounts** — Displays a category selector with similar functionality
- **IMAP accounts** — Label operations are not supported

An email can carry multiple labels simultaneously.

## Label Sync Mechanism

Different email providers use different label synchronization strategies:

| Dimension | Gmail | Outlook | IMAP |
|-----------|-------|---------|------|
| Sync direction | Bidirectional (local ↔ server) | Bidirectional (local ↔ server) | Read-only |
| Auto-sync timing | On account add + every email sync | On account add + every email sync | On account add |
| New label sync | ✅ Pushed to Gmail immediately | ✅ Pushed to Outlook immediately | ❌ Not supported |
| Delete label sync | ✅ Synced (emails unaffected) | ✅ Synced | ❌ Not supported |
| Color sync | ✅ Matches Gmail web UI | ✅ Matches Outlook client | — |
| Nested labels | ✅ Supported (e.g., Work/ProjectA) | ❌ Not supported | — |

### Triggering Manual Sync

If labels appear out of date, trigger a manual sync:

1. Go to Accounts Home
2. Click the **Sync** button on the relevant account card
3. Labels and emails refresh together

### Gmail Labels

DesireCore automatically syncs your existing Gmail labels when the account is added. Labels modified in DesireCore are synced back to the Gmail server. Gmail's nested labels (e.g., `Work/ProjectA`) are displayed hierarchically.

### Outlook Categories

Outlook uses the concept of **Categories**, which function similarly to labels. DesireCore automatically syncs your Outlook categories and displays them as labels. Outlook categories do not support nesting but do support custom colors.

### IMAP Accounts

IMAP protocol has limited label support (only system flags like `\Flagged` and `\Seen`). For IMAP accounts, DesireCore:

- Can **read** existing labels/flags from the server
- Supports **marking read/unread** and **starring**
- Does **not** support creating custom labels
- Can use DesireCore **global labels** (stored locally only, not synced to server)

:::tip Using Global Labels
If you have multiple accounts, create global labels (e.g., "Urgent", "This Week") to filter emails across accounts in the Unified Inbox. Global labels are stored locally in DesireCore and do not depend on your provider's label capabilities, making them fully available for IMAP accounts.
:::

## Filtering Emails by Label

In the email view, click a label in the left sidebar to filter emails that carry that label:

- Supports **multi-label filtering** (hold Ctrl/Cmd and click multiple labels)
- Global and account labels can be mixed
- Click "Clear filter" to show all emails again

## Next Steps

- [Mail Rules](./08-rules.md) — Set up rules to automatically label emails
- [Sync and Offline](./09-sync-offline.md) — Understand the label sync mechanism
