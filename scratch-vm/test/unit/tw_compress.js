const {test} = require('tap');
const compress = require('../../src/serialization/tw-compress-sb3');
const nodeCrypto = require('crypto');

test('handles type INPUT_DIFF_BLOCK_SHADOW (3) compressed inputs', t => {
    const data = {
        targets: [
            {
                isStage: true,
                name: 'Stage',
                variables: {},
                lists: {},
                broadcasts: {},
                blocks: {
                    'CmRa^i]o}QL77;hk:54o': {
                        opcode: 'looks_switchbackdropto',
                        next: null,
                        parent: null,
                        inputs: {
                            BACKDROP: [
                                3,
                                'cq84G6uywD{m2R,E03Ci',
                                'E3/*4H*xk38{=*U;bVWm'
                            ]
                        },
                        fields: {},
                        shadow: false,
                        topLevel: true,
                        x: 409,
                        y: 300
                    },
                    'cq84G6uywD{m2R,E03Ci': {
                        opcode: 'operator_not',
                        next: null,
                        parent: 'CmRa^i]o}QL77;hk:54o',
                        inputs: {},
                        fields: {},
                        shadow: false,
                        topLevel: false
                    },
                    'E3/*4H*xk38{=*U;bVWm': {
                        opcode: 'looks_backdrops',
                        next: null,
                        parent: 'CmRa^i]o}QL77;hk:54o',
                        inputs: {},
                        fields: {
                            BACKDROP: [
                                'backdrop1',
                                null
                            ]
                        },
                        shadow: true,
                        topLevel: false
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
        extensions: [],
        meta: {
            semver: '3.0.0',
            vm: '0.2.0',
            agent: ''
        }
    };
    compress(data);

    const blocks = Object.entries(data.targets[0].blocks);
    t.equal(blocks.length, 3);

    const [parentId, parentBlock] = blocks.find(i => i[1].opcode === 'looks_switchbackdropto');
    const [inputId, inputBlock] = blocks.find(i => i[1].opcode === 'operator_not');
    const [shadowId, shadowBlock] = blocks.find(i => i[1].opcode === 'looks_backdrops');

    t.equal(parentBlock.inputs.BACKDROP.length, 3);
    t.equal(parentBlock.inputs.BACKDROP[0], 3);
    t.equal(parentBlock.inputs.BACKDROP[1], inputId);
    t.equal(parentBlock.inputs.BACKDROP[2], shadowId);

    t.equal(inputBlock.parent, parentId);
    t.equal(shadowBlock.parent, parentId);

    t.end();
});

test('ID uniqueness is preserved', t => {
    const soup = 'abcdefghjijklmnopqstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!'.split('');

    const originalBroadcasts = Object.fromEntries(soup.map(id => `b-${id}`).map(id => [id, id]));
    const originalStageVariables = Object.fromEntries(soup.map(i => `gv-${i}`).map(id => [id, [id, 0]]));
    const originalStageLists = Object.fromEntries(soup.map(i => `gl-${i}`).map(id => [id, [id, null]]));
    const originalStageBlocks = Object.fromEntries(soup.map(i => `gb-${i}`).map(id => [
        id,
        {
            opcode: 'control_delete_this_clone',
            next: null,
            parent: null,
            inputs: {},
            fields: {},
            shadow: false,
            topLevel: true,
            x: 279,
            y: 281
        }
    ]));
    const originalStageComments = Object.fromEntries(soup.map(i => `gc-${i}`).map(id => [
        id,
        {
            blockId: null,
            x: 100,
            y: 100,
            width: 200,
            height: 200,
            minimized: false,
            text: id
        }
    ]));
    const originalTargetVariables = Object.fromEntries(soup.map(i => `lv-${i}`).map(id => [id, [id, 0]]));
    const originalTargetLists = Object.fromEntries(soup.map(i => `ll-${i}`).map(id => [id, [id, null]]));
    const originalTargetBlocks = Object.fromEntries(soup.map(i => `lb-${i}`).map(id => [
        id,
        {
            opcode: 'control_delete_this_clone',
            next: null,
            parent: null,
            inputs: {},
            fields: {},
            shadow: false,
            topLevel: true,
            x: 1000,
            y: 10
        }
    ]));
    const originalTargetComments = Object.fromEntries(soup.map(i => `lc-${i}`).map(id => [
        id,
        {
            blockId: null,
            x: 400,
            y: 401,
            width: 402,
            height: 403,
            minimized: false,
            text: id
        }
    ]));

    const data = {
        targets: [
            {
                isStage: true,
                name: 'Stage',
                variables: originalStageVariables,
                lists: originalStageLists,
                broadcasts: originalBroadcasts,
                blocks: originalStageBlocks,
                comments: originalStageComments,
                currentCostume: 0,
                costumes: [],
                sounds: [],
                volume: 100,
                layerOrder: 0,
                tempo: 60,
                videoTransparency: 50,
                videoState: 'on',
                textToSpeechLanguage: null
            },
            {
                isStage: false,
                name: 'Sprite1',
                variables: originalTargetVariables,
                lists: originalTargetLists,
                broadcasts: {},
                blocks: originalTargetBlocks,
                comments: originalTargetComments,
                currentCostume: 0,
                costumes: [],
                sounds: [],
                volume: 100,
                visible: true,
                x: 0,
                y: 0,
                size: 100,
                direction: 90,
                draggable: false,
                rotationStyle: 'all around'
            }
        ],
        monitors: [],
        extensions: [],
        meta: {
            semver: '3.0.0',
            vm: '0.2.0',
            agent: ''
        }
    };
    compress(data);

    const allObjects = [
        data.targets[0].broadcasts,
        data.targets[0].variables,
        data.targets[0].lists,
        data.targets[0].blocks,
        data.targets[0].comments,
        data.targets[1].variables,
        data.targets[1].lists,
        data.targets[1].blocks,
        data.targets[1].comments
    ];
    const allIds = allObjects.map(i => Object.keys(i)).flat();
    t.equal(new Set(allIds).size, allIds.length);

    // Also throw in a primitive snapshot test
    const stringified = JSON.stringify(data);
    const sha256 = nodeCrypto.createHash('sha256')
        .update(stringified)
        .digest('hex');
    t.equal(sha256, '41ccf6163fed035fd3224f355c37365f4c4b96d8968eaca5dc8362982f981b82');

    t.end();
});
