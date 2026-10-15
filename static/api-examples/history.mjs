#!/usr/bin/env node
// Read an administrator-provided DesireCore instance. Node.js 22+, no packages required.
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const HELP = `Usage:
  node history.mjs list [--agent-id ID] [--include-archived] [--all-pages]
  node history.mjs session RUN_ID
  node history.mjs messages RUN_ID [--inspect-run] [--all-pages]
  node history.mjs search --agent-id ID [--query TEXT] [--type all|image|file|tool] [--all-pages]
  node history.mjs overview --agent-id ID
  node history.mjs matter MATTER_ID --agent-id ID

Environment: DESIRECORE_URL, DESIRECORE_TOKEN, optional DESIRECORE_AGENT_ID.
Pagination: --offset 0; --limit defaults to list=20, messages=100, search=50.
Search alone accepts --limit 0 (all remaining hits), --preferred-run-id ID,
and --preview-chars 1..8000. --all-pages is bounded by --max-pages 20.
HTTP: --timeout-ms 10000. Remote origins must use HTTPS.
Output: one JSON record per page; history may contain private conversation data.
Exit: 0 requested reads succeeded; 1 request/configuration failed;
2 an all-pages read stopped early or a matter response was truncated.
These endpoints do not provide a consistent multi-page history snapshot.
`;

const PAGED = new Set(['list', 'messages', 'search']);
const NUMERIC = new Set(['limit', 'offset', 'maxPages', 'timeoutMs', 'previewChars']);
const VALUES = new Map([
  ['--agent-id', 'agentId'], ['--limit', 'limit'], ['--offset', 'offset'],
  ['--query', 'query'], ['--type', 'type'], ['--preferred-run-id', 'preferredRunId'],
  ['--preview-chars', 'previewChars'], ['--max-pages', 'maxPages'], ['--timeout-ms', 'timeoutMs'],
]);
const FLAGS = new Map([
  ['--all-pages', 'allPages'], ['--include-archived', 'includeArchived'], ['--inspect-run', 'inspectRun'],
]);

export function parseHistoryArgs(argv) {
  if (argv.includes('--help') || argv.includes('-h')) return { help: true };
  const [command, ...args] = argv;
  const options = { command };
  for (let i = 0; i < args.length; i++) {
    const argument = args[i];
    if (FLAGS.has(argument)) options[FLAGS.get(argument)] = true;
    else if (VALUES.has(argument)) {
      if (args[i + 1] === undefined || args[i + 1].startsWith('--')) throw new Error(`Missing value for ${argument}`);
      options[VALUES.get(argument)] = args[++i];
    } else if (!argument.startsWith('-') && !options.id) options.id = argument;
    else throw new Error(`Unknown argument: ${argument}`);
  }
  return options;
}

function originFor(value) {
  let url;
  try { url = new URL(value); } catch { throw new Error('Set DESIRECORE_URL to the instance origin.'); }
  if (url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('DESIRECORE_URL must be an origin without credentials, a path, query, or fragment.');
  }
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))) {
    throw new Error('Use HTTPS remotely; HTTP is accepted only on loopback.');
  }
  return url.origin;
}

function identifier(value, label) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9_-]+$/.test(value)) throw new Error(`Use the server's ${label}, containing letters, digits, hyphens or underscores.`);
  return value;
}

function optionsFor(input, env) {
  const options = { ...input };
  if (!['list', 'session', 'messages', 'search', 'overview', 'matter'].includes(options.command)) throw new Error(HELP);
  options.agentId ??= env.DESIRECORE_AGENT_ID;
  if (options.agentId !== undefined) identifier(options.agentId, 'Agent ID');
  if (['search', 'overview', 'matter'].includes(options.command) && !options.agentId) throw new Error('Set DESIRECORE_AGENT_ID or --agent-id.');
  if (['session', 'messages'].includes(options.command)) identifier(options.id, 'Run ID');
  else if (options.command === 'matter') {
    if (typeof options.id !== 'string' || !options.id || /[\\/\u0000-\u001f\u007f]/.test(options.id) || options.id.includes('..') || options.id === '.') {
      throw new Error('Use a matter ID returned by the conversation overview.');
    }
  } else if (options.id !== undefined) throw new Error('This command does not take a positional ID.');
  for (const key of NUMERIC) {
    if (options[key] !== undefined) {
      if (typeof options[key] === 'string' && !/^(0|[1-9][0-9]*)$/.test(options[key])) throw new Error(`Invalid ${key}: use a decimal integer.`);
      options[key] = Number(options[key]);
      if (!Number.isSafeInteger(options[key]) || options[key] < 0) throw new Error(`Invalid ${key}.`);
    }
  }
  options.limit ??= options.command === 'list' ? 20 : options.command === 'messages' ? 100 : 50;
  options.offset ??= 0;
  options.maxPages ??= 20;
  options.timeoutMs ??= 10_000;
  if ((options.limit === 0 && options.command !== 'search') || !Number.isSafeInteger(options.offset + options.limit)) throw new Error('Use a positive limit and a safe offset; only search permits limit=0.');
  if (options.maxPages < 1 || options.timeoutMs < 1) throw new Error('maxPages and timeoutMs must be positive.');
  if (options.previewChars !== undefined && (options.previewChars < 1 || options.previewChars > 8000)) throw new Error('previewChars must be 1..8000.');
  if (options.type !== undefined && !['all', 'image', 'file', 'tool'].includes(options.type)) throw new Error('type must be all, image, file or tool.');
  if (options.preferredRunId !== undefined) identifier(options.preferredRunId, 'preferred Run ID');
  if (options.includeArchived && options.command !== 'list') throw new Error('--include-archived applies only to list.');
  if (options.inspectRun && options.command !== 'messages') throw new Error('--inspect-run applies only to messages.');
  if (!PAGED.has(options.command) && (options.allPages || input.limit !== undefined || input.offset !== undefined)) throw new Error('This endpoint is not paginated.');
  if (options.command !== 'search' && ['query', 'type', 'preferredRunId', 'previewChars'].some(key => options[key] !== undefined)) throw new Error('Search filters apply only to search.');
  return options;
}

function endpoint(options, offset) {
  const query = new URLSearchParams();
  let path;
  if (options.command === 'list') {
    path = '/api/sessions';
    if (options.agentId) query.set('agentId', options.agentId);
    if (options.includeArchived) query.set('includeArchived', 'true');
  } else if (options.command === 'search') {
    path = '/api/sessions/messages/search';
    query.set('agentId', options.agentId);
    for (const [key, value] of Object.entries({ q: options.query, type: options.type, preferredRunId: options.preferredRunId, previewChars: options.previewChars })) {
      if (value !== undefined) query.set(key, String(value));
    }
  } else if (options.command === 'overview') path = `/api/conversation/${encodeURIComponent(options.agentId)}/overview`;
  else if (options.command === 'matter') path = `/api/conversation/${encodeURIComponent(options.agentId)}/matters/${encodeURIComponent(options.id)}/full`;
  else {
    path = `/api/sessions/${encodeURIComponent(options.id)}${options.command === 'messages' ? '/messages' : ''}`;
    if (options.inspectRun) query.set('view', 'inspect-run');
  }
  if (PAGED.has(options.command)) { query.set('offset', String(offset)); query.set('limit', String(options.limit)); }
  return path + (query.size ? `?${query}` : '');
}

export async function runHistory(input, env = process.env, output = {}) {
  const options = optionsFor(input, env);
  const origin = originFor(env.DESIRECORE_URL);
  const token = env.DESIRECORE_TOKEN;
  if (typeof token !== 'string' || !token || /[\r\n]/.test(token)) throw new Error('Set DESIRECORE_TOKEN to an existing single-line instance access token.');
  const emit = output.emit ?? (record => process.stdout.write(`${JSON.stringify(record)}\n`));
  async function get(path) {
    let response;
    try {
      response = await fetch(origin + path, {
        method: 'GET', redirect: 'error', signal: AbortSignal.timeout(options.timeoutMs),
        headers: { 'X-Agent-Service-Token': token, Accept: 'application/json' },
      });
    } catch { throw new Error('HTTP request failed or timed out; no automatic retry was made.'); }
    if (!response.headers.get('content-type')?.includes('application/json')) throw new Error(`HTTP ${response.status}: expected a JSON API response.`);
    let data;
    try { data = await response.json(); } catch { throw new Error(`HTTP ${response.status}: invalid JSON response.`); }
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${typeof data?.error === 'string' ? data.error : 'request rejected'}`);
      error.status = response.status;
      error.code = typeof data?.code === 'string' ? data.code : undefined;
      throw error;
    }
    return data;
  }
  const handshake = await get('/api/client-handshake');
  if (handshake.service !== 'desirecore-agent-service' || handshake.apiProtocolVersion !== '1' || typeof handshake.instanceId !== 'string' || !handshake.instanceId) {
    throw new Error('Unexpected service identity or API protocol; history was not requested.');
  }
  let offset = options.offset, pages = 0, firstTotal;
  while (true) {
    const data = await get(endpoint(options, offset));
    if (!PAGED.has(options.command)) {
      emit({ kind: options.command, instanceId: handshake.instanceId, data });
      return { exitCode: options.command === 'matter' && data?.truncated === true ? 2 : 0, pages: 1 };
    }
    const field = options.command === 'list' ? 'sessions' : options.command === 'search' ? 'items' : 'messages';
    if (!Array.isArray(data?.[field]) || !Number.isSafeInteger(data.total) || data.total < 0
      || (options.command !== 'messages' && typeof data.hasMore !== 'boolean')) throw new Error('Unexpected history page response.');
    if (firstTotal !== undefined && data.total !== firstTotal) {
      emit({ kind: 'stopped', reason: 'history-total-changed', offset, nextOffset: offset, previousTotal: firstTotal, observedTotal: data.total });
      return { exitCode: 2, pages, nextOffset: offset };
    }
    firstTotal ??= data.total;
    pages++;
    const hasMore = options.command === 'messages' ? offset + options.limit < data.total : data.hasMore;
    const nextOffset = offset + options.limit;
    emit({ kind: options.command, instanceId: handshake.instanceId, offset, limit: options.limit, data });
    if (!hasMore || !options.allPages) return { exitCode: 0, pages, ...(hasMore && { nextOffset }) };
    if (pages >= options.maxPages || options.limit === 0 || !Number.isSafeInteger(nextOffset)) {
      emit({ kind: 'stopped', reason: pages >= options.maxPages ? 'max-pages' : 'invalid-next-offset', nextOffset });
      return { exitCode: 2, pages, nextOffset };
    }
    // Consume the requested source window even if bad rows were omitted from a messages page.
    offset = nextOffset;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const options = parseHistoryArgs(process.argv.slice(2));
    if (options.help) process.stdout.write(HELP);
    else process.exitCode = (await runHistory(options)).exitCode;
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
