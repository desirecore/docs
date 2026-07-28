---
title: Accounts Home
description: Understand the email management home page—account list, unread counts, unified inbox entry, and account status management.
keywords: [account management, email home, unread email, account status]
---

# Accounts Home

When you open email management, you first see the **Accounts Home**. It displays all your linked email accounts and an aggregate unread count.

## Page Overview

![Accounts home](/img/user-guide/email/accounts-home.png)

### Top Bar

The top bar shows summary information and action buttons:

- **Connected / Total** — Quick view of how many accounts are online
- **Unread count** — Total unread emails across all accounts
- **Add Account** — Click to open the add-account dialog

### Unified Inbox Entry

When you have **two or more** accounts linked, a prominent gradient card appears at the top of the account list. Click it to enter the [Unified Inbox](./04-unified-inbox.md) view.

### Account Cards

Each email account is displayed as a card:

![Account card](/img/user-guide/email/account-card.png)

| Element | Description |
|---------|-------------|
| Display name | The name you set for the account, or the email address |
| Connection status | Green "Connected" or red "Error" badge |
| Unread badge | Orange number showing unread count for this account |
| Provider info | Account type, authentication method, last sync time |
| Settings | Modify display name and other account options |
| Delete | Remove this account (confirmation required) |

**Click the card body** to enter that account's email list.

## Account Status

### Normal

The card shows a green "Connected" badge, and email sync is running normally.

### Authorization Expired

When OAuth authorization expires due to a password change, permission revocation, or similar:

- Card status changes to red "Error"
- An error message appears at the bottom of the card
- Click the card to re-authorize

DesireCore monitors authorization status in real time via WebSocket and updates the UI immediately when expiry is detected.

:::warning Re-authorize Promptly
Sync pauses when authorization expires. Complete the authorization flow again to restore access.
:::

### Account Settings

Click the **Settings** button on a card to modify the display name. Different account types have additional options:

| Setting | Description |
|---------|-------------|
| Display name | Name shown in the account list and email views |
| Sync interval | Time between automatic polling for new emails |
| New mail notification | Whether to push notifications for new emails |

## Deleting an Account

Click the **Delete** button on a card and confirm. This will:

- Disconnect from the email provider
- Clear locally stored email data and tokens
- Remove the account from the list

:::info No Impact on Original Emails
Deleting an account only clears local data in DesireCore. Emails on your email server are not affected.
:::

## Next Steps

- [Add Accounts](./03-add-accounts.md) — Learn how to add new email accounts
- [Unified Inbox](./04-unified-inbox.md) — Browse aggregated emails from multiple accounts
- [Reading Email](./05-reading-email.md) — Enter the single-account email view
