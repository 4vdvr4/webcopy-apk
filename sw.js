const CACHE = 'webcopy-v2';
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['/', '/manifest.json', '/icons/icon-192.png', '/icons/icon-512.png'])));
});
self.addEventListener('activate', e => {
  e.waitUntil(clients.claim().then(() => caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))));
});
self.addEventListener('fetch', e => {
  if (e.request.url.includes('api.bilibili.com') || e.request.url.includes('iesdouyin.com')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(
    fetch(e.request).then(r => { const c = caches.open(CACHE); c.then(cache => cache.put(e.request, r.clone())); return r; })
      .catch(() => caches.match(e.request))
  );
});
