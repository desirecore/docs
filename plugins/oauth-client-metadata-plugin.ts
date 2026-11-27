/**
 * Docusaurus 插件：OAuth 客户端元数据文档只在一个精确地址上提供
 *
 * static/oauth/clients/*.json 是 MCP OAuth 的客户端元数据文档（CIMD）：文档的 URL 本身就是公开的 client_id，
 * 授权服务器按这个精确地址读取（desirecore/desirecore#5724、ADR-341）。
 *
 * Docusaurus 在构建每个非默认语言时会把 static/ 原样复制进该语言的输出目录，于是 /en/oauth/clients/... 也返回同一份文档。
 * 这些副本不是身份，只会制造别名，所以在非默认语言的输出里删除 oauth/ 目录，让它们返回 404。
 * 末尾带斜杠的地址与缓存头由 vercel.json 处理（Vercel 默认对带斜杠的地址也返回文件）。
 */

import type { LoadContext, Plugin } from '@docusaurus/types'
import * as fs from 'fs'
import * as path from 'path'

/** static/ 下 OAuth 客户端元数据文档所在的顶层目录 */
const OAUTH_STATIC_DIR = 'oauth'

export default function oauthClientMetadataPlugin(context: LoadContext): Plugin {
  return {
    name: 'oauth-client-metadata-plugin',

    async postBuild({ outDir }) {
      const { currentLocale, defaultLocale } = context.i18n
      if (currentLocale === defaultLocale) return
      const root = path.resolve(outDir)
      const target = path.resolve(root, OAUTH_STATIC_DIR)
      if (path.dirname(target) !== root) {
        throw new Error(`[oauth-client-metadata-plugin] 目标不在输出目录内：${target}`)
      }
      if (!fs.existsSync(target)) return
      fs.rmSync(target, { recursive: true })
      console.log(`[oauth-client-metadata-plugin] 已从 ${currentLocale} 输出移除 /${OAUTH_STATIC_DIR}/ 副本`)
    },
  }
}
