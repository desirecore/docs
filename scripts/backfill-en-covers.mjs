#!/usr/bin/env node

/**
 * 一次性脚本：为所有历史版本生成英文配图
 *
 * 从现有中文配图中提取背景（直接使用中文 PNG 作为背景底图），
 * 叠加英文文字层生成 {version}-en.png，并更新英文 markdown 图片引用。
 *
 * 用法：node scripts/backfill-en-covers.mjs
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const sharp = require('sharp')

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const ZH_DIR = resolve(ROOT, 'docs/05-more/10-changelog')
const EN_DIR = resolve(ROOT, 'i18n/en/docusaurus-plugin-content-docs/current/05-more/10-changelog')
const IMG_DIR = resolve(ROOT, 'static/img/changelog')

// 从 generate-changelog-cover.mjs 中导入共享的函数和常量
// 由于那边是独立脚本不太好 import，这里复制核心渲染逻辑

const WIDTH = 2848
const HEIGHT = 1600
const FONT = "'PingFang SC', 'Noto Sans SC', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif"
const COLORS = { green: '#34C759', blue: '#007AFF', purple: '#AF52DE' }

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function estimateTextWidth(str, fontSize) {
  let w = 0
  for (const ch of str) {
    const code = ch.codePointAt(0)
    w += code > 0x2E80 ? fontSize : ch === ' ' ? fontSize * 0.32 : fontSize * 0.58
  }
  return w
}

function truncateToWidth(str, fontSize, maxWidth) {
  const ellipsisW = fontSize * 0.58
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

function parseChangelog(content) {
  const sections = { features: [], fixes: [], improvements: [], date: '' }
  const dateMatch = content.match(/\*\*(?:发布日期|Release Date)\*\*[：:]\s*(.+)/)
  if (dateMatch) sections.date = dateMatch[1].trim()

  const sectionRegex = /^## (.+)$/gm
  const matches = [...content.matchAll(sectionRegex)]
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
          items.push(t.length > 80 ? t.slice(0, 79) + '…' : t)
        }
      }
    }
    if (title === 'New Features') sections.features = items
    else if (title === 'Fixes' || title === 'Bug Fixes') sections.fixes = items
    else if (title === 'Improvements') sections.improvements = items
  }
  return sections
}

function buildTextOverlay(version, sections) {
  const { features, fixes, improvements, date } = sections
  const L = {
    features: 'New Features', fixes: 'Fixes', improvements: 'Improvements',
    thisUpdate: 'This Update',
    fallbackFeat: count => `${count} bug fixes & stability improvements`,
    fallbackDefault: 'Release update',
    statFeat: n => `${n} Features`, statImp: n => `${n} Improvements`, statFix: n => `${n} Fixes`,
  }

  const col1Items = features.length > 0
    ? features
    : fixes.length > 0 ? [L.fallbackFeat(fixes.length)] : [L.fallbackDefault]
  const col2Items = improvements
  const twoColumn = col2Items.length > 0

  const stats = []
  if (features.length > 0) stats.push(L.statFeat(features.length))
  if (improvements.length > 0) stats.push(L.statImp(improvements.length))
  if (fixes.length > 0) stats.push(L.statFix(fixes.length))
  const statsText = stats.join('   ·   ')

  const padLeft = 140
  const dotR = 6
  const fixDotR = 5
  const dotSlot = dotR * 2 + 14
  const fixDotSlot = fixDotR * 2 + 14
  const colGap = 40
  const readableEdge = Math.round(WIDTH * 0.95)
  const usableW = readableEdge - padLeft

  const maxMainRows = Math.max(col1Items.length, twoColumn ? col2Items.length : 0)
  const totalItems = col1Items.length + col2Items.length + fixes.length
  const density = totalItems <= 8 ? 'sparse' : totalItems <= 16 ? 'normal' : 'dense'

  const versionFontSize = { sparse: 140, normal: 110, dense: 88 }[density]
  const padTop = { sparse: 120, normal: 80, dense: 60 }[density]
  const brandGap = 12
  const brandFontSize = { sparse: 40, normal: 36, dense: 36 }[density]
  const postVersionGap = { sparse: 45, normal: 35, dense: 28 }[density]
  const postAccentGap = { sparse: 75, normal: 70, dense: 68 }[density]
  const postLabelGap = { sparse: 58, normal: 54, dense: 52 }[density]

  const brandY = padTop + brandFontSize
  const versionY = brandY + brandGap + versionFontSize
  const accentLineY = versionY + postVersionGap
  const sectionLabelY = accentLineY + postAccentGap
  const listStartY = sectionLabelY + postLabelGap

  const statsY = HEIGHT - 100
  const dateY = HEIGHT - 52
  const listAreaH = statsY - 30 - listStartY

  const fontSize = twoColumn
    ? { sparse: 46, normal: 42, dense: 38 }[density]
    : { sparse: 48, normal: 44, dense: 40 }[density]
  const fixFontSize = Math.round(fontSize * 0.8)

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

  const minMainGap = { sparse: 56, normal: 48, dense: 42 }[density]
  const maxMainGap = { sparse: 80, normal: 68, dense: 56 }[density]
  const fixSectionH = 90
  const minFixGap = { sparse: 44, normal: 38, dense: 34 }[density]
  const maxFixGap = { sparse: 56, normal: 48, dense: 42 }[density]

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

  <rect width="100%" height="100%" fill="url(#leftOverlay)"/>
  <rect width="100%" height="100%" fill="url(#glow1)"/>
  <rect width="100%" height="100%" fill="url(#glow2)"/>
  <rect x="0" y="0" width="6" height="100%" fill="url(#edgeBar)"/>

  <text x="${padLeft}" y="${brandY}" font-family="${FONT}" font-size="${brandFontSize}" fill="rgba(255,255,255,0.4)" font-weight="300" letter-spacing="10">DESIRECORE</text>
  <text x="${padLeft}" y="${versionY}" font-family="${FONT}" font-size="${versionFontSize}" fill="white" font-weight="800">${escapeXml(version)}</text>
  <rect x="${padLeft}" y="${accentLineY}" width="360" height="4" rx="2" fill="url(#accentLine)"/>

  <text x="${padLeft}" y="${sectionLabelY}" font-family="${FONT}" font-size="${col1LabelSize}" fill="${COLORS.green}" font-weight="600" letter-spacing="2">${features.length > 0 ? L.features : L.thisUpdate}</text>${col2LabelSvg}

${col1Svg}
${col2Svg}
${fixLabelSvg}
${fixSvg}

  <text x="${padLeft}" y="${statsY}" font-family="${FONT}" font-size="32" fill="rgba(255,255,255,0.35)" font-weight="300">${escapeXml(statsText)}</text>
  <text x="${padLeft}" y="${dateY}" font-family="${FONT}" font-size="32" fill="rgba(255,255,255,0.3)" font-weight="300">${escapeXml(date)}</text>

  <text x="${WIDTH - 60}" y="${HEIGHT - 50}" font-family="${FONT}" font-size="28" fill="rgba(120,180,255,0.2)" font-weight="600" text-anchor="end" filter="url(#urlGlow)">www.desirecore.cn</text>
  <text x="${WIDTH - 60}" y="${HEIGHT - 50}" font-family="${FONT}" font-size="28" fill="rgba(255,255,255,0.55)" font-weight="600" text-anchor="end">www.desirecore.cn</text>
</svg>`
}

async function main() {
  const versions = readdirSync(IMG_DIR)
    .filter(f => /^v10\.0\.\d+\.png$/.test(f))
    .map(f => f.replace('.png', ''))
    .sort((a, b) => {
      const na = parseInt(a.match(/\.(\d+)$/)[1])
      const nb = parseInt(b.match(/\.(\d+)$/)[1])
      return na - nb
    })

  console.log(`Found ${versions.length} versions to process: ${versions.join(', ')}\n`)

  let generated = 0
  let skipped = 0
  let noEnFile = 0

  for (const version of versions) {
    const enMdFile = resolve(EN_DIR, `${version}.md`)
    const zhImgFile = resolve(IMG_DIR, `${version}.png`)
    const enImgFile = resolve(IMG_DIR, `${version}-en.png`)

    if (!existsSync(enMdFile)) {
      console.log(`[${version}] No English changelog, skipping`)
      noEnFile++
      continue
    }

    if (existsSync(enImgFile)) {
      console.log(`[${version}] English cover already exists, skipping`)
      skipped++
      continue
    }

    const enContent = readFileSync(enMdFile, 'utf-8')
    const sections = parseChangelog(enContent)

    if (sections.features.length === 0 && sections.fixes.length === 0 && sections.improvements.length === 0) {
      console.log(`[${version}] No parseable sections in English changelog, skipping`)
      skipped++
      continue
    }

    console.log(`[${version}] Generating English cover (${sections.features.length}F/${sections.fixes.length}B/${sections.improvements.length}I)...`)

    // 使用中文配图作为背景底图
    const bgBuffer = readFileSync(zhImgFile)

    const overlaySvg = buildTextOverlay(version, sections)
    const finalBuffer = await sharp(bgBuffer)
      .composite([{ input: Buffer.from(overlaySvg), top: 0, left: 0 }])
      .png({ compressionLevel: 9, effort: 10 })
      .toBuffer()

    writeFileSync(enImgFile, finalBuffer)
    console.log(`  → Saved ${enImgFile} (${(finalBuffer.length / 1024 / 1024).toFixed(1)} MB)`)

    // 更新英文 markdown 图片引用
    const enImgRefPath = `/img/changelog/${version}-en.png`
    if (enContent.includes('![')) {
      // 替换已有的图片引用（可能指向中文配图）
      const updated = enContent.replace(
        /!\[.*?\]\(\/img\/changelog\/[^)]+\)/,
        `![${version} Release Overview](${enImgRefPath})`
      )
      if (updated !== enContent) {
        writeFileSync(enMdFile, updated)
        console.log(`  → Updated image ref in English markdown`)
      }
    } else {
      // 插入图片引用
      const dateLineRegex = /(\*\*(?:Release Date)\*\*[：:].+\n)/
      const match = enContent.match(dateLineRegex)
      if (match) {
        const insertPos = match.index + match[0].length
        const imgRef = `\n![${version} Release Overview](${enImgRefPath})\n`
        const updated = enContent.slice(0, insertPos) + imgRef + enContent.slice(insertPos)
        writeFileSync(enMdFile, updated)
        console.log(`  → Inserted image ref in English markdown`)
      }
    }

    generated++
  }

  console.log(`\nDone! Generated: ${generated}, Skipped: ${skipped}, No EN file: ${noEnFile}`)
}

main().catch(err => {
  console.error(`Error: ${err.message}`)
  process.exit(1)
})
