---
title: Web Access
description: Use Web Access v2 for dynamic pages, signed-in sites, local bookmarks, and site patterns.
keywords: [Web Access, Browser, CDP, SitePattern, LocalBookmarks]
---

# Web Access

Web Access v2 lets agents use a controlled browser when static fetching is not enough. It is useful for dynamic pages, signed-in dashboards, complex forms, single-page applications, internal systems, and pages that require screenshots.

## Enabling

Web Access is a skill-scoped capability. Browser control, CDP proxy, site-pattern, and local-bookmarks tools are only exposed when the related skill is active. This prevents ordinary tasks from accidentally using browser tools and lets you know when an agent may interact with web pages.

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
