import log from '../lib/log';
import serviceWorker from '!!file-loader?name=sw.js!./service-worker.js';

let loaded = false;
const actuallyLoadServiceWorker = () => {
    navigator.serviceWorker.register(serviceWorker)
        .then(registration => {
            log.info('Service worker registered successfully:', registration);
            
            // Listen for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New service worker is available
                            log.info('New service worker available');
                            
                            // Optionally notify user about update
                            if (window.showUpdateNotification) {
                                window.showUpdateNotification();
                            }
                        }
                    });
                }
            });
        })
        .catch(err => {
            log.error('Service worker registration failed:', err);
        });
};

const loadServiceWorker = () => {
    // Enable service worker by default in production, or when explicitly enabled
    const shouldEnableServiceWorker = 
        process.env.NODE_ENV === 'production' || 
        process.env.ENABLE_SERVICE_WORKER === 'true' ||
        process.env.ENABLE_SERVICE_WORKER === '1';
    
    if (shouldEnableServiceWorker && 'serviceWorker' in navigator && !loaded) {
        loaded = true;
        if (document.readyState === 'complete') {
            actuallyLoadServiceWorker();
        } else {
            window.addEventListener('load', actuallyLoadServiceWorker);
        }
    } else if (!('serviceWorker' in navigator)) {
        log.warn('Service workers are not supported in this browser');
    } else if (process.env.NODE_ENV !== 'production' && !process.env.ENABLE_SERVICE_WORKER) {
        log.info('Service worker disabled in development mode. Set ENABLE_SERVICE_WORKER=true to enable.');
    }
};

// Function to check if the app is running offline
const isOffline = () => {
    return !navigator.onLine;
};

// Function to show offline status
const showOfflineStatus = () => {
    if (window.showOfflineIndicator) {
        window.showOfflineIndicator(true);
    }
};

// Function to show online status
const showOnlineStatus = () => {
    if (window.showOfflineIndicator) {
        window.showOfflineIndicator(false);
    }
};

// Listen for online/offline events
if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
        log.info('App is back online');
        showOnlineStatus();
    });
    
    window.addEventListener('offline', () => {
        log.info('App is offline');
        showOfflineStatus();
    });
    
    // Check initial state
    if (isOffline()) {
        showOfflineStatus();
    }
}

export {
    loadServiceWorker,
    isOffline
};
