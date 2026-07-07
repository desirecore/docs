---
title: User Profile
description: Edit your personal information, avatar, and display name in DesireCore.
keywords: [user, profile, avatar, name, personal information, settings]
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

DesireCore supports usage without login, all core functions are fully available in guest mode.

- **Guest Mode**: Data saved locally, no account registration needed
- **Logged-in User**: Access official cloud compute, subscriptions, credits, account profile, and selected online services

## Sign Up and Sign In

You can sign up or sign in with email. Registration uses an email OTP code, and password recovery also uses email OTP.

After signing in, DesireCore can sync account resources such as:

- official cloud model provider
- credit balance and expiring credits
- subscription status
- available partner models

## Sign Out

Signing out clears the local cloud-provider session state so expired tokens are not reused. It does not delete your local conversations, agents, files, or custom API keys.

:::info Local-first
Login only affects account, subscription, and cloud compute capabilities. Your core data remains stored on your local device.
:::
