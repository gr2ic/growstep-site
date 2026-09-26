// Gerado por tools/build_pwa.mjs — não editar à mão.
const VERSION = 'growstep-0.15.0+15-1790434278168';
const PRECACHE = [
  "./",
  ".last_build_id",
  "assets/AssetManifest.bin",
  "assets/AssetManifest.bin.json",
  "assets/assets/brand/logo.png",
  "assets/assets/brand/symbol.png",
  "assets/FontManifest.json",
  "assets/fonts/fallback/Roboto-Regular.ttf",
  "assets/fonts/MaterialIcons-Regular.otf",
  "assets/NOTICES",
  "assets/packages/cupertino_icons/assets/CupertinoIcons.ttf",
  "assets/packages/flutter_local_notifications_web/web/notifications_service_worker.js",
  "assets/shaders/ink_sparkle.frag",
  "assets/shaders/stretch_effect.frag",
  "canvaskit/canvaskit.js",
  "canvaskit/canvaskit.wasm",
  "favicon.png",
  "flutter.js",
  "flutter_bootstrap.js",
  "icons/apple-touch-icon.png",
  "icons/Icon-192.png",
  "icons/Icon-512.png",
  "icons/Icon-maskable-192.png",
  "icons/Icon-maskable-512.png",
  "main.dart.js",
  "manifest.json",
  "sqflite_sw.js",
  "sqlite3.wasm"
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key !== VERSION) await caches.delete(key);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  // Só arquivos do próprio app. Nuvem (Supabase), login do Google etc. passam direto.
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  // Página do app: tenta a internet primeiro (pega versão nova), senão usa a guardada.
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(VERSION).then((c) => c.put('./', copy));
      return res;
    }).catch(() => caches.match('./')));
    return;
  }

  // Demais arquivos: guardado primeiro; o que vier da internet é guardado.
  event.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => {
    if (res.ok) {
      const copy = res.clone();
      caches.open(VERSION).then((c) => c.put(req, copy));
    }
    return res;
  })));
});
