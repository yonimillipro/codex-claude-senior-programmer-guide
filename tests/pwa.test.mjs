import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { renderServiceWorker } from '../scripts/pwa-assets.mjs';

const rootUrl = new URL('../', import.meta.url);
const read = file => readFile(new URL(file, rootUrl));
const scope = 'https://example.test/guide/';
const deck = 'presentation/Codex-and-Claude-Senior-Programmer-Guide-Updated-2026-10.pptx';

test('manifest launch, maskable/standard icons, screenshots and shortcuts resolve within the app', async () => {
  const manifest = JSON.parse(await read('manifest.webmanifest'));
  assert.equal(new URL(manifest.id, scope).href, scope);
  assert.equal(new URL(manifest.start_url, scope).href, scope);
  assert.equal(new URL(manifest.scope, scope).href, scope);
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.prefer_related_applications, false);
  for (const required of ['192x192', '512x512']) assert.ok(manifest.icons.some(icon => icon.sizes === required && icon.purpose === 'any'));
  assert.ok(manifest.icons.some(icon => icon.sizes === '512x512' && icon.purpose === 'maskable'));
  for (const icon of [...manifest.icons, { src: 'pwa/apple-touch-icon.png', sizes: '180x180' }]) {
    const png = await read(icon.src);
    assert.equal(png.subarray(12, 16).toString(), 'IHDR');
    assert.equal(`${png.readUInt32BE(16)}x${png.readUInt32BE(20)}`, icon.sizes);
  }
  assert.deepEqual(manifest.screenshots.map(shot => shot.form_factor).sort(), ['narrow', 'wide']);
  for (const shot of manifest.screenshots) assert.equal((await read(shot.src)).subarray(8, 12).toString(), 'WEBP');
  const html = (await read('index.html')).toString();
  assert.match(html, /rel="manifest" href="manifest\.webmanifest"/);
  for (const shortcut of manifest.shortcuts) {
    const url = new URL(shortcut.url, scope);
    assert.ok(url.href.startsWith(scope));
    assert.ok(html.includes(`id="${url.hash.slice(1)}"`));
    for (const icon of shortcut.icons) await access(new URL(icon.src, rootUrl));
  }
});

async function harness() {
  const source = await renderServiceWorker(fileURLToPath(rootUrl));
  const events = new Map();
  const writes = [];
  const deletes = [];
  const reads = new Map();
  const created = [];
  const shared = ['another-app:/', 'senior-guide:/elsewhere/:older', 'senior-guide:/guide/:older'];
  let claimed = false;
  let activated = false;
  let network = true;
  const self = {
    registration: { scope },
    clients: { claim() { claimed = true; } },
    skipWaiting() { activated = true; },
    addEventListener: (name, fn) => events.set(name, fn),
  };
  const caches = {
    open: async cacheName => {
      created.push(cacheName);
      return {
        match: async key => reads.get(key),
        addAll: async requests => { writes.push(...requests); },
      };
    },
    keys: async () => [...shared, ...new Set(created)],
    delete: async key => { deletes.push(key); },
  };
  runInNewContext(source, { self, caches, fetch: async () => {
    if (!network) throw new TypeError('offline');
    return new Response('network', { status: 404 });
  }, URL, Request, Response });
  function fire(name, data = {}) {
    let promise;
    events.get(name)({ ...data, waitUntil: result => { promise = result; }, respondWith: result => { promise = result; } });
    return promise;
  }
  return { source, writes, reads, deletes, created, fire, goOffline: () => { network = false; }, claimed: () => claimed, activated: () => activated };
}

test('precache contains a deterministic public release including the deck and animation; activation only removes this scope’s old versions', async () => {
  const h = await harness();
  assert.equal(h.source, await renderServiceWorker(fileURLToPath(rootUrl)));
  await h.fire('install');
  const urls = h.writes.map(request => request.url);
  for (const file of ['index.html', 'offline.html', 'pwa.js', 'guide-help-data.js', deck, 'vendor/three.core.js', 'vendor/gsap.min.js', 'pwa/maskable-512.png']) assert.ok(urls.includes(new URL(file, scope).href), file);
  assert.ok(h.writes.every(request => request.credentials === 'omit' && request.redirect === 'error'));
  assert.ok(urls.every(url => !/\/(?:api|server|scripts|tests)\/|\.env/.test(url)));
  assert.match(h.created[0], /^senior-guide:\/guide\/:[a-f0-9]{20}$/);
  await h.fire('activate');
  assert.deepEqual(h.deletes, ['senior-guide:/guide/:older']);
  assert.equal(h.claimed(), true);
  assert.equal(h.activated(), false);
  h.fire('message', { data: { type: 'ACTIVATE_UPDATE' }, source: { type: 'serviceworker' } });
  assert.equal(h.activated(), false);
  h.fire('message', { data: { type: 'ACTIVATE_UPDATE' }, source: { type: 'window' } });
  assert.equal(h.activated(), true);
});

test('request routing preserves online 404s, falls back offline, and never intercepts APIs, ranged downloads, foreign origins or POST', async () => {
  const h = await harness();
  const request = (file, mode = 'navigate', method = 'GET', headers = {}) => ({
    url: new URL(file, scope).href, mode, method, headers: new Headers(headers),
  });
  h.reads.set(new URL('index.html', scope).href, new Response('cached guide'));
  h.reads.set(new URL('offline.html', scope).href, new Response('offline fallback'));
  assert.equal(await (await h.fire('fetch', { request: request('./?open=shortcut#prompts') })).text(), 'cached guide');
  assert.equal((await h.fire('fetch', { request: request('unknown') })).status, 404);
  h.goOffline();
  const fallback = await h.fire('fetch', { request: request('unknown/nested') });
  assert.equal(fallback.headers.get('location'), new URL('offline.html', scope).href);
  for (const req of [request('api/chat'), request('api/chat', 'cors', 'POST'), request(deck, 'cors', 'GET', { range: 'bytes=0-100' }), request('https://chatgpt.com/'), request('not-cached.js', 'cors')]) {
    assert.equal(h.fire('fetch', { request: req }), undefined);
  }
});
