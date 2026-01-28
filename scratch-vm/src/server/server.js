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
            if (res._omniTimeout) clearTimeout(res._omniTimeout);
            let parsedJSON;
            try {
                parsedJSON = JSON.parse(extraHeaders);
            } catch {
                parsedJSON = {};
            }
            res.writeHead(status, Object.assign(Object.create(null), {
                'Content-Type': mime,
                ...parsedJSON
            }));
            res.end(String(content));
            this.resMap.delete(requestId);
        });

        this.vm.securityManager.getSandboxMode = () => Promise.resolve('unsandboxed');
        this.vm.securityManager.canFetch = () => Promise.resolve(false);
        this.vm.securityManager.canLoadExtensionFromProject = () => Promise.resolve(false);

        // These are not possible in this environment.
        this.vm.securityManager.canOpenWindow = () => Promise.resolve(false);
        this.vm.securityManager.canRedirect = () => Promise.resolve(false);

        this.vm.runtime.privilegedUtils.readFile = async path => {
            const resolvedPath = resolvePath(path);
            if (!await this.securityManager.canReadFile(resolvedPath)) return '';
            return fs.readFileSync(resolvedPath, 'utf8');
        };

        this.vm.runtime.privilegedUtils.writeFile = async (path, content) => {
            const resolvedPath = resolvePath(path);
            if (!await this.securityManager.canWriteFile(resolvedPath)) return;
            fs.writeFileSync(resolvedPath, String(content));
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
        let bodySize = 0;
        // omni: TODO: Make this configurable.
        const MAX_BODY_SIZE = 10 * 1024 * 1024; // 10 MB limit

        req.on('data', chunk => {
            bodySize += chunk.length;
            if (bodySize > MAX_BODY_SIZE) {
                res.writeHead(413, {'Content-Type': 'text/plain'});
                res.end('Request Entity Too Large');
                req.destroy();
                return;
            }
            dataRaw.push(chunk);
        });
        req.on('end', async () => {
            const dataBuffer = Buffer.concat(dataRaw);
            const dataString = String(dataBuffer);

            if (this.dev && req.url === '/_omni_devServer_updateProj') {
                if (!('origin' in req.headers)) return res.end('denied');
                
                const isEditor = req.headers.origin === 'http://localhost:8601' ||
                    req.headers.origin === 'https://omniblocks.github.io';
                if (!isEditor) return res.end('denied');
                
                try {
                    await this.runProject(dataBuffer);
                } catch {
                    return res.end('corrupt');
                }
                
                res.writeHead(200, {
                    'Content-Type': 'text/plain',
                    'access-control-allow-origin': req.headers.origin
                });
                return res.end('success');
            }
            
            const requestId = crypto.randomUUID();
            this.resMap.set(requestId, res);
            
            const timeout = setTimeout(() => {
                if (this.resMap.has(requestId)) {
                    this.resMap.delete(requestId);
                    res.writeHead(504, {'Content-Type': 'text/plain'});
                    res.end('Gateway Timeout');
                }
            }, 30000); // 30 second timeout
            
            // Store timeout with response for cleanup on successful response
            res._omniTimeout = timeout;
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
