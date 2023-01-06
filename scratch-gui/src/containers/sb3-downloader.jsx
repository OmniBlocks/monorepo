import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {projectTitleInitialState, setProjectTitle} from '../reducers/project-title';
import downloadBlob from '../lib/download-blob';
import {setProjectUnchanged} from '../reducers/project-changed';
import {showStandardAlert, showAlertWithTimeout} from '../reducers/alerts';
import {setFileHandle} from '../reducers/tw';
import FileSystemAPI from '../lib/tw-filesystem-api';
import {getIsShowingProject} from '../reducers/project-state';
import log from '../lib/log';

// from sb-file-uploader-hoc.jsx
const getProjectTitleFromFilename = fileInputFilename => {
    if (!fileInputFilename) return '';
    // only parse title with valid scratch project extensions
    // (.sb, .sb2, and .sb3)
    const matches = fileInputFilename.match(/^(.*)\.sb[23]?$/);
    if (!matches) return '';
    return matches[1].substring(0, 100); // truncate project title to max 100 chars
};

/**
 * @param {Uint8Array[]} arrays List of byte arrays
 * @returns {number} Total length of the arrays
 */
const getLengthOfByteArrays = arrays => {
    let length = 0;
    for (let i = 0; i < arrays.length; i++) {
        length += arrays[i].byteLength;
    }
    return length;
};

/**
 * @param {Uint8Array[]} arrays List of byte arrays
 * @returns {Uint8Array} One big array containing all of the little arrays in order.
 */
const concatenateByteArrays = arrays => {
    const totalLength = getLengthOfByteArrays(arrays);
    const newArray = new Uint8Array(totalLength);
    let p = 0;
    for (let i = 0; i < arrays.length; i++) {
        newArray.set(arrays[i], p);
        p += arrays[i].byteLength;
    }
    return newArray;
};

/**
 * Project saver component passes a downloadProject function to its child.
 * It expects this child to be a function with the signature
 *     function (downloadProject, props) {}
 * The component can then be used to attach project saving functionality
 * to any other component:
 *
 * <SB3Downloader>{(downloadProject, props) => (
 *     <MyCoolComponent
 *         onClick={downloadProject}
 *         {...props}
 *     />
 * )}</SB3Downloader>
 */
class SB3Downloader extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'downloadProject',
            'saveAsNew',
            'saveToLastFile',
            'saveToLastFileOrNew'
        ]);
    }
    startedSaving () {
        this.props.onShowSavingAlert();
    }
    finishedSaving () {
        this.props.onProjectUnchanged();
        this.props.onShowSaveSuccessAlert();
        if (this.props.onSaveFinished) {
            this.props.onSaveFinished();
        }
    }
    downloadProject () {
        if (!this.props.canSaveProject) {
            return;
        }
        this.startedSaving();
        this.props.saveProjectSb3().then(content => {
            this.finishedSaving();
            downloadBlob(this.props.projectFilename, content);
        });
    }
    async saveAsNew () {
        if (!this.props.canSaveProject) {
            return;
        }
        try {
            const handle = await FileSystemAPI.showSaveFilePicker(this.props.projectFilename);
            await this.saveToHandle(handle);
            this.props.onSetFileHandle(handle);
            const title = getProjectTitleFromFilename(handle.name);
            if (title) {
                this.props.onSetProjectTitle(title);
            }
        } catch (e) {
            this.handleSaveError(e);
        }
    }
    async saveToLastFile () {
        try {
            await this.saveToHandle(this.props.fileHandle);
        } catch (e) {
            this.handleSaveError(e);
        }
    }
    saveToLastFileOrNew () {
        if (this.props.fileHandle) {
            return this.saveToLastFile();
        }
        return this.saveAsNew();
    }
    async saveToHandle (handle) {
        if (!this.props.canSaveProject) {
            return;
        }

        const writable = await handle.createWritable();
        try {
            this.startedSaving();

            // Projects can be very large, so we'll utilize JSZip's stream API to avoid having the
            // entire sb3 in memory at the same time.
            const jszipStream = this.props.saveProjectSb3Stream();
            const zipStream = new ReadableStream({
                start: controller => {
                    jszipStream.on('data', data => {
                        controller.enqueue(data);
                        if (controller.desiredSize <= 0) {
                            // Note that JSZip will keep sending some data after you ask it to pause.
                            jszipStream.pause();
                        }
                    });
                    jszipStream.on('end', () => {
                        controller.close();
                    });
                    jszipStream.resume();
                },
                pull: () => {
                    jszipStream.resume();
                },
                cancel: () => {
                    jszipStream.pause();
                }
            });

            // Buffer small messages into one bigger message to improve performance of write() later.
            const MIN_BUFFER_SIZE = 1024 * 256;
            const queuedChunks = [];
            // eslint-disable-next-line no-undef
            const bufferTransformer = new TransformStream({
                transform: (chunk, controller) => {
                    queuedChunks.push(chunk);

                    const currentSize = getLengthOfByteArrays(queuedChunks);
                    if (currentSize >= MIN_BUFFER_SIZE) {
                        const newArray = concatenateByteArrays(queuedChunks);
                        controller.enqueue(newArray);
                        queuedChunks.length = 0;
                    }
                },
                flush: controller => {
                    const newArray = concatenateByteArrays(queuedChunks);
                    if (newArray.byteLength) {
                        controller.enqueue(newArray);
                    }
                }
            });

            const fileStream = new WritableStream({
                write: chunk => writable.write(chunk)
            });

            await zipStream
                .pipeThrough(bufferTransformer)
                .pipeTo(fileStream);

            await writable.close();
            this.finishedSaving();
        } catch (e) {
            // Always need to close this file handle.
            await writable.close();

            // The caller will deal with this error.
            throw e;
        }
    }
    handleSaveError (e) {
        // AbortError can happen when someone cancels the file selector dialog
        if (e && e.name === 'AbortError') {
            return;
        }
        log.error(e);
        this.props.onShowSaveErrorAlert();
    }
    render () {
        const {
            children
        } = this.props;
        return children(
            this.props.className,
            this.downloadProject,
            FileSystemAPI.available() ? {
                available: true,
                name: this.props.fileHandle ? this.props.fileHandle.name : null,
                saveAsNew: this.saveAsNew,
                saveToLastFile: this.saveToLastFile,
                saveToLastFileOrNew: this.saveToLastFileOrNew,
                smartSave: this.saveToLastFileOrNew
            } : {
                available: false,
                smartSave: this.downloadProject
            }
        );
    }
}

const getProjectFilename = (curTitle, defaultTitle) => {
    let filenameTitle = curTitle;
    if (!filenameTitle || filenameTitle.length === 0) {
        filenameTitle = defaultTitle;
    }
    return `${filenameTitle.substring(0, 100)}.sb3`;
};

SB3Downloader.propTypes = {
    children: PropTypes.func,
    className: PropTypes.string,
    fileHandle: PropTypes.shape({
        name: PropTypes.string
    }),
    onSaveFinished: PropTypes.func,
    projectFilename: PropTypes.string,
    saveProjectSb3: PropTypes.func,
    saveProjectSb3Stream: PropTypes.func,
    canSaveProject: PropTypes.bool,
    onSetFileHandle: PropTypes.func,
    onSetProjectTitle: PropTypes.func,
    onShowSavingAlert: PropTypes.func,
    onShowSaveSuccessAlert: PropTypes.func,
    onShowSaveErrorAlert: PropTypes.func,
    onProjectUnchanged: PropTypes.func
};
SB3Downloader.defaultProps = {
    className: ''
};

const mapStateToProps = state => ({
    fileHandle: state.scratchGui.tw.fileHandle,
    saveProjectSb3: state.scratchGui.vm.saveProjectSb3.bind(state.scratchGui.vm),
    saveProjectSb3Stream: state.scratchGui.vm.saveProjectSb3Stream.bind(state.scratchGui.vm),
    canSaveProject: getIsShowingProject(state.scratchGui.projectState.loadingState),
    projectFilename: getProjectFilename(state.scratchGui.projectTitle, projectTitleInitialState)
});

const mapDispatchToProps = dispatch => ({
    onSetFileHandle: fileHandle => dispatch(setFileHandle(fileHandle)),
    onSetProjectTitle: title => dispatch(setProjectTitle(title)),
    onShowSavingAlert: () => showAlertWithTimeout(dispatch, 'saving'),
    onShowSaveSuccessAlert: () => showAlertWithTimeout(dispatch, 'twSaveToDiskSuccess'),
    onShowSaveErrorAlert: () => dispatch(showStandardAlert('savingError')),
    onProjectUnchanged: () => dispatch(setProjectUnchanged())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SB3Downloader);
