const ArgumentType = require('../extension-support/argument-type');
const BlockType = require('../extension-support/block-type');
const TargetType = require('../extension-support/target-type');
const AsyncLimiter = require('../util/async-limiter');

const loadUnsandboxedExtension = (extensionURL, vm) => new Promise((resolve, reject) => {
    global.Scratch = global.Scratch || {};
    global.Scratch.vm = vm;
    global.Scratch.renderer = vm.runtime.renderer;
    global.Scratch.ArgumentType = ArgumentType;
    global.Scratch.BlockType = BlockType;
    global.Scratch.TargetType = TargetType;
    global.Scratch.ArgumentType = ArgumentType;

    // When we load the script, wait for it to eventually call Scratch.extensions.register
    // before resolving. Note that extension scripts may register multiple extensions.

    const extensionObjects = [];
    const register = extensionObject => {
        extensionObjects.push(extensionObject);
        resolve(extensionObjects);
    };
    global.Scratch.extensions = {
        unsandboxed: true,
        register
    };

    const script = document.createElement('script');
    script.onerror = () => reject(new Error(`Error in unsandboxed script ${extensionURL}`));
    script.src = extensionURL;
    document.body.appendChild(script);
});

// Because loading unsandboxed extensions requires messing with global state (global.Scratch),
// only let one extension load at a time.
const limiter = new AsyncLimiter(loadUnsandboxedExtension, 1);
const load = (extensionURL, vm) => limiter.do(extensionURL, vm);

module.exports = {
    load
};
