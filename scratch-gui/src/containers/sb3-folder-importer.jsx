import JSZip from '@turbowarp/jszip';
import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {setProjectUnchanged} from '../reducers/project-changed';
import {showAlertWithTimeout} from '../reducers/alerts';
import {getIsShowingProject} from '../reducers/project-state';
import log from '../lib/log';

class SB3FolderImporter extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'importProjectFromFolder'
        ]);
    }

    async importProjectFromFolder () {
        if (!window.showDirectoryPicker) {
            log.warn('showDirectoryPicker is not supported in this browser');
            return;
        }

        this.props.onShowImportingAlert();

        try {
            const dirHandle = await window.showDirectoryPicker({
                mode: 'readwrite',
                startIn: 'downloads'
            });

            const zip = new JSZip();

            for await (const entry of dirHandle.values()) {
                if (entry.kind === 'file') {
                    const fileHandle = entry;
                    const file = await fileHandle.getFile();
                    const arrayBuffer = await file.arrayBuffer();
                    zip.file(file.name, arrayBuffer);
                }
            }

            // Check if we have the required project.json file
            if (!zip.files['project.json']) {
                this.props.onShowImportErrorAlert();
                return;
            }

            // Convert zip to ArrayBuffer to pass to vm.loadProject
            const zipBuffer = await zip.generateAsync({type: 'arraybuffer'});

            // Load the project using VM
            await this.props.vm.loadProject(zipBuffer);

            this.props.onShowImportSuccessAlert();
            this.props.onProjectUnchanged();
        } catch (e) {
            if (e.name === 'AbortError') {
                return;
            }
            log.error(e);
            this.props.onShowImportErrorAlert();
        }
    }

    render () {
        const {children} = this.props;
        return children(window.showDirectoryPicker ? this.importProjectFromFolder : null);
    }
}

SB3FolderImporter.propTypes = {
    children: PropTypes.func,
    vm: PropTypes.shape({
        loadProject: PropTypes.func
    }),
    onShowImportingAlert: PropTypes.func,
    onShowImportSuccessAlert: PropTypes.func,
    onShowImportErrorAlert: PropTypes.func,
    onProjectUnchanged: PropTypes.func
};

const mapStateToProps = state => ({
    vm: state.scratchGui.vm,
    canImportProject: getIsShowingProject(state.scratchGui.projectState.loadingState)
});

const mapDispatchToProps = dispatch => ({
    onShowImportingAlert: () => showAlertWithTimeout(dispatch, 'importingAsset'),
    onShowImportSuccessAlert: () => showAlertWithTimeout(dispatch, 'createSuccess'),
    onShowImportErrorAlert: () => showAlertWithTimeout(dispatch, 'creatingError'),
    onProjectUnchanged: () => dispatch(setProjectUnchanged())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SB3FolderImporter);
