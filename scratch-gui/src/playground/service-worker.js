// Service Worker for OmniBlocks - Full Offline PWA Support
/* eslint-disable func-style, require-jsdoc, no-use-before-define */
const CACHE_NAME = 'omniblocks-v1';
// bump to clear old entries with bad paths
const STATIC_CACHE = 'omniblocks-static-v5';
const DYNAMIC_CACHE = 'omniblocks-dynamic-v3';

// --- URL helpers: make all paths scope-relative so GH Pages subpaths work ---
const toRel = p => p.replace(/^\//, ''); // drop leading slash
const toURL = p => new URL(toRel(p), self.registration.scope).toString();
const mapURLs = arr => arr.map(toURL);

// Resources to cache immediately on install
// NOTE: keep these relative (no leading "/") and only include real files
const STATIC_ASSETS = mapURLs([
    // entry points
    'index.html', 'editor.html', 'fullscreen.html', 'embed.html', 'offline.html',
    // song editor (actual file)
    'songeditor.html',
    // data/sample bundles (in root of build)
    'nintaribox_samples.js',
    'mario_paintbox_samples.js',
    'kirby_samples.js',
    'drumsamples.js',
    'samples.js', 'samples2.js', 'samples3.js',
    'wario_samples.js',
    'privacy.html',
    // meta/icons (in root of build)
    'manifest.webmanifest', 'favicon.ico',
    'images/192.png', 'images/512.png',
    'sb3-icon-256.png', 'sb3-icon-512.png',
    // beepbox core (in root of build)
    'beepbox_editor.min.js',
    'beepbox_synth.min.js',
    // correct player file path
    'player/beepbox_player.min.js',
    // correct boxy-sad path (in root of build)
    'Boxy-sad.svg',
    // player copies (embed/player view)
    'player/samples.js', 'player/samples2.js', 'player/samples3.js',
    'player/wario_samples.js', 'player/nintaribox_samples.js',
    'player/kirby_samples.js', 'player/drumsamples.js',
    'player/mario_paintbox_samples.js'
]);

// canonical song editor URL for aliasing navigations
const CANONICAL_SONGEDITOR = toURL('songeditor.html');

// External resources to cache
const EXTERNAL_RESOURCES = [
    'https://code.jquery.com/jquery-3.4.1.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.7/css/select2.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.7/js/select2.min.js'
];

// Helper functions for request type detection (defined first to avoid "used before defined" errors)
function isHTMLPage (request) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    return (
        request.headers.get('accept')?.includes('text/html') ||
        pathname.endsWith('.html') ||
        pathname === '/' ||
        pathname.endsWith('/editor') ||
        pathname.endsWith('/fullscreen') ||
        pathname.endsWith('/embed')
    );
}

function isStaticAsset (request) {
    const u = new URL(request.url);
    // compare normalized absolute string URLs
    const requestURL = toURL(u.pathname);
    
    return (
        STATIC_ASSETS.includes(requestURL) ||
        u.pathname.includes('/static/') ||
        u.pathname.endsWith('.js') ||
        u.pathname.endsWith('.css') ||
        u.pathname.endsWith('.png') ||
        u.pathname.endsWith('.jpg') ||
        u.pathname.endsWith('.jpeg') ||
        u.pathname.endsWith('.gif') ||
        u.pathname.endsWith('.svg') ||
        u.pathname.endsWith('.ico') ||
        u.pathname.endsWith('.woff') ||
        u.pathname.endsWith('.woff2') ||
        u.pathname.endsWith('.ttf') ||
        u.pathname.endsWith('.eot')
    );
}

function isDynamicContent (request) {
    const url = new URL(request.url);
    
    return (
        url.pathname.includes('/api/') ||
        url.pathname.includes('/projects/') ||
        url.searchParams.has('project') ||
        request.headers.get('accept')?.includes('application/json')
    );
}

// Normalize URLs: handle routes with/without .html extension
function normalizeURL (url) {
    const urlObj = new URL(url);
    let pathname = urlObj.pathname;
    
    // Remove trailing slash (except for root)
    if (pathname !== '/' && pathname.endsWith('/')) {
        pathname = pathname.slice(0, -1);
        urlObj.pathname = pathname;
    }
    
    // If no extension and not a file, try .html
    if (!pathname.includes('.') && pathname !== '/') {
        urlObj.pathname = `${pathname}.html`;
        return urlObj.toString();
    }
    
    // Handle root
    if (pathname === '/') {
        urlObj.pathname = '/index.html';
        return urlObj.toString();
    }
    
    return urlObj.toString();
}

// Enhanced cache lookup that tries multiple URL variations
async function getCachedResponse (request) {
    const originalUrl = request.url;
    
    // Try exact match first
    let response = await caches.match(request);
    
    if (!response && isHTMLPage(request)) {
        // Try with .html extension
        const normalizedUrl = normalizeURL(originalUrl);
        if (normalizedUrl !== originalUrl) {
            response = await caches.match(normalizedUrl);
        }
    }
    
    if (!response) {
        // Try without .html extension (reverse normalization)
        if (originalUrl.endsWith('.html')) {
            const withoutHtml = originalUrl.replace(/\.html$/, '');
            response = await caches.match(withoutHtml);
        }
    }
    
    if (!response) {
        // Try without query params
        const urlWithoutParams = originalUrl.split('?')[0];
        if (urlWithoutParams !== originalUrl) {
            response = await caches.match(urlWithoutParams);
        }
    }
    
    return response;
}

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('[SW] Installing service worker...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE).then(async cache => {
            console.log('[SW] Caching static assets (resilient)...');

            // Cache static assets one-by-one and tolerate failures so
            // a single missing file won't fail the entire install.
            await Promise.allSettled(
                STATIC_ASSETS.map(url =>
                    cache.add(url).catch(err => {
                        console.warn('[SW] Failed to cache static asset:', url, err);
                    })
                )
            );

            // Try to cache external resources, but don't fail install if unavailable
            await Promise.allSettled(
                EXTERNAL_RESOURCES.map(url =>
                    cache.add(url).catch(err =>
                        console.warn('[SW] Failed to cache optional resource:', url, err)
                    )
                )
            );
        })
            .then(() => {
                console.log('[SW] Installation complete');
                // Take control immediately
                self.skipWaiting();
            })
            .catch(error => {
                console.error('[SW] Installation failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('[SW] Activating service worker...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => Promise.all(
            cacheNames.map(cacheName => {
                // Delete old cache versions
                if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== CACHE_NAME) {
                    console.log('[SW] Deleting old cache:', cacheName);
                    return caches.delete(cacheName);
                }
                return Promise.resolve();
            })
        ))
            .then(() => {
                console.log('[SW] Activation complete');
                // Take control of all clients immediately
                return self.clients.claim();
            })
    );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other non-http(s) requests
    if (!url.protocol.startsWith('http')) {
        return;
    }

    // Alias navigations for song editor routes to the actual static file
    if (request.mode === 'navigate') {
        const p = url.pathname.replace(/\/+$/, '');
        if (p.endsWith('/songeditor') || p.endsWith('/songeditor.html') || p.endsWith('/static/songeditor')) {
            event.respondWith(
                getCachedResponse(new Request(CANONICAL_SONGEDITOR)).then(hit => hit || fetch(CANONICAL_SONGEDITOR))
            );
            return;
        }
    }
    
    event.respondWith(
        handleRequest(request)
    );
});

async function handleRequest (request) {
    const url = new URL(request.url);
    
    try {
        // Network-first for JS files to ensure updates are reflected immediately
        if (url.pathname.endsWith('.js')) {
            return networkFirst(request, STATIC_CACHE);
        }
        // Strategy 1: Cache-first for static assets
        if (isStaticAsset(request)) {
            return await cacheFirst(request, STATIC_CACHE);
        }
        
        // Strategy 2: Network-first for HTML pages
        if (isHTMLPage(request)) {
            return await networkFirst(request, DYNAMIC_CACHE);
        }
        
        // Strategy 3: Network-first with cache fallback for API calls and dynamic content
        if (isDynamicContent(request)) {
            return await networkFirst(request, DYNAMIC_CACHE);
        }
        
        // Strategy 4: Network-first for everything else
        return await networkFirst(request, DYNAMIC_CACHE);
        
    } catch (error) {
        console.error('[SW] Request failed:', error);
        
        // Return offline fallback if available
        return getOfflineFallback(request);
    }
}

// Cache-first strategy: Check cache first, then network
async function cacheFirst (request, cacheName) {
    const cachedResponse = await getCachedResponse(request);
    
    if (cachedResponse) {
        console.log('[SW] Serving from cache:', request.url);
        return cachedResponse;
    }
    
    console.log('[SW] Fetching and caching:', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
        const cache = await caches.open(cacheName);
        cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
}

// Network-first strategy: Try network first, fallback to cache
async function networkFirst (request, cacheName) {
    try {
        console.log('[SW] Trying network first:', request.url);
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('[SW] Network failed, trying cache:', request.url);
        const cachedResponse = await getCachedResponse(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        throw error;
    }
}

// Get offline fallback for failed requests
async function getOfflineFallback (request) {
    // For HTML pages, try to serve a cached page or offline page
    if (isHTMLPage(request)) {
        // Try to serve the main editor page as fallback using enhanced cache lookup
        const fallbackResponse = await getCachedResponse(new Request(toURL('editor.html'))) ||
                                 await getCachedResponse(new Request(toURL('editor'))) ||
                                 await getCachedResponse(new Request(toURL('index.html'))) ||
                                 await getCachedResponse(new Request(toURL('/'))) ||
                                 await getCachedResponse(new Request(toURL('offline.html')));
        
        if (fallbackResponse) {
            return fallbackResponse;
        }
        
        // If no cached pages available, return a basic offline response
        return new Response(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Offline - OmniBlocks</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    body { 
                        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; 
                        text-align: center; 
                        padding: 2rem; 
                        background: #1e1e1e; 
                        color: white; 
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        margin: 0;
                    }
                    h1 { color: #59C0C0; margin-bottom: 1rem; }
                    p { line-height: 1.6; margin: 1rem 0; }
                    .images {
                        display: flex;
                        gap: 1rem;
                        margin: 2rem 0;
                        align-items: center;
                    }
                    .logo {
                        width: 80px;
                        height: 80px;
                        animation: bounce 2s infinite;
                    }
                    .boxy-sad {
                        width: 120px;
                        height: 120px;
                        animation: shake 0.5s ease-in-out infinite alternate;
                    }
                    @keyframes bounce {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-10px); }
                    }
                    @keyframes shake {
                        0% { transform: rotate(-5deg); }
                        100% { transform: rotate(5deg); }
                    }
                    button {
                        background: #59C0C0;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 1rem;
                        font-family: inherit;
                        transition: background-color 0.2s;
                        margin: 0.5rem;
                    }
                    button:hover {
                        background: #389499;
                    }
                </style>
            </head>
            <body>
                <h1>You're Offline</h1>
                <p>Sorry! OmniBlocks doesn't seem to be working offline right now.</p>
                <div class="images">
                    <img src="favicon.ico" alt="OmniBlocks Logo" class="logo">
                    <img src="Boxy-sad.svg" alt="Boxy Sad" class="boxy-sad">
                </div>
                <button onclick="location.href='/'">Go to Editor</button>
                <button onclick="location.reload()">Try Again</button>
            </body>
            </html>
        `, {
            status: 200,
            statusText: 'OK',
            headers: {
                'Content-Type': 'text/html'
            }
        });
    }
    
    // For other resources, return a generic offline response
    return new Response('Offline - Resource not available', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: {
            'Content-Type': 'text/plain'
        }
    });
}

// Handle push notifications (for future enhancement)
self.addEventListener('push', event => {
    console.log('[SW] Push notification received');
    
    const options = {
        body: 'Your project has been saved successfully!',
        icon: '/static/images/192.png',
        badge: '/static/favicon.ico',
        tag: 'project-saved'
    };
    
    event.waitUntil(
        self.registration.showNotification('OmniBlocks', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    console.log('[SW] Notification clicked');
    
    event.notification.close();
    
    event.waitUntil(
        self.clients.openWindow('/editor.html')
    );
});
