# Run、会话历史与附件媒体验证

核查日期：2026-10-15。本记录对应本批公开文档 PR；不改写既有部署或搜索验收结果。

## 固定来源与范围

| 项目 | 固定版本 |
|---|---|
| 源码 `desirecore/desirecore` 的 `dev` | `7fe016c76ab98e0643ab4f2710c3733f757ef4fb` |
| 源码中的内部文档 gitlink | `b17e6a7a2d3dc4d969ea422ee37825ae39eb6177` |
| 公开文档 `main` 基线 | `3e0e3de7168e2392802d37d295f73a65af070f5e` |

新增六个会话历史/消息/话题读取操作、五个附件/媒体操作。加上原有24个，共35个操作、10组双语页面。Agent Service规范为27个操作；Compat Proxy的3个和Workflow Service的5个保留原来源基线。未公开管理写入、内部同步查询、媒体上游代理、原始历史追加或受额外授权门控的Workflow执行。

原有16个Agent Service操作沿固定源码重新核对来源。自公开基线以来，所选接口的请求、认证和Query摘要合同保持一致；相关文件中未公开的删除、压缩等逻辑变更另行核对。本批范围内的契约差异主要是Run转交语义和历史投影行为。清单中的历史测试说明保留原测试基线；更新来源SHA不代表所有既有接口在此新SHA上全部重跑。

## 关键合同与更正

### Run状态必须看实际HTTP路由

`packages/schemas/src/agent-service/run.ts`共享状态枚举已有`handed_off`，Run详情和列表按该元信息呈现转交事实。但`packages/agent-service/src/routes/runs-routes.ts`的`RUNTIME_STATE_STATUSES`仍仅四值，`GET /api/runs/:id/runtime-state`会对已转交Run返回404。上一轮覆盖审计仅从共享Schema推断该HTTP入口也支持五态，这项推断在本批按实际路由和实测更正。

公开RunMeta使用五值；HTTP RunRuntimeState保留四值并说明404。只读转交字段不作为请求参数、续接凭据或完成证据。示例遇到已观测转交，或续问前无法取得来源Run的运行态时保留待发文本并停止；不自动追踪目标执行。

### 历史与话题

- `history-routes.ts`：列表、搜索、精确Run读取使用可信用户归属；委派完整快照返回403，消息仅显式`view=inspect-run`可读取。
- `conversation-routes.ts`：两个话题入口使用当前本机profile用户；公开用途限定部署所有者，不承诺共享服务多租户隔离。
- 逐Run分页的请求offset是源行位置，消息中的offset是字节位置；返回消息可能少于源窗口，按请求limit推进。公开投影不是持久协议数据的无损镜像。
- 搜索参数单独校验；limit=0表示剩余全部命中。话题消息最多120条且有truncated标记，没有续页参数。
- 不存在跨页一致性版本。示例发现total变化会停止，但不能检测总数不变的内容变化。

### 附件与媒体

- `attachment-routes.ts`和`attachments.ts`：单个非空文件、20MiB、用户配额，返回直接收据；下载按可信用户隔离。
- 通用附件收据中的fileReference原样用于Query start的`options.fileReferences`。客户端去重保序、计入qrd1摘要并冻结至恢复/重试；后续文本续问不自动重附文件。
- `media-routes.ts`及签名认证：上传和签发接口使用实例认证；原生`/media/:filename` GET/HEAD精确路径使用expires和signature，五分钟有效、允许重复及单段Range。
- 新媒体核对owner；无owner侧车的历史媒体保留兼容读取，不夸大历史隔离保证。应用身份、Origin和readiness仍有独立检查。
- 默认Caddy已转发`/media/*`；自定义代理须保留该路径、签名查询参数和Range。

## 已完成定向验证

| 验证层 | 结果 | 实际覆盖与限制 |
|---|---|---|
| 固定源码既有定向用例 | 5文件、47项通过 | run-meta-read 26、附件真实存储/下载1、媒体路由13、签名6、话题公开投影1 |
| 本批历史/Run源码夹具 | 1文件、5项通过 | 六入口无/错误token拒绝、列表归属、完整/分页消息与私有重放字段移除、真实搜索及非法参数、空话题/404、Run详情handed_off及runtime-state404 |
| 公开客户端与源码集成 | 1文件、3项通过 | 文本start/follow-up、附件引用与源码摘要、真实上传helper→multipart存储→Query准入→下载原字节 |
| 独立Node示例 | 3文件、41项通过 | 对话16、附件12、历史13；实际回环HTTP/Socket连接，服务响应或执行为夹具 |

源码验证使用隔离的固定提交checkout，子模块已初始化并fetch，依赖复用既有本机安装。历史夹具仅替换本机用户配置及运行时发现，鉴权、路由和SessionStore使用实际代码与临时数据。客户端源码集成中的握手、模型管线、续问回调及Run快照仍为替身；附件存储与Query准入是真实实现。没有运行商业模型、真实会话转交或用户业务操作。

可维护的源码夹具在`api/examples/agent-client/test/source-history.fixture.ts`与`source-route.fixture.ts`；按示例README复制到对应源码测试目录执行。前者使用unit项目，后者使用integration项目并设置`DESIRECORE_API_EXAMPLE_PATH`。两者在网站tsconfig中精确排除；不把私有源码导入混进网站编译。

## 文档与规范验证

- `pnpm api:check`：10组双语页、35操作、66个JSON代码块、3份规范/35操作，通过。
- `pnpm typecheck`、双语`pnpm build`、`pnpm api:check -- --build`通过；本地HTML、canonical、语言链接、sitemap及所有规范/三份Node下载副本一致。
- Redocly CLI `2.63.0`校验三份OpenAPI，0错误。剩余50条告警为既有47条条件Schema属性告警和3份规范未填license的告警；未将有告警写成零告警。
- AJV Draft 7编译68个组件Schema、验证44个JSON媒体示例通过；包括历史页的7种响应示例。另附件媒体Schema定向8正例、6反例通过，双语样例逐值一致。
- 独立审阅发现并修正两处文字/输出一致性：附件引用在Query start中应为`options.fileReferences`；历史total变化的停止记录补`nextOffset`。后者13项测试重新通过，最终全部独立示例41项再次通过。
- 本机生产构建浏览器检查：中英新增历史/附件页在375像素视口无整页水平溢出；1440像素下历史页与OpenAPI页无整页溢出。中文历史页语言链接指向对应英文页。英文OpenAPI页实际下载均200且操作数为27/3/5；history下载200。
- 将示例和OpenAPI下载链接使用`pathname:`保留为稳定静态路径，避免被构建器替换为带内容哈希的资产文件名；每种语言的下载字节另由构建检查核对。

构建保留既有Browserslist数据过期和语言服务器动态require提示。未更新无关依赖。未声明剪贴板内容、商业模型附件处理、桌面发行安装包或生产部署已验收。

## 发布边界

本批只提交PR。`publication.json`、`production-verification.json`和搜索验收JSON继续表示已发布批次，不把本地构建、PR预览或URL Tester当作生产发布和搜索收录。合并后自动部署，随后另做生产页面、规范下载和每日爬虫索引验收。
