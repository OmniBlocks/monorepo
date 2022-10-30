const {test} = require('tap');
const ExtensionManager = require('../../src/extension-support/extension-manager');

test('isBuiltinExtension', t => {
    const fakeRuntime = {};
    const manager = new ExtensionManager(fakeRuntime);
    t.equal(manager.isBuiltinExtension('pen'), true);
    t.equal(manager.isBuiltinExtension('lksdfjlskdf'), false);
    t.end();
});
