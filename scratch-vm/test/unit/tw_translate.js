const {test} = require('tap');
const Scratch3TranslateBlocks = require('../../src/extensions/scratch3_translate/index');

global.navigator = {
    language: 'en'
};

// Translate tries to access AbortController from window, but does not require it to exist.
global.window = {};

test('translate returns original string on network error', t => {
    t.plan(1);

    // Simulate the network being down or filtered
    global.fetch = () => Promise.reject(new Error('Simulated network error'));

    const extension = new Scratch3TranslateBlocks();
    extension.getTranslate({WORDS: 'My message 123123', LANGUAGE: 'es'})
        .then(message => {
            t.equal(message, 'My message 123123');
            t.end();
        });
});
