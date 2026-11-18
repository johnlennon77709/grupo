/* Grupo LP – Simulador Empresarial · Service Worker (v5) */
const CACHE = 'grupo-lp-v27';
const APP_SHELL = [
  './',
  './index.html',
  './v5.js',
  './v6neg.js',
  './v6col.js',
  './v6vis.js',
  './v7.js',
  './v8.js',
  './v8b.js',
  './v8c.js',
  './v9.js',
  './v9b.js',
  './v9c.js',
  './v10.js',
  './v11.js',
  './v12.js',
  './v13.js',
  './v14.js',
  './v15.js',
  './v16.js',
  './v17.js',
  './v18.js',
  './v19.js',
  './v20.js',
  './v21.js',
  './v22.js',
  './v23.js',
  './v24.js',
  './v25.js',
  './v26.js',
  './v27.js',
  './lp-icon-192.png',
  './lp-icon-512.png',
  './lp-icon-maskable-512.png',
  './lp-apple-touch-icon.png',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

// O app é um único index.html: navegações vão à rede primeiro, para que uma
// versão nova chegue sozinha; o cache só entra quando offline.
const isAppShell = (request, url) =>
  request.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('/index.html');

const guardavel = (response) =>
  response && response.status === 200 && response.type === 'basic';

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return; // API de sincronização: sempre rede

  if (isAppShell(request, url)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (guardavel(response)) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put('./index.html', copy));
          }
          return response;
        })
        .catch(() =>
          caches
            .match('./index.html')
            .then((cached) => cached || caches.match('./') || Response.error())
        )
    );
    return;
  }

  // Demais arquivos (.js, .css, imagens, manifest): cache primeiro, SEM ir à
  // rede a cada carregamento. Só busca na rede quando o arquivo não está no
  // cache — e aí guarda para as próximas visitas.
  event.respondWith(
    caches.match(request, { ignoreSearch: false }).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (guardavel(response)) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => Response.error());
    })
  );
});
