// Service Worker for OmniBlocks - Full Offline PWA Support
const CACHE_NAME = 'omniblocks-v1';
const STATIC_CACHE = 'omniblocks-static-v1';
const DYNAMIC_CACHE = 'omniblocks-dynamic-v1';

// Resources to cache immediately on install
const STATIC_ASSETS = [
    '/',
    '/editor.html',
    '/index.html',
    '/fullscreen.html',
    '/embed.html',
    '/offline.html',
    '/static/manifest.webmanifest',
    '/static/favicon.ico',
    '/static/icon_32.png',
    '/static/icon_maskable_192.png',
    '/static/images/192.png',
    '/static/images/512.png',
    '/static/beepbox_editor.min.js',
    '/static/beepbox_synth.min.js',
    '/static/beepbox_player.min.js',
    '/static/DeterminationMono.ttf',
    '/static/images/boxy-sad.svg'
];

// External resources to cache
const EXTERNAL_RESOURCES = [
    'https://code.jquery.com/jquery-3.4.1.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.7/css/select2.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.7/js/select2.min.js'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('[SW] Installing service worker...');
    
    event.waitUntil(
        Promise.all([
            // Cache static assets
            caches.open(STATIC_CACHE).then(cache => {
                console.log('[SW] Caching static assets...');
                // Cache critical assets first
                return cache.addAll(STATIC_ASSETS).then(() => {
                    // Try to cache external resources, but don't fail if unavailable
                    return Promise.allSettled(
                        EXTERNAL_RESOURCES.map(url => 
                            cache.add(url).catch(err => 
                                console.warn('[SW] Failed to cache optional resource:', url, err)
                            )
                        )
                    );
                });
            })
        ]).then(() => {
            console.log('[SW] Installation complete');
            // Take control immediately
            self.skipWaiting();
        }).catch(error => {
            console.error('[SW] Installation failed:', error);
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('[SW] Activating service worker...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Delete old cache versions
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== CACHE_NAME) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
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
    
    event.respondWith(
        handleRequest(request)
    );
});

async function handleRequest(request) {
    const url = new URL(request.url);
    
    try {
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
        return await getOfflineFallback(request);
    }
}

// Cache-first strategy: Check cache first, then network
async function cacheFirst(request, cacheName) {
    const cachedResponse = await caches.match(request);
    
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
async function networkFirst(request, cacheName) {
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
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        throw error;
    }
}

// Check if request is for a static asset
function isStaticAsset(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    return (
        pathname.includes('/static/') ||
        pathname.endsWith('.js') ||
        pathname.endsWith('.css') ||
        pathname.endsWith('.png') ||
        pathname.endsWith('.jpg') ||
        pathname.endsWith('.jpeg') ||
        pathname.endsWith('.gif') ||
        pathname.endsWith('.svg') ||
        pathname.endsWith('.ico') ||
        pathname.endsWith('.woff') ||
        pathname.endsWith('.woff2') ||
        pathname.endsWith('.ttf') ||
        pathname.endsWith('.eot') ||
        pathname.includes('jquery') ||
        pathname.includes('select2')
    );
}

// Check if request is for an HTML page
function isHTMLPage(request) {
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

// Check if request is for dynamic content
function isDynamicContent(request) {
    const url = new URL(request.url);
    
    return (
        url.pathname.includes('/api/') ||
        url.pathname.includes('/projects/') ||
        url.searchParams.has('project') ||
        request.headers.get('accept')?.includes('application/json')
    );
}

// Get offline fallback for failed requests
async function getOfflineFallback(request) {
    const url = new URL(request.url);
    
    // For HTML pages, try to serve a cached page or offline page
    if (isHTMLPage(request)) {
        // Try to serve the main editor page as fallback
        const fallbackResponse = await caches.match('/editor.html') || 
                                 await caches.match('/index.html') ||
                                 await caches.match('/') ||
                                 await caches.match('/offline.html');
        
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
                        font-family: Arial, sans-serif; 
                        text-align: center; 
                        padding: 2rem; 
                        background: #333; 
                        color: white; 
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        margin: 0;
                    }
                    h1 { color: #9c64f7; margin-bottom: 1rem; }
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
                        background: #9c64f7;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 1rem;
                        margin: 0.5rem;
                    }
                    button:hover {
                        background: #8b5cf6;
                    }
                </style>
            </head>
            <body>
                <h1>You're Offline</h1>
                <p>Sorry! OmniBlocks doesn't seem to be working offline right now.</p>
                <div class="images">
                    <img src="/static/favicon.ico" alt="OmniBlocks Logo" class="logo">
                    <img src="/static/images/boxy-sad.svg" alt="Boxy Sad" class="boxy-sad">
                </div>
                <button onclick="history.back()">Go Back</button>
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

// Background sync for saving user data when back online
self.addEventListener('sync', event => {
    console.log('[SW] Background sync triggered:', event.tag);
    
    if (event.tag === 'save-project') {
        event.waitUntil(syncProjectData());
    }
});

// Sync project data when back online
async function syncProjectData() {
    try {
        // This would integrate with the application's project saving mechanism
        console.log('[SW] Syncing project data...');
        
        // Get pending saves from IndexedDB
        const pendingSaves = await getPendingSaves();
        
        for (const save of pendingSaves) {
            try {
                // Attempt to save to server
                const response = await fetch('/api/projects/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(save.data)
                });
                
                if (response.ok) {
                    // Remove from pending saves
                    await removePendingSave(save.id);
                    console.log('[SW] Synced project:', save.id);
                } else {
                    console.error('[SW] Server rejected project sync:', save.id, response.status);
                }
            } catch (error) {
                console.error('[SW] Failed to sync project:', save.id, error);
            }
        }
    } catch (error) {
        console.error('[SW] Background sync failed:', error);
    }
}

/*
 * ⚠️  CRITICAL: CODE DUPLICATION WARNING ⚠️
 * 
 * The IndexedDB operations below (getPendingSaves, removePendingSave) intentionally
 * duplicate schema and logic from src/lib/offline-storage.js due to service worker
 * module import limitations. Service workers cannot directly import ES modules from
 * the main application context.
 * 
 * CANONICAL SCHEMA LOCATION: src/lib/offline-storage.js (lines 6-9, 183-224)
 * 
 * SHARED CONSTANTS THAT MUST BE KEPT IN SYNC:
 * - DB_NAME: 'OmniBlocksOfflineDB'
 * - DB_VERSION: 1
 * - PENDING_SAVES_STORE: 'pendingSaves'
 * 
 * RECOMMENDED ALTERNATIVES FOR FUTURE REFACTORING:
 * 1. Message-based communication: Service worker sends messages to main thread
 *    to perform IndexedDB operations via the offline-storage module
 * 2. Extract shared constants to a separate file that both main and SW can reference
 * 3. Use importScripts() to load a shared IndexedDB utility (if compatible)
 * 
 * ⚠️  ANY SCHEMA CHANGES MUST BE SYNCHRONIZED BETWEEN BOTH FILES ⚠️
 * 
 * TODO: Refactor to use message-based communication with main thread
 */
async function getPendingSaves() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('OmniBlocksOfflineDB', 1);
        
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(['pendingSaves'], 'readonly');
            const store = transaction.objectStore('pendingSaves');
            const getAllRequest = store.getAll();
            
            getAllRequest.onsuccess = () => {
                resolve(getAllRequest.result);
            };
            
            getAllRequest.onerror = () => {
                reject(getAllRequest.error);
            };
        };
        
        request.onerror = () => {
            reject(request.error);
        };
    });
}

async function removePendingSave(id) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('OmniBlocksOfflineDB', 1);
        
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(['pendingSaves'], 'readwrite');
            const store = transaction.objectStore('pendingSaves');
            const deleteRequest = store.delete(id);
            
            deleteRequest.onsuccess = () => {
                console.log('[SW] Removing pending save:', id);
                resolve();
            };
            
            deleteRequest.onerror = () => {
                reject(deleteRequest.error);
            };
        };
        
        request.onerror = () => {
            reject(request.error);
        };
    });
}

// Handle push notifications (for future enhancement)
self.addEventListener('push', event => {
    console.log('[SW] Push notification received');
    
    const options = {
        body: 'Your project has been saved successfully!',
        icon: '/static/icon_maskable_192.png',
        badge: '/static/icon_32.png',
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
        clients.openWindow('/editor.html')
    );
});
