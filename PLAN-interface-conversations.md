# 完善计划：User Guide - Interface & Conversations

## 一、问题清单

### A. 配图缺失（最严重）

| 文件 | 现状 | 需要 |
|------|------|------|
| 01-layout-overview.md | 仅 ASCII 图 | 需要三栏布局示意图 |
| 02-navigation-rail.md | 仅 ASCII 图 | 需要导航栏结构图 |
| 03-conversation-list.md | 仅 ASCII 图 | 需要对话列表示意图 |
| 04-chat-area.md | 仅 ASCII 图 | 需要聊天区域结构图 |
| 05-digital-avatar.md | 无图 | 需要数字人界面概念图 |
| 06-notifications.md | 仅 ASCII 图 | 需要通知面板示意图 |
| 07-feature-entry.md | ✅ 已有 5 张图 | 无需补充 |
| 01-sending-messages.md | 无图 | 需要输入区域示意图 |
| 02-message-types.md | 无图 | 需要消息类型对比图 |
| 03-cards.md | 无图 | 需要卡片颜色编码图 |
| 04-model-selection.md | 无图 | 需要模型选择器示意图 |
| 05-chat-history.md | 无图 | 需要历史记录面板图 |
| 06-managing-conversations.md | 无图 | 无需（操作性内容，文字足够） |
| 07-markdown-rendering.md | 无图 | 需要渲染效果示例图 |
| 08-exporting-conversations.md | 无图 | 需要导出流程图 |
| 09-context-control.md | 无图 | 需要上下文生命周期图 |
| 10-rewind-checkpoints.md | 无图 | 需要时间线/分支图 |

### B. 结构问题

1. **feature-entry.md 缺少 YAML frontmatter**（title/description/keywords）
2. **链接格式不一致**：部分用 `./context-control`（无 .md），部分用 `./03-cards.md`
3. **feature-entry.md 标题风格不同**：用 `# 功能入口与操作路径` 而非与其他文件一致的格式

### C. 内容薄弱

| 文件 | 大小 | 问题 |
|------|------|------|
| 07-markdown-rendering.md | 2.2KB | 缺少实际渲染效果示例 |
| 08-exporting-conversations.md | 1.8KB | 缺少操作步骤截图和详细流程 |
| 09-context-control.md | 2.2KB | 缺少上下文生命周期可视化 |
| 10-rewind-checkpoints.md | 1.9KB | 缺少时间线/分支概念图 |

### D. 内容准确性

- 所有文件内容经审阅**准确无误**，与 DesireCore 实际功能一致
- 无需修正错误信息

---

## 二、改进计划

### 阶段 1：创建图片目录
- 创建 `static/img/user-guide/interface/`
- 创建 `static/img/user-guide/conversations/`

### 阶段 2：生成概念图/布局图（GenerateImage）

**Interface 章节（6 张）：**
1. `layout-three-column.png` — 三栏布局鸟瞰示意图
2. `navigation-rail-structure.png` — 导航栏结构标注图
3. `conversation-list-anatomy.png` — 对话列表元素标注图
4. `chat-area-structure.png` — 聊天区域三层结构图
5. `digital-avatar-concept.png` — 数字人 3D 界面概念图
6. `notification-panel.png` — 通知中心面板示意图

**Conversations 章节（6 张）：**
1. `message-types-comparison.png` — 三种消息类型视觉对比
2. `cards-color-coding.png` — 卡片颜色编码速查图
3. `model-selector-panel.png` — 模型选择器面板示意
4. `context-lifecycle.png` — 上下文生命周期流程图
5. `rewind-timeline.png` — Rewind 时间线分支图
6. `export-workflow.png` — 导出对话流程图

### 阶段 3：修复结构问题
1. 为 feature-entry.md 添加 YAML frontmatter
2. 统一链接格式

### 阶段 4：补充薄弱内容
1. markdown-rendering.md — 添加渲染效果描述和示例
2. exporting-conversations.md — 补充详细步骤
3. context-control.md — 补充可视化说明
4. rewind-checkpoints.md — 补充分支概念说明

### 阶段 5：在文档中引用图片
- 在每个 md 文件中适当位置插入图片引用

---

## 三、优先级

1. 🔴 生成配图（最大缺口）
2. 🟡 修复 frontmatter
3. 🟡 补充薄弱内容
4. 🟢 统一链接格式
