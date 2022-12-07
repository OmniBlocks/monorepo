const path = require('path');
const fs = require('fs');
const VM = require('../../src/virtual-machine');
const JSGenerator = require('../../src/compiler/jsgen');

const executeDir = path.resolve(__dirname, '../fixtures/execute');
// sb2 project loading results in random IDs each time, so for now we only snapshot sb3 files
const testProjects = fs.readdirSync(executeDir).filter(uri => uri.endsWith('.sb3'));

const snapshotDir = path.resolve(__dirname, '__snapshots__');
fs.mkdirSync(snapshotDir, {
    recursive: true
});

const getProjectData = file => fs.readFileSync(path.join(executeDir, file));

const getSnapshotPath = file => path.join(snapshotDir, `${file}.tw-snapshot`);

const generateActualSnapshot = async file => {
    const vm = new VM();
    await vm.loadProject(getProjectData(file));

    /*
        Example source (manually formatted):
        (function factory32(thread) {
            const target = thread.target;
            const runtime = target.runtime;
            const stage = runtime.getTargetForStage();
            return function* gen30_whatever () {
                // ...
            };
        }; })
    */
    const normalizeJS = source => source
        .replace(/^\(function factory\d+/, '(function factoryXYZ')
        .replace(/return function\* gen\d+/, 'return function* genXYZ')
        .replace(/return function fun\d+/, 'return function funXYZ');

    const generatedJS = [];
    JSGenerator.testingApparatus = {
        report: (jsgen, factorySource) => {
            const targetName = jsgen.target.getName();
            const scriptName = jsgen.script.procedureCode || 'script';
            const js = normalizeJS(factorySource);
            generatedJS.push(`// ${targetName} ${scriptName}\n${js}`);
        }
    };

    vm.runtime.precompile();

    return `// TW Snapshot\n\n${generatedJS.join('\n\n')}\n`;
};

const getExpectedSnapshot = test => {
    try {
        return fs.readFileSync(getSnapshotPath(test), 'utf-8');
    } catch (e) {
        if (e.code === 'ENOENT') {
            return null;
        }
        throw e;
    }
};

const saveSnapshot = (test, data) => {
    fs.writeFileSync(getSnapshotPath(test), data);
};

module.exports = {
    tests: testProjects,
    generateActualSnapshot,
    getExpectedSnapshot,
    saveSnapshot
};
