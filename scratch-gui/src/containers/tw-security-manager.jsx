import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import log from '../lib/log';
import bindAll from 'lodash.bindall';
import SecurityManagerModal from '../components/tw-security-manager-modal/security-manager-modal.jsx';

const SAFE_EXTENSION_SITES = [
    // Extensions that start with these URLs will be loaded automatically and without a sandbox.
    // Be careful adding entries to this list.
    // Each entry MUST have a trailing / after the domain for this to provide any security.
    'https://extensions.turbowarp.org/',

    // For development.
    'http://localhost:8000/'
];

class TWSecurityManagerComponent extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'getSandboxMode',
            'canLoadExtensionFromProject',
            'handleAllowed',
            'handleDenied'
        ]);
        this.state = {
            modalVisible: false,
            modalURL: '',
            modalCallback: null
        };
    }

    componentDidMount () {
        const securityManager = this.props.vm.extensionManager.securityManager;
        securityManager.getSandboxMode = this.getSandboxMode;
        securityManager.canLoadExtensionFromProject = this.canLoadExtensionFromProject;
    }

    /**
     * @param {string} url The extension's URL
     * @returns {string} The VM worker mode to use
     */
    getSandboxMode (url) {
        if (SAFE_EXTENSION_SITES.some(site => url.startsWith(site))) {
            log.info(`Loading extension ${url} unsandboxed`);
            return 'unsandboxed';
        }
        return 'iframe';
    }

    /**
     * @param {string} url The extension's URL
     * @returns {boolean} Whether the extension can be loaded
     */
    async canLoadExtensionFromProject (url) {
        if (SAFE_EXTENSION_SITES.some(site => url.startsWith(site))) {
            log.info(`Loading extension ${url} automatically`);
            return true;
        }
        const isAllowed = await new Promise(resolve => {
            this.setState({
                modalVisible: true,
                modalURL: url,
                modalCallback: resolve
            });
        });
        this.setState({
            modalVisible: false
        });
        return isAllowed;
    }

    handleAllowed () {
        this.state.modalCallback(true);
    }

    handleDenied () {
        this.state.modalCallback(false);
    }

    render () {
        if (this.state.modalVisible) {
            return (
                <SecurityManagerModal
                    extensionURL={this.state.modalURL}
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
                canLoadExtensionFromProject: PropTypes.func.isRequired
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
