/* eslint-disable no-unused-vars */

/**
 * Responsible for determining various policies related to custom extension security.
 * The members of this class are supposed to be overwritten, eg.:
 *   vm.securityManager.getWorkerMode = () => 'iframe';
 */
class SecurityManager {
    /**
     * Determine the worker mode to use for a given extension.
     * @param {string} extensionURL The URL of the extension.
     * @returns {Promise<'worker'|'iframe'|'unsandboxed'>}
     */
    getWorkerMode (extensionURL) {
        // Default to worker for Scratch compatibility
        return Promise.resolve('worker');
    }
}

module.exports = SecurityManager;
