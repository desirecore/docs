/**
 * Docusaurus 插件：构建时生成更新日志 JSON
 *
 * 按 plugins/changelog-editions.json 的每个发行版条目读取 <zhSourceDir>/v*.md，解析 frontmatter 和 markdown sections，
 * 输出结构化 JSON 到 static/api/<outputFile>（开发+构建均可用）。
 * desirecore 条目的源目录、输出名与 url 前缀与改为配置之前相同（api/changelog.json）；OEM 发行版条目输出 api/changelog-<id>.json。
 */

import type { LoadContext, Plugin } from '@docusaurus/types'
import * as fs from 'fs'
import * as path from 'path'

/** changelog.json 中单个 section 的结构 */
interface ChangelogSection {
  type: 'feature' | 'fix' | 'improvement'
  heading: string
  items: string[]
}

/** changelog.json 中单个版本的结构 */
interface ChangelogVersion {
  version: string
  date: string
  /** 版本宣传配图 URL（可选） */
  coverImage?: string
  sections: ChangelogSection[]
  url: string
}

/** changelog.json 顶层结构 */
interface ChangelogJson {
  generatedAt: string
  versions: ChangelogVersion[]
}

/** plugins/changelog-editions.json 中插件使用的条目字段（完整字段说明见该文件） */
interface ChangelogEditionConfig {
  id: string
  zhSourceDir: string
  outputFile: string
  urlPrefix: string
}

/** section heading 到 type 的映射 */
const SECTION_MAP: Record<string, ChangelogSection['type']> = {
  '新功能': 'feature',
  '修复': 'fix',
  '改进': 'improvement',
}

const SITE_URL = 'https://docs.desirecore.com'

/**
 * 从 markdown 文件内容中解析版本信息
 */
function parseChangelogMd(content: string, fileName: string, urlPrefix: string): ChangelogVersion | null {
  // 提取版本号（从文件名 v10.0.16.md → 10.0.16）
  const versionMatch = fileName.match(/^v(\d+\.\d+\.\d+)\.md$/)
  if (!versionMatch) return null
  const version = versionMatch[1]

  // 提取发布日期
  const dateMatch = content.match(/\*\*发布日期\*\*[：:]\s*(\d{4}-\d{2}-\d{2})/)
  const date = dateMatch ? dateMatch[1] : ''

  // 提取配图（![...](/img/changelog/v10.0.17.png) 格式）
  const imageMatch = content.match(/!\[.*?\]\((\/img\/changelog\/[^)]+)\)/)
  const coverImage = imageMatch ? `${SITE_URL}${imageMatch[1]}` : undefined

  // 按 ## 标题分段解析
  const sections: ChangelogSection[] = []
  const lines = content.split('\n')
  let currentSection: ChangelogSection | null = null

  for (const line of lines) {
    // 检测 ## 标题
    const headingMatch = line.match(/^## (.+)$/)
    if (headingMatch) {
      const heading = headingMatch[1].trim()
      const type = SECTION_MAP[heading]
      if (type) {
        currentSection = { type, heading, items: [] }
        sections.push(currentSection)
      } else {
        currentSection = null
      }
      continue
    }

    // 收集列表项（- 开头的行）
    if (currentSection && line.match(/^- .+/)) {
      currentSection.items.push(line.slice(2).trim())
    }
  }

  // 过滤掉空 section
  const nonEmptySections = sections.filter((s) => s.items.length > 0)

  const result: ChangelogVersion = {
    version,
    date,
    sections: nonEmptySections,
    url: `${SITE_URL}${urlPrefix}/v${version}`,
  }
  if (coverImage) result.coverImage = coverImage
  return result
}

/**
 * 生成 changelog.json 内容
 */
function generateChangelogJson(changelogDir: string, urlPrefix: string): ChangelogJson {
  // 章节目录尚不存在时输出空列表：客户端拿到「没有版本」而不是 404
  const files = fs.existsSync(changelogDir)
    ? fs.readdirSync(changelogDir).filter((f) => /^v\d+\.\d+\.\d+\.md$/.test(f))
    : []

  const versions: ChangelogVersion[] = []
  for (const file of files) {
    const content = fs.readFileSync(path.join(changelogDir, file), 'utf-8')
    const parsed = parseChangelogMd(content, file, urlPrefix)
    if (parsed) {
      versions.push(parsed)
    }
  }

  // 按版本号降序排列
  versions.sort((a, b) => {
    const [aMajor, aMinor, aPatch] = a.version.split('.').map(Number)
    const [bMajor, bMinor, bPatch] = b.version.split('.').map(Number)
    if (aMajor !== bMajor) return bMajor - aMajor
    if (aMinor !== bMinor) return bMinor - aMinor
    return bPatch - aPatch
  })

  return {
    generatedAt: new Date().toISOString(),
    versions,
  }
}

/**
 * 将更新日志 JSON 写入目标目录的 api/<outputFile>
 */
function writeChangelogJson(targetDir: string, outputFile: string, data: ChangelogJson): void {
  const apiDir = path.join(targetDir, 'api')
  fs.mkdirSync(apiDir, { recursive: true })
  fs.writeFileSync(path.join(apiDir, outputFile), JSON.stringify(data, null, 2), 'utf-8')
}

/**
 * 读取并校验 plugins/changelog-editions.json；配置错误直接让构建失败
 */
function loadChangelogEditions(siteDir: string): ChangelogEditionConfig[] {
  const configPath = path.join(siteDir, 'plugins', 'changelog-editions.json')
  const raw = JSON.parse(fs.readFileSync(configPath, 'utf-8')) as { editions?: unknown }
  if (!Array.isArray(raw.editions) || raw.editions.length === 0) {
    throw new Error(`[changelog-json-plugin] ${configPath} 缺少 editions`)
  }
  const outputFiles = new Set<string>()
  return raw.editions.map((entry, index) => {
    const edition = entry as Partial<ChangelogEditionConfig>
    for (const field of ['id', 'zhSourceDir', 'outputFile', 'urlPrefix'] as const) {
      if (typeof edition[field] !== 'string' || edition[field] === '') {
        throw new Error(`[changelog-json-plugin] editions[${index}].${field} 必须是非空字符串`)
      }
    }
    const { outputFile, urlPrefix } = edition as ChangelogEditionConfig
    if (!/^[a-z0-9-]+\.json$/.test(outputFile) || !urlPrefix.startsWith('/') || outputFiles.has(outputFile)) {
      throw new Error(`[changelog-json-plugin] editions[${index}] 的 outputFile（小写 .json 文件名、不得重复）或 urlPrefix（以 / 开头）非法`)
    }
    outputFiles.add(outputFile)
    return edition as ChangelogEditionConfig
  })
}

export default function changelogJsonPlugin(context: LoadContext): Plugin {
  const editions = loadChangelogEditions(context.siteDir)

  /** 为每个发行版生成并写入 JSON */
  function generateAll(targetDir: string, label: string): Record<string, ChangelogJson> {
    const results: Record<string, ChangelogJson> = {}
    for (const edition of editions) {
      const data = generateChangelogJson(path.join(context.siteDir, edition.zhSourceDir), edition.urlPrefix)
      writeChangelogJson(targetDir, edition.outputFile, data)
      console.log(`[changelog-json-plugin] 已生成 ${label}/api/${edition.outputFile}（${data.versions.length} 个版本）`)
      results[edition.id] = data
    }
    return results
  }

  return {
    name: 'changelog-json-plugin',

    // 开发模式：在 static/ 中生成，Docusaurus 会自动 serve
    async loadContent() {
      return generateAll(path.join(context.siteDir, 'static'), 'static')
    },

    // 构建模式：复制到 build 输出目录
    async postBuild({ outDir }) {
      generateAll(outDir, 'build')
    },
  }
}
