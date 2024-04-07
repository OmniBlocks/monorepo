import LazyScratchBlocks from './tw-lazy-scratch-blocks';

/**
 * Implements Scratch.gui API for unsandboxed extensions.
 * @param {any} Scratch window.Scratch, mutated in place.
 */
const implementGuiAPI = Scratch => {
    Scratch.gui = {
        getBlockly: () => new Promise(resolve => LazyScratchBlocks.onLoaded(resolve))
    };
};

export default implementGuiAPI;
