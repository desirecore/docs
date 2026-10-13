# 首批接入基础与 Webhook 核查记录

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
