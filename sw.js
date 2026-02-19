// sw.js
const CACHE_NAME = 'ws-gestao-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/sw.js',
    'https://raw.githubusercontent.com/Welintons/Wsinfor/main/Gemini_Generated_Image_bqf58fbqf58fbqf5.png'
];

// Instalação do SW e cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(ASSETS))
        .then(() => self.skipWaiting())
    );
});

// Ativação do SW e limpeza de caches antigos
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => 
            Promise.all(keys.map(key => {
                if (key !== CACHE_NAME) return caches.delete(key);
            }))
        )
    );
    self.clients.claim();
});

// Intercepta requisições e retorna do cache se disponível
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(res => res || fetch(event.request))
    );
});
