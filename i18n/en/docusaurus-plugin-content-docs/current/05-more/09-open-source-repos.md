---
title: "Open Source Repositories"
description: "Overview of DesireCore's official open source repositories"
keywords: [open source, GitHub, repository, source code, contribute]
---

# Open Source Repositories

The DesireCore project maintains several official repositories on GitHub. Feel free to follow and contribute.

> **GitHub Organization**: [github.com/desirecore](https://github.com/desirecore)

## Core Repositories

| Repository | Description | Status |
|------------|-------------|--------|
| `desirecore` | DesireCore client main repository | Tentatively planned to open source after stabilization, subject to company funding and business strategy - not a final commitment. Decoupled modules will be open-sourced progressively |
| `desirecore-hostagent` | Native HostAgent platform code for GUI operations, device capabilities, discovery, pairing, and persistent execution | The macOS implementation is currently the GUI-operation carrier. Windows, Linux, other desktop, and mobile implementations remain under development. Tentatively planned to open source after stabilization, subject to company funding and business strategy, and not a final commitment |

:::info Current platform carriers
macOS GUI operations still run through HostAgent. To give Windows users local GUI automation before the native HostAgent is complete, Windows temporarily uses the independent third-party CUA Driver bundled with DesireCore. This does not mean HostAgent has been deprecated or replaced. Third-party components are not DesireCore official repositories; see [Third-Party Software and Licenses](./09-third-party-software.md).
:::

## Documentation & Distribution

| Repository | Description | Status |
|------------|-------------|--------|
| [docs](https://github.com/desirecore/docs) | DesireCore documentation repository (this site) | Public |
| [agent-os](https://github.com/desirecore/agent-os) | Official distribution — download installers for Windows, macOS, and Linux | Public |

## Service Repositories

| Repository | Description | Status |
|------------|-------------|--------|
| `release-manager` | Staged rollout management service - multi-channel gradual rollout, emergency halt, version management | Private |

## Ecosystem Repositories

| Repository | Description | Status |
|------------|-------------|--------|
| [registry](https://github.com/desirecore/registry) | Official app and service registry | Public |
| [market](https://github.com/desirecore/market) | Official marketplace repository | Public |
| [agent-desirecore](https://github.com/desirecore/agent-desirecore) | DesireCore default Agent | Public |
| [config-center](https://github.com/desirecore/config-center) | DesireCore configuration center | Public |
