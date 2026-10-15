# Use Cases 章节资产说明

## 封面图（Cover Images）

**位置**: `static/img/use-cases/covers/`

**来源**: AI 生成（DesireCore GenerateImage 工具，基于 MiniMax image-01 模型）

**规格**:
- 格式: JPEG
- 分辨率: 1200px（宽）
- 风格: 现代扁平插画 + 科技感，蓝紫色调
- 用途: 各场景页面的 `frontmatter.image` 字段，用于社交分享 og:image

**文件清单（18 张）**:

| 文件名 | 对应场景 |
|--------|----------|
| cover-data-analysis.jpg | 数据分析 (general) |
| cover-data-analysis-agent.jpg | 数据分析 Agent (general) |
| cover-document-writing.jpg | 文档写作 (general) |
| cover-email-management.jpg | 邮件管理 (general) |
| cover-flowchart-agent.jpg | 流程图 Agent (general) |
| cover-meeting-assistant.jpg | 会议助手 (general) |
| cover-translation.jpg | 翻译 (general) |
| cover-web-scraping-agent.jpg | 网页抓取 Agent (general) |
| cover-bidding-assistant.jpg | 投标助手 (professional) |
| cover-code-assistant.jpg | 代码助手 (professional) |
| cover-data-scientist.jpg | 数据科学家 (professional) |
| cover-finance-assistant.jpg | 财务助手 (professional) |
| cover-legal-advisor.jpg | 法律顾问 (professional) |
| cover-product-manager.jpg | 产品经理 (professional) |
| cover-real-estate.jpg | 房地产 (professional) |
| cover-ai-bidding.jpg | AI 投标方案 (solutions) |
| cover-ai-copyright.jpg | AI 版权保护 (solutions) |
| cover-enterprise-coordination.jpg | 企业协同 (solutions) |

## 其他资产

| 文件 | 说明 |
|------|------|
| `01-general/assets/sales-data-analysis-report.jpeg` | 数据分析场景示例截图 |
| `01-general/assets/microservice-architecture.png` | 流程图场景示例（drawio 渲染导出） |
| `01-general/assets/gucci-products-scraping.png` | 网页抓取场景示例截图 |

## 使用规范

- 封面图通过 frontmatter `image: /img/use-cases/covers/cover-xxx.jpg` 引用
- `.drawio` 源文件仅作为编辑源保留，文档中不直接引用
- 新增场景图应遵循相同命名规范：`cover-<场景slug>.jpg`
