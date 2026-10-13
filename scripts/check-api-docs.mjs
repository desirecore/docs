#!/usr/bin/env node

// Offline checks for the selected public API pages. Source provenance is maintenance
// data: this checker does not execute private source or certify runtime behavior.
import { readFile, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2).filter(argument => argument !== '--')
const failures = []
const fail = message => failures.push(message)
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value)
const isText = value => typeof value === 'string' && value.trim().length > 0
const normalizeRoute = value => value === '/' ? '/' : value.replace(/\/$/, '')
const stringValue = value => value.trim().replace(/^(['"])(.*)\1$/, '$2')

function localPath(relative, context) {
  if (!isText(relative) || path.isAbsolute(relative) || relative.includes('\\')) {
    fail(`${context}: expected a repository-relative path`)
    return null
  }
  const resolved = path.resolve(root, relative)
  if (!resolved.startsWith(root + path.sep)) {
    fail(`${context}: path escapes the repository`)
    return null
  }
  return resolved
}

async function read(relative) {
  const file = localPath(relative, relative)
  if (!file) return null
  try {
    return await readFile(file, 'utf8')
  } catch (error) {
    fail(`${relative}: ${error.code ?? error.message}`)
    return null
  }
}

function scanMarkdown(content, file) {
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1]
  const slug = frontmatter?.match(/^slug:\s*(.*?)\s*$/m)?.[1]
  if (!slug) fail(`${file}: an explicit frontmatter slug is required`)
  const versions = []
  let scope = 'page'
  let headingOrdinal = 0
  let fence = null
  let admonition = null
  let jsonBlocks = 0
  const lines = content.split(/\r?\n/)
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    if (fence) {
      const closing = line.match(/^ {0,3}(`{3,}|~{3,})\s*$/)
      if (closing && closing[1][0] === fence.char && closing[1].length >= fence.length) {
        if (fence.json) {
          jsonBlocks += 1
          try { JSON.parse(fence.lines.join('\n')) } catch (error) {
            fail(`${file}:${fence.start}: invalid JSON code block (${error.message})`)
          }
        }
        fence = null
      } else {
        fence.lines.push(line)
      }
      continue
    }
    const opening = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/)
    if (opening) {
      fence = { char: opening[1][0], length: opening[1].length, json: /^json(?:\s|$)/i.test(opening[2].trim()), lines: [], start: index + 1 }
      continue
    }
    const heading = line.match(/^(#{1,6})\s+(.+)$/)
    if (heading) {
      headingOrdinal += 1
      // Matching explicit heading IDs provide a stable bilingual scope key.
      // Without IDs, matching heading positions only checks structural placement.
      scope = heading[2].match(/\{#([^}]+)\}\s*$/)?.[1] ?? `heading-${headingOrdinal}-level-${heading[1].length}`
    }
    if (admonition) {
      if (/^:::\s*$/.test(line)) {
        const text = admonition.lines.join('\n')
        const matches = [...text.matchAll(/`(v\d+\.\d+\.\d+\+)`/g)].map(match => match[1])
        if (matches.length !== 1) fail(`${file}:${admonition.start}: effective-version callout must contain exactly one inline vX.Y.Z+ version`)
        if (!text.replace(/`v\d+\.\d+\.\d+\+`/g, '').replace(/[\s().。（）]/g, '')) fail(`${file}:${admonition.start}: effective-version callout must identify its feature scope`)
        versions.push({ version: matches[0], scope: admonition.scope })
        admonition = null
      } else {
        if (/^:::/.test(line)) fail(`${file}:${index + 1}: effective-version callout must not contain another admonition`)
        admonition.lines.push(line)
      }
    } else if (/^:::info\s+(生效版本|Effective version)\s*$/.test(line)) {
      const expected = file.startsWith('i18n/en/') ? 'Effective version' : '生效版本'
      if (!line.trimEnd().endsWith(expected)) fail(`${file}:${index + 1}: expected callout title ${expected}`)
      admonition = { start: index + 1, scope, lines: [] }
    }
  }
  if (fence?.json) fail(`${file}:${fence.start}: unclosed JSON code block`)
  if (admonition) fail(`${file}:${admonition.start}: unclosed effective-version callout`)
  return { slug: slug ? stringValue(slug) : null, versions, jsonBlocks }
}

function decodeXml(value) {
  return value.replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"').replaceAll('&apos;', "'")
}

function linkMetadata(html) {
  return [...html.matchAll(/<link\b[^>]*>/gi)].map(match => Object.fromEntries(
    [...match[0].matchAll(/([\w-]+)\s*=\s*["']([^"']*)["']/g)].map(attribute => [attribute[1].toLowerCase(), decodeXml(attribute[2])])
  ))
}

function urlPath(url, context) {
  try { return normalizeRoute(new URL(url).pathname) } catch { fail(`${context}: invalid absolute URL ${url}`); return null }
}

async function checkBuild(pages) {
  const sitemapUrls = new Map()
  for (const language of ['', 'en']) {
    const sitemapFile = path.posix.join('build', language, 'sitemap.xml')
    const xml = await read(sitemapFile)
    if (xml !== null) {
      const entries = [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map(match => decodeXml(match[1]))
      if (!entries.length) fail(`${sitemapFile}: no sitemap URLs`)
      sitemapUrls.set(language, entries)
    }
  }
  for (const page of pages) {
    for (const language of ['', 'en']) {
      const route = normalizeRoute(`/${language ? language + '/' : ''}${page.slug.replace(/^\//, '')}`)
      const stem = path.posix.join('build', route.replace(/^\//, ''))
      const candidates = [`${stem}.html`, path.posix.join(stem, 'index.html')]
      let html = null
      let htmlFile = null
      for (const candidate of candidates) {
        const resolved = localPath(candidate, candidate)
        if (!resolved) continue
        try { await access(resolved); html = await readFile(resolved, 'utf8'); htmlFile = candidate; break } catch (error) {
          if (error.code !== 'ENOENT') fail(`${candidate}: ${error.message}`)
        }
      }
      if (html === null) { fail(`${route}: built HTML missing (${candidates.join(' or ')})`); continue }
      const links = linkMetadata(html)
      const canonicals = links.filter(link => link.rel === 'canonical')
      if (canonicals.length !== 1) fail(`${htmlFile}: expected exactly one canonical`)
      const canonical = canonicals[0]?.href
      if (canonical && urlPath(canonical, htmlFile) !== route) fail(`${htmlFile}: canonical route does not match ${route}`)
      if (canonical && !sitemapUrls.get(language)?.includes(canonical)) fail(`${htmlFile}: canonical absent from ${language || 'ZH'} sitemap`)
      for (const [code, expected] of [['zh-Hans', normalizeRoute(page.slug)], ['en', normalizeRoute('/en' + page.slug)]]) {
        const alternates = links.filter(link => link.rel === 'alternate' && link.hreflang === code)
        if (alternates.length !== 1 || urlPath(alternates[0]?.href, htmlFile) !== expected) fail(`${htmlFile}: missing or incorrect ${code} alternate for ${expected}`)
      }
    }
  }
}

async function main() {
  if (args.some(argument => !['--build', '--help'].includes(argument))) throw new Error('Usage: node scripts/check-api-docs.mjs [--build]')
  if (args.includes('--help')) { console.log('Usage: node scripts/check-api-docs.mjs [--build]\nChecks catalog-selected bilingual API pages offline. --build also checks local HTML, canonicals, language alternates and sitemaps.'); return }
  const raw = await read('api/endpoint-catalog.json')
  if (raw === null) throw new Error(failures.join('\n'))
  const catalog = JSON.parse(raw)
  if (!isRecord(catalog) || catalog.schemaVersion !== 1 || !Array.isArray(catalog.pages) || !Array.isArray(catalog.endpoints)) throw new Error('Catalog must have schemaVersion: 1, pages: [], endpoints: []')
  const pages = new Map()
  const files = new Set()
  const slugs = new Set()
  let jsonBlocks = 0
  for (const page of catalog.pages) {
    if (!isRecord(page) || !isText(page.id) || !isText(page.file) || !isText(page.slug)) { fail('pages[]: id, file and slug are required'); continue }
    if (pages.has(page.id)) fail(`Duplicate page id ${page.id}`)
    if (files.has(page.file)) fail(`Duplicate page file ${page.file}`)
    if (slugs.has(page.slug)) fail(`Duplicate page slug ${page.slug}`)
    files.add(page.file)
    slugs.add(page.slug)
    if (!/^docs\/07-api\/[^\n]+\.(md|mdx)$/.test(page.file)) fail(`${page.id}: page file must be under docs/07-api/`)
    if (!/^\/api(?:\/[a-z0-9-]+)*$/.test(page.slug)) fail(`${page.id}: expected stable /api slug`)
    const english = 'i18n/en/docusaurus-plugin-content-docs/current/' + page.file.replace(/^docs\//, '')
    const zhContent = await read(page.file)
    const enContent = await read(english)
    const zh = zhContent === null ? null : scanMarkdown(zhContent, page.file)
    const en = enContent === null ? null : scanMarkdown(enContent, english)
    for (const [file, parsed] of [[page.file, zh], [english, en]]) {
      if (parsed && parsed.slug !== page.slug) fail(`${file}: slug ${parsed.slug} differs from catalog ${page.slug}`)
      jsonBlocks += parsed?.jsonBlocks ?? 0
    }
    if (zh && en && JSON.stringify(zh.versions) !== JSON.stringify(en.versions)) fail(`${page.id}: bilingual version callout versions or heading scopes differ`)
    pages.set(page.id, { ...page, zh, en })
  }
  const operationIds = new Set()
  const routes = new Set()
  for (const endpoint of catalog.endpoints) {
    if (!isRecord(endpoint)) { fail('endpoints[]: expected an object'); continue }
    const label = endpoint.operationId ?? '(missing operationId)'
    for (const field of ['operationId', 'service', 'method', 'path', 'doc']) if (!isText(endpoint[field])) fail(`${label}: missing ${field}`)
    if (operationIds.has(endpoint.operationId)) fail(`Duplicate operationId ${label}`)
    operationIds.add(endpoint.operationId)
    if (!/^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)$/.test(endpoint.method)) fail(`${label}: invalid HTTP method`)
    if (!isText(endpoint.path) || !endpoint.path.startsWith('/') || /[?#\s]/.test(endpoint.path)) fail(`${label}: invalid endpoint path`)
    // Each service has its own listener; equal paths across services are distinct.
    const route = `${endpoint.service} ${endpoint.method} ${String(endpoint.path).replace(/:[A-Za-z_][\w]*|\{[^}]+\}/g, ':param')}`
    if (routes.has(route)) fail(`Duplicate service/method/path ${route}`)
    routes.add(route)
    const page = pages.get(endpoint.doc) ?? [...pages.values()].find(candidate => candidate.file === endpoint.doc)
    if (!page) fail(`${label}: doc must refer to a catalog page id or file`)
    for (const field of ['deploymentModes', 'authentication', 'permissions', 'resultDelivery', 'schemaRefs', 'effectiveVersion', 'versionEvidence', 'verification', 'spec']) if (!Object.hasOwn(endpoint, field)) fail(`${label}: missing maintenance field ${field}`)
    if (!Array.isArray(endpoint.deploymentModes) || !endpoint.deploymentModes.length || endpoint.deploymentModes.some(mode => !isText(mode))) fail(`${label}: deploymentModes must be a nonempty string array`)
    if (!isRecord(endpoint.source) || !isText(endpoint.source.repository) || !/^[a-f0-9]{40}$/i.test(endpoint.source.revision) || !Array.isArray(endpoint.source.files) || !endpoint.source.files.length) fail(`${label}: source needs repository, fixed 40-character revision and files`)
    if (endpoint.effectiveVersion) {
      if (!/^v\d+\.\d+\.\d+\+$/.test(endpoint.effectiveVersion)) fail(`${label}: invalid effectiveVersion`)
      if (!endpoint.versionEvidence) fail(`${label}: effectiveVersion needs versionEvidence`)
      for (const [language, parsed] of [['ZH', page?.zh], ['EN', page?.en]]) if (parsed && !parsed.versions.some(callout => callout.version === endpoint.effectiveVersion)) fail(`${label}: ${language} page lacks effectiveVersion ${endpoint.effectiveVersion}`)
    }
    // spec may be null/empty until selected endpoints have an actual public spec.
    // Runtime/schema validation records are reviewed separately; no source grep here.
  }
  if (args.includes('--build')) await checkBuild([...pages.values()])
  if (failures.length) {
    console.error(`API documentation checks failed (${failures.length}):`)
    for (const failure of failures) console.error(`- ${failure}`)
    process.exitCode = 1
  } else {
    console.log(`API documentation checks passed: ${pages.size} bilingual pages, ${catalog.endpoints.length} endpoints, ${jsonBlocks} JSON blocks${args.includes('--build') ? ', local built routes and metadata' : ''}.`)
    console.log('Version scope checks compare section placement; translated feature meaning and source/runtime claims still require review.')
  }
}

main().catch(error => { console.error(error.message); process.exitCode = 1 })
