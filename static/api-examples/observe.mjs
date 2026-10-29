#!/usr/bin/env node
// Instance diagnostics and explicit owner recovery. Node.js 22+, no packages required.
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const HELP = `Usage:
  node observe.mjs input-config --agent-id ID
  node observe.mjs compute-retry [--timeout-ms 60000]
  node observe.mjs network
  node observe.mjs recent-calls [--limit 30]
  node observe.mjs usage [--since ISO_DATE] [--agent-id ID] [--timezone UTC]
Environment: DESIRECORE_URL, DESIRECORE_TOKEN, optional DESIRECORE_AGENT_ID.
Options: --timeout-ms 10000. Remote origins must use HTTPS.
Output contains private instance metadata. No automatic retry, execution, or billing reconciliation.
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

export function parseObserveArgs(argv) {
  if (argv.includes('--help') || argv.includes('-h')) return { help: true };
  const options = { command: argv[0] };
  const flags = { '--agent-id': 'agentId', '--limit': 'limit', '--since': 'since', '--timezone': 'timezone', '--timeout-ms': 'timeoutMs' };
  for (let i = 1; i < argv.length; i++) {
    const key = flags[argv[i]];
    if (!key || Object.hasOwn(options, key) || !argv[i + 1] || argv[i + 1].startsWith('--')) throw new Error(HELP);
    options[key] = argv[++i];
  }
  return options;
}

export async function runObserve(input, { env = process.env, emit = value => process.stdout.write(`${JSON.stringify(value)}\n`) } = {}) {
  if (input.help) { process.stdout.write(HELP); return; }
  const { command } = input;
  if (!['input-config', 'network', 'recent-calls', 'usage', 'compute-retry'].includes(command)) throw new Error(HELP);
  const origin = originFor(env.DESIRECORE_URL);
  if (typeof env.DESIRECORE_TOKEN !== 'string' || !env.DESIRECORE_TOKEN.trim()) throw new Error('Set DESIRECORE_TOKEN.');
  const allowed = new Set(['command', 'help', 'timeoutMs', ...(command === 'input-config' ? ['agentId'] : command === 'usage' ? ['agentId', 'since', 'timezone'] : command === 'recent-calls' ? ['limit'] : [])]);
  if (Object.keys(input).some(key => !allowed.has(key))) throw new Error('An option does not apply to this command.');
  const agentId = ['input-config', 'usage'].includes(command) ? input.agentId ?? env.DESIRECORE_AGENT_ID : undefined;
  if ((command === 'input-config' && !agentId) || (agentId !== undefined && !/^[A-Za-z0-9_-]+$/.test(agentId))) throw new Error('Use the Agent ID returned by this instance.');
  const integer = (value, label, fallback) => {
    if (value === undefined) return fallback;
    if (!/^[1-9][0-9]*$/.test(String(value)) || !Number.isSafeInteger(Number(value))) throw new Error(`${label} must be a positive decimal safe integer.`);
    return Number(value);
  };
  const timeoutMs = integer(input.timeoutMs, 'timeoutMs', 10_000);
  const limit = integer(input.limit, 'limit', 30);
  if (input.since !== undefined && !/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(input.since)) throw new Error('Use an ISO timestamp with timezone for --since.');
  if (input.since !== undefined && !Number.isFinite(Date.parse(input.since))) throw new Error('Invalid --since timestamp.');
  if (input.timezone !== undefined) {
    try { new Intl.DateTimeFormat('en', { timeZone: input.timezone }); } catch { throw new Error('Use a valid IANA --timezone, for example UTC.'); }
  }
  async function get(path, method = 'GET') {
    const response = await fetch(origin + path, {
      method, headers: { 'X-Agent-Service-Token': env.DESIRECORE_TOKEN },
      redirect: 'error', signal: AbortSignal.timeout(timeoutMs),
    });
    if (!response.headers.get('content-type')?.toLowerCase().includes('application/json')) throw new Error(`HTTP ${response.status}: expected JSON from the instance API.`);
    const value = await response.json();
    if (!response.ok) {
      const code = typeof value?.code === 'string' && /^[A-Za-z0-9_-]{1,100}$/.test(value.code) ? ` ${value.code}` : '';
      throw new Error(`Observation read rejected: HTTP ${response.status}${code}`);
    }
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Expected an API response object.');
    return value;
  }
  const metadata = await get('/api/client-handshake');
  if (metadata.service !== 'desirecore-agent-service' || metadata.apiProtocolVersion !== '1' || typeof metadata.instanceId !== 'string' || !metadata.instanceId) throw new Error('The handshake did not identify a compatible DesireCore instance.');
  const query = new URLSearchParams();
  let path;
  if (command === 'input-config') path = `/api/agents/${encodeURIComponent(agentId)}/input-config`;
  else if (command === 'network') path = '/api/network/health';
  else if (command === 'recent-calls') { path = '/api/runs/recent-calls'; query.set('limit', String(limit)); }
  else if (command === 'compute-retry') path = '/api/compute/preparation/retry';
  else {
    path = '/api/runs/usage/summary';
    for (const [key, value] of Object.entries({ since: input.since, agentId, timezone: input.timezone })) if (value !== undefined) query.set(key, value);
  }
  const data = await get(path + (query.size ? `?${query}` : ''), command === 'compute-retry' ? 'POST' : 'GET');
  if (command === 'compute-retry' && data.status !== 'ready') throw new Error('Compute preparation is not confirmed ready.');
  if (command === 'input-config' && (data.version !== 1 || data.agentId !== agentId || typeof data.manual !== 'boolean' || !/^[0-9a-f]{64}$/.test(data.configRevision))) throw new Error('Invalid input configuration; do not assume manual=false.');
  if (command === 'network' && (!['online', 'degraded', 'offline', 'unknown'].includes(data.status) || !Number.isFinite(data.seq) || data.seq < 0 || typeof data.since !== 'string' || typeof data.reason !== 'string')) throw new Error('Invalid network observation.');
  if (command === 'recent-calls' && !Array.isArray(data.calls)) throw new Error('Invalid recent calls observation.');
  if (command === 'usage' && (!data.total || ['byModel', 'byDate', 'byAgent'].some(key => !Array.isArray(data[key])))) throw new Error('Invalid usage observation.');
  emit({ kind: command, instanceId: metadata.instanceId, data });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  runObserve(parseObserveArgs(process.argv.slice(2))).catch(error => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });
}
