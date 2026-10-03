---
title: User Profile
description: Edit your profile, bind an email, manage accounts, and request invoices.
keywords: [user, profile, avatar, name, personal information, settings, email binding, account merge, invoices]
---

# User Profile

User Profile is your identity information in DesireCore. Agents will address you based on your profile, and you can also customize your avatar to make the interface more personal.

## Editing Personal Information

1. Click the **Avatar** or **Name** area in the top-left corner of the app
2. Enter the personal profile editing panel

Here you can modify the following information:

- **Name**: The name agents use when addressing you
- **Avatar**: The avatar displayed for you in the conversation interface

## Setting Avatar

DesireCore supports custom avatars:

1. In the personal profile panel, click the avatar area
2. Select a local image to upload
3. Supported image formats: JPEG, PNG, WebP

Avatars are saved in the local `~/.desirecore/config/avatar/` directory.

:::tip
We recommend using square images as avatars, the system will automatically crop them to circular display.
:::

## Display Name

Your display name appears in:

- Next to your messages in the conversation interface
- How agents address you in their replies

Click **Save** after modifying the name to take effect.

## Guest Mode and Login

You can use local conversations, agents, and files without signing in. Signing in also enables subscriptions, credits, and selected online services.

| Sign-in status | Available features |
|---|---|
| Guest mode | Local conversations, agents, and files; no account required |
| Signed in | Account profile, official cloud compute, subscriptions, credits, and selected online services |

## Sign Up and Sign In

Sign up or sign in with email. Registration requires email verification and password confirmation. Recover a forgotten password using an email verification code.

After signing in, DesireCore can sync account resources such as:

- official cloud model provider
- credit balance and expiring credits
- subscription status
- available partner models

## Bind an Email or Merge Accounts

After signing in, bind or change your email:

1. Open the profile panel and find the account information.
2. Enter the new email and complete the verification shown in the interface.
3. After binding, you can sign in with that email and your password.

### If the email belongs to another account

The interface guides you through merging accounts. Confirm that both accounts belong to you, choose which one to keep, and complete verification.

Check these details before merging:

- The other account will be permanently closed. A merge cannot be undone.
- Its balance, orders, and usage records will move to the retained account.
- Whether sign-in methods move depends on the options in the merge interface.

## Request an Invoice

After signing in, open **Invoices** in the profile panel:

1. Select eligible paid orders for the current account. Submit a single or batch request; each invoice corresponds to one order.
2. Select or create a personal or company invoice title.
3. Choose a general or eligible special VAT invoice and enter the delivery email. Remarks are optional.
4. Submit the request, then check its status and details under **Requests**.

| What you want to do | How it works |
|---|---|
| Manage invoice titles | Create, edit, delete, or set a default title |
| Request a special VAT invoice | Use a company title and complete the required company details |
| Cancel a request | Available only when the request's status allows cancellation |
| Receive the invoice again | Submit a **Resend** request; delivery is not immediate |

Requests are usually processed within 1–2 business days. Once issued, the tax bureau emails the PDF, OFD, or XML file to the delivery address. Check your spam folder if it has not arrived.

## Sign Out

Signing out clears the local cloud-provider session state so expired tokens are not reused. It does not delete your local conversations, agents, files, or custom API keys.

:::info Local-first
Login only affects account, subscription, and cloud compute capabilities. Your core data remains stored on your local device.
:::
