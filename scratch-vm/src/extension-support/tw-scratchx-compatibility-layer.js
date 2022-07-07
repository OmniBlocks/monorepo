// ScratchX API Documentation: https://github.com/LLK/scratchx/wiki/

// Global Scratch API from extension-worker.js
/* globals Scratch */

const ArgumentType = require('./argument-type');
const BlockType = require('./block-type');

const parseScratchXBlockType = type => {
    if (type === '' || type === ' ' || type === 'w') {
        return {
            type: BlockType.COMMAND,
            async: type === 'w'
        };
    }
    if (type === 'r' || type === 'R') {
        return {
            type: BlockType.REPORTER,
            async: type === 'R'
        };
    }
    if (type === 'b') {
        return {
            type: BlockType.BOOLEAN,
            // ScratchX docs don't seem to mention boolean reporters that wait
            async: false
        };
    }
    if (type === 'h') {
        return {
            type: BlockType.HAT,
            async: false
        };
    }
    throw new Error(`Unknown ScratchX block type: ${type}`);
};

const isScratchCompatibleValue = v => typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean';

/**
 * @param {string} argument ScratchX argument with leading % removed.
 * @param {unknown} defaultValue Default value, if any
 */
const parseScratchXArgument = (argument, defaultValue) => {
    const result = {};
    if (isScratchCompatibleValue(defaultValue)) {
        result.defaultValue = defaultValue;
    }
    // TODO: ScratchX docs don't mention support for boolean arguments?
    if (argument === 's') {
        result.type = ArgumentType.STRING;
    } else if (argument === 'n') {
        result.type = ArgumentType.NUMBER;
    } else if (argument[0] === 'm') {
        result.type = ArgumentType.STRING;
        const split = argument.split('.');
        const menuName = split[1];
        result.menu = menuName;
    } else {
        throw new Error(`Unknown ScratchX argument type: ${argument}`);
    }
    return result;
};

const wrapScratchXFunction = (originalFunction, argumentCount, async) => args => {
    // Convert Scratch 3's argument object to an argument list expected by ScratchX
    const argumentList = [];
    for (let i = 0; i < argumentCount; i++) {
        argumentList.push(args[i.toString()]);
    }
    if (async) {
        return new Promise(resolve => {
            originalFunction(...argumentList, resolve);
        });
    }
    return originalFunction(...argumentList);
};

/**
 * @param {string} scratchXName
 * @returns {string}
 */
const generateExtensionId = scratchXName => {
    // Changing this logic will break any existing projects.
    const sanitizedName = scratchXName.replace(/[^a-z0-9]/gi, '').toLowerCase();
    return `scratchx${sanitizedName}`;
};

/**
 * @typedef ScratchXDescriptor
 * @property {any[][]} blocks
 */

/**
 * @param {string} name
 * @param {ScratchXDescriptor} descriptor
 * @param {Record<string, () => unknown>} functions
 */
const convert = (name, descriptor, functions) => {
    const extensionId = generateExtensionId(name);
    const info = {
        id: extensionId,
        name: name,
        blocks: []
    };
    const scratch3Extension = {
        getInfo: () => info
    };

    if (descriptor.url) {
        info.docsURI = descriptor.url;
    }

    for (const blockDescriptor of descriptor.blocks) {
        const scratchXBlockType = blockDescriptor[0];
        if (scratchXBlockType === '-') {
            // Separator
            info.blocks.push('---');
            continue;
        }
        const blockText = blockDescriptor[1];
        const functionName = blockDescriptor[2];
        const defaultArgumentValues = blockDescriptor.slice(3);

        let scratchText = '';
        const argumentInfo = [];
        const blockTextParts = blockText.split(/%([\w.]+)/g);
        for (let i = 0; i < blockTextParts.length; i++) {
            const part = blockTextParts[i];
            const isArgument = i % 2 === 1;
            if (isArgument) {
                parseScratchXArgument(part);
                const argumentIndex = Math.floor(i / 2).toString();
                const argumentDefaultValue = defaultArgumentValues[argumentIndex];
                argumentInfo[argumentIndex] = parseScratchXArgument(part, argumentDefaultValue);
                scratchText += `[${argumentIndex}]`;
            } else {
                scratchText += part;
            }
        }

        const scratch3BlockType = parseScratchXBlockType(scratchXBlockType);
        const blockInfo = {
            opcode: functionName,
            blockType: scratch3BlockType.type,
            text: scratchText,
            arguments: argumentInfo
        };
        info.blocks.push(blockInfo);

        const originalFunction = functions[functionName];
        const argumentCount = argumentInfo.length;
        scratch3Extension[functionName] = wrapScratchXFunction(
            originalFunction,
            argumentCount,
            scratch3BlockType.async
        );
    }

    const menus = descriptor.menus;
    if (menus) {
        const scratch3Menus = {};
        for (const menuName of Object.keys(menus) || {}) {
            const menuItems = menus[menuName];
            const menuInfo = {
                items: menuItems
            };
            scratch3Menus[menuName] = menuInfo;
        }
        info.menus = scratch3Menus;
    }

    return scratch3Extension;
};

const register = (name, descriptor, functions) => {
    const scratch3Extension = convert(name, descriptor, functions);
    Scratch.extensions.register(scratch3Extension);
};

module.exports = {
    register,
    
    // For tests
    convert
};
