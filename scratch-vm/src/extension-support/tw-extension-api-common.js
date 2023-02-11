const ArgumentType = require('./argument-type');
const BlockType = require('./block-type');
const TargetType = require('./target-type');
const Cast = require('../util/cast');

const Scratch = {
    ArgumentType,
    BlockType,
    TargetType,
    Cast,

    // Default implementation, should be overridden
    // eslint-disable-next-line no-unused-vars
    canFetchResource: url => Promise.resolve(true)
};

module.exports = Scratch;
