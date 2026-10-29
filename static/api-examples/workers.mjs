#!/usr/bin/env node
// Worker public records. Node.js 22+, no dependencies. Records may contain private conversation data.
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const HELP = `Usage:
  node workers.mjs list --run-id ID
  node workers.mjs transcript --run-id ID --worker-id ID [--offset 0] [--limit 500] [--all-pages] [--max-pages 20]
Environment: DESIRECORE_URL, DESIRECORE_TOKEN. Options: --timeout-ms 10000.
Reads only. Offsets count valid entries, never seq or folded messages. No automatic retry or execution.
`;
export function parseWorkerArgs(argv) {
  if (argv.includes('--help') || argv.includes('-h')) return { help: true };
  const result = { command: argv[0] };
  const flags = { '--run-id': 'runId', '--worker-id': 'workerId', '--offset': 'offset', '--limit': 'limit', '--max-pages': 'maxPages', '--timeout-ms': 'timeoutMs' };
  for (let i = 1; i < argv.length; i++) {
    if (argv[i] === '--all-pages' && !result.allPages) { result.allPages = true; continue; }
    const key = flags[argv[i]];
    if (!key || Object.hasOwn(result, key) || !argv[i + 1] || argv[i + 1].startsWith('--')) throw new Error(HELP);
    result[key] = argv[++i];
  }
  return result;
}
export async function runWorkers(input, { env = process.env, emit = data => process.stdout.write(JSON.stringify(data) + '\n') } = {}) {
  if (input.help) { process.stdout.write(HELP); return { exitCode: 0 }; }
  const transcript = input.command === 'transcript';
  if (!transcript && input.command !== 'list') throw new Error(HELP);
  const allowed = new Set(['command', 'help', 'runId', 'timeoutMs', ...(transcript ? ['workerId', 'offset', 'limit', 'allPages', 'maxPages'] : [])]);
  if (Object.keys(input).some(k => !allowed.has(k))) throw new Error('An option does not apply to this command.');
  for (const key of ['runId', ...(transcript ? ['workerId'] : [])]) if (typeof input[key] !== 'string' || !/^[A-Za-z0-9_-]+$/.test(input[key]) || (key === 'workerId' && input[key] === 'index')) throw new Error(`Use the ${key} returned by the instance.`);
  let origin;
  try {
    const u = new URL(env.DESIRECORE_URL);
    if (u.username || u.password || u.pathname !== '/' || u.search || u.hash || (u.protocol !== 'https:' && !(u.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(u.hostname)))) throw new Error();
    origin = u.origin;
  } catch { throw new Error('Use an HTTPS instance origin; HTTP is accepted only on loopback.'); }
  if (!env.DESIRECORE_TOKEN?.trim() || /[\r\n]/.test(env.DESIRECORE_TOKEN)) throw new Error('Set DESIRECORE_TOKEN to an existing owner token.');
  const integer = (value, fallback, min, max, label) => {
    if (value === undefined) return fallback;
    if (!/^(0|[1-9][0-9]*)$/.test(String(value)) || !Number.isSafeInteger(Number(value)) || Number(value) < min || Number(value) > max) throw new Error(`Invalid ${label}.`);
    return Number(value);
  };
  const limit = integer(input.limit, 500, 1, 2000, 'limit');
  let offset = integer(input.offset, 0, 0, Number.MAX_SAFE_INTEGER, 'offset');
  const maxPages = integer(input.maxPages, 20, 1, 10000, 'maxPages');
  const timeout = integer(input.timeoutMs, 10000, 1, 600000, 'timeoutMs');
  async function get(path) {
    let response;
    try { response = await fetch(origin + path, { headers: { 'X-Agent-Service-Token': env.DESIRECORE_TOKEN }, redirect: 'error', signal: AbortSignal.timeout(timeout) }); }
    catch { throw new Error('Worker read failed or timed out; no retry was made.'); }
    if (!response.headers.get('content-type')?.toLowerCase().includes('application/json')) throw new Error(`HTTP ${response.status}: expected JSON.`);
    const data = await response.json();
    if (!response.ok) throw new Error(`Worker read rejected: HTTP ${response.status}`);
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Expected a Worker response object.');
    return data;
  }
  const handshake = await get('/api/client-handshake');
  if (handshake.service !== 'desirecore-agent-service' || handshake.apiProtocolVersion !== '1' || typeof handshake.instanceId !== 'string' || !handshake.instanceId) throw new Error('Unexpected instance identity.');
  const base = `/api/runs/${encodeURIComponent(input.runId)}/workers`;
  if (!transcript) {
    const data = await get(base);
    if (data.run_id !== input.runId || !Array.isArray(data.workers)) throw new Error('Invalid Worker list.');
    emit({ kind: 'workers', instanceId: handshake.instanceId, data });
    return { exitCode: 0, pages: 1 };
  }
  let firstTotal, pages = 0;
  while (true) {
    const data = await get(`${base}/${encodeURIComponent(input.workerId)}/transcript?${new URLSearchParams({ offset: String(offset), limit: String(limit) })}`);
    if (data.run_id !== input.runId || data.workerId !== input.workerId || typeof data.status !== 'string' || !Array.isArray(data.entries)
      || data.entries.length > limit || !Number.isSafeInteger(data.total) || data.total < 0 || data.offset !== offset || data.limit !== limit || typeof data.truncated !== 'boolean') throw new Error('Invalid Worker transcript page.');
    if (firstTotal !== undefined && firstTotal !== data.total) {
      emit({ kind: 'stopped', reason: 'worker-total-changed', observedTotal: data.total, previousTotal: firstTotal, nextOffset: offset });
      return { exitCode: 2, pages, nextOffset: offset };
    }
    firstTotal ??= data.total;
    emit({ kind: 'transcript', instanceId: handshake.instanceId, data });
    pages++;
    const nextOffset = offset + limit;
    if (!input.allPages || nextOffset >= data.total) return { exitCode: 0, pages, ...(nextOffset < data.total && { nextOffset }) };
    if (pages >= maxPages || !Number.isSafeInteger(nextOffset)) {
      emit({ kind: 'stopped', reason: 'max-pages', nextOffset });
      return { exitCode: 2, pages, nextOffset };
    }
    offset = nextOffset;
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try { process.exitCode = (await runWorkers(parseWorkerArgs(process.argv.slice(2)))).exitCode; }
  catch (error) { process.stderr.write(error.message + '\n'); process.exitCode = 1; }
}
