#!/usr/bin/env node

/**
 * Changelog 版本宣传图生成脚本
 *
 * 从 changelog markdown 中提取关键特性，调用 OpenAI 兼容的图像生成接口
 * （默认模型 image-2）生成背景插画，再用 sharp 叠加版本号、功能亮点等文字，
 * 输出完整宣传图。生成的背景图会统一 resize 到 2848×1600，确保文字叠加层对齐。
 *
 * 环境变量（与文本 release notes 共用同一个 AI 网关）：
 *   AI_BASE_URL — AI 网关 base URL（OpenAI 兼容，自动补 /v1/images/generations）
 *   AI_API_KEY  — AI 网关 API Key（Bearer 鉴权）
 *   IMAGE_MODEL — 图像模型名（默认 image-2；与文本模型 AI_MODEL 区分）
 *   IMAGE_SIZE  — 请求生成尺寸（默认 2848x1600，与输出一致；最终都会 resize 到 2848×1600）
 *   IMAGE_BG_FILE — 本地背景图路径（设置后跳过 AI 生成直接使用，无需 API Key；用于本地调试文字排版）
 *
 * 用法：
 *   AI_BASE_URL=https://your-gateway AI_API_KEY=xxx \
 *     node scripts/generate-changelog-cover.mjs v10.0.16
 *   ... node scripts/generate-changelog-cover.mjs v10.0.16 --force
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const sharp = require('sharp')

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const CHANGELOG_DIR_ZH = resolve(ROOT, 'docs/05-more/10-changelog')
const CHANGELOG_DIR_EN = resolve(ROOT, 'i18n/en/docusaurus-plugin-content-docs/current/05-more/10-changelog')
const IMG_DIR = resolve(ROOT, 'static/img/changelog')

// 输出宣传图尺寸（文字叠加层布局按此尺寸计算）
const WIDTH = 2848
const HEIGHT = 1600

// 图像生成接口（OpenAI 兼容）。复用文本 release notes 的同一个 AI 网关（AI_BASE_URL/AI_API_KEY），
// 仅模型名单独用 IMAGE_MODEL 区分。endpoint / model / size 由环境变量驱动。
const IMAGE_BASE_URL = process.env.AI_BASE_URL ?? ''
const MODEL_ID = process.env.IMAGE_MODEL || 'image-2'
// 请求生成尺寸：默认与输出尺寸一致（2848×1600，16:9）。原 seedream 模型即按此尺寸出图，
// image-2 同为网关图像模型，预期支持同尺寸 → resize 成为无损兜底。模型若不支持可用
// IMAGE_SIZE 覆盖为其支持的近似 16:9 尺寸，生成后仍会 resize 到 WIDTH×HEIGHT。
const REQUEST_SIZE = process.env.IMAGE_SIZE || `${WIDTH}x${HEIGHT}`

/** 由 base URL 推导 images/generations endpoint（兼容是否已含 /v1 或完整路径） */
function buildImagesEndpoint(baseUrl) {
  const t = baseUrl.replace(/\/+$/, '')
  if (t.endsWith('/images/generations')) return t
  if (/\/v1$/.test(t)) return `${t}/images/generations`
  return `${t}/v1/images/generations`
}

// 功能关键词 → 视觉意象映射表
const VISUAL_MAP = {
  '云端': '云朵与上传箭头、连接线',
  '发布': '火箭发射、部署图标',
  '同步': '双向旋转箭头、数据流',
  'Markdown': '浮动的文档卡片与编辑光标',
  '编辑': '文本编辑面板、光标与工具栏',
  '委派': '多个智能体节点之间的连线与任务流转',
  '协作': '多个人形图标协同工作、连接网络',
  '消息': '气泡对话框、消息队列',
  '排队': '有序排列的任务卡片',
  'Agent': '拟人化的智能助手、机器人图标',
  '智能体': '拟人化的智能助手光圈',
  '记忆': '大脑图标与记忆碎片、神经网络',
  '技能': '拼图模块与工具箱',
  '工具': '多功能工具箱、瑞士军刀图标',
  'Canvas': '画布与画笔、创意画板',
  'SuperDoc': '大型文档与放大镜审阅',
  '审查': '放大镜与勾选标记',
  '文件': '文件夹与文档图标',
  '头像': '用户头像圆形框与个性化图标',
  '设备': '多设备连接（手机、电脑、平板）',
  '网络': '网络拓扑节点与连接线',
  '安全': '盾牌与锁图标',
  '权限': '钥匙与分层访问控制',
  '搜索': '放大镜与搜索栏',
  '通知': '铃铛与消息提醒气泡',
  '主题': '调色板与明暗切换月亮太阳',
  '性能': '仪表盘与加速箭头',
  '市场': '应用商店网格与下载图标',
  '邮件': '信封与邮箱图标',
  '自动化': '齿轮链条与流水线传送带',
  '统计': '数据图表与仪表盘',
  '隐私': '盾牌与隐身图标',
  '安装': '下载箭头与安装进度条',
  '引导': '指引路标与欢迎手势',
}

const FIX_VISUALS = '精密齿轮组、扳手工具、绿色对勾修复标记'

const FONT = "'Alibaba PuHuiTi 3.0', 'PingFang SC', 'Noto Sans SC', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif"

// 项目色彩体系
const COLORS = {
  green: '#34C759',
  blue: '#007AFF',
  purple: '#AF52DE',
}

function parseArgs() {
  const args = process.argv.slice(2)
  const version = args.find(a => !a.startsWith('--'))
  const force = args.includes('--force')

  if (!version) {
    console.error('用法: node scripts/generate-changelog-cover.mjs <version> [--force]')
    console.error('示例: node scripts/generate-changelog-cover.mjs v10.0.16')
    process.exit(1)
  }

  return { version, force }
}

function checkApiKey() {
  const apiKey = process.env.AI_API_KEY
  if (!apiKey) {
    console.error('错误: 未设置 AI_API_KEY 环境变量')
    console.error('用法: AI_BASE_URL=... AI_API_KEY=your-key node scripts/generate-changelog-cover.mjs v10.0.16')
    process.exit(1)
  }
  if (!IMAGE_BASE_URL) {
    console.error('错误: 未设置 AI_BASE_URL 环境变量')
    process.exit(1)
  }
  return apiKey
}

function parseChangelog(content, lang = 'zh') {
  const sections = { features: [], fixes: [], improvements: [], date: '' }

  // 支持中英文日期格式
  const dateMatch = content.match(/\*\*(?:发布日期|Release Date)\*\*[：:]\s*(.+)/)
  if (dateMatch) sections.date = dateMatch[1].trim()

  const sectionRegex = /^## (.+)$/gm
  const matches = [...content.matchAll(sectionRegex)]

  // 截断阈值：英文更长
  const truncateLen = lang === 'en' ? 80 : 50

  for (let i = 0; i < matches.length; i++) {
    const title = matches[i][1].trim()
    const start = matches[i].index + matches[i][0].length
    const end = i + 1 < matches.length ? matches[i + 1].index : content.length
    const body = content.slice(start, end).trim()

    const items = []
    for (const line of body.split('\n')) {
      const boldMatch = line.match(/^\s*-\s+\*\*(.+?)\*\*/)
      if (boldMatch) {
        items.push(boldMatch[1])
      } else {
        const plainMatch = line.match(/^\s*-\s+(.+)/)
        if (plainMatch) {
          const t = plainMatch[1]
          items.push(t.length > truncateLen ? t.slice(0, truncateLen - 1) + '…' : t)
        }
      }
    }

    // 匹配中英文标题
    if (title === '新功能' || title === 'New Features') sections.features = items
    else if (title === '修复' || title === 'Fixes' || title === 'Bug Fixes') sections.fixes = items
    else if (title === '改进' || title === 'Improvements') sections.improvements = items
  }

  return sections
}

function mapToVisuals(featureName) {
  for (const [keyword, visual] of Object.entries(VISUAL_MAP)) {
    if (featureName.includes(keyword)) return visual
  }
  return featureName
}

function buildBgPrompt(version, sections) {
  const { features, fixes, improvements } = sections

  let sourceItems = features.length > 0
    ? features
    : improvements.length > 0 ? improvements : fixes

  const topItems = sourceItems.slice(0, 3)
  const visuals = topItems.map(mapToVisuals)

  const visualDesc = visuals.length > 0
    ? `画面右侧展示：${visuals.join('、')}`
    : `画面右侧展示：${FIX_VISUALS}`

  const isBugfixOnly = features.length === 0 && improvements.length === 0
  const themeHint = isBugfixOnly
    ? '主题为软件质量提升与问题修复，'
    : '主题为软件版本更新，'

  return [
    '现代科技概念插画，3D 等距风格，深蓝紫色渐变背景，',
    '画面左侧 85% 保持简洁深色（用于叠加文字），',
    '视觉元素集中在画面最右侧 15%，',
    '未来感的数字工作空间，',
    themeHint,
    visualDesc,
    '。',
    '不要出现任何文字、字母或数字。',
    '鲜明的色彩对比，发光效果，科技感光效粒子，',
    '高质量渲染，4K 分辨率。',
  ].join('')
}

/** 文生图请求重试上限（v10.0.87 封面因网关瞬时 fetch failed 缺图的教训） */
const MAX_GEN_RETRIES = 5

/**
 * 判断错误是否值得重试：网络层错误（fetch failed/超时）、5xx、429 重试；
 * 其余 4xx（400/401/402 配额/403/404）是客户端/配额问题，重试无意义且浪费配额。
 */
function isRetryableGenError(err) {
  const m = String(err?.message ?? err)
  const statusMatch = m.match(/API 请求失败 \((\d{3})\)/) || m.match(/下载生成图片失败 \((\d{3})\)/)
  if (statusMatch) {
    const status = Number(statusMatch[1])
    return status >= 500 || status === 429
  }
  return true // 无 HTTP 状态码 = 网络层/响应解析异常，按瞬时故障重试
}

/**
 * 带重试的背景图生成：失败自动重试（同一个错误反复出现也计入同一上限），
 * 最多重试 MAX_GEN_RETRIES 次，指数退避 5s/10s/20s/40s/60s。
 */
async function generateBgImage(prompt, apiKey) {
  let lastError
  for (let attempt = 0; attempt <= MAX_GEN_RETRIES; attempt++) {
    if (attempt > 0) {
      const delay = Math.min(5000 * 2 ** (attempt - 1), 60000)
      console.log(`第 ${attempt}/${MAX_GEN_RETRIES} 次重试（${delay / 1000}s 后）… 上次错误: ${lastError?.message ?? lastError}`)
      await new Promise((r) => setTimeout(r, delay))
    }
    try {
      return await requestBgImageOnce(prompt, apiKey)
    } catch (err) {
      lastError = err
      if (!isRetryableGenError(err)) {
        console.error(`不可重试错误，停止: ${err?.message ?? err}`)
        throw err
      }
    }
  }
  throw lastError
}

async function requestBgImageOnce(prompt, apiKey) {
  const endpoint = buildImagesEndpoint(IMAGE_BASE_URL)
  console.log('正在生成背景图...')
  console.log(`Endpoint: ${endpoint}  Model: ${MODEL_ID}  Size: ${REQUEST_SIZE}`)
  console.log(`Prompt: ${prompt}\n`)

  // OpenAI 兼容 images/generations 请求体（最小字段，最大兼容性）
  const body = {
    model: MODEL_ID,
    prompt,
    size: REQUEST_SIZE,
    n: 1,
    response_format: 'b64_json',
  }

  let response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })

  // 部分上游（如 GptsAPI 的 image-2）不接受 response_format 参数直接 400，
  // 去掉后重试一次（下方已兼容 b64_json 与 url 两种默认返回）
  if (!response.ok && response.status === 400) {
    const text = await response.text()
    if (/response_format/i.test(text)) {
      console.log('上游不支持 response_format 参数，去掉后重试…')
      const { response_format: _omit, ...bodyNoFormat } = body
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(bodyNoFormat),
      })
    } else {
      throw new Error(`API 请求失败 (400): ${text}`)
    }
  }

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`API 请求失败 (${response.status}): ${text}`)
  }

  const result = await response.json()

  if (result.error) {
    const e = result.error
    throw new Error(`API 返回错误: ${e.code ?? e.type ?? 'error'} - ${e.message ?? JSON.stringify(e)}`)
  }

  const imageData = result.data?.[0]
  if (!imageData) throw new Error('API 未返回图片数据')
  if (imageData.error) {
    throw new Error(`图片生成失败: ${imageData.error.code} - ${imageData.error.message}`)
  }

  // 兼容 b64_json 与 url 两种返回
  let rawBuffer
  if (imageData.b64_json) {
    rawBuffer = Buffer.from(imageData.b64_json, 'base64')
  } else if (imageData.url) {
    const imgResp = await fetch(imageData.url)
    if (!imgResp.ok) throw new Error(`下载生成图片失败 (${imgResp.status}): ${imageData.url}`)
    rawBuffer = Buffer.from(await imgResp.arrayBuffer())
  } else {
    throw new Error('API 返回数据缺少 b64_json/url 字段')
  }

  // 统一 resize 到 WIDTH×HEIGHT，确保文字叠加层布局对齐（不依赖模型实际输出尺寸）
  return sharp(rawBuffer)
    .resize(WIDTH, HEIGHT, { fit: 'fill' })
    .png()
    .toBuffer()
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * 估算文字渲染像素宽度（CJK 全宽，Latin/数字 半宽）
 */
function estimateTextWidth(str, fontSize) {
  let w = 0
  for (const ch of str) {
    const code = ch.codePointAt(0)
    // CJK 统一表意文字 + 全角标点
    w += code > 0x2E80 ? fontSize : ch === ' ' ? fontSize * 0.32 : fontSize * 0.58
  }
  return w
}

/**
 * 按像素宽度截断文字，超出则加省略号
 */
function truncateToWidth(str, fontSize, maxWidth) {
  const ellipsisW = fontSize * 0.58 // '…' 宽度
  if (estimateTextWidth(str, fontSize) <= maxWidth) return str
  let w = 0
  for (let i = 0; i < str.length; i++) {
    const code = str[i].codePointAt(0)
    const cw = code > 0x2E80 ? fontSize : str[i] === ' ' ? fontSize * 0.32 : fontSize * 0.58
    if (w + cw + ellipsisW > maxWidth) return str.slice(0, i) + '…'
    w += cw
  }
  return str
}

/**
 * 生成一列带圆点的列表项 SVG
 */
function buildListColumn(items, opts) {
  const { x, startY, gap, fontSize, dotR, dotColor, maxTextWidth, textOpacity } = opts
  const dotCx = x + dotR
  const textX = x + dotR * 2 + 14
  const dotOffsetY = Math.round(fontSize * 0.36)
  const fillOpacity = textOpacity ?? 0.92

  return items.map((name, i) => {
    const y = startY + i * gap
    const cy = y - dotOffsetY
    const color = typeof dotColor === 'string' ? dotColor : dotColor[i % dotColor.length]
    const label = escapeXml(truncateToWidth(name, fontSize, maxTextWidth))
    return `    <circle cx="${dotCx}" cy="${cy}" r="${dotR}" fill="${color}" opacity="0.9"/>
    <circle cx="${dotCx}" cy="${cy}" r="${dotR * 2}" fill="${color}" opacity="0.12"/>
    <text x="${textX}" y="${y}" font-family="${FONT}" font-size="${fontSize}" fill="rgba(255,255,255,${fillOpacity})" font-weight="500">${label}</text>`
  }).join('\n')
}

/**
 * 构建文字叠加层 SVG — 数据驱动布局
 *
 * 三阶段：1) 收集测量  2) 计算布局  3) 渲染 SVG
 */
function buildTextOverlay(version, sections, lang = 'zh') {
  const { features, fixes, improvements, date } = sections

  // 中英文标签
  const L = lang === 'en'
    ? { features: 'New Features', fixes: 'Fixes', improvements: 'Improvements',
        thisUpdate: 'This Update', fallbackFeat: count => `${count} bug fixes & stability improvements`,
        fallbackDefault: 'Release update',
        statFeat: n => `${n} Features`, statImp: n => `${n} Improvements`, statFix: n => `${n} Fixes` }
    : { features: '新功能', fixes: '修复', improvements: '改进',
        thisUpdate: '本次更新', fallbackFeat: count => `${count} 项问题修复与稳定性提升`,
        fallbackDefault: '版本优化',
        statFeat: n => `${n} 新功能`, statImp: n => `${n} 改进`, statFix: n => `${n} 修复` }

  // ════════════════════════════════════════════
  //  Phase 1: 收集数据
  // ════════════════════════════════════════════

  let col1Items = features.length > 0
    ? features
    : fixes.length > 0 ? [L.fallbackFeat(fixes.length)] : [L.fallbackDefault]
  let col2Items = improvements
  const twoColumn = col2Items.length > 0

  const stats = []
  if (features.length > 0) stats.push(L.statFeat(features.length))
  if (improvements.length > 0) stats.push(L.statImp(improvements.length))
  if (fixes.length > 0) stats.push(L.statFix(fixes.length))
  const statsText = stats.join('   ·   ')

  // ════════════════════════════════════════════
  //  Phase 2: 测量 → 计算布局（全部数据驱动）
  // ════════════════════════════════════════════

  const padLeft = 140
  const dotR = 6
  const fixDotR = 5
  const dotSlot = dotR * 2 + 14
  const fixDotSlot = fixDotR * 2 + 14
  const colGap = 40
  const readableEdge = Math.round(WIDTH * 0.95)
  const usableW = readableEdge - padLeft

  // ── 2a. 统计总内容量，驱动所有尺寸 ──
  let maxMainRows = Math.max(col1Items.length, twoColumn ? col2Items.length : 0)
  const totalItems = col1Items.length + col2Items.length + fixes.length

  // 内容密度：sparse(≤8) / normal(9-16) / dense(17-44) / ultra(45+ 或单列超 24 行)
  // ultra 档为超大版本（如 v10.0.83：32 新功能 + 18 改进 + 57 修复）压缩头部与行距，
  // 尽量完整展示条目；仍放不下的由 2d' 的行数硬截断折叠兜底，绝不溢出画布
  const density = totalItems <= 8 ? 'sparse'
    : totalItems <= 16 ? 'normal'
    : (totalItems <= 44 && maxMainRows <= 24) ? 'dense'
    : 'ultra'

  // ── 2b. 头部尺寸（随密度缩放）──
  const versionFontSize = { sparse: 140, normal: 110, dense: 88, ultra: 76 }[density]
  const padTop = { sparse: 120, normal: 80, dense: 60, ultra: 48 }[density]
  const brandGap = 12                                   // DESIRECORE → 版本号间距
  const brandFontSize = { sparse: 40, normal: 36, dense: 36, ultra: 32 }[density]
  const postVersionGap = { sparse: 45, normal: 35, dense: 28, ultra: 24 }[density]  // 版本号 → 强调线
  const postAccentGap = { sparse: 75, normal: 70, dense: 68, ultra: 60 }[density]   // 强调线 → 栏标签
  const postLabelGap = { sparse: 58, normal: 54, dense: 52, ultra: 46 }[density]    // 栏标签 → 列表首行

  const brandY = padTop + brandFontSize
  const versionY = brandY + brandGap + versionFontSize
  const accentLineY = versionY + postVersionGap
  const sectionLabelY = accentLineY + postAccentGap
  const listStartY = sectionLabelY + postLabelGap

  // ── 2c. 底部固定区 ──
  const statsY = HEIGHT - 100
  const dateY = HEIGHT - 52
  const listAreaH = statsY - 30 - listStartY

  // ── 2d. 列表字号（随密度选择）──
  const fontSize = twoColumn
    ? { sparse: 46, normal: 42, dense: 38, ultra: 32 }[density]
    : { sparse: 48, normal: 44, dense: 40, ultra: 34 }[density]
  const fixFontSize = Math.round(fontSize * 0.8)

  // ── 2d'. 主列表行数硬截断：按最小行距算出可容纳行数，放不下的尾部折叠为汇总行 ──
  // （这是防溢出的最终兜底：density 只缩放尺寸、不减少行数，条目再多也不能画出画布）
  const minMainGap = { sparse: 56, normal: 48, dense: 42, ultra: 36 }[density]
  const maxMainGap = { sparse: 80, normal: 68, dense: 56, ultra: 46 }[density]
  const maxRowsFit = Math.max(3, Math.floor(listAreaH / minMainGap))
  const foldLabel = n => lang === 'en' ? `+${n} more` : `…等 ${n} 项`
  if (col1Items.length > maxRowsFit) {
    const hidden = col1Items.length - (maxRowsFit - 1)
    col1Items = [...col1Items.slice(0, maxRowsFit - 1), foldLabel(hidden)]
  }
  if (col2Items.length > maxRowsFit) {
    const hidden = col2Items.length - (maxRowsFit - 1)
    col2Items = [...col2Items.slice(0, maxRowsFit - 1), foldLabel(hidden)]
  }
  maxMainRows = Math.max(col1Items.length, twoColumn ? col2Items.length : 0)

  // ── 2e. 测量文字宽度 → 列位置 ──
  let col1TextW, col2X, col2TextW
  if (twoColumn) {
    const col1Natural = Math.max(...col1Items.map(s => estimateTextWidth(s, fontSize)))
    col1TextW = Math.min(col1Natural, usableW * 0.4)
    col2X = padLeft + dotSlot + col1TextW + colGap
    col2TextW = readableEdge - col2X - dotSlot
  } else {
    col1TextW = usableW - dotSlot
    col2X = 0
    col2TextW = 0
  }

  // ── 2f. 垂直分配：主列表 → 修复区 ──
  const fixSectionH = 90                             // 修复标签 + 标签到列表间距
  const minFixGap = { sparse: 44, normal: 38, dense: 34, ultra: 30 }[density]
  const maxFixGap = { sparse: 56, normal: 48, dense: 42, ultra: 36 }[density]

  let fixItems = []
  let mainGap, fixGap, fixStartY

  if (fixes.length > 0) {
    for (let tryFix = fixes.length; tryFix >= 0; tryFix--) {
      const fixH = tryFix > 0 ? fixSectionH + tryFix * minFixGap : 0
      const gap = Math.floor((listAreaH - fixH) / maxMainRows)
      if (gap >= minMainGap || tryFix === 0) {
        mainGap = Math.min(maxMainGap, Math.max(minMainGap, gap))
        fixItems = fixes.slice(0, tryFix)
        if (tryFix > 0) {
          const mainEnd = listStartY + maxMainRows * mainGap
          fixStartY = mainEnd + fixSectionH
          const fixRemain = statsY - 30 - fixStartY
          fixGap = Math.min(maxFixGap, Math.max(minFixGap, Math.floor(fixRemain / tryFix)))
          const fitCount = Math.floor((statsY - 30 - fixStartY) / fixGap)
          if (fitCount < tryFix) fixItems = fixes.slice(0, Math.max(0, fitCount))
        }
        break
      }
    }
  } else {
    mainGap = Math.min(maxMainGap, Math.floor(listAreaH / maxMainRows))
  }

  const actualMainEnd = listStartY + maxMainRows * mainGap
  const fixMaxTextW = readableEdge - padLeft - fixDotSlot

  // ════════════════════════════════════════════
  //  Phase 3: 渲染 SVG
  // ════════════════════════════════════════════

  const col1Svg = buildListColumn(col1Items, {
    x: padLeft, startY: listStartY, gap: mainGap,
    fontSize, dotR, dotColor: COLORS.green, maxTextWidth: col1TextW,
  })

  const col2Svg = twoColumn ? buildListColumn(col2Items, {
    x: col2X, startY: listStartY, gap: mainGap,
    fontSize, dotR, dotColor: COLORS.blue, maxTextWidth: col2TextW,
  }) : ''

  const fixLabelFontSize = Math.round(fixFontSize * 0.78)
  const fixLabelY = actualMainEnd + 40
  const fixLabelSvg = fixItems.length > 0
    ? `\n  <text x="${padLeft}" y="${fixLabelY}" font-family="${FONT}" font-size="${fixLabelFontSize}" fill="${COLORS.purple}" font-weight="600" letter-spacing="2" opacity="0.8">${L.fixes}</text>`
    : ''
  const fixSvg = fixItems.length > 0 ? buildListColumn(fixItems, {
    x: padLeft, startY: fixStartY, gap: fixGap,
    fontSize: fixFontSize, dotR: fixDotR, dotColor: COLORS.purple,
    maxTextWidth: fixMaxTextW, textOpacity: 0.7,
  }) : ''

  // 遮罩：文字区域高不透明度 → 右侧柔和渐变过渡 → 背景插画
  const overlayStops = twoColumn
    ? `<stop offset="0%" stop-color="#0a0a18" stop-opacity="0.93"/>
      <stop offset="55%" stop-color="#0a0a18" stop-opacity="0.88"/>
      <stop offset="72%" stop-color="#0a0a18" stop-opacity="0.55"/>
      <stop offset="85%" stop-color="#0a0a18" stop-opacity="0.25"/>
      <stop offset="95%" stop-color="#0a0a18" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#0a0a18" stop-opacity="0"/>`
    : `<stop offset="0%" stop-color="#0a0a18" stop-opacity="0.92"/>
      <stop offset="40%" stop-color="#0a0a18" stop-opacity="0.85"/>
      <stop offset="60%" stop-color="#0a0a18" stop-opacity="0.55"/>
      <stop offset="78%" stop-color="#0a0a18" stop-opacity="0.2"/>
      <stop offset="90%" stop-color="#0a0a18" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#0a0a18" stop-opacity="0"/>`

  const col2LabelSvg = twoColumn
    ? `\n  <text x="${col2X}" y="${sectionLabelY}" font-family="${FONT}" font-size="${Math.round(fontSize * 0.7)}" fill="${COLORS.blue}" font-weight="600" letter-spacing="2">${L.improvements}</text>`
    : ''
  const col1LabelSize = Math.round(fontSize * 0.7)

  return `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="leftOverlay" x1="0" y1="0" x2="1" y2="0">
      ${overlayStops}
    </linearGradient>
    <linearGradient id="edgeBar" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${COLORS.blue}"/>
      <stop offset="50%" stop-color="${COLORS.purple}"/>
      <stop offset="100%" stop-color="${COLORS.green}"/>
    </linearGradient>
    <linearGradient id="accentLine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${COLORS.blue}"/>
      <stop offset="50%" stop-color="${COLORS.purple}"/>
      <stop offset="100%" stop-color="${COLORS.purple}" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="glow1" cx="0.25" cy="0.45" r="0.5">
      <stop offset="0%" stop-color="${COLORS.blue}" stop-opacity="0.07"/>
      <stop offset="100%" stop-color="${COLORS.blue}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0.2" cy="0.75" r="0.35">
      <stop offset="0%" stop-color="${COLORS.purple}" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="${COLORS.purple}" stop-opacity="0"/>
    </radialGradient>
    <filter id="urlGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="blur"/></feMerge>
    </filter>
  </defs>

  <!-- 遮罩 -->
  <rect width="100%" height="100%" fill="url(#leftOverlay)"/>
  <rect width="100%" height="100%" fill="url(#glow1)"/>
  <rect width="100%" height="100%" fill="url(#glow2)"/>

  <!-- 左边缘装饰条 -->
  <rect x="0" y="0" width="6" height="100%" fill="url(#edgeBar)"/>

  <!-- 品牌名 -->
  <text x="${padLeft}" y="${brandY}" font-family="${FONT}" font-size="${brandFontSize}" fill="rgba(255,255,255,0.4)" font-weight="300" letter-spacing="10">DESIRECORE</text>

  <!-- 版本号 -->
  <text x="${padLeft}" y="${versionY}" font-family="${FONT}" font-size="${versionFontSize}" fill="white" font-weight="800">${escapeXml(version)}</text>

  <!-- 强调线 -->
  <rect x="${padLeft}" y="${accentLineY}" width="360" height="4" rx="2" fill="url(#accentLine)"/>

  <!-- 栏标签 -->
  <text x="${padLeft}" y="${sectionLabelY}" font-family="${FONT}" font-size="${col1LabelSize}" fill="${COLORS.green}" font-weight="600" letter-spacing="2">${features.length > 0 ? L.features : L.thisUpdate}</text>${col2LabelSvg}

  <!-- 左栏 -->
${col1Svg}

  <!-- 右栏 -->
${col2Svg}

  <!-- 修复区域 -->${fixLabelSvg}
${fixSvg}

  <!-- 统计 + 日期 -->
  <text x="${padLeft}" y="${statsY}" font-family="${FONT}" font-size="32" fill="rgba(255,255,255,0.35)" font-weight="300">${escapeXml(statsText)}</text>
  <text x="${padLeft}" y="${dateY}" font-family="${FONT}" font-size="32" fill="rgba(255,255,255,0.3)" font-weight="300">${escapeXml(date)}</text>

  <!-- 官网（光环 + 加粗） -->
  <text x="${WIDTH - 60}" y="${HEIGHT - 50}" font-family="${FONT}" font-size="28" fill="rgba(120,180,255,0.2)" font-weight="600" text-anchor="end" filter="url(#urlGlow)">www.desirecore.cn</text>
  <text x="${WIDTH - 60}" y="${HEIGHT - 50}" font-family="${FONT}" font-size="28" fill="rgba(255,255,255,0.55)" font-weight="600" text-anchor="end">www.desirecore.cn</text>
</svg>`
}

async function compositeImage(bgBuffer, overlaySvg) {
  return sharp(bgBuffer)
    .composite([{
      input: Buffer.from(overlaySvg),
      top: 0,
      left: 0,
    }])
    .png({ compressionLevel: 9, effort: 10 })
    .toBuffer()
}

function insertImageRef(content, version, imgPath) {
  if (content.includes('![')) {
    console.log('Markdown 中已存在图片引用，跳过插入')
    return content
  }

  const dateLineRegex = /(\*\*(?:发布日期|Release Date)\*\*[：:].+\n)/
  const match = content.match(dateLineRegex)

  if (match) {
    const insertPos = match.index + match[0].length
    const imgRef = `\n![${version} 更新概览](${imgPath})\n`
    return content.slice(0, insertPos) + imgRef + content.slice(insertPos)
  }

  const h1Regex = /(^# .+\n)/m
  const h1Match = content.match(h1Regex)
  if (h1Match) {
    const insertPos = h1Match.index + h1Match[0].length
    const imgRef = `\n![${version} 更新概览](${imgPath})\n`
    return content.slice(0, insertPos) + imgRef + content.slice(insertPos)
  }

  console.warn('警告: 未找到合适的插入位置，跳过图片引用插入')
  return content
}

async function main() {
  const { version, force } = parseArgs()
  const bgFile = process.env.IMAGE_BG_FILE
  const apiKey = bgFile ? null : checkApiKey()

  const zhMdFile = resolve(CHANGELOG_DIR_ZH, `${version}.md`)
  const enMdFile = resolve(CHANGELOG_DIR_EN, `${version}.md`)
  if (!existsSync(zhMdFile)) {
    console.error(`错误: 找不到中文 changelog 文件: ${zhMdFile}`)
    process.exit(1)
  }

  const zhImgFile = resolve(IMG_DIR, `${version}.png`)
  const enImgFile = resolve(IMG_DIR, `${version}-en.png`)
  const zhImgRefPath = `/img/changelog/${version}.png`
  const enImgRefPath = `/img/changelog/${version}-en.png`

  if (existsSync(zhImgFile) && existsSync(enImgFile) && !force) {
    console.log(`图片已存在: ${zhImgFile}, ${enImgFile}`)
    console.log('使用 --force 覆盖')

    // 仅检查并插入图片引用
    for (const [mdFile, imgRefPath] of [[zhMdFile, zhImgRefPath], [enMdFile, enImgRefPath]]) {
      if (!existsSync(mdFile)) continue
      const content = readFileSync(mdFile, 'utf-8')
      if (!content.includes('![')) {
        const updated = insertImageRef(content, version, imgRefPath)
        if (updated !== content) {
          writeFileSync(mdFile, updated)
          console.log(`已在 ${mdFile} 中插入图片引用`)
        }
      }
    }
    return
  }

  const zhContent = readFileSync(zhMdFile, 'utf-8')
  const zhSections = parseChangelog(zhContent, 'zh')

  console.log(`解析 ${version} (中文):`)
  console.log(`  新功能: ${zhSections.features.length} 项${zhSections.features.length > 0 ? ' (' + zhSections.features.join(', ') + ')' : ''}`)
  console.log(`  修复: ${zhSections.fixes.length} 项`)
  console.log(`  改进: ${zhSections.improvements.length} 项`)
  console.log(`  日期: ${zhSections.date}\n`)

  // 1. 生成 AI 背景图（基于中文内容生成 prompt，中英文共享同一背景）
  //    设置 IMAGE_BG_FILE 时改用本地文件，跳过 AI 调用（本地调试排版用）
  let bgBuffer
  if (bgFile) {
    console.log(`使用本地背景图（跳过 AI 生成）: ${bgFile}`)
    bgBuffer = await sharp(readFileSync(bgFile))
      .resize(WIDTH, HEIGHT, { fit: 'fill' })
      .png()
      .toBuffer()
  } else {
    const bgPrompt = buildBgPrompt(version, zhSections)
    bgBuffer = await generateBgImage(bgPrompt, apiKey)
    console.log(`背景图已生成 (${(bgBuffer.length / 1024 / 1024).toFixed(1)} MB)`)
  }

  mkdirSync(IMG_DIR, { recursive: true })

  // 2. 生成中文配图
  console.log('正在合成中文宣传图...')
  const zhOverlaySvg = buildTextOverlay(version, zhSections, 'zh')
  const zhFinalBuffer = await compositeImage(bgBuffer, zhOverlaySvg)
  writeFileSync(zhImgFile, zhFinalBuffer)
  console.log(`中文宣传图已保存: ${zhImgFile} (${(zhFinalBuffer.length / 1024 / 1024).toFixed(1)} MB)`)

  // 插入中文图片引用
  const zhUpdated = insertImageRef(zhContent, version, zhImgRefPath)
  if (zhUpdated !== zhContent) {
    writeFileSync(zhMdFile, zhUpdated)
    console.log(`已在中文 ${version}.md 中插入图片引用`)
  }

  // 3. 生成英文配图（共享背景，英文文字叠加层）
  if (existsSync(enMdFile)) {
    const enContent = readFileSync(enMdFile, 'utf-8')
    const enSections = parseChangelog(enContent, 'en')

    console.log(`\n解析 ${version} (English):`)
    console.log(`  Features: ${enSections.features.length}`)
    console.log(`  Fixes: ${enSections.fixes.length}`)
    console.log(`  Improvements: ${enSections.improvements.length}`)
    console.log(`  Date: ${enSections.date}\n`)

    console.log('正在合成英文宣传图...')
    const enOverlaySvg = buildTextOverlay(version, enSections, 'en')
    const enFinalBuffer = await compositeImage(bgBuffer, enOverlaySvg)
    writeFileSync(enImgFile, enFinalBuffer)
    console.log(`英文宣传图已保存: ${enImgFile} (${(enFinalBuffer.length / 1024 / 1024).toFixed(1)} MB)`)

    // 更新英文 markdown 引用英文配图
    const enImgRef = enContent.includes('![')
      ? enContent.replace(/!\[.*?\]\(\/img\/changelog\/[^)]+\)/, `![${version} Release Overview](${enImgRefPath})`)
      : insertImageRef(enContent, version, enImgRefPath)
    if (enImgRef !== enContent) {
      writeFileSync(enMdFile, enImgRef)
      console.log(`已在英文 ${version}.md 中更新图片引用`)
    }
  } else {
    console.log(`未找到英文 changelog: ${enMdFile}，跳过英文配图生成`)
  }

  console.log('\n完成!')
}

main().catch(err => {
  console.error(`错误: ${err.message}`)
  process.exit(1)
})
