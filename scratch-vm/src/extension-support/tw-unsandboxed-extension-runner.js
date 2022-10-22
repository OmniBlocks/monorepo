const ArgumentType = require('../extension-support/argument-type');
const BlockType = require('../extension-support/block-type');
const TargetType = require('../extension-support/target-type');

// Custom extensions by nature rely on the single global Scratch object to register themselves
// To make this work, we'll have to track the most recent callback and just hope that we don't
// have two VMs on the same page trying to load unsandboxed extensions.
let mostRecentRegisterExtensionCallback = null;

const register = extensionObject => {
    mostRecentRegisterExtensionCallback(extensionObject);
};

const Scratch = {
    ArgumentType,
    BlockType,
    TargetType,
    extensions: {
        register
    }
};

global.Scratch = Scratch;

const load = (extensionURL, registerExtensionCallback) => new Promise((resolve, reject) => {
    mostRecentRegisterExtensionCallback = registerExtensionCallback;

    const script = document.createElement('script');
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Error in unsandboxed script ${extensionURL}`));
    script.src = extensionURL;
    document.body.appendChild(script);
});

module.exports = {
    load
};
