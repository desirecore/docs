// The HTTP/Socket.IO fixture models the public contract. It is not a DesireCore runtime.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Server } from 'socket.io';
import { runClient, queryDigest } from '../client.mjs';

async function instance(scenario = 'normal') {
  const requests = [], observations = [], cancellations = [], records = new Map(), timers = new Set();
  const later = (ms, callback) => { const timer = setTimeout(() => { timers.delete(timer); callback(); }, ms); timers.add(timer); };
  function json(response, status, body) { response.writeHead(status, { 'Content-Type': 'application/json' }); response.end(JSON.stringify(body)); }
  const server = createServer(async (request, response) => {
    if (request.headers['x-agent-service-token'] !== 'owner-test-token') return json(response, 401, { error: 'unauthorized' });
    const url = new URL(request.url, 'http://localhost');
    if (url.pathname === '/api/client-handshake') return json(response, 200, {
      service: 'desirecore-agent-service', apiProtocolVersion: '1', instanceId: 'instance-test',
      serverVersion: '10.0.180', serverTime: new Date().toISOString(),
    });
    if (url.pathname === '/api/runs') return json(response, 200, { runs: [...records.values()].map(record => record.run), count: records.size });
    if (url.pathname.endsWith('/runtime-state')) {
      observations.push('runtime-state');
      const record = [...records.values()].find(record => url.pathname.includes(record.run.run_id));
      if (record?.run.status === 'handed_off') return json(response, 404, { error: 'Run runtime state not found: run-test' });
      return json(response, record ? 200 : 404, record ? record.run : { error: 'Run not found' });
    }
    if (url.pathname.endsWith('/receipt')) {
      observations.push('receipt');
      return json(response, 200, { run_id: 'run-test', receipts: [{ status: 'success', response: 'stored answer' }], total: 1, offset: 0, limit: 10 });
    }
    let body;
    try { let bytes = ''; for await (const chunk of request) bytes += chunk; body = JSON.parse(bytes); }
    catch { return json(response, 400, { error: 'invalid JSON' }); }
    if (url.pathname === '/api/query/client-requests/lookup') {
      observations.push('lookup');
      return json(response, 200, {
        protocolVersion: 1, serverInstanceId: 'server-generation-1', observedAt: new Date().toISOString(),
        autoReplayRetentionMs: scenario === 'expired' ? 0 : 86400000, tombstoneRetentionMs: 604800000,
        results: body.requests.map(item => {
          const record = records.get(item.clientRequestId);
          return scenario === 'unknown' ? { clientRequestId: item.clientRequestId, status: 'unknown' }
            : record ? { clientRequestId: item.clientRequestId, status: 'committed', sessionId: record.run.session_id,
              committedServerInstance: 'current', executionWitness: 'user-message' }
              : { clientRequestId: item.clientRequestId, status: 'absent' };
        }),
      });
    }
    if (!['/api/query/start', '/api/query/follow-up'].includes(url.pathname)) return json(response, 404, { error: 'Not found' });
    requests.push({ path: url.pathname, body });
    const socket = sockets.sockets.sockets.get(body.originSocketId);
    assert.ok(socket?.connected, 'HTTP origin must be a connected Socket.IO ID');
    assert.equal(socket.handshake.auth.token, request.headers['x-agent-service-token']);
    const prompt = body.prompt ?? body.message.content;
    const messageId = body.userMessageId ?? body.message.id;
    assert.equal(body.requestDigest, queryDigest(prompt, messageId, body.options?.fileReferences ?? body.fileReferences ?? []));
    if (scenario === 'conflict') return json(response, 409, { ok: false, code: 'CLIENT_REQUEST_BODY_MISMATCH', retryable: false });
    if (['lost-before-admission', 'expired', 'unknown'].includes(scenario) && requests.length === 1) {
      request.socket.destroy();
      if (scenario === 'lost-before-admission') socket.conn.close();
      return;
    }
    const previous = records.get(body.clientRequestId);
    if (previous) return json(response, 202, { ok: true, duplicate: true, clientRequestId: body.clientRequestId, sessionId: previous.run.session_id });
    const run = { run_id: 'run-test', agent_id: 'agent-test', session_id: body.sessionId ?? 'session-test', status: 'running' };
    records.set(body.clientRequestId, { run });
    const room = `renderer:${socket.handshake.auth.clientInstanceId}`;
    const data = { sessionId: run.session_id, runId: run.run_id, agentId: run.agent_id, clientRequestId: body.clientRequestId };
    const emit = (name, payload) => sockets.to(room).emit(name, payload);
    later(5, () => emit(url.pathname.endsWith('/start') ? 'query:started' : 'query:followUpAccepted', data));
    // An unrelated request in the same session must not steal this turn's outcome.
    later(8, () => emit('query:complete', { ...data, clientRequestId: 'another-request', terminal: { status: 'completed', runId: run.run_id } }));
    later(10, () => emit('query:message', { ...data, message: { type: 'stream_event', event: {
      type: 'content_block_delta', delta: { type: 'text_delta', text: `answer:${prompt}` },
    } } }));
    if (scenario === 'missed-terminal') later(15, () => socket.conn.close());
    later(25, () => {
      run.status = scenario.startsWith('handed-off') ? 'handed_off' : 'idle';
      emit('query:message', { ...data, message: { type: 'result', status: 'completed_idle', text: 'not a terminal' } });
      emit('query:message', { ...data, message: { type: 'user:message_delivery', message: 'delivery is not completion' } });
      // The snapshot-only scenario deliberately misses the status event too.
      if (scenario !== 'handed-off-snapshot') emit('activity:run_status', { runId: run.run_id, status: run.status });
      if (!['false-terminal-only', 'handed-off-no-terminal'].includes(scenario)) emit('query:complete', {
        ...data, terminal: { status: scenario === 'interrupted' ? 'interrupted' : 'completed', runId: run.run_id },
      });
    });
    if (scenario === 'lost-after-admission') request.socket.destroy();
    else if (scenario === 'events-before-http') later(60, () => json(response, 202, { ok: true, clientRequestId: body.clientRequestId, ...(body.sessionId ? { sessionId: body.sessionId } : {}) }));
    else json(response, 202, { ok: true, clientRequestId: body.clientRequestId, ...(body.sessionId ? { sessionId: body.sessionId } : {}) });
  });
  const sockets = new Server(server, { path: '/socket.io/' });
  sockets.use((socket, next) => socket.handshake.auth.token === 'owner-test-token' ? next() : next(new Error('unauthorized')));
  sockets.on('connection', socket => {
    socket.join(`renderer:${socket.handshake.auth.clientInstanceId}`);
    socket.on('query:abort', data => {
      cancellations.push(data);
      socket.emit('query:complete', { sessionId: data.sessionId, clientRequestId: data.clientRequestId,
        terminal: { status: 'interrupted', reason: 'user_abort', runId: 'run-test' } });
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return { requests, observations, cancellations, origin: `http://127.0.0.1:${server.address().port}`,
    close: async () => { for (const timer of timers) clearTimeout(timer); await new Promise(resolve => sockets.close(resolve)); } };
}

async function execute(t, scenario, extra = {}) {
  const service = await instance(scenario);
  const directory = mkdtempSync(join(tmpdir(), 'desirecore-cli-test-'));
  t.after(async () => { await service.close(); rmSync(directory, { recursive: true, force: true }); });
  const filename = join(directory, 'request.json');
  const logs = [], chunks = [];
  const env = { DESIRECORE_URL: service.origin, DESIRECORE_TOKEN: 'owner-test-token', DESIRECORE_AGENT_ID: 'agent-test' };
  const { receiptContents, ...overrides } = extra;
  const attachmentReceipts = receiptContents?.map((receipt, index) => {
    const file = join(directory, `attachment-${index}.json`);
    writeFileSync(file, JSON.stringify(receipt));
    return file;
  });
  const options = { state: filename, prompt: 'hello', followUps: [], timeoutMs: 300, httpTimeoutMs: 200, pollMs: 20,
    ...(attachmentReceipts ? { attachmentReceipts } : {}), ...overrides };
  const code = await runClient(options, env, { log: data => logs.push(data), text: data => chunks.push(data) });
  return { service, filename, env, code, logs, chunks, state: JSON.parse(readFileSync(filename, 'utf8')) };
}

test('start and follow-up stream separately; identities persist and HTTP/Socket credentials match', async t => {
  const result = await execute(t, 'normal', { followUps: ['again'] });
  assert.equal(result.code, 0);
  assert.equal(result.service.requests.length, 2);
  assert.equal(result.service.requests[1].body.sessionId, 'session-test');
  assert.notEqual(result.service.requests[0].body.clientRequestId, result.service.requests[1].body.clientRequestId);
  assert.equal(result.chunks.join(''), 'answer:hello\nanswer:again\n');
  assert.equal(result.state.turns.length, 2);
  assert.equal(JSON.stringify(result.state).includes('owner-test-token'), false);
});

test('a terminal event before the HTTP response remains authoritative', async t => {
  const result = await execute(t, 'events-before-http');
  assert.equal(result.code, 0);
  assert.equal(result.state.turns[0].outcome.status, 'completed');
});

test('lost admission response with a committed lookup does not resubmit', async t => {
  const result = await execute(t, 'lost-after-admission');
  assert.equal(result.code, 0);
  assert.equal(result.service.requests.length, 1);
  assert.ok(result.logs.some(item => item.event === 'admission_unknown'));
});

test('absent after lost response retries the frozen intent with the replacement origin socket', async t => {
  const result = await execute(t, 'lost-before-admission', { timeoutMs: 5000 });
  assert.equal(result.code, 0);
  assert.equal(result.service.requests.length, 2);
  const first = result.service.requests[0].body, second = result.service.requests[1].body;
  assert.notEqual(first.originSocketId, second.originSocketId);
  const { originSocketId: a, ...original } = first;
  const { originSocketId: b, ...retry } = second;
  assert.deepEqual(retry, original);
});

test('idle, completed_idle result and user delivery do not finish a turn', async t => {
  const result = await execute(t, 'false-terminal-only');
  assert.equal(result.code, 2);
  assert.equal(result.state.turns[0].outcome, undefined);
  assert.ok(result.service.observations.includes('runtime-state'));
  assert.ok(result.service.observations.includes('receipt'));
  assert.equal(result.chunks.join('').includes('delivery is not completion'), false);
});

test('missed terminal is recovered by read-only snapshots, without claiming completion or submitting follow-up', async t => {
  const result = await execute(t, 'missed-terminal', { followUps: ['must not be sent'] });
  assert.equal(result.code, 2);
  assert.equal(result.service.requests.length, 1);
  assert.equal(result.state.turns[0].recovery.runtime.status, 'idle');
  assert.equal(result.state.turns[0].outcome, undefined);
});

test('handed_off observations do not finish a turn or start pending follow-ups', async t => {
  const result = await execute(t, 'handed-off-no-terminal', { followUps: ['do not send'] });
  assert.equal(result.code, 2);
  assert.equal(result.service.requests.length, 1);
  assert.equal(result.state.turns[0].outcome, undefined);
  assert.equal(result.state.turns[0].recovery.runtime.httpStatus, 404);
  assert.equal(result.state.turns[0].runState.status, 'handed_off');
  assert.deepEqual(result.state.pendingFollowUps, ['do not send']);
});

test('an unavailable runtime snapshot prevents continuing a completed source turn after handoff', async t => {
  const result = await execute(t, 'handed-off-snapshot', { followUps: ['retain this'] });
  assert.equal(result.code, 2);
  assert.equal(result.state.turns[0].outcome.status, 'completed');
  assert.equal(result.service.requests.length, 1);
  assert.equal(result.state.turns[0].runState, undefined);
  assert.deepEqual(result.state.pendingFollowUps, ['retain this']);
  assert.ok(result.logs.some(item => item.event === 'follow_up_unavailable' && item.httpStatus === 404));
});

const attachmentReceipt = (id, fileReference) => ({
  attachmentId: `00000000-0000-4000-8000-${String(id).padStart(12, '0')}`,
  name: `report-${id}.txt`, mimeType: 'text/plain', size: 7, sha256: 'a'.repeat(64), fileReference,
});

test('attachment receipts add ordered unique start references and participate in the frozen digest', async t => {
  const first = attachmentReceipt(1, 'instance-attachment/first.txt');
  const second = attachmentReceipt(2, 'instance-attachment/second.txt');
  const result = await execute(t, 'lost-before-admission', { timeoutMs: 5000, receiptContents: [first, second, first] });
  assert.equal(result.code, 0);
  assert.equal(result.service.requests.length, 2);
  const body = result.service.requests[0].body;
  assert.deepEqual(body.options.fileReferences, [first.fileReference, second.fileReference]);
  assert.equal(body.fileReferences, undefined);
  assert.notEqual(body.requestDigest, queryDigest(body.prompt, body.userMessageId));
  const { originSocketId: originalSocket, ...original } = body;
  const { originSocketId: retrySocket, ...retry } = result.service.requests[1].body;
  assert.notEqual(originalSocket, retrySocket);
  assert.deepEqual(retry, original);
  assert.deepEqual(result.state.turns[0].body.options.fileReferences, body.options.fileReferences);
  assert.equal(await runClient({ recover: result.filename }, result.env, { log() {}, text() {} }), 2);
});

test('invalid or non-closed attachment receipts are rejected before query admission', async t => {
  await assert.rejects(execute(t, 'normal', { receiptContents: [{ ...attachmentReceipt(1, 'file.txt'), size: 0 }] }), /Invalid attachment receipt/);
  await assert.rejects(execute(t, 'normal', { receiptContents: [{ ...attachmentReceipt(1, 'file.txt'), extra: true }] }), /Invalid attachment receipt/);
});

for (const scenario of ['unknown', 'expired']) test(`${scenario} admission never generates a new execution`, async t => {
  const result = await execute(t, scenario);
  assert.equal(result.code, 2);
  assert.equal(result.service.requests.length, 1);
});

test('body mismatch is a non-retryable rejection', async t => {
  const result = await execute(t, 'conflict');
  assert.equal(result.code, 1);
  assert.equal(result.service.requests.length, 1);
  assert.equal(result.state.turns[0].outcome.code, 'CLIENT_REQUEST_BODY_MISMATCH');
});

test('interrupted terminal is not success', async t => {
  const result = await execute(t, 'interrupted');
  assert.equal(result.code, 1);
  assert.equal(result.state.turns[0].outcome.status, 'interrupted');
});

test('recover is read-only and retains request identity', async t => {
  const result = await execute(t, 'normal');
  const before = result.service.requests.length;
  assert.equal(await runClient({ recover: result.filename }, result.env, { log() {}, text() {} }), 2);
  assert.equal(result.service.requests.length, before);
  assert.equal(JSON.parse(readFileSync(result.filename, 'utf8')).turns[0].body.clientRequestId, result.state.turns[0].body.clientRequestId);
});

test('explicit cancellation uses the saved request identity and waits for interruption', async t => {
  const result = await execute(t, 'false-terminal-only');
  assert.equal(result.code, 2);
  assert.equal(await runClient({ cancel: result.filename, timeoutMs: 300, httpTimeoutMs: 200, pollMs: 20 }, result.env, { log() {}, text() {} }), 1);
  assert.deepEqual(result.service.cancellations, [{ sessionId: 'session-test', agentId: 'agent-test',
    conversationId: 'agent-test', clientRequestId: result.state.turns[0].body.clientRequestId }]);
  assert.equal(result.service.requests.length, 1);
});
