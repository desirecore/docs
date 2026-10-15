// Local HTTP contract fixture; this does not run DesireCore storage or a model.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { mkdtemp, writeFile, readFile, rm, open, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { uploadAttachment, validateAttachmentReceipt, AttachmentUploadError, MAX_ATTACHMENT_BYTES } from '../attachments.mjs';

const bytes = Buffer.from('Quarterly summary\n');
const receipt = { attachmentId: '00000000-0000-4000-8000-000000000001', name: 'report.txt', mimeType: 'text/plain',
  size: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'), fileReference: '/srv/attachments/owner/00000000-0000-4000-8000-000000000001/data' };

async function fixture(t, respond = (_request, response) => json(response, 201, receipt)) {
  const directory = await mkdtemp(join(tmpdir(), 'desirecore-attachment-example-'));
  const file = join(directory, 'report.txt');
  await writeFile(file, bytes);
  const requests = [];
  const server = createServer(async (request, response) => {
    let body = Buffer.alloc(0);
    for await (const chunk of request) body = Buffer.concat([body, chunk]);
    requests.push({ url: request.url, method: request.method, headers: request.headers, body });
    respond(request, response, body);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
    await rm(directory, { recursive: true, force: true });
  });
  return { directory, file, requests, baseUrl: `http://127.0.0.1:${server.address().port}`, token: 'fixture-only-token', mimeType: 'text/plain' };
}
function json(response, status, value) { response.writeHead(status, { 'Content-Type': 'application/json' }); response.end(JSON.stringify(value)); }
function cli(args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [fileURLToPath(new URL('../attachments.mjs', import.meta.url)), ...args], { env: { ...process.env, ...env } });
    let stdout = '', stderr = '';
    child.stdout.on('data', value => stdout += value); child.stderr.on('data', value => stderr += value);
    child.on('error', reject); child.on('close', code => resolve({ code, stdout, stderr }));
  });
}

test('uploads a real multipart request and validates the returned bytes/hash receipt', async t => {
  const f = await fixture(t);
  assert.deepEqual(await uploadAttachment(f), receipt);
  assert.equal(f.requests.length, 1);
  const request = f.requests[0];
  assert.equal(request.url, '/api/attachments'); assert.equal(request.method, 'POST');
  assert.equal(request.headers['x-agent-service-token'], f.token);
  assert.match(request.headers['content-type'], /^multipart\/form-data; boundary=/);
  assert.ok(request.body.includes(Buffer.from('name="file"; filename="report.txt"')));
  assert.ok(request.body.includes(Buffer.from('Content-Type: text/plain')));
  assert.ok(request.body.includes(bytes));
});

for (const [status, code] of [[401, 'attachment_identity_required'], [413, 'attachment_too_large'],
  [429, 'attachment_storage_limit'], [503, 'attachment_storage_unavailable']]) {
  test(`preserves HTTP ${status} and machine error without retrying POST`, async t => {
    const f = await fixture(t, (_request, response) => json(response, status, { error: code }));
    await assert.rejects(uploadAttachment(f), error => error instanceof AttachmentUploadError && error.status === status && error.code === code);
    assert.equal(f.requests.length, 1);
  });
}

test('rejects a successful-looking receipt for different bytes or an unexpected wrapper', async t => {
  const f = await fixture(t, (_request, response) => json(response, 201, { ...receipt, sha256: 'a'.repeat(64) }));
  await assert.rejects(uploadAttachment(f), /does not match/);
  assert.throws(() => validateAttachmentReceipt({ success: true, data: receipt }), /Invalid attachment receipt/);
  assert.throws(() => validateAttachmentReceipt({ ...receipt, extra: true }), /Invalid attachment receipt/);
  for (const invalid of [{ size: 0 }, { size: MAX_ATTACHMENT_BYTES + 1 }, { attachmentId: '../escape' },
    { fileReference: '' }, { sha256: 'A'.repeat(64) }]) {
    assert.throws(() => validateAttachmentReceipt({ ...receipt, ...invalid }), /Invalid attachment receipt/);
  }
});

test('does not mistake HTML or HTTP 200 for the upload success contract', async t => {
  const f = await fixture(t, (_request, response) => { response.writeHead(200, { 'Content-Type': 'text/html' }); response.end('<h1>SPA</h1>'); });
  await assert.rejects(uploadAttachment(f), /expected JSON/);
  const g = await fixture(t, (_request, response) => json(response, 200, receipt));
  await assert.rejects(uploadAttachment(g), error => error instanceof AttachmentUploadError && error.status === 200);
});

test('refuses redirects instead of forwarding an instance credential', async t => {
  const f = await fixture(t, (_request, response) => { response.writeHead(307, { Location: '/other' }); response.end(); });
  await assert.rejects(uploadAttachment(f), /fetch failed/);
  assert.equal(f.requests.length, 1);
});

test('rejects empty/oversized/local-directory inputs before sending HTTP', async t => {
  const f = await fixture(t), empty = join(f.directory, 'empty'), large = join(f.directory, 'large');
  await writeFile(empty, ''); const handle = await open(large, 'w'); await handle.truncate(MAX_ATTACHMENT_BYTES + 1); await handle.close();
  for (const file of [empty, large, f.directory]) await assert.rejects(uploadAttachment({ ...f, file }), /non-empty regular file/);
  assert.equal(f.requests.length, 0);
});

test('rejects non-HTTPS remote origins, embedded credentials, paths, and missing tokens', async t => {
  const f = await fixture(t);
  for (const baseUrl of ['http://example.com', 'https://user:password@example.com', f.baseUrl + '/api', f.baseUrl + '?token=secret']) {
    await assert.rejects(uploadAttachment({ ...f, baseUrl }), /HTTPS instance origin/);
  }
  await assert.rejects(uploadAttachment({ ...f, token: '' }), /DESIRECORE_TOKEN/);
  assert.equal(f.requests.length, 0);
});

test('CLI persists a direct private receipt and refuses to overwrite it or repeat the upload', async t => {
  const f = await fixture(t), out = join(f.directory, 'receipt.json');
  const args = ['--file', f.file, '--out', out, '--mime', 'text/plain'];
  const env = { DESIRECORE_URL: f.baseUrl, DESIRECORE_TOKEN: f.token };
  const first = await cli(args, env);
  assert.equal(first.code, 0, first.stderr); assert.equal(first.stdout, '');
  assert.deepEqual(JSON.parse(await readFile(out, 'utf8')), receipt);
  if (process.platform !== 'win32') assert.equal((await stat(out)).mode & 0o777, 0o600);
  assert.ok(!first.stderr.includes(f.token));
  const second = await cli(args, env);
  assert.equal(second.code, 1); assert.equal(f.requests.length, 1);
  assert.deepEqual(JSON.parse(await readFile(out, 'utf8')), receipt);
});

test('CLI removes its uncompleted receipt after an upload rejection', async t => {
  const f = await fixture(t, (_request, response) => json(response, 401, { error: 'unauthorized' }));
  const out = join(f.directory, 'failed.json');
  const result = await cli(['--file', f.file, '--out', out], { DESIRECORE_URL: f.baseUrl, DESIRECORE_TOKEN: f.token });
  assert.equal(result.code, 1); await assert.rejects(stat(out), { code: 'ENOENT' });
  assert.equal(f.requests.length, 1); assert.ok(!result.stderr.includes(f.token));
});
