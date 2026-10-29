---
title: 实例管理与工作流绑定
description: 由远程实例所有者查看和恢复团队归档，并为已有精确工作流定义建立任务板绑定。
slug: /api/instance-management
sidebar_position: 14
last-reviewed: 2026-10-29
keywords: [API, 团队归档, Workflow, 管理, CAS, 幂等]
---

# 实例管理与工作流绑定

本页面向持有远程／standalone **部署者所有者令牌**的管理员及其受信管理程序，使用 Agent Service 地址和 `X-Agent-Service-Token`。先完成[连接与认证](./01-connection-and-auth.md)。该令牌具有管理权限，不应作为普通 Agent 工具或公共网页的凭据分发。

内嵌客户端的团队归档读取与恢复还要求官方界面来源。以下命令面向管理员提供的远程实例；工作流绑定由鉴权身份确定定义所有者，不接受请求体自报所有者。

| 操作 | 方法与路径 | 影响 |
|---|---|---|
| 查看团队归档 | `GET /api/team-archive` | 返回归档、成员和本机路径摘要 |
| 恢复一份归档 | `POST /api/team-archive/:archiveId/restore` | 将团队恢复到活动目录并处理关联配置 |
| 建立工作流绑定 | `POST /api/workflow-definitions/:workflowId/taskboard-bindings` | 记录 Board／Task 与精确工作流定义的绑定 |

## 团队归档列表 {#team-archives}

### `GET /api/team-archive`

无分页或过滤参数。读取当前实例的归档目录，返回：

```json
{"success":true,"data":{"archives":[]}}
```

每条归档包含：

| 字段 | 含义 |
|---|---|
| `archiveId`、`teamId`、`name` | 归档标识、原团队 ID 和可空名称；恢复使用 `archiveId` |
| `archivedAt`、`reason` | 可空归档时间；原因为 `disband`、`leader_deleted` 或 `unknown` |
| `archivedDir` | 实例本机的归档目录绝对路径，不是下载 URL |
| `supervisor`、`supervisorExists` | 原组长及其当前是否存在 |
| `memberCount`、`missingMembers` | 名册成员数和当前缺失的成员 |
| `originalIdOccupied` | 原团队 ID 当前是否已被占用 |
| `hasManifest`、`gitRecorded` | 是否有归档清单、归档时是否记录 Git 标签；后者可为 `null` |
| `restorable` | 归档团队配置当前是否可读且合法 |

列表是本次读取的摘要，不预留 ID 或保证下一次恢复成功。无清单的旧归档仍可能列出，但工作目录和规则核准需额外处理。响应含本机目录和组织信息，请限制其保存与分享范围。

## 恢复团队 {#restore-team}

### `POST /api/team-archive/:archiveId/restore`

从列表复制 `archiveId` 并编码成单一路径段。请求体可省略或为 JSON 对象，只接受：

| 字段 | 条件 |
|---|---|
| `newName` | 原 ID 已占用时必填，以新名称分配新 ID；原 ID 空闲时仅改名称、不换 ID |
| `supervisor` | 原组长已不存在时必填，使用当前可用的 Agent ID；显式提供表示更换组长 |

不支持 `force` 或覆盖已有团队。空白名称、未知字段和非法标识会被拒绝。

```bash
curl --silent --show-error --request POST \
  --header "X-Agent-Service-Token: ${AGENT_SERVICE_TOKEN}" \
  --header 'Content-Type: application/json' \
  --data '{"newName":"恢复后的项目组","supervisor":"replacement-agent"}' \
  "${BASE_URL}/api/team-archive/${ARCHIVE_ID}/restore"
```

成功为 `200 {success:true,data:...}`。`data` 的字段包括：

- `teamId`、`restoredFromArchiveId`、`idChanged`：实际恢复身份。
- `approval`：`reinstated` 表示归档的核准记录已装回，仍受当前内容核验；`pending` 表示需要用户审阅规则。
- `workdir: {path, rebound}`：实际共享目录和是否绑回原目录；`path` 可为 `null`，不应自行补成原路径。
- `reattachedChildren`、`missingMembers`、`warnings`：已挂回的子团队、缺失成员及需处理的收尾问题。

成功表示团队已恢复，仍需检查上述结果。`warnings` 不为空时，不要把再次恢复当作修复收尾问题的方法。超时或断线后结果可能未知，先在客户端团队列表及归档列表核对；此接口没有公开幂等键，不自动重试。

| HTTP / 代码 | 处理 |
|---|---|
| `400 TEAM_RESTORE_INVALID_REQUEST` / `TEAM_ARCHIVE_INVALID_ID` | 修正字段或使用列表返回的标识 |
| `400 TEAM_RESTORE_SUPERVISOR_REQUIRED` | 选择当前可用的替代组长 |
| `404 TEAM_ARCHIVE_NOT_FOUND` | 归档已不存在；先核对是否已经恢复 |
| `409 TEAM_RESTORE_ID_OCCUPIED` | 选择 `newName`，不覆盖原团队 |
| `409 TEAM_ARCHIVE_UNREADABLE` | 修复或恢复归档中的有效团队配置后再处理 |
| `500` | 保留状态和诊断信息给管理员；不假定失败已自动回滚全部收尾步骤 |

## 精确工作流与任务板绑定 {#workflow-binding}

### `POST /api/workflow-definitions/:workflowId/taskboard-bindings`

此入口使用 **Agent Service 的地址及实例令牌**。实例需已连接可用的 Workflow Service；管理员须提供属于当前用户的已有精确工作流定义引用，以及有权管理的 Board／Task。调用方不需要也不应自行取得内部服务凭据。

请求最大 **16 KiB**，只接受以下五项：

| 字段 | 规则 |
|---|---|
| `resourceRef` | `{resourceType:"board",boardId}` 或 `{resourceType:"task",taskRef:{boardId,taskId}}` |
| `workflowRef` | 精确受治理定义引用：`schemaVersion:1`、`resourceType:"workflow-definition"`、匹配路径的 `workflowId`、`pin:{mode:"exact",definitionRevision,contentHash}` |
| `role` | `reference` 是导航关联；`trigger` 是可触发绑定，且只能绑定 Task |
| `expectedVersion` | Board 使用其 `revision`（可为 `0`），Task 使用其 `version`（至少 `1`） |
| `idempotencyKey` | `8..256` 字符的稳定请求键；结果未知时保留同一请求对象与键 |

不要提交 `ownerUserId`、运行中节点、任意 DSL 路径或未固定的“最新版”引用。定义的版本号与内容哈希必须指向同一份实际定义。

下面是仅导航关联的请求示意；将 ID、修订和哈希换成管理员提供的实际值，保存为 `binding.json`：

```json
{
  "resourceRef":{"resourceType":"board","boardId":"project-board"},
  "workflowRef":{
    "schemaVersion":1,"resourceType":"workflow-definition","workflowId":"review-flow",
    "pin":{"mode":"exact","definitionRevision":3,"contentHash":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"}
  },
  "role":"reference","expectedVersion":12,"idempotencyKey":"project-review-binding-001"
}
```

`trigger` 绑定还要求该精确定义声明必填、无默认值的 typed `outputs.task_ref`。建立绑定不签发执行授权，不立即运行工作流，也不自行改变任务状态；执行仍按[工作流集成](./06-workflow-integration.md)及管理员配置的权限处理。

成功通常返回 `201`（新绑定）或 `200`（已有／幂等结果），正文为 `{binding, changed, revision}`。`binding` 含稳定 `bindingId`、目标引用、固定定义引用、角色和创建主体／时间；`revision` 是绑定存储的修订，不是 Task version 或定义修订。

收到版本或幂等冲突时先核对资源和原请求；不要为躲过冲突自动换键。定义不存在、哈希不匹配或不属于当前用户可返回 `404`；不支持的 typed trigger 返回 `400`。实例会保留 Workflow owner 的实际拒绝状态与错误体，不套用 `{success:false}` 外壳。服务不可用可返回 `503`。

## 可运行管理示例 {#admin-example}

下载 **[admin.mjs](pathname:///api-examples/admin.mjs)**，使用 Node.js 22+，无需 npm 依赖：

```bash
export DESIRECORE_URL='https://your-instance.example'
export DESIRECORE_TOKEN='your-existing-deployment-owner-token'
node admin.mjs archives
node admin.mjs restore-team --archive-id team-id.20261019053355 \
  --new-name '恢复后的项目组' --supervisor replacement-agent
node admin.mjs bind-workflow --workflow-id review-flow --request ./binding.json
```

脚本先验证实例身份；读取和写入命令分别显式选择，写入不自动重试。请求文件中的稳定身份和幂等键由调用方保管。鉴权失败 `401`、管理来源不符合要求的 `403 renderer_origin_required` 及一般就绪错误按[错误与排查](./03-errors-and-troubleshooting.md)处理。完整结构见 [OpenAPI 下载](./07-openapi.md)。
