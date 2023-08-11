import React from 'react';
import {connect} from 'react-redux';
import {intlShape, injectIntl, defineMessages} from 'react-intl';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import {showAlertWithTimeout, showStandardAlert} from '../reducers/alerts';
import {closeLoadingProject, closeRestorePointModal, openLoadingProject} from '../reducers/modals';
import {LoadingStates, getIsShowingProject, onLoadedProject, requestProjectUpload} from '../reducers/project-state';
import {setFileHandle} from '../reducers/tw';
import TWRestorePointModal from '../components/tw-restore-point-modal/restore-point-modal.jsx';
import RestorePointAPI from '../lib/tw-restore-point-api';
import log from '../lib/log';
import isScratchDesktop from '../lib/isScratchDesktop';

/* eslint-disable no-alert */

const SAVE_DELAY = 250;
const MINIMUM_SAVE_TIME = 750;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// TODO: remove legacy stuff completely after next desktop app update
const shouldRemoveLegacyRestorePoint = () => !isScratchDesktop();

const messages = defineMessages({
    confirmLoad: {
        defaultMessage: 'You have unsaved changes. Replace existing project?',
        description: 'Confirmation that appears when loading a restore point to confirm overwriting unsaved changes.',
        id: 'tw.restorePoints.confirmLoad'
    },
    confirmDelete: {
        defaultMessage: 'Are you sure you want to delete "{projectTitle}"? This cannot be undone.',
        description: 'Confirmation that appears when deleting a restore poinnt',
        id: 'tw.restorePoints.confirmDelete'
    },
    confirmDeleteAll: {
        defaultMessage: 'Are you sure you want to delete ALL restore points? This cannot be undone.',
        description: 'Confirmation that appears when deleting ALL restore points.',
        id: 'tw.restorePoints.confirmDeleteAll'
    },
    loadError: {
        defaultMessage: 'Error loading restore point: {error}',
        description: 'Error message when a restore point could not be loaded',
        id: 'tw.restorePoints.error'
    }
});

class TWRestorePointManager extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClickCreate',
            'handleClickDelete',
            'handleClickDeleteAll',
            'handleChangeInterval',
            'handleClickLoad',
            'handleClickLoadLegacy'
        ]);
        this.state = {
            loading: true,
            totalSize: 0,
            restorePoints: [],
            error: null,
            wasChanged: props.projectChanged,
            interval: RestorePointAPI.readInterval()
        };
        this.timeout = null;
    }

    componentDidMount () {
        if (this.state.wasChanged) {
            this.queueRestorePoint();
        }

        if (shouldRemoveLegacyRestorePoint()) {
            RestorePointAPI.deleteLegacyRestorePoint();
        }
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.isModalVisible && !this.props.isModalVisible) {
            this.refreshState();
        } else if (!nextProps.isModalVisible && this.props.isModalVisible) {
            this.setState({
                restorePoints: []
            });
        }

        if (nextProps.projectChanged && !this.props.projectChanged && !this.state.wasChanged) {
            this.setState({
                wasChanged: true
            });
        }

        if (!nextProps.isShowingProject && this.props.isShowingProject) {
            this.setState({
                wasChanged: false
            });
        }
    }

    componentDidUpdate (prevProps, prevState) {
        if (this.state.wasChanged && !prevState.wasChanged) {
            this.queueRestorePoint();
        } else if (!this.state.wasChanged && prevState.wasChanged) {
            this.cancelQueuedRestorePoint();
        }
    }

    componentWillUnmount () {
        this.cancelQueuedRestorePoint();
    }

    handleClickCreate () {
        this.createRestorePoint(RestorePointAPI.TYPE_MANUAL)
            .catch(error => {
                this.handleModalError(error);
            });
    }

    handleClickDelete (id) {
        const projectTitle = this.state.restorePoints.find(i => i.id === id).title;
        if (!confirm(this.props.intl.formatMessage(messages.confirmDelete, {projectTitle}))) {
            return;
        }

        this.setState({
            loading: true
        });
        RestorePointAPI.deleteRestorePoint(id)
            .then(() => {
                this.refreshState();
            })
            .catch(error => {
                this.handleModalError(error);
            });
    }

    handleClickDeleteAll () {
        if (!confirm(this.props.intl.formatMessage(messages.confirmDeleteAll))) {
            return;
        }

        this.setState({
            loading: true
        });
        RestorePointAPI.deleteAllRestorePoints()
            .then(() => {
                this.refreshState();
            })
            .catch(error => {
                this.handleModalError(error);
            });
    }

    _startLoading () {
        this.props.onCloseModal();
        this.props.onStartLoadingRestorePoint(this.props.loadingState);
    }

    _finishLoading (success) {
        setTimeout(() => {
            this.props.vm.renderer.draw();
        });
        this.props.onFinishLoadingRestorePoint(success, this.props.loadingState);
    }

    canLoadProject () {
        if (!this.props.isShowingProject) {
            // Loading a project now will break the state machine
            return false;
        }
        if (this.props.projectChanged && !confirm(this.props.intl.formatMessage(messages.confirmLoad))) {
            return false;
        }
        return true;
    }

    handleClickLoad (id) {
        if (!this.canLoadProject()) {
            return;
        }
        this._startLoading();
        RestorePointAPI.loadRestorePoint(this.props.vm, id)
            .then(() => {
                this._finishLoading(true);
            })
            .catch(error => {
                this.handleLoadError(error);
            });
    }

    handleClickLoadLegacy () {
        if (!this.canLoadProject()) {
            return;
        }
        this._startLoading();
        this.props.vm.stop();
        RestorePointAPI.loadLegacyRestorePoint()
            .then(buffer => this.props.vm.loadProject(buffer))
            .then(() => {
                setTimeout(() => {
                    this.props.vm.renderer.draw();
                });
                this._finishLoading(true);

                // Immediately migrate to new format
                this.createRestorePoint(RestorePointAPI.TYPE_AUTOMATIC);
            })
            .catch(error => {
                this.handleLoadError(error);
            });
    }

    handleLoadError (error) {
        log.error(error);
        alert(this.props.intl.formatMessage(messages.loadError, {
            error
        }));
        this._finishLoading(false);
    }

    handleChangeInterval (e) {
        const interval = +e.target.value;
        RestorePointAPI.setInterval(interval);
        this.setState({
            interval
        }, () => {
            if (this.state.wasChanged) {
                this.cancelQueuedRestorePoint();
                this.queueRestorePoint();
            }
        });
    }

    queueRestorePoint () {
        if (this.timeout || this.state.interval < 0) {
            return;
        }
        this.timeout = setTimeout(() => {
            this.createRestorePoint(RestorePointAPI.TYPE_AUTOMATIC).then(() => {
                this.timeout = null;
                this.queueRestorePoint();
            });
        }, this.state.interval);
    }

    cancelQueuedRestorePoint () {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }

    createRestorePoint (type) {
        if (this.props.isModalVisible) {
            this.setState({
                loading: true
            });
        }

        this.props.onStartCreatingRestorePoint();
        return Promise.all([
            // Wait a little bit before saving so UI can update before saving, which can cause stutter
            sleep(SAVE_DELAY)
                .then(() => RestorePointAPI.createRestorePoint(this.props.vm, this.props.projectTitle, type))
                .then(() => RestorePointAPI.removeExtraneousRestorePoints()),

            // Force saves to not be instant so people can see that we're making a restore point
            // It also makes refreshes less likely to cause accidental clicks in the modal
            sleep(MINIMUM_SAVE_TIME)
        ])
            .then(() => {
                this.props.onFinishCreatingRestorePoint();
                if (this.props.isModalVisible) {
                    this.refreshState();
                }
            })
            .catch(error => {
                log.error(error);
                this.props.onErrorCreatingRestorePoint();
                if (this.props.isModalVisible) {
                    this.refreshState();
                }
            });
    }

    refreshState () {
        this.setState({
            loading: true,
            error: null,
            restorePoints: []
        });
        RestorePointAPI.getAllRestorePoints()
            .then(data => {
                this.setState({
                    loading: false,
                    totalSize: data.totalSize,
                    restorePoints: data.restorePoints
                });
            })
            .catch(error => {
                this.handleModalError(error);
            });
    }

    handleModalError (error) {
        log.error('Restore point error', error);
        this.setState({
            error: `${error}`,
            loading: false
        });
    }

    render () {
        if (this.props.isModalVisible) {
            return (
                <TWRestorePointModal
                    onClose={this.props.onCloseModal}
                    onClickCreate={this.handleClickCreate}
                    onClickDelete={this.handleClickDelete}
                    onClickDeleteAll={this.handleClickDeleteAll}
                    onClickLoad={this.handleClickLoad}
                    onClickLoadLegacy={shouldRemoveLegacyRestorePoint() ? null : this.handleClickLoadLegacy}
                    interval={this.state.interval}
                    onChangeInterval={this.handleChangeInterval}
                    isLoading={this.state.loading}
                    totalSize={this.state.totalSize}
                    restorePoints={this.state.restorePoints}
                    error={this.state.error}
                />
            );
        }
        return null;
    }
}

TWRestorePointManager.propTypes = {
    intl: intlShape,
    projectChanged: PropTypes.bool.isRequired,
    projectTitle: PropTypes.string.isRequired,
    onStartCreatingRestorePoint: PropTypes.func.isRequired,
    onFinishCreatingRestorePoint: PropTypes.func.isRequired,
    onErrorCreatingRestorePoint: PropTypes.func.isRequired,
    onStartLoadingRestorePoint: PropTypes.func.isRequired,
    onFinishLoadingRestorePoint: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    loadingState: PropTypes.oneOf(LoadingStates).isRequired,
    isShowingProject: PropTypes.bool.isRequired,
    isModalVisible: PropTypes.bool.isRequired,
    vm: PropTypes.shape({
        loadProject: PropTypes.func.isRequired,
        stop: PropTypes.func.isRequired,
        renderer: PropTypes.shape({
            draw: PropTypes.func.isRequired
        })
    }).isRequired
};

const mapStateToProps = state => ({
    projectChanged: state.scratchGui.projectChanged,
    projectTitle: state.scratchGui.projectTitle,
    loadingState: state.scratchGui.projectState.loadingState,
    isShowingProject: getIsShowingProject(state.scratchGui.projectState.loadingState),
    isModalVisible: state.scratchGui.modals.restorePointModal,
    vm: state.scratchGui.vm
});

const mapDispatchToProps = dispatch => ({
    onStartCreatingRestorePoint: () => dispatch(showStandardAlert('twCreatingRestorePoint')),
    onFinishCreatingRestorePoint: () => showAlertWithTimeout(dispatch, 'twRestorePointSuccess'),
    onErrorCreatingRestorePoint: () => showAlertWithTimeout(dispatch, 'twRestorePointError'),
    onStartLoadingRestorePoint: loadingState => {
        dispatch(openLoadingProject());
        dispatch(requestProjectUpload(loadingState));
    },
    onFinishLoadingRestorePoint: (success, loadingState) => {
        dispatch(onLoadedProject(loadingState, false, success));
        dispatch(closeLoadingProject());
        dispatch(setFileHandle(null));
    },
    onCloseModal: () => dispatch(closeRestorePointModal())
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(TWRestorePointManager));
