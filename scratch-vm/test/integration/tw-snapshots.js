const {test} = require('tap');
const Snapshots = require('../snapshot/lib');

for (const testName of Snapshots.tests) {
    test(testName, async t => {
        const expected = Snapshots.getExpectedSnapshot(testName);
        if (expected) {
            const actual = await Snapshots.generateActualSnapshot(testName);
            if (actual === expected) {
                t.pass('matches');
            } else {
                // This assertion will always fail, but tap will print a readable diff
                t.equal(expected, actual, 'did not match; you may have to run: node snapshot-tests --update');
            }
        } else {
            t.fail('missing snapshot, please run: node snapshot-tests --update');
        }
        t.end();
    });
}
