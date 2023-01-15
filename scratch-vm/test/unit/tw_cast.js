const Cast = require('../../src/util/cast');
const {test} = require('tap');

test('Cast.compare with assorted whitespace characters', t => {
    // The lack of tab characters in these tests is intentional.

    t.equal(Cast.compare('', ''), 0);
    t.equal(Cast.compare('  ', ''), 1);
    t.equal(Cast.compare(' ', '  '), -1);
    t.equal(Cast.compare('   \u00a0   ', '\r\n'), 1);

    t.equal(Cast.compare(' 0', 0), 0);
    t.equal(Cast.compare(' 0 ', ' \r\n\u00a0  0 \n\n\n\n'), 0);
    t.equal(Cast.compare(' 0 ', ' \r\n\u00a0  0 \n\n\n\b'), 1);
    t.equal(Cast.compare(' 0', '0'), 0);
    t.equal(Cast.compare('', 0), -1);
    t.equal(Cast.compare(' ', 0), -1);
    t.equal(Cast.compare(' ', 0), -1);
    t.equal(Cast.compare('0', '  '), 1);
    t.equal(Cast.compare('\n0', '\n-1'), 1);

    t.equal(Cast.compare('', 'false'), -1);
    t.equal(Cast.compare('', ' false'), -1);
    t.equal(Cast.compare('\n', ' false'), -1);
    t.equal(Cast.compare(false, ''), 1);
    t.equal(Cast.compare(false, ' '), 1);

    t.end();
});
