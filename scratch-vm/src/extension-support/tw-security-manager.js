/* eslint-disable no-unused-vars */

/**
 * Responsible for determining various policies related to custom extension security.
 * The default implementation attempts to get the maximum security while maintaining
 * almost 100% compatibility with a vanilla scratch-vm. You can override properties of
 * an instance of this class to customize the security policies as you see fit:
 * ```js
 * vm.securityManager.getSandboxMode = (url) => {
 *   if (url.startsWith("https://example.com/")) {
 *     return "unsandboxed";
 *   }
 *   return "iframe";
 * };
 * vm.securityManager.canAutomaticallyLoadExtension = (url) => {
 *   return confirm("Automatically load extension: " + url);
 * };
 * vm.securityManager.canFetchResource = (url) => {
 *   return url.startsWith('https://turbowarp.org/');
 * };
 * ```
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

    /**
     * Determine whether a custom extension that was stored inside a project may be
     * loaded. You could, for example, ask the user to confirm loading an extension
     * before resolving.
     * @param {string} extensionURL The URL of the custom extension.
     * @returns {Promise<boolean>}
     */
    canLoadExtensionFromProject (extensionURL) {
        // Default to false for security
        return Promise.resolve(false);
    }

    /**
     * Determine whether an extension is allowed to fetch a remote resource URL.
     * This only applies to unsandboxed extensions that use the appropriate Scratch.* APIs.
     * Sandboxed extensions ignore this entirely as there is no way to force them to use our APIs.
     * data: and blob: URLs are always allowed (this method is never called).
     * @param {string} resourceURL
     * @returns {Promise<boolean>}
     */
    canFetchResource (resourceURL) {
        // By default, allow any requests.
        return Promise.resolve(true);
    }
}

module.exports = SecurityManager;
