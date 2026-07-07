---
title: Web Access
description: Use Web Access v2 for dynamic pages, signed-in sites, local bookmarks, and site patterns.
keywords: [Web Access, Browser, CDP, SitePattern, LocalBookmarks]
---

# Web Access

Web Access v2 lets agents use a controlled browser when static fetching is not enough. It is useful for dynamic pages, signed-in dashboards, complex forms, internal systems, and pages that require screenshots.

## Skill-scoped Tools

Web Access tools are exposed only when the related skill is active. This prevents regular tasks from using heavy or higher-permission browser tools by accident.

## Capabilities

| Capability | Description |
|------------|-------------|
| Tab control | Open, list, switch, and close tabs |
| Page actions | Click, scroll, type, and inspect elements |
| Screenshots | Capture page state for visual reasoning |
| CDP proxy | Use Chrome DevTools Protocol for richer page state |
| File upload | Select local files when approved |
| Local bookmarks | Search browser bookmarks and history hints |
| Site patterns | Reuse known selectors, entry points, and workflow notes |

## Safety

Only `http` and `https` URLs are allowed by default. Actions with external impact, such as uploads, submissions, deletion, or publishing, go through approval.

