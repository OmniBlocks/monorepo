const fs = require('fs');
const path = require('path');
const {test} = require('tap');
const VirtualMachine = require('../../src/virtual-machine');
const Scratch = require('../../src/extension-support/tw-extension-api-common');

class LoopsAndThings {
    getInfo () {
        return {
            id: 'loopsAndThings',
            name: 'Loops and things test',
            blocks: [
                {
                    opcode: 'conditional',
                    blockType: Scratch.BlockType.CONDITIONAL,
                    text: 'run branch [BRANCH] of',
                    arguments: {
                        BRANCH: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    },
                    branchCount: 3
                },
                {
                    opcode: 'loop',
                    blockType: Scratch.BlockType.LOOP,
                    text: 'my repeat [TIMES]',
                    arguments: {
                        TIMES: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                }
            ]
        };
    }

    conditional ({BRANCH}, util) {
        return Scratch.Cast.toNumber(BRANCH);
    }

    loop ({TIMES}, util) {
        const times = Math.round(Scratch.Cast.toNumber(TIMES));
        if (typeof util.stackFrame.loopCounter === 'undefined') {
            util.stackFrame.loopCounter = times;
        }
        util.stackFrame.loopCounter--;
        if (util.stackFrame.loopCounter >= 0) {
            return true;
        }
    }
}

const compilerAndInterpreter = (name, callback) => {
    test(`${name} - interpreted`, t => {
        callback(t, {
            enabled: false
        });
    });
    test(`${name} - compiled`, t => {
        callback(t, {
            enabled: true
        });
    });
};

compilerAndInterpreter('CONDITIONAL', (t, co) => {
    t.plan(1);

    const vm = new VirtualMachine();
    vm.setCompilerOptions(co);
    vm.extensionManager.addBuiltinExtension('loopsAndThings', LoopsAndThings);
    
    vm.loadProject(fs.readFileSync(path.join(__dirname, '../fixtures/tw-conditional.sb3'))).then(() => {
        let okayCount = 0;
        vm.runtime.on('SAY', (target, type, text) => {
            if (text === 'OK!') {
                okayCount++;
            } else if (text === 'end') {
                t.equal(okayCount, 5);
                t.end();
            }
        });

        vm.greenFlag();
        vm.runtime._step();
    });
});
