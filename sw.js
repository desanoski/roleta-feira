/* Service Worker - cache total para funcionar 100% offline */
const CACHE = "roleta-v25";
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
  "./sons/tema.mp3",
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

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  const aceita = req.headers.get("accept") || "";
  const ehHTML = req.mode === "navigate" || aceita.includes("text/html");

  if (ehHTML) {
    // Rede-primeiro para a página: online sempre pega a versão nova;
    // offline cai para o cache.
    e.respondWith(
      fetch(req).then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return resp;
      }).catch(() => caches.match(req).then((r) => r || caches.match("./index.html")))
    );
    return;
  }

  // Resto (imagens, sons, etc.): cache-primeiro, cai pra rede se faltar.
  e.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return resp;
      }).catch(() => cached);
    })
  );
});
