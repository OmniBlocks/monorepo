const {EventEmitter} = require('events');

/**
 * omni: Await an EventEmitter.
 * @param {EventEmitter} event - An EventEmitter.
 * @param {string} eventName - The event you want to listen for.
 * @returns {Promise<any[]>} The data transmitted over the listener.
 */
const awaitEvent = (event, eventName) => new Promise((resolve, reject) => {
    if (!(event instanceof EventEmitter)) reject(new TypeError('"event" must be an instance of EventEmitter.'));
    if (typeof eventName !== 'string') reject(new TypeError('"eventName" must be a string.'));

    const listener = (...data) => {
        event.removeListener(eventName, listener);
        resolve(data);
    };
    event.on(eventName, listener);
});

module.exports = awaitEvent;
