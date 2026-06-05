/**
 * ob: AmpMod project compatibility layer for switch-case blocks.
 *
 * AmpMod's switch-case implementation did not support fallthrough: each
 * control_case block would independently check the switch value and stop
 * executing after the matched case. The LibreKitten-based implementation
 * (now in OmniBlocks) uses C-style fallthrough semantics — once a case
 * matches, all subsequent cases also execute unless a control_break is
 * encountered.
 *
 * When loading an AmpMod project, this module patches each control_case
 * block's substack by appending an implicit control_break at the end,
 * preserving the original AmpMod per-case-stop behaviour.
 */

'use strict';

const uid = require('../util/uid');

/**
 * Detect whether a raw sb3 project JSON was created by AmpMod.
 * @param {object} json The raw project JSON.
 * @returns {boolean}
 */
const isAmpModProject = function (json) {
    return !!(json.meta && json.meta.platform && json.meta.platform.name === 'AmpMod');
};

/**
 * Walk the "next" chain starting from startId in the given raw blocks map and
 * return the ID of the last block in the chain (the one whose next is null).
 * Returns null if startId is falsy.
 * @param {object} blocks Raw sb3 blocks map (keyed by block ID).
 * @param {string|null} startId
 * @returns {string|null}
 */
const getLastBlockInChain = function (blocks, startId) {
    if (!startId) return null;
    let currentId = startId;
    while (true) {
        const block = blocks[currentId];
        if (!block || Array.isArray(block)) return null;
        if (!block.next) return currentId;
        currentId = block.next;
    }
};

/**
 * Patch a single raw-sb3 blocks map so that every control_case substack ends
 * with a control_break block. This converts AmpMod's implicit-break semantics
 * to the explicit break expected by the LibreKitten/OmniBlocks runtime.
 *
 * This function operates on the raw JSON format that exists BEFORE
 * deserializeBlocks() has been called, so:
 *   - Non-primitive blocks are plain objects with opcode/next/parent/inputs.
 *   - SUBSTACK inputs are encoded as arrays: [type, blockId].
 *
 * @param {object} blocks Raw sb3 blocks map. Mutated in place.
 */
const patchBlocksForAmpMod = function (blocks) {
    for (const blockId in blocks) {
        if (!Object.prototype.hasOwnProperty.call(blocks, blockId)) continue;
        const block = blocks[blockId];

        // Skip compressed primitives (arrays) and non-case blocks.
        if (Array.isArray(block)) continue;
        if (block.opcode !== 'control_case') continue;

        // Raw SUBSTACK input: [inputType, firstBlockId] or absent.
        const substackInput = block.inputs && block.inputs.SUBSTACK;
        if (!substackInput || !Array.isArray(substackInput)) continue;

        // substackInput[1] is the ID of the first block inside the case body.
        const firstBlockId = substackInput[1];
        if (!firstBlockId || typeof firstBlockId !== 'string') continue;

        const lastId = getLastBlockInChain(blocks, firstBlockId);
        if (!lastId) continue;

        const lastBlock = blocks[lastId];
        if (!lastBlock || Array.isArray(lastBlock)) continue;

        // If the case body already ends with a break, nothing to do.
        if (lastBlock.opcode === 'control_break') continue;

        // Append an implicit control_break after the last block.
        const breakId = uid();
        blocks[breakId] = {
            opcode: 'control_break',
            next: null,
            parent: lastId,
            inputs: {},
            fields: {},
            shadow: false,
            topLevel: false
        };
        lastBlock.next = breakId;
    }
};

/**
 * Apply AmpMod switch-case compatibility patches to a raw sb3 project JSON.
 * Does nothing when the project was not created by AmpMod.
 *
 * Call this before passing the JSON to the sb3 deserializer.
 *
 * @param {object} json Raw sb3 project JSON (may be a full project or a
 *   single-sprite JSON — both formats are handled).
 */
const patchAmpModProject = function (json) {
    if (!isAmpModProject(json)) return;

    // Full project: json.targets is an array of sprites/stage.
    if (Array.isArray(json.targets)) {
        for (const target of json.targets) {
            if (target && target.blocks && typeof target.blocks === 'object') {
                patchBlocksForAmpMod(target.blocks);
            }
        }
        return;
    }

    // Single-sprite format: the top-level object IS the target.
    if (json.blocks && typeof json.blocks === 'object') {
        patchBlocksForAmpMod(json.blocks);
    }
};

module.exports = {
    isAmpModProject,
    patchAmpModProject
};