#!/usr/bin/env node
// Read an administrator-provided DesireCore instance. Node.js 22+, no packages required.
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const HELP = `Usage:
  node history.mjs list [--agent-id ID] [--include-archived] [--all-pages]
  node history.mjs archived-topics [--all-pages]
  node history.mjs runtime-reference RUN_ID
  node history.mjs session RUN_ID
  node history.mjs messages RUN_ID [--inspect-run] [--all-pages]
  node history.mjs all --agent-id ID [--conversation-id ID] [--order asc|desc] [--all-pages]
  node history.mjs search --agent-id ID [--query TEXT] [--type all|image|file|tool] [--all-pages]
  node history.mjs overview --agent-id ID
  node history.mjs matter MATTER_ID --agent-id ID

Environment: DESIRECORE_URL, DESIRECORE_TOKEN, optional DESIRECORE_AGENT_ID.
Pagination: --offset 0; --limit defaults to list=20, messages/all=100, search/archived-topics=50.
all accepts --limit 0 (metadata only), --preferred-run-id ID, --expected-revision h1:HASH,
and --max-restarts 1. A later offset requires --expected-revision. Revision conflicts
discard buffered pages and restart all-pages reads at 0; no execution is replayed.
Search accepts --limit 0 (all remaining hits), --preferred-run-id ID, and
--preview-chars 1..8000. --all-pages is bounded by --max-pages 20 per attempt.
HTTP: --timeout-ms 10000. Remote origins must use HTTPS.
Output: one JSON record per page; history may contain private conversation data.
Exit: 0 requested reads succeeded; 1 request/configuration failed;
2 an all-pages read stopped early or a matter response was truncated.
Only all checks the public view revision; it is not a persistent snapshot or backup.
`;

const PAGED = new Set(['list', 'messages', 'search', 'all', 'archived-topics']);
const NUMERIC = new Set(['limit', 'offset', 'maxPages', 'maxRestarts', 'timeoutMs', 'previewChars']);
const REVISION = /^h1:[0-9a-f]{64}$/;
const VALUES = new Map([
  ['--agent-id', 'agentId'], ['--limit', 'limit'], ['--offset', 'offset'],
  ['--query', 'query'], ['--type', 'type'], ['--preferred-run-id', 'preferredRunId'],
  ['--preview-chars', 'previewChars'], ['--max-pages', 'maxPages'], ['--timeout-ms', 'timeoutMs'],
  ['--conversation-id', 'conversationId'], ['--order', 'order'],
  ['--expected-revision', 'expectedRevision'], ['--max-restarts', 'maxRestarts'],
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
  if (!['list', 'session', 'messages', 'all', 'search', 'overview', 'matter', 'archived-topics', 'runtime-reference'].includes(options.command)) throw new Error(HELP);
  if (options.command === 'archived-topics' && options.agentId !== undefined) throw new Error('archived-topics is owner-wide and does not accept an Agent filter.');
  if (options.command !== 'archived-topics') options.agentId ??= env.DESIRECORE_AGENT_ID;
  if (options.agentId !== undefined) identifier(options.agentId, 'Agent ID');
  if (['all', 'search', 'overview', 'matter'].includes(options.command) && !options.agentId) throw new Error('Set DESIRECORE_AGENT_ID or --agent-id.');
  if (['session', 'messages', 'runtime-reference'].includes(options.command)) identifier(options.id, 'Run ID');
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
  options.limit ??= options.command === 'list' ? 20 : ['messages', 'all'].includes(options.command) ? 100 : 50;
  options.offset ??= 0;
  options.maxPages ??= 20;
  options.maxRestarts ??= 1;
  options.timeoutMs ??= 10_000;
  if ((options.limit === 0 && !['search', 'all'].includes(options.command)) || !Number.isSafeInteger(options.offset + options.limit)) throw new Error('Use a positive limit and a safe offset; only search and all permit limit=0.');
  if (options.command === 'archived-topics' && options.limit > 200) throw new Error('archived-topics limit must be 1..200.');
  if (options.command === 'all') {
    if (options.limit > 1000) throw new Error('all limit must be 0..1000.');
    if (options.expectedRevision !== undefined && !REVISION.test(options.expectedRevision)) throw new Error('Use the returned h1: revision as --expected-revision.');
    if (options.offset > 0 && options.expectedRevision === undefined) throw new Error('A later all page requires --expected-revision from the same read scope.');
    if (options.order !== undefined && !['asc', 'desc'].includes(options.order)) throw new Error('order must be asc or desc.');
    if (options.conversationId !== undefined && (typeof options.conversationId !== 'string' || !options.conversationId || /[\u0000-\u001f\u007f]/.test(options.conversationId))) throw new Error('Use a nonempty conversation ID.');
  } else if (['conversationId', 'order', 'expectedRevision', 'maxRestarts'].some(key => input[key] !== undefined)) throw new Error('Revision and merged-history options apply only to all.');
  if (options.maxPages < 1 || options.timeoutMs < 1) throw new Error('maxPages and timeoutMs must be positive.');
  if (options.previewChars !== undefined && (options.previewChars < 1 || options.previewChars > 8000)) throw new Error('previewChars must be 1..8000.');
  if (options.type !== undefined && !['all', 'image', 'file', 'tool'].includes(options.type)) throw new Error('type must be all, image, file or tool.');
  if (options.preferredRunId !== undefined) identifier(options.preferredRunId, 'preferred Run ID');
  if (options.includeArchived && options.command !== 'list') throw new Error('--include-archived applies only to list.');
  if (options.inspectRun && options.command !== 'messages') throw new Error('--inspect-run applies only to messages.');
  if (!PAGED.has(options.command) && (options.allPages || input.limit !== undefined || input.offset !== undefined)) throw new Error('This endpoint is not paginated.');
  if (options.command !== 'search' && ['query', 'type', 'previewChars'].some(key => options[key] !== undefined)) throw new Error('Search filters apply only to search.');
  if (!['search', 'all'].includes(options.command) && options.preferredRunId !== undefined) throw new Error('--preferred-run-id applies only to search or all.');
  return options;
}

function endpoint(options, offset, expectedRevision) {
  const query = new URLSearchParams();
  let path;
  if (options.command === 'list') {
    path = '/api/sessions';
    if (options.agentId) query.set('agentId', options.agentId);
    if (options.includeArchived) query.set('includeArchived', 'true');
  } else if (options.command === 'archived-topics') {
    path = '/api/manual-topics/archived';
  } else if (options.command === 'runtime-reference') {
    path = `/api/sessions/${encodeURIComponent(options.id)}/runtime-state`;
  } else if (options.command === 'all') {
    path = '/api/sessions/messages/all';
    query.set('agentId', options.agentId);
    for (const [key, value] of Object.entries({ conversationId: options.conversationId, order: options.order, preferredRunId: options.preferredRunId, expectedRevision })) {
      if (value !== undefined) query.set(key, value);
    }
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
      const code = typeof data?.code === 'string' && /^[A-Za-z0-9_-]{1,100}$/.test(data.code) ? ` ${data.code}` : '';
      const error = new Error(`HTTP ${response.status}: request rejected${code}`);
      error.status = response.status;
      error.code = typeof data?.code === 'string' ? data.code : undefined;
      error.apiError = typeof data?.error === 'string' ? data.error : undefined;
      throw error;
    }
    return data;
  }
  const handshake = await get('/api/client-handshake');
  if (handshake.service !== 'desirecore-agent-service' || handshake.apiProtocolVersion !== '1' || typeof handshake.instanceId !== 'string' || !handshake.instanceId) {
    throw new Error('Unexpected service identity or API protocol; history was not requested.');
  }
  if (options.command === 'all') {
    let offset = options.offset, revision = options.expectedRevision, restarts = 0, buffered = [];
    while (true) {
      let data;
      try { data = await get(endpoint(options, offset, revision)); }
      catch (error) {
        if (error.status !== 409 || error.apiError !== 'history_revision_changed' || !options.allPages) throw error;
        // Nothing from an invalidated attempt has been emitted. Restart only GET reads.
        buffered = [];
        if (restarts >= options.maxRestarts) {
          emit({ kind: 'stopped', reason: 'history-revision-changed', restartOffset: 0, discarded: true });
          return { exitCode: 2, pages: 0, restarts, restartOffset: 0 };
        }
        emit({ kind: 'restarting', reason: 'history-revision-changed', restartOffset: 0, discarded: true });
        restarts++; offset = 0; revision = undefined;
        continue;
      }
      if (!Array.isArray(data?.items) || data.items.length > options.limit || !Number.isSafeInteger(data.total) || data.total < 0
        || typeof data.hasMore !== 'boolean' || !REVISION.test(data.historyRevision)
        || (revision !== undefined && revision !== data.historyRevision)) throw new Error('Unexpected merged history page or revision.');
      revision = data.historyRevision;
      buffered.push({ kind: 'all', instanceId: handshake.instanceId, offset, limit: options.limit, data });
      const nextOffset = offset + options.limit;
      if (!data.hasMore || !options.allPages || options.limit === 0) {
        for (const record of buffered) emit(record);
        return { exitCode: 0, pages: buffered.length, restarts, ...(data.hasMore && options.limit > 0 && { nextOffset, historyRevision: revision }) };
      }
      if (buffered.length >= options.maxPages || !Number.isSafeInteger(nextOffset)) {
        // A bounded partial window is explicitly marked and retains its revision for a later read.
        for (const record of buffered) emit(record);
        emit({ kind: 'stopped', reason: buffered.length >= options.maxPages ? 'max-pages' : 'invalid-next-offset', nextOffset, historyRevision: revision });
        return { exitCode: 2, pages: buffered.length, restarts, nextOffset, historyRevision: revision };
      }
      offset = nextOffset;
    }
  }
  let offset = options.offset, pages = 0, firstTotal;
  while (true) {
    const data = await get(endpoint(options, offset));
    if (!PAGED.has(options.command)) {
      if (options.command === 'runtime-reference' && (data?.runId !== options.id || !Object.hasOwn(data, 'runtimeSession') || (data.runtimeSession !== null && (typeof data.runtimeSession !== 'object' || typeof data.runtimeSession.sessionId !== 'string' || !Number.isSafeInteger(data.runtimeSession.revision) || data.runtimeSession.revision < 1 || !Number.isSafeInteger(data.runtimeSession.scopeEpoch) || data.runtimeSession.scopeEpoch < 0 || !Number.isSafeInteger(data.runtimeSession.scopeSequence) || data.runtimeSession.scopeSequence < 0)))) throw new Error('Invalid recovery reference; do not assume runtimeSession=null.');
      emit({ kind: options.command, instanceId: handshake.instanceId, data });
      return { exitCode: options.command === 'matter' && data?.truncated === true ? 2 : 0, pages: 1 };
    }
    const field = options.command === 'list' ? 'sessions' : ['search', 'archived-topics'].includes(options.command) ? 'items' : 'messages';
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
