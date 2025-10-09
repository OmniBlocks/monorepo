const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const SandboxRunner = require('../../util/sandboxed-javascript-runner');
const Cast = require('../../util/cast');

/**
 * Class
 * oh yea you cant access util in the runner anymore
 * im not adding it because im done with implementing eval in PM since it was done like 3 times
 * @constructor
 */
class jgJavascript {
    constructor(runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {runtime}
         */
        this.runtime = runtime;
        this.runningEditorUnsandboxed = false;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'jgJavascript',
            name: 'JavaScript',
            isDynamic: true,
            // color1: '#EFC900', look like doo doo
            blocks: [
                {
                    opcode: 'unsandbox',
                    text: 'Run Unsandboxed',
                    blockType: BlockType.BUTTON,
                    hideFromPalette: this.runningEditorUnsandboxed
                },
                {
                    opcode: 'sandbox',
                    text: 'Run Sandboxed',
                    blockType: BlockType.BUTTON,
                    hideFromPalette: !this.runningEditorUnsandboxed
                },
                {
                    opcode: 'javascriptHat',
                    text: 'when javascript [CODE] == true',
                    blockType: BlockType.HAT,
                    hideFromPalette: !this.runningEditorUnsandboxed, // this block seems to cause strange behavior because of how sandboxed eval is done
                    arguments: {
                        CODE: {
                            type: ArgumentType.STRING,
                            defaultValue: "Math.round(Math.random()) === 1"
                        }
                    }
                },
                {
                    opcode: 'javascriptStack',
                    text: 'javascript [CODE]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        CODE: {
                            type: ArgumentType.STRING,
                            defaultValue: "alert('Hello!')"
                        }
                    }
                },
                {
                    opcode: 'javascriptString',
                    text: 'javascript [CODE]',
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    arguments: {
                        CODE: {
                            type: ArgumentType.STRING,
                            defaultValue: "Math.random()"
                        }
                    }
                },
                {
                    opcode: 'javascriptBool',
                    text: 'javascript [CODE]',
                    blockType: BlockType.BOOLEAN,
                    disableMonitor: true,
                    arguments: {
                        CODE: {
                            type: ArgumentType.STRING,
                            defaultValue: "Math.round(Math.random()) === 1"
                        }
                    }
                },
                {
                    blockType: BlockType.LABEL,
                    text: 'You can run unsandboxed',
                    hideFromPalette: !this.runningEditorUnsandboxed
                },
                {
                    blockType: BlockType.LABEL,
                    text: 'when packaging the project.',
                    hideFromPalette: !this.runningEditorUnsandboxed
                },
                {
                    blockType: BlockType.LABEL,
                    text: '⠀',
                    hideFromPalette: !this.runningEditorUnsandboxed
                },
                {
                    blockType: BlockType.LABEL,
                    text: 'Player Options >',
                    hideFromPalette: !this.runningEditorUnsandboxed
                },
                {
                    blockType: BlockType.LABEL,
                    text: 'Remove sandbox on the JavaScript Ext.',
                    hideFromPalette: !this.runningEditorUnsandboxed
                },
            ]
        };
    }

    async unsandbox() {
        const unsandbox = await this.runtime.vm.securityManager.canUnsandbox('JavaScript');
        if (!unsandbox) return;
        this.runningEditorUnsandboxed = true;
        this.runtime.extensionManager.refreshBlocks("jgJavascript");
    }
    sandbox() {
        this.runningEditorUnsandboxed = false;
        this.runtime.extensionManager.refreshBlocks("jgJavascript");
    }

    // util
    evaluateCode(code, args, util, realBlockInfo) {
        // used for packager
        if (this.runtime.extensionRuntimeOptions.javascriptUnsandboxed === true || this.runningEditorUnsandboxed) {
            let result;
            try {
                // eslint-disable-next-line no-eval
                result = eval(code);
            } catch (err) {
                result = err;
            }
            return result;
        }
        // we are not packaged
        return new Promise((resolve) => {
            SandboxRunner.execute(code).then(result => {
                // result is { value: any, success: boolean }
                // in PM, we always ignore errors
                return resolve(result.value);
            })
        })
    }

    // blocks
    javascriptStack(args, util, realBlockInfo) {
        const code = Cast.toString(args.CODE);
        return this.evaluateCode(code, args, util, realBlockInfo);
    }
    javascriptString(args, util, realBlockInfo) {
        const code = Cast.toString(args.CODE);
        return this.evaluateCode(code, args, util, realBlockInfo);
    }
    javascriptBool(args, util, realBlockInfo) {
        const code = Cast.toString(args.CODE);
        const possiblePromise = this.evaluateCode(code, args, util, realBlockInfo);
        if (possiblePromise && typeof possiblePromise.then === 'function') {
            return (async () => {
                const value = await possiblePromise;
                return Boolean(value); // this is a JavaScript extension, we should use the JavaScript way of determining booleans
            })();
        }
        return Boolean(possiblePromise);
    }
    javascriptHat(...args) {
        if (!this.runtime.extensionRuntimeOptions.javascriptUnsandboxed && !this.runningEditorUnsandboxed) {
            return false; // we will cause issues otherwise, edging hats cause weird issues when waiting for promises each frame
        }
        const possiblePromise = this.javascriptBool(...args);
        if (possiblePromise && typeof possiblePromise.then === 'function') {
            return false; // we will cause issues otherwise, edging hats cause weird issues when waiting for promises each frame
        }
        return possiblePromise;
    }
}

module.exports = jgJavascript;