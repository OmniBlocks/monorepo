import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import log from '../lib/log';
import bindAll from 'lodash.bindall';
import SecurityManagerModal from '../components/tw-security-manager-modal/security-manager-modal.jsx';
import SecurityModals from '../lib/tw-security-manager-constants';

/**
 * Trusted extensions are loaded automatically and without a sandbox.
 * @param {string} url URL as a string.
 * @returns {boolean} True if the extension can is trusted
 */
const isTrustedExtension = url => (
    // Always trust our official extension repostiory.
    url.startsWith('https://extensions.turbowarp.org/') ||

    // For development.
    url.startsWith('http://localhost:8000/')
);

/**
 * Set of fetch resource origins that were manually trusted by the user.
 * @type {Set<string>}
 */
const fetchOriginsTrustedByUser = new Set();

/**
 * @param {URL} parsed Parsed URL object
 * @returns {boolean} True if the URL is part of the builtin set of URLs to always trust fetching from.
 */
const isAlwaysTrustedForFetching = parsed => (
    // Note that the regexes here don't need to be perfect. It's okay if we let extensions try to fetch
    // resources from GitHub Pages domains that are invalid usernames. They'll just get an error.

    // If we would trust loading an extension from here, we can trust loading resources too.
    isTrustedExtension(parsed.href) ||

    // GitHub
    parsed.origin === 'https://raw.githubusercontent.com' ||
    /^https:\/\/[a-z0-9-]{1,40}\.github\.io$/.test(parsed.origin)
);

/**
 * @param {string} url Original URL string
 * @returns {URL|null} A URL object if it is valid and of a known protocol, otherwise null.
 */
const parseURL = url => {
    let parsed;
    try {
        parsed = new URL(url);
    } catch (e) {
        return null;
    }
    const protocols = ['http:', 'https:', 'ws:', 'wss:', 'data:', 'blob:'];
    if (!protocols.includes(parsed.protocol)) {
        return null;
    }
    return parsed;
};

class TWSecurityManagerComponent extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'getSandboxMode',
            'canLoadExtensionFromProject',
            'canFetch',
            'canOpenWindow',
            'canRedirect',
            'handleAllowed',
            'handleDenied'
        ]);
        this.nextModalCallbacks = [];
        this.modalLocked = false;
        this.state = {
            modal: null
        };
    }

    componentDidMount () {
        const securityManager = this.props.vm.extensionManager.securityManager;
        securityManager.getSandboxMode = this.getSandboxMode;
        securityManager.canLoadExtensionFromProject = this.canLoadExtensionFromProject;
        securityManager.canFetch = this.canFetch;
        securityManager.canOpenWindow = this.canOpenWindow;
        securityManager.canRedirect = this.canRedirect;
    }

    // eslint-disable-next-line valid-jsdoc
    /**
     * @returns {Promise<() => Promise<boolean>>} Resolves with a function that you can call to show the modal.
     * The resolved function returns a promise that resolves with true if the request was approved.
     */
    async acquireModalLock () {
        // We need a two-step process for showing a modal so that we don't overwrite or overlap modals,
        // and so that multiple attempts to fetch resources from the same origin will all be allowed
        // with just one click. This means that some places have to wait until previous modals are
        // closed before it knows if it needs to display another modal.

        if (this.modalLocked) {
            await new Promise(resolve => {
                this.nextModalCallbacks.push(resolve);
            });
        } else {
            this.modalLocked = true;
        }

        const releaseLock = () => {
            if (this.nextModalCallbacks.length) {
                const nextModalCallback = this.nextModalCallbacks.shift();
                nextModalCallback();
            } else {
                this.modalLocked = false;
                this.setState({
                    modal: null
                });
            }
        };

        const showModal = async data => {
            const result = await new Promise(resolve => {
                this.setState({
                    modal: {
                        ...data,
                        callback: resolve
                    }
                });
            });
            releaseLock();
            return result;
        };

        return {
            showModal,
            releaseLock
        };
    }

    handleAllowed () {
        this.state.modal.callback(true);
    }

    handleDenied () {
        this.state.modal.callback(false);
    }

    /**
     * @param {string} url The extension's URL
     * @returns {string} The VM worker mode to use
     */
    getSandboxMode (url) {
        if (isTrustedExtension(url)) {
            log.info(`Loading extension ${url} unsandboxed`);
            return 'unsandboxed';
        }
        return 'iframe';
    }

    /**
     * @param {string} url The extension's URL
     * @returns {Promise<boolean>} Whether the extension can be loaded
     */
    async canLoadExtensionFromProject (url) {
        if (isTrustedExtension(url)) {
            log.info(`Loading extension ${url} automatically`);
            return true;
        }
        const {showModal} = await this.acquireModalLock();
        return showModal({
            type: SecurityModals.LoadExtension,
            url
        });
    }

    /**
     * @param {string} url The resource to fetch
     * @returns {Promise<boolean>} True if the resource is allowed to be fetched
     */
    async canFetch (url) {
        const parsed = parseURL(url);
        if (!parsed) {
            return false;
        }
        if (isAlwaysTrustedForFetching(parsed)) {
            return true;
        }
        const {showModal, releaseLock} = await this.acquireModalLock();
        if (fetchOriginsTrustedByUser.has(origin)) {
            releaseLock();
            return true;
        }
        const allowed = await showModal({
            type: SecurityModals.Fetch,
            url
        });
        if (allowed) {
            fetchOriginsTrustedByUser.add(origin);
        }
        return allowed;
    }

    /**
     * @param {string} url The website to open
     * @returns {Promise<boolean>} True if the website can be opened
     */
    async canOpenWindow (url) {
        const parsed = parseURL(url);
        if (!parsed) {
            return false;
        }
        const {showModal} = await this.acquireModalLock();
        return showModal({
            type: SecurityModals.OpenWindow,
            url
        });
    }

    /**
     * @param {string} url The website to redirect to
     * @returns {Promise<boolean>} True if the website can be redirected to
     */
    async canRedirect (url) {
        const parsed = parseURL(url);
        if (!parsed) {
            return false;
        }
        const {showModal} = await this.acquireModalLock();
        return showModal({
            type: SecurityModals.Redirect,
            url
        });
    }

    render () {
        if (this.state.modal) {
            const modal = this.state.modal;
            return (
                <SecurityManagerModal
                    type={modal.type}
                    url={modal.url}
                    onAllowed={this.handleAllowed}
                    onDenied={this.handleDenied}
                />
            );
        }
        return null;
    }
}

TWSecurityManagerComponent.propTypes = {
    vm: PropTypes.shape({
        extensionManager: PropTypes.shape({
            securityManager: PropTypes.shape({
                getSandboxMode: PropTypes.func.isRequired,
                canLoadExtensionFromProject: PropTypes.func.isRequired,
                canFetch: PropTypes.func.isRequired,
                canOpenWindow: PropTypes.func.isRequired,
                canRedirect: PropTypes.func.isRequired
            }).isRequired
        }).isRequired
    }).isRequired
};

const mapStateToProps = state => ({
    vm: state.scratchGui.vm
});

const mapDispatchToProps = () => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TWSecurityManagerComponent);
