/*
 * Les Champions des nombres : mise en cache pour jouer sans réseau.
 * Changer VERSION à chaque mise en ligne force la mise à jour du cache.
 */
const VERSION = 'champions-nombres-v1';
const BASE = new URL('./', self.location).href;
const POLICES = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];

// Au premier passage : la page, l'icône, le manifeste et les fichiers du jeu cités par index.html.
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(VERSION);
      const base = ['./', './index.html', './favicon.svg', './manifest.webmanifest', './icone-192.png', './icone-512.png'];
      await cache.addAll(base).catch(() => {});
      try {
        const html = await (await fetch('./index.html', { cache: 'no-cache' })).text();
        const fichiers = [...html.matchAll(/(?:src|href)="(\.\/assets\/[^"]+)"/g)].map((m) => m[1]);
        await cache.addAll(fichiers);
      } catch {
        /* les fichiers seront mis en cache au fil de l'eau */
      }
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cles = await caches.keys();
      await Promise.all(cles.filter((c) => c.startsWith('champions-nombres') && c !== VERSION).map((c) => caches.delete(c)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = req.url;

  // Pages : réseau d'abord (pour avoir la dernière version), cache si pas de réseau.
  if (req.mode === 'navigate' && url.startsWith(BASE)) {
    event.respondWith(
      (async () => {
        try {
          const rep = await fetch(req);
          const cache = await caches.open(VERSION);
          cache.put('./index.html', rep.clone());
          return rep;
        } catch {
          return (await caches.match('./index.html')) || (await caches.match('./')) || Response.error();
        }
      })(),
    );
    return;
  }

  // Fichiers du jeu et polices : cache d'abord, réseau sinon (et on garde une copie).
  if (url.startsWith(BASE) || POLICES.some((p) => url.startsWith(p))) {
    event.respondWith(
      (async () => {
        const deja = await caches.match(req);
        if (deja) return deja;
        try {
          const rep = await fetch(req);
          if (rep.ok || rep.type === 'opaque') {
            const cache = await caches.open(VERSION);
            cache.put(req, rep.clone());
          }
          return rep;
        } catch {
          return Response.error();
        }
      })(),
    );
  }
});
