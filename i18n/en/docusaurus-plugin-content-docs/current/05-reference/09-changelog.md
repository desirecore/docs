---
title: "Changelog"
description: "DesireCore version changelog"
keywords: [changelog, version history, release notes]
---

# Changelog

This page records important changes in each version of DesireCore.

---

## DesireCore v10.0.4

### Bug Fixes
- Fixed an issue in packaged Windows builds where certificate directory permission errors could cause the app to behave abnormally, resulting in more reliable startup and runtime behavior after installation.

### Improvements
- Improved how certificate resources are handled in the app, increasing compatibility and usability for packaged builds across different environments.

---

## DesireCore v10.0.3

### New Features
- **Skill Import**: Support importing skills directly from local folders, lowering the barrier to entry
- **File Reference Passing**: followUp paths now support image and file reference passing, maintaining file context across multi-turn conversations

### Bug Fixes
- Fixed an issue where the Agent detail page form didn't update immediately after switching engines
- Fixed an undefined error with InputArea's setFileRefs
- Fixed compatibility issue with legacy Agent data where the version field was a string format
- Fixed an issue where user-uploaded images were silently dropped in V1 paths
- Fixed an issue where user messages displayed raw XML tags after page refresh

### Improvements
- Migrated file reference state from component-local state to global store for better consistency across components

---

## DesireCore v10.0.2

### New Features
- **Conversation Draft Persistence**: Drafts in the input box are now saved per conversation and automatically restored when you return to a chat.
- **Virtualized Email List and Skeleton Loading**: The email resource now feels smoother with large inboxes and provides clearer loading placeholders while content is being fetched.
- **Automatic Mail Label Sync After Authorization**: After connecting your mailbox, labels and categories are synced automatically so you can get started faster.

### Bug Fixes
- Fixed an issue where messages could appear in the wrong conversation during parallel Agent execution.
- Fixed a problem where the Dock badge could sometimes remain visible after tasks had already finished.

### Improvements
- Improved the three-column mail layout and sidebar presentation for a clearer, more comfortable browsing experience.
- Improved mailbox authorization checks so connection status is more explicit during setup.
- Improved the desktop release distribution process to make getting and installing new versions more reliable.

---

## DesireCore v10.0.1

### New Features
- **Version Check and Update in About**: You can now check your current version status and trigger updates directly from the About section in Settings, making desktop app upgrades more convenient.

### Improvements
- The About section in Settings has been enhanced with clearer version and update information for a more user-friendly experience.

---

## DesireCore v10.0.0

### New Features
- **Mail Center**: Added a full email workflow with unified inbox, conversation view, search and filters, attachment downloads, quick reply, bulk actions, and support for Gmail, Outlook, and IMAP/SMTP accounts.
- **HostAgent Device Pairing**: You can now discover, pair, and authenticate HostAgent devices directly in the app for easier external device connectivity.
- **Upgraded Approval System**: Added a more complete approval experience with AI-assisted approvals, per-agent preferences, and clearer confirmation flows for important actions.
- **Task Scheduling**: Introduced scheduling capabilities so Agents can handle longer-running tasks and automations more reliably.
- **Skill Import**: You can now import skills directly, with smarter address validation during setup to reduce configuration friction.
- **MCP Service Installation & Management**: Added install, enable, disable, and remove flows for services, making available tools easier to manage.
- **Selective Data Cleanup**: Added category-based local data cleanup so users can manage cache and privacy data more precisely.
- **Editor Shortcuts**: Added an editor shortcut system with custom Markdown shortcuts to speed up writing and editing.
- **GUI Desktop Automation**: Added desktop automation capabilities so Agents can perform more actions through graphical interfaces.
- **Mail Reply & Label Management**: Added direct email reply and label/category management to make daily mail handling faster.

### Bug Fixes
- Fixed multiple UI and data display issues in the resource management panel, making information more accurate and stable.
- Fixed broken chat panel layouts in split-screen mode for a more reliable dual-pane experience.
- Fixed approval card state restoration and streaming message consistency issues, making longer workflows feel smoother.
- Fixed stability issues after reauthorizing mail accounts, improving mailbox reliability.
- Fixed multiple issues with Outlook categories, the reauthorization landing flow, and IMAP mailboxes for a smoother email experience.
- Fixed styling issues in the settings modal and several other visual inconsistencies across the app.
- Fixed crashes and leftover data when clearing chat history, making history cleanup more complete.
- Fixed authorization prompts, expired authorization handling, and read/unread state issues so mail status is reflected more accurately.
- Fixed reliability issues in HostAgent discovery and connection flows, improving pairing success rates.
- Fixed PIM permission checks that could unintentionally launch system apps, making startup quieter and less disruptive.
- Fixed long silent timeouts for PIM commands when permissions were missing, so permission problems are reported faster.
- Fixed cross-origin errors during Agent export, making export flows more dependable.
- Fixed multiple issues affecting chat history, topic restoration, and message continuity, improving conversation context.
- Fixed default engine and Agent create/delete synchronization issues, so Agent state updates appear more promptly.
- Fixed an issue where requests could still use the old model after switching models, so model changes now apply correctly.

### Improvements
- **Updated About Page**: Improved the About page so version and product information are clearer.
- Further reduced app package size for lighter downloads and installs.
- Improved macOS signing and notarization behavior, reducing system security warnings when opening the app.
- Gmail now supports syncing system labels and downloading all mail content at once for easier mailbox organization.
- Improved email browsing with infinite scrolling, auto-sync, and clearer account status display.
- Improved mail composition and draft syncing for a more natural writing experience.
- Further optimized resource management and responsive layouts on smaller windows for better usability across screen sizes.
- Sessions can now recover automatically after restart with silent retries, reducing interruptions.
- Added automatic retry for empty responses to improve the success rate of conversations when a reply fails to arrive.
- Improved PIM permission request handling and scroll preservation for a smoother system authorization flow.
- Continued improvements to chat search, paginated history loading, topic restoration, and memory for better long-term usability.
- Expanded notifications, live run status, cost tracking, and reasoning visibility so Agent activity is easier to follow.
- Refined the first-run welcome experience and overall visual polish to make onboarding feel smoother.

---
:::info Version Note
DesireCore uses Semantic Versioning. Each version number follows the format `major.minor.patch`.
:::
