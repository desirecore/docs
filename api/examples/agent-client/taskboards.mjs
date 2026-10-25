#!/usr/bin/env node
// TaskBoard reads. Node.js 22+, no packages required. Output may contain private task content.
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const HELP = `Usage:
  node taskboards.mjs list
  node taskboards.mjs query [--filter '{"statuses":["pending"]}'] [--sort '{"field":"updatedAt","direction":"desc"}'] [--page-size 50]
  node taskboards.mjs board --board-id ID
  node taskboards.mjs task --board-id ID --task-id ID
  node taskboards.mjs handoff --board-id ID [--task-id ID]
  node taskboards.mjs activity --board-id ID --task-id ID [--page-size 50]
  node taskboards.mjs resolve --run-id ID [--session-id ID]
Environment: DESIRECORE_URL, DESIRECORE_TOKEN.
Options: --timeout-ms 10000; query/activity: --max-pages 100.
Remote origins must use HTTPS. Reads only; no automatic retry or mutation.
`;

export function parseTaskboardsArgs(argv) {
  if (argv.includes('--help') || argv.includes('-h')) return { help: true };
  const input = { command: argv[0] };
  const flags = { '--board-id': 'boardId', '--task-id': 'taskId', '--run-id': 'runId', '--session-id': 'sessionId', '--filter': 'filter', '--sort': 'sort', '--page-size': 'pageSize', '--max-pages': 'maxPages', '--timeout-ms': 'timeoutMs' };
  for (let i = 1; i < argv.length; i++) {
    const key = flags[argv[i]];
    if (!key || Object.hasOwn(input, key) || !argv[i + 1] || argv[i + 1].startsWith('--')) throw new Error(HELP);
    input[key] = argv[++i];
  }
  return input;
}

export async function runTaskboards(input, { env = process.env, emit = value => process.stdout.write(`${JSON.stringify(value)}\n`) } = {}) {
  if (input.help) { process.stdout.write(HELP); return; }
  const options = {
    list: [], query: ['filter', 'sort', 'pageSize', 'maxPages'], board: ['boardId'], task: ['boardId', 'taskId'],
    handoff: ['boardId', 'taskId'], activity: ['boardId', 'taskId', 'pageSize', 'maxPages'], resolve: ['runId', 'sessionId'],
  };
  if (!Object.hasOwn(options, input.command)) throw new Error(HELP);
  if (Object.keys(input).some(key => !['command', 'help', 'timeoutMs', ...options[input.command]].includes(key))) throw new Error('An option does not apply to this command.');
  let origin;
  try {
    const url = new URL(env.DESIRECORE_URL);
    if (url.username || url.password || url.pathname !== '/' || url.search || url.hash || (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)))) throw new Error();
    origin = url.origin;
  } catch { throw new Error('Set DESIRECORE_URL to an HTTPS origin; HTTP is allowed only on loopback.'); }
  if (typeof env.DESIRECORE_TOKEN !== 'string' || !env.DESIRECORE_TOKEN.trim()) throw new Error('Set DESIRECORE_TOKEN.');
  const integer = (value, fallback, max, label) => {
    if (value === undefined) return fallback;
    if (!/^[1-9][0-9]*$/.test(String(value)) || !Number.isSafeInteger(Number(value)) || Number(value) > max) throw new Error(`${label} must be a positive decimal integer no greater than ${max}.`);
    return Number(value);
  };
  const timeoutMs = integer(input.timeoutMs, 10000, 2147483647, 'timeoutMs');
  const maxPages = integer(input.maxPages, 100, 10000, 'maxPages');
  const pageSize = integer(input.pageSize, 50, input.command === 'activity' ? 100 : 200, 'pageSize');
  const required = ['board', 'task', 'handoff', 'activity'].includes(input.command) ? ['boardId'] : [];
  if (['task', 'activity'].includes(input.command)) required.push('taskId');
  for (const key of ['boardId', 'taskId']) if ((required.includes(key) && !input[key]) || (input[key] !== undefined && (typeof input[key] !== 'string' || !input[key].trim() || input[key].length > 256 || /[\/\\\u0000-\u001f]/.test(input[key]) || ['.', '..'].includes(input[key])))) throw new Error(`Use the ${key} returned by the instance.`);
  for (const key of ['runId', 'sessionId']) if (input[key] !== undefined && !/^[A-Za-z0-9][A-Za-z0-9._:-]{0,255}$/.test(input[key])) throw new Error(`Invalid ${key}.`);
  if (input.command === 'resolve' && !input.runId && !input.sessionId) throw new Error('resolve requires --run-id or --session-id.');
  const object = (raw, label) => {
    if (raw === undefined) return undefined;
    let value;
    try { value = typeof raw === 'string' ? JSON.parse(raw) : raw; } catch { throw new Error(`${label} must be a JSON object.`); }
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label} must be a JSON object.`);
    return value;
  };
  const filter = object(input.filter, 'filter'), sort = object(input.sort, 'sort');
  async function read(path, body) {
    const response = await fetch(origin + path, { method: body === undefined ? 'GET' : 'POST', headers: { 'X-Agent-Service-Token': env.DESIRECORE_TOKEN, ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) }, body: body === undefined ? undefined : JSON.stringify(body), redirect: 'error', signal: AbortSignal.timeout(timeoutMs) });
    if (!response.headers.get('content-type')?.toLowerCase().includes('application/json')) throw new Error(`HTTP ${response.status}: expected JSON from the instance API.`);
    const data = await response.json();
    if (!response.ok || data?.ok === false) {
      const rawCode = data?.error?.code ?? data?.code;
      const code = typeof rawCode === 'string' && /^[A-Za-z0-9_-]{1,100}$/.test(rawCode) ? ` ${rawCode}` : '';
      throw new Error(`TaskBoard read rejected: HTTP ${response.status}${code}${response.status === 409 ? '; discard these pages and restart from the first page.' : ''}`);
    }
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Expected a TaskBoard response object.');
    return data;
  }
  const metadata = await read('/api/client-handshake');
  if (metadata.service !== 'desirecore-agent-service' || metadata.apiProtocolVersion !== '1' || typeof metadata.instanceId !== 'string' || !metadata.instanceId) throw new Error('The handshake did not identify a compatible DesireCore instance.');
  const base = `/api/taskboards/${encodeURIComponent(input.boardId ?? '')}`;
  let data;
  if (input.command === 'query' || input.command === 'activity') {
    const pages = [];
    let cursor, afterRevision = 0, throughRevision;
    const seen = new Set();
    for (let count = 0; ; count++) {
      if (count >= maxPages) throw new Error('maxPages reached; no partial result was emitted. Increase --max-pages and restart.');
      if (input.command === 'query') {
        const page = await read('/api/taskboards/query', { ...(filter === undefined ? {} : { filter }), ...(sort === undefined ? {} : { sort }), pageSize, ...(cursor === undefined ? {} : { cursor }) });
        if (page.schemaVersion !== 3 || !Array.isArray(page.items) || typeof page.hasMore !== 'boolean') throw new Error('Invalid TaskBoard query response.');
        pages.push(page);
        if (!page.hasMore) break;
        if (typeof page.nextCursor !== 'string' || !page.nextCursor || seen.has(page.nextCursor)) throw new Error('Missing or repeated query cursor; no partial result was emitted.');
        cursor = page.nextCursor; seen.add(cursor);
      } else {
        const query = new URLSearchParams({ pageSize: String(pageSize), afterRevision: String(afterRevision), ...(throughRevision === undefined ? {} : { throughRevision: String(throughRevision) }) });
        const page = await read(`${base}/tasks/${encodeURIComponent(input.taskId)}/activity?${query}`);
        if (page.schemaVersion !== 1 || !Array.isArray(page.items) || !page.page || !Number.isSafeInteger(page.page.throughRevision) || page.page.throughRevision < 1 || page.page.afterRevision !== afterRevision) throw new Error('Invalid Task activity page.');
        if (throughRevision !== undefined && page.page.throughRevision !== throughRevision) throw new Error('Task activity history prefix changed; no partial result was emitted.');
        throughRevision = page.page.throughRevision;
        pages.push(page);
        const next = page.page.nextAfterRevision;
        if (next === null) break;
        if (!Number.isSafeInteger(next) || next <= afterRevision || next > throughRevision) throw new Error('Task activity page did not advance; no partial result was emitted.');
        afterRevision = next;
      }
    }
    data = { pages };
  } else {
    const paths = { list: '/api/taskboards', board: base, task: `${base}/tasks/${encodeURIComponent(input.taskId ?? '')}`, handoff: `${base}/activity${input.taskId ? `?${new URLSearchParams({ taskId: input.taskId })}` : ''}`, resolve: '/api/taskboards/session-board/resolve' };
    data = await read(paths[input.command], input.command === 'resolve' ? { ...(input.runId ? { runId: input.runId } : {}), ...(input.sessionId ? { sessionId: input.sessionId } : {}) } : undefined);
    if (input.command === 'list' ? data.schemaVersion !== 3 || !Array.isArray(data.boards) : input.command === 'handoff' ? !Array.isArray(data.evidence) : data.schemaVersion !== 3 || typeof data.exists !== 'boolean') throw new Error('Invalid TaskBoard read response.');
  }
  emit({ kind: input.command, instanceId: metadata.instanceId, data });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  runTaskboards(parseTaskboardsArgs(process.argv.slice(2))).catch(error => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });
}
