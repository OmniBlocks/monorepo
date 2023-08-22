const ScratchCommon = require('./tw-extension-api-common');
const createScratchX = require('./tw-scratchx-compatibility-layer');
const AsyncLimiter = require('../util/async-limiter');
const createTranslate = require('./tw-l10n');

/**
 * Parse a URL object or return null.
 * @param {string} url
 * @returns {URL|null}
 */
const parseURL = url => {
    try {
        return new URL(url, location.href);
    } catch (e) {
        return null;
    }
};

/**
 * Create the unsandboxed extension API objects.
 * @param {VirtualMachine} vm
 * @returns {*} The objects
 */
const createAPI = vm => {
    const extensions = [];
    const register = extension => {
        extensions.push(extension);
    };

    // Each extension should get its own copy of Scratch so they don't break things badly
    const Scratch = Object.assign({}, global.Scratch, ScratchCommon);
    Scratch.extensions = {
        unsandboxed: true,
        register
    };
    Scratch.vm = vm;
    Scratch.renderer = vm.runtime.renderer;

    Scratch.canFetch = async url => {
        const parsed = parseURL(url);
        if (!parsed) {
            return false;
        }
        // Always allow protocols that don't involve a remote request.
        if (parsed.protocol === 'blob:' || parsed.protocol === 'data:') {
            return true;
        }
        return vm.securityManager.canFetch(parsed.href);
    };

    Scratch.canOpenWindow = async url => {
        const parsed = parseURL(url);
        if (!parsed) {
            return false;
        }
        // Always reject protocols that would allow code execution.
        // eslint-disable-next-line no-script-url
        if (parsed.protocol === 'javascript:') {
            return false;
        }
        return vm.securityManager.canOpenWindow(parsed.href);
    };

    Scratch.canRedirect = async url => {
        const parsed = parseURL(url);
        if (!parsed) {
            return false;
        }
        // Always reject protocols that would allow code execution.
        // eslint-disable-next-line no-script-url
        if (parsed.protocol === 'javascript:') {
            return false;
        }
        return vm.securityManager.canRedirect(parsed.href);
    };

    Scratch.canRecordAudio = async () => vm.securityManager.canRecordAudio();

    Scratch.canRecordVideo = async () => vm.securityManager.canRecordVideo();

    Scratch.canReadClipboard = async () => vm.securityManager.canReadClipboard();

    Scratch.canNotify = async () => vm.securityManager.canNotify();

    Scratch.canGeolocate = async () => vm.securityManager.canGeolocate();

    Scratch.fetch = async (url, options) => {
        const actualURL = url instanceof Request ? url.url : url;
        if (!await Scratch.canFetch(actualURL)) {
            throw new Error(`Permission to fetch ${actualURL} rejected.`);
        }
        return fetch(url, {
            ...options,
            redirect: 'error'
        });
    };

    Scratch.openWindow = async (url, features) => {
        if (!await Scratch.canOpenWindow(url)) {
            throw new Error(`Permission to open tab ${url} rejected.`);
        }
        // Use noreferrer to prevent new tab from accessing `window.opener`
        const baseFeatures = 'noreferrer';
        features = features ? `${baseFeatures},${features}` : baseFeatures;
        return window.open(url, '_blank', features);
    };

    Scratch.redirect = async url => {
        if (!await Scratch.canRedirect(url)) {
            throw new Error(`Permission to redirect to ${url} rejected.`);
        }
        location.href = url;
    };

    Scratch.translate = createTranslate(vm);

    const ScratchExtensions = createScratchX(Scratch);

    return {
        Scratch,
        ScratchExtensions,
        extensions
    };
};

/**
 * Load an unsandboxed extension from an arbitrary URL. This is dangerous.
 * @param {string} extensionURL
 * @param {Virtualmachine} vm
 * @returns {Promise<object[]>} Resolves with a list of extension objects if the extension was loaded successfully.
 */
const loadUnsandboxedExtension = async (extensionURL, vm) => {
    const res = await fetch(extensionURL);
    if (!res.ok) {
        throw new Error(`HTTP status ${extensionURL}`);
    }

    const text = await res.text();

    // AsyncFunction isn't a global like Function, but we can still access it indirectly like this
    const AsyncFunction = (async () => {}).constructor;

    const api = createAPI(vm);
    const fn = new AsyncFunction('Scratch', 'ScratchExtensions', text);
    await fn(api.Scratch, api.ScratchExtensions);

    if (api.extensions.length === 0) {
        throw new Error('Extension called register() 0 times');
    }
    return api.extensions;
};

// For now we force them to load one at a time to ensure consistent order
const limiter = new AsyncLimiter(loadUnsandboxedExtension, 1);
const load = (extensionURL, vm) => limiter.do(extensionURL, vm);

module.exports = {
    load,

    // For tests:
    createAPI
};
