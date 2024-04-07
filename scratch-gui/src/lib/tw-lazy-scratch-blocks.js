let _ScratchBlocks = null;

const callbacks = [];

const isLoaded = () => !!_ScratchBlocks;

const get = () => {
    if (!_ScratchBlocks) {
        throw new Error('scratch-blocks is not loaded yet');
    }
    return _ScratchBlocks;
};

const load = () => {
    if (_ScratchBlocks) {
        return Promise.resolve(_ScratchBlocks);
    }
    return import(/* webpackChunkName: "sb" */ 'scratch-blocks')
        .then(m => {
            _ScratchBlocks = m.default;

            for (const callback of callbacks) {
                callback(_ScratchBlocks);
            }
            callbacks.length = 0;

            return _ScratchBlocks;
        });
};

const onLoaded = callback => {
    if (_ScratchBlocks) {
        callback(_ScratchBlocks);
    } else {
        callbacks.push(callback);
    }
};

export default {
    get,
    isLoaded,
    load,
    onLoaded
};
