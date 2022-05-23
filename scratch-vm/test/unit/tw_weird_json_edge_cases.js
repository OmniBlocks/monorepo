const test = require('tap').test;
const VirtualMachine = require('../../src');
const Variable = require('../../src/engine/variable');
const RenderedTarget = require('../../src/sprites/rendered-target');
const Sprite = require('../../src/sprites/sprite');

test('tw: non-primitive values in lists and variables converted to strings', t => {
    const vm = new VirtualMachine();
    const sprite = new Sprite();
    const target = new RenderedTarget(sprite, vm.runtime);

    target.variables.var1 = new Variable('var', 'test var', Variable.SCALAR_TYPE, false);
    target.variables.var1.value = null;

    target.variables.var2 = new Variable('var2', 'test var', Variable.SCALAR_TYPE, false);
    target.variables.var2.value = undefined;

    target.variables.var3 = new Variable('var3', 'test var', Variable.SCALAR_TYPE, false);
    target.variables.var3.value = {};

    target.variables.var4 = new Variable('var4', 'test var', Variable.SCALAR_TYPE, false);
    target.variables.var4.value = 1;

    target.variables.var5 = new Variable('var5', 'test var', Variable.SCALAR_TYPE, false);
    target.variables.var5.value = 'abc';

    target.variables.var6 = new Variable('var6', 'test var', Variable.SCALAR_TYPE, false);
    target.variables.var6.value = false;

    target.variables.list = new Variable('list', 'test list', Variable.LIST_TYPE, false);
    target.variables.list.value = ['abc', false, 1, null, undefined, {}];

    vm.runtime.addTarget(target);

    const json = JSON.parse(vm.toJSON());

    t.deepEqual(json.targets[0].variables.var1[1], 'null');
    t.deepEqual(json.targets[0].variables.var2[1], 'undefined');
    t.deepEqual(json.targets[0].variables.var3[1], '[object Object]');
    t.deepEqual(json.targets[0].variables.var4[1], 1);
    t.deepEqual(json.targets[0].variables.var5[1], 'abc');
    t.deepEqual(json.targets[0].variables.var6[1], false);

    t.deepEqual(json.targets[0].lists.list[1], ['abc', false, 1, 'null', 'undefined', '[object Object]']);

    t.end();
});
