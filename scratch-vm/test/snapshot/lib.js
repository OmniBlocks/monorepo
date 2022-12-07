const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
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

const computeSHA256 = buffer => crypto
    .createHash('SHA256')
    .update(buffer)
    .digest('hex');

/**
 * @param {string} snapshot a snapshot
 * @returns {string} SHA-256
 */
const parseSnapshotSHA256 = snapshot => snapshot.match(/^\/\/ Input SHA-256: ([0-9a-f]{64})$/m)[1];

const generateActualSnapshot = async file => {
    const vm = new VM();

    const projectData = getProjectData(file);
    const inputSHA256 = computeSHA256(projectData);

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

    return `// TW Snapshot\n// Input SHA-256: ${inputSHA256}\n\n${generatedJS.join('\n\n')}\n`;
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

/**
 * @param {string} expected from getExpectedSnapshot
 * @param {string} actual from getActualSnapshot
 * @returns {'VALID'|'INPUT_MODIFIED'|'INVALID'} result of comparison
 */
const compareSnapshots = (expected, actual) => {
    if (expected === actual) {
        return 'VALID';
    }

    const expectedSHA256 = parseSnapshotSHA256(expected);
    const actualSHA256 = parseSnapshotSHA256(actual);
    if (expectedSHA256 !== actualSHA256) {
        return 'INPUT_MODIFIED';
    }

    return 'INVALID';
};

const saveSnapshot = (test, data) => {
    fs.writeFileSync(getSnapshotPath(test), data);
};

module.exports = {
    tests: testProjects,
    generateActualSnapshot,
    getExpectedSnapshot,
    compareSnapshots,
    saveSnapshot
};
