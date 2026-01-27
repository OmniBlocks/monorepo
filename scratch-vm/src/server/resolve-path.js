/* eslint-env node */

const path = require('node:path');
const os = require('node:os');

/**
 * omni: A curried function that returns a custom path resolver, based on the inputted values.
 * @param {() => string} homeDir The home directory.
 * @param {() => string} workingDir The working directory.
 * @returns {(location: string) => string} The path resolver.
 */
const makePathResolver = (homeDir, workingDir) => {
    if (typeof homeDir !== 'function') throw new TypeError('"homeDir" must be a function.');
    if (typeof workingDir !== 'function') throw new TypeError('"workingDir" must be a function.');

    /**
     * omni: A parser that normalizes a path and converts relative paths to absolute paths,
     * based on the inputted values.
     * @param {string} location An absolute or relative path.
     * @returns {string} An normalized absolute path.
     */
    return location => {
        if (typeof location !== 'string') throw new TypeError('"location" must be a string.');
        const normalizedPath = path.normalize(location);

        if (location.startsWith('~')) return path.join(homeDir(), normalizedPath.slice(1));
        if (path.isAbsolute(location)) return normalizedPath;
        return path.join(workingDir(), normalizedPath);
    };
};

/**
 * omni: A parser that normalizes a path and converts relative paths to absolute paths,
 * based on the current working directory.
 * @param {string} location An absolute or relative path.
 * @returns {string} An normalized absolute path.
 */
const resolvePath = makePathResolver(os.homedir, process.cwd);

module.exports = {
    makePathResolver,
    resolvePath
};
