#!/usr/bin/env node
// Standalone object-storage reads. Node.js 22+, no packages required.
import { open, unlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const HELP = `Usage:
  node s3.mjs connections
  node s3.mjs list [--connection-id ID] [--prefix PATH] [--delimiter /] [--max-keys 100] [--all] [--max-pages 100]
  node s3.mjs download --key KEY [--connection-id ID] [--mode link] [--expires-in 3600]
  node s3.mjs download --key KEY --mode binary --output FILE [--max-bytes 104857600]
Environment: DESIRECORE_URL, DESIRECORE_TOKEN, optional DESIRECORE_S3_CONNECTION_ID.
Options: --timeout-ms 10000. Remote origins must use HTTPS.
Returned links are printed, never followed; signed links can grant access. Existing output files are never overwritten.
`;

function originFor(value) {
  let url;
  try { url = new URL(value); } catch { throw new Error('Set DESIRECORE_URL to the instance origin.'); }
  if (url.username || url.password || url.pathname !== '/' || url.search || url.hash
    || (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)))) {
    throw new Error('Use an HTTPS origin without credentials, path, query or fragment; HTTP is allowed only on loopback.');
  }
  return url.origin;
}
function integer(value, label, fallback, min = 1, max = Number.MAX_SAFE_INTEGER) {
  if (value === undefined) return fallback;
  if (!/^[0-9]+$/.test(String(value)) || !Number.isSafeInteger(Number(value)) || Number(value) < min || Number(value) > max) throw new Error(`${label} must be a decimal integer from ${min} to ${max}.`);
  return Number(value);
}
export function parseS3Args(argv) {
  if (argv.includes('--help') || argv.includes('-h')) return { help: true };
  const options = { command: argv[0] };
  const flags = { '--connection-id': 'connectionId', '--prefix': 'prefix', '--delimiter': 'delimiter', '--max-keys': 'maxKeys', '--continuation-token': 'continuationToken', '--max-pages': 'maxPages', '--key': 'key', '--mode': 'mode', '--expires-in': 'expiresIn', '--output': 'output', '--max-bytes': 'maxBytes', '--timeout-ms': 'timeoutMs' };
  for (let i = 1; i < argv.length; i++) {
    if (argv[i] === '--all') { if (options.all) throw new Error(HELP); options.all = true; continue; }
    const key = flags[argv[i]];
    if (!key || Object.hasOwn(options, key) || argv[i + 1] === undefined || argv[i + 1].startsWith('--')) throw new Error(HELP);
    options[key] = argv[++i];
  }
  return options;
}
export async function runS3(input, { env = process.env, emit = value => process.stdout.write(`${JSON.stringify(value)}\n`) } = {}) {
  if (input.help) { process.stdout.write(HELP); return; }
  const { command } = input;
  if (!['connections', 'list', 'download'].includes(command)) throw new Error(HELP);
  const origin = originFor(env.DESIRECORE_URL);
  if (typeof env.DESIRECORE_TOKEN !== 'string' || !env.DESIRECORE_TOKEN.trim()) throw new Error('Set DESIRECORE_TOKEN.');
  const allowed = new Set(['command', 'help', 'timeoutMs', ...(command === 'list' ? ['connectionId', 'prefix', 'delimiter', 'maxKeys', 'continuationToken', 'all', 'maxPages'] : command === 'download' ? ['connectionId', 'key', 'mode', 'expiresIn', 'output', 'maxBytes'] : [])]);
  if (Object.keys(input).some(key => !allowed.has(key))) throw new Error('An option does not apply to this command.');
  const connectionId = command === 'connections' ? undefined : input.connectionId ?? env.DESIRECORE_S3_CONNECTION_ID;
  if (connectionId !== undefined && (typeof connectionId !== 'string' || !connectionId)) throw new Error('Use a nonempty connection ID returned by this instance.');
  const timeoutMs = integer(input.timeoutMs, 'timeoutMs', 10_000, 1, 600_000);
  const maxKeys = integer(input.maxKeys, 'maxKeys', 100, 1, 1000);
  const maxPages = integer(input.maxPages, 'maxPages', 100, 1, 10000);
  const expiresIn = integer(input.expiresIn, 'expiresIn', 3600, 60, 604800);
  const maxBytes = integer(input.maxBytes, 'maxBytes', 104857600);
  const mode = input.mode ?? 'link';
  if (command === 'download' && (typeof input.key !== 'string' || !input.key || !['link', 'binary'].includes(mode))) throw new Error('Download requires --key and mode link or binary.');
  if (command === 'download' && (mode === 'binary' ? !input.output || input.expiresIn !== undefined : input.output !== undefined || input.maxBytes !== undefined)) throw new Error('Binary mode requires --output and accepts --max-bytes; link mode accepts --expires-in.');
  if (input.maxPages !== undefined && !input.all) throw new Error('--max-pages requires --all.');
  async function request(path) {
    return fetch(origin + path, { headers: { 'X-Agent-Service-Token': env.DESIRECORE_TOKEN }, redirect: 'error', signal: AbortSignal.timeout(timeoutMs) });
  }
  async function json(response) {
    if (!response.headers.get('content-type')?.toLowerCase().includes('application/json')) throw new Error(`HTTP ${response.status}: expected JSON from the instance API.`);
    let value;
    try { value = await response.json(); } catch { throw new Error(`HTTP ${response.status}: invalid JSON from the instance API.`); }
    if (!response.ok) {
      const code = typeof value?.code === 'string' && /^[A-Za-z0-9_-]{1,100}$/.test(value.code) ? ` ${value.code}` : '';
      throw new Error(`Object-storage read rejected: HTTP ${response.status}${code}`);
    }
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Expected an API response object.');
    return value;
  }
  const metadata = await json(await request('/api/client-handshake'));
  if (metadata.service !== 'desirecore-agent-service' || metadata.apiProtocolVersion !== '1' || typeof metadata.instanceId !== 'string' || !metadata.instanceId) throw new Error('The handshake did not identify a compatible DesireCore instance.');
  const query = new URLSearchParams();
  if (connectionId !== undefined) query.set('connection_id', connectionId);
  const suffix = () => query.size ? `?${query}` : '';
  if (command === 'connections') {
    const data = await json(await request('/api/s3/connections'));
    if (data.success !== true || !Array.isArray(data.connections)) throw new Error('Invalid connection summary.');
    emit({ kind: command, instanceId: metadata.instanceId, data });
  } else if (command === 'list') {
    query.set('max_keys', String(maxKeys));
    for (const [key, value] of Object.entries({ prefix: input.prefix, delimiter: input.delimiter, continuation_token: input.continuationToken })) if (value !== undefined) query.set(key, value);
    const seen = new Set(input.continuationToken ? [input.continuationToken] : []);
    for (let page = 1; ; page++) {
      const data = await json(await request('/api/s3/list' + suffix()));
      if (data.success !== true || !Array.isArray(data.objects) || !Array.isArray(data.common_prefixes) || typeof data.is_truncated !== 'boolean') throw new Error('Invalid object list.');
      emit({ kind: command, instanceId: metadata.instanceId, page, data });
      if (!input.all || !data.is_truncated) break;
      const next = data.next_continuation_token;
      if (typeof next !== 'string' || !next || seen.has(next)) throw new Error('Missing or repeated continuation token; stop rather than loop.');
      if (page >= maxPages) throw new Error('Reached --max-pages with more results remaining; output is partial.');
      seen.add(next); query.set('continuation_token', next);
    }
  } else {
    query.set('key', input.key); query.set('mode', mode);
    if (mode === 'link') {
      query.set('expires_in', String(expiresIn));
      const data = await json(await request('/api/s3/download' + suffix()));
      if (data.success !== true || !['public', 'presigned'].includes(data.url_type) || typeof data.download_url !== 'string') throw new Error('Invalid download link response.');
      emit({ kind: 'download-link', instanceId: metadata.instanceId, data });
      return;
    }
    const response = await request('/api/s3/download' + suffix());
    if (!response.ok) { await json(response); return; }
    if (!response.body) throw new Error('Binary response has no body.');
    const advertised = response.headers.get('content-length');
    if (advertised !== null && Number(advertised) > maxBytes) { await response.body.cancel(); throw new Error('Binary response exceeds --max-bytes.'); }
    let file;
    let bytes = 0;
    try {
      file = await open(resolve(input.output), 'wx', 0o600);
      for await (const chunk of response.body) {
        bytes += chunk.byteLength;
        if (bytes > maxBytes) throw new Error('Binary response exceeds --max-bytes.');
        await file.writeFile(chunk);
      }
      await file.close(); file = undefined;
    } catch (error) {
      await response.body.cancel().catch(() => {});
      if (file) { await file.close(); await unlink(resolve(input.output)); }
      throw error;
    }
    emit({ kind: 'download-binary', instanceId: metadata.instanceId, output: resolve(input.output), bytes, contentType: response.headers.get('content-type') });
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  runS3(parseS3Args(process.argv.slice(2))).catch(error => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });
}
