---
title: Reading and Managing Email
description: Learn the full features of the single-account email view—two-column layout, message and conversation modes, search and filtering, batch operations, and quick reply.
keywords: [read email, search email, conversation mode, batch operations, quick reply]
---

# Reading and Managing Email

Click an account card on the Accounts Home page to enter that account's email view. This is your primary interface for day-to-day email management.

## Page Overview

![Email view — message mode](/img/user-guide/email/email-view-messages.png)

### Top Bar

- **Back** — Return to Accounts Home (unread counts refresh automatically)
- **Search bar** — Real-time email search (press `/` to focus)
- **Sync status** — Shows "Syncing" (blue pulse), "Sync failed" (red), or last sync time
- **Sync** — Trigger an immediate email sync
- **Compose** — Open the compose dialog

### Folder Tabs

Below the top bar are horizontally arranged folder tabs (Inbox, Sent, Drafts, Trash). Click to switch folders; the email list updates automatically. The active tab is highlighted with a gradient and shows an unread-count badge.

### View Mode Toggle

To the right of the folder tabs, you can switch between two browsing modes:

- **Message mode** (default) — Each email displayed individually
- **Conversation mode** — Emails grouped by thread; replies in the same subject are aggregated into a conversation

### Two-Column Layout

The area below is split into left and right columns: the left column (280–320 px wide) holds the email/conversation list, and the right column (adaptive width) is the preview panel.

## Message Mode

### Email List (Left Column)

![Email list item with quick actions](/img/user-guide/email/email-list-hover.png)

Each email appears as a list item showing an unread indicator, sender, subject, preview text, and timestamp. Unread subjects are bolded; the selected email has a blue vertical bar on the left.

The email list supports **virtual scrolling** for smooth performance even with large mailboxes. More emails load automatically as you scroll down.

#### Quick Actions

Hovering over an email reveals quick-action buttons on the right:

| Button | Function |
|--------|----------|
| Read/Unread | Toggle read status |
| Archive | Archive the email |
| Delete | Delete the email |

All actions use **optimistic updates**—the UI reflects changes immediately; if the API call fails, the change is rolled back automatically.

#### Batch Operations

Hovering over the unread dot on the left side of an email turns it into a checkbox. After checking one or more emails, a batch-action bar appears at the top of the list:

![Batch action bar](/img/user-guide/email/batch-actions.png)

Supports select-all/deselect-all, bulk mark-as-read, mark-as-unread, and delete.

### Email Preview (Right Column)

When an email is selected, the right column displays its full content.

![Email preview panel](/img/user-guide/email/email-preview.png)

#### Top Toolbar

Provides Close, Reply, Reply All, Forward, label/category management, Archive, and Delete actions.

#### Email Headers

Shows sender avatar and name, email address, To, Cc, timestamp, message size, priority, and existing labels.

#### Email Body

HTML emails render as rich text; plain-text emails display in a monospaced font.

#### Attachments

If attachments are present, file names, sizes, and download buttons are displayed.

#### Quick Reply

The bottom of the preview panel provides a quick-reply area that avoids opening the full compose dialog. You can toggle between "Reply" and "Reply All" modes.

![Quick reply](/img/user-guide/email/quick-reply.png)

:::tip No Selection State
When no email is selected, the right column shows an empty-state prompt: "Select an email — click an email in the left list to view details."
:::

## Conversation Mode

Switching to conversation mode aggregates emails in the same thread into a conversation.

![Email view — conversation mode](/img/user-guide/email/email-view-conversations.png)

### Conversation List (Left Column)

Each conversation displays the subject, participant list, message count, unread count, and latest message time.

### Conversation Detail (Right Column)

When a conversation is selected, the right column expands to show all emails in the thread, each presented as a collapsible card:

- Click the email header to expand/collapse
- Expanding automatically marks that email as read
- Quick reply is available at the bottom of the conversation

## Search and Filtering

### Keyword Search

Enter keywords in the top search bar; the email list filters in real time, matching subject, body, and sender information.

| Shortcut | Function |
|----------|----------|
| `/` | Focus the search bar |
| `Enter` | Trigger search |
| `Esc` | Clear search |

### Advanced Filters

Click the filter icon next to the search bar to expand the advanced-filter panel:

![Advanced filter panel](/img/user-guide/email/advanced-filter.png)

Supports combined filtering by sender, date range, attachments, read status, and more.

## Authorization Failure Handling

If the current account's OAuth authorization has expired, a prominent banner floats at the top of the page. Click "Re-authorize" to open the re-authorization dialog; access is restored once completed.

![Authorization expired banner](/img/user-guide/email/auth-expired.png)

## Action Feedback

After any email action, a toast notification appears in the bottom-right corner (e.g., "Marked as read" or "Delete failed, please retry") and disappears automatically after 4 seconds.

## Next Steps

- [Composing](./06-composing.md) — Learn how to send new emails and reply
- [Labels and Folders](./07-labels-folders.md) — Organize emails with labels
