const fs = require('fs');
const path = require('path');
const test = require('tap').test;
const inlineSvgFonts = require('../src/font-inliner');

test('inlineSvgFonts inlines custom font', t => {
    const fonts = {
        '"Custom Font 1", sans-serif': '@font-face { font-family: "Custom Font 1"; src: url(...); }',
        'Custom Font 2': '@font-face { font-family: "Custom Font 2"; src: url(...); }'
    };
    const svgString = fs.readFileSync(path.join(__dirname, './fixtures/custom-font.svg'), 'utf-8');
    const inlined = inlineSvgFonts(svgString, fonts);
    t.ok(
        inlined.includes('<style>@font-face { font-family: "Custom Font 1"; src: url(...); }</style>'),
        'inlined custom font'
    );
    t.notOk(
        inlined.includes('<style>@font-face { font-family: "Custom Font 2"; src: url(...); }</style>'),
        'ignored unused font'
    );
    t.end();
});

test('custom font argument is optional', t => {
    const svgString = fs.readFileSync(path.join(__dirname, './fixtures/custom-font.svg'), 'utf-8');
    const inlined = inlineSvgFonts(svgString);
    t.ok(inlined.includes('<defs><style></style></defs>'), 'did not inline');
    t.end();
});
