// Service Worker for jiayouvibe
// Cache strategy: stale-while-revalidate for navigation, cache-first for assets

const CACHE_NAME = 'jiayouvibe-v1';

const ASSET_CACHE = 'jiayouvibe-assets-v1';
const PAGE_CACHE = 'jiayouvibe-pages-v1';

// Assets to pre-cache on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
];

// ========== Install: pre-cache core assets ==========
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ========== Activate: clean old caches ==========
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME && key !== ASSET_CACHE && key !== PAGE_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ========== Helper: is a navigation request ==========
function isNavigation(request) {
  return request.mode === 'navigate';
}

// ========== Helper: is a static asset ==========
function isStaticAsset(url) {
  return (
    /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot)$/i.test(url) ||
    url.includes('/assets/')
  );
}

// ========== Fetch: stale-while-revalidate for nav, cache-first for assets ==========
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GET requests
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // --- Navigation: stale-while-revalidate ---
  if (isNavigation(request)) {
    event.respondWith(
      caches.open(PAGE_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          const fetched = fetch(request)
            .then((response) => {
              if (response.ok) {
                cache.put(request, response.clone());
              }
              return response;
            })
            .catch(() => cached || offlineFallback());
          return cached || fetched;
        })
      )
    );
    return;
  }

  // --- Static assets: cache-first ---
  if (isStaticAsset(url.pathname)) {
    event.respondWith(
      caches.open(ASSET_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          return (
            cached ||
            fetch(request).then((response) => {
              if (response.ok) {
                cache.put(request, response.clone());
              }
              return response;
            })
          );
        })
      )
    );
    return;
  }

  // --- Everything else: network-first with cache fallback ---
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// ========== Offline fallback ==========
function offlineFallback() {
  return new Response(
    `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>jiayouvibe - 离线模式</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem;
    }
    .container {
      text-align: center;
      max-width: 420px;
    }
    .icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
    }
    h1 {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
      background: linear-gradient(135deg, #00dbe7, #d1bcff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    p {
      color: #94a3b8;
      line-height: 1.7;
      font-size: 0.95rem;
    }
    .retry {
      display: inline-block;
      margin-top: 1.5rem;
      padding: 0.625rem 1.5rem;
      border-radius: 0.5rem;
      background: rgba(0, 219, 231, 0.15);
      color: #67e8f9;
      border: 1px solid rgba(0, 219, 231, 0.25);
      cursor: pointer;
      font-size: 0.9rem;
      transition: background 0.2s;
    }
    .retry:hover {
      background: rgba(0, 219, 231, 0.25);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">&#x1F310;</div>
    <h1>jiayouvibe</h1>
    <p>当前处于离线状态，请检查网络连接后重试。</p>
    <p style="margin-top:0.5rem;font-size:0.85rem;color:#64748b;">
      You are currently offline. Please check your internet connection and try again.
    </p>
    <button class="retry" onclick="location.reload()">重新连接 / Retry</button>
  </div>
</body>
</html>`,
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    }
  );
}
