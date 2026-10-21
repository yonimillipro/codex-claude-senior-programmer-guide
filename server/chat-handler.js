import { quotaConfig, reserveQuota } from './chat-limits.js';
import { createAnswerStream } from './chat-provider.js';

const HEADERS = { 'Cache-Control': 'no-store, max-age=0', 'X-Content-Type-Options': 'nosniff' };
const unavailable = 'AI chat is not connected yet. Please try again later.';
const json = (data, status = 200, headers = {}) => Response.json(data, { status, headers: { ...HEADERS, ...headers } });
export function configured(env) { return env.CHAT_ENABLED === 'true' && Boolean(env.OPENAI_API_KEY) && Boolean(quotaConfig(env)); }
export function allowedOrigin(request, env) {
  const origin = request.headers.get('origin');
  const allowed = new Set(['https://codex-claude-senior-programmer-guid.vercel.app']);
  if (env.VERCEL_URL) allowed.add(`https://${env.VERCEL_URL}`);
  for (const value of (env.CHAT_ALLOWED_ORIGINS || '').split(',').filter(Boolean)) {
    try { const url = new URL(value.trim()); if (url.protocol === 'https:' || (env.NODE_ENV !== 'production' && ['localhost', '127.0.0.1'].includes(url.hostname))) allowed.add(url.origin); } catch {}
  }
  return Boolean(origin && allowed.has(origin) && request.headers.get('sec-fetch-site') !== 'cross-site');
}
export async function validatedMessages(request) {
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) throw Object.assign(new Error('Send your question as JSON.'), { status: 415 });
  const reader = request.body?.getReader();
  if (!reader) throw Object.assign(new Error('Enter a question.'), { status: 400 });
  const chunks = []; let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > 32000) { await reader.cancel(); throw Object.assign(new Error('This conversation is too long. Start a new chat.'), { status: 413 }); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  let data;
  try { data = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); } catch { throw Object.assign(new Error('The question could not be read. Please try again.'), { status: 400 }); }
  const messages = data?.messages;
  if (!Array.isArray(messages) || !messages.length || messages.length > 9 || messages.length % 2 === 0) throw Object.assign(new Error('Start a new chat and resend your question.'), { status: 400 });
  let total = 0;
  const clean = messages.map((message, i) => {
    if (!message || message.role !== (i % 2 ? 'assistant' : 'user') || typeof message.content !== 'string' || !message.content.trim() || message.content.length > (message.role === 'user' ? 2000 : 6000)) throw Object.assign(new Error('Keep questions under 2,000 characters and start a new chat if needed.'), { status: 400 });
    total += message.content.length;
    return { role: message.role, content: message.content.trim() };
  });
  if (total > 9000) throw Object.assign(new Error('This conversation is too long. Start a new chat.'), { status: 413 });
  return clean;
}
export function createChatHandler({ env = process.env, generate = createAnswerStream, quota = reserveQuota, logger = console } = {}) {
  return async function handle(request) {
    if (request.method === 'GET') return json({ ready: configured(env) });
    if (request.method !== 'POST') return json({ error: 'Use the chat form to send a question.' }, 405, { Allow: 'GET, POST' });
    if (!allowedOrigin(request, env)) return json({ error: 'Open this chat on the guide website.' }, 403);
    if (!configured(env)) return json({ error: unavailable }, 503);
    let messages;
    try { messages = await validatedMessages(request); }
    catch (error) { return json({ error: error.status ? error.message : 'Invalid question.' }, error.status || 400); }
    try {
      const limit = await quota(request, env);
      if (!limit.allowed) return json({ error: 'The chat usage limit has been reached. Please try again later.' }, 429, { 'Retry-After': String(limit.retryAfter) });
    } catch { logger.error('guide_chat_quota_unavailable'); return json({ error: 'AI chat is temporarily unavailable. Please try again later.' }, 503); }
    const cancellation = new AbortController();
    const signal = AbortSignal.any([request.signal, cancellation.signal, AbortSignal.timeout(45000)]);
    const encoder = new TextEncoder();
    let cancelled = false;
    const stream = new ReadableStream({
      async start(controller) {
        const emit = value => { if (!cancelled) controller.enqueue(encoder.encode(JSON.stringify(value) + '\n')); };
        let finished = false;
        try {
          for await (const part of generate({ messages, signal, env })) {
            if (signal.aborted) throw new Error('aborted');
            if (part.type === 'text-delta') emit({ type: 'delta', text: part.text });
            if (part.type === 'error' || part.type === 'abort') throw new Error('provider_stream_failed');
            if (part.type === 'finish') {
              if (['error', 'content-filter', 'unknown'].includes(part.finishReason)) throw new Error('provider_stream_failed');
              finished = true; emit({ type: 'done', truncated: part.finishReason === 'length' });
            }
          }
          if (!finished && !signal.aborted) throw new Error('incomplete_stream');
        } catch {
          if (!request.signal.aborted && !cancelled) {
            logger.error(signal.aborted ? 'guide_chat_timeout' : 'guide_chat_reply_failed');
            emit({ type: 'error', message: signal.aborted ? 'The reply took too long. Please try again.' : 'The AI could not finish this reply. Please try again later.' });
          }
        } finally { if (!cancelled) controller.close(); cancellation.abort(); }
      },
      cancel() { cancelled = true; cancellation.abort(); }
    });
    return new Response(stream, { headers: { ...HEADERS, 'Content-Type': 'application/x-ndjson; charset=utf-8' } });
  };
}
