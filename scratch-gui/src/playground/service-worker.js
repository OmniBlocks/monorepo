// These will be replaced at build-time by generate-service-worker-plugin.js
const EDITOR_ASSETS = [/* __EDITOR_ASSETS__ */];
const CACHE_NAME = 'tw-editor';

const base = location.pathname.substr(0, location.pathname.indexOf('sw.js'));

// eslint-disable-next-line no-console
const log = (...args) => console.log('SW', ...args);

self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(Promise.all([
        // Remove unknown caches
        caches.keys()
            .then(keys => Promise.all(keys.filter(i => i !== CACHE_NAME).map(i => caches.delete(i)))),
        // Remove unknown paths from cache
        caches.open(CACHE_NAME)
            .then(cache => cache.keys().then(keys => Promise.all(
                keys.filter(request => {
                    const url = new URL(request.url);
                    const pathname = url.pathname.substr(base.length);
                    return !EDITOR_ASSETS.includes(pathname);
                }).map(request => {
                    log('Removing', request);
                    return cache.delete(request);
                })
            )))
    ]));
});

self.addEventListener('message', event => {
    if (event.data === 'entered-editor') {
        // Cache any unknown files
        caches.open(CACHE_NAME).then(cache => Promise.all(EDITOR_ASSETS.map(i => (
            cache.match(i)
                .then(response => {
                    if (response) {
                        log('Already cached', i);
                    } else {
                        log('Need to cache', i);
                        return cache.add(i);
                    }
                })
                .catch(() => {})
        ))));
    }
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    if (url.origin !== location.origin) return;
    if (event.request.method !== 'GET') return;

    event.respondWith(fetch(event.request).catch(fetchError => {
        const pathname = url.pathname.substr(base.length);
        let rewrite;
        if (/^(\d+\/?)?$/.test(pathname)) {
            rewrite = 'index.html';
        } else if (/^(\d+\/)?editor\/?$/i.test(pathname)) {
            rewrite = 'editor.html';
        } else if (/^(\d+\/)?fullscreen\/?$/i.test(pathname)) {
            rewrite = 'fullscreen.html';
        } else if (/^addons\/?$/i.test(pathname)) {
            rewrite = 'addons.html';
        }
        return caches.match(rewrite ? new Request(rewrite) : event.request)
            .catch(() => {
                throw fetchError;
            });
    }));
});
