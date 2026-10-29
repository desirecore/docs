# 新增 API 与契约同步验证（2026-10-29）

## 基线与范围

固定源码 `724d8fe87c2e01a7495c3e22f1910e1b4486caa9`，内部文档 gitlink `3122dd869b37fc65dbcb3c5b0e356d2571c83b48`，公开 main 基线 `2fbf12b265dd6eab28c186716b0de290a084dd0d`。对比上批公开来源 `ba6a550aeb397c377f6c3c6e620863d06d526628`，新增5个可静态识别的路由，另有43个动态注册表达式不能据此视作全量清单。原公开操作引用的18个文件有变，影响43项来源记录；已逐项静态复核选定handler，文件改动不代表43个HTTP合同均发生变化。

本批新增8操作：Worker列表/记录、归档手动话题、会话恢复引用、算力准备重试、团队归档列表/恢复、精确Workflow定义的TaskBoard绑定。公开合计 **58操作（Agent Service50、Compat Proxy3、Workflow Service5），15组双语页面**。Agent规范修订为1.4.0。其它两规范仅涉及启动诊断的源码变化，没有更改其公开合同或历史来源。catalog中全部来源文件均确认存在；新SHA表示当前静态复核，旧运行证据保持原日期及范围。

源码未修改，不创建占位源码PR。原源码工作目录的既有docs子模块修改未动；测试在隔离checkout和临时数据根运行。没有真实调用模型、对象存储供应商或恢复用户团队。

## 主要合同

- Worker修复已由源码PR #5224合入 `833e4d55a4fb54760dd7d63aa56dfb977cbe98c0`。本次重新验证旧/新记录敏感input/result投影、引用移除、媒体字节处理、公开允许字段、状态和有效entry分页。最早包含该修复的本地发行标签为 `v10.0.189`，生效框只约束相关隐私和分页合同。Worker没有独立Run，offset不是seq，truncated不是hasMore或结束状态；缺索引但有记录允许unknown。投影不是任意自由文本的秘密检测，旧文件不原地改写。
- 归档手动话题为当前owner跨Agent列表，分页Number转换后要求安全整数，limit1..200，默认50。不返回正文，不恢复话题，没有快照revision。
- `/api/sessions/:runId/runtime-state`返回持久会话恢复引用，与Run实时状态不同。合法null表示没有当前引用；已验证owner后的本地恢复异常返回500 SESSION_RESTORE_FAILED，不可吞成null。不自动重放输入；旧引用读取可能包含迁移/登记行为，因此不宣称绝无本地维护写入。
- Compute准备重试是显式管理POST，任何body（包括空对象）或query被拒绝。ready返回200；同一准备中的请求共用owner flight；准备失败503 SERVICE_PREPARATION_FAILED。它不修改供应商配置、不重发业务请求、不保证模型连通性。
- 团队归档列表含本机路径，恢复结果须保留warnings、approval、workdir及缺失成员事实；成功并不证明全部收尾完成。没有公开恢复幂等键，结果未知不自动重试。
- Workflow绑定通过Agent Service，owner取自鉴权身份。请求仅5字段、16KiB/128节点/深度8；existing exact定义引用、资源CAS和稳定幂等键，不接受ownerUserId。trigger需Task和required、无默认值的typed outputs.task_ref。200/201结果的revision为绑定存储修订；绑定不执行Workflow或签发运行授权。内部服务凭据不公开。
- 实际来源门分别核验：remote/standalone部署者token通过团队归档/Compute管理门；embedded团队归档还需官方界面来源。Workflow绑定没有继承此归档来源门，仍由鉴权owner与定义/资源权限处理；没有将所有新接口泛化成Renderer-only。
- TaskBoard数据schemaVersion仍3，默认策略为V5，旧板不自动升级。动作前置条件与taskPlanRequired理由不等于TaskItem存在plan属性。新增/变化的claim、action、submission和review公开结构由当前共享Schema导出；相同定义改用组件引用，减少原详情Schema中的重复内嵌。历史敏感结果同时移除modelOutput/modelOutputRefs；普通结果保留可选模型文本投影与UI摘要的区别。

## 实际验证

### 源码定向测试：20文件，327项通过

- unit：14文件237项。包括worker-public-contract、worker-transcript、public-session-projection、history-runtime-scope、manual-topic-archive store/routes、compute-routes-masking、capability-preparation、team archive list/restore/conflicts/routes、Agent网关与Workflow owner governed-binding routes。
- TaskBoard unit：5文件84项。共享taskboard-schema/workbench、taskboard routes、policy registry、workbench service。覆盖本批刷新结构和V5动作前置事实；不等同所有TaskBoard业务场景验收。
- 新管理resource夹具：1文件6项。维护在 `examples/agent-client/test/source-management.fixture.ts`，复制到文件头声明的源码位置执行，完成后移除临时副本。真实Fastify、instance-auth、governed hook和请求校验；仅profile、Team service、Workflow owner端口为合成。验证缺/错token401先于业务访问、standalone token-only管理、owner注入、拒绝自报owner/错定义路径、未知恢复字段400、16KiB限制413、embedded归档403及与绑定来源判据的区别。

执行使用源码目录Node **26.4.0**、既有Vitest unit/resource配置。Worker/归档/历史测试按各文件使用真实临时存储；运行时、用户profile、能力或Workflow owner的替代范围以测试定义为准，不将全部327项称为真实服务端到端测试。未跑全仓CI、打包客户端或真实供应商。

### 接入示例：85项通过

示例目录Node **22.23.1**，独立 `npm test`，原75项加新10项，0失败。真实本机HTTP listener提供合成响应，验证Worker按有效entry窗口推进而非seq/消息数、raw patch/unknown/truncated保留、total变化和页数上限partial exit2、401/404与重定向停止；管理员显式GET/POST、精确绑定原体/键、warnings保留、409/503/超时无写重试、错误日志不打印服务端敏感正文、错误握手停止；归档话题owner范围；恢复引用null与500/坏响应区分；Compute唯一无body/query POST及失败不自动重试。

8份脚本及static镜像由api:check逐字比较。history错误日志只输出状态/安全code，内部仍保留历史revision冲突标识供只读重启逻辑使用。合成HTTP不是实际业务实例或供应商验收。

### 规范与构建

- `pnpm typecheck`、`pnpm api:check`、中英文 `pnpm build`、`pnpm api:check -- --build`通过：15组页面、58项操作、110个JSON代码块。
- AJV Draft7编译 **200个组件Schema**，验证 **65个规范JSON示例**，全部通过。沿用条件dependencies的等价if/then表达，不放宽字段约束。
- Redocly CLI **2.63.0**校验3规范：**0错误、87告警**（83个条件分支required可见性、3个license缺失、1个独立未引用组件）；与上批告警类别/总数一致，不加忽略或伪造license。
- 构建含既有vscode-languageserver-types动态require告警；新文件提交前有未跟踪文件更新时间提示。构建成功，没有为本批升级站点依赖。
- 本地HTTP：**30个页面、22份双语下载**全部200；各页唯一H1及生产canonical正确，下载逐字等于static源，三规范各语言操作数为50/3/5。
- 浏览器：Worker中文→English菜单切换成功，新增侧栏入口及下载地址正确；12个代表页面/锚点在390px宽均存在且无整页横向溢出（Worker、管理、历史、Compute、TaskBoard、OpenAPI双语）。恢复默认视口，保留本机管理文档预览。

内部Documentation Map轻量扫描只读取显式36个Markdown条目的frontmatter：16 OK、4 Stale、3 Critical、13 Unknown；目录条目不递归展开，日期结果仅用于提示潜在文档漂移。实际公开合同以固定代码/共享Schema/针对性测试为准，本批不扩写为全面内部文档整改。

## 发布边界

本记录为文档PR前的本地核验。尚未合并、部署或触发Algolia爬虫，不将旧生产/搜索验收记录改作本批已上线证明。合并后按既有自动部署及每日爬虫流程完成线上验收。
