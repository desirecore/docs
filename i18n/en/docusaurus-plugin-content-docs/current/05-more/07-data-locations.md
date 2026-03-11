---
title: Data Storage Locations
description: Data storage paths and directory descriptions for DesireCore on various platforms
keywords: [data storage, file path, macOS, Windows, Linux, directory]
---

# Data Storage Locations

DesireCore stores all data in the local file system, not relying on cloud servers to store your personal data.

## Platform Data Root Directories

| Platform | Data Root Directory |
|----------|---------------------|
| **macOS** | `~/.desirecore/` |
| **Windows** | `User folder\.desirecore\` |
| **Linux** | `~/.desirecore/` |

> `~` represents the user home directory. For example, on macOS: `/Users/your_username/.desirecore/`

## Directory Structure Details

| Directory | Purpose | Contents | Can Delete? |
|-----------|---------|----------|-------------|
| `config/` | Global configuration | User settings, preferences, API Key configuration | Restores defaults after deletion |
| `config/avatar/` | User avatar | JPEG/PNG/WebP format avatar files | Safe to delete |
| `agents/` | Agent本体 | Subdirectory for each agent (Git repository) | Loses agent data after deletion |
| `agents/desirecore/` | Core agent | DesireCore built-in agent | Auto-reinstalls after deletion |
| `users/` | User data | Personal profile, preferences, relationship memories with agents | Loses personalized data after deletion |
| `skills/` | Global skills | All installed global skill packs | Built-in skills auto-reinstall after deletion |
| `runs/` | Run records | Session records, task receipts | Safe to delete (loses history) |
| `cache/` | Cache | Index cache, relationship graph cache | Safe to delete (auto-rebuilds) |
| `logs/` | Logs | Runtime log files | Safe to delete |
| `market/` | Market data | Official market repository cache | Safe to delete (re-fetches) |

## Application Directory

DesireCore application installation paths:

| Platform | Application Path |
|----------|------------------|
| **macOS** | `/Applications/DesireCore.app` |
| **Windows** | `C:\Users\YourUsername\AppData\Local\Programs\desirecore\` |
| **Linux** | Depends on `AppImage` file location |

## Configuration Files

| File | Path | Description |
|------|------|-------------|
| User Config | `config/user-profile.json` | User basic info and preferences |
| Compute Config | `config/compute/` | API Key and provider configuration |
| Shortcuts Config | `config/shortcuts.json` | Custom keyboard shortcuts |

## Backup Recommendations

The following directories contain important non-reproducible data. Regular backup is recommended:

| Priority | Directory | Reason |
|----------|-----------|--------|
| **High** | `agents/` | All learning outcomes and configurations of agents |
| **High** | `users/` | Personal profile and relationship memories |
| **Medium** | `config/` | Personal settings and API Keys |
| **Medium** | `skills/` | User-defined skills |
| **Low** | `runs/` | Historical task records |

You can export all data as backup with one click through "Settings > Data & Privacy > Export Data".

## Clearing Data

In "Settings > Data & Privacy > Clear Local Data", you can selectively clear:

| Data Category | Clear Scope | Recoverable? |
|---------------|-------------|--------------|
| Conversation Records | Chat messages, session history, receipts | Not recoverable |
| Agents | Configurations, personas, memories (core agents auto-reinstall) | Not recoverable |
| Skills | Global skills (built-in skills auto-reinstall) | Not recoverable |
| Compute | Provider configurations, model lists | Not recoverable |
| User Profile | Identity, avatar, memory bank | Not recoverable |
| Cache & Logs | Index cache, log files | Auto-rebuilds |
