/**
 * Docusaurus 插件：构建时生成 changelog.json
 *
 * 读取 docs/05-more/10-changelog/v*.md，解析 frontmatter 和 markdown sections，
 * 输出结构化 JSON 到 static/api/changelog.json（开发+构建均可用）。
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
  sections: ChangelogSection[]
  url: string
}

/** changelog.json 顶层结构 */
interface ChangelogJson {
  generatedAt: string
  versions: ChangelogVersion[]
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
function parseChangelogMd(content: string, fileName: string): ChangelogVersion | null {
  // 提取版本号（从文件名 v10.0.16.md → 10.0.16）
  const versionMatch = fileName.match(/^v(\d+\.\d+\.\d+)\.md$/)
  if (!versionMatch) return null
  const version = versionMatch[1]

  // 提取发布日期
  const dateMatch = content.match(/\*\*发布日期\*\*[：:]\s*(\d{4}-\d{2}-\d{2})/)
  const date = dateMatch ? dateMatch[1] : ''

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

  return {
    version,
    date,
    sections: nonEmptySections,
    url: `${SITE_URL}/more/changelog/v${version}`,
  }
}

/**
 * 生成 changelog.json 内容
 */
function generateChangelogJson(changelogDir: string): ChangelogJson {
  const files = fs.readdirSync(changelogDir).filter((f) => /^v\d+\.\d+\.\d+\.md$/.test(f))

  const versions: ChangelogVersion[] = []
  for (const file of files) {
    const content = fs.readFileSync(path.join(changelogDir, file), 'utf-8')
    const parsed = parseChangelogMd(content, file)
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
 * 将 changelog.json 写入目标目录
 */
function writeChangelogJson(targetDir: string, data: ChangelogJson): void {
  const apiDir = path.join(targetDir, 'api')
  fs.mkdirSync(apiDir, { recursive: true })
  fs.writeFileSync(path.join(apiDir, 'changelog.json'), JSON.stringify(data, null, 2), 'utf-8')
}

export default function changelogJsonPlugin(context: LoadContext): Plugin {
  const changelogDir = path.join(context.siteDir, 'docs', '05-more', '10-changelog')

  return {
    name: 'changelog-json-plugin',

    // 开发模式：在 static/ 中生成，Docusaurus 会自动 serve
    async loadContent() {
      const data = generateChangelogJson(changelogDir)
      const staticDir = path.join(context.siteDir, 'static')
      writeChangelogJson(staticDir, data)
      console.log(`[changelog-json-plugin] 已生成 static/api/changelog.json（${data.versions.length} 个版本）`)
      return data
    },

    // 构建模式：复制到 build 输出目录
    async postBuild({ outDir }) {
      const data = generateChangelogJson(changelogDir)
      writeChangelogJson(outDir, data)
      console.log(`[changelog-json-plugin] 已生成 build/api/changelog.json（${data.versions.length} 个版本）`)
    },
  }
}
