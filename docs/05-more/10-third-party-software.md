---
title: 第三方软件与许可
description: 了解 DesireCore 随附的 CUA Driver、Git、Python 和 Node.js 等独立第三方组件及其许可边界。
keywords: [第三方软件, 开源许可, CUA Driver, Git, Python, Node.js, GPL, MIT]
---

# 第三方软件与许可

DesireCore 为提供开箱即用的本地能力，会随安装包提供若干独立的第三方程序或运行时归档。它们由各自的权利人开发，并按照各自的许可证提供；将其随 DesireCore 分发不代表 DesireCore 获得其商标、著作权或其他所有权，也不代表上游项目对 DesireCore 作出背书。

本页是面向用户的概要，不替代安装包、组件归档或对应发布页面提供的完整许可文本。确切版本、版权声明和许可文本以你所安装版本随附的材料为准。

## 当前随附组件

| 组件 | 在 DesireCore 中的用途 | 当前来源与许可概要 |
|------|-----------------------|-------------------|
| CUA Driver | Windows HostAgent 完成前的本机 GUI 自动化过渡载体；作为独立 MCP 子进程运行 | [trycua/cua](https://github.com/trycua/cua)，上游仓库标注 MIT License |
| Git | AgentFS 版本记录、检查点及仓库操作；作为独立命令行子进程运行 | [Git](https://git-scm.com/about) 为 GPLv2；当前可移植构建来自 [dugite-native](https://github.com/desktop/dugite-native) |
| Python | 由 Hatch 管理的推荐 Python 运行时，可从安装包内归档离线导入 | CPython 主要适用 [PSF License Version 2](https://docs.python.org/3/license.html)；归档来自 [python-build-standalone](https://github.com/astral-sh/python-build-standalone)，并含多项依赖许可 |
| Node.js | 由 Volta 管理的推荐 Node.js 运行时，可从安装包内官方归档离线导入 | Node.js 主体使用 MIT License，官方归档同时包含多项 [第三方许可](https://github.com/nodejs/node/blob/main/LICENSE) |

当前发布清单对应 CUA Driver 0.7.1、Git 2.53.0、Python 3.13.9 和 Node.js 24.18.0。后续版本可能升级这些组件，请以当前安装包显示的版本和随附声明为准。

CUA Driver 只描述当前 Windows 过渡路径。macOS 的 GUI 操作仍由 DesireCore HostAgent 承载；Windows、Linux、其他桌面与移动端 HostAgent 的后续实现不属于 CUA Driver 的许可或责任范围。

## 为什么许可不能只看一个名称

“Python 使用 PSF License”或“Node.js 使用 MIT License”只描述了主体项目，不能自动概括整个二进制归档：

- Python 独立发行版会链接或包含 OpenSSL、libffi、SQLite 等组件。python-build-standalone 明确要求下游查看发行版中的许可元数据和许可文本；不同构建日期、平台与功能组合可能不同。
- Node.js 的官方 `LICENSE` 除主体 MIT 条款外，还逐项列出其内含依赖的许可和归属信息。
- Git 使用 GPLv2。分发 Git 二进制时，需要按 GPLv2 提供与该二进制精确对应的完整源码，或采用许可证允许的有效书面提供方式；不能只假设用户可从上游找到任意版本源码。
- 宽松许可证通常也要求保留版权与许可声明；“可免费使用”不等于“没有条件”。

因此，DesireCore 将这些内容视为独立第三方分发物，并按发布版本保留版本记录、来源和许可材料。当前内置 Git 的对应源码包括 [Git 2.53.0](https://github.com/git/git/tree/v2.53.0) 与 [dugite-native v2.53.0-3 构建脚本](https://github.com/desktop/dugite-native/tree/v2.53.0-3)。

## 对普通使用和再分发的影响

仅在 DesireCore 内使用这些随附组件时，通常不需要你单独安装，也不改变你在 DesireCore 中创建的文档、代码或其他内容的权利归属。

如果你复制安装包、单独提取组件、制作修改版或向第三方再分发，则可能承担额外的署名、许可文本、对应源码、修改说明或商标使用义务。你应自行核对拟分发版本中的完整许可材料；本页不构成针对具体用途的法律意见。

第三方组件按其各自许可提供，并可能包含“按现状提供”、无担保或责任限制条款。DesireCore 不承诺这些组件适用于所有设备、应用或特定目的，也无法控制上游项目未来的版本、兼容性、漏洞修复或服务可用性。更多使用边界见 [用户协议](../terms.md)。

## 核对来源

- [CUA 官方仓库与 MIT License](https://github.com/trycua/cua)
- [Git 官方许可说明](https://git-scm.com/about)与 [GPLv2 完整文本](https://www.gnu.org/licenses/old-licenses/gpl-2.0.html)
- [Python 官方许可](https://docs.python.org/3/license.html)与 [python-build-standalone 许可说明](https://gregoryszorc.com/docs/python-build-standalone/main/running.html#licensing)
- [Node.js 官方发布归档](https://nodejs.org/en/download)与 [Node.js LICENSE](https://github.com/nodejs/node/blob/main/LICENSE)
