/** Copy to packages/agent-service/src/__tests__/api-docs-observe.resource.test.ts.
 * Real instance-token auth, routes, input reader, monitor, SessionStore, Mention store and Receipt index.
 * Only the local owner profile and runtime discovery are substitutes; all files are synthetic temporary data.
 * No Provider, tool executor or outbound network probe is called.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Fastify, { type FastifyInstance } from 'fastify'
import { appendFileSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { createHash } from 'node:crypto'

vi.mock('../agent/agentfs', async importOriginal => ({
  ...await importOriginal<typeof import('../agent/agentfs')>(),
  readUserProfile: () => ({ id: 'docs-observe-owner' }),
  ensureUserProfile: () => ({ id: 'docs-observe-owner' }),
}))
vi.mock('../runtime', () => ({ getAllActiveSessions: () => [], getRuntime: () => ({ registerPersistentSessionReference: vi.fn() }) }))

import { instanceAuthOnRequest, INSTANCE_TOKEN_HEADER } from '../auth/instance-auth'
import { registerAgentInputConfigRoute } from '../routes/agent-input-config-route'
import { readAgentInputConfig } from '../agent/input-config'
import { registerNetworkRoutes } from '../routes/network-routes'
import { getNetworkHealthMonitor, resetNetworkHealthMonitor } from '../connection/network-health'
import { DEFAULT_NETWORK_HEALTH_CONFIG } from '@desirecore/schemas/agent-service/network-health'
import { registerHistoryRoutes } from '../routes/history-routes'
import { registerRunsRoutes } from '../routes/runs-routes'
import { getConversationMentionSourceStore, resetConversationMentionSourceStoreForTests } from '../mentions/conversation/source'
import { queryCache, rebuildIndex } from '../session/runs-index'

const OWNER = 'docs-observe-owner'
const token = 'synthetic-docs-observe-token'
const headers = { [INSTANCE_TOKEN_HEADER]: token }
let root: string
let app: FastifyInstance

function agent(id = 'observe-agent', manual = false) {
  const dir = join(root, 'agents', id)
  mkdirSync(dir, { recursive: true })
  const text = JSON.stringify({ name: id, session_mode: { manual } })
  writeFileSync(join(dir, 'agent.json'), text)
  return { dir, text, file: join(dir, 'agent.json') }
}
function run(id: string, owner = OWNER, extra: Record<string, unknown> = {}, messages?: unknown[]) {
  const dir = join(root, 'runs', id)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'meta.json'), JSON.stringify({
    run_id: id, user_id: owner, agent_id: 'observe-agent', status: 'completed',
    started_at: '2026-10-24T00:00:00.000Z', ...extra,
  }))
  writeFileSync(join(dir, 'messages.jsonl'), (messages ?? [
    { id: `${id}-user`, role: 'user', content: `synthetic ${id}`, timestamp: 1 },
    { id: `${id}-assistant`, role: 'assistant', content: `answer ${id}`, timestamp: 2 },
  ]).map(value => JSON.stringify(value)).join('\n') + '\n')
  return dir
}
function receipt(dir: string, id: string, inputTokens: number, startedAt = '2026-10-25T00:05:00.000Z', usage = true) {
  mkdirSync(join(dir, 'receipts'), { recursive: true })
  appendFileSync(join(dir, 'receipts', 'receipts.jsonl'), JSON.stringify({
    receipt_id: `receipt-${id}`, run_id: id, goal: 'SYNTHETIC-PRIVATE-GOAL', input: 'SYNTHETIC-PRIVATE-INPUT', output: 'SYNTHETIC-PRIVATE-OUTPUT',
    started_at: startedAt, completed_at: '2026-10-25T00:06:00.000Z',
    outcome: { status: 'success', auto_completed: true, user_edit_count: 0 }, tool_calls: [],
    ...(usage ? { usage: { input_tokens: inputTokens, output_tokens: 2, cost_usd: 0.01, provider: 'synthetic', model: 'fixture', usage_scope: 'delta' } } : {}),
  }) + '\n')
}
async function get(path: string) {
  const response = await app.inject({ method: 'GET', url: path, headers })
  expect(response.statusCode, `${path}: ${response.body}`).toBe(200)
  return response.json()
}
const historyPath = '/api/sessions/messages/all?agentId=observe-agent&order=asc'

describe('source-backed public observation contracts', () => {
  beforeEach(async () => {
    root = mkdtempSync(join(tmpdir(), 'api-docs-observe-'))
    vi.stubEnv('DESIRECORE_TEST_ROOT', root)
    vi.stubEnv('AGENT_SERVICE_TOKEN', token)
    vi.stubEnv('AGENT_SERVICE_MODE', 'standalone')
    resetNetworkHealthMonitor()
    resetConversationMentionSourceStoreForTests()
    queryCache.invalidateAll()
    agent()
    app = Fastify()
    app.addHook('onRequest', instanceAuthOnRequest)
    registerAgentInputConfigRoute(app)
    await registerNetworkRoutes(app)
    await registerHistoryRoutes(app)
    await registerRunsRoutes(app)
  })
  afterEach(async () => {
    await app.close()
    resetNetworkHealthMonitor()
    resetConversationMentionSourceStoreForTests()
    queryCache.invalidateAll()
    rmSync(root, { recursive: true, force: true })
    vi.unstubAllEnvs()
  })

  it('uses real instance-token auth on all five reads', async () => {
    for (const url of ['/api/agents/observe-agent/input-config', '/api/network/health', historyPath, '/api/runs/recent-calls', '/api/runs/usage/summary']) {
      for (const credential of [undefined, 'synthetic-wrong-token']) {
        expect((await app.inject({ method: 'GET', url, headers: credential ? { [INSTANCE_TOKEN_HEADER]: credential } : {} })).statusCode).toBe(401)
      }
    }
  })
  it('reads real fresh input config with no-store and a byte-content revision; target 404 and invalid 503 stay distinct', async () => {
    const f = agent('observe-agent', true)
    const first = await app.inject({ method: 'GET', url: '/api/agents/observe-agent/input-config', headers })
    expect(first.statusCode).toBe(200)
    expect(first.headers['cache-control']).toBe('no-store')
    expect(first.json()).toEqual({ version: 1, agentId: 'observe-agent', manual: true, configRevision: createHash('sha256').update(f.text).digest('hex') })
    expect(readFileSync(f.file, 'utf8')).toBe(f.text)
    writeFileSync(f.file, '{}')
    const second = await get('/api/agents/observe-agent/input-config')
    expect(second.manual).toBe(false)
    expect(second.configRevision).not.toBe(first.json().configRevision)
    const missing = await app.inject({ url: '/api/agents/missing-agent/input-config', headers })
    expect(missing.statusCode).toBe(404)
    expect(missing.json().code).toBe('AGENT_NOT_FOUND')
    const invalidId = await app.inject({ url: '/api/agents/bad.id/input-config', headers })
    expect(invalidId.statusCode).toBe(400)
    writeFileSync(f.file, '{bad-json')
    const invalid = await app.inject({ url: '/api/agents/observe-agent/input-config', headers })
    expect(invalid.statusCode).toBe(503)
    expect(invalid.json().code).toBe('AGENT_INPUT_CONFIG_INVALID')
  })
  it('real input reader detects atomic replacement during its FD read instead of returning a mixed revision', async () => {
    const f = agent('observe-agent', true)
    await expect(readAgentInputConfig('observe-agent', { afterContentRead: () => {
      writeFileSync(join(f.dir, 'replacement.json'), '{"session_mode":{"manual":false}}')
      renameSync(join(f.dir, 'replacement.json'), f.file)
    } })).rejects.toMatchObject({ code: 'AGENT_INPUT_CONFIG_CHANGED' })
    expect((await get('/api/agents/observe-agent/input-config')).manual).toBe(false)
  })
  it('network route returns the real current monitor state; disabled remains unknown and new samples update seq', async () => {
    const monitor = getNetworkHealthMonitor()
    const initial = await get('/api/network/health')
    expect(initial).toMatchObject({ status: 'unknown', reason: 'init', seq: 0 })
    monitor.reportSuccess({ source: 'pi-adapter', host: 'synthetic.invalid' })
    expect(await get('/api/network/health')).toEqual(initial)
    monitor.setConfig({ ...DEFAULT_NETWORK_HEALTH_CONFIG, enabled: true })
    const events: unknown[] = []
    const unsubscribe = monitor.onChange(state => events.push(state))
    monitor.reportSuccess({ source: 'pi-adapter', host: 'synthetic.invalid' })
    const online = await get('/api/network/health')
    expect(online).toMatchObject({ status: 'online', reason: 'request_ok' })
    expect(online.seq).toBeGreaterThan(initial.seq)
    expect(events.at(-1)).toEqual(online)
    monitor.reportFailure({ source: 'pi-adapter', host: 'one.invalid', subcategory: 'dns' })
    // Cancel timers immediately; only supplied passive evidence is under test, never an outbound probe.
    monitor.dispose()
    expect(await get('/api/network/health')).toMatchObject({ status: 'degraded', subcategory: 'dns' })
    monitor.reportFailure({ source: 'pi-adapter', host: 'two.invalid', subcategory: 'dns' })
    monitor.dispose()
    const offline = await get('/api/network/health')
    expect(offline).toMatchObject({ status: 'offline', scope: 'global', reason: 'multi_host_dns' })
    monitor.setConfig({ ...DEFAULT_NETWORK_HEALTH_CONFIG, enabled: false })
    const disabled = await get('/api/network/health')
    expect(disabled.status).toBe('unknown')
    expect(disabled.seq).toBeGreaterThan(offline.seq)
    unsubscribe()
    resetNetworkHealthMonitor()
    expect((await get('/api/network/health')).seq).toBe(0)
  })
  it('merged history filters owner before pagination, accepts limit zero, and rejects stale public revisions', async () => {
    const dir = run('owned-history')
    run('other-history', 'synthetic-other')
    const first = await get(historyPath + '&limit=1')
    expect(first.total).toBe(2)
    expect(first.items).toHaveLength(1)
    expect(first.items[0].runId).toBe('owned-history')
    expect(first.historyRevision).toMatch(/^h1:[0-9a-f]{64}$/)
    const zero = await get(historyPath + '&limit=0')
    expect(zero).toMatchObject({ items: [], total: 2, hasMore: false, historyRevision: first.historyRevision })
    expect((await get(historyPath + '&limit=1000')).items).toHaveLength(2)
    const next = await get(historyPath + '&offset=1&limit=1&expectedRevision=' + first.historyRevision)
    expect(next.items[0].message.id).toBe('owned-history-assistant')
    writeFileSync(join(dir, 'messages.jsonl'), JSON.stringify({ id: 'edited', role: 'assistant', content: 'synthetic edited content', timestamp: 1 }) + '\n')
    const stale = await app.inject({ url: historyPath + '&expectedRevision=' + first.historyRevision, headers })
    expect(stale.statusCode).toBe(409)
    expect(stale.json().error).toBe('history_revision_changed')
    expect((await get(historyPath)).historyRevision).not.toBe(first.historyRevision)
    for (const query of ['&limit=-1', '&limit=1001', '&offset=-1', '&expectedRevision=bad']) {
      expect((await app.inject({ url: historyPath + query, headers })).statusCode).toBe(400)
    }
  })
  it('manual mode excludes other manual conversations until explicitly selected or disabled', async () => {
    agent('observe-agent', true)
    run('default-history')
    run('manual-history', OWNER, { conversation_id: '__manual:synthetic-topic' })
    const current = await get(historyPath)
    expect(new Set(current.items.map((item: { runId: string }) => item.runId))).toEqual(new Set(['default-history']))
    const explicit = await get(historyPath + '&conversationId=__manual%3Asynthetic-topic')
    expect(new Set(explicit.items.map((item: { runId: string }) => item.runId))).toEqual(new Set(['manual-history']))
    agent('observe-agent', false)
    const combined = await get(historyPath)
    expect(new Set(combined.items.map((item: { runId: string }) => item.runId))).toEqual(new Set(['default-history', 'manual-history']))
  })
  it('preferred Run selects an older fork view instead of mixing siblings', async () => {
    // Forks are written by SessionStore as camelCase snapshots; never mix identity spellings.
    for (const [id, day] of [['fork-source', '22'], ['fork-old', '23'], ['fork-new', '24']]) {
      const dir = run(id)
      writeFileSync(join(dir, 'meta.json'), JSON.stringify({
        runId: id, userId: OWNER, agentId: 'observe-agent', status: 'completed',
        engine: 'desirecore-engine', options: {}, messageCount: 2,
        createdAt: `2026-10-${day}T00:00:00.000Z`, updatedAt: `2026-10-${day}T00:00:00.000Z`,
        ...(id !== 'fork-source' && { forkedFrom: 'fork-source' }),
      }))
    }
    const canonical = await get(historyPath)
    expect(new Set(canonical.items.map((item: { runId: string }) => item.runId))).toEqual(new Set(['fork-new']))
    const selected = await get(historyPath + '&preferredRunId=fork-old')
    expect(new Set(selected.items.map((item: { runId: string }) => item.runId))).toEqual(new Set(['fork-old']))
    expect(selected.historyRevision).not.toBe(canonical.historyRevision)
  })
  it('merged history applies normal public privacy and preserves sensitive failure facts', async () => {
    run('privacy-history', OWNER, {}, [{ role: 'assistant', content: '', timestamp: 1,
      providerReplay: { version: 1, turns: [{ blocks: [{ type: 'thinking', thinking: 'SYNTHETIC-PRIVATE-REPLAY' }] }] },
      toolUse: [{ id: 'sensitive', name: 'BrowserScript', summary: 'SYNTHETIC-PRIVATE-RESULT', status: 'failed', isError: true, summaryRef: { filename: 'synthetic-private.txt', size: 1 }, summaryIncomplete: true }],
    }])
    const page = await get(historyPath)
    const tool = page.items[0].message.toolUse[0]
    expect(tool).toMatchObject({ status: 'failed', isError: true })
    expect(tool.summary).toContain('failed')
    expect(tool).not.toHaveProperty('summaryRef')
    expect(tool).not.toHaveProperty('summaryIncomplete')
    expect(JSON.stringify(page)).not.toMatch(/SYNTHETIC-PRIVATE|synthetic-private\.txt|providerReplay/)
  })
  it('includes persisted external-only Mention source with a synthetic non-Run identifier and owner isolation', async () => {
    const store = getConversationMentionSourceStore()
    for (const userId of [OWNER, 'synthetic-other']) await store.persist({
      userId, currentAgentId: 'observe-agent', conversationId: 'conversation-source', messageId: `mention-${userId}`,
      content: '@Builder synthetic review', actor: { type: 'human', id: userId },
      occurrences: [{ occurrence_id: `occurrence-${userId}`, target: { agent_id: 'builder-agent', display_name_snapshot: 'Builder' }, range: { start: 0, end: 8 } }],
      recipientRequests: [{ occurrence_ids: [`occurrence-${userId}`], recipient_agent_id: 'builder-agent', route: 'external_agent', context_selection: { context_mode: 'isolated', origin: 'mention', intent_id: `intent-${userId}`, context_reason: 'Synthetic external review' } }],
      idempotencyKey: `key-${userId}`, correlationId: `correlation-${userId}`, now: '2026-10-25T00:00:00.000Z',
    })
    const page = await get(historyPath)
    expect(page.total).toBe(1)
    expect(page.items[0]).toMatchObject({ runId: `__mention_source:mention-${OWNER}`, messageIndex: 0, message: { mentionSourceOnly: true } })
    expect(JSON.stringify(page)).not.toContain('synthetic-other')
  })
  it('usage reads real owner receipts and index, ignores invalid filters, and maps UTC day buckets without returning bodies', async () => {
    receipt(run('old-owner'), 'old-owner', 10)
    receipt(run('new-owner', OWNER, { started_at: '2026-10-25T00:00:00.000Z', cleared: true }), 'new-owner', 20)
    receipt(run('other-owner', 'synthetic-other'), 'other-owner', 1000)
    receipt(run('no-usage'), 'no-usage', 1000, undefined, false)
    await rebuildIndex()
    const utc = await get('/api/runs/usage/summary?timezone=UTC')
    expect(utc.total).toMatchObject({ inputTokens: 30, outputTokens: 4, queryCount: 2 })
    expect(utc.byDate[0].date).toBe('2026-10-25')
    expect(JSON.stringify(utc)).not.toMatch(/SYNTHETIC-PRIVATE|other-owner/)
    expect(await get('/api/runs/usage/summary?timezone=invalid%2Ftimezone')).toEqual(utc)
    expect(await get('/api/runs/usage/summary?since=invalid')).toEqual(utc)
    const filtered = await get('/api/runs/usage/summary?since=2026-10-25T00%3A00%3A00Z&timezone=UTC')
    expect(filtered.total.inputTokens).toBe(20)
    // Both receipts occur on Oct 25, but since filters their parent Run start, not receipt time.
    expect(filtered.total.queryCount).toBe(1)
    const farEast = await get('/api/runs/usage/summary?timezone=Pacific%2FKiritimati')
    expect(farEast.byDate[0].date).toBe('2026-10-26')
    expect(farEast.total).toEqual(utc.total)
    receipt(run('cache-added'), 'cache-added', 100)
    expect((await get('/api/runs/usage/summary?since=invalid')).total).toEqual(utc.total)
    queryCache.invalidateAll()
    expect((await get('/api/runs/usage/summary?since=invalid')).total.inputTokens).toBe(130)
  })
})
