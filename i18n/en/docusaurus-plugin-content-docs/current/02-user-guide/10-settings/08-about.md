---
title: About & Updates
description: View DesireCore version information, check for updates, switch update channels, and consult legal documents.
keywords: [version, update, about, changelog, feedback, update channel, rollout, beta]
---

# About & Updates

On the "About" page you can view the current version, check for updates, and consult the Terms of Use and Privacy Policy.

## Viewing Current Version

1. Open the **Settings** panel
2. Scroll to the bottom **About** section
3. The **Version** line shows the currently installed version number

## Checking for Updates

:::info
The check for updates feature is available in the desktop client.
:::

### Automatic Check

DesireCore automatically queries the update server for new versions **every 5 minutes** after startup. No manual action is needed — the system silently checks in the background.

### Manual Check

1. In the About section, click the **Version** line
2. "Check for Updates" will appear on the right, click to start checking
3. Check results:
   - **Up to Date**: You're using the latest version
   - **New Version vX.X.X**: Update available, system will automatically start downloading
   - **Check Failed, Click to Retry**: Network anomaly, try again later

### Update Process

When a new version is detected:

1. The system automatically downloads the update package from the fastest available source, showing download progress percentage on the right
2. After download completes, a prompt appears: **"New version downloaded. Restart now?"**
3. Choose **Restart Now** to install the update; choose **Later** and you won't be prompted again for 24 hours

:::tip Multi-source Smart Download
DesireCore maintains multiple download sources (CDN, build servers, GitHub Releases, etc.). Before downloading, the system automatically **speed-tests** each source and picks the fastest one, improving download speed and reliability. If one source is unavailable, it automatically falls back to another.
:::

### Staged Rollout

New versions are typically delivered via **staged rollout**. This means a new version isn't pushed to everyone at once — it's first rolled out to a subset of users, and expanded to more users once stability is confirmed. If you haven't received an update yet, this is normal behavior. Please be patient.

## Update Channels

DesireCore provides two update channels:

| Channel | Description |
|---------|-------------|
| **Stable** | The default channel. Thoroughly tested releases suitable for most users |
| **Beta** | Early access to the latest features, may include changes that haven't been fully validated. Suitable for users willing to help test |

### Switching Update Channels

1. Open the **Settings** panel
2. Find **Update Channel** in the **About** section
3. Select **Stable** or **Beta**

After switching channels, the new channel will be used on the next automatic check.

:::caution
Switching to the Beta channel may result in receiving versions that are not yet fully stable. If you encounter issues, you can switch back to Stable at any time. Switching back does not automatically downgrade — you'll receive an update once a newer version is released on the Stable channel.
:::

## Legal Documents

In the About section, you can also consult:

- **Terms of Use**: DesireCore's usage agreement
- **Privacy Policy**: Data collection and processing statement

Click the corresponding item to view the full document.

## Feedback and Issue Reporting

If you encounter problems or have improvement suggestions while using:

- **GitHub Issues**: Submit an Issue in DesireCore's GitHub repository
- **Community Discussion**: Join the DesireCore community to participate in discussions
