# 观察接口与聚合历史接入验证（2026-10-25）

## 交付范围

新增5个HTTP操作：输入配置、网络状态、合并历史、近期工具调用、用量汇总。Agent Service共32操作，Compat3、Workflow5，共40操作；11组中英文页面。新增observe读取示例，history增加all命令，两者均与静态下载逐字对应。

本记录与2026-10-22的35操作稳定性复核分开。旧生产、下载与搜索验收保留原始版本，不表示本批已经发布或收录。

## 固定来源与依赖

- 公开文档开始基线：`c76753613425d236d54360b111efb708b1349131`。
- 源码开始基线：`a9414962f28696f30bfa1e29aff0a03c4d58a5e9`。
- 本批固定源码候选：`3131e2d4900bce418abe1bb0a0569148ef901682`，[源码PR #5194](https://github.com/desirecore/desirecore/pull/5194)；必要内部文档为`19451b244361d2a0662af2f49cfa477e08b1a3b3`（内部文档PR #908已合并）。规范与catalog引用同一源码提交；公开文档以Draft PR交付并依赖源码修复，不把候选描述当作已发布安装包。
- Compat与Workflow无实质合同改动，规范保留自身来源和既有验证记录，没有伪改成最新提交实跑。

## 源码合同及修复

近期调用的ID、字段和索引兼容由同一Receipt投影维护：有invocation_id优先使用，否则按Run/稳定Receipt身份/工具序号形成不透明标识；工具状态和时间优先，旧回执可回退整轮事实；缺少耗时为0并不代表实际测得零耗时。公开读取不包含工具输入或结果正文。

调用索引升级必须处理旧版本、重建期间增量及旧回执格式，不能只修改新增行。独立审阅发现的小limit选取、同时间不同Receipt重放去重、旧receipt.json混合读取、缺时间回退均作为本批收口条件；最终修复与测试结果在完成后记录，不以最初单Run大limit夹具代替这些边界。

聚合历史经过可信owner过滤、分支和手动会话范围选择、Conversation Mention来源合并及公共投影后计算revision，再分页。limit=0为空页元数据；revision冲突409只重读，合成Mention来源runId不可用于执行或恢复。

用量是有窗口和缓存的已记录成本，不是供应商账单。since按Run开始时间筛选，byDate以UTC日桶中午映射时区，不能宣称精确逐事件本地日结。Schema及中英说明一同收窄此精度承诺。

## 验证分层

### 实际源码路由夹具

维护夹具：`api/examples/agent-client/test/source-observe.fixture.ts`。复制到固定源码的`packages/agent-service/src/__tests__/api-docs-observe.resource.test.ts`后以Vitest resource project运行，结束移除临时副本。

已通过10项：

- 真实instanceAuth对5条路径的缺失/错误令牌均401。
- input-config真实文件读取、摘要、no-store、缺省manual、非法ID400、目标业务404、坏配置503；reader的原子替换竞争与已存在的409路由映射测试分别验证。
- 真实NetworkHealthMonitor的四态、disabled、seq/新monitor重置，以及HTTP读取当前对象；主动探测timer被取消，不外连。
- SessionStore与HTTP合并历史的owner、limit0/1000、非法页、revision变化409、manual切换、fork选择、敏感失败结果占位与引用移除。
- 真实Conversation Mention来源store生成source-only项，另一个owner不可读。
- 真实Receipt及用量索引/回退：owner、无usage、cleared记录、Run开始筛选、invalid参数、UTC桶/UTC+14、缓存失效对照。

仅替换合成本机profile、runtime发现与引用登记边界。数据全部在临时DESIRECORE_TEST_ROOT，不读取个人历史。Fastify inject覆盖真实应用HTTP处理与序列化，不等于真实TCP listener、公网部署或商业Provider验收。

### 可运行示例

history测试含同revision分页、409丢弃已缓冲页后有限重读、连续冲突停止、limit0/上界、显式后页revision、source-only不被当成Run、无执行回放。observe测试覆盖握手身份、真实本机HTTP请求/认证头、四命令路由、可选字段保留、拒绝重定向/HTML、错误不重试和不输出错误体中的凭据。

完整Node示例测试与站点检查的最终数量、构建及规范验证结果在完成后补记。测试HTTP服务为本地合成响应，不与源码路由夹具混计，也不代表调用真实业务实例。

## Worker专项：未公开

Worker专项独立运行真实注册HTTP路由、recorder与reader，共12项隔离检查通过，其中部分断言用于复现当前不满足公共读取门槛的行为，并非全部隐私检查通过。

已验证父Run owner的401/404、无worker空记录、七态/unknown、按成功解析entry位置分页、坏行计数及录制上限。尚需修复的实际条件：

1. sensitiveResult工具的部分进度可先写入早期append-only entry；即使final摘要已占位，HTTP仍可返回该早期进度。
2. 旧结果与引用没有按当前公共历史规则重新投影；视觉/二进制工具输入和额外JSON字段的公开边界仍需明确。
3. seq不是HTTP offset游标，truncated是录制达到上限而非hasMore；独立Schema/文档需要校准。

正常当前final的成功/失败结果与敏感输入已有保护，父owner校验没有被绕过。这里证明的是合成夹具条件，不是实际用户数据泄漏、跨租户漏洞或真实事故。本批不把两操作加入公开文档、清单或OpenAPI，也不从既有HistoryMessage推导Worker保证。

## 发布边界

本轮交付源码与公开文档PR供审阅，不合并、不触发生产发布。尚未执行安装包、商业模型、真实邮箱/S3、压力或SLA验收。上线后仍需实际页面、14份双语规范/示例下载与DocSearch重抓验收；现有每日抓取计划无需因文档PR而变更。


## 本地验证完成结果

- 最近调用修复：resource 3文件56项（recent-tool-calls 12、runs-activity-scope 25、runs-index-empty-owner 19）；unit 4文件40项（runs-index 28、reader-receipt-id 3、operations-activity 7、recent-tool-calls 2），共96项通过。
- input-config既有route/reader专测2文件13项通过，包含409与503错误映射；独立source-observe资源夹具10项通过。三层合计119项源码定向检查，不等于119个端点或完整产品验收。
- 独立修后复核4个原反例通过；旧JSON原文身份重复重建一致；字节、条数、分片预算耗尽均返回null，不返回已读部分topK。回退仍为有限owner窗口，未宣称两条链路能枚举相同的全历史。
- Node示例4文件54项通过；源与下载镜像一致；docs typecheck通过（私有源码执行的fixture按既有约定从站点TS范围排除）。
- 源码13个类型边界及消费闭包、lint:boundaries通过；ADR引用与代码声明检查通过（保留既有未锚定声明提示）。新worktree子模块已初始化并fetch，未修改原源码工作区或关联仓库的既有未推送配置。
- api:check与双语build、api:check --build通过：11组双语页面、40操作、76个JSON块。AJV Draft7校验75组件Schema、57个规范JSON示例；Redocly2.63.0三规范0错误，保留既有47条条件Schema告警及3条license告警。
- 浏览器检查6个中英文页面/锚点、1280宽度无整页横向溢出；390宽度检查英文观察表格与中文合并历史，表格独立横向滚动，无整页溢出。原viewport已恢复。

源码提交前刷新dev新增的#5193仅修改Task/Plan描述与工具元数据，未更改本批读取接口；rebase的range-diff确认修复补丁不变。最终固定SHA以catalog与Agent Service x-source为准。源码与公开文档PR不在本轮合并或部署；必要内部候选合同已按子模块流程单独合并到内部文档main。

最终本地构建通过后，实际HTTP读取14份中英文下载文件，全部返回200且逐字匹配static源文件（包含固定源码提交的Agent Service规范）；已检查的6个浏览器页面内容与锚点正确。线上部署和搜索尚未执行。
