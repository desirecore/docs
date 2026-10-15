/** Copy into desirecore/packages/agent-service/src/__tests__/ as api-docs-node-client.integration.test.ts.
 * Real Fastify, attachment upload/storage/download, query routes, auth, digest,
 * durable registry, lookup, delivery room and HTTP/Socket.IO.
 * The query pipeline, follow-up runtime callback and Run snapshots are fake; no LLM/tools run.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import fastify from 'fastify'
import multipart from '@fastify/multipart'
import { Server } from 'socket.io'

const h = vi.hoisted(() => ({ io: null as any, pipeline: vi.fn(), seen: new Set<string>() }))
vi.mock('../socket-server', () => ({ getSocketServer: () => h.io }))
vi.mock('../handlers/query-handlers', async () => ({
  ...await import('../query/client-request-registry'), executeQueryPipeline: h.pipeline,
}))
vi.mock('../session/store', () => ({ getSessionStore: () => ({
  findExistingMessageIds: async ({ messageIds }: { messageIds: string[] }) => messageIds.filter(id => h.seen.has(id)),
}) }))
vi.mock('../service-metadata', () => ({
  parseHandshakeExtensions: () => new Set(),
  buildClientHandshakeResponse: (instanceId: string) => ({
    service: 'desirecore-agent-service', apiProtocolVersion: '1', serverVersion: '10.0.180', instanceId,
    deploymentMode: 'external', clientCompatibility: { minimumVersion: '0.0.0', maximumVersion: null },
    capabilities: { workflow: false, mediaSignedUrl: true, pdfRendering: false },
    authentication: { kind: 'instance-token', scopes: ['owner'] }, serverTime: new Date().toISOString(),
  }),
}))

import { registerQueryRoutes } from '../routes/query-routes'
import { registerClientRequestLookupRoutes } from '../routes/client-request-lookup-routes'
import { registerClientHandshakeRoutes } from '../routes/client-handshake-routes'
import { registerAttachmentRoutes } from '../routes/attachment-routes'
import { instanceAuthOnRequest, verifySocketHandshakeAuth, resolveIdentity, clearEmbeddedInstanceToken, __resetHostedEmbeddedAuthForTest } from '../auth/instance-auth'
import { bindRendererDeliverySocket, resetRendererDeliveryRegistry } from '../handlers/renderer-delivery'
import { SocketEventSink } from '../handlers/query-event-sink'
import { claimClientRequest, commitClientRequestAttempt, markClientRequestSession, resetClientRequestRegistryForTests } from '../query/client-request-registry'
import { resolveClientRequestScope } from '../query/client-request-scope'
import { computeQueryRequestDigest } from '@desirecore/shared/query/request-digest'
import { resetConversationClearGateForTests } from '../session/conversation-clear-gate'
import { ensureInstanceIdentity } from '../instance-identity'

describe('public Node client with real admission routes and fake query runtime', () => {
  let temporary: string, app: ReturnType<typeof fastify>, env: Record<string, string | undefined>
  const keys = ['DESIRECORE_TEST_ROOT', 'AGENT_SERVICE_TOKEN', 'AGENT_SERVICE_MODE']
  beforeEach(async () => {
    env = Object.fromEntries(keys.map(key => [key, process.env[key]]))
    temporary = mkdtempSync(join(tmpdir(), 'api-docs-client-source-'))
    process.env.DESIRECORE_TEST_ROOT = temporary
    process.env.AGENT_SERVICE_TOKEN = 'owner-test-token'
    process.env.AGENT_SERVICE_MODE = 'external'
    __resetHostedEmbeddedAuthForTest(); clearEmbeddedInstanceToken()
    resetClientRequestRegistryForTests(); resetConversationClearGateForTests(); resetRendererDeliveryRegistry(); h.seen.clear()
    ensureInstanceIdentity()
    app = fastify({ logger: false })
    app.addHook('onRequest', instanceAuthOnRequest)
    await app.register(multipart)
    await registerClientHandshakeRoutes(app)
    await registerAttachmentRoutes(app)
    await registerQueryRoutes(app)
    await registerClientRequestLookupRoutes(app)
    // Only a fake read snapshot for the client's continuation precheck. The real
    // Run route is covered separately; its successful wire shape has three fields.
    app.get('/api/runs/:id/runtime-state', async (request, reply) => {
      const { id } = request.params as { id: string }
      if (id !== 'run-fixture') return reply.code(404).send({ error: `Run runtime state not found: ${id}` })
      return { run_id: 'run-fixture', agent_id: 'agent-fixture', status: 'idle' }
    })
    h.io = new Server(app.server, { path: '/socket.io/' })
    h.io.use((socket: any, next: (error?: Error) => void) => {
      const decision = verifySocketHandshakeAuth(socket.handshake.auth.token)
      if (!decision.ok) return next(new Error('unauthorized'))
      socket.data.authKind = decision.authKind
      socket.data.userId = resolveIdentity().userId
      next()
    })
    h.io.on('connection', (socket: any) => {
      bindRendererDeliverySocket(socket)
      socket.on('query:followUp', (body: any, ack: (value: any) => void) => {
        const scope = resolveClientRequestScope({ authenticatedUserId: socket.data.userId, agentId: 'agent-fixture' })
        const claim = claimClientRequest(body.clientRequestId, scope, {
          userMessageId: body.message.id,
          requestDigest: computeQueryRequestDigest({ prompt: body.message.content, userMessageId: body.message.id }),
        })
        if (claim.status !== 'claimed') return ack({ ok: false, error: claim.status })
        expect(commitClientRequestAttempt(claim.attempt).status).toBe('committed')
        markClientRequestSession(body.clientRequestId, 'runtime-fixture', scope)
        h.seen.add(body.message.id)
        const sink = new SocketEventSink(socket)
        sink.setEventRouting({ clientRequestId: body.clientRequestId, conversationId: 'agent-fixture' })
        ack({ ok: true, sessionId: 'runtime-fixture', clientRequestId: body.clientRequestId })
        socket.emit('query:followUpAccepted', { sessionId: 'runtime-fixture', clientRequestId: body.clientRequestId })
        sink.emitMessage({ sessionId: 'runtime-fixture', message: { type: 'text', text: 'fake follow-up' } })
        sink.emitComplete({ sessionId: 'runtime-fixture', terminal: { status: 'completed', runId: 'run-fixture' } })
      })
    })
    h.pipeline.mockReset()
    h.pipeline.mockImplementation(async (body: any, sink: any, _context: any, attempt: any) => {
      expect(commitClientRequestAttempt(attempt).status).toBe('committed')
      h.seen.add(body.userMessageId)
      sink.setEventRouting({ clientRequestId: body.clientRequestId, conversationId: 'agent-fixture' })
      sink.emitStarted({ sessionId: 'runtime-fixture', runId: 'run-fixture', agentId: 'agent-fixture' })
      sink.emitMessage({ sessionId: 'runtime-fixture', message: { type: 'text', text: 'fake start' } })
      sink.emitComplete({ sessionId: 'runtime-fixture', terminal: { status: 'completed', runId: 'run-fixture' } })
      return { sessionId: 'runtime-fixture' }
    })
    await app.listen({ host: '127.0.0.1', port: 0 })
  })
  afterEach(async () => {
    await new Promise<void>(resolve => h.io.close(() => resolve()))
    await app.close()
    h.io = null; resetRendererDeliveryRegistry(); resetClientRequestRegistryForTests(); clearEmbeddedInstanceToken()
    for (const key of keys) if (env[key] === undefined) delete process.env[key]; else process.env[key] = env[key]
    rmSync(temporary, { recursive: true, force: true })
  })
  it.each([false, true])('runs real start/follow-up and digest admission, with attachment receipts=%s and no model', async (withAttachments) => {
    const modulePath = process.env.DESIRECORE_API_EXAMPLE_PATH
    if (!modulePath) throw new Error('Set DESIRECORE_API_EXAMPLE_PATH to the public example client.mjs')
    const { runClient } = await import(/* @vite-ignore */ pathToFileURL(modulePath).href)
    const address = app.server.address() as { port: number }
    const stateFile = join(temporary, 'request.json'), chunks: string[] = []
    const fileReferences = withAttachments ? ['fixture-attachment/first.txt', 'fixture-attachment/second.txt'] : []
    const attachmentReceipts = withAttachments ? [0, 1, 0].map((index, sequence) => {
      const file = join(temporary, `receipt-${sequence}.json`)
      // Schema-valid receipts are local fixtures, not successful upload evidence.
      writeFileSync(file, JSON.stringify({
        attachmentId: `00000000-0000-4000-8000-00000000000${index + 1}`,
        name: `report-${index + 1}.txt`, mimeType: 'text/plain', size: 7,
        sha256: 'a'.repeat(64), fileReference: fileReferences[index],
      }))
      return file
    }) : []
    const code = await runClient({ state: stateFile, prompt: 'hello', followUps: ['again'], attachmentReceipts,
      timeoutMs: 3000, httpTimeoutMs: 1000, pollMs: 20 }, {
      DESIRECORE_URL: `http://127.0.0.1:${address.port}`, DESIRECORE_TOKEN: 'owner-test-token', DESIRECORE_AGENT_ID: 'agent-fixture',
    }, { log() {}, text: (value: string) => chunks.push(value) })
    expect(code).toBe(0)
    expect(chunks.join('')).toBe('fake start\nfake follow-up\n')
    const state = JSON.parse(readFileSync(stateFile, 'utf8'))
    expect(state.turns).toHaveLength(2)
    expect(state.turns.map((turn: any) => turn.outcome.status)).toEqual(['completed', 'completed'])
    expect(state.turns[0].body.requestDigest).toBe(computeQueryRequestDigest({
      prompt: 'hello', userMessageId: state.turns[0].userMessageId, fileReferences,
    }))
    expect(state.turns[0].body.options.fileReferences ?? []).toEqual(fileReferences)
    expect(state.turns[0].body.fileReferences).toBeUndefined()
    expect(state.turns[1].body.fileReferences).toBeUndefined()
    expect(h.pipeline.mock.calls[0][0].options.fileReferences ?? []).toEqual(fileReferences)
    expect(state.turns[0].admission.status).toBe('committed')
    expect(h.pipeline).toHaveBeenCalledTimes(1)
    const denied = await app.inject({ method: 'POST', url: '/api/query/start', body: state.turns[0].body })
    expect(denied.statusCode).toBe(401)
  }, 15000)

  it('uses the public uploader receipt in real query admission and downloads identical bytes', async () => {
    const modulePath = process.env.DESIRECORE_API_EXAMPLE_PATH
    if (!modulePath) throw new Error('Set DESIRECORE_API_EXAMPLE_PATH to the public example client.mjs')
    const { runClient } = await import(/* @vite-ignore */ pathToFileURL(modulePath).href)
    const { uploadAttachment } = await import(/* @vite-ignore */ new URL('./attachments.mjs', pathToFileURL(modulePath)).href)
    const address = app.server.address() as { port: number }
    const origin = `http://127.0.0.1:${address.port}`
    const bytes = Buffer.from('temporary attachment for API docs\n')
    const file = join(temporary, 'report.txt'), receiptFile = join(temporary, 'receipt.json')
    writeFileSync(file, bytes)
    const receipt = await uploadAttachment({ baseUrl: origin, token: 'owner-test-token', file, mimeType: 'text/plain' })
    expect(receipt.size).toBe(bytes.length)
    expect(readFileSync(receipt.fileReference)).toEqual(bytes)
    writeFileSync(receiptFile, JSON.stringify(receipt), { mode: 0o600 })
    const stateFile = join(temporary, 'upload-query.json')
    const code = await runClient({ state: stateFile, prompt: 'summarize attached report', attachmentReceipts: [receiptFile],
      followUps: [], timeoutMs: 3000, httpTimeoutMs: 1000, pollMs: 20 }, {
      DESIRECORE_URL: origin, DESIRECORE_TOKEN: 'owner-test-token', DESIRECORE_AGENT_ID: 'agent-fixture',
    }, { log() {}, text() {} })
    expect(code).toBe(0)
    const state = JSON.parse(readFileSync(stateFile, 'utf8')), turn = state.turns[0]
    expect(turn.body.options.fileReferences).toEqual([receipt.fileReference])
    expect(turn.body.fileReferences).toBeUndefined()
    expect(turn.body.requestDigest).toBe(computeQueryRequestDigest({
      prompt: turn.body.prompt, userMessageId: turn.userMessageId, fileReferences: [receipt.fileReference],
    }))
    expect(h.pipeline.mock.calls[0][0].options.fileReferences).toEqual([receipt.fileReference])
    expect(turn.outcome.status).toBe('completed')
    const downloaded = await fetch(`${origin}/api/attachments/${receipt.attachmentId}`, {
      headers: { 'X-Agent-Service-Token': 'owner-test-token' }, redirect: 'error',
    })
    expect(downloaded.status).toBe(200)
    expect(downloaded.headers.get('content-type')).toBe('application/octet-stream')
    expect(Buffer.from(await downloaded.arrayBuffer())).toEqual(bytes)
  }, 15000)
})
