import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { once } from 'node:events';
import { mkdtemp, readFile, writeFile, rm, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseS3Args, runS3 } from '../s3.mjs';

const handshake = { service: 'desirecore-agent-service', apiProtocolVersion: '1', instanceId: 'inst_s3_fixture', capabilities: { objectStorageCapability: true } };
function json(res, body, status = 200) { res.writeHead(status, { 'content-type': 'application/json' }); res.end(JSON.stringify(body)); }
async function fixture(t, handler, metadata = handshake) {
  const requests = [];
  const server = http.createServer((req, res) => {
    requests.push({ path: req.url, token: req.headers['x-agent-service-token'], method: req.method });
    if (req.url === '/api/client-handshake') json(res, metadata);
    else handler(req, res);
  });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  t.after(() => { server.closeAllConnections(); server.close(); });
  return { requests, env: { DESIRECORE_URL: `http://127.0.0.1:${server.address().port}`, DESIRECORE_TOKEN: 'synthetic-s3-private-token' } };
}
async function directory(t) {
  const dir = await mkdtemp(join(tmpdir(), 'docs-s3-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  return dir;
}
const list = (more = false, extra = {}) => ({ success: true, objects: [], common_prefixes: [], key_count: 0, is_truncated: more, bucket: 'fixture', ...extra });

test('summary reads verify identity, use only GET and preserve empty connections', async t => {
  const f = await fixture(t, (_req, res) => json(res, { success: true, connections: [] }));
  const out = [];
  await runS3({ command: 'connections' }, { env: f.env, emit: v => out.push(v) });
  assert.deepEqual(out[0].data.connections, []);
  assert.equal(out[0].instanceId, handshake.instanceId);
  assert.deepEqual(f.requests.map(v => v.path), ['/api/client-handshake', '/api/s3/connections']);
  assert.ok(f.requests.every(v => v.method === 'GET' && v.token === f.env.DESIRECORE_TOKEN));
});

test('opaque token pagination keeps query scope, encodes keys and preserves omitted final token', async t => {
  const f = await fixture(t, (req, res) => {
    const q = new URL(req.url, 'http://fixture').searchParams;
    assert.equal(q.get('connection_id'), 'storage&one'); assert.equal(q.get('prefix'), 'reports/汉字 &');
    assert.equal(q.get('delimiter'), ''); assert.equal(q.get('max_keys'), '2');
    if (!q.has('continuation_token')) json(res, list(true, { next_continuation_token: 'x+/=&汉字' }));
    else { assert.equal(q.get('continuation_token'), 'x+/=&汉字'); json(res, list()); }
  });
  const out = [];
  await runS3({ command: 'list', prefix: 'reports/汉字 &', delimiter: '', maxKeys: '2', all: true }, { env: { ...f.env, DESIRECORE_S3_CONNECTION_ID: 'storage&one' }, emit: v => out.push(v) });
  assert.equal(out.length, 2); assert.equal(out[1].page, 2); assert.equal(Object.hasOwn(out[1].data, 'next_continuation_token'), false);
});

test('one-page listing does not follow tokens without --all', async t => {
  const f = await fixture(t, (_req, res) => json(res, list(true, { next_continuation_token: 'next' })));
  await runS3({ command: 'list' }, { env: f.env, emit: () => {} });
  assert.equal(f.requests.length, 2);
});

test('pagination refuses missing and repeated tokens and reports partial page limits', async t => {
  for (const token of [undefined, 'repeat']) {
    const f = await fixture(t, (_req, res) => json(res, list(true, token ? { next_continuation_token: token } : {})));
    const out = [];
    await assert.rejects(runS3({ command: 'list', all: true }, { env: f.env, emit: v => out.push(v) }), /continuation token/);
    assert.equal(out.length, token ? 2 : 1);
  }
  const f = await fixture(t, (_req, res) => json(res, list(true, { next_continuation_token: 'next' })));
  await assert.rejects(runS3({ command: 'list', all: true, maxPages: '1' }, { env: f.env, emit: () => {} }), /output is partial/);
  assert.equal(f.requests.length, 2);
});

test('public and presigned links are emitted without following remote URLs', async t => {
  for (const urlType of ['public', 'presigned']) {
    const f = await fixture(t, (req, res) => {
      const q = new URL(req.url, 'http://fixture').searchParams;
      assert.equal(q.get('key'), 'reports/a & 汉字.json'); assert.equal(q.get('expires_in'), '120');
      json(res, { success: true, key: q.get('key'), url_type: urlType, download_url: 'https://untrusted.invalid/file?signature=secret', ...(urlType === 'presigned' ? { expires_in: 120 } : {}) });
    });
    const out = [];
    await runS3({ command: 'download', key: 'reports/a & 汉字.json', expiresIn: '120' }, { env: f.env, emit: v => out.push(v) });
    assert.equal(out[0].kind, 'download-link'); assert.equal(out[0].data.url_type, urlType);
    assert.equal(Object.hasOwn(out[0].data, 'expires_in'), urlType === 'presigned'); assert.equal(f.requests.length, 2);
  }
});

test('binary download stores exact bytes, including JSON, using an explicit filename', async t => {
  const dir = await directory(t); const output = join(dir, 'chosen.json');
  const bytes = Buffer.from('{"success":false,"this":"is object content"}\u0000');
  const f = await fixture(t, (_req, res) => { res.writeHead(200, { 'content-type': 'application/json', 'content-disposition': 'attachment; filename="../../wrong"', 'content-length': bytes.length }); res.end(bytes); });
  const out = [];
  await runS3({ command: 'download', key: 'some.json', mode: 'binary', output }, { env: f.env, emit: v => out.push(v) });
  assert.deepEqual(await readFile(output), bytes); assert.equal(out[0].bytes, bytes.length);
  assert.deepEqual(await readdir(dir), ['chosen.json']);
});

test('binary mode refuses overwrite and preserves existing file', async t => {
  const dir = await directory(t); const output = join(dir, 'existing'); await writeFile(output, 'keep');
  const f = await fixture(t, (_req, res) => { res.writeHead(200, { 'content-type': 'application/octet-stream' }); res.end('replace'); });
  await assert.rejects(runS3({ command: 'download', key: 'k', mode: 'binary', output }, { env: f.env }), /EEXIST/);
  assert.equal(await readFile(output, 'utf8'), 'keep');
});

test('advertised and streamed byte limits leave no incomplete output', async t => {
  const dir = await directory(t);
  for (const length of [true, false]) {
    const output = join(dir, String(length));
    const f = await fixture(t, (_req, res) => { res.writeHead(200, { 'content-type': 'application/octet-stream', ...(length ? { 'content-length': 5 } : {}) }); res.write('123'); res.end('45'); });
    await assert.rejects(runS3({ command: 'download', key: 'k', mode: 'binary', output, maxBytes: '4' }, { env: f.env }), /max-bytes/);
    assert.deepEqual(await readdir(dir), []);
  }
});

test('capability and domain errors are not retried or written as files, and do not expose server details', async t => {
  const dir = await directory(t); const output = join(dir, 'error');
  for (const [status, code] of [[403, 'capabilityDisabled'], [400, 'NO_CONNECTION'], [500, 'DOWNLOAD_FAILED']]) {
    const f = await fixture(t, (_req, res) => json(res, { code, error: 'synthetic-s3-private-token and private provider details' }, status));
    await assert.rejects(runS3({ command: 'download', key: 'k', mode: 'binary', output }, { env: f.env }), error => error.message.includes(`HTTP ${status} ${code}`) && !error.message.includes('private'));
    assert.equal(f.requests.length, 2); assert.deepEqual(await readdir(dir), []);
  }
});

test('wrong handshake, HTML API responses and redirects stop reads', async t => {
  const wrong = await fixture(t, () => assert.fail('read after wrong service'), { ...handshake, service: 'other' });
  await assert.rejects(runS3({ command: 'connections' }, { env: wrong.env }), /handshake/); assert.equal(wrong.requests.length, 1);
  const html = await fixture(t, (_req, res) => { res.writeHead(200, { 'content-type': 'text/html' }); res.end('login'); });
  await assert.rejects(runS3({ command: 'connections' }, { env: html.env }), /expected JSON/);
  const redirect = await fixture(t, (_req, res) => { res.writeHead(302, { location: 'https://untrusted.invalid/' }); res.end(); });
  await assert.rejects(runS3({ command: 'connections' }, { env: redirect.env }), /fetch failed/); assert.equal(redirect.requests.length, 2);
});

test('unsafe origin or invalid parameters fail before any request', async t => {
  const f = await fixture(t, () => assert.fail('unexpected storage read'));
  for (const input of [
    { command: 'list', maxKeys: '1.5' }, { command: 'list', maxKeys: '0' }, { command: 'list', maxPages: '2' },
    { command: 'connections', connectionId: 'x' }, { command: 'download', key: '' },
    { command: 'download', key: 'k', expiresIn: '59' }, { command: 'download', key: 'k', mode: 'unknown' },
    { command: 'download', key: 'k', mode: 'binary' }, { command: 'download', key: 'k', output: 'wrong-mode' },
  ]) await assert.rejects(runS3(input, { env: f.env }));
  await assert.rejects(runS3({ command: 'connections' }, { env: { ...f.env, DESIRECORE_URL: 'http://remote.example' } }));
  assert.equal(f.requests.length, 0);
});

test('argument parser preserves explicit empty delimiter and rejects duplicate flags', () => {
  assert.deepEqual(parseS3Args(['list', '--delimiter', '', '--all']), { command: 'list', delimiter: '', all: true });
  assert.throws(() => parseS3Args(['list', '--all', '--all']));
  assert.throws(() => parseS3Args(['download', '--key', 'a', '--key', 'b']));
  assert.throws(() => parseS3Args(['download', '--output']));
});
