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
