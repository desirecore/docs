---
title: Web Access
description: Use Web Access v2 for dynamic pages, signed-in sites, local bookmarks, and site patterns.
keywords: [Web Access, Browser, CDP, SitePattern, LocalBookmarks]
---

# Web Access

Web Access v2 lets agents use a controlled browser when static fetching is not enough. It is useful for dynamic pages, signed-in dashboards, complex forms, single-page applications, internal systems, and pages that require screenshots.

## Enabling

Enable the relevant skill and permissions before using page actions, developer tools, site patterns, or local bookmarks. After taking control of a page yourself, you can ask the agent to continue in the same conversation. The recovery tool, `BrowserResume`, does not depend on these skills.

## Capabilities

| Capability | Description |
|------------|-------------|
| Tab control | Open, list, switch, and close browser tabs |
| Page actions | Click, scroll, type, and select elements |
| Screenshots | Capture page or element state for visual reasoning |
| CDP proxy | Use Chrome DevTools Protocol for finer page state |
| File upload | Select local files when needed; usually requires confirmation |
| Local bookmarks | Search Chrome/Edge bookmarks and history for URL hints |
| Site patterns | Record login entry points, selectors, action paths, and notes for a site |

## Browser tools and control

| Tool | Use it for |
|---|---|
| `BrowserAct` | Navigation, clicking, typing, waiting, and screenshots |
| `BrowserDevtools` | Inspecting or debugging network activity, cookies, site storage, console output, and performance; raw CDP calls |

Both tools check permission to operate the current session and follow approval rules.

### Letting the agent continue after manual interaction

1. Agent browser operations pause when you take control or interact with the controlled page yourself.
2. When you finish, ask the agent in the same conversation: “Continue working on this page.”
3. The agent rereads the page before continuing. Send the instruction to continue after the pause.

Resuming does not replay interrupted commands.

### Handling control errors

| Reported condition | What to do |
|---|---|
| Control was lost | Check who is operating the page before granting control again |
| Session closed or crashed | Check task progress before opening another session |
| Browser space was deleted | The old session is invalid; select or create an available space |

The error receipt explains the cause. Check the page and completed actions before retrying.

## SitePattern

SitePattern stores per-site experience that helps the agent remember how to use a particular website:

- Login entry points and common redirects
- Locations of search boxes, filters, and export buttons
- Common errors and popup-handling tips
- Pages that require waiting for dynamic content

Validation is performed before saving a site pattern to prevent invalid or overly broad rules.

## LocalBookmarks

LocalBookmarks searches the local browser's bookmarks and history for URL hints. It does not log in automatically or bypass permissions—it simply helps the agent find entry points to systems you use frequently.

## Safety

- Only `http` and `https` URLs are allowed by default
- Actions with external impact, such as file uploads, form submissions, deletions, or publications, trigger approval
- Browser sessions try to isolate tabs to avoid cross-task contamination
- Screenshots and page content enter the current task context; avoid opening unrelated tasks on sensitive pages

## Relationship to WebFetch / WebSearch

DesireCore's web capabilities are organized in three tiers. The agent automatically selects the lowest-cost option that can complete the task:

| Tier | Tool | Use case | Notes |
|------|------|----------|-------|
| 1 | WebSearch | Find public information, news, and technical docs | Returns search-result summaries without opening a browser |
| 2 | WebFetch | Read the body of a known URL | Smart content extraction, ad/navigation removal, 15-minute cache |
| 3 | Web Access | Dynamic pages, signed-in dashboards, SPA forms, screenshots | Launches a controlled browser and simulates real user interaction |

If static fetching is sufficient, the agent does not open a browser.

## Typical Scenarios

| Scenario | Recommended tool | Reason |
|----------|-----------------|--------|
| Look up API documentation | WebSearch | Public information; a search suffices |
| Read a blog post | WebFetch | Static page; direct content extraction |
| Check a management dashboard | Web Access | Requires login and page interaction |
| Operate a single-page application | Web Access | Content is dynamically rendered by JavaScript |
| Fill out and submit an online form | Web Access | Requires typing and clicking |
| Capture the current page state | Web Access | Requires screenshot capability |

:::tip Automatic Fallback
WebSearch itself has a fallback strategy: it prefers LLM server-side search, falls back to an independent search API, and only starts a browser sub-agent as a last resort. You do not need to choose manually; the agent decides based on the task.
:::
