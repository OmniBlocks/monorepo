const test = require('tap').test;
const VirtualMachine = require('../../src');
const Variable = require('../../src/engine/variable');
const RenderedTarget = require('../../src/sprites/rendered-target');
const Sprite = require('../../src/sprites/sprite');

test('tw: weird JSON edge cases', t => {
    const vm = new VirtualMachine();
    const sprite = new Sprite();
    const target = new RenderedTarget(sprite, vm.runtime);

    target.variables.var = new Variable('var', 'test var', Variable.SCALAR_TYPE, false);
    target.variables.list = new Variable('list', 'test list', Variable.LIST_TYPE, false);
    target.variables.var.value = null;
    target.variables.list.value = [1, null];
    vm.runtime.addTarget(target);

    const json = JSON.parse(vm.toJSON());
    t.deepEqual(json.targets[0].variables.var[1], 'null');
    t.deepEqual(json.targets[0].lists.list[1], [1, 'null']);
    t.end();
});
