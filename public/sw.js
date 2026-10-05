// 오프라인 지원 서비스 워커. 데이터는 모두 IndexedDB에 있으므로 여기서는 앱 화면(HTML)과
// 정적 파일만 캐시한다. 캐시 구조를 바꿀 때는 CACHE_VERSION을 올려 이전 캐시를 지운다.
const CACHE_VERSION = 'v1';
const PAGE_CACHE = `pages-${CACHE_VERSION}`;
const ASSET_CACHE = `assets-${CACHE_VERSION}`;
const APP_ROUTES = ['/', '/study', '/quiz', '/words'];
const STATIC_FILES = ['/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png'];

// Next.js 빌드 산출물(/_next/static/...)은 파일명에 해시가 붙어 있어 미리 목록을 알 수 없다.
// 설치할 때 각 화면의 HTML을 받아 그 안에서 참조하는 정적 파일 경로를 찾아 함께 캐시해 두면,
// 첫 방문 직후 오프라인이 되어도 아직 열어 보지 않은 화면까지 열 수 있다.
const STATIC_ASSET_PATTERN = /\/_next\/static\/[^"'\s)\\]+/g;

async function precache() {
  const pages = await caches.open(PAGE_CACHE);
  const assets = await caches.open(ASSET_CACHE);
  await Promise.all(
    APP_ROUTES.map(async (route) => {
      const response = await fetch(route, { cache: 'reload' });
      if (!response.ok) throw new Error(`precache failed: ${route}`);
      const html = await response.clone().text();
      await pages.put(route, response);
      const urls = [...new Set(html.match(STATIC_ASSET_PATTERN) ?? [])];
      await assets.addAll(urls);
    }),
  );
  await assets.addAll(STATIC_FILES);
}

self.addEventListener('install', (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keep = new Set([PAGE_CACHE, ASSET_CACHE]);
      const names = await caches.keys();
      await Promise.all(names.filter((name) => !keep.has(name)).map((name) => caches.delete(name)));
      await self.clients.claim();
    })(),
  );
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) (await caches.open(ASSET_CACHE)).put(request, response.clone());
  return response;
}

// 화면은 항상 최신 배포를 먼저 시도하고, 네트워크가 없을 때만 캐시된 HTML을 쓴다.
async function networkFirstPage(request) {
  const url = new URL(request.url);
  try {
    const response = await fetch(request);
    if (response.ok) (await caches.open(PAGE_CACHE)).put(url.pathname, response.clone());
    return response;
  } catch (error) {
    const cached = (await caches.match(url.pathname, { ignoreSearch: true })) ?? (await caches.match('/'));
    if (cached) return cached;
    throw error;
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => undefined);
  return cached ?? (await network) ?? Response.error();
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname === '/sw.js') return;

  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request));
    return;
  }
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstPage(request));
    return;
  }
  // 클라이언트 내비게이션용 RSC 요청은 캐시하지 않는다. 오프라인에서 실패하면 Next.js가
  // 일반 페이지 이동으로 바꿔 다시 요청하고, 그때 위의 캐시된 HTML이 쓰인다.
  if (request.headers.get('RSC') === '1' || url.searchParams.has('_rsc')) return;

  event.respondWith(staleWhileRevalidate(request));
});
