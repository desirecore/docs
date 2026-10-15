#!/usr/bin/env node
// DesireCore HTTP + Socket.IO example. No browser renderer or private IPC is required.
import { io } from 'socket.io-client';
import { randomUUID } from 'node:crypto';
import { readFileSync, writeFileSync, renameSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

export function queryDigest(prompt, userMessageId, fileReferences = []) {
  // packages/shared/src/query/request-digest.ts: UTF-8 FNV-1a, not a security hash.
  const canonical = JSON.stringify(['qrd1', prompt, userMessageId, [], [...fileReferences]]);
  let hash = 0xcbf29ce484222325n;
  for (const byte of new TextEncoder().encode(canonical)) {
    hash = ((hash ^ BigInt(byte)) * 0x100000001b3n) & 0xffffffffffffffffn;
  }
  return `qrd1:${hash.toString(16).padStart(16, '0')}`;
}

const help = `Usage:
  node client.mjs --prompt "Hello" [--attachment-receipt ./receipt.json] [--follow-up "And ..."] --state ./request.json
  node client.mjs --resume ./request.json
  node client.mjs --recover ./request.json     # read-only; does not resend
  node client.mjs --cancel ./request.json      # explicit cancellation request

Environment: DESIRECORE_URL, DESIRECORE_TOKEN, DESIRECORE_AGENT_ID (new requests).
Options: --timeout-ms 300000, --http-timeout-ms 10000, --poll-ms 1000.
Use HTTPS remotely; HTTP is accepted only for localhost/127.0.0.1/::1.
Exit: 0 observed completed turn; 1 rejected/failed/interrupted; 2 unknown or recovery-only.
--attachment-receipt can repeat; it attaches already-uploaded files to the initial turn only.
State files contain prompts, file references and IDs, never the access token. Do not share them.
Ctrl+C exits this client without cancelling the server; use --cancel to request cancellation.
`;

function argumentsFor(argv) {
  const options = { followUps: [], attachmentReceipts: [], timeoutMs: 300_000, httpTimeoutMs: 10_000, pollMs: 1_000 };
  const names = new Map([
    ['--prompt', 'prompt'], ['--state', 'state'], ['--resume', 'resume'],
    ['--recover', 'recover'], ['--cancel', 'cancel'], ['--timeout-ms', 'timeoutMs'],
    ['--http-timeout-ms', 'httpTimeoutMs'], ['--poll-ms', 'pollMs'],
  ]);
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--help' || argv[i] === '-h') return { help: true };
    const option = argv[i];
    const value = argv[++i];
    if (!value || value.startsWith('--')) throw new Error(`Missing value for ${option}`);
    if (option === '--follow-up') options.followUps.push(value);
    else if (option === '--attachment-receipt') options.attachmentReceipts.push(value);
    else if (names.has(option)) options[names.get(option)] = value;
    else throw new Error(`Unknown option ${option}`);
  }
  for (const key of ['timeoutMs', 'httpTimeoutMs', 'pollMs']) {
    options[key] = Number(options[key]);
    if (!Number.isSafeInteger(options[key]) || options[key] < 10) throw new Error(`Invalid ${key}`);
  }
  const modes = ['resume', 'recover', 'cancel'].filter(key => options[key]);
  if (modes.length > 1 || (modes.length && (options.prompt || options.state || options.followUps.length || options.attachmentReceipts.length))) {
    throw new Error('Use either a new --prompt/--state or one of --resume/--recover/--cancel.');
  }
  if (!modes.length && (!options.prompt?.trim() || !options.state)) throw new Error(help);
  return options;
}

function baseUrl(value) {
  const url = new URL(value);
  if (url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('DESIRECORE_URL must be an origin without credentials, a path, query, or fragment.');
  }
  const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && loopback)) {
    throw new Error('Use HTTPS for remote instances.');
  }
  return url.origin;
}

function attachmentReferences(files) {
  const references = [];
  const fields = ['attachmentId', 'name', 'mimeType', 'size', 'sha256', 'fileReference'];
  const sizedString = (value, maximum) => typeof value === 'string' && [...value].length >= 1 && [...value].length <= maximum;
  for (const file of files) {
    const receipt = JSON.parse(readFileSync(file, 'utf8'));
    if (!receipt || typeof receipt !== 'object' || Array.isArray(receipt)
      || Object.keys(receipt).length !== fields.length || fields.some(key => !Object.hasOwn(receipt, key))
      || typeof receipt.attachmentId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(receipt.attachmentId)
      || !sizedString(receipt.name, 240) || !sizedString(receipt.mimeType, 128)
      || !Number.isSafeInteger(receipt.size) || receipt.size < 1 || receipt.size > 20 * 1024 * 1024
      || typeof receipt.sha256 !== 'string' || !/^[0-9a-f]{64}$/.test(receipt.sha256)
      || !sizedString(receipt.fileReference, 2048)) {
      throw new Error('Invalid attachment receipt; use the complete JSON returned by the same instance upload.');
    }
    references.push(receipt.fileReference);
  }
  return [...new Set(references)]; // Keep the first occurrence order for the request digest.
}

function newTurn(prompt, kind, sessionId, agentId, conversationId, fileReferences = []) {
  const clientRequestId = randomUUID();
  const userMessageId = randomUUID();
  const requestDigest = queryDigest(prompt, userMessageId, fileReferences);
  const body = kind === 'start'
    ? { prompt, options: { agentId, conversationId, ...(fileReferences.length ? { fileReferences: [...fileReferences] } : {}) }, clientRequestId, userMessageId, requestDigest }
    : { sessionId, message: { id: userMessageId, role: 'user', content: prompt, timestamp: Date.now() }, clientRequestId, requestDigest };
  return { kind, body, userMessageId, firstDispatchedAt: null, firstDispatchedServerTime: null, attempts: 0 };
}

function readState(file) {
  const state = JSON.parse(readFileSync(file, 'utf8'));
  if (state.version !== 1 || !state.agentId || !state.instanceId || !Array.isArray(state.turns)
    || !state.turns.length || !Array.isArray(state.pendingFollowUps)
    || !/^[A-Za-z0-9._:-]{16,128}$/.test(state.clientInstanceId)) throw new Error('Invalid state file');
  state.baseUrl = baseUrl(state.baseUrl);
  for (const turn of state.turns) {
    const prompt = turn.kind === 'start' ? turn.body?.prompt : turn.body?.message?.content;
    const fileReferences = (turn.kind === 'start' ? turn.body?.options?.fileReferences : turn.body?.fileReferences) ?? [];
    if (!['start', 'follow-up'].includes(turn.kind) || typeof prompt !== 'string'
      || !turn.body?.clientRequestId || !turn.userMessageId
      || !Array.isArray(fileReferences) || fileReferences.some(value => typeof value !== 'string')
      || turn.body.requestDigest !== queryDigest(prompt, turn.userMessageId, fileReferences)) {
      throw new Error('Invalid or edited request state. Create a new state file for a different request.');
    }
  }
  return state;
}

export async function runClient(options, env = process.env, output = {}) {
  const log = output.log ?? (data => process.stderr.write(`${JSON.stringify(data)}\n`));
  const text = output.text ?? (value => process.stdout.write(value));
  const filename = resolve(options.resume || options.recover || options.cancel || options.state);
  const existing = Boolean(options.resume || options.recover || options.cancel);
  if (!existing && existsSync(filename)) throw new Error('State file already exists. Use --resume or a new --state path.');
  if (existing && options.attachmentReceipts?.length) throw new Error('Saved requests retain their original attachment references.');
  const fileReferences = existing ? [] : attachmentReferences(options.attachmentReceipts ?? []);
  const token = env.DESIRECORE_TOKEN;
  if (!token) throw new Error('Set DESIRECORE_TOKEN to the existing instance access token.');
  const origin = existing ? readState(filename).baseUrl : baseUrl(env.DESIRECORE_URL);
  if (existing && env.DESIRECORE_URL && baseUrl(env.DESIRECORE_URL) !== origin) {
    throw new Error('DESIRECORE_URL differs from the saved request; use the original instance.');
  }
  const timeoutMs = options.timeoutMs ?? 300_000;
  const httpTimeoutMs = options.httpTimeoutMs ?? 10_000;
  const pollMs = options.pollMs ?? 1_000;
  async function http(path, body) {
    const response = await fetch(`${origin}${path}`, {
      method: body === undefined ? 'GET' : 'POST',
      redirect: 'error', signal: AbortSignal.timeout(httpTimeoutMs),
      headers: { 'X-Agent-Service-Token': token, ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    if (!response.headers.get('content-type')?.includes('application/json')) {
      throw new Error(`HTTP ${response.status}: expected JSON from the instance API`);
    }
    return { status: response.status, data: await response.json(), retryAfter: response.headers.get('retry-after') };
  }
  async function handshake() {
    const deadline = Date.now() + httpTimeoutMs;
    while (true) {
      const result = await http('/api/client-handshake');
      if (result.status === 503 && result.data?.code === 'service_not_ready' && Date.now() < deadline) {
        await delay(Math.max(1_000, Number(result.retryAfter || 1) * 1_000));
        continue;
      }
      if (result.status !== 200 || result.data.service !== 'desirecore-agent-service'
        || !result.data.instanceId || result.data.apiProtocolVersion !== '1') {
        throw new Error(`Handshake rejected: HTTP ${result.status} ${result.data.error || result.data.code || 'unsupported protocol'}`);
      }
      return result.data;
    }
  }
  const metadata = await handshake();
  const clock = { local: Date.now(), server: Date.parse(metadata.serverTime) };
  if (!Number.isFinite(clock.server)) throw new Error('Handshake serverTime is invalid.');
  const state = existing ? readState(filename) : {
    version: 1, baseUrl: origin, instanceId: metadata.instanceId, agentId: env.DESIRECORE_AGENT_ID,
    conversationId: env.DESIRECORE_AGENT_ID, clientInstanceId: randomUUID(),
    turns: [], pendingFollowUps: [...(options.followUps ?? [])],
  };
  if (!state.agentId) throw new Error('Set DESIRECORE_AGENT_ID to the target Agent ID.');
  if (state.instanceId !== metadata.instanceId) throw new Error('Instance identity changed; refusing to send or recover requests on another instance.');
  if (!existing) state.turns.push(newTurn(options.prompt, 'start', undefined, state.agentId, state.conversationId, fileReferences));
  function save() {
    const temporary = `${filename}.${process.pid}.tmp`;
    writeFileSync(temporary, `${JSON.stringify(state, null, 2)}\n`, { mode: 0o600 });
    renameSync(temporary, filename);
  }
  save();
  log({ event: 'handshake', instanceId: metadata.instanceId, serverVersion: metadata.serverVersion, state: filename });

  async function lookup(turn) {
    const result = await http('/api/query/client-requests/lookup', {
      agentId: state.agentId, conversationId: state.conversationId,
      requests: [{ clientRequestId: turn.body.clientRequestId, userMessageId: turn.userMessageId }],
    });
    if (result.status !== 200) throw new Error(`Admission lookup: HTTP ${result.status} ${result.data.error || result.data.code || ''}`);
    const verdict = result.data.results?.find(item => item.clientRequestId === turn.body.clientRequestId);
    if (result.data.protocolVersion !== 1 || !['committed', 'reserved', 'absent', 'unknown'].includes(verdict?.status)) {
      throw new Error('Unsupported admission lookup response');
    }
    turn.admission = { ...verdict, serverInstanceId: result.data.serverInstanceId, observedAt: result.data.observedAt };
    if (verdict.sessionId) turn.sessionId = verdict.sessionId;
    save();
    return { verdict, envelope: result.data };
  }
  async function recovery(turn) {
    const admission = await lookup(turn);
    if (!turn.runId && turn.sessionId) {
      const listing = await http(`/api/runs?agent_id=${encodeURIComponent(state.agentId)}&limit=100`);
      const exact = listing.data.runs?.filter(run => run.agent_id === state.agentId && run.session_id === turn.sessionId);
      if (listing.status === 200 && exact?.length === 1) turn.runId = exact[0].run_id;
    }
    const snapshot = { admission: admission.verdict, serverInstanceId: admission.envelope.serverInstanceId };
    if (turn.runId) {
      const path = `/api/runs/${encodeURIComponent(turn.runId)}`;
      const runtime = await http(`${path}/runtime-state`);
      const history = await http(`${path}/receipt?offset=0&limit=10`);
      snapshot.runtime = { httpStatus: runtime.status, ...runtime.data };
      if (runtime.status === 200 && runtime.data.run_id === turn.runId && runtime.data.agent_id === state.agentId) {
        turn.runState = { runId: turn.runId, status: runtime.data.status, source: 'runtime-state' };
      }
      snapshot.receipts = { httpStatus: history.status, ...history.data };
    }
    turn.recovery = snapshot;
    save();
    log({ event: 'recovery', clientRequestId: turn.body.clientRequestId, ...snapshot,
      note: 'Run status and receipts are snapshots; they do not prove this request completed. Missing Socket events are not replayed.' });
    return admission;
  }
  let turn = state.turns.at(-1);
  if (options.recover) { await recovery(turn); return 2; }

  const socket = io(origin, {
    path: '/socket.io/', auth: { token, clientInstanceId: state.clientInstanceId },
    autoConnect: false, forceNew: true, reconnection: true,
  });
  let disconnected = false;
  let fatalSocketError;
  socket.on('disconnect', reason => { disconnected = true; log({ event: 'disconnected', reason }); });
  socket.on('connect_error', error => {
    log({ event: 'connect_error', message: error.message });
    if (['unauthorized', 'instance_token_uninitialized'].includes(error.message)) fatalSocketError = error;
  });
  socket.on('connect', () => log({ event: 'connected', socketId: socket.id, clientInstanceId: state.clientInstanceId }));
  function matching(data) { return state.turns.find(item => item.body.clientRequestId === data?.clientRequestId); }
  function bind(data, item) {
    if (data.sessionId) item.sessionId = data.sessionId;
    if (data.runId || data.terminal?.runId) item.runId = data.runId || data.terminal.runId;
  }
  for (const name of ['query:started', 'query:followUpAccepted']) socket.on(name, data => {
    const item = matching(data);
    if (!item) return;
    bind(data, item); item.acceptedEvent = name; save();
    log({ event: name, clientRequestId: data.clientRequestId, sessionId: item.sessionId, runId: item.runId });
  });
  socket.on('query:message', data => {
    const item = matching(data);
    if (!item || item !== turn || item.outcome) return;
    bind(data, item);
    const message = data.message;
    const delta = message?.type === 'stream_event' ? message.event?.delta : undefined;
    if (message?.event?.type === 'content_block_delta' && delta?.type === 'text_delta' && typeof delta.text === 'string') {
      item.sawTextDelta = true; text(delta.text);
    } else if (!item.sawTextDelta && message?.type === 'text' && typeof message.text === 'string') text(message.text);
    else if (!item.sawTextDelta && message?.type === 'assistant') {
      for (const block of message.message?.content ?? []) if (block.type === 'text' && typeof block.text === 'string') text(block.text);
    }
    // result/completed_idle/user:message_delivery and approvals are not terminal events.
  });
  socket.on('query:complete', data => {
    const item = matching(data);
    if (!item || item.outcome) return;
    bind(data, item);
    item.outcome = { status: data.terminal?.status === 'completed' ? 'completed'
      : data.terminal?.status === 'interrupted' ? 'interrupted' : 'unknown',
      source: 'query:complete', reason: data.terminal?.reason, partial: data.terminal?.partial };
    save(); text('\n'); log({ event: 'turn_terminal', clientRequestId: data.clientRequestId, ...item.outcome });
  });
  socket.on('query:error', data => {
    const item = matching(data);
    if (!item || item.outcome) return;
    bind(data, item); item.outcome = { status: 'failed', source: 'query:error', code: data.code, error: data.error };
    save(); log({ event: 'turn_terminal', clientRequestId: data.clientRequestId, ...item.outcome });
  });
  socket.on('activity:run_status', data => {
    if (turn.runId === data.runId) {
      turn.runState = { runId: data.runId, status: data.status, source: 'activity:run_status' }; save();
      log({ event: 'run_status', runId: data.runId, status: data.status,
        note: 'Run state does not identify completion of this turn or any handoff target.' });
    }
  });
  async function connected(deadline) {
    while (!socket.connected) {
      if (fatalSocketError) throw fatalSocketError;
      if (Date.now() >= deadline) throw new Error('Socket connection timed out; saved request has not been automatically cancelled.');
      await delay(Math.min(pollMs, 100));
    }
  }
  async function dispatch(item) {
    if (item.firstDispatchedAt === null) {
      item.firstDispatchedAt = Date.now();
      item.firstDispatchedServerTime = clock.server + item.firstDispatchedAt - clock.local;
    }
    item.attempts++; save(); // Write request identity before performing the POST.
    let response;
    try { response = await http(`/api/query/${item.kind}`, { ...item.body, originSocketId: socket.id }); }
    catch (error) {
      log({ event: 'admission_unknown', clientRequestId: item.body.clientRequestId, message: error.message });
      return;
    }
    if (response.status === 202 && response.data.ok === true
      && response.data.clientRequestId === item.body.clientRequestId) {
      if (response.data.sessionId) item.sessionId = response.data.sessionId;
      item.httpAccepted = true; save();
      log({ event: 'http_admission', status: 202, duplicate: response.data.duplicate === true,
        clientRequestId: item.body.clientRequestId, note: 'Admission, not completion or durable commitment.' });
    } else if (response.status === 202) throw new Error('Admission response did not echo the request identity.');
    else if ([400, 401, 403, 404, 409, 413, 415].includes(response.status) && !response.data.retryable) {
      item.outcome ??= { status: 'rejected', source: 'http', httpStatus: response.status,
        code: response.data.code, error: response.data.error };
      save(); log({ event: 'turn_rejected', clientRequestId: item.body.clientRequestId, ...item.outcome });
    } else log({ event: 'admission_pending', status: response.status, code: response.data.code,
      busy: response.data.busy === true, clientRequestId: item.body.clientRequestId });
  }
  function replayAllowed(item, envelope) {
    const age = Date.parse(envelope.observedAt) - item.firstDispatchedServerTime;
    const window = Math.min(envelope.autoReplayRetentionMs, envelope.tombstoneRetentionMs);
    return Number.isFinite(age) && age >= 0 && window > 0 && age < window;
  }
  socket.connect();
  try {
    while (true) {
      const deadline = Date.now() + timeoutMs;
      await connected(deadline);
      if (options.cancel) {
        if (turn.outcome) { log({ event: 'already_terminal', outcome: turn.outcome }); return turn.outcome.status === 'completed' ? 0 : 1; }
        socket.emit('query:abort', { ...(turn.sessionId ? { sessionId: turn.sessionId } : {}),
          agentId: state.agentId, conversationId: state.conversationId, clientRequestId: turn.body.clientRequestId });
        log({ event: 'cancel_requested', clientRequestId: turn.body.clientRequestId });
      } else if (!turn.outcome && turn.firstDispatchedAt === null) await dispatch(turn);

      while (!turn.outcome && Date.now() < deadline) {
        await delay(pollMs);
        if (turn.outcome) break;
        if (fatalSocketError) throw fatalSocketError;
        if (!socket.connected) continue;
        try {
          const observation = disconnected ? await recovery(turn) : await lookup(turn);
          disconnected = false;
          if (turn.outcome) break;
          const { verdict, envelope } = observation;
          if (verdict.status === 'unknown') {
            log({ event: 'outcome_unknown', clientRequestId: turn.body.clientRequestId, note: 'No automatic resend.' });
            return 2;
          }
          if (verdict.status === 'committed' && verdict.committedServerInstance === 'previous') {
            await recovery(turn); return 2;
          }
          if (verdict.status === 'absent' && !options.cancel) {
            if (!replayAllowed(turn, envelope)) {
              log({ event: 'replay_window_expired', clientRequestId: turn.body.clientRequestId }); return 2;
            }
            await dispatch(turn); // Preserve IDs, prompt, digest, and message; replace only originSocketId.
          }
          // committed/reserved wait for this turn's events. Neither proves business completion.
        } catch (error) { log({ event: 'reconciliation_unavailable', message: error.message }); }
      }
      if (!turn.outcome) {
        try { await recovery(turn); } catch (error) { log({ event: 'reconciliation_unavailable', message: error.message }); }
        log({ event: 'outcome_unknown', clientRequestId: turn.body.clientRequestId, note: 'Timed out locally; server may still run. Use --recover or --resume.' });
        return 2;
      }
      if (turn.outcome.status !== 'completed') return turn.outcome.status === 'unknown' ? 2 : 1;
      if (!state.pendingFollowUps.length || options.cancel) return 0;
      // Follow-ups reuse a live session; never silently create a successor Run after a restart.
      const observed = await lookup(turn);
      if (!turn.sessionId || observed.verdict.status !== 'committed'
        || observed.verdict.committedServerInstance !== 'current') {
        await recovery(turn); log({ event: 'follow_up_unavailable', note: 'A live current-process session was not confirmed.' }); return 2;
      }
      if (turn.runState?.status === 'handed_off') {
        log({ event: 'follow_up_unavailable', runId: turn.runId, status: 'handed_off',
          note: 'The source Run was handed off. Pending text is retained; no target execution or source replay is inferred.' });
        return 2;
      }
      if (turn.runId) {
        const runtime = await http(`/api/runs/${encodeURIComponent(turn.runId)}/runtime-state`);
        if (runtime.status !== 200 || runtime.data.run_id !== turn.runId || runtime.data.agent_id !== state.agentId
          || !['running', 'idle', 'completed', 'failed'].includes(runtime.data.status)) {
          log({ event: 'follow_up_unavailable', runId: turn.runId, httpStatus: runtime.status,
            note: 'Source runtime state is unavailable. Pending text is retained; a 404 can include a handed-off Run.' });
          return 2;
        }
        turn.runState = { runId: turn.runId, status: runtime.data.status, source: 'runtime-state' }; save();
      }
      const next = state.pendingFollowUps.shift();
      turn = newTurn(next, 'follow-up', turn.sessionId, state.agentId, state.conversationId);
      state.turns.push(turn); save();
    }
  } finally { socket.disconnect(); save(); }
}

export async function main(argv = process.argv.slice(2)) {
  try {
    const options = argumentsFor(argv);
    if (options.help) { process.stdout.write(help); return 0; }
    return await runClient(options);
  } catch (error) {
    process.stderr.write(`${JSON.stringify({ event: 'client_error', message: error.message })}\n`);
    return 2;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  process.exitCode = await main();
}
