/** Copy to packages/agent-service/src/__tests__/api-docs-management.resource.test.ts.
 * Actual Fastify routes + instance/governed auth hooks + request validation.
 * Synthetic profile, Team service and Workflow owner port; no real team writes or provider calls.
 */
import Fastify, { type FastifyInstance } from 'fastify'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
const ports = vi.hoisted(() => ({ list: vi.fn(), restore: vi.fn(), bind: vi.fn() }))
vi.mock('../agent/agentfs', async original => ({ ...(await original<typeof import('../agent/agentfs')>()), readUserProfile: () => ({ id: 'docs-owner' }), ensureUserProfile: () => ({ id: 'docs-owner' }) }))
vi.mock('../team/team-service', () => ({ getTeamService: () => ({ listArchivedTeams: ports.list, restoreArchivedTeam: ports.restore }) }))
vi.mock('../workflow/governed-binding-owner', async original => ({ ...(await original<typeof import('../workflow/governed-binding-owner')>()), createGovernedWorkflowBinding: ports.bind }))
import { instanceAuthOnRequest, INSTANCE_TOKEN_HEADER, ensureEmbeddedInstanceToken } from '../auth/instance-auth'
import { governedEndpointOnRequest } from '../auth/governed-endpoint-auth'
import { registerTeamArchiveRoutes } from '../routes/team-archive-routes'
import { registerWorkflowDefinitionRoutes } from '../routes/workflow-definition-routes'
const token = 'synthetic-management-owner-token'
const headers = { [INSTANCE_TOKEN_HEADER]: token }
const binding = { resourceRef: { resourceType: 'board', boardId: 'board-a' }, workflowRef: { schemaVersion: 1, resourceType: 'workflow-definition', workflowId: 'wf-a', pin: { mode: 'exact', definitionRevision: 3, contentHash: 'b'.repeat(64) } }, role: 'reference', expectedVersion: 0, idempotencyKey: 'docs-binding-001' }
const bindingUrl = '/api/workflow-definitions/wf-a/taskboard-bindings'
let app: FastifyInstance
beforeEach(async () => {
  vi.clearAllMocks(); vi.stubEnv('AGENT_SERVICE_TOKEN', token); vi.stubEnv('AGENT_SERVICE_MODE', 'standalone')
  ports.list.mockResolvedValue([])
  ports.restore.mockResolvedValue({ teamId: 'team-a', warnings: ['review approval'] })
  ports.bind.mockResolvedValue({ status: 201, result: { binding: { bindingId: 'binding-a' }, changed: true, revision: 1 } })
  app = Fastify(); app.addHook('onRequest', instanceAuthOnRequest); app.addHook('onRequest', governedEndpointOnRequest)
  await registerTeamArchiveRoutes(app); await registerWorkflowDefinitionRoutes(app)
})
afterEach(async () => { await app.close(); vi.unstubAllEnvs() })
describe('public management route auth and request contracts', () => {
  it('missing/wrong standalone token stops all three routes before domain access', async () => {
    for (const request of [{ method: 'GET' as const, url: '/api/team-archive' }, { method: 'POST' as const, url: '/api/team-archive/team-a.20261029010101/restore', payload: {} }, { method: 'POST' as const, url: bindingUrl, payload: binding }]) {
      for (const supplied of [undefined, 'wrong']) expect((await app.inject({ ...request, headers: supplied ? { [INSTANCE_TOKEN_HEADER]: supplied } : {} })).statusCode).toBe(401)
    }
    expect(ports.list).not.toHaveBeenCalled(); expect(ports.restore).not.toHaveBeenCalled(); expect(ports.bind).not.toHaveBeenCalled()
  })
  it('standalone owner token admits archive reads/restores without renderer markers', async () => {
    expect((await app.inject({ method: 'GET', url: '/api/team-archive', headers })).json()).toEqual({ success: true, data: { archives: [] } })
    const response = await app.inject({ method: 'POST', url: '/api/team-archive/team-a.20261029010101/restore', headers, payload: { newName: 'restored' } })
    expect(response.statusCode).toBe(200); expect(response.json().data.warnings).toEqual(['review approval'])
    expect(ports.restore).toHaveBeenCalledWith('team-a.20261029010101', { newName: 'restored' })
  })
  it('binding injects the authenticated owner, preserves status and rejects self-claimed owners', async () => {
    const created = await app.inject({ method: 'POST', url: bindingUrl, headers, payload: binding })
    expect(created.statusCode).toBe(201); expect(ports.bind).toHaveBeenCalledWith('docs-owner', binding)
    ports.bind.mockClear()
    for (const payload of [{ ...binding, ownerUserId: 'forged' }, { ...binding, workflowRef: { ...binding.workflowRef, workflowId: 'other' } }]) {
      const invalid = await app.inject({ method: 'POST', url: bindingUrl, headers, payload })
      expect(invalid.statusCode).toBe(400); expect(invalid.json().code).toBe('INVALID_REQUEST')
    }
    expect(ports.bind).not.toHaveBeenCalled()
  })
  it('request limits and restore additional properties fail before domain writes', async () => {
    expect((await app.inject({ method: 'POST', url: bindingUrl, headers, payload: { ...binding, extra: 'x'.repeat(16384) } })).statusCode).toBe(413)
    expect((await app.inject({ method: 'POST', url: '/api/team-archive/team-a.20261029010101/restore', headers, payload: { force: true } })).statusCode).toBe(400)
    expect(ports.bind).not.toHaveBeenCalled(); expect(ports.restore).not.toHaveBeenCalled()
  })
  it('embedded local trust alone cannot read or restore team archives', async () => {
    vi.stubEnv('AGENT_SERVICE_TOKEN', ''); vi.stubEnv('AGENT_SERVICE_MODE', 'embedded')
    const localToken = ensureEmbeddedInstanceToken()
    for (const request of [{ method: 'GET' as const, url: '/api/team-archive' }, { method: 'POST' as const, url: '/api/team-archive/team-a.20261029010101/restore', payload: {} }]) {
      const denied = await app.inject({ ...request, headers: { [INSTANCE_TOKEN_HEADER]: localToken } })
      expect(denied.statusCode).toBe(403); expect(denied.json()).toEqual({ error: 'renderer_origin_required' })
    }
    expect(ports.list).not.toHaveBeenCalled(); expect(ports.restore).not.toHaveBeenCalled()
  })
  it('binding does not inherit the archive renderer gate; embedded owner still comes from auth', async () => {
    vi.stubEnv('AGENT_SERVICE_TOKEN', ''); vi.stubEnv('AGENT_SERVICE_MODE', 'embedded')
    const result = await app.inject({ method: 'POST', url: bindingUrl, payload: binding })
    expect(result.statusCode).toBe(201); expect(ports.bind).toHaveBeenCalledWith('docs-owner', binding)
  })
})
