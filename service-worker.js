
const CACHE_NAME = 'kutiva-biblioteca-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/biblioteca.html',
  '/login.html',
  '/signup.html',
  '/categoria.html',
  '/css/styles.css',
  '/css/biblioteca.css',
  '/css/auth.css',
  '/css/signup.css',
  '/js/main.js',
  '/js/biblioteca.js',
  '/js/api-config.js',
  '/js/firebase-config.js',
  '/js/signup.js',
  '/icon/book.png',
  '/icon/library.png',
  '/icon/user.png',
  '/manifest.json'
];

// Instalar Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar requests
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Retorna cache se encontrado
        if (response) {
          return response;
        }
        
        // Senão, faz fetch da rede
        return fetch(event.request).then(
          function(response) {
            // Verifica se recebemos uma resposta válida
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone da resposta
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

// Ativar Service Worker
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Sincronização em background
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Implementar sincronização de dados offline
  return new Promise(function(resolve, reject) {
    // Sync logic aqui
    resolve();
  });
}
