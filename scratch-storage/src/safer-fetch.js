/* eslint-env browser */
/* eslint-disable no-use-before-define */

// This throttles and retries fetch() to mitigate the effect of random network errors and
// random browser errors (especially in Chrome)

const log = require('./log');

let currentFetches = 0;
const queue = [];

const startNextFetch = async ({resolve, reject, args}) => {
    let firstError;
    let result;
    for (let i = 0; i < 3; i++) {
        try {
            const response = await fetch(...args);
            result = await response.arrayBuffer();
            break;
        } catch (e) {
            log.warn(e);
            if (!firstError) {
                firstError = e;
            }
            await new Promise(cb => setTimeout(cb, (i + Math.random()) * 5000));
        }
    }
    currentFetches--;
    if (result) {
        resolve(result);
    } else {
        reject(firstError);
    }
    checkStartNextFetch();
};

const checkStartNextFetch = () => {
    if (currentFetches >= 100 || queue.length === 0) {
        return;
    }
    currentFetches++;
    startNextFetch(queue.shift());
};

const saferFetchAsArrayBuffer = (url, options) => new Promise((resolve, reject) => {
    queue.push({
        resolve,
        reject,
        args: [url, options]
    });
    checkStartNextFetch();
});

module.exports = saferFetchAsArrayBuffer;
