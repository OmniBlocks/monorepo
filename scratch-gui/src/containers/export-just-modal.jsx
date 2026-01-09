import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {closeExportJustModal} from '../reducers/modals';
import VM from 'scratch-vm';
import JSZip from 'jszip';
import downloadBlob from '../lib/download-blob';

import ExportJustModalComponent from '../components/export-just-modal/export-just-modal.jsx';

class ExportJustModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleChangeExportType',
            'handleCancel',
            'handleExport',
            'updateProgress'
        ]);

        this.state = {
            exportType: 'costumes',
            isExporting: false,
            progress: 0,
            error: null
        };

        this.lastProgressUpdate = 0;
    }

    handleChangeExportType (e) {
        this.setState({exportType: e.target.value});
    }

    handleCancel () {
        if (!this.state.isExporting) {
            this.props.onClose();
        }
    }

    updateProgress (progress) {
        // Throttle progress updates to avoid excessive re-renders
        const now = Date.now();
        if (now - this.lastProgressUpdate > 50 || progress === 100) {
            this.setState({progress});
            this.lastProgressUpdate = now;
        }
    }

    handleExport () {
        if (this.state.isExporting) return;

        this.setState({
            isExporting: true,
            progress: 0,
            error: null
        });

        const target = this.props.vm.runtime.getTargetById(this.props.spriteId);
        if (!target || !target.sprite) {
            this.setState({
                error: 'Target not found',
                isExporting: false
            });
            return;
        }

        const zip = new JSZip();
        let totalItems = 0;
        let processedItems = 0;

        const onComplete = () => {
            if (Object.keys(zip.files).length === 0) {
                this.setState({
                    error: 'No items could be exported',
                    isExporting: false
                });
                return;
            }

            this.updateProgress(100);

            zip.generateAsync({type: 'blob'})
                .then(content => {
                    const filename = `${target.getName()}-${this.state.exportType}.zip`;
                    downloadBlob(filename, content);
                    this.props.onClose();
                })
                .catch(err => {
                    console.error('Zip generation failed:', err);
                    this.setState({
                        error: err.message,
                        isExporting: false
                    });
                });
        };

        if (this.state.exportType === 'costumes') {
            if (!target.sprite.costumes || target.sprite.costumes.length === 0) {
                this.setState({
                    error: 'No costumes found',
                    isExporting: false
                });
                return;
            }
            totalItems = target.sprite.costumes.length;

            target.sprite.costumes.forEach(item => {
                if (item.asset && item.asset.data) {
                    zip.file(`${item.name}.${item.asset.dataFormat}`, item.asset.data, {binary: true});
                }
                processedItems++;
                this.updateProgress(Math.floor((processedItems / totalItems) * 100));
            });

            onComplete();
        } else if (this.state.exportType === 'sounds') {
            if (!target.sprite.sounds || target.sprite.sounds.length === 0) {
                this.setState({
                    error: 'No sounds found',
                    isExporting: false
                });
                return;
            }
            totalItems = target.sprite.sounds.length;

            target.sprite.sounds.forEach(item => {
                if (item.asset && item.asset.data) {
                    zip.file(`${item.name}.${item.asset.dataFormat}`, item.asset.data, {binary: true});
                }
                processedItems++;
                this.updateProgress(Math.floor((processedItems / totalItems) * 100));
            });

            onComplete();
        }
    }

    render () {
        return (
            <ExportJustModalComponent
                exportType={this.state.exportType}
                isExporting={this.state.isExporting}
                progress={this.state.progress}
                error={this.state.error}
                onChangeExportType={this.handleChangeExportType}
                onCancel={this.handleCancel}
                onExport={this.handleExport}
            />
        );
    }
}

ExportJustModal.propTypes = {
    spriteId: PropTypes.string,
    vm: PropTypes.instanceOf(VM).isRequired,
    onClose: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    vm: state.scratchGui.vm,
    spriteId: state.scratchGui.exportJust.exportingSpriteId
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(closeExportJustModal())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ExportJustModal);
