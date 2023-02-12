const ArgumentType = require('./argument-type');
const BlockType = require('./block-type');
const TargetType = require('./target-type');
const Cast = require('../util/cast');

const Scratch = {
    ArgumentType,
    BlockType,
    TargetType,
    Cast,

    // Stubs:
    /* eslint-disable no-unused-vars */
    canFetch: url => Promise.resolve(true),
    canOpenWindow: url => Promise.resolve(true),
    canRedirect: url => Promise.resolve(true)
    /* eslint-enable no-unused-vars */
};

module.exports = Scratch;
