# API 完整实施核查与验证

更新日期：2026-10-15。本次在首批基础上实现全部选定公开能力；以下验证按层记录，不将本机假上游、真实服务 listener 与商业模型或安装包验收混为一项。

## 当前来源与范围

- 最终主仓合并：`e45f22902af2dc45b109cfa8f454795538aea2ed`（PR #4798），完整CI通过。原定向测试基线为 `d3bac348db5f15ce6a59469ffef8f495c84ced59` / `74058cea9`；最终差异另记，未把旧测试写成新快照实跑。
- 最终内部文档指针：`9cc47fc9216db4a3803a982f00649f7af667c933`，已直接从远程成功获取；原核查快照 `10b6007b7e46477ee4df2e15563f09c1ab7bd1fe` 的记录保留。
- 原有开发工作树的 `docs` 与 `package-lock.json` 修改、个人 Agent 仓库的本地提交均保留；实现使用隔离 checkout 与数据根。
- 8 组双语页面；24 个 HTTP 操作；三个自包含 OpenAPI 3.1 子集；独立 Node.js 客户端及逐字相同的下载副本。
- 内部盘点先覆盖79份非归档 API Markdown、817个字面量路由调用；加入新管理合同并扩展当前 Agent Service 扫描后，固定快照覆盖80份、855个 Babel AST 字面量路由调用；另核读并行新增的应用接口后台账共81份。AST仅作发现，动态路径及条件装配不能由此证明；公开24个操作另核验认证、Schema和结果方式。

## 接入缺口与代码修复

Webhook 新管理入口复用 owner 治理和 Agent 原子写入，服务解析所选实际工具及文件范围，调用方不能提交权限对象。首次 secret 与轮换值只返回一次，读取不返回 secret；触发仍使用 Agent 级共享 secret。配置在等待写锁时变化返回 `409 webhook_configuration_changed`，防止保存旧配置下的授权快照。新能力由握手 `webhookManagement` 检测，没有伪造首次客户端发行号。

配置并非不可修改的可信签名体系。授权 Write、Bash 或系统文件写仍遵循既有审批并可以修改有效范围内的配置；指南给出最小工具授权建议。通用 Webhook 幂等、请求级 Run ID、结果回调与自动最终回答交付未新增。

Compat Proxy 地址事实抽到轻量叶子模块，生命周期 owner 在监听成功/真实关闭后更新；`ComputeCredential list` 给出实际含 `/v1` 的本机 Base URL。默认 `get` 安全 token 输出和真实 Key 治理保持现行合同。

合并最新 `dev` 时保留上游宿主认证治理规则、本次 Webhook 管理规则和双方内部文档；没有丢弃功能逻辑。最新 query 的可选应用准入与后台工具过滤按当前基线重新校准规范和测试。

## 定向验证

| 范围 | 最终结果与边界 |
|---|---|
| 最新源码7个unit文件 | 112通过：管理12、代理地址2、ComputeCredential62、代理生命周期2、治理21、URL编码5、握手8 |
| 真实 Webhook 管理/执行 | owner认证、AgentFS原子写、生产运行时与工具执行、SendUserMessage持久交付、轮换、provider400后台失败、停用和删除；仅模型上游为回环假SSE |
| 代理安全 token | 15通过；真实本机HTTP鉴权、吊销及Provider绑定 |
| 代理协议 | 18通过、31未选择；Messages/Chat Completions转换和直通、非流式/流式、软硬截断、model错误、Models鉴权和地址生命周期 |
| Workflow | 4通过；独立真实standalone、Node code节点、Webhook→SSE→持久history，重连终态、错误凭据、缺grant与退役写入拒绝 |
| Node客户端独立合同 | 12通过；HTTP与Socket事件关联、先于响应的事件、丢确认、重连、保守恢复、内容冲突、中断和显式取消；实例与执行均为夹具 |
| Node客户端实际路由 | 真实HTTP/Socket鉴权、query Schema/digest、持久准入与lookup、renderer房间；执行runtime仍为替身 |
| 类型与依赖边界 | 主仓13个受影响TypeScript边界通过，local profile总并行3；依赖边界检查通过 |
| 内部文档 | 37模块结构检查无问题；ADR引用通过；claim检查通过，既有未锚定提示不作为本轮新增声明 |

CAS回归使用受控writer钩子证明冲突分支无事件写入和无secret生成；不宣称实测真实写锁并发时序。真实集成验证正常原子持久写与运行交付。成功Webhook回执的工具计数仍为0，不能据此宣称完整工具调用审计已验收。

网站typecheck精确排除 `api/examples/agent-client/test/source-route.fixture.ts`：该维护夹具须复制到私有源码测试目录才能解析其真实内部导入，不能当作网站源码编译。独立示例的执行合同与源码路由集成分别验证。

## 文档、规范与发布

`pnpm api:check` 当前覆盖8组双语页、24操作、44 JSON示例块、3规范。规范保留实际Draft-07合同，以OpenAPI3.1的`jsonSchemaDialect`声明；没有把改写的元Schema检验算作真实OpenAPI验收。

最新定向回归共10文件118通过（unit112、服务integration5、Node实际路由integration1），独立客户端12及额外代理33用例分别记录。后续两次 rebase 和文档指针修正只改变 docs；接口代码与已测完整代码树一致，未重复计算测试数。

三份真实Redocly CLI2.63.0规范检验均0错误：Agent Service保留47条现有条件Schema告警，另外两份无告警。AJV Draft07验证51个Schema与34个media示例通过。

网站 `pnpm typecheck`、双语 `pnpm build`、`pnpm api:check -- --build` 通过。后者核对HTML、canonical、hreflang、sitemap及两语言的3个spec和Node示例下载副本字节。1440、1280、1024、375宽度下六个API主/新页面均无整页水平溢出；中文对话指南切换英文后仍在同页。复制按钮反馈成功，浏览器提供的剪贴板读数为空，未声称核验剪贴板内容。

源码 PR：[desirecore/desirecore#4798](https://github.com/desirecore/desirecore/pull/4798)。内部文档合并保留并行应用开发文档，指定gitlink已可达远程main。公开文档 PR：[desirecore/docs#72](https://github.com/desirecore/docs/pull/72)，Vercel预览与CLA通过；自动部署结果待回写。CodeQL发现XML实体串联替换可重复解码，已改为单次匹配，并验证五类实体、嵌套编码和未知实体。尚未宣称生产部署成功。未验证商业模型、公网Caddy/TLS部署、已发行桌面安装包或用户业务副作用；新能力按实际服务支持条件使用。

---

# 首批接入基础与 Webhook 核查记录（2026-10-13 历史）

核查日期：2026-10-13。公开范围为部署所有者的实例连接，以及管理员已预配置事件的 Webhook 调用参考。该记录保留来源与验证边界，不作为所有接口或客户端发行版的运行保证。

## 固定来源

| 来源 | 基线 |
|---|---|
| `desirecore` 的 `dev` | `2bb7add4497c6068a977b248106e922f9dfb196b` |
| 内部文档 | `0b84089da1f7c050ccdab6f2912b36a8fcdb8802` |
| 公开文档的变更前基线 | `34fb4a7cbc8bd2f453ee79536981d22c7448373b` |
| 验证 checkout 的 drawio 子模块 | `88ee1f5ab4d40603a8f3aaa0d9d6dc3794c6b3f0` |

验证 checkout 使用固定主仓 SHA，子模块初始化并拉取最新代码；内部 docs 子模块比该主仓指针更新，记录在上表。复用已有 Node 依赖，Vitest 的 workspace 源码 alias 指向固定 checkout，未替换原有开发工作树或修改客户端源码。

客户端版本号和发行 tag 仅用作来源线索。本批没有确认功能首次发行版本，没有为原本无版本约束的部署说明新增客户端生效版本要求。页面中的 `serverVersion: "10.0.180"` 是通过 Schema 的结构示例，实际值取自服务响应。

## 合同核对与发现

| 内容 | 核对的相对源路径 | 结果 |
|---|---|---|
| 地址和所有者凭据 | `deploy/README.md`、`scripts/dev/provision-instance.ts`、`packages/agent-service/src/standalone.ts` | 使用已有实例的交付 HTTPS origin 和启动 token；不能猜容器内部端口或临时生成值去认证旧进程 |
| 公网路径 | `deploy/Caddyfile` | 默认代理 `/api/*`，不代理 `/health`；外部探活改用认证握手 |
| 握手和就绪 | `routes/client-handshake-routes.ts`、`service-metadata.ts`、`readiness.ts`、`http-server.ts`（均在 Agent Service 下） | `200` 元数据、`503 service_not_ready` 和认证检查互有独立含义；握手不签发 token |
| Webhook 请求与认证 | `packages/agent-service/src/routes/webhook-routes.ts`、`auth/instance-auth.ts`、`packages/schemas/src/agent-service/webhook.ts` | 专用 Bearer secret、封闭顶层字段、1 MiB、立即接收响应；无请求级执行 ID 和去重 |
| 事件创建 | `app/components/resources/agents/components/AgentFormEditor.tsx`、`app/lib/rjsf/adapters/agent/schema-transformer.ts`、Agent/Webhook Schema、`builtin-tools/agent-manage.ts` | 表单序列化与默认值处理没有生成必需运行权限配置的可信流程；本批不提供从零创建教程 |
| 结果交付 | `packages/agent-service/src/session/store.ts`、`scheduler/background-delivery.ts`、`routes/schedule-routes.ts`、`app/components/chat/ChatArea.tsx` | Webhook 普通最终回答不自动进入聊天；主动 SendUserMessage 交付有独立通道，不是请求级终态查询 |
| 原内部响应说明 | 内部 `功能/智能体核心/API/智能体功能扩展.md` 的 Webhook 章节 | 仍有旧 `{success,message}` 示例；公开页改用现行 `{accepted,agentId,event}`，内部校准留在后续任务 |

## 固定源码验证

复用既有隔离测试，并针对实际公开示例建立一次性验证 fixture。最终通过 **111 项测试**：

| 文件 | 最终通过数 | 验证层 |
|---|---:|---|
| `instance-auth.test.ts` | 68 | 实例认证单元测试 |
| `client-handshake-routes.test.ts` | 8 | 真实握手路由的 inject 测试 |
| `readiness.test.ts` | 4 | 就绪门单元测试 |
| `webhook-permissions.test.ts` | 9 | 事件权限 Schema 与运行时求交 |
| `webhook-state.test.ts` | 8 | 独立临时数据根的状态记录 |
| `webhook-prompt-manifest.test.ts` | 1 | 真实处理器，查询及存储替身 |
| 一次性 `webhook-public-contract.validation.test.ts` | 8 | 真实认证、secret、路由和 Schema，查询与存储为替身 |
| `server-readiness.integration.test.ts` | 1 | 真实回环 HTTPS listener 和 Socket.IO，独立数据根 |
| 一次性 `api-public-examples.validation.test.ts` | 4 | 中英文握手响应和 Webhook 请求通过固定源码 Schema |

最终通过数不包括重跑中的重复用例。一次性 Webhook 分支 fixture 首轮有一处错误预期：测试将 `failRun` 的分类误写为错误详情文本；源码实际传固定分类 `error`。修正 fixture 后 8 项全部通过，客户端源码未修改。

实际执行的最终有效命令（在固定源码 checkout 内）：

```bash
npm test -- packages/agent-service/src/__tests__/instance-auth.test.ts packages/agent-service/src/routes/client-handshake-routes.test.ts packages/agent-service/src/readiness.test.ts packages/agent-service/src/__tests__/webhook-permissions.test.ts packages/agent-service/src/routes/__tests__/webhook-state.test.ts packages/agent-service/src/routes/__tests__/webhook-prompt-manifest.test.ts
npm test -- packages/agent-service/src/routes/__tests__/webhook-public-contract.validation.test.ts
npm run test:integration -- packages/agent-service/src/__tests__/server-readiness.integration.test.ts
npm test -- packages/agent-service/src/routes/__tests__/api-public-examples.validation.test.ts
```

执行时使用等价的 `node_modules/.bin/vitest run --project unit|integration <指定文件>`，只运行指定文件，未运行全量或多个 project。一次性 fixture 保留在本轮验证工作树，不属于已发布的客户端源码或公开仓库测试套件。

Webhook 分支验证覆盖：secret 错误的 `401` 在解析 body 之前返回；远程未配置 secret 的 `403`；目标不存在或未启用的 `404`；字段/事件名/畸形 JSON 的 `400`；已认证超大 body 的 `413`；`200 accepted` 无 Run ID；接收后的模拟查询失败不回写 HTTP 响应。

回环集成验证服务未就绪时的 HTTP/Socket.IO 拒绝，以及恢复后握手成功。它没有启动 Caddy 容器、外部公开域名或真实模型。

## 文档与站点验证

- 接入、Webhook 和排错分别由 subAgent 核查并完成双语文件，随后交叉只读审阅。未发现凭据、响应或结果范围的语义冲突。
- `pnpm api:check`：4 组双语页面、2 个端点、16 个 JSON 代码块通过。
- 校验器的 7 组临时正反例覆盖唯一性、非法 JSON、双语 slug/版本/章节差异和缺失构建产物；临时文件已清理。
- `pnpm typecheck`：通过。
- `pnpm build`：中文和英文生产构建均通过，无新增断链。构建输出有既有依赖提示；新文件尚未进入 Git 时无法推断其 sitemap 更新日期，不影响页面生成。
- `pnpm api:check -- --build`：读取本地 HTML、canonical、hreflang 和两语言 sitemap 通过；脚本接受 package runner 的 `--` 分隔符，不访问生产网址。
- 本地浏览器检查了 1440、1280、1024、375 像素宽度：导航折叠、API sidebar、Webhook 正文和表格阅读成立，所检查页面无整页水平溢出。
- 从中文 Webhook 页切换语言后仍处于英文同页；代码复制按钮反馈成功。当前浏览器没有提供可核对的剪贴板文本，未把反馈等同于剪贴板内容验证。

## 未覆盖与后续任务

本批没有验证管理员从零创建事件、真实模型处理、主动用户交付或安装包内完整操作流程，不能把 111 项定向测试解释成这些流程的验收。

Webhook 没有稳定请求关联、幂等键、请求级终态查询或结果回调。普通最终回答不自动交付，所以参考页明确限定已预配置事件，说明接收反馈和结果观察条件。新增可信配置入口或可靠生产投递需要独立产品/代码合同。

本轮完成本地文档实施和验证，尚未进行 Git 发布、自动部署、生产 sitemap 和搜索收录检查。完整内部端点盘点、内部旧正文校准、其它 API 与 OpenAPI 仍按 `PLAN.md` 后续任务推进。

## CI 归因与依赖修正（2026-10-14）

公开文档 PR #72 的 XML 重复解码问题已修复：真实解码函数的4组实体/嵌套编码/未知实体回归与构建检查通过，新一轮 CodeQL、CLA、Vercel 均通过。

源码 #4798 首轮 unit 有18失败，其中2项为新 `webhookManagement` 能力未加入 service-metadata 的完整响应期望，已仅修正测试并单文件4/4通过（提交 `74058cea9dd59ad79a02b6c17b5993ac44605b3c`）；接口代码保持前述固定核查版本。本次源码定向验收因此为118+4个独立用例。

其余16项在CI固定第一父 `5714a1899c0cc80d26463e596f1cadfcc1dd4533` 的隔离checkout全部复现：9个显式文件、16个精确筛选用例，其他2559项只收集并跳过，无全量测试。结构化 [归因记录](./ci-base-attribution.json)保留环境、子模块、用例与失败签名；macOS/Node26环境未重建Linux CI，因此结论是基线已存在相同失败，而非所有环境等价。

上游 #4793 已包含这些16项的对应修正。该上游PR的剩余导航测试缺少现行允许的application-object类型，独立 [测试修正 #4801](https://github.com/desirecore/desirecore/pull/4801)补清单并验证精确ref、current pin拒绝与consumer错配拒绝。仅测试文件改动，11单文件unit及13受控类型边界通过，未修改任何Schema或授权实现。待该修正与上游合入，再更新API分支完成完整门禁和发布。

### 上游衔接补验

#4801 已合并；上游最新 `33926b9d243b4f2bd6ea36b2e7634e347ec33d6b` 的新增应用对象导航未改变本轮24端点及 query/Socket.IO/Run 契约。本地隔离衔接快照 `66ee3deb567a7bbcbe1bde2f48f352a129c39ec0`、docs `f620bc410063301cb5828f2ad63f9a10ce61f086` 上，限定11个API生产文件与旧已测版本完全一致，18项unit与1项integration补验通过。补验是重复覆盖，不增加前述122个独立源码用例计数；本地快照未推送，不将其等同PR完整门禁。

```bash
node_modules/.bin/vitest run --project unit --maxWorkers=1 --no-file-parallelism packages/agent-service/src/routes/webhook-management-routes.test.ts packages/agent-service/src/builtin-tools/__tests__/compute-credential-proxy-address.test.ts packages/agent-service/src/__tests__/service-metadata.test.ts
node_modules/.bin/vitest run --project integration --maxWorkers=1 --no-file-parallelism packages/agent-service/src/routes/webhook-management.integration.test.ts
```

公开PR #72 的CodeQL、CLA与Vercel预览全部通过；生产合并与部署仍等待源码前置PR。生产页面、下载字节、sitemap与搜索检查尚未执行。

## 最终合并与发布核对（2026-10-15）

上游 #4793 与源码 #4798 均在完整门禁通过后合并。最终 #4798 HEAD `3801f4d79cd4e578b8f3e006913a0c552e3763f3` 的CI见 [run 38559639612](https://github.com/desirecore/desirecore/actions/runs/38559639612)，合并提交为 `e45f22902af2dc45b109cfa8f454795538aea2ed`。

相对两个原测试基线，24端点汇总的33个来源/Schema文件中仅 `instance-auth.ts` 静态导入改异步导入，仍先执行同一application authority gate，再处理豁免与owner fallback。请求、响应、路由和认证分支未变。外围用量消息新可选model和混合模型回执省略身份的行为与现有指南/客户端兼容；本次只读差异核对不作为新增运行测试。公开清单及三个spec已同步固定来源，未改变API合同。

部署前快照：生产首页200，API中英文入口与规范下载404，两语言sitemap不含API路径。生产验收结果将在自动部署后单独回写；这些404不作为部署后结果。
