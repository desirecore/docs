# DesireCore Node conversation client

These examples call an administrator's existing standalone Agent Service using the same owner credential for HTTP and Socket.IO. Obtain its HTTPS origin, existing instance token, and target Agent ID from the administrator. The Agent needs a working model configuration and permissions appropriate for your prompt.

Use Node.js 22 or newer. Install dependencies **in this directory**, independently of the documentation website:

```bash
npm install
export DESIRECORE_URL='https://agent.example.com'
export DESIRECORE_TOKEN='replace-with-your-existing-instance-token'
export DESIRECORE_AGENT_ID='replace-with-target-agent-id'

node client.mjs --prompt 'Say hello in one sentence.' \
  --follow-up 'Translate your answer into Chinese.' \
  --state ./request.json
```

`DESIRECORE_URL` is an origin without `/api`, a page path, credentials, query, or fragment. HTTP is accepted only for loopback addresses used in local testing. Never disable certificate verification to make a remote connection work. The single-file download needs the same `socket.io-client` dependency beside it; install it in a dedicated directory with `npm install socket.io-client@4.8.4`.

The client performs the authenticated read-only handshake, verifies the data-space instance ID, connects at `/socket.io/`, and supplies `auth.token` plus a stable `auth.clientInstanceId`. It submits HTTP queries with `X-Agent-Service-Token`, current `originSocketId`, and stable request/message IDs. The server automatically binds the authenticated connection's delivery room; the client does not emit a separate subscribe command.

Text streams go to stdout. JSON progress records go to stderr. A `202` progress record means HTTP admission; it is not a final answer, durable commitment, or proof of a successful tool action. Only a matching `query:complete` with `terminal.status: "completed"` records completion of the current turn. Run `idle`, message `result`/`completed_idle`, and user message delivery are not treated as completion. An interrupted turn exits with status 1. Completion of a turn does not independently verify that every requested business operation succeeded.

If the source Run is observed as `handed_off`, or its runtime-state precheck is unavailable, the client stops automatic follow-ups and retains the pending text. The current HTTP runtime-state route returns `404` for handed-off Runs, even though Run details can report `handed_off`. A `404` does not establish failure or missing history. The client does not follow `handoffTo` automatically.

Each follow-up gets a new `clientRequestId` and message ID and reuses the current session. The client waits for the preceding turn to complete and checks that its admission belongs to the current server process. If the session is unavailable, it reports the failure; it does not silently create a new Run. Approval and question prompts need the instance's supported user interface; this CLI does not approve operations or answer questions automatically.

## State and recovery

`--state` must name a new file in an existing directory. The client saves request identity before sending, with file mode `0600`. The state contains prompts, queued follow-ups, and request/session/Run IDs, and selected file references, and never stores the access token. Keep it private and leave its frozen request bodies unchanged. Reusing an existing `--state` path is rejected.

```bash
# Observe the recorded request without resending it or starting a new query.
node client.mjs --recover ./request.json

# Reconnect to the saved request and continue waiting or safely retry its admission.
node client.mjs --resume ./request.json --timeout-ms 300000

# Explicitly request cancellation of the saved current request.
node client.mjs --cancel ./request.json --timeout-ms 30000
```

`--resume`, `--recover`, and `--cancel` are separate modes. They use the instance origin and Agent ID in the state file; `DESIRECORE_TOKEN` must still contain a valid token. If `DESIRECORE_URL` is also set, it must match the saved origin. A different handshake `instanceId` prevents submission or recovery on the wrong instance. Only one client process should use a state file at a time: a new connection with the same client identity takes over delivery of future events.

On an unknown admission, the client calls the read-only `POST /api/query/client-requests/lookup`. A `committed` request is not resent; `reserved` is awaited. `absent` may be resent using the exact same IDs, prompt, message, and digest within the replay and tombstone windows reported by the server; only `originSocketId` changes after reconnection. `unknown`, a previous-process commitment, or an expired replay window stops automatic resubmission. The `qrd1:` digest follows the shared UTF-8 FNV-1a contract and covers prompt, user message ID, media IDs, and file references. This CLI uses an empty media array and the initial turn’s selected attachment file references. It is not a security hash and does not cover all query options.

Socket reconnection receives future events; it does not replay missed events. Recovery reads admission state, the known Run's raw runtime state, and a bounded page of durable receipts. If the started event was missed but an exact session ID is known, the client searches up to 100 Agent-filtered Runs for a unique `session_id` match. It never guesses the latest Run. No match leaves the Run identity unknown.

The receipt snapshot may contain other turns in the same Run. An idle/completed Run, a successful historical receipt, or a stored user message alone does not identify a missing terminal for this request. The example keeps that outcome unknown and does not send the next follow-up. Inspect the saved recovery facts and the instance's history before explicitly choosing another action. Recovery does not resume model execution or replay past tool effects.

`Ctrl+C` stops the client and leaves the saved request available for recovery; the server may continue. `--cancel` sends Socket.IO `query:abort` using the saved Agent/conversation/request identity and session ID when known. Sending cancellation alone does not confirm cancellation; the client waits for the request's terminal event. A missing terminal still returns an unknown outcome.

Exit codes: **0** = current turn explicitly completed; **1** = rejected, failed, or interrupted; **2** = unknown, read-only recovery, or a client/connection error. Timeouts are local waiting limits and do not automatically cancel server execution. `--http-timeout-ms` and `--poll-ms` control individual HTTP calls and admission polling.

## Upload an attachment and submit it

`attachments.mjs` needs Node.js 22+ and no dependencies. It uploads one non-empty file up to 20 MiB and verifies the server receipt’s size and SHA-256. It refuses redirects and existing output files and never retries the upload automatically.

```bash
node attachments.mjs --file ./report.txt --mime text/plain --out ./attachment.json
node client.mjs --prompt 'Summarize the uploaded report.' \
  --attachment-receipt ./attachment.json --state ./request-with-file.json
```

`--attachment-receipt` can repeat. The conversation client uses the receipts’ unchanged `fileReference` values in the initial Query’s `options.fileReferences`, deduplicates them in order, and freezes them in the request state and digest. Follow-ups remain text-only. Receipts and request state contain private file references; use them only with the instance that issued them. Upload success does not establish that a model or tool has read the file. Lost upload responses leave an unknown outcome; a new POST creates another attachment.

For media upload, signed playback URLs, ownership compatibility, and Range behavior, see the bilingual [attachments and media guide](../../../docs/07-api/09-attachments-and-media.md). The upload helper handles general attachments; it does not convert media metadata into a query or issue media URLs.

## Read historical messages

`history.mjs` also needs Node.js 22+ and no dependencies. See `node history.mjs --help` and the bilingual [history guide](../../../docs/07-api/08-session-history-and-messages.md) for its commands. The helper reads history; it never resumes execution or infers a missing query terminal from persisted messages. It uses source-row windows for per-Run pagination rather than advancing by the returned message count.

## Verification and maintenance

Run `npm test` for the independent HTTP + Socket.IO contract fixture. It verifies request identity, start/follow-up, events arriving before HTTP, lost acknowledgements, reconnection, conservative recovery, body mismatch, interrupted turns, explicit cancellation, and prevention of false completion. The fixture is a fake instance, with no model credentials or real tool effects; passing it does not establish packaged-client or real-model acceptance.

`test/source-route.fixture.ts` can be copied into a fixed-source DesireCore checkout as `packages/agent-service/src/__tests__/api-docs-node-client.integration.test.ts`. Set `DESIRECORE_API_EXAMPLE_PATH` to the absolute path of this directory's `client.mjs`, then run that single file in the repository's integration test project. It verifies this client against the actual query routes, HTTP/Socket authentication, request Schema and digest, durable admission registry and lookup, and renderer delivery room. The query runtime and follow-up execution callback remain fake. Use its isolated temporary data root; do not point it at an existing user profile.

Current source review: `desirecore/desirecore` commit `a0186f6feeaf66eb88787e8b80b8fea5559b8761` (fixed review snapshot; source PR #5194). Historical validation remains in `api/verification.md`; this extension is recorded in `api/history-attachments-verification.md`.

- HTTP submission: `packages/agent-service/src/routes/query-routes.ts`.
- Admission lookup: `packages/agent-service/src/routes/client-request-lookup-routes.ts`; shared Schema in `packages/schemas/src/agent-service/client-request-admission.ts`.
- Query request/digest: `packages/schemas/src/agent-service/query.ts`; `packages/shared/src/query/request-digest.ts`.
- Events: `packages/schemas/src/socket-events/{server-to-client,client-to-server}.ts`.
- Delivery identity: `packages/agent-service/src/handlers/renderer-delivery.ts` and `auth/delivery-principal.ts`.
- Run snapshots/receipts: `packages/agent-service/src/routes/runs-routes.ts`.

Keep the three published downloads byte-identical to their maintained files: `client.mjs` → `static/api-examples/agent-client.mjs`, `history.mjs` → `static/api-examples/history.mjs`, and `attachments.mjs` → `static/api-examples/attachments.mjs`. Revalidate the affected contracts after changes. The example is deliberately a small client, not a complete renderer, SDK, or durable execution orchestrator.

`test/source-history.fixture.ts` can be copied to the fixed source tree as `packages/agent-service/src/__tests__/api-docs-history.test.ts` and run in the `unit` project. It uses actual instance authentication, history/topic/Run routes and temporary file storage. The local profile and runtime discovery are stubs. It checks owner filtering, public message projection, search validation, empty topic reads, and the actual `handed_off` detail/`404` runtime-state behavior. It does not run a model or real handoff. Website TypeScript checking excludes these two source fixtures because their imports resolve only inside DesireCore’s source repository.

History output is a display projection: sensitive tool results may be placeholders, and body references may be absent. The reader preserves these payloads and optional response extensions; it does not infer tool success from placeholder text, retrieve withheld references, or execute replacement work. Current stability review and verification are recorded in `api/stability-verification-2026-10-22.md`.


## Observation reader

`observe.mjs` requires Node.js 22+ and no npm packages. It uses the same administrator-provided instance origin and owner credential, checks the handshake, performs one GET, and preserves the returned data. It does not poll, replay work or reconcile billing. The example validates recommended input formats; service fallback behavior is documented separately.

```bash
node observe.mjs input-config --agent-id your-agent-id
node observe.mjs network
node observe.mjs recent-calls --limit 20
node observe.mjs usage --since 2026-10-01T00:00:00Z --timezone UTC
node history.mjs all --agent-id your-agent-id --limit 100 --all-pages
```

Merged history buffers one revision per attempt. A 409 discards that attempt and restarts from page zero within the configured restart budget. No rejected attempt is emitted as a successful page set. Source-only Mention IDs remain display identifiers and are never passed to Run or execution APIs. `limit=0` returns metadata with an empty page rather than all messages. Current validation is recorded in `api/observation-verification-2026-10-25.md`.
