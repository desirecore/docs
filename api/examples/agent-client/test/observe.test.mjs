import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { once } from 'node:events';
import { runObserve } from '../observe.mjs';

const handshake = { service: 'desirecore-agent-service', apiProtocolVersion: '1', instanceId: 'inst_observe_fixture' };
async function fixture(t, handler, metadata = handshake) {
  const requests = [];
  const server = http.createServer((req, res) => {
    requests.push({ path: req.url, token: req.headers['x-agent-service-token'], method: req.method });
    if (req.url === '/api/client-handshake') { res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(metadata)); }
    else handler(req, res);
  });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  t.after(() => { server.closeAllConnections(); server.close(); });
  return { requests, env: { DESIRECORE_URL: `http://127.0.0.1:${server.address().port}`, DESIRECORE_TOKEN: 'private-test-token' } };
}
function json(res, value, status = 200) { res.writeHead(status, { 'content-type': 'application/json' }); res.end(JSON.stringify(value)); }

test('observation reads verify identity and preserve optional response fields without interpreting success', async t => {
  const values = {
    '/api/agents/agent-a/input-config': { version: 1, agentId: 'agent-a', manual: true, configRevision: 'a'.repeat(64), extension: true },
    '/api/network/health': { status: 'unknown', reason: 'init', since: '2026-10-25T00:00:00.000Z', seq: 0 },
    '/api/runs/recent-calls?limit=2': { calls: [] },
    '/api/runs/usage/summary?since=2026-10-01T00%3A00%3A00Z&agentId=agent-a&timezone=UTC': { total: {}, byModel: [], byDate: [], byAgent: [] },
  };
  const f = await fixture(t, (req, res) => { assert.ok(Object.hasOwn(values, req.url), req.url); json(res, values[req.url]); });
  const out = [];
  for (const options of [{ command: 'input-config', agentId: 'agent-a' }, { command: 'network' }, { command: 'recent-calls', limit: '2' }, { command: 'usage', agentId: 'agent-a', since: '2026-10-01T00:00:00Z', timezone: 'UTC' }]) await runObserve(options, { env: f.env, emit: value => out.push(value) });
  assert.equal(out.length, 4); assert.equal(out[0].data.extension, true); assert.equal(out[1].data.status, 'unknown');
  assert.ok(f.requests.every(req => req.method === 'GET' && req.token === f.env.DESIRECORE_TOKEN));
  assert.equal(f.requests.length, 8);
});

test('an incorrect handshake prevents reading a different service', async t => {
  const f = await fixture(t, () => assert.fail('read after wrong identity'), { ...handshake, service: 'another-service' });
  await assert.rejects(runObserve({ command: 'network' }, { env: f.env }), /handshake/);
  assert.equal(f.requests.length, 1);
});

test('errors are not retried and do not print credential or server error bodies', async t => {
  const f = await fixture(t, (_req, res) => json(res, { code: 'AGENT_INPUT_CONFIG_CHANGED', error: 'private-test-token' }, 409));
  const out = [];
  await assert.rejects(runObserve({ command: 'input-config', agentId: 'agent-a' }, { env: f.env, emit: v => out.push(v) }), error => /HTTP 409 AGENT_INPUT_CONFIG_CHANGED/.test(error.message) && !error.message.includes(f.env.DESIRECORE_TOKEN));
  assert.equal(out.length, 0); assert.equal(f.requests.length, 2);
});

test('HTML responses and redirects cannot masquerade as successful API reads', async t => {
  const f = await fixture(t, (_req, res) => { res.writeHead(200, { 'content-type': 'text/html' }); res.end('<html>login</html>'); });
  await assert.rejects(runObserve({ command: 'network' }, { env: f.env }), /expected JSON/);
  const g = await fixture(t, (_req, res) => { res.writeHead(302, { location: '/other' }); res.end(); });
  await assert.rejects(runObserve({ command: 'network' }, { env: g.env }), /fetch failed/);
  assert.equal(g.requests.length, 2);
});

test('invalid input configuration is not silently treated as automatic input mode', async t => {
  const f = await fixture(t, (_req, res) => json(res, { version: 1, agentId: 'agent-a', configRevision: 'a'.repeat(64) }));
  await assert.rejects(runObserve({ command: 'input-config', agentId: 'agent-a' }, { env: f.env }), /do not assume manual=false/);
});

test('unsupported or unsafe options fail before connecting', async t => {
  const f = await fixture(t, () => assert.fail('unexpected read'));
  for (const options of [{ command: 'recent-calls', limit: '1x' }, { command: 'network', since: 'bad' }, { command: 'usage', timezone: 'not-a-zone' }, { command: 'input-config', agentId: '../escape' }]) await assert.rejects(runObserve(options, { env: f.env }));
  await assert.rejects(runObserve({ command: 'network' }, { env: { ...f.env, DESIRECORE_URL: 'http://remote.example' } }));
  assert.equal(f.requests.length, 0);
});
