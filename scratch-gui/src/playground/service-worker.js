// These will be replaced at build-time by generate-service-worker-plugin.js
const EDITOR_ASSETS = [/* __EDITOR_ASSETS__ */];
const CACHE_NAME = '__CACHE_NAME__';

const base = location.pathname.substr(0, location.pathname.indexOf('sw.js'));

self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(keys.filter(i => i !== CACHE_NAME).map(i => caches.delete(i))))
    );
});

self.addEventListener('message', event => {
    if (event.data === 'entered-editor') {
        caches.open(CACHE_NAME).then(cache => cache.addAll(EDITOR_ASSETS));
    }
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    if (url.origin !== location.origin) return;
    if (event.request.method !== 'GET') return;

    event.respondWith(fetch(event.request).catch(() => {
        let rewrite;
        const pathname = url.pathname.substr(base.length);
        if (/^(\d+\/?)?$/.test(pathname)) {
            rewrite = 'index.html';
        } else if (/^(\d+\/)?editor\/?$/i.test(pathname)) {
            rewrite = 'editor.html';
        } else if (/^(\d+\/)?fullscreen\/?$/i.test(pathname)) {
            rewrite = 'fullscreen.html';
        } else if (/^addons\/?$/i.test(pathname)) {
            rewrite = 'addons.html';
        }
        if (rewrite) {
            return caches.match(new Request(rewrite));
        }
        return caches.match(event.request);
    }));
});
