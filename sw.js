const CACHE_NAME = 'japan-pocket-v1';
const assetsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js'
];

// התקנה ושמירה במטמון
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
  self.skipWaiting();
});

// הפעלה וניקוי מטמון ישן
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// שליפת נתונים - קודם ברשת, ואם אין רשת (אין Wi-Fi) לוקח מהזיכרון המקום
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // אם יש אינטרנט, מעדכן את המטמון בשקט
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // אם אין אינטרנט, מחזיר מיד את הגרסה האחרונה שנשמרה
        return caches.match(e.request);
      })
  );
});