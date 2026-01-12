import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {setProjectUnchanged} from '../reducers/project-changed';
import {showAlertWithTimeout} from '../reducers/alerts';
import {getIsShowingProject} from '../reducers/project-state';
import log from '../lib/log';

class SB3FolderExporter extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'exportProjectToFolder'
        ]);
    }

    async exportProjectToFolder () {
        if (!this.props.canExportProject) {
            return;
        }

        if (!window.showDirectoryPicker) {
            log.warn('showDirectoryPicker is not supported in this browser');
            return;
        }

        this.props.onShowExportingAlert();

        try {
            const dirHandle = await window.showDirectoryPicker({
                mode: 'readwrite',
                startIn: 'downloads'
            });

            const projectFiles = this.props.vm.saveProjectSb3DontZip();

            for (const [filename, data] of Object.entries(projectFiles)) {
                const fileHandle = await dirHandle.getFileHandle(filename, {create: true});
                const writable = await fileHandle.createWritable();
                await writable.write(data);
                await writable.close();
            }

            this.props.onShowExportSuccessAlert();
            this.props.onProjectUnchanged();
        } catch (e) {
            if (e.name === 'AbortError') {
                return;
            }
            log.error(e);
            this.props.onShowExportErrorAlert();
        }
    }

    render () {
        const {children} = this.props;
        return children(window.showDirectoryPicker ? this.exportProjectToFolder : null);
    }
}

SB3FolderExporter.propTypes = {
    children: PropTypes.func,
    vm: PropTypes.shape({
        saveProjectSb3DontZip: PropTypes.func
    }),
    canExportProject: PropTypes.bool,
    onShowExportingAlert: PropTypes.func,
    onShowExportSuccessAlert: PropTypes.func,
    onShowExportErrorAlert: PropTypes.func,
    onProjectUnchanged: PropTypes.func
};

const mapStateToProps = state => ({
    vm: state.scratchGui.vm,
    canExportProject: getIsShowingProject(state.scratchGui.projectState.loadingState)
});

const mapDispatchToProps = dispatch => ({
    onShowExportingAlert: () => showAlertWithTimeout(dispatch, 'saving'),
    onShowExportSuccessAlert: () => showAlertWithTimeout(dispatch, 'twSaveToDiskSuccess'),
    onShowExportErrorAlert: () => showAlertWithTimeout(dispatch, 'savingError'),
    onProjectUnchanged: () => dispatch(setProjectUnchanged())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SB3FolderExporter);
