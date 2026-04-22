const dispatch = require('../dispatch/central-dispatch');
const log = require('../util/log');
const maybeFormatMessage = require('../util/maybe-format-message');

const BlockType = require('./block-type');
const SecurityManager = require('./tw-security-manager');
<<<<<<< HEAD
const Cast = require('../util/cast');

const AddonSwitches = require('./extension-addon-switchers');

/* Commenting out for the sake of server support.

const urlParams = new URLSearchParams(location.search);

const IsLocal = String(window.location.href).startsWith(`http://localhost:`);
const IsLiveTests = urlParams.has('livetests'); */

// thhank yoh random stack droverflwo person
async function sha256(source) {
    const sourceBytes = new TextEncoder().encode(source);
    const digest = await crypto.subtle.digest("SHA-256", sourceBytes);
    const resultBytes = [...new Uint8Array(digest)];
    return resultBytes.map(x => x.toString(16).padStart(2, '0')).join("");
}
=======
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5

// These extensions are currently built into the VM repository but should not be loaded at startup.
// TODO: move these out into a separate repository?
// TODO: change extension spec so that library info, including extension ID, can be collected through static methods

const defaultBuiltinExtensions = {
    // This is an example that isn't loaded with the other core blocks,
    // but serves as a reference for loading core blocks as extensions.
    coreExample: () => require('../blocks/scratch3_core_example'),
    // These are the non-core built-in extensions.
    pen: () => require('../extensions/scratch3_pen'),
    wedo2: () => require('../extensions/scratch3_wedo2'),
    music: () => require('../extensions/scratch3_music'),
    microbit: () => require('../extensions/scratch3_microbit'),
    text2speech: () => require('../extensions/scratch3_text2speech'),
    translate: () => require('../extensions/scratch3_translate'),
    videoSensing: () => require('../extensions/scratch3_video_sensing'),
    ev3: () => require('../extensions/scratch3_ev3'),
    makeymakey: () => require('../extensions/scratch3_makeymakey'),
    boost: () => require('../extensions/scratch3_boost'),
    gdxfor: () => require('../extensions/scratch3_gdx_for'),
    // tw: core extension
<<<<<<< HEAD
    tw: () => require('../extensions/tw'),
    SPjavascriptV2: () => require("../extensions/sp_javascriptV2"),
    // omni: Web server blocks.
    server: () => require('../extensions/omni_server'),
};
const CORE_EXTENSIONS = [
    'argument',
    'colour',
    'control',
    'data',
    'event',
    'looks',
    'math',
    'motion',
    'operator',
    'procedures',
    'sensing',
    'sound'
];

const coreExtensionList = Object.getOwnPropertyNames(defaultBuiltinExtensions);

const preload = [];
=======
    tw: () => require('../extensions/tw')
};
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5

/**
 * @typedef {object} ArgumentInfo - Information about an extension block argument
 * @property {ArgumentType} type - the type of value this argument can take
 * @property {*|undefined} default - the default value of this argument (default: blank)
 */

/**
 * @typedef {object} ConvertedBlockInfo - Raw extension block data paired with processed data ready for scratch-blocks
 * @property {ExtensionBlockMetadata} info - the raw block info
 * @property {object} json - the scratch-blocks JSON definition for this block
 * @property {string} xml - the scratch-blocks XML definition for this block
 */

/**
 * @typedef {object} CategoryInfo - Information about a block category
 * @property {string} id - the unique ID of this category
 * @property {string} name - the human-readable name of this category
 * @property {string|undefined} blockIconURI - optional URI for the block icon image
 * @property {string} color1 - the primary color for this category, in '#rrggbb' format
 * @property {string} color2 - the secondary color for this category, in '#rrggbb' format
 * @property {string} color3 - the tertiary color for this category, in '#rrggbb' format
 * @property {Array.<ConvertedBlockInfo>} blocks - the blocks, separators, etc. in this category
 * @property {Array.<object>} menus - the menus provided by this category
 */

/**
 * @typedef {object} PendingExtensionWorker - Information about an extension worker still initializing
 * @property {string} extensionURL - the URL of the extension to be loaded by this worker
 * @property {Function} resolve - function to call on successful worker startup
 * @property {Function} reject - function to call on failed worker startup
 */

const createExtensionService = extensionManager => {
    const service = {};
    service.registerExtensionServiceSync = extensionManager.registerExtensionServiceSync.bind(extensionManager);
    service.allocateWorker = extensionManager.allocateWorker.bind(extensionManager);
    service.onWorkerInit = extensionManager.onWorkerInit.bind(extensionManager);
    service.registerExtensionService = extensionManager.registerExtensionService.bind(extensionManager);
    return service;
};

class ExtensionManager {
<<<<<<< HEAD
    constructor(vm) {
=======
    constructor (vm) {
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
        /**
         * The ID number to provide to the next extension worker.
         * @type {int}
         */
        this.nextExtensionWorker = 0;

        /**
         * FIFO queue of extensions which have been requested but not yet loaded in a worker,
         * along with promise resolution functions to call once the worker is ready or failed.
         *
         * @type {Array.<PendingExtensionWorker>}
         */
        this.pendingExtensions = [];

        /**
         * Map of worker ID to workers which have been allocated but have not yet finished initialization.
         * @type {Array.<PendingExtensionWorker>}
         */
        this.pendingWorkers = [];

        /**
         * Map of worker ID to the URL where it was loaded from.
         * @type {Array<string>}
         */
        this.workerURLs = [];

        /**
<<<<<<< HEAD
         * Map of loaded extension URLs/IDs to service names.
         * @type {Map.<string, string>}
=======
         * Map of loaded extension URLs/IDs (equivalent for built-in extensions) to service name.
         * @type {Map.<string,string>}
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
         * @private
         */
        this._loadedExtensions = new Map();

        /**
         * Responsible for determining security policies related to custom extensions.
         */
        this.securityManager = new SecurityManager();

        /**
         * @type {VirtualMachine}
         */
        this.vm = vm;

        /**
         * Keep a reference to the runtime so we can construct internal extension objects.
         * TODO: remove this in favor of extensions accessing the runtime as a service.
         * @type {Runtime}
         */
        this.runtime = vm.runtime;

        this.loadingAsyncExtensions = 0;
        this.asyncExtensionsLoadedCallbacks = [];

        this.builtinExtensions = Object.assign({}, defaultBuiltinExtensions);

        dispatch.setService('extensions', createExtensionService(this)).catch(e => {
            log.error(`ExtensionManager was unable to register extension service: ${JSON.stringify(e)}`);
        });
<<<<<<< HEAD

        preload.forEach(value => {
            this.loadExtensionURL(value);
        });

        this.extUrlCodes = {};
        // extensions that the user has stated (when they where loaded) that they do not wnat updated
        this.keepOlder = [];
        // map of all new shas so we know when a new code update has happened and so ask the user about it
        this.extensionHashes = {};
    }

    getCoreExtensionList() {
        return coreExtensionList;
    }
    getBuiltInExtensionsList() {
        return this.builtinExtensions;
    }

    getAddonBlockSwitches() {
        return AddonSwitches(this.vm);
=======
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
    }

    /**
     * Check whether an extension is registered or is in the process of loading. This is intended to control loading or
     * adding extensions so it may return `true` before the extension is ready to be used. Use the promise returned by
     * `loadExtensionURL` if you need to wait until the extension is truly ready.
     * @param {string} extensionID - the ID of the extension.
     * @returns {boolean} - true if loaded, false otherwise.
     */
<<<<<<< HEAD
    isExtensionLoaded(extensionID) {
=======
    isExtensionLoaded (extensionID) {
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
        return this._loadedExtensions.has(extensionID);
    }

    /**
     * Determine whether an extension with a given ID is built in to the VM, such as pen.
     * Note that "core extensions" like motion will return false here.
     * @param {string} extensionId
     * @returns {boolean}
     */
<<<<<<< HEAD
    isBuiltinExtension(extensionId) {
=======
    isBuiltinExtension (extensionId) {
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
        return Object.prototype.hasOwnProperty.call(this.builtinExtensions, extensionId);
    }

    /**
     * Synchronously load an internal extension (core or non-core) by ID. This call will
     * fail if the provided id is not does not match an internal extension.
     * @param {string} extensionId - the ID of an internal extension
     */
<<<<<<< HEAD
    loadExtensionIdSync(extensionId) {
=======
    loadExtensionIdSync (extensionId) {
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
        if (!this.isBuiltinExtension(extensionId)) {
            log.warn(`Could not find extension ${extensionId} in the built in extensions.`);
            return;
        }

        /** @TODO dupe handling for non-builtin extensions. See commit 670e51d33580e8a2e852b3b038bb3afc282f81b9 */
        if (this.isExtensionLoaded(extensionId)) {
            const message = `Rejecting attempt to load a second extension with ID ${extensionId}`;
            log.warn(message);
            return;
        }

        const extension = this.builtinExtensions[extensionId]();
        const extensionInstance = new extension(this.runtime);
        const serviceName = this._registerInternalExtension(extensionInstance);
<<<<<<< HEAD
        // devs are stupid so uh
        // get the ACTUAL id of the ext so that saving/loading doesnt error
        const realId = extensionInstance.getInfo().id;
        this._loadedExtensions.set(extensionId, serviceName);
        this.runtime.compilerRegisterExtension(realId, extensionInstance);
=======
        this._loadedExtensions.set(extensionId, serviceName);
        this.runtime.compilerRegisterExtension(extensionId, extensionInstance);
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
    }

    addBuiltinExtension (extensionId, extensionClass) {
        this.builtinExtensions[extensionId] = () => extensionClass;
    }

<<<<<<< HEAD
    _isValidExtensionURL(extensionURL) {
=======
    _isValidExtensionURL (extensionURL) {
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
        try {
            const parsedURL = new URL(extensionURL);
            return (
                parsedURL.protocol === 'https:' ||
                parsedURL.protocol === 'http:' ||
                parsedURL.protocol === 'data:' ||
                parsedURL.protocol === 'file:'
            );
        } catch (e) {
            return false;
        }
    }

    /**
     * Load an extension by URL or internal extension ID
<<<<<<< HEAD
     * @param {string} normalURL - the URL for the extension to load OR the ID of an internal extension
     * @param {string|null} oldHash - included when loading, contains the known hash that is from the loaded file so it can be compared with the one gotten over the url
     * @returns {Promise} resolved once the extension is loaded and initialized or rejected on failure
     */
    async loadExtensionURL(extensionURL, oldHash = '') {
        if (this.isBuiltinExtension(extensionURL)) {
            this.loadExtensionIdSync(extensionURL);
            return [extensionURL];
=======
     * @param {string} extensionURL - the URL for the extension to load OR the ID of an internal extension
     * @returns {Promise} resolved once the extension is loaded and initialized or rejected on failure
     */
    async loadExtensionURL (extensionURL) {
        if (this.isBuiltinExtension(extensionURL)) {
            this.loadExtensionIdSync(extensionURL);
            return;
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
        }

        if (this.isExtensionURLLoaded(extensionURL)) {
            // Extension is already loaded.
<<<<<<< HEAD
            return [];
=======
            return;
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
        }

        if (!this._isValidExtensionURL(extensionURL)) {
            throw new Error(`Invalid extension URL: ${extensionURL}`);
        }

<<<<<<< HEAD
       /* if (extensionURL.includes("ilelagal.site")) {
            alert("Extensions using p*mod.site are deprecated, please swap them over to use forbiden mod.com instead.") */
            // so um since i "borrowed" this code from antartic bird mod theres a bunch of refernces and special cases to it.. so.... i dont care. im just removiing them all
        
        // const normalURL = extensionURL.replace(".site", ".com");

=======
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
        this.runtime.setExternalCommunicationMethod('customExtensions', true);

        this.loadingAsyncExtensions++;

        const sandboxMode = await this.securityManager.getSandboxMode(extensionURL);
        const rewritten = await this.securityManager.rewriteExtensionURL(extensionURL);
<<<<<<< HEAD
        const blob = (await fetch(rewritten).then(req => req.blob()))
        const blobUrl = URL.createObjectURL(blob)
        const newHash = await new Promise(resolve => {
            const reader = new FileReader()
            reader.onload = async ({ target: { result } }) => {
                console.log(result)
                this.extUrlCodes[extensionURL] = result
                resolve(await sha256(result))
            }
            reader.onerror = err => {
                console.error('couldnt read the contents of url', url, err)
            }
            reader.readAsText(blob)
        })
        this.extensionHashes[extensionURL] = newHash
        if (oldHash && oldHash !== newHash && this.securityManager.shouldUseLocal(extensionURL)) return Promise.reject('useLocal')

        if (sandboxMode === 'unsandboxed') {
            const { load } = require('./tw-unsandboxed-extension-runner');
            const extensionObjects = await load(blobUrl, this.vm)
                .catch(error => this._failedLoadingExtensionScript(error));
            const fakeWorkerId = this.nextExtensionWorker++;
            const returnedIDs = [];
=======

        if (sandboxMode === 'unsandboxed') {
            const {load} = require('./tw-unsandboxed-extension-runner');
            const extensionObjects = await load(rewritten, this.vm)
                .catch(error => this._failedLoadingExtensionScript(error));
            const fakeWorkerId = this.nextExtensionWorker++;
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
            this.workerURLs[fakeWorkerId] = extensionURL;

            for (const extensionObject of extensionObjects) {
                const extensionInfo = extensionObject.getInfo();
                const serviceName = `unsandboxed.${fakeWorkerId}.${extensionInfo.id}`;
                dispatch.setServiceSync(serviceName, extensionObject);
                dispatch.callSync('extensions', 'registerExtensionServiceSync', serviceName);
                this._loadedExtensions.set(extensionInfo.id, serviceName);
<<<<<<< HEAD
                returnedIDs.push(extensionInfo.id);
                this.runtime.compilerRegisterExtension(extensionInfo.id, extensionObject);
            }

            this._finishedLoadingExtensionScript();
            return returnedIDs;
=======
            }

            this._finishedLoadingExtensionScript();
            return;
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
        }

        /* eslint-disable max-len */
        let ExtensionWorker;
        if (sandboxMode === 'worker') {
            ExtensionWorker = require('worker-loader?name=js/extension-worker/extension-worker.[hash].js!./extension-worker');
        } else if (sandboxMode === 'iframe') {
            ExtensionWorker = (await import(/* webpackChunkName: "iframe-extension-worker" */ './tw-iframe-extension-worker')).default;
        } else {
            throw new Error(`Invalid sandbox mode: ${sandboxMode}`);
        }
        /* eslint-enable max-len */

        return new Promise((resolve, reject) => {
<<<<<<< HEAD
           this.pendingExtensions.push({ extensionURL, rewrittenURL: rewritten, resolve, reject });
=======
            this.pendingExtensions.push({extensionURL: rewritten, resolve, reject});
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
            dispatch.addWorker(new ExtensionWorker());
        }).catch(error => this._failedLoadingExtensionScript(error));
    }

    /**
     * Wait until all async extensions have loaded
     * @returns {Promise} resolved when all async extensions have loaded
     */
<<<<<<< HEAD
    allAsyncExtensionsLoaded() {
=======
    allAsyncExtensionsLoaded () {
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
        if (this.loadingAsyncExtensions === 0) {
            return;
        }
        return new Promise((resolve, reject) => {
            this.asyncExtensionsLoadedCallbacks.push({
                resolve,
                reject
            });
        });
    }

    /**
<<<<<<< HEAD
     * Regenerate blockinfo for all (or one) loaded dynamic extensions
     * @param {string} [extension] optional extension id
     * @returns {Promise} resolved once all the extensions have been reinitialized
     */
    refreshDynamicCategorys(extension) {
        const refresh_service = service =>
            dispatch.call(service, 'getInfo')
                .then(info => {
                    info = this._prepareExtensionInfo(service, info);
                    if (!info.isDynamic) return;
                    dispatch.call('runtime', '_refreshExtensionPrimitives', info);
                })
                .catch(e => {
                    log.error(`Failed to refresh built-in extension primitives: ${e}`);
                })

        if (!this._loadedExtensions) return Promise.reject('_loadedExtensions is not readable yet');
        if (!extension) {
            const all_services = Array.from(this._loadedExtensions.values()).map(refresh_service);
            return Promise.all(all_services);
        }
        if (!this._loadedExtensions.has(extension)) {
            return Promise.reject(new Error(`Unknown extension: ${extension}`));
        }

        return refresh_service(this._loadedExtensions.get(extension));
    }

    /**
     * Regenerate blockinfo for all (or one) loaded extensions
     * @param {string} [extension] optional extension id
     * @returns {Promise} resolved once all the extensions have been reinitialized
     */
    refreshBlocks(extension) {
        const refresh_service = service =>
            dispatch.call(service, 'getInfo')
                .then(info => {
                    info = this._prepareExtensionInfo(service, info);
                    dispatch.call('runtime', '_refreshExtensionPrimitives', info);
                })
                .catch(e => {
                    log.error(`Failed to refresh built-in extension primitives: ${e}`);
                });

        if (!extension) {
            const all_services = Array.from(this._loadedExtensions.values()).map(refresh_service);
            return Promise.all(all_services);
        }
        if (!this._loadedExtensions.has(extension)) {
            return Promise.reject(new Error(`Unknown extension: ${extension}`));
        }

        return refresh_service(this._loadedExtensions.get(extension));
    }

    prepareSwap(id) {
        const serviceName = this._loadedExtensions.get(id);
        const { provider, isRemote } = dispatch._getServiceProvider(serviceName);
        if (isRemote || typeof provider.dispose === 'function') 
            dispatch.call(serviceName, 'dispose');
        delete dispatch.services[serviceName];
        delete this.runtime[`ext_${id}`];

        this._loadedExtensions.delete(id);
        const workerId = +serviceName.split('.')[1];
        delete this.workerURLs[workerId];
    }
    removeExtension(id) {
        const serviceName = this._loadedExtensions.get(id);
        const { provider, isRemote } = dispatch._getServiceProvider(serviceName);
        if (isRemote || typeof provider.dispose === 'function') 
            dispatch.call(serviceName, 'dispose');
        delete dispatch.services[serviceName];
        delete this.runtime[`ext_${id}`];

        this._loadedExtensions.delete(id);
        const workerId = +serviceName.split('.')[1];
        delete this.workerURLs[workerId];
        dispatch.call('runtime', '_removeExtensionPrimitive', id);
        this.refreshBlocks();
    }
    getExtensionIdFromOpcode(opcode) {
        // Allowed ID characters are those matching the regular expression [\w-]: A-Z, a-z, 0-9, and hyphen ("-").
        if (!(typeof opcode === 'string')) {
            console.error('invalid opcode ' + opcode);
            return '';
        }
        const index = opcode.indexOf('_');
        const forbiddenSymbols = /[^\w-]/g;
        const prefix = opcode.substring(0, index).replace(forbiddenSymbols, '-');
        if (CORE_EXTENSIONS.indexOf(prefix) === -1) {
            if (prefix !== '') return prefix;
        }
    }
    findUsedExtensions() {
        const results = [];
        for (const target of this.runtime.targets) {
            for (const blockId in target.blocks._blocks) {
                const block = target.blocks.getBlock(blockId);
                const ext = this.getExtensionIdFromOpcode(block.opcode);
                results.push(ext);
            }
        }
        return results;
    }
    removeUnusedExtensions() {
        const all = [...this._loadedExtensions.keys()];
        const used = this.findUsedExtensions();
        const unused = all.filter(ext => !used.includes(ext));
        for (const toRemove of unused)
            this.removeExtension(toRemove);
    }

    allocateWorker() {
=======
     * Regenerate blockinfo for any loaded extensions
     * @param {string} [optExtensionId] Optional extension ID for refreshing
     * @returns {Promise} resolved once all the extensions have been reinitialized
     */
    refreshBlocks (optExtensionId) {
        const refresh = serviceName => dispatch.call(serviceName, 'getInfo')
            .then(info => {
                info = this._prepareExtensionInfo(serviceName, info);
                dispatch.call('runtime', '_refreshExtensionPrimitives', info);
            })
            .catch(e => {
                log.error('Failed to refresh built-in extension primitives', e);
            });
        if (optExtensionId) {
            if (!this._loadedExtensions.has(optExtensionId)) {
                return Promise.reject(new Error(`Unknown extension: ${optExtensionId}`));
            }
            return refresh(this._loadedExtensions.get(optExtensionId));
        }
        const allPromises = Array.from(this._loadedExtensions.values()).map(refresh);
        return Promise.all(allPromises);
    }

    allocateWorker () {
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
        const id = this.nextExtensionWorker++;
        const workerInfo = this.pendingExtensions.shift();
        this.pendingWorkers[id] = workerInfo;
        this.workerURLs[id] = workerInfo.extensionURL;
        return [id, workerInfo.extensionURL];
    }

    /**
     * Synchronously collect extension metadata from the specified service and begin the extension registration process.
     * @param {string} serviceName - the name of the service hosting the extension.
     */
<<<<<<< HEAD
    registerExtensionServiceSync(serviceName) {
=======
    registerExtensionServiceSync (serviceName) {
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
        const info = dispatch.callSync(serviceName, 'getInfo');
        this._registerExtensionInfo(serviceName, info);
    }

    /**
     * Collect extension metadata from the specified service and begin the extension registration process.
     * @param {string} serviceName - the name of the service hosting the extension.
     */
<<<<<<< HEAD
    registerExtensionService(serviceName) {
=======
    registerExtensionService (serviceName) {
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
        dispatch.call(serviceName, 'getInfo').then(info => {
            this._loadedExtensions.set(info.id, serviceName);
            this._registerExtensionInfo(serviceName, info);
            this._finishedLoadingExtensionScript();
        });
    }

<<<<<<< HEAD
    _finishedLoadingExtensionScript() {
=======
    _finishedLoadingExtensionScript () {
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
        this.loadingAsyncExtensions--;
        if (this.loadingAsyncExtensions === 0) {
            this.asyncExtensionsLoadedCallbacks.forEach(i => i.resolve());
            this.asyncExtensionsLoadedCallbacks = [];
        }
    }

<<<<<<< HEAD
    _failedLoadingExtensionScript(error) {
=======
    _failedLoadingExtensionScript (error) {
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
        // Don't set the current extension counter to 0, otherwise it will go negative if another
        // extension finishes or fails to load.
        this.loadingAsyncExtensions--;
        this.asyncExtensionsLoadedCallbacks.forEach(i => i.reject(error));
        this.asyncExtensionsLoadedCallbacks = [];
        // Re-throw error so the promise still rejects.
        throw error;
    }

    /**
     * Called by an extension worker to indicate that the worker has finished initialization.
     * @param {int} id - the worker ID.
     * @param {*?} e - the error encountered during initialization, if any.
     */
<<<<<<< HEAD
    onWorkerInit(id, e) {
=======
    onWorkerInit (id, e) {
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
        const workerInfo = this.pendingWorkers[id];
        delete this.pendingWorkers[id];
        if (e) {
            workerInfo.reject(e);
        } else {
            workerInfo.resolve();
        }
    }

    /**
     * Register an internal (non-Worker) extension object
     * @param {object} extensionObject - the extension object to register
     * @returns {string} The name of the registered extension service
     */
<<<<<<< HEAD
    _registerInternalExtension(extensionObject) {
=======
    _registerInternalExtension (extensionObject) {
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
        const extensionInfo = extensionObject.getInfo();
        const fakeWorkerId = this.nextExtensionWorker++;
        const serviceName = `extension_${fakeWorkerId}_${extensionInfo.id}`;
        dispatch.setServiceSync(serviceName, extensionObject);
        dispatch.callSync('extensions', 'registerExtensionServiceSync', serviceName);
        return serviceName;
    }

    /**
     * Sanitize extension info then register its primitives with the VM.
     * @param {string} serviceName - the name of the service hosting the extension
     * @param {ExtensionInfo} extensionInfo - the extension's metadata
     * @private
     */
<<<<<<< HEAD
    _registerExtensionInfo(serviceName, extensionInfo) {
=======
    _registerExtensionInfo (serviceName, extensionInfo) {
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
        extensionInfo = this._prepareExtensionInfo(serviceName, extensionInfo);
        dispatch.call('runtime', '_registerExtensionPrimitives', extensionInfo).catch(e => {
            log.error(`Failed to register primitives for extension on service ${serviceName}:`, e);
        });
    }

    /**
     * Apply minor cleanup and defaults for optional extension fields.
     * TODO: make the ID unique in cases where two copies of the same extension are loaded.
     * @param {string} serviceName - the name of the service hosting this extension block
     * @param {ExtensionInfo} extensionInfo - the extension info to be sanitized
     * @returns {ExtensionInfo} - a new extension info object with cleaned-up values
     * @private
     */
<<<<<<< HEAD
    _prepareExtensionInfo(serviceName, extensionInfo) {
=======
    _prepareExtensionInfo (serviceName, extensionInfo) {
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
        extensionInfo = Object.assign({}, extensionInfo);
        if (!/^[a-z0-9]+$/i.test(extensionInfo.id)) {
            throw new Error('Invalid extension id');
        }
        extensionInfo.name = extensionInfo.name || extensionInfo.id;
        extensionInfo.blocks = extensionInfo.blocks || [];
        extensionInfo.targetTypes = extensionInfo.targetTypes || [];
<<<<<<< HEAD
        extensionInfo.menus = extensionInfo.menus || {};
        extensionInfo.menus = this._prepareMenuInfo(serviceName, extensionInfo.menus);
=======
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
        extensionInfo.blocks = extensionInfo.blocks.reduce((results, blockInfo) => {
            try {
                let result;
                switch (blockInfo) {
                case '---': // separator
                    result = '---';
                    break;
                default: // an ExtensionBlockMetadata object
<<<<<<< HEAD
                    result = this._prepareBlockInfo(serviceName, blockInfo, extensionInfo.menus);
=======
                    result = this._prepareBlockInfo(serviceName, blockInfo);
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
                    break;
                }
                results.push(result);
            } catch (e) {
                // TODO: more meaningful error reporting
<<<<<<< HEAD
                log.error(`Error processing block: ${e.message}, Block:\n${JSON.stringify(blockInfo)}`, e);
            }
            return results;
        }, []);
=======
                log.error(`Error processing block: ${e.message}, Block:\n${JSON.stringify(blockInfo)}`);
            }
            return results;
        }, []);
        extensionInfo.menus = extensionInfo.menus || {};
        extensionInfo.menus = this._prepareMenuInfo(serviceName, extensionInfo.menus);
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
        return extensionInfo;
    }

    /**
     * Prepare extension menus. e.g. setup binding for dynamic menu functions.
     * @param {string} serviceName - the name of the service hosting this extension block
     * @param {Array.<MenuInfo>} menus - the menu defined by the extension.
     * @returns {Array.<MenuInfo>} - a menuInfo object with all preprocessing done.
     * @private
     */
<<<<<<< HEAD
    _prepareMenuInfo(serviceName, menus) {
=======
    _prepareMenuInfo (serviceName, menus) {
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
        const menuNames = Object.getOwnPropertyNames(menus);
        for (let i = 0; i < menuNames.length; i++) {
            const menuName = menuNames[i];
            let menuInfo = menus[menuName];

            // If the menu description is in short form (items only) then normalize it to general form: an object with
            // its items listed in an `items` property.
<<<<<<< HEAD
            if (!menuInfo.items && (typeof menuInfo.variableType !== 'string')) {
=======
            if (!menuInfo.items) {
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
                menuInfo = {
                    items: menuInfo
                };
                menus[menuName] = menuInfo;
            }
            // If `items` is a string, it should be the name of a function in the extension object. Calling the
            // function should return an array of items to populate the menu when it is opened.
            if (typeof menuInfo.items === 'string') {
                const menuItemFunctionName = menuInfo.items;
                const serviceObject = dispatch.services[serviceName];
                // Bind the function here so we can pass a simple item generation function to Scratch Blocks later.
                menuInfo.items = this._getExtensionMenuItems.bind(this, serviceObject, menuItemFunctionName);
            }
        }
        return menus;
    }

    /**
     * Fetch the items for a particular extension menu, providing the target ID for context.
     * @param {object} extensionObject - the extension object providing the menu.
     * @param {string} menuItemFunctionName - the name of the menu function to call.
     * @returns {Array} menu items ready for scratch-blocks.
     * @private
     */
<<<<<<< HEAD
    _getExtensionMenuItems(extensionObject, menuItemFunctionName) {
=======
    _getExtensionMenuItems (extensionObject, menuItemFunctionName) {
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
        // Fetch the items appropriate for the target currently being edited. This assumes that menus only
        // collect items when opened by the user while editing a particular target.
        const editingTarget = this.runtime.getEditingTarget() || this.runtime.getTargetForStage();
        const editingTargetID = editingTarget ? editingTarget.id : null;
        const extensionMessageContext = this.runtime.makeMessageContextForTarget(editingTarget);

        // TODO: Fix this to use dispatch.call when extensions are running in workers.
        const menuFunc = extensionObject[menuItemFunctionName];
        const menuItems = menuFunc.call(extensionObject, editingTargetID).map(
            item => {
                item = maybeFormatMessage(item, extensionMessageContext);
                switch (typeof item) {
                case 'object':
<<<<<<< HEAD
                    if (Array.isArray(item)) return item.slice(0, 2);
=======
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
                    return [
                        maybeFormatMessage(item.text, extensionMessageContext),
                        item.value
                    ];
                case 'string':
                    return [item, item];
                default:
                    return item;
                }
            });

        if (!menuItems || menuItems.length < 1) {
            throw new Error(`Extension menu returned no items: ${menuItemFunctionName}`);
        }
        return menuItems;
    }

<<<<<<< HEAD
    _normalize(thing, to) {
        switch (to) {
        case 'string': return Cast.toString(thing);
        case 'bigint':
        case 'number': return Cast.toNumber(thing);
        case 'boolean': return Cast.toBoolean(thing);
        case 'function': return new Function(thing);
        default: return Cast.toString(thing);
        }
    }

=======
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
    /**
     * Apply defaults for optional block fields.
     * @param {string} serviceName - the name of the service hosting this extension block
     * @param {ExtensionBlockMetadata} blockInfo - the block info from the extension
     * @returns {ExtensionBlockMetadata} - a new block info object which has values for all relevant optional fields.
     * @private
     */
<<<<<<< HEAD
    _prepareBlockInfo(serviceName, blockInfo, menus) {
=======
    _prepareBlockInfo (serviceName, blockInfo) {
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
        if (blockInfo.blockType === BlockType.XML) {
            blockInfo = Object.assign({}, blockInfo);
            blockInfo.xml = String(blockInfo.xml) || '';
            return blockInfo;
        }

        blockInfo = Object.assign({}, {
            blockType: BlockType.COMMAND,
            terminal: false,
            blockAllThreads: false,
            arguments: {}
        }, blockInfo);
        blockInfo.text = blockInfo.text || blockInfo.opcode;

        switch (blockInfo.blockType) {
        case BlockType.EVENT:
            if (blockInfo.func) {
                log.warn(`Ignoring function "${blockInfo.func}" for event block ${blockInfo.opcode}`);
            }
            break;
<<<<<<< HEAD
        case BlockType.BUTTON: {
            if (!blockInfo.opcode && !blockInfo.func) {
                throw new Error(`Missing opcode or func for button: ${blockInfo.text}`);
            }

            // Prioritize opcode, fallback to func if opcode not present
            const funcName = blockInfo.opcode || blockInfo.func;
            
            // Normalize func property to the chosen callback name for ID generation and consistency
            blockInfo.func = funcName;
            
            // Create the callback function
            blockInfo.callFunc = (...args) => dispatch.call(serviceName, funcName, ...args);
            break;
        }
=======
        case BlockType.BUTTON:
            if (blockInfo.opcode) {
                log.warn(`Ignoring opcode "${blockInfo.opcode}" for button with text: ${blockInfo.text}`);
            }
            blockInfo.callFunc = () => {
                dispatch.call(serviceName, blockInfo.func);
            };
            break;
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
        case BlockType.LABEL:
            if (blockInfo.opcode) {
                log.warn(`Ignoring opcode "${blockInfo.opcode}" for label: ${blockInfo.text}`);
            }
            break;
        default: {
            if (!blockInfo.opcode) {
                throw new Error('Missing opcode for block');
            }

            const funcName = blockInfo.func || blockInfo.opcode;

            const getBlockInfo = blockInfo.isDynamic ?
                args => args && args.mutation && args.mutation.blockInfo :
                () => blockInfo;
            const callBlockFunc = (() => {
                if (dispatch._isRemoteService(serviceName)) {
                    return (args, util, realBlockInfo) =>
                        dispatch.call(serviceName, funcName, args, util, realBlockInfo)
                            .then(result => {
                                // Scratch is only designed to handle these types.
                                // If any other value comes in such as undefined, null, an object, etc.
                                // we'll convert it to a string to avoid undefined behavior.
                                if (
                                    typeof result === 'number' ||
<<<<<<< HEAD
                                        typeof result === 'string' ||
                                        typeof result === 'boolean'
=======
                                    typeof result === 'string' ||
                                    typeof result === 'boolean'
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
                                ) {
                                    return result;
                                }
                                return `${result}`;
<<<<<<< HEAD
                            })
                        // When an error happens, instead of returning undefined, we'll return a stringified
                        // version of the error so that it can be debugged.
                            .catch(err => {
                                // We want the full error including stack to be printed but the log helper
                                // messes with that.
                                // eslint-disable-next-line no-console
                                console.error('Custom extension block error', err);
                                return `${err}`;
=======
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
                            });
                }

                // avoid promise latency if we can call direct
                const serviceObject = dispatch.services[serviceName];
<<<<<<< HEAD
                if (!serviceObject) {
                    // extension was likely removed
                    return () => {};
                }
=======
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
                if (!serviceObject[funcName]) {
                    // The function might show up later as a dynamic property of the service object
                    log.warn(`Could not find extension block function called ${funcName}`);
                }
                return (args, util, realBlockInfo) =>
                    serviceObject[funcName](args, util, realBlockInfo);
            })();

<<<<<<< HEAD
            blockInfo.func = (args, util, visualReport) => {
                const normal = {
                    'angle': "number",
                    'Boolean': "boolean",
                    'color': "string",
                    'number': "number",
                    'string': "string",
                    'matrix': "string",
                    'note': "number",
                    'image': "string",
                    'polygon': "object",
                    // normalization exceptions
                    'list': "exception",
                    'broadcast': "exception"
                };
                const realBlockInfo = getBlockInfo(args);
                for (const arg in realBlockInfo.arguments) {
                    const expected = normal[realBlockInfo.arguments[arg].type];
                    if (realBlockInfo.arguments[arg].exemptFromNormalization === true) continue;
                    if (expected === 'exception') continue;
                    if (!expected) continue;
                    // stupidly long check but :Trollhands
                    // if this argument is for a variable dropdown, do not type cast it
                    // as variable dropdowns report an object and not something we can or should cast
                    if (typeof menus[realBlockInfo.arguments[arg].menu]?.variableType === 'string') continue;
                    if (!(typeof args[arg] === expected)) args[arg] = this._normalize(args[arg], expected);
                }
                // TODO: filter args using the keys of realBlockInfo.arguments? maybe only if sandboxed?
                const returnValue = callBlockFunc(args, util, realBlockInfo);
                const isCustomAPI = (returnValue?.value ?? false) && (returnValue?.constructor?.name !== "Object");
                if (!visualReport && isCustomAPI) return returnValue.value;
                return returnValue;
=======
            blockInfo.func = (args, util) => {
                const realBlockInfo = getBlockInfo(args);
                // TODO: filter args using the keys of realBlockInfo.arguments? maybe only if sandboxed?
                return callBlockFunc(args, util, realBlockInfo);
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
            };
            break;
        }
        }

        return blockInfo;
    }

<<<<<<< HEAD
    extensionUrlFromId(extId) {
        for (const [extensionId, serviceName] of this._loadedExtensions.entries()) {
            if (extensionId !== extId) continue;
            // Service names for extension workers are in the format "extension.WORKER_ID.EXTENSION_ID"
            const workerId = +serviceName.split('.')[1];
            return this.workerURLs[workerId];
        }
    }
    getExtensionURLs() {
        const extensionURLs = {};
        for (const [extensionId, serviceName] of this._loadedExtensions.entries()) {
=======
    getExtensionURLs () {
        const extensionURLs = {};
        for (const [extensionId, serviceName] of this._loadedExtensions.entries()) {
            if (Object.prototype.hasOwnProperty.call(this.builtinExtensions, extensionId)) {
                continue;
            }

>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
            // Service names for extension workers are in the format "extension.WORKER_ID.EXTENSION_ID"
            const workerId = +serviceName.split('.')[1];
            const extensionURL = this.workerURLs[workerId];
            if (typeof extensionURL === 'string') {
                extensionURLs[extensionId] = extensionURL;
            }
        }
        return extensionURLs;
    }

    isExtensionURLLoaded (url) {
<<<<<<< HEAD
        return this.workerURLs.includes(url);
=======
        return Object.values(this.workerURLs).includes(url);
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
    }
}

module.exports = ExtensionManager;
