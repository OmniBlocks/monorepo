const tap = require('tap');
const {test} = tap;
const VirtualMachine = require('../../src/virtual-machine');
const {createAPI} = require('../../src/extension-support/tw-unsandboxed-extension-runner');

/* globals Request */
// Mock several browser APIs that unsandboxed extensions use.
global.location = {
    href: 'https://turbowarp.org/editor'
};
global.Request = class {
    constructor (url) {
        this.url = url;
    }
};
global.fetch = (url, options = {}) => (
    Promise.resolve(`[Response ${url instanceof Request ? url.url : url} options=${JSON.stringify(options)}]`)
);
global.window = {
    open: (url, target, features) => `[Window ${url} target=${target || ''} features=${features || ''}]`
};

test('basic register', t => {
    const vm = new VirtualMachine();
    const api = createAPI(vm);

    class MyExtension {}
    api.Scratch.extensions.register(new MyExtension());

    t.equal(api.extensions.length, 1);
    t.ok(api.extensions[0] instanceof MyExtension);

    api.Scratch.extensions.register(new MyExtension());
    t.equal(api.extensions.length, 2);
    t.ok(api.extensions[0] instanceof MyExtension);
    t.ok(api.extensions[1] instanceof MyExtension);

    t.end();
});

test('basic APIs', t => {
    const vm = new VirtualMachine();
    const api = createAPI(vm);

    t.equal(api.Scratch.ArgumentType.NUMBER, 'number');
    t.equal(api.Scratch.BlockType.REPORTER, 'reporter');
    t.equal(api.Scratch.TargetType.SPRITE, 'sprite');
    t.equal(api.Scratch.Cast.toNumber('3.14'), 3.14);

    t.equal(api.Scratch.vm, vm);
    t.equal(api.Scratch.renderer, vm.runtime.renderer);
    t.equal(api.Scratch.extensions.unsandboxed, true);

    t.end();
});

test('ScratchX', t => {
    const vm = new VirtualMachine();
    const api = createAPI(vm);

    const ext = {
        test: () => 2
    };
    const descriptor = {
        blocks: [
            ['r', 'test', 'test']
        ]
    };
    api.ScratchExtensions.register('Test', descriptor, ext);

    t.equal(api.extensions.length, 1);
    t.end();
});

test('canFetch', t => {
    // see tw_security_manager.js
    const vm = new VirtualMachine();
    const api = createAPI(vm);
    api.Scratch.canFetch('https://example.com/').then(allowed => {
        t.ok(allowed);
        t.end();
    });
});

test('fetch', async t => {
    t.plan(5);
    const vm = new VirtualMachine();
    const api = createAPI(vm);
    api.Scratch.canFetch = url => url === 'https://example.com/2';
    await t.rejects(api.Scratch.fetch('https://example.com/1'), /Permission to fetch https:\/\/example.com\/1 rejected/);
    await t.rejects(api.Scratch.fetch(new Request('https://example.com/1')), /Permission to fetch https:\/\/example.com\/1 rejected/);
    t.equal(await api.Scratch.fetch('https://example.com/2'), '[Response https://example.com/2 options={"redirect":"error"}]');
    t.equal(await api.Scratch.fetch(new Request('https://example.com/2')), '[Response https://example.com/2 options={"redirect":"error"}]');
    t.equal(await api.Scratch.fetch('https://example.com/2', {
        // redirect should be ignored and always set to error
        redirect: 'follow',
        method: 'POST',
        body: 'abc'
    }), '[Response https://example.com/2 options={"redirect":"error","method":"POST","body":"abc"}]');
    t.end();
});

test('canOpenWindow', async t => {
    // see tw_security_manager.js
    t.plan(2);
    const vm = new VirtualMachine();
    const api = createAPI(vm);
    const result = api.Scratch.canOpenWindow('https://example.com/');
    t.type(result, Promise);
    t.equal(await result, true);
    t.end();
});

test('openWindow', async t => {
    t.plan(3);
    const vm = new VirtualMachine();
    const api = createAPI(vm);
    api.Scratch.canOpenWindow = url => url === 'https://example.com/2';
    await t.rejects(api.Scratch.openWindow('https://example.com/1'), /Permission to open tab https:\/\/example.com\/1 rejected/);
    t.equal(await api.Scratch.openWindow('https://example.com/2'), '[Window https://example.com/2 target=_blank features=noreferrer]');
    t.equal(await api.Scratch.openWindow('https://example.com/2', 'popup=1'), '[Window https://example.com/2 target=_blank features=noreferrer,popup=1]');
    t.end();
});

test('canRedirect', async t => {
    // see tw_security_manager.js
    t.plan(2);
    const vm = new VirtualMachine();
    const api = createAPI(vm);
    const result = api.Scratch.canRedirect('https://example.com/');
    t.type(result, Promise);
    t.equal(await result, true);
    t.end();
});

test('redirect', async t => {
    t.plan(3);
    const vm = new VirtualMachine();
    const api = createAPI(vm);
    api.Scratch.canRedirect = url => url === 'https://example.com/safe-redirect-place';
    await t.rejects(api.Scratch.redirect('https://example.com/not-safe'), /Permission to redirect to https:\/\/example.com\/not-safe rejected/);
    t.equal(global.location.href, 'https://turbowarp.org/editor');
    await api.Scratch.redirect('https://example.com/safe-redirect-place');
    t.equal(global.location.href, 'https://example.com/safe-redirect-place');
    t.end();
});

test('translate', async t => {
    t.plan(5);
    const vm = new VirtualMachine();
    const api = createAPI(vm);

    t.equal(api.Scratch.translate({
        id: 'test1',
        default: 'Message 1: {var}',
        description: 'Description'
    }, {
        var: 'test'
    }), 'Message 1: test');
    t.equal(api.Scratch.translate('test1 {var}', {
        var: 'ok'
    }), 'test1 ok');

    api.Scratch.translate.setup({
        en: {
            test1: 'EN Message 1: {var}'
        },
        es: {
            test1: 'ES Message 1: {var}'
        }
    });
    t.equal(api.Scratch.translate({
        id: 'test1',
        default: 'Message 1: {var}',
        description: 'Description'
    }, {
        var: 'test'
    }), 'EN Message 1: test');
    t.equal(api.Scratch.translate('test1 {var}', {
        var: 'ok'
    }), 'test1 ok');

    await vm.setLocale('es');
    // do not call setup() again; real extensions will not do that.
    // need to make sure that the translatiosn are saved after calling setLocale.
    t.equal(api.Scratch.translate({
        id: 'test1',
        default: 'Message 1: {var}',
        description: 'Description'
    }, {
        var: 'test'
    }), 'ES Message 1: test');

    t.end();
});

test('canRecordAudio', async t => {
    t.plan(2);
    const vm = new VirtualMachine();
    const api = createAPI(vm);

    vm.securityManager.canRecordAudio = () => false;
    t.equal(await api.Scratch.canRecordAudio(), false);

    vm.securityManager.canRecordAudio = () => true;
    t.equal(await api.Scratch.canRecordAudio(), true);
    
    t.end();
});

test('canRecordVideo', async t => {
    t.plan(2);
    const vm = new VirtualMachine();
    const api = createAPI(vm);

    vm.securityManager.canRecordVideo = () => false;
    t.equal(await api.Scratch.canRecordVideo(), false);

    vm.securityManager.canRecordVideo = () => true;
    t.equal(await api.Scratch.canRecordVideo(), true);
    
    t.end();
});

test('canReadClipboard', async t => {
    t.plan(2);
    const vm = new VirtualMachine();
    const api = createAPI(vm);

    vm.securityManager.canReadClipboard = () => false;
    t.equal(await api.Scratch.canReadClipboard(), false);

    vm.securityManager.canReadClipboard = () => true;
    t.equal(await api.Scratch.canReadClipboard(), true);
    
    t.end();
});

test('canNotify', async t => {
    t.plan(2);
    const vm = new VirtualMachine();
    const api = createAPI(vm);

    vm.securityManager.canNotify = () => false;
    t.equal(await api.Scratch.canNotify(), false);

    vm.securityManager.canNotify = () => true;
    t.equal(await api.Scratch.canNotify(), true);
    
    t.end();
});

test('canGeolocate', async t => {
    t.plan(2);
    const vm = new VirtualMachine();
    const api = createAPI(vm);

    vm.securityManager.canGeolocate = () => false;
    t.equal(await api.Scratch.canGeolocate(), false);

    vm.securityManager.canGeolocate = () => true;
    t.equal(await api.Scratch.canGeolocate(), true);
    
    t.end();
});
