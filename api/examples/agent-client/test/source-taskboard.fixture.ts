/** Copy to packages/agent-service/src/taskboard/public-reads.resource.test.ts; run resource project. */
import { mkdtempSync, realpathSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import Fastify, { type FastifyRequest } from 'fastify'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CanonicalTaskBoardService } from './service'
import { TaskBoardStore } from './store'
import type { TaskBoardPrincipal } from './types'
import { registerTaskboardRoutes } from '../routes/taskboard-routes'

const runtime = vi.hoisted(() => ({ service: undefined as CanonicalTaskBoardService | undefined }))
vi.mock('./index', () => ({ getTaskBoardService: () => { if (!runtime.service) throw new Error('fixture service missing'); return runtime.service } }))
vi.mock('../team/team-service', () => ({ getTeamService: () => ({ async listTeams() { return [] } }) }))

const USER = 'public-board-owner'
const principal: TaskBoardPrincipal = { userId: USER, actor: { type: 'human', id: USER } }
let root: string
let server: ReturnType<typeof Fastify>
let service: CanonicalTaskBoardService

beforeEach(async () => {
  root = realpathSync.native(mkdtempSync(join(tmpdir(), 'public-taskboard-reads-')))
  vi.stubEnv('DESIRECORE_TEST_ROOT', root)
  let clock = Date.parse('2026-10-25T00:00:00Z')
  service = new CanonicalTaskBoardService(new TaskBoardStore(join(root, 'taskboards')), { now: () => new Date(clock += 1000).toISOString() })
  runtime.service = service
  server = Fastify()
  // Simulate only identity already authenticated by instance-auth. All domain reads are real.
  server.addHook('onRequest', async (request: FastifyRequest) => {
    const user = request.headers['x-fixture-trusted-user']
    if (typeof user === 'string') (request as typeof request & { identity: { userId: string } }).identity = { userId: user }
  })
  await registerTaskboardRoutes(server)
  await server.ready()
})
afterEach(async () => { await server.close(); runtime.service = undefined; vi.unstubAllEnvs(); rmSync(root, { recursive: true, force: true }) })

const headers = { 'x-fixture-trusted-user': USER }
async function seed() {
  const board = await service.createBoard(principal, { name: 'API reads', scope: { type: 'user', id: USER } })
  if (!board.ok || !board.board) throw new Error('seed board')
  const first = await service.createTask(principal, board.board.id, { expectedBoardRevision: board.boardRevision, subject: 'First', description: 'Synthetic content', status: 'pending' })
  if (!first.ok || !first.task) throw new Error('seed task')
  const second = await service.createTask(principal, board.board.id, { expectedBoardRevision: first.boardRevision, subject: 'Second', description: 'Synthetic content', status: 'pending' })
  if (!second.ok || !second.task) throw new Error('seed second')
  return { boardId: board.board.id, taskId: first.task.id, taskVersion: first.task.version, revision: second.boardRevision }
}

describe('Public TaskBoard seven read contracts: actual Fastify routes, service and store', () => {
  it('reads all seven routes, distinguishes handoff evidence, and does not create when resolve has no match', async () => {
    const f = await seed()
    const agent: TaskBoardPrincipal = { userId: USER, actor: { type: 'agent', id: 'synthetic-agent' }, sessionIds: ['session-fixture'] }
    const session = await service.createBoard(agent, { name: 'Conversation', scope: { type: 'session', id: 'session-fixture' } })
    expect(session.ok).toBe(true)
    const list = await server.inject({ url: '/api/taskboards', headers })
    expect(list.statusCode).toBe(200); expect(list.json().boards).toHaveLength(2)
    expect((await server.inject({ method: 'POST', url: '/api/taskboards/query', headers, payload: { filter: { boardIds: [f.boardId] }, pageSize: 1 } })).json()).toMatchObject({ schemaVersion: 3, totalCount: 2, hasMore: true })
    expect((await server.inject({ url: `/api/taskboards/${f.boardId}`, headers })).json()).toMatchObject({ schemaVersion: 3, exists: true, allDone: false })
    expect((await server.inject({ url: `/api/taskboards/${f.boardId}/tasks/${f.taskId}`, headers })).json()).toMatchObject({ schemaVersion: 3, exists: true, task: { id: f.taskId } })
    expect((await server.inject({ url: `/api/taskboards/${f.boardId}/activity`, headers })).json()).toEqual({ evidence: [] })
    expect((await server.inject({ url: `/api/taskboards/${f.boardId}/tasks/${f.taskId}/activity?pageSize=1`, headers })).json()).toMatchObject({ schemaVersion: 1, page: { pageSize: 1 } })
    const resolved = await server.inject({ method: 'POST', url: '/api/taskboards/session-board/resolve', headers, payload: { sessionId: 'session-fixture' } })
    expect(resolved.statusCode).toBe(200); expect(resolved.json()).toMatchObject({ exists: true, meta: { scope: { type: 'session', id: 'session-fixture' } } })
    expect((await server.inject({ method: 'POST', url: '/api/taskboards/session-board/resolve', headers, payload: { runId: 'absent-run' } })).json()).toEqual({ schemaVersion: 3, exists: false })
    expect((await service.listBoards(principal)).boards).toHaveLength(2)
  })

  it('requires trusted identity, applies current owner ACL, omits invisible query IDs, and projects claim tokens by actor', async () => {
    const f = await seed()
    expect((await server.inject('/api/taskboards')).statusCode).toBe(401)
    const other = { 'x-fixture-trusted-user': 'other-owner' }
    expect((await server.inject({ url: '/api/taskboards', headers: other })).json().boards).toEqual([])
    expect((await server.inject({ url: `/api/taskboards/${f.boardId}`, headers: other })).statusCode).toBe(403)
    expect((await server.inject({ url: '/api/taskboards/arbitrary-missing-board', headers })).statusCode).toBe(403)
    expect((await server.inject({ method: 'POST', url: '/api/taskboards/query', headers: other, payload: { filter: { boardIds: [f.boardId] } } })).json().items).toEqual([])
    expect((await server.inject({ url: `/api/taskboards/${f.boardId}/tasks/missing-task`, headers })).json()).toEqual({ schemaVersion: 3, exists: false })
    const claimed = await service.actOnTask(principal, f.boardId, f.taskId, { action: 'claim', expectedVersion: f.taskVersion })
    expect(claimed.ok).toBe(true)
    const direct = (await server.inject({ url: `/api/taskboards/${f.boardId}/tasks/${f.taskId}`, headers })).json()
    expect(direct.task.claim.token).toBeTruthy()
    expect(direct.availableActions.every((action: { expectedVersion: number }) => action.expectedVersion === direct.task.version)).toBe(true)
    const query = (await server.inject({ method: 'POST', url: '/api/taskboards/query', headers, payload: {} })).json()
    expect(query.items.find((row: { task: { id: string } }) => row.task.id === f.taskId).task.claim.token).toBeUndefined()
  })

  it('passes opaque query cursors unchanged, detects version changes, and rejects claimed actor fields', async () => {
    const f = await seed()
    const request = { filter: { boardIds: [f.boardId] }, sort: { field: 'subject', direction: 'asc' }, pageSize: 1 }
    const first = (await server.inject({ method: 'POST', url: '/api/taskboards/query', headers, payload: request })).json()
    const second = (await server.inject({ method: 'POST', url: '/api/taskboards/query', headers, payload: { ...request, cursor: first.nextCursor } })).json()
    expect(second.hasMore).toBe(false); expect(second.nextCursor).toBeUndefined()
    expect(second.items[0].task.id).not.toBe(first.items[0].task.id)
    const mismatched = await server.inject({ method: 'POST', url: '/api/taskboards/query', headers, payload: { ...request, filter: {}, cursor: first.nextCursor } })
    expect(mismatched.statusCode).toBe(400)
    const changed = await service.updateTask(principal, f.boardId, f.taskId, { expectedVersion: f.taskVersion, patch: { subject: 'Changed' } })
    expect(changed.ok).toBe(true)
    expect((await server.inject({ method: 'POST', url: '/api/taskboards/query', headers, payload: { ...request, cursor: first.nextCursor } })).statusCode).toBe(409)
    expect((await server.inject({ method: 'POST', url: '/api/taskboards/query', headers, payload: { actor: { type: 'human', id: 'other' } } })).statusCode).toBe(400)
    expect((await server.inject({ method: 'POST', url: '/api/taskboards/session-board/resolve', headers, payload: { runId: 'r', sessionIds: ['fake'] } })).statusCode).toBe(400)
  })

  it('pins task activity prefix across appends and validates range/current Board access on every page', async () => {
    const f = await seed()
    const comment = await service.addComment(principal, f.boardId, f.taskId, { expectedVersion: f.taskVersion, kind: 'comment', body: 'Synthetic comment' })
    expect(comment.ok).toBe(true)
    const path = `/api/taskboards/${f.boardId}/tasks/${f.taskId}/activity`
    const first = (await server.inject({ url: `${path}?pageSize=1`, headers })).json()
    expect(first.page.nextAfterRevision).not.toBeNull()
    const prefix = first.page.throughRevision
    const later = await service.addComment(principal, f.boardId, f.taskId, { expectedVersion: comment.ok ? comment.task!.version : 0, kind: 'comment', body: 'Later synthetic comment' })
    expect(later.ok).toBe(true)
    const nextUrl = `${path}?pageSize=1&afterRevision=${first.page.nextAfterRevision}&throughRevision=${prefix}`
    const next = (await server.inject({ url: nextUrl, headers })).json()
    expect(next.page.throughRevision).toBe(prefix)
    expect(next.items.every((item: { taskEvent?: { boardRevision: number } }) => !item.taskEvent || item.taskEvent.boardRevision <= prefix)).toBe(true)
    expect((await server.inject({ url: nextUrl, headers: { 'x-fixture-trusted-user': 'other-owner' } })).statusCode).toBe(403)
    for (const suffix of ['?pageSize=101', '?afterRevision=1', '?afterRevision=9&throughRevision=2', '?unknown=1']) expect((await server.inject({ url: path + suffix, headers })).statusCode).toBe(400)
  })
})
