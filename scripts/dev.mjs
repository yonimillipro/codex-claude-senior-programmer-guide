import http from 'node:http';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Readable } from 'node:stream';
import { createChatHandler } from '../server/chat-handler.js';
const root = fileURLToPath(new URL('../', import.meta.url));
const host = '127.0.0.1'; const port = Number(process.env.PORT || 4176);
const handle = createChatHandler();
const allowed = new Set(['index.html', 'styles.css', 'app.js', 'mastery.css', 'mastery.js', 'motion.css', 'motion.js', 'collaboration-scene.js', 'chat.css', 'chat.js', 'favicon.svg']);
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation', '.txt': 'text/plain' };
http.createServer(async (incoming, outgoing) => {
  const url = new URL(incoming.url, `http://${host}:${port}`);
  try {
    if (url.pathname === '/api/chat') {
      const cancellation = new AbortController(); outgoing.on('close', () => { if (!outgoing.writableEnded) cancellation.abort(); });
      const init = { method: incoming.method, headers: incoming.headers, signal: cancellation.signal };
      if (!['GET', 'HEAD'].includes(incoming.method)) { init.body = Readable.toWeb(incoming); init.duplex = 'half'; }
      const response = await handle(new Request(url, init));
      outgoing.writeHead(response.status, Object.fromEntries(response.headers));
      if (response.body) Readable.fromWeb(response.body).on('error', () => outgoing.destroy()).pipe(outgoing); else outgoing.end();
      return;
    }
    const name = decodeURIComponent(url.pathname === '/' ? 'index.html' : url.pathname.slice(1));
    if (!allowed.has(name) && !name.startsWith('vendor/') && !name.startsWith('presentation/')) { outgoing.writeHead(404).end('Not found'); return; }
    const target = path.resolve(root, name);
    if (!target.startsWith(root)) { outgoing.writeHead(403).end(); return; }
    const stream = createReadStream(target);
    stream.on('error', () => { if (!outgoing.headersSent) outgoing.writeHead(404); outgoing.end(); });
    stream.on('open', () => { outgoing.writeHead(200, { 'Content-Type': mime[path.extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); stream.pipe(outgoing); });
  } catch { if (!outgoing.headersSent) outgoing.writeHead(500); outgoing.end('Request failed'); }
}).listen(port, host, () => console.log(`Guide: http://${host}:${port}/ (chat uses server-only environment configuration)`));
