import React from "react";
import bindAll from "lodash.bindall";
import debounce from "lodash.debounce";

import pythonWorkerSource from "raw-loader!../lib/python-worker.js";
import PyrightClient from "../lib/pyright-client.js";
import styles from "../components/python-tab/python-tab.css";

import PropTypes from "prop-types";
import VM from "scratch-vm";

let monacoLoadPromise = null;

let pythonProvidersRegistered = false;
let activePythonTab = null;

const toLspPosition = (position) => ({
    line: position.lineNumber - 1,
    character: position.column - 1,
});

const toMonacoRange = (range) => ({
    startLineNumber: range.start.line + 1,
    startColumn: range.start.character + 1,
    endLineNumber: range.end.line + 1,
    endColumn: range.end.character + 1,
});

const toMonacoSeverity = (monaco, severity) => {
    switch (severity) {
        case 1:
            return monaco.MarkerSeverity.Error;
        case 2:
            return monaco.MarkerSeverity.Warning;
        case 3:
            return monaco.MarkerSeverity.Info;
        case 4:
            return monaco.MarkerSeverity.Hint;
        default:
            return monaco.MarkerSeverity.Error;
    }
};

const lspCompletionItemKindNames = {
    1: "Text",
    2: "Method",
    3: "Function",
    4: "Constructor",
    5: "Field",
    6: "Variable",
    7: "Class",
    8: "Interface",
    9: "Module",
    10: "Property",
    11: "Unit",
    12: "Value",
    13: "Enum",
    14: "Keyword",
    15: "Snippet",
    16: "Color",
    17: "File",
    18: "Reference",
    19: "Folder",
    20: "EnumMember",
    21: "Constant",
    22: "Struct",
    23: "Event",
    24: "Operator",
    25: "TypeParameter",
};

const toMonacoCompletionItemKind = (monaco, kind) => {
    const name = lspCompletionItemKindNames[kind];
    return (
        (name && monaco.languages.CompletionItemKind[name]) ||
        monaco.languages.CompletionItemKind.Text
    );
};

const registerPythonLanguageProviders = (monaco) => {
    if (pythonProvidersRegistered) {
        return;
    }
    pythonProvidersRegistered = true;

    monaco.languages.registerCompletionItemProvider("python", {
        triggerCharacters: [".", "[", '"', "'"],
        provideCompletionItems: (model, position) =>
            activePythonTab
                ? activePythonTab.handleProvideCompletion(model, position)
                : { suggestions: [] },
        resolveCompletionItem: (item) =>
            activePythonTab
                ? activePythonTab.handleResolveCompletion(item)
                : item,
    });

    monaco.languages.registerHoverProvider("python", {
        provideHover: (model, position) =>
            activePythonTab
                ? activePythonTab.handleProvideHover(model, position)
                : null,
    });
};

class PythonTab extends React.Component {
    constructor(props) {
        super(props);

        bindAll(this, [
            "createWorker",
            "destroyWorker",
            "handleCodeChange",
            "handleRun",
            "handleStop",
            "handleWorkerMessage",
            "handleScratchCommand",
            "handleProvideCompletion",
            "handleResolveCompletion",
            "handleProvideHover",
        ]);

        this.state = {
            code: [
                "from omniblocks import sprite",
                "",
                "sprite.move(10)",
                "",
            ].join("\n"),
            output: "",
            ready: false,
            running: false,
        };

        this.worker = null;
        this.monaco = null;
        this.pyrightClient = null;
        this.completionRange = null;
        this.debouncedUpdatePyrightDocument = debounce((code) => {
            if (this.pyrightClient) {
                this.pyrightClient.updateTextDocument(code);
            }
        }, 250);
    }

    componentDidMount() {
        activePythonTab = this;
        this.loadMonaco();
        this.createWorker();
        this.createPyrightClient();
    }

    componentWillUnmount() {
        if (activePythonTab === this) {
            activePythonTab = null;
        }
        this.debouncedUpdatePyrightDocument.cancel();
        if (this.pyrightClient) {
            this.pyrightClient.dispose();
            this.pyrightClient = null;
        }
        this.destroyWorker();
    }

    loadMonaco() {
        const { basePath } = this.props;
        const vsPath = `${basePath}static/vs`;

        if (window.monaco) {
            this.createMonacoEditor(window.monaco);
            return;
        }

        if (!monacoLoadPromise) {
            monacoLoadPromise = new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.src = `${vsPath}/loader.js`;
                script.onload = () => {
                    window.MonacoEnvironment = {
                        getWorkerUrl: () =>
                            `${vsPath}/base/worker/workerMain.js`,
                    };
                    window.require.config({ paths: { vs: vsPath } });
                    window.require(
                        ["vs/editor/editor.main"],
                        (monaco) => {
                            window.monaco = monaco;
                            resolve(monaco);
                        },
                        reject,
                    );
                };
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }

        monacoLoadPromise.then(
            (monaco) => this.createMonacoEditor(monaco),
            (error) => console.error("Failed to load Monaco:", error),
        );
    }

    createMonacoEditor(monaco) {
        this.monaco = monaco;
        registerPythonLanguageProviders(monaco);

        this.editor = monaco.editor.create(this.editorContainer, {
            value: this.state.code,
            language: "python",
            theme: "vs-dark",
            automaticLayout: true,
        });

        this.editor.onDidChangeModelContent(() => {
            const code = this.editor.getValue();
            this.setState({ code });
            this.debouncedUpdatePyrightDocument(code);
        });
    }

    createPyrightClient() {
        const { basePath } = this.props;
        const client = new PyrightClient(
            `${basePath}static/pyright/pyright.worker.js`,
        );

        client.onDiagnostics = (diagnostics) =>
            this.applyDiagnostics(diagnostics);

        this.pyrightClient = client;
        client.initialize().catch((error) => {
            console.error("Failed to initialize pyright:", error);
        });
    }

    applyDiagnostics(diagnostics) {
        if (!this.monaco || !this.editor) {
            return;
        }

        const markers = diagnostics.map((diagnostic) => ({
            ...toMonacoRange(diagnostic.range),
            severity: toMonacoSeverity(this.monaco, diagnostic.severity),
            message: diagnostic.message,
            tags: diagnostic.tags,
        }));

        this.monaco.editor.setModelMarkers(
            this.editor.getModel(),
            "pyright",
            markers,
        );
    }

    convertCompletionItem(item, defaultRange) {
        const monaco = this.monaco;
        const converted = {
            label: item.label,
            kind: toMonacoCompletionItemKind(monaco, item.kind),
            detail: item.detail,
            documentation: item.documentation,
            sortText: item.sortText,
            filterText: item.filterText,
            insertText: item.insertText || item.label,
            range: defaultRange,
        };

        if (item.textEdit) {
            const edit = item.textEdit;
            converted.insertText = edit.newText;
            converted.range = toMonacoRange(edit.range || edit.replace);
        }

        converted.__lspItem = item;
        return converted;
    }

    async handleProvideCompletion(model, position) {
        const client = this.pyrightClient;
        if (!client) {
            return { suggestions: [] };
        }

        const word = model.getWordUntilPosition(position);
        const defaultRange = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
        };

        const result = await client.getCompletion(
            model.getValue(),
            toLspPosition(position),
        );
        if (!result) {
            return { suggestions: [] };
        }

        const items = Array.isArray(result) ? result : result.items;
        return {
            suggestions: items.map((item) =>
                this.convertCompletionItem(item, defaultRange),
            ),
            incomplete: Array.isArray(result)
                ? false
                : Boolean(result.isIncomplete),
        };
    }

    async handleResolveCompletion(item) {
        const client = this.pyrightClient;
        const original = item.__lspItem;
        if (!client || !original) {
            return item;
        }

        const resolved = await client.resolveCompletion(original);
        return resolved
            ? this.convertCompletionItem(resolved, item.range)
            : item;
    }

    async handleProvideHover(model, position) {
        const client = this.pyrightClient;
        if (!client) {
            return null;
        }

        const hover = await client.getHoverInfo(
            model.getValue(),
            toLspPosition(position),
        );
        if (!hover || !hover.contents) {
            return null;
        }

        const value =
            typeof hover.contents === "string"
                ? hover.contents
                : hover.contents.value || "";

        const result = { contents: [{ value }] };
        if (hover.range) {
            result.range = toMonacoRange(hover.range);
        }
        return result;
    }

    createWorker() {
        const blob = new Blob([pythonWorkerSource], {
            type: "text/javascript",
        });
        const workerUrl = URL.createObjectURL(blob);

        this.worker = new Worker(workerUrl);
        URL.revokeObjectURL(workerUrl);

        this.worker.onmessage = this.handleWorkerMessage;
        this.worker.onerror = (event) => {
            this.setState((state) => ({
                output: `${state.output}Python worker failed to load: ${event.message}\n`,
            }));
        };
        this.worker.postMessage({ type: "initialize" });

        this.setState({
            ready: false,
            running: false,
        });
    }

    destroyWorker() {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }
    }

    handleWorkerMessage(event) {
        const { type, text, message } = event.data;

        if (type === "ready") {
            this.setState({ ready: true });
            return;
        }

        if (type === "stdout" || type === "stderr") {
            this.setState((state) => ({
                output: `${state.output}${text}\n`,
            }));
            return;
        }

        if (type === "done") {
            this.setState({ running: false });
            return;
        }

        if (type === "error") {
            this.setState((state) => ({
                output: `${state.output}${message}\n`,
                running: false,
            }));
        }

        if (type === "scratch-command") {
            this.handleScratchCommand(event.data.command);
            return;
        }
    }

    handleCodeChange(event) {
        this.setState({
            code: event.target.value,
        });
    }

    handleRun() {
        const { code, ready, running } = this.state;

        if (!this.worker || !ready || running) {
            return;
        }

        this.setState(
            {
                output: "",
                running: true,
            },
            () => {
                this.worker.postMessage({
                    type: "run",
                    code,
                });
            },
        );
    }

    handleStop() {
        if (!this.state.running) {
            return;
        }

        // A worker termination reliably stops `while True: pass`.
        this.destroyWorker();

        this.setState((state) => ({
            output: `${state.output}\nExecution stopped.\n`,
            running: false,
        }));

        this.createWorker();
    }

    handleScratchCommand(command) {
        if (!command || typeof command !== "object") {
            return;
        }

        const { target: targetName, operation, args = {} } = command;
        const { vm } = this.props;
        const runtime = vm.runtime;

        const target =
            targetName === "__stage__"
                ? runtime.getTargetForStage()
                : targetName
                  ? runtime.getSpriteTargetByName(targetName)
                  : vm.editingTarget;

        if (!target) {
            this.setState((state) => ({
                output: `${state.output}Scratch target not found: ${targetName || "selected target"}\n`,
            }));
            return;
        }

        const number = (value) => {
            const result = Number(value);
            if (!Number.isFinite(result)) {
                throw new Error("Expected a finite number");
            }
            return result;
        };

        try {
            switch (operation) {
                case "move": {
                    // Scratch direction: 90 = right, 0 = up.
                    const steps = number(args.steps);
                    const radians = (90 - target.direction) * (Math.PI / 180);
                    target.setXY(
                        target.x + steps * Math.cos(radians),
                        target.y + steps * Math.sin(radians),
                    );
                    break;
                }

                case "go_to":
                    target.setXY(number(args.x), number(args.y));
                    break;

                case "turn_right":
                    target.setDirection(
                        target.direction + number(args.degrees),
                    );
                    break;

                case "point_in_direction":
                    target.setDirection(number(args.degrees));
                    break;

                case "set_visible":
                    if (typeof args.visible !== "boolean") {
                        throw new Error("visible must be true or false");
                    }
                    target.setVisible(args.visible);
                    break;

                case "switch_costume": {
                    const costumeIndex = target.getCostumeIndexByName(
                        String(args.costume),
                    );
                    if (costumeIndex === -1) {
                        throw new Error(`Costume not found: ${args.costume}`);
                    }
                    target.setCostume(costumeIndex);
                    break;
                }

                case "switch_backdrop": {
                    if (!target.isStage) {
                        throw new Error("Only the Stage can switch backdrops");
                    }
                    const backdropIndex = target.getCostumeIndexByName(
                        String(args.backdrop),
                    );
                    if (backdropIndex === -1) {
                        throw new Error(`Backdrop not found: ${args.backdrop}`);
                    }
                    target.setCostume(backdropIndex);
                    break;
                }

                default:
                    throw new Error(
                        `Python is not allowed to run "${operation}"`,
                    );
            }
        } catch (error) {
            this.setState((state) => ({
                output: `${state.output}Scratch command error: ${error.message}\n`,
            }));
        }
    }

    render() {
        const { output, ready, running } = this.state;

        return (
            <div className={styles.wrapper}>
                <div className={styles.toolbar}>
                    <button
                        className={styles.runButton}
                        disabled={!ready || running}
                        onClick={this.handleRun}
                    >
                        {ready ? "Run" : "Loading Python…"}
                    </button>

                    <button
                        className={styles.stopButton}
                        disabled={!running}
                        onClick={this.handleStop}
                    >
                        {"Stop"}
                    </button>
                </div>

                <div
                    ref={(el) => {
                        this.editorContainer = el;
                    }}
                    className={styles.editor}
                />

                <pre className={styles.output}>
                    {output || "Output appears here."}
                </pre>
            </div>
        );
    }
}

PythonTab.propTypes = {
    basePath: PropTypes.string,
    vm: PropTypes.instanceOf(VM).isRequired,
};

PythonTab.defaultProps = {
    basePath: "./",
};

export default PythonTab;
