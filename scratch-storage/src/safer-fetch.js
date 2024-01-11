/* eslint-disable no-use-before-define */

const {scratchFetch} = require('./scratchFetch');

// This throttles and retries scratchFetch() to mitigate the effect of random network errors and
// random browser errors (especially in Chrome)

let currentFetches = 0;
const queue = [];

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const startNextFetch = ([resolve, url, options]) => {
    let firstError;
    let failedAttempts = 0;

    const done = result => {
        currentFetches--;
        checkStartNextFetch();
        resolve(result);
    };

    const attemptToFetch = () => scratchFetch(url, options)
        .then(done)
        .catch(error => {
            // If fetch() errors, it means there was a network error of some sort.
            // This is worth retrying, especially as some browser will randomly fail requests
            // if we send too many at once (as we do).

            console.warn(`Attempt to fetch ${url} failed`, error);
            if (!firstError) {
                firstError = error;
            }

            if (failedAttempts < 2) {
                failedAttempts++;
                sleep((failedAttempts + Math.random() - 1) * 5000).then(attemptToFetch);
                return;
            }

            done(Promise.reject(firstError));
        });

    attemptToFetch();
};

const checkStartNextFetch = () => {
    if (currentFetches < 100 && queue.length > 0) {
        currentFetches++;
        startNextFetch(queue.shift());
    }
};

const saferFetch = (url, options) => new Promise(resolve => {
    queue.push([resolve, url, options]);
    checkStartNextFetch();
});

module.exports = saferFetch;
