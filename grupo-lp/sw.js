/* Grupo LP – Simulador Empresarial · Service Worker (v5) */
const CACHE = 'grupo-lp-v29';
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
  './v28.js','./v29.js',
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
