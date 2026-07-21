import {
    BrowserMessageReader,
    BrowserMessageWriter
} from 'vscode-jsonrpc/browser';
import {
    CompletionRequest,
    CompletionResolveRequest,
    DiagnosticTag,
    HoverRequest,
    InitializeRequest,
    NotificationType,
    RequestType,
    createMessageConnection
} from 'vscode-languageserver-protocol';

const ROOT_PATH = '/src/';
const ROOT_URI = `file://${ROOT_PATH}`;
const FILE_NAME = 'main.py';
const DOCUMENT_URI = ROOT_URI + FILE_NAME;

class PyrightClient {
    constructor (workerUrl) {
        this.workerUrl = workerUrl;
        this.connection = null;
        this.workers = [];
        this.documentVersion = 1;
        this.documentText = '';
        this.onDiagnostics = null;
    }

    async initialize () {
        const foreground = new Worker(this.workerUrl, {
            name: 'Pyright-foreground',
            type: 'classic'
        });
        foreground.postMessage({type: 'browser/boot', mode: 'foreground'});

        this.workers = [foreground];

        // spagghetti code
        foreground.addEventListener('message', event => {
            if (event.data && event.data.type === 'browser/newWorker') {
                const {initialData, port} = event.data;
                const background = new Worker(this.workerUrl, {
                    name: `Pyright-background-${this.workers.length}`
                });
                this.workers.push(background);
                background.postMessage(
                    {
                        type: 'browser/boot',
                        mode: 'background',
                        initialData,
                        port
                    },
                    [port]
                );
            }
        });

        const connection = createMessageConnection(
            new BrowserMessageReader(foreground),
            new BrowserMessageWriter(foreground)
        );
        connection.onDispose(() => {
            this.workers.forEach(worker => worker.terminate());
        });
        connection.listen();
        this.connection = connection;

        await connection.sendRequest(InitializeRequest.type, {
            rootUri: ROOT_URI,
            rootPath: ROOT_PATH,
            processId: 1,
            capabilities: {
                textDocument: {
                    publishDiagnostics: {
                        tagSupport: {
                            valueSet: [
                                DiagnosticTag.Unnecessary,
                                DiagnosticTag.Deprecated
                            ]
                        },
                        versionSupport: true
                    },
                    hover: {
                        contentFormat: ['markdown', 'plaintext']
                    }
                }
            },
            initializationOptions: {
                files: {
                    [ROOT_PATH + FILE_NAME]: this.documentText,
                    [`${ROOT_PATH}pyrightconfig.json`]: JSON.stringify({
                        typeshedPath: '/typeshed',
                        typeCheckingMode: 'basic'
                    })
                }
            }
        });

        await connection.sendNotification(
            new NotificationType('workspace/didChangeConfiguration'),
            {settings: {}}
        );

        await connection.sendNotification(
            new NotificationType('textDocument/didOpen'),
            {
                textDocument: {
                    uri: DOCUMENT_URI,
                    languageId: 'python',
                    version: this.documentVersion,
                    text: this.documentText
                }
            }
        );

        connection.onNotification(
            new NotificationType('textDocument/publishDiagnostics'),
            diagnosticInfo => {
                if (this.onDiagnostics) {
                    this.onDiagnostics(diagnosticInfo.diagnostics);
                }
            }
        );

        // oopsie poopsie
        connection.onRequest(
            new RequestType('workspace/configuration'),
            () => []
        );
    }

    async updateTextDocument (code) {
        if (!this.connection || this.documentText === code) {
            return this.documentVersion;
        }

        const version = ++this.documentVersion;
        this.documentText = code;

        await this.connection.sendNotification(
            new NotificationType('textDocument/didChange'),
            {
                textDocument: {uri: DOCUMENT_URI, version},
                contentChanges: [{text: code}]
            }
        );

        return version;
    }

    async getCompletion (code, position) {
        if (!this.connection) {
            return null;
        }

        await this.updateTextDocument(code);

        try {
            return await this.connection.sendRequest(CompletionRequest.type, {
                textDocument: {uri: DOCUMENT_URI},
                position
            });
        } catch (error) {
            return null;
        }
    }

    async resolveCompletion (item) {
        if (!this.connection) {
            return null;
        }

        try {
            return await this.connection.sendRequest(
                CompletionResolveRequest.type,
                item
            );
        } catch (error) {
            return null;
        }
    }

    async getHoverInfo (code, position) {
        if (!this.connection) {
            return null;
        }

        await this.updateTextDocument(code);

        try {
            return await this.connection.sendRequest(HoverRequest.type, {
                textDocument: {uri: DOCUMENT_URI},
                position
            });
        } catch (error) {
            return null;
        }
    }

    dispose () {
        if (this.connection) {
            this.connection.dispose();
        }
        this.connection = null;
    }
}

export default PyrightClient;
