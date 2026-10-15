// Local HTTP contract fixture; actual DesireCore route coverage is recorded separately.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { parseHistoryArgs, runHistory } from '../history.mjs';

const token = 'history-owner-test-token';
const handshake = { service: 'desirecore-agent-service', apiProtocolVersion: '1', instanceId: 'inst_history_test' };
function json(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(body));
}

async function fixture(t, handler, customHandshake) {
  const requests = [];
  const server = createServer((request, response) => {
    const url = new URL(request.url, 'http://localhost');
    requests.push({ method: request.method, url, headers: request.headers });
    if (request.headers['x-agent-service-token'] !== token) return json(response, 401, { error: 'unauthorized' });
    if (url.pathname === '/api/client-handshake') {
      if (customHandshake) return customHandshake(request, response);
      return json(response, 200, handshake);
    }
    handler(url, response);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => { server.closeAllConnections(); server.close(resolve); }));
  return { requests, env: { DESIRECORE_URL: `http://127.0.0.1:${server.address().port}`, DESIRECORE_TOKEN: token } };
}

async function read(options, env) {
  const records = [];
  const result = await runHistory(options, env, { emit: value => records.push(value) });
  return { records, result };
}

test('lists bounded pages with owner authentication and preserves query scope', async t => {
  const f = await fixture(t, (url, response) => {
    assert.equal(url.pathname, '/api/sessions');
    assert.equal(url.searchParams.get('agentId'), 'agent-a');
    assert.equal(url.searchParams.get('includeArchived'), 'true');
    const offset = Number(url.searchParams.get('offset'));
    json(response, 200, { sessions: [{ runId: `run-${offset}` }], total: 3, hasMore: offset === 0 });
  });
  const out = await read({ command: 'list', agentId: 'agent-a', includeArchived: true, limit: 2, allPages: true }, f.env);
  assert.deepEqual(f.requests.slice(1).map(item => item.url.searchParams.get('offset')), ['0', '2']);
  assert.ok(f.requests.every(item => item.method === 'GET'));
  assert.equal(out.result.exitCode, 0);
  assert.equal(out.records.length, 2);
});

test('message paging consumes the requested source window, including an empty damaged window', async t => {
  const f = await fixture(t, (url, response) => {
    assert.equal(url.pathname, '/api/sessions/run-child/messages');
    assert.equal(url.searchParams.get('view'), 'inspect-run');
    const offset = Number(url.searchParams.get('offset'));
    json(response, 200, { messages: offset === 0 ? [] : [{ id: `m-${offset}`, lineIndex: offset, offset: offset * 100, role: 'assistant', content: 'saved' }],
      total: 5, ...(offset === 0 && { live: { text: 'not durable', toolCalls: [], timestamp: 1 } }) });
  });
  const out = await read({ command: 'messages', id: 'run-child', inspectRun: true, limit: 2, allPages: true }, f.env);
  assert.deepEqual(f.requests.slice(1).map(item => item.url.searchParams.get('offset')), ['0', '2', '4']);
  assert.equal(out.result.pages, 3);
  assert.equal(out.result.exitCode, 0);
  assert.deepEqual(out.records[0].data.messages, []);
  assert.equal(out.records[0].data.live.text, 'not durable');
});

test('stops all-pages reads when the observed total changes', async t => {
  const f = await fixture(t, (url, response) => {
    const first = url.searchParams.get('offset') === '0';
    json(response, 200, { messages: [], total: first ? 3 : 4 });
  });
  const out = await read({ command: 'messages', id: 'run-a', limit: 2, allPages: true }, f.env);
  assert.equal(out.result.exitCode, 2);
  assert.equal(out.result.pages, 1);
  assert.equal(out.records.at(-1).reason, 'history-total-changed');
  assert.equal(out.records.at(-1).nextOffset, 2);
  assert.equal(f.requests.length, 3);
});

test('preserves Unicode search, filters, preferred branch and preview size over pages', async t => {
  const f = await fixture(t, (url, response) => {
    assert.equal(url.pathname, '/api/sessions/messages/search');
    assert.equal(url.searchParams.get('q'), '交付 & release');
    assert.equal(url.searchParams.get('type'), 'tool');
    assert.equal(url.searchParams.get('previewChars'), '40');
    assert.equal(url.searchParams.get('preferredRunId'), 'run-old');
    const offset = Number(url.searchParams.get('offset'));
    json(response, 200, { items: [], total: 3, hasMore: offset === 0 });
  });
  const out = await read({ command: 'search', agentId: 'agent-a', query: '交付 & release', type: 'tool', preferredRunId: 'run-old', previewChars: 40, limit: 2, allPages: true }, f.env);
  assert.deepEqual(f.requests.slice(1).map(item => item.url.searchParams.get('offset')), ['0', '2']);
  assert.equal(out.result.exitCode, 0);
});

test('search limit=0 reads one unbounded result response without a zero-step loop', async t => {
  const f = await fixture(t, (url, response) => {
    assert.equal(url.searchParams.get('limit'), '0');
    assert.equal(url.searchParams.get('offset'), '2');
    json(response, 200, { items: [], total: 2, hasMore: false });
  });
  const out = await read({ command: 'search', agentId: 'agent-a', limit: 0, offset: 2, allPages: true }, f.env);
  assert.equal(out.result.pages, 1);
  assert.equal(out.result.exitCode, 0);
  assert.equal(f.requests.length, 2);
});

test('bounds all-pages requests and reports the next offset', async t => {
  const f = await fixture(t, (_url, response) => json(response, 200, { sessions: [], total: 10, hasMore: true }));
  const out = await read({ command: 'list', limit: 2, maxPages: 2, allPages: true }, f.env);
  assert.deepEqual(out.result, { exitCode: 2, pages: 2, nextOffset: 4 });
  assert.equal(out.records.at(-1).reason, 'max-pages');
  assert.equal(f.requests.length, 3);
});

test('uses the exact Run snapshot endpoint and leaves the public payload intact', async t => {
  const snapshot = { runId: 'run-a', messages: [], pendingAssistant: { role: 'assistant', content: 'in progress' }, status: 'idle' };
  const f = await fixture(t, (url, response) => { assert.equal(url.pathname, '/api/sessions/run-a'); json(response, 200, snapshot); });
  const out = await read({ command: 'session', id: 'run-a' }, f.env);
  assert.deepEqual(out.records[0].data, snapshot);
  assert.equal(out.result.exitCode, 0);
});

test('overview and matter are unpaginated; a truncated matter exits 2', async t => {
  const f = await fixture(t, (url, response) => {
    if (url.pathname.endsWith('/overview')) return json(response, 200, { agentId: 'agent-a', activeMatters: [], recentMatters: [], totalMatters: 0, totalArchived: 0 });
    assert.equal(url.pathname, '/api/conversation/agent-a/matters/mat_a/full');
    json(response, 200, { matterId: 'mat_a', messages: [], truncated: true });
  });
  const overview = await read({ command: 'overview' }, { ...f.env, DESIRECORE_AGENT_ID: 'agent-a' });
  assert.equal(overview.result.exitCode, 0);
  const matter = await read({ command: 'matter', id: 'mat_a', agentId: 'agent-a' }, f.env);
  assert.equal(matter.result.exitCode, 2);
  assert.ok(f.requests.every(item => !item.url.search));
});

test('authentication failures stop at the handshake without printing the credential', async t => {
  const f = await fixture(t, () => assert.fail('history must not be requested'));
  await assert.rejects(runHistory({ command: 'list' }, { ...f.env, DESIRECORE_TOKEN: 'wrong-owner-token' }), error => {
    assert.equal(error.status, 401);
    assert.equal(error.message, 'HTTP 401: unauthorized');
    assert.ok(!error.message.includes('wrong-owner-token'));
    return true;
  });
  assert.equal(f.requests.length, 1);
});

test('reports delegated-view rejection and missing Run without retry or ID substitution', async t => {
  const f = await fixture(t, (url, response) => json(response, url.pathname.includes('delegated') ? 403 : 404,
    { error: url.pathname.includes('delegated') ? 'delegated_run_requires_inspect_view' : 'Session not found' }));
  await assert.rejects(runHistory({ command: 'session', id: 'run-delegated' }, f.env), error => error.status === 403);
  await assert.rejects(runHistory({ command: 'messages', id: 'missing-run' }, f.env), error => error.status === 404);
  assert.deepEqual(f.requests.filter(item => !item.url.pathname.includes('handshake')).map(item => item.url.pathname), ['/api/sessions/run-delegated', '/api/sessions/missing-run/messages']);
});

test('rejects HTML and unsupported service identities before reading history', async t => {
  const html = await fixture(t, () => assert.fail('unexpected read'), (_request, response) => { response.writeHead(200, { 'Content-Type': 'text/html' }); response.end('<html/>'); });
  await assert.rejects(runHistory({ command: 'list' }, html.env), /expected a JSON API response/);
  const other = await fixture(t, () => assert.fail('unexpected read'), (_request, response) => json(response, 200, { ...handshake, service: 'another-service' }));
  await assert.rejects(runHistory({ command: 'list' }, other.env), /Unexpected service identity/);
});

test('does not follow a redirect carrying the instance credential', async t => {
  const f = await fixture(t, () => assert.fail('redirect must not be followed'), (_request, response) => {
    response.writeHead(302, { Location: '/credential-target' }); response.end();
  });
  await assert.rejects(runHistory({ command: 'list' }, f.env), /no automatic retry/);
  assert.equal(f.requests.length, 1);
});

test('validates flags, IDs, finite pagination and HTTPS before network access', async () => {
  assert.deepEqual(parseHistoryArgs(['messages', 'run-a', '--inspect-run', '--limit', '2']), { command: 'messages', id: 'run-a', inspectRun: true, limit: '2' });
  assert.deepEqual(parseHistoryArgs(['--help']), { help: true });
  assert.throws(() => parseHistoryArgs(['list', '--wat']), /Unknown/);
  for (const options of [{ command: 'list', limit: 0 }, { command: 'list', offset: '-1' }, { command: 'messages', id: '../other' }, { command: 'session', id: 'run-a', allPages: true }, { command: 'search', agentId: 'a', previewChars: 8001 }]) {
    await assert.rejects(runHistory(options, {}));
  }
  await assert.rejects(runHistory({ command: 'list' }, { DESIRECORE_URL: 'http://remote.example', DESIRECORE_TOKEN: token }), /Use HTTPS/);
});
