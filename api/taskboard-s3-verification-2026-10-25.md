# TaskBoard 与 S3 读取扩展验证（2026-10-25）

## 来源与公开范围

固定源码 `ba6a550aeb397c377f6c3c6e620863d06d526628`，内部文档 gitlink `9fbe5f4668d223553b38ebd4e7a2a49450000a9b`，公开 main 基线 `b8fc9329b935f85a20ab8bd253cf3afbbe99020b`。原32项 Agent Service 的51个直接source文件与上一批 a0186f6f 逐blob相同，因此仅提升已静态复核的来源，不把历史实跑结果改成在新版本重跑。

新增 TaskBoard 7 操作、S3 3 操作，合计 **50 HTTP 操作**（Agent42、Compat3、Workflow5），**13组双语页面**。Agent Service OpenAPI1.3.0；Compat/Workflow未改内容或来源。Worker修复独立提交，不作为本批公开接口或TaskBoard/S3文档的依赖。

## 合同核验

- TaskBoard：可信human actor、用户能力及当前Board/Team ACL，聚合查询省略不可见资源，详情可403或200 exists:false。两个POST仅查询，不创建任务板或执行Agent。query cursor原样传回；条件错400、版本变409后丢弃旧页。
- 整板activity只返回handoff evidence；单任务activity按throughRevision冻结canonical事件前缀，ownerProjection摘要仍每页当前读取，items长度不能代替续页位置。session resolver只选现有可见默认板，归属来自真实保存记录。
- S3：启用的用户能力、已有连接和供应商权限；摘要不验证secret或连通性。默认连接失败不扫描其它连接，调用方显式保存connection_id。public链接省略expires_in；末页通常省略token而非null；数字参数保留现行Number/默认/夹限语义。
- link404表示未确认可读，可能包含供应商拒绝；binary可500 DOWNLOAD_FAILED。binary对象可为任意MIME及任意JSON，规范不能只凭application/json强制当链接外壳。示例拒绝重定向、链接不自动访问、不向返回URL转发实例token，输出限量且不覆盖已有文件。

## 实际执行结果

### 源码读取专项

TaskBoard **60项通过**：现有unit三文件45项、session-board/history-service-c resource两文件11项、新增真实7路由/Service/Store fixture4项。后者只替换身份注入、Team枚举及service单例装配，持久化在独立临时根。首次夹具把TaskUpdate.patch错误写成顶层字段，修正测试准备后4/4通过，未为通过测试修改生产TaskBoard源码。

S3 **9项通过**：真实Fastify注册、instance-token认证、能力gate与handler；owner profile、能力事实、连接解析和S3 Provider函数为合成替身。覆盖认证及能力拒绝优先、无凭据摘要、空配置、token/字段映射、数值兼容、缺key/连接、公有/签名链接与binary错误及字节。未读取真实凭据或连接真实S3。

维护夹具在 `api/examples/agent-client/test/source-taskboard.fixture.ts`、`source-s3.fixture.ts`，各自文件首注释给出复制位置。复制到固定源码版本并使用其现有Vitest resource project执行；完成后移除临时副本，避免把维护夹具混入独立Worker PR。它们从站点TypeScript范围排除，不在Node示例测试数字内。

### 可运行示例

6个Node测试文件 **75项通过**（原54、新TaskBoard9、新S312）。真实本机HTTP listener返回合成协议响应，验证认证头、握手、精确请求路径与参数、分页/异常停止、限量下载/清理、拒绝覆盖和重定向；不是实际业务实例或供应商验收。源码与static六份脚本逐字一致，由api:check维护。

### 文档、规范与预览

- docs typecheck、api:check与双语build、api:check --build通过：13组/50操作/96个JSON块。
- AJV Draft7编译 **142个组件Schema**，验证 **59个规范JSON示例**，通过。
- TaskBoard评论的Draft7属性dependencies转换成等价if/then，以适配OpenAPI工具；穷举256种字段存在组合，原约束与转换结果全部一致。没有降低评论关联字段要求。S3 403错误变体使用anyOf，避免与开放的Origin错误Schema构成不实互斥承诺。
- Redocly CLI2.63.0三规范 **0错误、87告警**；告警含条件Schema分支required、许可字段及独立链接组件未被响应直接引用。保留告警，不添加忽略配置或伪造许可。
- 最终本地HTTP验收 **26个页面、18份双语下载全部200、0失败**，包含canonical/hreflang、DocSearch语言/current/tag、sitemaps/robots和新增正文；下载逐字匹配static源。规范调整后已重新构建并复核全部18份下载字节。
- 浏览器检查新增4个中英文页面、TaskBoard→英文语言切换及代表锚点；1280宽无整页横溢。390宽检查中文TaskBoard与英文S3：整页宽390，宽表格在358宽容器内滚动。已恢复视口，未修改样式或搜索配置。

## Worker 独立修复边界

源码修复覆盖敏感中途进度在flush前移除、旧记录读取的敏感input/result/引用重投影、entry/index字段允许表、明确媒体载荷和普通业务JSON的区别，以及seq与有效entry位置分页的契约。七文件回归 **284项通过**，独立真实helper **14项通过**，受影响类型边界及消费闭包13项通过。身份hook为合成，不称完整认证、公网或真实用户数据验收。

这些结果不将Worker自动列入本公开包；后续公开需要独立说明其记录与分页合同。旧原文件不原地改写，执行输入不变；投影不是任意自由正文的通用敏感检测。

## 发布状态

本记录为提交PR前的本地核验，尚未合并或部署本批公开文档，没有重抓Algolia或宣称生产搜索已收录。此前生产/搜索报告保留原始批次；合并后再按既有自动部署与每日爬虫流程验收。
