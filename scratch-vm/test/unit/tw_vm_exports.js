const {test} = require('tap');
const VM = require('../../src/virtual-machine');

test('exports exist', t => {
    const vm = new VM();
    t.type(vm.exports.Sprite, 'function');
    t.type(vm.exports.RenderedTarget, 'function');
    t.end();
});
