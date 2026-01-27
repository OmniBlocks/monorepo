/* eslint-env node */
/* eslint-disable no-console */

const VirtualMachine = require('../index');
const Runtime = require('../engine/runtime');

const fs = require('node:fs');
const http = require('node:http');
const crypto = require('node:crypto');

const initStorage = require('./storage');

const {resolvePath} = require('./resolve-path');

const {JSDOM} = require('jsdom');

/**
 * omni: This is a privileged client for running OmniBlocks as a web server.
 * It starts a HTTP server that interfaces with the project running in the VM,
 * via the Web Server extension.
 * @param {boolean} dev If true, runs the server in developer mode.
 * @param {number} port The port that the server listens on.
 * @constructor
 */
class Server {
    constructor (dev, port) {
        if (typeof dev !== 'boolean') throw new TypeError('"dev" must be a boolean.');
        if (typeof port !== 'number') throw new TypeError('"port" must be a number.');

        this.dev = dev;
        this.port = port;

        // For extension compatibility, mock browser APIs.
        global.window = new JSDOM('').window;
        global.document = window.document;

        /* eslint-disable no-unused-vars */
        global.confirm = (...ignored) => true;
        global.alert = (ignored, ...ignored2) => console.log(ignored);
        global.prompt = (...ignored) => '';
        /* eslint-enable no-unused-vars */

        this.http = http.createServer(this.httpServer.bind(this));
        this.resMap = new Map();

        this.vm = new VirtualMachine();
        this.vm.convertToPackagedRuntime();
        this.vm.attachStorage(initStorage());
        this.vm.runtime.isPrivileged = true;

        this.securityManager = this.vm.runtime.extensionManager.securityManager;

        this.vm.runtime.on('SAY', (target, type, text) => {
            console.log(text);
        });
        
        this.vm.runtime.on(Runtime.SERVER_RESPONSE, (content, mime, status, extraHeaders, requestId) => {
            const res = this.resMap.get(requestId);
            if (typeof res === 'undefined') return;
            res.writeHead(status, {
                'Content-Type': mime,
                ...JSON.parse(extraHeaders)
            });
            res.end(String(content));
            this.resMap.delete(requestId);
        });

        this.vm.securityManager.getSandboxMode = () => Promise.resolve('unsandboxed');
        this.vm.securityManager.canFetch = () => Promise.resolve(false);
        this.vm.securityManager.canLoadExtensionFromProject = () => Promise.resolve(false);

        // These are not possible in this enviroment.
        this.vm.securityManager.canOpenWindow = () => Promise.resolve(false);
        this.vm.securityManager.canRedirect = () => Promise.resolve(false);

        this.vm.runtime.privilegedUtils.readFile = async path => {
            const resolvedPath = resolvePath(path);
            if (!await this.securityManager.canReadFile(resolvedPath)) return '';
            try {
                return fs.readFileSync(resolvedPath, 'utf8');
            } catch (err) {
                return '';
            }
        };

        this.vm.runtime.privilegedUtils.writeFile = async (path, content) => {
            const resolvedPath = resolvePath(path);
            if (!await this.securityManager.canWriteFile(resolvedPath)) return;
            try {
                fs.writeFileSync(resolvedPath, String(content));
            } catch (err) {
                // Empty on purpose.
                // omni: TODO: Maybe add some form of error handling?
            }
        };

        this.vm.setCompatibilityMode(false);
        this.vm.setTurboMode(true);
        this.vm.clear();

        this.http.listen(this.port, () => {
            console.log(`OmniBlocks on server has started at port ${port}.`);
        });
    }

    /**
     * Internally used for the HTTP server.
     * @private
     */
    httpServer (req, res) {
        const dataRaw = [];

        req.on('data', chunk => {
            dataRaw.push(chunk);
        });
        req.on('end', async () => {
            const dataBuffer = Buffer.concat(dataRaw);
            const dataString = String(dataBuffer);

            if (this.dev && req.url === '/_lk_devServer_updateLb') {
                if (!('origin' in req.headers)) return;
                
                const isEditor = req.headers.origin === 'http://localhost:8601' ||
                    req.headers.origin.endsWith('omniblocks.github.io');
                if (!isEditor) return;
                
                await this.runProject(dataBuffer).catch(err => {
                    throw new Error(err);
                });
                
                res.writeHead(200, {
                    'Content-Type': 'text/plain',
                    'access-control-allow-origin': req.headers.origin
                });
                return res.end('success');
            }
            
            const requestId = crypto.randomUUID();
            this.resMap.set(requestId, res);
            this.vm.runtime.emit(
                Runtime.SERVER_REQUEST,
                req.url,
                req.socket.remoteAddress,
                req.method,
                JSON.stringify(req.headers),
                dataString,
                requestId
            );
        });
    }

    /**
     * Stops the HTTP server and turns off the VM, effectively disabling the server.
     */
    halt () {
        this.http.close();
        this.http.closeAllConnections();
        this.vm.quit();
    }

    /**
     * Load a Scratch project from a .sb, .sb2, .sb3 or json string.
     * @param {string | object} input A json string, object, or ArrayBuffer representing the project to load.
     */
    async runProject (input) {
        this.vm.clear();
        await this.vm.loadProject(input);
        this.vm.start();
        this.vm.greenFlag();
    }
}

module.exports = Server;
