/* The build injects the release hash and exact files from the public output. */
const release = /* @RELEASE@ */ null;
const assets = /* @ASSETS@ */ [];
const scope = new URL(self.registration.scope);
const prefix = `senior-guide:${scope.pathname}:`;
const cacheName = prefix + release;
const urlFor = file => new URL(file, scope).href;
const known = new Set(assets.map(urlFor));
const shell = urlFor('index.html');
const offline = urlFor('offline.html');

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    // Download a complete snapshot. A failed asset prevents activation.
    await cache.addAll([...known].map(url => new Request(url, { cache: 'reload', redirect: 'error', credentials: 'omit' })));
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const entries = await caches.keys();
    await Promise.all(entries.filter(name => name.startsWith(prefix) && name !== cacheName).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data?.type === 'ACTIVATE_UPDATE' && event.source?.type === 'window') event.waitUntil(self.skipWaiting());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname) || request.headers.has('range')) return;
  // No API requests, private responses, third-party URLs or unlisted assets enter the cache.
  if (url.pathname.startsWith(new URL('api/', scope).pathname)) return;
  const navigation = request.mode === 'navigate';
  const entry = navigation && (url.pathname === scope.pathname || url.pathname === new URL(shell).pathname);
  if (entry) {
    event.respondWith(caches.open(cacheName).then(async cache => (await cache.match(shell)) || fetch(request)));
  } else if (known.has(url.href)) {
    event.respondWith(caches.open(cacheName).then(async cache => (await cache.match(url.href)) || fetch(request)));
  } else if (navigation) {
    event.respondWith(fetch(request).catch(async () => {
      const cache = await caches.open(cacheName);
      return (await cache.match(offline)) ? Response.redirect(offline) : Response.error();
    }));
  }
});
