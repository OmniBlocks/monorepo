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

    async handleExport () {
        if (this.state.isExporting) return;

        this.setState({
            isExporting: true,
            progress: 0,
            error: null
        });

        try {
            const target = this.props.vm.runtime.getTargetById(this.props.spriteId);
            if (!target || !target.sprite) {
                throw new Error('Target not found');
            }

            const zip = new JSZip();
            let totalItems = 0;
            let processedItems = 0;

            if (this.state.exportType === 'costumes') {
                if (!target.sprite.costumes || target.sprite.costumes.length === 0) {
                    throw new Error('No costumes found');
                }
                totalItems = target.sprite.costumes.length;

                const costumePromises = target.sprite.costumes.map(async item => {
                    try {
                        const data = await this.props.vm.getExportedCostume(item);
                        if (data) {
                            zip.file(
                                `${item.name}.${item.asset.dataFormat}`,
                                data,
                                {binary: true}
                            );
                        }
                        processedItems++;
                        this.updateProgress(Math.floor((processedItems / totalItems) * 100));
                    } catch (err) {
                        console.error(`Error exporting costume ${item.name}:`, err);
                        processedItems++;
                        this.updateProgress(Math.floor((processedItems / totalItems) * 100));
                    }
                });

                await Promise.all(costumePromises);
            } else if (this.state.exportType === 'sounds') {
                if (!target.sprite.sounds || target.sprite.sounds.length === 0) {
                    throw new Error('No sounds found');
                }
                totalItems = target.sprite.sounds.length;

                target.sprite.sounds.forEach(item => {
                    try {
                        if (item.asset && item.asset.data) {
                            zip.file(
                                `${item.name}.${item.asset.dataFormat}`,
                                item.asset.data,
                                {binary: true}
                            );
                        }
                        processedItems++;
                        this.updateProgress(Math.floor((processedItems / totalItems) * 100));
                    } catch (err) {
                        console.error(`Error exporting sound ${item.name}:`, err);
                        processedItems++;
                        this.updateProgress(Math.floor((processedItems / totalItems) * 100));
                    }
                });
            }

            if (Object.keys(zip.files).length === 0) {
                throw new Error('No items could be exported');
            }

            this.updateProgress(100);

            const content = await zip.generateAsync({type: 'blob'});
            const filename = `${target.getName()}-${this.state.exportType}.zip`;
            downloadBlob(filename, content);

            // Close modal on success
            this.props.onClose();
        } catch (err) {
            console.error('Export failed:', err);
            this.setState({
                error: err.message,
                isExporting: false,
                progress: 0
            });
        } finally {
            this.setState({isExporting: false});
        }
    }

    render () {
        return (
            <ExportJustModalComponent
                exportType={this.state.exportType}
                isExporting={this.state.isExporting}
                progress={this.state.progress}
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
    vm: state.scratchGui.vm
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(closeExportJustModal())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ExportJustModal);
