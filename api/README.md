# 公开 API 文档维护

`docs/07-api/` 维护公开接入指南，英文镜像位于 `i18n/en/docusaurus-plugin-content-docs/current/07-api/`。本目录维护经过筛选的端点来源、公开范围与验证记录，不进入 Docusaurus 文档路由。

## 公开范围

8 组中英文页面覆盖接入认证、Agent Webhook 管理与触发、只读 Agent/Run/回执、HTTP + Socket.IO 对话、模型代理、工作流与 OpenAPI 下载。24 个 HTTP 操作按服务分成三个自包含 OpenAPI 3.1 文件；对话事件和恢复规则维护在指南与可运行 Node.js 示例中。

Webhook 所有者管理依赖握手 `capabilities.webhookManagement: true`，由可信入口选择实际工具并生成文件范围快照；旧服务仅支持已有事件。该支持条件没有被改写成未经核对的客户端发行号。现有 Write/Bash 与审批模型保留，不把配置文件宣称为不可修改的安全边界。

默认 Caddy 未代理 `/health`、Workflow 路径或本机 Compat Proxy。三种服务的地址、认证和权限分别维护。Workflow 只公开管理员预置定义的触发与观察，不伪造直接运行所需 grant 的公开签发流程。

独立示例包在 [examples/agent-client](./examples/agent-client/README.md)，静态下载副本为 `static/api-examples/agent-client.mjs`；二者必须逐字一致。依赖和锁文件在示例目录维护，不改变站点依赖。

## 修改步骤

1. 固定核对的代码 SHA，核查实际 listener、路由、中间件、请求 Schema、响应和异步行为。
2. 在 `endpoint-catalog.json` 更新相应操作；同一服务中的方法与路径、全局 `operationId` 不重复。来源使用仓库相对路径，不填写本机绝对路径。
3. 修改对应中英文页面，保持字段、错误、版本约束和支持范围一致。一个能力由同一编辑负责人维护两种语言。
4. 使用隔离测试数据验证实际请求和关键失败。区分 Schema 检查、mock query 的路由测试、真实 listener 测试和真实模型运行。
5. 执行离线文档检查与双语构建，核对导航、代码复制、语言切换和窄屏阅读。
6. 根据 Git 发布流程发布；自动部署成功后再检查生产 URL。当前 sitemap 检查器访问生产地址，不能替代部署前的本地检查。

```bash
pnpm api:check
pnpm typecheck
pnpm build
pnpm api:check -- --build
```

`api:check` 检查清单、两种语言的显式 slug、JSON 示例、版本提示框及 OpenAPI 范围、引用、鉴权和下载链接；`--build` 额外读取本地 HTML 和 sitemap。它不读取私有源仓库、不访问生产 URL，也不证明翻译语义或接口运行已验收。

## 搜索索引维护

网站自动部署与 Algolia 索引更新是两个独立步骤。现有 DocSearch crawler 已在管理端发布 v5，调度为 `every 1 day`（每日一次）；部署成功不能证明新增页面已经收录。当前使用应用 `68TB6NUYVW`、索引 `DesireCore Docs` 和 crawler `26591011-cca2-4aaa-9c75-75f1f0b3fad5`；下次执行时间以管理端显示为准。

[去密钥配置参考](./algolia-crawler.config.js) 保存 v5 的路径、选择器、调度与索引设置，供审阅和后续维护。既有 Algolia 管理端保留认证，本仓不保存密钥；部署文档不自动应用此配置。`Crawler` 由 Algolia 配置运行环境提供，本地只需用 `node --check api/algolia-crawler.config.js` 检查语法，不把它作为站点脚本执行。

v5 只对 `/more/changelog/v10.0.180` 和 `/en/more/changelog/v10.0.180` 做定向分块：在爬虫内存中的 DOM 将每 10 条 `li` 合成一个临时 `p`，并关闭这两页的内容聚合。两页各 781 条原始列表均完整保留，网站正文不变；URL Tester 的 DocSearch helper 各产生 89 条记录，英文 Agent Webhook 对照页仍产生 110 条记录。其它页面保持原有提取方式。

2026-10-15 管理端账单显示当前使用免费的 DocSearch plan；[现行 DocSearch 条款](https://www.algolia.com/policies/docsearch-plan-specific-terms) 包含每月 5,000,000 个抓取资源额度。按上次全站 738 个 URL、每天完整抓取一次和 31 天估算，`738 × 31 = 22,878`，约占该额度的 `0.46%`。额外手动运行和站点增长另计；该估算不代替实际用量与套餐核对。

发布新增或调整后的 API 页面后，按以下步骤验收：

1. 先确认生产页面、canonical、robots、双语 sitemap 与正文正常。API 页应有可直接读取的 `.theme-doc-markdown`、标题及 `docsearch:language`、`docsearch:version`、`docsearch:docusaurus_tag` 元数据。
2. 在现有 crawler 的 URL Tester 中分别检查中英文页面的记录提取，再手动触发该 crawler 抓取。保留已保存配置和现有每日周期，不将编辑器草稿发布或新建密钥作为常规重抓步骤。
3. 等待该次抓取结束，记录时间、成功/忽略/失败 URL 数与索引记录数；检查失败原因，不能只看记录总数增长。先保留路径规则、选择器、调度等变量，只有抓取证据指向具体配置问题时再处理该项。
4. 按站点实际过滤条件查询：中文 `language:zh-Hans`、英文 `language:en`，并使用 `docusaurus_tag:default OR docs-default-current`。逐项检查 16 个双语 API 页面标题、代表性端点和两种语言的旧页面对照，确认返回目标 URL、`current` 版本和正确 tag；结果排名不要求固定第一。
5. 在网站搜索框分别查找“智能体 Webhook”和“Agent Webhook”，打开目标页面，再更新 [每日调度与分块验收记录](./search-daily-verification.json)。公开记录只保留必要的时间、配置、查询与结果证据，不保存密钥、账号身份、请求头或本机绝对路径。

首次收录时的 [v4 搜索验收记录](./search-verification.json) 保留当时的月度调度快照：2026-10-15 手动抓取使索引从 19,324 条增至 21,572 条，22 项查询及双语浏览器检查通过，但两篇 `v10.0.180` 更新日志因记录过大而失败。该历史记录不随 v5 改写；每日调度、定向分块和后续真实抓取结果单独记录，URL Tester 通过不等于整站抓取已全部通过。

## 清单字段

`pages` 列出本批公开页面的 `id`、源码 `file` 和稳定 `slug`。`endpoints` 使用以下字段：

| 字段 | 用途 |
|---|---|
| `operationId`、`service`、`method`、`path`、`doc` | 操作身份、所属服务、实际路径和正文来源 |
| `deploymentModes`、`authentication`、`permissions` | 支持范围、认证和额外权限条件 |
| `resultDelivery` | 实际响应与结果交付方式 |
| `source`、`schemaRefs` | 固定来源 SHA、路由/认证文件和已有 Schema |
| `effectiveVersion`、`versionEvidence` | 确需版本约束时记录依据；无约束时为 `null`，不得推断首次可用版本 |
| `securitySchemes` | 该操作的实际认证方案，与规范逐项一致 |
| `verification` | 验证记录和未覆盖范围 |
| `spec` | 对应服务的公开 OpenAPI 文件；未收录项才为 `null` |

遵循根 `AGENTS.md` 与 `README.md` 的生效版本和用户写作规范。已有明确版本不得改成默认值；协议修订、服务版本字段和客户端功能生效版本分别保留含义。

## 端点页面模板

一个能力的中英文页面按相同顺序组织，删除不适用的章节：

1. 用途、目标读者与当前支持范围。
2. 调用前准备：地址、凭据、配置和权限的实际获取方式。
3. 方法、路径、请求头、参数表与合法 JSON 示例。
4. 一次完整请求示例，以及实际响应和成功判定。
5. 异步结果的观察方法与尚未提供的能力。
6. 现行重试、去重、超时及恢复合同。
7. 实际错误表：状态、字段/机器码、触发条件与调用方动作。
8. 用户可操作的排查步骤和相关指南。

不要从模板补造响应壳、凭据签发、幂等或结果回调。来源、代码基线和验证记录写入本目录，用户正文只保留能帮助配置、调用和排查的技术细节。

## 当前验证记录

参见 [核查与验证](./verification.md)、[发布与验收摘要](./publication.json)、[生产逐项报告](./production-verification.json)、[首次搜索验收记录](./search-verification.json)及[每日调度与分块验收记录](./search-daily-verification.json)。后续更改认证、路由、配置入口或结果交付时，只重新核对受影响合同和相关示例，不将本批测试结果传播为其它功能的运行保证。
