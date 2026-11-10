/* global caches, fetch, importScripts, loadPyodide, self */

const PYODIDE_INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
const PYODIDE_CACHE_NAME = "omniblocks-pyodide-v0.26.4";

const STUB = `import sys
import types
import omniblocks_bridge

class Sprite:
    def __init__(self, name=None):
        self.name = name

    def _send(self, operation, **args):
        omniblocks_bridge.sendCommand({
            "target": self.name,
            "operation": operation,
            "args": args
        })

    def move(self, steps):
        self._send("move", steps=steps)

    def go_to(self, x, y):
        self._send("go_to", x=x, y=y)

    def turn_right(self, degrees):
        self._send("turn_right", degrees=degrees)

    def point_in_direction(self, degrees):
        self._send("point_in_direction", degrees=degrees)

    def show(self):
        self._send("set_visible", visible=True)

    def hide(self):
        self._send("set_visible", visible=False)

    def switch_costume(self, costume):
        self._send("switch_costume", costume=costume)

# The currently selected sprite in the editor.
sprite = Sprite()

def get_sprite(name):
    return Sprite(name)

class Stage:
    def switch_backdrop(self, backdrop):
        omniblocks_bridge.sendCommand({
            "target": "__stage__",
            "operation": "switch_backdrop",
            "args": {"backdrop": backdrop}
        })

stage = Stage()

omniblocks = types.ModuleType("omniblocks")
omniblocks.Sprite = Sprite
omniblocks.sprite = sprite
omniblocks.get_sprite = get_sprite
omniblocks.Stage = Stage
omniblocks.stage = stage
sys.modules["omniblocks"] = omniblocks`;

let pyodidePromise = null;

const send = (message) => self.postMessage(message);

const installCachedFetch = () => {
    if (typeof caches === "undefined" || self.fetch.__omniblocksCached) {
        return;
    }

    const originalFetch = self.fetch.bind(self);

    const cachedFetch = async (input, init) => {
        const request = new Request(input, init);
        if (
            request.method !== "GET" ||
            !request.url.startsWith(PYODIDE_INDEX_URL)
        ) {
            return originalFetch(request);
        }

        const cache = await caches.open(PYODIDE_CACHE_NAME);
        const cached = await cache.match(request);
        if (cached) {
            return cached;
        }

        const response = await originalFetch(request);
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    };
    cachedFetch.__omniblocksCached = true;

    self.fetch = cachedFetch;
};

const getPyodide = () => {
    if (!pyodidePromise) {
        installCachedFetch();
        importScripts(`${PYODIDE_INDEX_URL}pyodide.js`);

        pyodidePromise = loadPyodide({
            indexURL: PYODIDE_INDEX_URL,
        }).then((pyodide) => {
            pyodide.setStdout({
                batched: (text) => send({ type: "stdout", text }),
            });
            pyodide.setStderr({
                batched: (text) => send({ type: "stderr", text }),
            });

            // This is the only route from Python to the editor/VM.
            pyodide.registerJsModule("omniblocks_bridge", {
                sendCommand: (command) =>
                    send({
                        type: "scratch-command",
                        command: command.toJs({
                            dict_converter: Object.fromEntries,
                        }),
                    }),
            });

            pyodide.runPython(STUB);

            return pyodide;
        });
    }

    return pyodidePromise;
};

self.onmessage = async (event) => {
    const { type, code } = event.data;

    try {
        if (type === "initialize") {
            await getPyodide();
            send({ type: "ready" });
            return;
        }

        if (type === "run") {
            const pyodide = await getPyodide();

            await pyodide.loadPackagesFromImports(code);
            await pyodide.runPythonAsync(code);

            send({ type: "done" });
        }
    } catch (error) {
        send({
            type: "error",
            message: error && error.message ? error.message : String(error),
        });
    }
};
