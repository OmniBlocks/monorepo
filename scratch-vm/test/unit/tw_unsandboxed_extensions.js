const tap = require('tap');
const UnsandboxedExtensionRunner = require('../../src/extension-support/tw-unsandboxed-extension-runner');

// Mock enough of the document API for the extension runner to think it works.
// To more accurately test this, we want to make sure that the URLs we pass in are just strings.
// We use a bit of hacky state here to make our document mock know what function to run
// when a script with a given URL "loads"
const scriptCallbacks = new Map();
const setScript = (src, callback) => {
    scriptCallbacks.set(src, callback);
};
global.document = {
    createElement: tagName => {
        if (tagName.toLowerCase() !== 'script') {
            throw new Error(`Unknown element: ${tagName}`);
        }
        return {
            tagName: 'SCRIPT',
            src: '',
            onload: () => {},
            onerror: () => {}
        };
    },
    body: {
        appendChild: element => {
            if (element.tagName === 'SCRIPT') {
                setTimeout(() => {
                    const callback = scriptCallbacks.get(element.src);
                    if (callback) {
                        callback();
                        element.onload();
                    } else {
                        element.onerror();
                    }
                }, 50);
            }
        }
    }
};

const mockVM = () => ({
    runtime: {
        renderer: {}
    }
});

tap.afterEach(() => {
    scriptCallbacks.clear();
});

const {test} = tap;

test('basic API', async t => {
    t.plan(6);
    const vm = mockVM();
    setScript('https://turbowarp.org/1.js', () => {
        t.equal(global.Scratch.vm, vm);
        t.equal(global.Scratch.renderer, vm.runtime.renderer);
        t.equal(global.Scratch.extensions.unsandboxed, true);
        t.equal(global.Scratch.ArgumentType.NUMBER, 'number');
        t.equal(global.Scratch.BlockType.REPORTER, 'reporter');
        t.equal(global.Scratch.TargetType.SPRITE, 'sprite');
        global.Scratch.extensions.register({});
    });
    await UnsandboxedExtensionRunner.load('https://turbowarp.org/1.js', vm);
    t.end();
});

test('multiple extensions', async t => {
    const vm = mockVM();

    let api1 = null;
    setScript('https://turbowarp.org/1.js', async () => {
        // Even if this extension takes a while to run, we should still have our own
        // global.Scratch.
        await new Promise(resolve => setTimeout(resolve, 200));

        if (api1) throw new Error('already ran 1');
        api1 = global.Scratch;
        global.Scratch.extensions.register({});
    });

    let api2 = null;
    setScript('https://turbowarp.org/2.js', () => {
        if (api2) throw new Error('already ran 2');
        api2 = global.Scratch;
        global.Scratch.extensions.register({});
    });

    await Promise.all([
        UnsandboxedExtensionRunner.load('https://turbowarp.org/1.js', vm),
        UnsandboxedExtensionRunner.load('https://turbowarp.org/2.js', vm)
    ]);

    t.type(api1.extensions.register, 'function');
    t.type(api2.extensions.register, 'function');
    t.not(api1, api2);
    t.end();
});

test('extension error results in rejection', async t => {
    const vm = mockVM();
    try {
        await UnsandboxedExtensionRunner.load('https://turbowarp.org/404.js', vm);
        // Above should throw an error as the script will not load successfully
        t.fail();
    } catch (e) {
        t.pass();
    }
    t.end();
});
