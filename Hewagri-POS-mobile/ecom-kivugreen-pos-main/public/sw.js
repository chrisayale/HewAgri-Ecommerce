// Service Worker pour HewAgri POS PWA
// Généré automatiquement - ne pas modifier manuellement

const CACHE_NAME = 'hewagri-pos-v1.0.1';
const STATIC_CACHE = 'hewagri-pos-static-v1.0.1';
const DYNAMIC_CACHE = 'hewagri-pos-dynamic-v1.0.1';
const API_CACHE = 'hewagri-pos-api-v1.0.1';

// Assets statiques à mettre en cache immédiatement
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/favicon.png',
];

// Stratégies de cache
const CACHE_STRATEGIES = {
  // Cache First - pour les assets statiques (JS, CSS, images, fonts)
  cacheFirst: async (request, cacheName) => {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      return new Response('Offline', { status: 503 });
    }
  },

  // Network First - pour les appels API
  networkFirst: async (request, cacheName) => {
    const cache = await caches.open(cacheName);

    try {
      const response = await fetch(request);
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      const cached = await cache.match(request);
      if (cached) return cached;
      return new Response(JSON.stringify({
        error: 'Offline',
        message: 'Données non disponibles hors ligne'
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },

  // Stale While Revalidate - pour les ressources semi-dynamiques
  staleWhileRevalidate: async (request, cacheName) => {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    const fetchPromise = fetch(request).then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    }).catch(() => cached);

    return cached || fetchPromise;
  }
};

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installation...');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Mise en cache des assets statiques');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Installation terminée');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Erreur installation:', error);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              // Supprimer les anciens caches
              return name !== STATIC_CACHE &&
                     name !== DYNAMIC_CACHE &&
                     name !== API_CACHE &&
                     name.startsWith('hewagri-pos-');
            })
            .map((name) => {
              console.log('[SW] Suppression ancien cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Activation terminée');
        return self.clients.claim();
      })
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-HTTP
  if (!request.url.startsWith('http')) return;

  // Ignorer les requêtes Chrome Extension
  if (url.protocol === 'chrome-extension:') return;

  // Stratégie selon le type de ressource
  if (isStaticAsset(request)) {
    // Assets statiques: Cache First
    event.respondWith(CACHE_STRATEGIES.cacheFirst(request, STATIC_CACHE));
  } else if (isAPIRequest(request)) {
    // API: Network First avec fallback offline
    event.respondWith(CACHE_STRATEGIES.networkFirst(request, API_CACHE));
  } else if (isNavigationRequest(request)) {
    // Navigation: Network First avec fallback vers index.html (SPA)
    event.respondWith(handleNavigation(request));
  } else {
    // Autres: Stale While Revalidate
    event.respondWith(CACHE_STRATEGIES.staleWhileRevalidate(request, DYNAMIC_CACHE));
  }
});

// Gestion de la navigation (SPA fallback)
async function handleNavigation(request) {
  const cache = await caches.open(STATIC_CACHE);

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Fallback vers index.html pour les routes SPA
    const cached = await cache.match('/index.html');
    if (cached) return cached;
    return new Response('Offline', { status: 503 });
  }
}

// Détecter les assets statiques
function isStaticAsset(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Extensions de fichiers statiques
  const staticExtensions = [
    '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp',
    '.woff', '.woff2', '.ttf', '.eot', '.otf',
    '.ico', '.json', '.xml', '.txt',
    '.map', '.wasm'
  ];

  return staticExtensions.some(ext => pathname.endsWith(ext));
}

// Détecter les requêtes API
function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/') ||
         url.hostname.includes('api.') ||
         url.searchParams.has('api');
}

// Détecter les requêtes de navigation
function isNavigationRequest(request) {
  return request.mode === 'navigate' ||
         (request.method === 'GET' &&
          request.headers.get('accept')?.includes('text/html'));
}

// Gestion des messages du client
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }

  if (event.data === 'clearCache') {
    clearAllCaches().then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }

  if (event.data?.type === 'cacheReceipt') {
    // Mettre en cache un reçu pour impression hors ligne
    cacheReceipt(event.data.receipt).then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
});

// Nettoyer tous les caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
      .filter(name => name.startsWith('hewagri-pos-'))
      .map(name => caches.delete(name))
  );
}

// Mettre en cache un reçu pour impression hors ligne
async function cacheReceipt(receipt) {
  const cache = await caches.open(API_CACHE);
  const url = `/api/receipts/${receipt.transaction}`;
  const response = new Response(JSON.stringify(receipt), {
    headers: { 'Content-Type': 'application/json' }
  });
  await cache.put(url, response);
}

// Synchronisation en arrière-plan (Background Sync)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-orders') {
    event.waitUntil(syncPendingOrders());
  }

  if (event.tag === 'sync-receipts') {
    event.waitUntil(syncPendingReceipts());
  }
});

// Synchroniser les commandes en attente
async function syncPendingOrders() {
  try {
    const db = await openIndexedDB();
    const pendingOrders = await getPendingOrders(db);

    for (const order of pendingOrders) {
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order.data)
        });

        if (response.ok) {
          await removePendingOrder(db, order.id);
        }
      } catch (error) {
        console.log('[SW] Sync order failed:', order.id, error);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Synchroniser les reçus en attente
async function syncPendingReceipts() {
  try {
    const db = await openIndexedDB();
    const pendingReceipts = await getPendingReceipts(db);

    for (const receipt of pendingReceipts) {
      await cacheReceipt(receipt.data);
      await removePendingReceipt(db, receipt.id);
    }
  } catch (error) {
    console.error('[SW] Receipt sync failed:', error);
  }
}

// Helpers IndexedDB pour le SW
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('HewAgriPOS', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingOrders')) {
        db.createObjectStore('pendingOrders', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('pendingReceipts')) {
        db.createObjectStore('pendingReceipts', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

function getPendingOrders(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('pendingOrders', 'readonly');
    const store = tx.objectStore('pendingOrders');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function removePendingOrder(db, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('pendingOrders', 'readwrite');
    const store = tx.objectStore('pendingOrders');
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

function getPendingReceipts(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('pendingReceipts', 'readonly');
    const store = tx.objectStore('pendingReceipts');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function removePendingReceipt(db, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('pendingReceipts', 'readwrite');
    const store = tx.objectStore('pendingReceipts');
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Notification Push (optionnel)
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || 'Nouvelle notification HewAgri',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: data.data || {},
    actions: [
      { action: 'view', title: 'Voir' },
      { action: 'dismiss', title: 'Ignorer' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'HewAgri POS', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('[SW] Service Worker chargé - HewAgri POS PWA v1.0.1');