const {test} = require('tap');
const fs = require('fs');
const path = require('path');
const VM = require('../../src/virtual-machine');

test('spork compat: procedure prototype and argument reporters load as shadows', t => {
    const vm = new VM();
    const fixture = fs.readFileSync(path.join(__dirname, '../fixtures/tw-spork-custom-block-definition.sb3'));
    vm.loadProject(fixture).then(() => {
        let prototypeCount = 0;
        let argumentReporterCount = 0;

        for (const target of vm.runtime.targets) {
            for (const block of Object.values(target.blocks._blocks)) {
                if (block.opcode === 'procedures_prototype') {
                    prototypeCount++;
                    t.equal(block.shadow, true);
                } else if (block.opcode.startsWith('argument_reporter_')) {
                    argumentReporterCount++;
                    t.equal(block.shadow, true);
                }
            }
        }

        t.equal(prototypeCount, 1);
        t.equal(argumentReporterCount, 2);

        t.end();
    });
});
