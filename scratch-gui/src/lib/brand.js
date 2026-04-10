// Legacy export format because this is used by some build-time scripts stuck in the past.
// eslint-disable-next-line import/no-commonjs
module.exports = {
    APP_NAME: 'OmniBlocks', // the name of the mod
    APP_VERSION: process.env.APP_VERSION || 'v0.5.8-alpha' // Dynamically injected at build time from git tags
};
