const {test} = require('tap');
require('../fixtures/tw_mock_blob'); // must load Blob before VM so JSZip thinks Blob is supported
const fs = require('fs');
const pathUtil = require('path');
const VirtualMachine = require('../../src/virtual-machine');
const makeTestStorage = require('../fixtures/make-test-storage');
const JSZip = require('jszip');

/* globals Blob */

const fixture = fs.readFileSync(pathUtil.join(__dirname, '..', 'fixtures', 'tw-save-project-sb3.sb3'));

test('saveProjectSb3', async t => {
    t.plan(6);

    const vm = new VirtualMachine();
    vm.attachStorage(makeTestStorage());
    await vm.loadProject(fixture);

    // Test that it defaults to Blob
    // Note: we use a mock implementation of Blob in tests
    const blob = await vm.saveProjectSb3();
    t.type(blob, Blob);

    const buffer = await vm.saveProjectSb3('arraybuffer');
    t.type(buffer, ArrayBuffer);

    const base64 = await vm.saveProjectSb3('base64');
    t.type(base64, 'string');

    const zip = await JSZip.loadAsync(buffer);
    t.equal((await zip.file('project.json').async('string'))[0], '{');
    t.equal((await zip.file('d9c625ae1996b615a146ac2a7dbe74d7.svg').async('uint8array')).byteLength, 691);
    t.equal((await zip.file('cd21514d0531fdffb22204e0ec5ed84a.svg').async('uint8array')).byteLength, 202);

    t.end();
});
