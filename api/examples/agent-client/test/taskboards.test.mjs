import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { once } from 'node:events';
import { runTaskboards, parseTaskboardsArgs } from '../taskboards.mjs';

const handshake = { service: 'desirecore-agent-service', apiProtocolVersion: '1', instanceId: 'inst_task_fixture' };
function json(res, value, status = 200) { res.writeHead(status, { 'content-type': 'application/json' }); res.end(JSON.stringify(value)); }
async function fixture(t, handler, metadata = handshake) {
  const requests = [];
  const server = http.createServer(async (req, res) => {
    let text = ''; for await (const part of req) text += part;
    const record = { path: req.url, method: req.method, token: req.headers['x-agent-service-token'], body: text ? JSON.parse(text) : undefined };
    requests.push(record);
    if (req.url === '/api/client-handshake') json(res, metadata); else handler(record, res);
  });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  t.after(() => { server.closeAllConnections(); server.close(); });
  return { requests, env: { DESIRECORE_URL: `http://127.0.0.1:${server.address().port}`, DESIRECORE_TOKEN: 'fixture-private-token' } };
}

test('five basic commands preserve exists:false and authenticate every request', async t => {
  const f = await fixture(t, (req, res) => json(res, req.path === '/api/taskboards' ? { schemaVersion: 3, boards: [] } : req.path.includes('/activity') ? { evidence: [] } : { schemaVersion: 3, exists: false }));
  const output = [];
  for (const input of [{ command: 'list' }, { command: 'board', boardId: 'board a' }, { command: 'task', boardId: 'board a', taskId: 'task:a' }, { command: 'handoff', boardId: 'board a', taskId: 'task:a' }, { command: 'resolve', runId: 'run-1', sessionId: 'session-1' }]) await runTaskboards(input, { env: f.env, emit: v => output.push(v) });
  assert.equal(output.length, 5); assert.equal(output[1].data.exists, false);
  assert.ok(f.requests.every(req => req.token === f.env.DESIRECORE_TOKEN));
  assert.deepEqual(f.requests.at(-1).body, { runId: 'run-1', sessionId: 'session-1' });
  assert.equal(f.requests[3].path, '/api/taskboards/board%20a');
  assert.equal(f.requests[7].path, '/api/taskboards/board%20a/activity?taskId=task%3Aa');
});

test('query passes opaque cursor unchanged with the same filters and sorting, and stops at hasMore=false', async t => {
  const cursor = 'opaque:+/==';
  const f = await fixture(t, (req, res) => json(res, { schemaVersion: 3, items: [{ task: { id: req.body.cursor ? 'b' : 'a' } }], hasMore: !req.body.cursor, ...(req.body.cursor ? {} : { nextCursor: cursor }) }));
  const output = [];
  const filter = { boardIds: ['board-1'], taskArchive: 'any' }, sort = { field: 'subject', direction: 'asc' };
  await runTaskboards({ command: 'query', filter: JSON.stringify(filter), sort: JSON.stringify(sort), pageSize: '1' }, { env: f.env, emit: v => output.push(v) });
  assert.deepEqual(f.requests.slice(1).map(req => req.body), [{ filter, sort, pageSize: 1 }, { filter, sort, pageSize: 1, cursor }]);
  assert.equal(output[0].data.pages.length, 2);
  assert.ok(f.requests.slice(1).every(req => req.method === 'POST'));
});

test('activity continues through empty pages and pins throughRevision; owner projections remain separate page envelopes', async t => {
  const f = await fixture(t, (req, res) => {
    const q = new URL(req.path, 'http://fixture').searchParams;
    const after = Number(q.get('afterRevision'));
    assert.equal(q.get('throughRevision'), after ? '20' : null);
    json(res, { schemaVersion: 1, items: after ? [{ source: 'ownerProjection', activityId: 'owner:a' }] : [], page: { pageSize: 1, afterRevision: after, throughRevision: 20, nextAfterRevision: after ? null : 7 } });
  });
  const output = [];
  await runTaskboards({ command: 'activity', boardId: 'board', taskId: 'task', pageSize: '1' }, { env: f.env, emit: v => output.push(v) });
  assert.equal(output[0].data.pages.length, 2); assert.equal(f.requests.length, 3);
});

test('query 409 discards already read pages and never retries or exposes server body', async t => {
  const f = await fixture(t, (req, res) => req.body.cursor ? json(res, { ok: false, error: { code: 'versionConflict', message: 'fixture-private-token' } }, 409) : json(res, { schemaVersion: 3, items: [], hasMore: true, nextCursor: 'a' }));
  const output = [];
  await assert.rejects(runTaskboards({ command: 'query' }, { env: f.env, emit: v => output.push(v) }), e => /HTTP 409 versionConflict.*restart/.test(e.message) && !e.message.includes(f.env.DESIRECORE_TOKEN));
  assert.equal(output.length, 0); assert.equal(f.requests.length, 3);
});

test('bounded paging and repeated or absent cursors fail without emitting partial results', async t => {
  for (const response of [{ schemaVersion: 3, items: [], hasMore: true }, { schemaVersion: 3, items: [], hasMore: true, nextCursor: 'same' }]) {
    const f = await fixture(t, (_req, res) => json(res, response));
    const output = [];
    await assert.rejects(runTaskboards({ command: 'query' }, { env: f.env, emit: v => output.push(v) }), /cursor/);
    assert.equal(output.length, 0);
  }
  const f = await fixture(t, (_req, res) => json(res, { schemaVersion: 3, items: [], hasMore: true, nextCursor: 'next' }));
  await assert.rejects(runTaskboards({ command: 'query', maxPages: '1' }, { env: f.env }), /maxPages/);
  assert.equal(f.requests.length, 2);
});

test('activity rejects changing prefixes and non-advancing revisions', async t => {
  for (const next of [0, 21, '7', undefined]) {
    const f = await fixture(t, (_req, res) => json(res, { schemaVersion: 1, items: [], page: { afterRevision: 0, throughRevision: 20, nextAfterRevision: next } }));
    await assert.rejects(runTaskboards({ command: 'activity', boardId: 'b', taskId: 't' }, { env: f.env }), /advance/);
  }
  const f = await fixture(t, (req, res) => { const after = Number(new URL(req.path, 'http://fixture').searchParams.get('afterRevision')); json(res, { schemaVersion: 1, items: [], page: { afterRevision: after, throughRevision: after ? 21 : 20, nextAfterRevision: after ? null : 7 } }); });
  await assert.rejects(runTaskboards({ command: 'activity', boardId: 'b', taskId: 't' }, { env: f.env }), /prefix changed/);
});

test('capabilityDisabled and forbidden are reported without retry', async t => {
  for (const code of ['capabilityDisabled', 'forbidden']) {
    const f = await fixture(t, (_req, res) => json(res, { ok: false, error: { code, message: 'private', retryable: false } }, 403));
    await assert.rejects(runTaskboards({ command: 'list' }, { env: f.env }), new RegExp(`HTTP 403 ${code}`));
    assert.equal(f.requests.length, 2);
  }
});

test('handshake mismatch, HTML and redirects stop reads without forwarding credentials elsewhere', async t => {
  const wrong = await fixture(t, () => assert.fail('read after wrong handshake'), { ...handshake, service: 'other' });
  await assert.rejects(runTaskboards({ command: 'list' }, { env: wrong.env }), /handshake/);
  assert.equal(wrong.requests.length, 1);
  const html = await fixture(t, (_req, res) => { res.writeHead(200, { 'content-type': 'text/html' }); res.end('<html>login</html>'); });
  await assert.rejects(runTaskboards({ command: 'list' }, { env: html.env }), /expected JSON/);
  const redirect = await fixture(t, (_req, res) => { res.writeHead(302, { location: 'https://another.example' }); res.end(); });
  await assert.rejects(runTaskboards({ command: 'list' }, { env: redirect.env }), /fetch failed/);
  assert.equal(redirect.requests.length, 2);
});

test('invalid options are rejected before network access', async t => {
  const f = await fixture(t, () => assert.fail('unexpected request'));
  for (const input of [{ command: 'list', pageSize: '1' }, { command: 'board', boardId: '..' }, { command: 'task', boardId: 'b' }, { command: 'resolve' }, { command: 'resolve', runId: '../x' }, { command: 'query', filter: '[]' }, { command: 'query', pageSize: '201' }, { command: 'activity', boardId: 'b', taskId: 't', pageSize: '101' }, { command: 'query', maxPages: '1x' }]) await assert.rejects(runTaskboards(input, { env: f.env }));
  await assert.rejects(runTaskboards({ command: 'list' }, { env: { ...f.env, DESIRECORE_URL: 'http://remote.example' } }));
  assert.throws(() => parseTaskboardsArgs(['list', '--board-id', 'b', '--board-id', 'c']));
  assert.equal(f.requests.length, 0);
});
