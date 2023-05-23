const {test} = require('tap');
const {deserialize} = require('../../src/serialization/sb3');
const Runtime = require('../../src/engine/runtime');

// Note that at some point it is likely that this extension will break
test('text extension defaults to URL', async t => {
    t.plan(2);
    const rt = new Runtime();
    const deserialized = await deserialize({
        targets: [
            {
                isStage: true,
                name: 'Stage',
                variables: {},
                lists: {},
                broadcasts: {},
                blocks: {
                    a: {
                        opcode: 'text_clearText',
                        next: null,
                        parent: null,
                        inputs: {},
                        fields: {},
                        shadow: false,
                        topLevel: true,
                        x: 203,
                        y: 250
                    },
                    b: {
                        opcode: 'pen_clear',
                        next: null,
                        parent: null,
                        inputs: {},
                        fields: {},
                        shadow: false,
                        topLevel: true,
                        x: 203,
                        y: 250
                    },
                    c: {
                        opcode: 'griffpatch_doTick',
                        next: null,
                        parent: null,
                        inputs: {},
                        fields: {},
                        shadow: false,
                        topLevel: true,
                        x: 203,
                        y: 250
                    }
                },
                comments: {},
                currentCostume: 0,
                costumes: [],
                sounds: [],
                volume: 100,
                layerOrder: 0,
                tempo: 60,
                videoTransparency: 50,
                videoState: 'on',
                textToSpeechLanguage: null
            }
        ],
        monitors: [],
        // this list intentionally wrong to make sure we don't rely on its contents
        extensions: [],
        extensionURLs: {
            griffpatch: 'https://extensions.turbowarp.org/fake-box2d-url.js'
        },
        meta: {
            semver: '3.0.0',
            vm: '0.2.0',
            agent: ''
        }
    }, rt);
    t.equal(deserialized.extensions.extensionURLs.get('text'), 'https://extensions.turbowarp.org/lab/text.js');
    t.equal(deserialized.extensions.extensionURLs.get('griffpatch'), 'https://extensions.turbowarp.org/fake-box2d-url.js');
    t.end();
});
