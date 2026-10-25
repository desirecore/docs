/** Copy to packages/agent-service/src/__tests__/api-docs-s3.resource.test.ts.
 * Real Fastify handler, instance-token authentication, capability gate and error serialization.
 * The owner profile, capability fact assertion, connection resolver and S3 provider functions are synthetic substitutes.
 * No real S3 request, credential read, bucket operation or host bridge is performed.
 * Complements existing s3-routes.integration and object-storage-capability-gate tests with exact public field contracts.
 */
import Fastify, { type FastifyInstance } from 'fastify'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({ assert: vi.fn(), resolve: vi.fn(), summaries: vi.fn(), get: vi.fn(), list: vi.fn(), head: vi.fn(), url: vi.fn() }))
vi.mock('../agent/agentfs', async original => ({ ...(await original<typeof import('../agent/agentfs')>()), readUserProfile: () => ({ id: 's3-docs-owner' }), ensureUserProfile: () => ({ id: 's3-docs-owner' }) }))
vi.mock('../capabilities', async original => ({ ...(await original<typeof import('../capabilities')>()), assertUserCapability: state.assert }))
vi.mock('../object-storage/s3-client', async original => ({ ...(await original<typeof import('../object-storage/s3-client')>()), getObject: state.get, listObjects: state.list, headObject: state.head, generateDownloadUrl: state.url }))
vi.mock('../object-storage/s3-connection-resolver', () => ({ resolveS3Connection: state.resolve, listAvailableConnections: state.summaries }))

import { instanceAuthOnRequest, INSTANCE_TOKEN_HEADER } from '../auth/instance-auth'
import { UserCapabilityDisabledError } from '../capabilities'
import { registerS3Routes } from '../routes/s3-routes'
const TOKEN = 'synthetic-s3-docs-token'
const headers = { [INSTANCE_TOKEN_HEADER]: TOKEN }
const config = { endpoint: 'https://provider.invalid', bucket: 'fixture-bucket', region: 'fixture-region', accessKeyId: 'SYNTHETIC-AK', secretAccessKey: 'SYNTHETIC-SK' }
const summary = { id: 'storage-main', label: 'Fixture', bucket: 'fixture-bucket', region: 'fixture-region', status: 'connected', isDefault: true, hasPublicUrl: true, accessKeyId: 'SYNTHETIC-MUST-NOT-RETURN' }
let app: FastifyInstance

describe('public S3 read handler field contracts', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    vi.stubEnv('AGENT_SERVICE_MODE', 'standalone')
    vi.stubEnv('AGENT_SERVICE_TOKEN', TOKEN)
    state.assert.mockImplementation(() => undefined)
    state.resolve.mockReturnValue(config)
    state.summaries.mockReturnValue([summary])
    state.list.mockResolvedValue({ objects: [], commonPrefixes: [], keyCount: 0, isTruncated: false })
    state.head.mockResolvedValue({ exists: true, contentType: 'text/plain', contentLength: 3 })
    state.url.mockResolvedValue({ url: 'https://files.invalid/k', type: 'public', verified: true })
    state.get.mockResolvedValue({ body: Buffer.from('abc'), contentType: 'text/plain' })
    app = Fastify()
    app.addHook('onRequest', instanceAuthOnRequest)
    await registerS3Routes(app)
  })
  afterEach(async () => { await app.close(); vi.unstubAllEnvs() })

  it('real instance authentication rejects missing/wrong token on all three reads before domain access', async () => {
    for (const url of ['/api/s3/connections', '/api/s3/list', '/api/s3/download?key=k']) {
      for (const credential of [undefined, 'wrong']) {
        const result = await app.inject({ method: 'GET', url, headers: credential ? { [INSTANCE_TOKEN_HEADER]: credential } : {} })
        expect(result.statusCode).toBe(401)
      }
    }
    expect(state.assert).not.toHaveBeenCalled()
    expect(state.resolve).not.toHaveBeenCalled()
  })
  it('actual capability gate passes trusted identity and fails closed before all domain reads', async () => {
    state.assert.mockImplementation(() => { throw new UserCapabilityDisabledError('object-storage', 'disabled') })
    for (const url of ['/api/s3/connections', '/api/s3/list', '/api/s3/download?key=k']) {
      const result = await app.inject({ method: 'GET', url, headers })
      expect(result.statusCode).toBe(403)
      expect(result.json()).toEqual({ error: '用户能力已关闭。', code: 'capabilityDisabled', capability: 'object-storage', retryable: false })
    }
    expect(state.assert).toHaveBeenCalledWith('object-storage', 's3-docs-owner', { mode: 'linearized' })
    expect(state.resolve).not.toHaveBeenCalled()
    expect(state.summaries).not.toHaveBeenCalled()
    expect(state.list).not.toHaveBeenCalled()
  })
  it('connection response projects summary fields without credentials and preserves empty configurations', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/s3/connections', headers })
    expect(response.json()).toEqual({ success: true, connections: [{ id: 'storage-main', label: 'Fixture', bucket: 'fixture-bucket', region: 'fixture-region', status: 'connected', is_default: true, has_public_url: true }] })
    expect(response.body).not.toContain('SYNTHETIC')
    state.summaries.mockReturnValue([])
    expect((await app.inject({ method: 'GET', url: '/api/s3/connections', headers })).json()).toEqual({ success: true, connections: [] })
  })
  it('list preserves opaque tokens/scope, projects provider fields and omits missing optional fields', async () => {
    state.list.mockResolvedValue({ objects: [{ key: 'reports/a', size: 1, lastModified: '', etag: 'private-extra' }], commonPrefixes: [{ prefix: 'reports/sub/' }], keyCount: 2, isTruncated: true, nextContinuationToken: 'next+/=&' })
    const response = await app.inject({ method: 'GET', url: '/api/s3/list?connection_id=storage-main&prefix=reports%2F&delimiter=&max_keys=2&continuation_token=opaque%2B%2F%3D%26', headers })
    expect(state.resolve).toHaveBeenCalledWith('storage-main')
    expect(state.list).toHaveBeenCalledWith(config, { prefix: 'reports/', delimiter: undefined, maxKeys: 2, continuationToken: 'opaque+/=&' })
    expect(response.json()).toEqual({ success: true, objects: [{ key: 'reports/a', size: 1, last_modified: '' }], common_prefixes: [{ prefix: 'reports/sub/' }], key_count: 2, is_truncated: true, next_continuation_token: 'next+/=&', bucket: 'fixture-bucket', prefix: 'reports/' })
    state.list.mockResolvedValue({ objects: [], commonPrefixes: [], keyCount: 0, isTruncated: false })
    const final = (await app.inject({ method: 'GET', url: '/api/s3/list', headers })).json()
    expect(final).not.toHaveProperty('next_continuation_token')
    expect(final).not.toHaveProperty('prefix')
  })
  it('list numeric normalization uses defaults/clamps without claiming strict input validation', async () => {
    for (const [value, expected] of [['0', 100], ['bad', 100], ['-1', 1], ['1001', 1000], ['2.5', 2.5]]) {
      expect((await app.inject({ method: 'GET', url: '/api/s3/list?max_keys=' + value, headers })).statusCode).toBe(200)
      expect(state.list).toHaveBeenLastCalledWith(config, expect.objectContaining({ maxKeys: expected, delimiter: '/' }))
    }
  })
  it('download validates key and connection resolution before contacting the provider', async () => {
    const missing = await app.inject({ method: 'GET', url: '/api/s3/download', headers })
    expect(missing.statusCode).toBe(400); expect(missing.json().code).toBe('INVALID_REQUEST')
    expect(state.resolve).not.toHaveBeenCalled()
    state.resolve.mockReturnValue(null)
    for (const url of ['/api/s3/list?connection_id=missing', '/api/s3/download?key=k&connection_id=missing']) {
      const result = await app.inject({ method: 'GET', url, headers })
      expect(result.statusCode).toBe(400); expect(result.json().code).toBe('NO_CONNECTION')
    }
    expect(state.head).not.toHaveBeenCalled(); expect(state.list).not.toHaveBeenCalled()
  })
  it('public links omit expires_in and optional metadata; presigned links include effective expiry', async () => {
    state.head.mockResolvedValue({ exists: true })
    const publicResult = await app.inject({ method: 'GET', url: '/api/s3/download?key=k&mode=unexpected&expires_in=0', headers })
    expect(publicResult.json()).toEqual({ success: true, key: 'k', download_url: 'https://files.invalid/k', url_type: 'public' })
    expect(state.url).toHaveBeenLastCalledWith(config, 'k', { expiresIn: 3600 })
    state.url.mockResolvedValue({ url: 'https://provider.invalid/k?signature=synthetic', type: 'presigned', expiresIn: 60 })
    const signed = await app.inject({ method: 'GET', url: '/api/s3/download?key=k&expires_in=1', headers })
    expect(state.url).toHaveBeenLastCalledWith(config, 'k', { expiresIn: 60 })
    expect(signed.json()).toMatchObject({ success: true, url_type: 'presigned', expires_in: 60 })
  })
  it('binary mode returns exact arbitrary bytes and download headers without a JSON wrapper', async () => {
    const body = Buffer.from('{"success":false,"file":"content"}\0')
    state.get.mockResolvedValue({ body, contentType: 'application/json' })
    const response = await app.inject({ method: 'GET', url: '/api/s3/download?key=folder%2Fdata.json&mode=binary', headers })
    expect(response.statusCode).toBe(200); expect(response.rawPayload).toEqual(body)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.headers['content-length']).toBe(String(body.length))
    expect(response.headers['content-disposition']).toBe('attachment; filename="data.json"')
    expect(state.head).not.toHaveBeenCalled(); expect(state.url).not.toHaveBeenCalled()
  })
  it('missing metadata produces link 404 while provider errors including binary absence produce domain 500', async () => {
    state.head.mockResolvedValue({ exists: false })
    const missing = await app.inject({ method: 'GET', url: '/api/s3/download?key=k', headers })
    expect(missing.statusCode).toBe(404); expect(missing.json().code).toBe('NOT_FOUND')
    state.get.mockRejectedValue(new Error('Synthetic missing object'))
    const binary = await app.inject({ method: 'GET', url: '/api/s3/download?key=k&mode=binary', headers })
    expect(binary.statusCode).toBe(500); expect(binary.json()).toMatchObject({ success: false, code: 'DOWNLOAD_FAILED' })
    state.list.mockRejectedValue(new Error('Synthetic denied'))
    const listResult = await app.inject({ method: 'GET', url: '/api/s3/list', headers })
    expect(listResult.statusCode).toBe(500); expect(listResult.json()).toMatchObject({ success: false, code: 'LIST_FAILED' })
  })
})
