// Registra e ativa o Service Worker imediatamente
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// O navegador exige a presença do listener de fetch para habilitar o PWA
self.addEventListener('fetch', (event) => {
  // Deixa as requisições passarem direto sem bloquear Supabase ou apis
  return;
});
