const tap = require('tap');
const fs = require('fs');
const path = require('path');
const VirtualMachine = require('../../src/virtual-machine');

const fixtureData = fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'tw-addon-blocks.sb3'));

const runTests = compilerEnabled => async test => {
    const load = async () => {
        const vm = new VirtualMachine();
        vm.setCompilerOptions({
            enabled: compilerEnabled
        });
        await vm.loadProject(fixtureData);
        vm.on('COMPILE_ERROR', (target, error) => test.fail(`Compile error ${target.getName()} ${error}`));
        return vm;
    };

    const getOutput = vm => vm.runtime.getTargetForStage().lookupVariableByNameAndType('output').value;

    await test.test('simple use', async t => {
        t.plan(7);

        const vm = await load();

        let calledBlock1 = false;
        let calledBlock2 = false;
    
        vm.addAddonBlock({
            procedureCode: 'block 2 %s',
            callback: (args, util) => {
                calledBlock1 = true;
                t.type(util.thread, 'object');
                // may have to update this ID when the project changes to match whatever the ID is for the
                // procedures_call block to block 2 %s
                t.equal(util.thread.peekStack(), 'c');
                t.deepEqual(args, {
                    'number or text': 'banana'
                });
            },
            arguments: ['number or text'],
            color: '#ff4c4c',
            secondaryColor: '#4cffff'
        });
    
        vm.addAddonBlock({
            procedureCode: 'block 3',
            // eslint-disable-next-line no-unused-vars
            callback: (args, util) => {
                calledBlock2 = true;
                t.deepEqual(args, {});
            },
            arguments: [],
            color: '#ff4c4c',
            secondaryColor: '#4cffff'
        });
    
        vm.greenFlag();
        vm.runtime._step();

        t.equal(getOutput(vm), 'block 1 value');
        t.ok(calledBlock1);
        t.ok(calledBlock2);
        t.end();
    });

    await test.test('yield by thread.status = STATUS_PROMISE_WAIT', async t => {
        const vm = await load();

        let threadToResume;

        vm.addAddonBlock({
            procedureCode: 'block 1',
            callback: (args, util) => {
                util.thread.status = 1; // STATUS_PROMISE_WAIT
                threadToResume = util.thread;
            },
            arguments: [],
            color: '#ff4c4c',
            secondaryColor: '#4cffff'
        });

        vm.greenFlag();
        vm.runtime._step();
        if (!threadToResume) {
            t.fail('did not run addon block');
        }

        t.equal(getOutput(vm), 'initial value');
        threadToResume.status = 0; // STATUS_RUNNING
        vm.runtime._step();
        t.equal(getOutput(vm), 'block 3 value');

        t.end();
    });

    await test.test('yield by block utility methods', async t => {
        const vm = await load();

        let isFirstCall = true;

        vm.addAddonBlock({
            procedureCode: 'block 1',
            callback: (args, util) => {
                if (isFirstCall) {
                    util.runtime.requestRedraw();
                    util.yield();
                    isFirstCall = false;
                }
            },
            arguments: [],
            color: '#ff4c4c',
            secondaryColor: '#4cffff'
        });

        vm.greenFlag();
        vm.runtime._step();
        t.equal(isFirstCall, false);
        t.equal(getOutput(vm), 'initial value');
        vm.runtime._step();
        t.equal(getOutput(vm), 'block 3 value');

        t.end();
    });

    test.end();
};

tap.test('with compiler disabled', runTests(false));
tap.test('with compiler enabled', runTests(true));
