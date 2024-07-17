const {test} = require('tap');
const fs = require('fs');
const pathUtil = require('path');
const fixForVanilla = require('../src/tw-fix-for-vanilla');

const xmldom = require('xmldom');
global.DOMParser = xmldom.DOMParser;
global.XMLSerializer = xmldom.XMLSerializer;

test('fixForVanilla', t => {
    const fixtureDir = pathUtil.join(__dirname, 'fixtures');
    const allFixtureNames = fs.readdirSync(fixtureDir).sort();

    for (const fixtureName of allFixtureNames) {
        if (fixtureName.endsWith('.fixed.svg')) continue;

        const inputPath = pathUtil.join(fixtureDir, fixtureName);
        // Don't *need* to convert Buffer to Uint8Array, but in the actual website we will
        // be using Uint8Array so this ensures we don't accidentally rely on Buffer methods.
        const inputData = new Uint8Array(fs.readFileSync(inputPath));

        const actualFixed = fixForVanilla(inputData);

        // If there is no .fixed.svg, then we expect no change.
        const expectedPath = pathUtil.join(fixtureDir, fixtureName.replace(/\.svg$/, '.fixed.svg'));
        if (fs.existsSync(expectedPath)) {
            const expectedFixed = fs.readFileSync(expectedPath, 'utf-8');
            t.equal(new TextDecoder().decode(actualFixed), expectedFixed, `${fixtureName} - changed`);
        } else {
            // Output should be pointer to the input, not a copy
            t.equal(actualFixed, inputData, `${fixtureName} - no change`);
        }
    }

    t.end();
});
