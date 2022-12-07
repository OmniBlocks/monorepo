const {test} = require('tap');
const Snapshots = require('../snapshot/lib');

for (const testName of Snapshots.tests) {
    test(testName, async t => {
        const expected = Snapshots.getExpectedSnapshot(testName);
        if (expected) {
            const actual = await Snapshots.generateActualSnapshot(testName);
            const result = Snapshots.compareSnapshots(expected, actual);
            if (result === 'VALID') {
                t.pass('matches');
            } else if (result === 'INPUT_MODIFIED') {
                t.fail('input project changed; run: node test/snapshot --update');
            } else {
                // This assertion will always fail, but tap will print out the snapshots
                // for comparison.
                t.equal(expected, actual, 'did not match; you may have to run: node snapshot-tests --update');
            }
        } else {
            t.fail('missing snapshot, please run: node snapshot-tests --update');
        }
        t.end();
    });
}
