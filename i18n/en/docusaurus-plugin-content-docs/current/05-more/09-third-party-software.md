---
title: Third-Party Software and Licenses
description: Understand the independent third-party components shipped with DesireCore, including CUA Driver, Git, Python, and Node.js.
keywords: [third-party software, open-source licenses, CUA Driver, Git, Python, Node.js, GPL, MIT]
---

# Third-Party Software and Licenses

DesireCore ships several independent third-party programs or runtime archives to provide local capabilities out of the box. They are developed by their respective rights holders and supplied under their own licenses. Distribution with DesireCore does not transfer their trademarks, copyrights, or other ownership to DesireCore, and does not imply endorsement by the upstream projects.

This page is a user-facing summary. It does not replace the complete license texts supplied with the installer, component archive, or corresponding release page. The materials accompanying your installed release control for exact versions, copyright notices, and license terms.

## Currently Bundled Components

| Component | Use in DesireCore | Current source and license summary |
|-----------|-------------------|------------------------------------|
| CUA Driver | Transitional local Windows GUI carrier until Windows HostAgent is complete, run as an independent MCP subprocess | [trycua/cua](https://github.com/trycua/cua); the upstream repository identifies the project as MIT-licensed |
| Git | AgentFS history, checkpoints, and repository operations, run as an independent command-line subprocess | [Git](https://git-scm.com/about) is GPLv2; the current portable build comes from [dugite-native](https://github.com/desktop/dugite-native) |
| Python | Recommended Hatch-managed Python runtime that can be imported offline from an archive in the installer | CPython is primarily under the [PSF License Version 2](https://docs.python.org/3/license.html); the archive comes from [python-build-standalone](https://github.com/astral-sh/python-build-standalone) and contains dependencies under additional licenses |
| Node.js | Recommended Volta-managed Node.js runtime that can be imported offline from an official archive in the installer | The Node.js core is MIT-licensed; the official archive also includes software under multiple [third-party licenses](https://github.com/nodejs/node/blob/main/LICENSE) |

The current release manifest identifies CUA Driver 0.7.1, Git 2.53.0, Python 3.13.9, and Node.js 24.18.0. Future releases may upgrade these components. Refer to the versions and notices supplied with the installed release.

CUA Driver describes only the current transitional Windows path. macOS GUI operations still run through DesireCore HostAgent. Future HostAgent implementations for Windows, Linux, other desktop systems, and mobile platforms are outside CUA Driver's license and responsibility boundary.

## Why One License Name Is Not Enough

Statements such as “Python uses the PSF License” or “Node.js uses the MIT License” describe the main project, but do not automatically describe an entire binary archive:

- A standalone Python distribution links or includes components such as OpenSSL, libffi, and SQLite. python-build-standalone directs downstream consumers to inspect each distribution's license metadata and license texts; the set can vary by build date, platform, and feature selection.
- The official Node.js `LICENSE` lists attribution and license terms for dependencies in addition to the core MIT terms.
- Git is GPLv2 software. A distributor of Git binaries must provide the complete corresponding source for that exact binary, or use another valid method allowed by GPLv2. It is not sufficient to assume that users can locate an arbitrary upstream version.
- Permissive licenses commonly still require copyright and license notices to be retained. “Free to use” does not mean “without conditions.”

DesireCore therefore treats these as separate third-party distributions and retains release-specific version, source, and license materials. Corresponding sources for the current bundled Git include [Git 2.53.0](https://github.com/git/git/tree/v2.53.0) and the [dugite-native v2.53.0-3 build scripts](https://github.com/desktop/dugite-native/tree/v2.53.0-3).

## Ordinary Use and Redistribution

Using these bundled components within DesireCore normally requires no separate installation and does not change ownership of documents, code, or other content you create with DesireCore.

If you copy the installer, extract a component, produce a modified build, or redistribute it to third parties, additional attribution, license-text, corresponding-source, change-notice, or trademark obligations may apply. You are responsible for reviewing the complete license materials in the version you intend to distribute. This page is not legal advice for a specific use case.

Third-party components are supplied under their respective licenses and may include “as is,” no-warranty, and limitation-of-liability terms. DesireCore does not promise that they will work with every device, application, or purpose, and cannot control future upstream versions, compatibility, security fixes, or service availability. See the [Terms of Service](../terms.md) for additional use boundaries.

## Primary Sources

- [CUA official repository and MIT License](https://github.com/trycua/cua)
- [Git official license summary](https://git-scm.com/about) and [full GPLv2 text](https://www.gnu.org/licenses/old-licenses/gpl-2.0.html)
- [Python official license](https://docs.python.org/3/license.html) and [python-build-standalone licensing notes](https://gregoryszorc.com/docs/python-build-standalone/main/running.html#licensing)
- [Official Node.js downloads](https://nodejs.org/en/download) and [Node.js LICENSE](https://github.com/nodejs/node/blob/main/LICENSE)
