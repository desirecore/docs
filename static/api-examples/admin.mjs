#!/usr/bin/env node
// Explicit owner management actions. Node.js 22+, no packages required. No automatic write retry.
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const HELP = `Usage:
  node admin.mjs archives
  node admin.mjs restore-team --archive-id ID [--new-name NAME] [--supervisor AGENT_ID]
  node admin.mjs bind-workflow --workflow-id ID --request ./binding.json
Environment: DESIRECORE_URL, DESIRECORE_TOKEN (standalone deployment owner).
Options: --timeout-ms 30000. Writes require an explicit command; no retry or implicit execution.
A timeout leaves the outcome unknown. Keep the binding request and idempotency key unchanged.
`;
export function parseAdminArgs(argv) {
  if (argv.includes('--help') || argv.includes('-h')) return { help: true };
  const input = { command: argv[0] };
  const flags = { '--archive-id': 'archiveId', '--new-name': 'newName', '--supervisor': 'supervisor', '--workflow-id': 'workflowId', '--request': 'requestFile', '--timeout-ms': 'timeoutMs' };
  for (let i = 1; i < argv.length; i++) {
    const key = flags[argv[i]];
    if (!key || Object.hasOwn(input, key) || !argv[i + 1] || argv[i + 1].startsWith('--')) throw new Error(HELP);
    input[key] = argv[++i];
  }
  return input;
}
export async function runAdmin(input, { env = process.env, emit = value => process.stdout.write(JSON.stringify(value) + '\n') } = {}) {
  if (input.help) { process.stdout.write(HELP); return; }
  const scope = { archives: [], 'restore-team': ['archiveId', 'newName', 'supervisor'], 'bind-workflow': ['workflowId', 'requestFile'] };
  if (!Object.hasOwn(scope, input.command)) throw new Error(HELP);
  if (Object.keys(input).some(k => !['command', 'help', 'timeoutMs', ...scope[input.command]].includes(k))) throw new Error('An option does not apply to this command.');
  let origin;
  try {
    const u = new URL(env.DESIRECORE_URL);
    if (u.username || u.password || u.pathname !== '/' || u.search || u.hash || (u.protocol !== 'https:' && !(u.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(u.hostname)))) throw new Error();
    origin = u.origin;
  } catch { throw new Error('Use an HTTPS instance origin; HTTP is accepted only on loopback.'); }
  if (!env.DESIRECORE_TOKEN?.trim() || /[\r\n]/.test(env.DESIRECORE_TOKEN)) throw new Error('Set DESIRECORE_TOKEN to the deployment owner credential.');
  const timeout = input.timeoutMs ?? 30000;
  if (!/^[1-9][0-9]*$/.test(String(timeout)) || !Number.isSafeInteger(Number(timeout)) || Number(timeout) > 600000) throw new Error('timeoutMs must be 1..600000.');
  const id = (value, label) => {
    if (typeof value !== 'string' || !value.trim() || value.length > 512 || /[\/\\\u0000-\u001f\u007f]/.test(value) || value.includes('..') || value === '.') throw new Error(`Use the ${label} returned by the instance.`);
    return value;
  };
  let body, path = '/api/team-archive';
  if (input.command === 'restore-team') {
    path += `/${encodeURIComponent(id(input.archiveId, 'archive ID'))}/restore`;
    body = {};
    for (const k of ['newName', 'supervisor']) if (input[k] !== undefined) {
      if (typeof input[k] !== 'string' || !input[k].trim()) throw new Error(`${k} must be nonempty.`);
      body[k] = input[k];
    }
  } else if (input.command === 'bind-workflow') {
    path = `/api/workflow-definitions/${encodeURIComponent(id(input.workflowId, 'Workflow ID'))}/taskboard-bindings`;
    if (typeof input.requestFile !== 'string' || !input.requestFile) throw new Error('bind-workflow requires --request.');
    const info = await stat(input.requestFile);
    if (!info.isFile() || info.size > 16384) throw new Error('Use a JSON request file no larger than 16 KiB.');
    const raw = await readFile(input.requestFile);
    if (raw.length > 16384) throw new Error('Binding request exceeds 16 KiB.');
    try { body = JSON.parse(raw.toString('utf8')); } catch { throw new Error('Invalid binding request JSON.'); }
    const keys = ['resourceRef', 'workflowRef', 'role', 'expectedVersion', 'idempotencyKey'];
    if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).some(k => !keys.includes(k)) || keys.some(k => !Object.hasOwn(body, k))
      || body.workflowRef?.schemaVersion !== 1 || body.workflowRef.resourceType !== 'workflow-definition' || body.workflowRef.workflowId !== input.workflowId
      || body.workflowRef.pin?.mode !== 'exact' || !Number.isSafeInteger(body.workflowRef.pin.definitionRevision) || body.workflowRef.pin.definitionRevision < 1
      || typeof body.workflowRef.pin.contentHash !== 'string' || !/^[a-f0-9]{64}$/.test(body.workflowRef.pin.contentHash)
      || !['reference', 'trigger'].includes(body.role) || !Number.isSafeInteger(body.expectedVersion) || body.expectedVersion < 0
      || typeof body.idempotencyKey !== 'string' || body.idempotencyKey.length < 8 || body.idempotencyKey.length > 256) throw new Error('Use the exact definition ref, current resource version and stable idempotency key supplied for this binding; do not claim an owner.');
    if (Buffer.byteLength(JSON.stringify(body)) > 16384) throw new Error('Binding request exceeds 16 KiB.');
  }
  async function request(target, payload) {
    let response;
    try { response = await fetch(origin + target, { method: payload === undefined ? 'GET' : 'POST', headers: { 'X-Agent-Service-Token': env.DESIRECORE_TOKEN, ...(payload === undefined ? {} : { 'Content-Type': 'application/json' }) }, ...(payload === undefined ? {} : { body: JSON.stringify(payload) }), redirect: 'error', signal: AbortSignal.timeout(Number(timeout)) }); }
    catch { throw new Error('Management request failed or timed out; outcome may be unknown. No automatic retry was made.'); }
    if (!response.headers.get('content-type')?.toLowerCase().includes('application/json')) throw new Error(`HTTP ${response.status}: expected JSON.`);
    const value = await response.json();
    if (!response.ok || value?.success === false) {
      const code = typeof value?.code === 'string' && /^[A-Za-z0-9_-]{1,100}$/.test(value.code) ? ` ${value.code}` : '';
      throw new Error(`Owner operation rejected: HTTP ${response.status}${code}`);
    }
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Expected an owner-operation response object.');
    return value;
  }
  const handshake = await request('/api/client-handshake');
  if (handshake.service !== 'desirecore-agent-service' || handshake.apiProtocolVersion !== '1' || typeof handshake.instanceId !== 'string' || !handshake.instanceId) throw new Error('Unexpected instance identity; no operation was sent.');
  const data = await request(path, body);
  if (input.command === 'archives' && (data.success !== true || !Array.isArray(data.data?.archives))) throw new Error('Invalid archive summary.');
  if (input.command === 'restore-team' && (data.success !== true || typeof data.data?.teamId !== 'string' || !Array.isArray(data.data.warnings))) throw new Error('Invalid restore receipt; inspect current team state before any retry.');
  if (input.command === 'bind-workflow' && (!data.binding || typeof data.binding.bindingId !== 'string' || typeof data.changed !== 'boolean' || !Number.isSafeInteger(data.revision))) throw new Error('Invalid binding receipt; preserve the same request identity.');
  emit({ kind: input.command, instanceId: handshake.instanceId, data });
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  runAdmin(parseAdminArgs(process.argv.slice(2))).catch(error => { process.stderr.write(error.message + '\n'); process.exitCode = 1; });
}
