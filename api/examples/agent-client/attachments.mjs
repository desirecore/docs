#!/usr/bin/env node
// Standalone attachment uploader. Requires Node.js 22+, with no npm dependencies.
import { createHash } from 'node:crypto';
import { open, rm } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const MAX_ATTACHMENT_BYTES = 20 * 1024 * 1024;
const fields = ['attachmentId', 'name', 'mimeType', 'size', 'sha256', 'fileReference'];
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const textWithin = (value, maximum) => typeof value === 'string'
  && [...value].length >= 1 && [...value].length <= maximum;

export function validateAttachmentReceipt(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)
    || Object.keys(value).length !== fields.length || fields.some(key => !Object.hasOwn(value, key))
    || typeof value.attachmentId !== 'string' || !uuid.test(value.attachmentId)
    || !textWithin(value.name, 240) || !textWithin(value.mimeType, 128)
    || !Number.isSafeInteger(value.size) || value.size < 1 || value.size > MAX_ATTACHMENT_BYTES
    || typeof value.sha256 !== 'string' || !/^[0-9a-f]{64}$/.test(value.sha256)
    || !textWithin(value.fileReference, 2048)) {
    throw new Error('Invalid attachment receipt from the instance.');
  }
  return value;
}

function instanceOrigin(value) {
  const url = new URL(value);
  const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if (url.username || url.password || url.pathname !== '/' || url.search || url.hash
    || (url.protocol !== 'https:' && !(url.protocol === 'http:' && loopback))) {
    throw new Error('Use an HTTPS instance origin; HTTP is allowed only on loopback.');
  }
  return url.origin;
}

export class AttachmentUploadError extends Error {
  constructor(status, code) {
    super(`Attachment upload rejected: HTTP ${status}${code ? ` ${code}` : ''}`);
    this.name = 'AttachmentUploadError';
    this.status = status;
    this.code = code;
  }
}

export async function uploadAttachment({ baseUrl, token, file, mimeType = 'application/octet-stream', timeoutMs = 60_000 }) {
  const origin = instanceOrigin(baseUrl);
  if (typeof token !== 'string' || !token.trim()) throw new Error('Set DESIRECORE_TOKEN.');
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1) throw new Error('Invalid upload timeout.');
  if (typeof mimeType !== 'string' || mimeType.length > 128
    || !/^[A-Za-z0-9!#$&^_.+-]+\/[A-Za-z0-9!#$&^_.+-]+$/.test(mimeType)) throw new Error('Invalid MIME type.');
  const path = resolve(file);
  const handle = await open(path, 'r');
  let bytes;
  try {
    const stat = await handle.stat();
    if (!stat.isFile() || stat.size < 1 || stat.size > MAX_ATTACHMENT_BYTES) {
      throw new Error('Select one non-empty regular file no larger than 20 MiB.');
    }
    // Read at most 20 MiB + 1 from the opened file, even if it grows after stat().
    bytes = Buffer.alloc(Math.min(stat.size + 1, MAX_ATTACHMENT_BYTES + 1));
    let size = 0;
    while (size < bytes.length) {
      const part = await handle.read(bytes, size, bytes.length - size, null);
      if (!part.bytesRead) break;
      size += part.bytesRead;
    }
    if (size !== stat.size) throw new Error('File changed while reading; select it again.');
    bytes = bytes.subarray(0, size);
  } finally { await handle.close(); }
  const expectedHash = createHash('sha256').update(bytes).digest('hex');
  const form = new FormData();
  form.append('file', new Blob([bytes], { type: mimeType }), basename(path));
  // No automatic retry: each successful POST creates a new stored attachment.
  const response = await fetch(`${origin}/api/attachments`, {
    method: 'POST', headers: { 'X-Agent-Service-Token': token }, body: form,
    redirect: 'error', signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.headers.get('content-type')?.toLowerCase().includes('application/json')) {
    throw new Error(`Attachment upload: HTTP ${response.status}; expected JSON from the instance API.`);
  }
  const value = await response.json();
  if (response.status !== 201) {
    throw new AttachmentUploadError(response.status, typeof value?.error === 'string' ? value.error.slice(0, 160) : undefined);
  }
  const receipt = validateAttachmentReceipt(value);
  if (receipt.size !== bytes.length || receipt.sha256 !== expectedHash) {
    throw new Error('Attachment receipt does not match the uploaded file size and SHA-256.');
  }
  return receipt;
}

const help = `Usage: node attachments.mjs --file ./report.pdf --out ./attachment.json [--mime application/pdf]
Environment: DESIRECORE_URL, DESIRECORE_TOKEN. Node.js 22+; no npm install required.
The output is the direct attachment receipt, for client.mjs --attachment-receipt.
Keep the receipt private and use it only with the same instance. Uploads are not retried automatically.
`;

export async function runUploadCli(argv, env = process.env) {
  if (argv.includes('--help') || argv.includes('-h')) { process.stdout.write(help); return; }
  const options = {};
  for (let i = 0; i < argv.length; i++) {
    const name = argv[i];
    if (!['--file', '--out', '--mime'].includes(name) || options[name]) throw new Error(help);
    const value = argv[++i];
    if (!value || value.startsWith('--')) throw new Error(help);
    options[name] = value;
  }
  if (!options['--file'] || !options['--out']) throw new Error(help);
  // Reserve the output first, so an existing receipt cannot be overwritten after an upload.
  const outputPath = resolve(options['--out']);
  const output = await open(outputPath, 'wx', 0o600);
  let saved = false;
  try {
    const receipt = await uploadAttachment({ baseUrl: env.DESIRECORE_URL, token: env.DESIRECORE_TOKEN,
      file: options['--file'], mimeType: options['--mime'] ?? 'application/octet-stream' });
    await output.writeFile(`${JSON.stringify(receipt, null, 2)}\n`);
    saved = true;
    process.stderr.write(`Saved attachment receipt to ${options['--out']}\n`);
  } finally { await output.close(); if (!saved) await rm(outputPath, { force: true }); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  runUploadCli(process.argv.slice(2)).catch(error => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });
}
