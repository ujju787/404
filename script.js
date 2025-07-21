window.addEventListener('offline', () => {
    document.getElementById('offline-msg').style.display = 'block';
    document.getElementById("main").style.display="none"
  });
  window.addEventListener('online', () => {
    document.getElementById('offline-msg').style.display = 'none';
    document.getElementById("main").style.display="block"
  });
  const swCode = `
  const CACHE_NAME = 'simple-site-cache-v1';
  const OFFLINE_URL = '/';

  self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
        return cache.addAll([
          '/',
        ]);
      })
    );
    self.skipWaiting();
  });

  self.addEventListener('fetch', event => {
    event.respondWith(
      fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
      })
    );
  });

  self.addEventListener('activate', event => {
    event.waitUntil(
      caches.keys().then(keys => {
        return Promise.all(
          keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
        );
      })
    );
    self.clients.claim();
  });
`;

const blob = new Blob([swCode], { type: 'application/javascript' });
const swURL = URL.createObjectURL(blob);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(swURL)
    .then(() => console.log('Service Worker Registered'))
    .catch(err => console.error('SW Error:', err));
}