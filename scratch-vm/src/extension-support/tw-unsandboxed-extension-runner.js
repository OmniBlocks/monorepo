const ScratchCommon = require('./tw-extension-api-common');
const AsyncLimiter = require('../util/async-limiter');

/**
 * Sets up the global.Scratch API for an unsandboxed extension.
 * @param {VirtualMachine} vm
 * @returns {Promise<object[]>} Resolves with a list of extension objects when Scratch.extensions.register is called.
 */
const setupUnsandboxedExtensionAPI = vm => new Promise(resolve => {
    const extensionObjects = [];
    const register = extensionObject => {
        extensionObjects.push(extensionObject);
        resolve(extensionObjects);
    };

    // Create a new copy of global.Scratch for each extension
    global.Scratch = Object.assign({}, global.Scratch || {}, ScratchCommon);
    global.Scratch.extensions = {
        unsandboxed: true,
        register
    };

    global.Scratch.vm = vm;
    global.Scratch.renderer = vm.runtime.renderer;

    // This always returns a promise because the security manager may have asynchronous logic,
    // and we need to ensure that any users of this method will handle that.
    global.Scratch.canFetchResource = async url => {
        let parsed;
        try {
            parsed = new URL(url, location.href);
        } catch (e) {
            // Invalid URL.
            return false;
        }
        // Always allow protocols that don't involve a remote request.
        if (parsed.protocol === 'blob:' || parsed.protocol === 'data:') {
            return true;
        }
        return vm.securityManager.canFetchResource(parsed.href);
    };

    global.ScratchExtensions = require('./tw-scratchx-compatibility-layer');
});

/**
 * Disable the existing global.Scratch unsandboxed extension APIs.
 * This helps debug poorly designed extensions.
 */
const teardownUnsandboxedExtensionAPI = () => {
    // We can assume global.Scratch already exists.
    global.Scratch.extensions.register = () => {
        throw new Error('Too late to register new extensions.');
    };
};

/**
 * Load an unsandboxed extension from an arbitrary URL. This is dangerous.
 * @param {string} extensionURL
 * @param {Virtualmachine} vm
 * @returns {Promise<object[]>} Resolves with a list of extension objects if the extension was loaded successfully.
 */
const loadUnsandboxedExtension = (extensionURL, vm) => new Promise((resolve, reject) => {
    setupUnsandboxedExtensionAPI(vm).then(resolve);

    const script = document.createElement('script');
    script.onerror = () => {
        reject(new Error(`Error in unsandboxed script ${extensionURL}. Check the console for more information.`));
    };
    script.src = extensionURL;
    document.body.appendChild(script);
}).then(objects => {
    teardownUnsandboxedExtensionAPI();
    return objects;
});

// Because loading unsandboxed extensions requires messing with global state (global.Scratch),
// only let one extension load at a time.
const limiter = new AsyncLimiter(loadUnsandboxedExtension, 1);
const load = (extensionURL, vm) => limiter.do(extensionURL, vm);

module.exports = {
    setupUnsandboxedExtensionAPI,
    load
};
