const {test} = require('tap');
const ExtensionManager = require('../../src/extension-support/extension-manager');

test('isBuiltinExtension', t => {
    const fakeRuntime = {};
    const manager = new ExtensionManager(fakeRuntime);
    t.equal(manager.isBuiltinExtension('pen'), true);
    t.equal(manager.isBuiltinExtension('lksdfjlskdf'), false);
    t.end();
});

test('_isValidExtensionURL', t => {
    const fakeRuntime = {};
    const manager = new ExtensionManager(fakeRuntime);
    t.equal(manager._isValidExtensionURL('fetch'), false);
    t.equal(manager._isValidExtensionURL(''), false);
    t.equal(manager._isValidExtensionURL('extensions.turbowarp.org/fetch.js'), false);
    t.equal(manager._isValidExtensionURL('https://extensions.turbowarp.org/fetch.js'), true);
    t.equal(manager._isValidExtensionURL('http://extensions.turbowarp.org/fetch.js'), true);
    t.equal(manager._isValidExtensionURL('http://localhost:8000'), true);
    t.equal(manager._isValidExtensionURL('data:application/javascript;base64,YWxlcnQoMSk='), true);
    t.equal(manager._isValidExtensionURL('file:///home/test/extension.js'), true);
    t.end();
});
