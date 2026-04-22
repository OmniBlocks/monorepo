const {test} = require('tap');
const VirtualMachine = require('../../src/virtual-machine');
const BlockType = require('../../src/extension-support/block-type');

test('with explicit category colors', t => {
    const vm = new VirtualMachine();
    vm.extensionManager._registerInternalExtension({
        getInfo: () => ({
            id: 'testextension',
            name: 'test',
            color1: '#ff0000',
            color2: '#00ff00',
            color3: '#0000ff',
            blocks: [
                {
                    blockType: BlockType.COMMAND,
                    opcode: 'defaults'
                },
                {
                    blockType: BlockType.COMMAND,
                    opcode: 'color1',
                    color1: '#ffff00'
                },
                {
                    blockType: BlockType.COMMAND,
                    opcode: 'color2',
                    color2: '#ff00ff'
                },
                {
                    blockType: BlockType.COMMAND,
                    opcode: 'color3',
                    color3: '#00ffff'
                },
                {
                    blockType: BlockType.COMMAND,
                    opcode: 'colorAll',
                    color1: '#7fff00',
                    color2: '#ff007f',
                    color3: '#007fff'
                }
            ]
        })
    });

    const blocks = vm.runtime.getBlocksJSON();

    t.equal(blocks[0].colour, '#ff0000');
    t.equal(blocks[0].colourSecondary, '#00ff00');
    t.equal(blocks[0].colourTertiary, '#0000ff');

    t.equal(blocks[1].colour, '#ffff00');
    t.equal(blocks[1].colourSecondary, '#00ff00');
    t.equal(blocks[1].colourTertiary, '#0000ff');

    t.equal(blocks[2].colour, '#ff0000');
    t.equal(blocks[2].colourSecondary, '#ff00ff');
    t.equal(blocks[2].colourTertiary, '#0000ff');

    t.equal(blocks[3].colour, '#ff0000');
    t.equal(blocks[3].colourSecondary, '#00ff00');
    t.equal(blocks[3].colourTertiary, '#00ffff');

    t.equal(blocks[4].colour, '#7fff00');
    t.equal(blocks[4].colourSecondary, '#ff007f');
    t.equal(blocks[4].colourTertiary, '#007fff');

    t.end();
});

test('with the default colors', t => {
    const vm = new VirtualMachine();
    vm.extensionManager._registerInternalExtension({
        getInfo: () => ({
            id: 'testextension',
            name: 'test',
            blocks: [
                {
                    blockType: BlockType.COMMAND,
                    opcode: 'defaults'
                },
                {
                    blockType: BlockType.COMMAND,
                    opcode: 'color1',
                    color1: '#ffff00'
                },
                {
                    blockType: BlockType.COMMAND,
                    opcode: 'color2',
                    color2: '#ff00ff'
                },
                {
                    blockType: BlockType.COMMAND,
                    opcode: 'color3',
                    color3: '#00ffff'
                },
                {
                    blockType: BlockType.COMMAND,
                    opcode: 'colorAll',
                    color1: '#7fff00',
                    color2: '#ff007f',
                    color3: '#007fff'
                }
            ]
        })
    });

    const blocks = vm.runtime.getBlocksJSON();

    t.equal(blocks[0].colour, '#0FBD8C');
    t.equal(blocks[0].colourSecondary, '#0DA57A');
    t.equal(blocks[0].colourTertiary, '#0B8E69');

    t.equal(blocks[1].colour, '#ffff00');
    t.equal(blocks[1].colourSecondary, '#0DA57A');
    t.equal(blocks[1].colourTertiary, '#0B8E69');

    t.equal(blocks[2].colour, '#0FBD8C');
    t.equal(blocks[2].colourSecondary, '#ff00ff');
    t.equal(blocks[2].colourTertiary, '#0B8E69');

    t.equal(blocks[3].colour, '#0FBD8C');
    t.equal(blocks[3].colourSecondary, '#0DA57A');
    t.equal(blocks[3].colourTertiary, '#00ffff');

    t.equal(blocks[4].colour, '#7fff00');
    t.equal(blocks[4].colourSecondary, '#ff007f');
    t.equal(blocks[4].colourTertiary, '#007fff');

    t.end();
});
<<<<<<< HEAD

test('with only color1 provided - generates fallback colors', t => {
    const vm = new VirtualMachine();
    vm.extensionManager._registerInternalExtension({
        getInfo: () => ({
            id: 'testextension',
            name: 'test',
            color1: '#ff0000', // Only color1 provided
            blocks: [
                {
                    blockType: BlockType.COMMAND,
                    opcode: 'testBlock'
                }
            ]
        })
    });

    const blocks = vm.runtime.getBlocksJSON();

    // Should have color1 as provided
    t.equal(blocks[0].colour, '#ff0000');
    // color2 should be color1 darkened by 10%
    t.type(blocks[0].colourSecondary, 'string');
    t.ok(blocks[0].colourSecondary.startsWith('#'));
    // color3 should be color1 darkened by 20%
    t.type(blocks[0].colourTertiary, 'string');
    t.ok(blocks[0].colourTertiary.startsWith('#'));
    // color2 should be darker than color1
    t.not(blocks[0].colourSecondary, '#ff0000');
    // color3 should be darker than color2
    t.not(blocks[0].colourTertiary, blocks[0].colourSecondary);

    t.end();
});
=======
>>>>>>> 7b521ff000780d61b18ac47bfb65625451caceb5
