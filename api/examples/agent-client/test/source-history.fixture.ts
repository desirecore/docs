/** 复制到固定源码的 packages/agent-service/src/__tests__/api-docs-history.test.ts 后运行。
 * 真实 HTTP 鉴权、历史路由、SessionStore 和临时文件；运行时发现与本机用户配置为替身。
 * 不启动模型，不读取个人数据。
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Fastify, { type FastifyInstance } from 'fastify'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const { rootRef } = vi.hoisted(() => ({ rootRef: { current: '' } }))
vi.mock('../agent/agentfs', async importOriginal => ({
  ...await importOriginal<typeof import('../agent/agentfs')>(),
  getRootDir: () => rootRef.current,
  readUserProfile: () => ({ id: 'docs-owner' }),
  ensureUserProfile: () => ({ id: 'docs-owner' }),
}))
vi.mock('../runtime', () => ({ getAllActiveSessions: () => [], getRuntime: () => ({ registerPersistentSessionReference: vi.fn() }) }))

import { instanceAuthOnRequest, INSTANCE_TOKEN_HEADER } from '../auth/instance-auth'
import { registerHistoryRoutes } from '../routes/history-routes'
import { registerConversationRoutes } from '../routes/conversation-routes'
import { registerRunsRoutes } from '../routes/runs-routes'

const token = 'docs-history-fixture-token'
const headers = { [INSTANCE_TOKEN_HEADER]: token }
let app: FastifyInstance

function createRun(runId: string, userId = 'docs-owner', extra: Record<string, unknown> = {}) {
  const directory = join(rootRef.current, 'runs', runId)
  mkdirSync(directory, { recursive: true })
  writeFileSync(join(directory, 'meta.json'), JSON.stringify({
    runId, userId, agentId: 'docs-agent', engine: 'desirecore-engine', options: {},
    status: 'completed', messageCount: 2, createdAt: '2026-10-15T00:00:00.000Z', updatedAt: '2026-10-15T00:01:00.000Z', ...extra,
  }))
  writeFileSync(join(directory, 'messages.jsonl'), [
    { id: 'docs-user-message', role: 'user', content: 'needle attachment history', timestamp: 1 },
    { id: 'docs-assistant-message', role: 'assistant', content: 'needle answer', timestamp: 2,
      providerReplay: { version: 1, turns: [{ blocks: [{ type: 'thinking', thinking: 'PRIVATE-REPLAY', signature: 'PRIVATE-SIGNATURE' }] }] } },
  ].map(value => JSON.stringify(value)).join('\n') + '\n')
}

describe('公开历史 API 的实际路由合同', () => {
  beforeEach(async () => {
    rootRef.current = mkdtempSync(join(tmpdir(), 'dc-api-docs-history-'))
    vi.stubEnv('DESIRECORE_TEST_ROOT', rootRef.current)
    vi.stubEnv('AGENT_SERVICE_TOKEN', token)
    vi.stubEnv('AGENT_SERVICE_MODE', 'standalone')
    app = Fastify()
    app.addHook('onRequest', instanceAuthOnRequest)
    await registerHistoryRoutes(app)
    await registerConversationRoutes(app)
    await registerRunsRoutes(app)
  })
  afterEach(async () => {
    await app.close()
    rmSync(rootRef.current, { recursive: true, force: true })
    vi.unstubAllEnvs()
  })

  it('六个公开读取入口均由实例鉴权保护', async () => {
    for (const url of ['/api/sessions', '/api/sessions/docs-run', '/api/sessions/docs-run/messages', '/api/sessions/messages/search?agentId=docs-agent', '/api/conversation/docs-agent/overview', '/api/conversation/docs-agent/matters/docs-matter/full']) {
      expect((await app.inject({ method: 'GET', url })).statusCode).toBe(401)
      expect((await app.inject({ method: 'GET', url, headers: { [INSTANCE_TOKEN_HEADER]: 'wrong-token' } })).statusCode).toBe(401)
    }
  })

  it('列表过滤用户，详情与分页读取真实记录并去除私有重放数据', async () => {
    createRun('docs-run')
    createRun('other-run', 'other-user')
    const list = await app.inject({ method: 'GET', url: '/api/sessions?agentId=docs-agent&limit=20&offset=0', headers })
    expect(list.statusCode).toBe(200)
    expect(list.json().total).toBe(1)
    expect(list.json().sessions[0].runId).toBe('docs-run')
    for (const suffix of ['', '/messages?offset=0&limit=2']) {
      const response = await app.inject({ method: 'GET', url: '/api/sessions/docs-run' + suffix, headers })
      expect(response.statusCode).toBe(200)
      expect(response.json().messages).toHaveLength(2)
      expect(response.body).toContain('needle answer')
      expect(response.body).not.toMatch(/providerReplay|PRIVATE-REPLAY|PRIVATE-SIGNATURE/)
      expect(response.headers['cache-control']).toBe('private, no-store')
    }
    expect((await app.inject({ method: 'GET', url: '/api/sessions/other-run/messages', headers })).statusCode).toBe(404)
    expect((await app.inject({ method: 'GET', url: '/api/sessions/missing-run', headers })).statusCode).toBe(404)
  })

  it('搜索使用真实历史，缺少Agent或非法分页返回400', async () => {
    createRun('search-run')
    const response = await app.inject({ method: 'GET', url: '/api/sessions/messages/search?agentId=docs-agent&q=needle&limit=1&offset=0&previewChars=20', headers })
    expect(response.statusCode).toBe(200)
    expect(response.json().items).toHaveLength(1)
    expect(response.json().total).toBe(2)
    expect(response.json().hasMore).toBe(true)
    for (const query of ['', '?agentId=docs-agent&limit=-1', '?agentId=docs-agent&previewChars=8001']) {
      expect((await app.inject({ method: 'GET', url: '/api/sessions/messages/search' + query, headers })).statusCode).toBe(400)
    }
  })

  it('Run 详情保留转交事实，runtime-state 的现行四值过滤对该状态返回404', async () => {
    const runId = 'handed-off-run'
    const directory = join(rootRef.current, 'runs', runId)
    mkdirSync(directory, { recursive: true })
    writeFileSync(join(directory, 'meta.json'), JSON.stringify({
      run_id: runId, user_id: 'docs-owner', agent_id: 'docs-agent',
      started_at: '2026-10-15T00:00:00.000Z', status: 'handed_off',
      handoffTo: 'target-run', handoff_attempted: true, handoff_accepted: true,
    }))
    const meta = await app.inject({ method: 'GET', url: '/api/runs/' + runId, headers })
    expect(meta.statusCode).toBe(200)
    expect(meta.json()).toMatchObject({ status: 'handed_off', handoffTo: 'target-run', handoff_attempted: true, handoff_accepted: true })
    const state = await app.inject({ method: 'GET', url: '/api/runs/' + runId + '/runtime-state', headers })
    expect(state.statusCode).toBe(404)
    expect(state.json()).toEqual({ error: 'Run runtime state not found: ' + runId })
  })

  it('无话题时总览仍返回结构，未知话题完整读取返回404', async () => {
    const overview = await app.inject({ method: 'GET', url: '/api/conversation/docs-agent/overview', headers })
    expect(overview.statusCode).toBe(200)
    expect(overview.json()).toHaveProperty('activeMatters')
    expect((await app.inject({ method: 'GET', url: '/api/conversation/docs-agent/matters/missing-matter/full', headers })).statusCode).toBe(404)
  })
})
