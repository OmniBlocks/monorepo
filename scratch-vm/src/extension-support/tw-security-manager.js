/* eslint-disable no-unused-vars */

/**
 * Responsible for determining various policies related to custom extension security.
 * The members of this class are supposed to be overwritten, eg.:
 *   vm.securityManager.getSandboxMode = () => 'iframe';
 */
class SecurityManager {
    /**
     * Determine the typeof sandbox to use for a certain custom extension.
     * @param {string} extensionURL The URL of the custom extension.
     * @returns {Promise<'worker'|'iframe'|'unsandboxed'>}
     */
    getSandboxMode (extensionURL) {
        // Default to worker for Scratch compatibility
        return Promise.resolve('worker');
    }
}

module.exports = SecurityManager;
