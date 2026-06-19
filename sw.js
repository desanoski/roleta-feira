/* Service Worker - cache total para funcionar 100% offline */
const CACHE = "roleta-v11";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon.svg",
  "./assets/instagram.png",
  "./sons/roleta.mp3",
  "./sons/ganhou.mp3",
  "./sons/naofoi.mp3",
  "./sons/novamente.mp3",
  "./assets/resultado/ganhou.png",
  "./assets/resultado/naofoi.png",
  "./assets/resultado/novamente.png",
  "./assets/fundo.gif",
  "./assets/roleta.png",
  "./assets/marcas.png",
  "./assets/ponteiro.png",
  "./assets/botao.png",
  "./img/pretinho5l.png",
  "./img/shine.png",
  "./img/airpro.png",
  "./img/pretinho2l.png",
  "./img/bone.png",
  "./img/copo.png",
  "./img/pincel.png",
  "./img/luva.png",
  "./img/pano.png",
  "./img/panoduplo.png"
];

// Instala e guarda os arquivos no cache
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// Limpa caches antigos
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Cache-first: serve do cache; cai pra rede só se não tiver.
// Inclui as imagens da pasta img/ assim que forem usadas pela 1ª vez.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        return resp;
      }).catch(() => cached);
    })
  );
});
