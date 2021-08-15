import log from '../lib/log';
import serviceWorker from '!!file-loader?name=sw.js!./service-worker.js';

let loaded = false;
const actuallyLoadServiceWorker = () => {
    navigator.serviceWorker.register(serviceWorker)
        .catch(err => {
            log.error('sw error', err);
        });
};
const loadServiceWorker = () => {
    if (process.env.ENABLE_SERVICE_WORKER && 'serviceWorker' in navigator && !loaded) {
        loaded = true;
        if (document.readyState === 'complete') {
            actuallyLoadServiceWorker();
        } else {
            window.addEventListener('load', actuallyLoadServiceWorker);
        }
    }
};
let hasEnteredEditor = false;
const startCaching = () => {
    if (hasEnteredEditor) return;
    hasEnteredEditor = true;
    if (process.env.ENABLE_SERVICE_WORKER && 'serviceWorker' in navigator) {
        setTimeout(() => {
            navigator.serviceWorker.ready.then(({active}) => {
                active.postMessage('start-caching');
            });
        });
    }
};

export {
    loadServiceWorker,
    startCaching
};
