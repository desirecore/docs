import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { once } from 'node:events';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runWorkers, parseWorkerArgs } from '../workers.mjs';
import { runAdmin, parseAdminArgs } from '../admin.mjs';
import { runHistory } from '../history.mjs';
import { runObserve } from '../observe.mjs';
const identity = { service: 'desirecore-agent-service', apiProtocolVersion: '1', instanceId: 'inst_new_api' };
const json = (res, value, status = 200) => { res.writeHead(status, { 'content-type': 'application/json' }); res.end(JSON.stringify(value)); };
async function fixture(t, handler, handshake = identity) {
  const requests = [];
  const server = http.createServer(async (req, res) => {
    let body = ''; for await (const chunk of req) body += chunk;
    const record = { url: new URL(req.url, 'http://fixture'), method: req.method, headers: req.headers, body }; requests.push(record);
    if (req.url === '/api/client-handshake') return json(res, handshake);
    handler(record, res);
  });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  t.after(() => { server.closeAllConnections(); server.close(); });
  return { requests, env: { DESIRECORE_URL: `http://127.0.0.1:${server.address().port}`, DESIRECORE_TOKEN: 'private-fixture-token', DESIRECORE_AGENT_ID: 'ignored-agent' } };
}
const workerInput = { command: 'transcript', runId: 'run-a', workerId: 'worker-a', limit: 1, allPages: true };
function page(offset, overrides = {}) { return { run_id: 'run-a', workerId: 'worker-a', status: 'unknown', entries: [{ seq: 99 + offset * 20, at: 1793260800000, kind: 'tool_patch', toolId: 'call-a', summary: 'Tool result withheld', toolPhase: 'failed', isError: true }], total: 2, offset, limit: 1, truncated: true, corruptLines: 1, ...overrides }; }
test('Worker paging uses valid entry offsets and preserves raw patch, seq, unknown status and recorder truncation', async t => {
  const f = await fixture(t, (req, res) => { assert.equal(req.method, 'GET'); assert.equal(req.url.pathname, '/api/runs/run-a/workers/worker-a/transcript'); json(res, page(Number(req.url.searchParams.get('offset')))); });
  const out = []; const result = await runWorkers(workerInput, { env: f.env, emit: v => out.push(v) });
  assert.equal(result.exitCode, 0); assert.equal(result.pages, 2); assert.deepEqual(f.requests.slice(1).map(x => x.url.searchParams.get('offset')), ['0', '1']);
  assert.equal(out[1].data.entries[0].seq, 119); assert.equal(out[1].data.truncated, true); assert.equal(out[1].data.status, 'unknown'); assert.ok(f.requests.every(x => x.headers['x-agent-service-token'] === f.env.DESIRECORE_TOKEN));
});
test('Worker list accepts empty index; page cap and total drift explicitly report partial results', async t => {
  const empty = await fixture(t, (_req, res) => json(res, { run_id: 'run-a', workers: [] })); const listed = [];
  await runWorkers({ command: 'list', runId: 'run-a' }, { env: empty.env, emit: v => listed.push(v) }); assert.deepEqual(listed[0].data.workers, []);
  const f = await fixture(t, (req, res) => json(res, page(Number(req.url.searchParams.get('offset')), { total: 3 }))); const cap = [];
  assert.equal((await runWorkers({ ...workerInput, maxPages: 1 }, { env: f.env, emit: v => cap.push(v) })).exitCode, 2); assert.equal(cap.at(-1).reason, 'max-pages');
  const drift = await fixture(t, (req, res) => { const offset = Number(req.url.searchParams.get('offset')); json(res, page(offset, { total: offset ? 3 : 2 })); }); const out = [];
  assert.equal((await runWorkers(workerInput, { env: drift.env, emit: v => out.push(v) })).exitCode, 2); assert.equal(out.length, 2); assert.equal(out[1].reason, 'worker-total-changed');
});
test('Worker malformed pages, wrong service, 401/404 and redirects stop without retry', async t => {
  for (const status of [401, 404]) { const f = await fixture(t, (_req, res) => json(res, { error: 'private-fixture-token' }, status)); await assert.rejects(runWorkers(workerInput, { env: f.env }), e => e.message.includes(String(status)) && !e.message.includes(f.env.DESIRECORE_TOKEN)); assert.equal(f.requests.length, 2); }
  const invalid = await fixture(t, (_req, res) => json(res, page(99))); await assert.rejects(runWorkers(workerInput, { env: invalid.env }), /Invalid Worker transcript/);
  const redirect = await fixture(t, (_req, res) => { res.writeHead(302, { location: '/elsewhere' }); res.end(); }); await assert.rejects(runWorkers(workerInput, { env: redirect.env }), /no retry/); assert.equal(redirect.requests.length, 2);
  const other = await fixture(t, () => assert.fail('read after wrong identity'), { ...identity, service: 'wrong' }); await assert.rejects(runWorkers(workerInput, { env: other.env }), /identity/); assert.equal(other.requests.length, 1);
});
const binding = { resourceRef: { resourceType: 'board', boardId: 'board-a' }, workflowRef: { schemaVersion: 1, resourceType: 'workflow-definition', workflowId: 'wf-a', pin: { mode: 'exact', definitionRevision: 3, contentHash: 'b'.repeat(64) } }, role: 'reference', expectedVersion: 0, idempotencyKey: 'binding-fixture-001' };
async function requestFile(t, value = binding) { const dir = await mkdtemp(join(tmpdir(), 'desirecore-api-docs-')); t.after(() => rm(dir, { recursive: true, force: true })); const path = join(dir, 'binding.json'); await writeFile(path, JSON.stringify(value)); return path; }
test('Explicit owner commands send GET archives, POST restore preserving warnings, and unchanged exact binding body/key', async t => {
  const request = await requestFile(t);
  const f = await fixture(t, (req, res) => {
    if (req.url.pathname === '/api/team-archive') { assert.equal(req.method, 'GET'); return json(res, { success: true, data: { archives: [] } }); }
    if (req.url.pathname.endsWith('/restore')) { assert.equal(req.method, 'POST'); assert.deepEqual(JSON.parse(req.body), { newName: 'new team' }); return json(res, { success: true, data: { teamId: 'new-team', warnings: ['review rules'], approval: 'pending' } }); }
    assert.equal(req.url.pathname, '/api/workflow-definitions/wf-a/taskboard-bindings'); assert.equal(req.method, 'POST'); assert.deepEqual(JSON.parse(req.body), binding); json(res, { binding: { bindingId: 'binding-a' }, changed: true, revision: 1 }, 201);
  }); const out = [];
  for (const input of [{ command: 'archives' }, { command: 'restore-team', archiveId: 'team-a.20261029010101', newName: 'new team' }, { command: 'bind-workflow', workflowId: 'wf-a', requestFile: request }]) await runAdmin(input, { env: f.env, emit: v => out.push(v) });
  assert.equal(out.length, 3); assert.deepEqual(out[1].data.data.warnings, ['review rules']); assert.equal(f.requests.length, 6); assert.ok(f.requests.every(x => x.headers['x-agent-service-token'] === f.env.DESIRECORE_TOKEN));
});
test('Owner conflicts, unavailable service and write timeout never resend or print server secrets', async t => {
  const request = await requestFile(t);
  for (const status of [409, 503]) { const f = await fixture(t, (_req, res) => json(res, { code: 'CONFLICT', error: 'private-fixture-token' }, status)); await assert.rejects(runAdmin({ command: 'bind-workflow', workflowId: 'wf-a', requestFile: request }, { env: f.env }), e => e.message.includes(String(status)) && !e.message.includes(f.env.DESIRECORE_TOKEN)); assert.equal(f.requests.length, 2); }
  const hanging = await fixture(t, () => {}); await assert.rejects(runAdmin({ command: 'restore-team', archiveId: 'a', timeoutMs: 100 }, { env: hanging.env }), /outcome may be unknown/); assert.equal(hanging.requests.length, 2);
});
test('Owner identity mismatch and redirects prevent further writes', async t => {
  const f = await fixture(t, () => assert.fail('write after wrong service'), { ...identity, apiProtocolVersion: '99' }); await assert.rejects(runAdmin({ command: 'restore-team', archiveId: 'a' }, { env: f.env }), /no operation was sent/); assert.equal(f.requests.length, 1);
  const redirect = await fixture(t, (_req, res) => { res.writeHead(302, { location: '/elsewhere' }); res.end(); }); await assert.rejects(runAdmin({ command: 'restore-team', archiveId: 'a' }, { env: redirect.env }), /No automatic retry/); assert.equal(redirect.requests.length, 2);
});
test('Unsafe IDs, mismatched options, malformed binding refs and owner claims fail before connection', async t => {
  const f = await fixture(t, () => assert.fail('unexpected operation'));
  for (const input of [{ command: 'list', runId: '../x' }, { command: 'list', runId: 'a', workerId: 'b' }, { ...workerInput, workerId: 'index' }, { ...workerInput, offset: '-1' }, { ...workerInput, limit: 2001 }]) await assert.rejects(runWorkers(input, { env: f.env }));
  for (const data of [{ ...binding, ownerUserId: 'forged' }, { ...binding, workflowRef: { workflowId: 'wf-a' } }, { ...binding, workflowRef: { ...binding.workflowRef, workflowId: 'other' } }]) { const request = await requestFile(t, data); await assert.rejects(runAdmin({ command: 'bind-workflow', workflowId: 'wf-a', requestFile: request }, { env: f.env })); }
  await assert.rejects(runAdmin({ command: 'archives', archiveId: 'a' }, { env: f.env })); assert.throws(() => parseAdminArgs(['restore-team', '--force'])); assert.throws(() => parseWorkerArgs(['list', '--run-id', 'a', '--run-id', 'b'])); assert.equal(f.requests.length, 0);
});
test('Archived topics page over owner scope and ignore default Agent environment', async t => {
  const f = await fixture(t, (req, res) => { assert.equal(req.url.pathname, '/api/manual-topics/archived'); assert.equal(req.url.searchParams.has('agentId'), false); assert.equal(req.url.searchParams.get('limit'), '1'); json(res, { items: [], total: 2, hasMore: req.url.searchParams.get('offset') === '0' }); });
  assert.equal((await runHistory({ command: 'archived-topics', limit: 1, allPages: true }, f.env, { emit: () => {} })).exitCode, 0); assert.deepEqual(f.requests.slice(1).map(x => x.url.searchParams.get('offset')), ['0', '1']); const count = f.requests.length;
  for (const options of [{ agentId: 'a' }, { limit: 201 }]) await assert.rejects(runHistory({ command: 'archived-topics', ...options }, f.env)); assert.equal(f.requests.length, count);
});
test('Recovery reference null differs from restore failure and malformed responses; no execution request', async t => {
  for (const runtimeSession of [null, { sessionId: 'session-a', revision: 1, scopeEpoch: 0, scopeSequence: 0 }]) { const f = await fixture(t, (req, res) => { assert.equal(req.url.pathname, '/api/sessions/run-a/runtime-state'); assert.equal(req.method, 'GET'); json(res, { runId: 'run-a', runtimeSession }); }); const out = []; await runHistory({ command: 'runtime-reference', id: 'run-a' }, f.env, { emit: v => out.push(v) }); assert.deepEqual(out[0].data.runtimeSession, runtimeSession); assert.equal(f.requests.length, 2); }
  const failed = await fixture(t, (_req, res) => json(res, { code: 'SESSION_RESTORE_FAILED', error: 'private-fixture-token' }, 500)); await assert.rejects(runHistory({ command: 'runtime-reference', id: 'run-a' }, failed.env), e => /500.*SESSION_RESTORE_FAILED/.test(e.message) && !e.message.includes(failed.env.DESIRECORE_TOKEN)); assert.equal(failed.requests.length, 2);
  const missing = await fixture(t, (_req, res) => json(res, { runId: 'run-a' })); await assert.rejects(runHistory({ command: 'runtime-reference', id: 'run-a' }, missing.env), /do not assume/);
});
test('Compute retry sends one bodyless/queryless POST after handshake, rejects parameters and never retries 503', async t => {
  const f = await fixture(t, (req, res) => { assert.equal(req.method, 'POST'); assert.equal(req.url.pathname, '/api/compute/preparation/retry'); assert.equal(req.url.search, ''); assert.equal(req.body, ''); assert.equal(req.headers['content-type'], undefined); json(res, { status: 'ready' }); }); const out = [];
  await runObserve({ command: 'compute-retry' }, { env: f.env, emit: v => out.push(v) }); assert.equal(out[0].data.status, 'ready'); assert.equal(f.requests.length, 2); const count = f.requests.length; await assert.rejects(runObserve({ command: 'compute-retry', agentId: 'a' }, { env: f.env })); assert.equal(f.requests.length, count);
  const failed = await fixture(t, (_req, res) => json(res, { error: 'SERVICE_PREPARATION_FAILED' }, 503)); await assert.rejects(runObserve({ command: 'compute-retry' }, { env: failed.env }), /503/); assert.equal(failed.requests.length, 2);
  const unknown = await fixture(t, (_req, res) => json(res, { status: 'pending' })); await assert.rejects(runObserve({ command: 'compute-retry' }, { env: unknown.env }), /not confirmed ready/);
});
