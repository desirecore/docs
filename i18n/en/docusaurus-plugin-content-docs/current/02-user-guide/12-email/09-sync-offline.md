---
title: Sync and Offline
description: Learn about DesireCore's email synchronization mechanism, polling strategy, and offline operation queue.
keywords: [email sync, offline mode, incremental sync, polling]
---

# Sync and Offline

DesireCore stores email data locally and keeps it consistent with the email server through background synchronization. Even without a network connection, you can still view previously synced emails and perform operations.

## Sync Mechanism

### Automatic Sync

After adding an account, DesireCore automatically starts background polling to check for new emails periodically.

![Sync flow](/img/user-guide/email/sync-flow.svg)

### Incremental Sync

To save bandwidth and improve efficiency, DesireCore uses incremental sync—only fetching changes since the last sync:

| Account type | Incremental method | Description |
|-------------|-------------------|-------------|
| Gmail | History API | Tracks changes via `historyId`; fetches only new and modified emails |
| Outlook | Delta API | Uses `deltaLink` for incremental queries; highly efficient |
| IMAP | UID tracking | Records the last synced UID and fetches only newer emails |

### Manual Sync

Click the **Sync** button in the email view's top bar to trigger an immediate sync. The **Sync All** button in the Unified Inbox triggers sync for all accounts simultaneously.

### Sync Status

The top bar displays real-time sync status:

- **Syncing** — Blue pulse animation
- **Sync failed** — Red indicator
- **Completed** — Shows last sync time, e.g., "5 minutes ago"

## Local Storage

Synced emails are stored with the following structure:

```
~/.desirecore/mail/
├── gmail/
│   └── user@gmail.com/
│       ├── meta.json       # Account info, sync state
│       ├── index.json      # Email index (for fast search and listing)
│       └── messages/       # Full content of each email
├── outlook/
│   └── ...
└── imap/
    └── ...
```

- **Index files** store lightweight email metadata for list display and search
- **Message files** store full email body and attachment data
- All sensitive information (tokens, passwords) is encrypted with AES-256-GCM

## Offline Operations

When you perform email actions without a network connection, DesireCore does not throw an error—the action is placed in an **offline queue** and executed automatically when the network is restored.

### Supported Offline-Queued Operations

| Operation | Description |
|-----------|-------------|
| Mark read/unread | Synced to server when back online |
| Delete email | Deletion executed on server when back online |
| Move to folder | Move performed when back online |
| Add/remove labels | Label changes synced when back online |
| Send email | Sent automatically when back online |
| Archive | Archive executed when back online |

### Queue Processing

The offline operation queue follows these rules:

- Operations execute automatically in order when the network is restored
- Each operation is retried up to 3 times
- Operations that still fail are marked as "Failed"; you can view the failure reason and manually retry or delete

:::info Optimistic Updates
Even while offline, the state you see in DesireCore updates immediately (e.g., marking an email as read instantly changes the UI). If the subsequent server sync fails, the state is rolled back.
:::

## Sync Settings

You can configure sync options individually for each account:

| Setting | Description |
|---------|-------------|
| **Sync interval** | Time between automatic polling cycles (in minutes); set to 0 to disable auto-sync |
| **New mail notification** | Whether to push notifications when new emails arrive |

## Next Steps

- [Accounts Home](./02-accounts-home.md) — Review the email management interface
- [Add Accounts](./03-add-accounts.md) — Add more email accounts
