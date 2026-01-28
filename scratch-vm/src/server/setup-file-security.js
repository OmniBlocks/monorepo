/* eslint-env node */
/* eslint-disable no-console */

const path = require('node:path');

const awaitEvent = require('../util/await-event');
const {resolvePath} = require('./resolve-path');

const setupFileSecurity = (securityManager, permissions) => {
    const canAccessFolder = fileLocation => {
        if (typeof fileLocation !== 'string') throw new TypeError('"fileLocation" must be a string.');
        const location = resolvePath(fileLocation);

        for (let i = 0; i < permissions.fileScope.length; i++) {
            const folder = path.resolve(permissions.fileScope[i]);
            const relative = path.relative(folder, location);
            if (relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))) {
                return true;
            }
        }
        
        return false;
    };

    /* eslint-disable-next-line prefer-template */
    const warn = (message, last) => process.stdout.write('\n\x1b[93m' + message + '\x1b[0m' + (last ? '' : '\n'));

    // FILE ACCESS

    securityManager.canReadFile = async function (fileLocation) {
        if (!permissions.fileReadAccess) {
            if (!process.stdin.isTTY || !process.stdout.isTTY) return false;

            /* eslint-disable max-len */
            warn('This project wants read access to your filesystem. Allowing read access will mean the project will be able to read ANY file you can.');
            warn('This includes personal documents and files, app settings, passwords saved in the browser, browser cookies, and more.');
            warn('If you don\'t trust this project, or you are not sure, you should not give permission.');
            warn('Are you sure you want to allow filesystem read access? (Y/N)', true);
            /* eslint-enable max-len */

            process.stdin.setRawMode(true);
            const key = (await awaitEvent(process.stdin, 'data'))[0];
            process.stdin.setRawMode(false);
            process.stdout.write(` ${String(key)}\n`);

            if (String(key).toLowerCase() !== 'y') return false;

            if (!permissions.fileReadAccess) permissions.fileReadAccess = true;
        }

        if (!canAccessFolder(fileLocation)) {
            /* eslint-disable max-len */
            warn('The project attempted to read a file outside of the allowed file scope. The read has been prevented.');
            warn('If the project needs to read a file outside the file scope, append "--file-scope /path/to/folder /add/more/folders/if/you/want --" to the command.');
            warn('You should not let the folder read outside of the home folder, unless it is absolutely necessary.');
            /* eslint-enable max-len */
            return false;
        }

        return true;
    };

    securityManager.canWriteFile = async function (fileLocation) {
        if (!permissions.fileWriteAccess) {
            if (!process.stdin.isTTY || !process.stdout.isTTY) return false;

            /* eslint-disable max-len */
            warn('This project wants write access to your filesystem. Allowing write access will mean the project will be able to write to and replace ANY file you can.');
            warn('This includes personal documents and files, program settings, and more.');
            warn('If you don\'t trust this project, or you are not sure, you should not give permission.');
            warn('Are you sure you want to allow filesystem write access? (Y/N)', true);
            /* eslint-enable max-len */

            process.stdin.setRawMode(true);
            const key = (await awaitEvent(process.stdin, 'data'))[0];
            process.stdin.setRawMode(false);
            process.stdout.write(` ${String(key)}\n`);

            if (String(key).toLowerCase() !== 'y') return false;

            if (!permissions.fileWriteAccess) permissions.fileWriteAccess = true;
        }

        if (!canAccessFolder(fileLocation)) {
            /* eslint-disable max-len */
            warn('The project attempted to write to a file outside of the allowed file scope. The write has been prevented.');
            warn('If the project needs to write to a file outside the file scope, append "--file-scope /path/to/folder /add/more/folders/if/you/want --" to the command.');
            warn('You should not let the folder write outside of the home folder, unless it is absolutely necessary.');
            /* eslint-enable max-len */
            return false;
        }

        return true;
    };

    // NETWORK ACCESS

    securityManager.canFetch = async function () {
        if (!permissions.networkAccess) {
            if (!process.stdin.isTTY || !process.stdout.isTTY) return false;

            /* eslint-disable max-len */
            warn('This project wants network access. Allowing network access will mean the project will be able to access ANY website on the internet and ANY website on your local network.');
            warn('This includes websites, your router, your intranet, and more.');
            warn('If you don\'t trust this project, or you are not sure, you should not give permission.');
            warn('Are you sure you want to allow network access? (Y/N)', true);
            /* eslint-enable max-len */

            process.stdin.setRawMode(true);
            const key = (await awaitEvent(process.stdin, 'data'))[0];
            process.stdin.setRawMode(false);
            process.stdout.write(` ${String(key)}\n`);

            if (String(key).toLowerCase() !== 'y') return false;

            if (!permissions.networkAccess) permissions.networkAccess = true;
        }

        return true;
    };

    securityManager.canLoadExtensionFromProject = function (url) {
        // Allow trusted hosts.
        if (url.startsWith('https://extensions.turbowarp.org/')) return Promise.resolve(true);

        /* eslint-disable-next-line max-len */
        warn('This project attempted to load an extension from an untrusted host. For security reasons, the extension will not be loaded.');

        return Promise.resolve(false);
    };
};

module.exports = setupFileSecurity;
