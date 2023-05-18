const {test} = require('tap');
const VM = require('../../src/virtual-machine');
const MonitorRecord = require('../../src/engine/monitor-record');

test('Correctly serializes native extension only used by monitors', t => {
    const vm = new VM();
    vm.runtime.requestAddMonitor(MonitorRecord({
        opcode: 'pen_fakeblock'
    }));
    const json = JSON.parse(vm.toJSON());
    t.same(json.extensions, ['pen']);
    t.not('customExtensions' in json);
    t.end();
});

test('Correctly serializes custom extension only used by monitors', t => {
    const vm = new VM();
    vm.runtime.requestAddMonitor(MonitorRecord({
        opcode: 'fetch_fakeblock'
    }));
    vm.extensionManager.getExtensionURLs = () => ({
        fetch: 'https://extensions.turbowarp.org/fetch.js'
    });
    const json = JSON.parse(vm.toJSON());
    t.same(json.extensions, ['fetch']);
    t.same(json.extensionURLs, {
        fetch: 'https://extensions.turbowarp.org/fetch.js'
    });
    t.end();
});
