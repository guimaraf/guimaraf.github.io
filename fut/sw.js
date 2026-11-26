// Minimal service worker: exists only so the browser offers "install app".
// It never uses Cache Storage: every request goes to the network so new builds are always picked up.
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) { return Promise.all(keys.map(function (k) { return caches.delete(k); })); })
      .then(function () { return self.clients.claim(); })
  );
});
// Pass-through: the handler is required by some browsers for installability; it does not respond, so the browser fetches normally.
self.addEventListener('fetch', function () { });
