// i'm a little shim cup pour me with commonjs
export default function createExtensionWorker () {
    return new Worker(
        new URL('./extension-worker.js', import.meta.url),
        {name: 'extension-worker'}
    );
}
