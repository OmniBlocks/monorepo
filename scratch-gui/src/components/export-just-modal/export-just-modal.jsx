import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import Modal from '../../containers/modal.jsx';
import Box from '../box/box.jsx';
import ProgressRing from '../progress-ring/progress-ring.jsx';

import styles from './export-just-modal.css';

const messages = defineMessages({
    title: {
        defaultMessage: 'Export just...',
        description: 'Title of the export modal',
        id: 'gui.exportJustModal.title'
    },
    costumes: {
        defaultMessage: 'Costumes',
        description: 'Export costumes option',
        id: 'gui.exportJustModal.costumes'
    },
    sounds: {
        defaultMessage: 'Sounds',
        description: 'Export sounds option',
        id: 'gui.exportJustModal.sounds'
    }
});

const ExportJustModal = props => (
    <Modal
        className={styles.modalContent}
        onRequestClose={props.onCancel}
        contentLabel={props.intl.formatMessage(messages.title)}
        id="exportJustModal"
    >
        <Box className={styles.body}>
            {props.isExporting ? (
                <div className={styles.progressContainer}>
                    <ProgressRing
                        max={100}
                        sizePx={36}
                        value={props.progress}
                    />
                    <div className={styles.progressText}>
                        <FormattedMessage
                            defaultMessage="Exporting... {progress}%"
                            description="Text shown while exporting"
                            id="gui.exportJustModal.exporting"
                            values={{
                                progress: props.progress
                            }}
                        />
                    </div>
                </div>
            ) : (
                <React.Fragment>
                    <p className={styles.description}>
                        <FormattedMessage
                            defaultMessage="Choose what you want to export from this sprite:"
                            description="Description text in the export modal"
                            id="gui.exportJustModal.description"
                        />
                    </p>

                    <div className={styles.selectRow}>
                        <label
                            className={styles.label}
                            htmlFor="export-type-select"
                        >
                            <FormattedMessage
                                defaultMessage="Export just:"
                                description="Label for the dropdown"
                                id="gui.exportJustModal.exportLabel"
                            />
                        </label>
                        <select
                            className={styles.select}
                            id="export-type-select"
                            value={props.exportType}
                            onChange={props.onChangeExportType}
                        >
                            <option value="costumes">
                                {props.intl.formatMessage(messages.costumes)}
                            </option>
                            <option value="sounds">
                                {props.intl.formatMessage(messages.sounds)}
                            </option>
                        </select>
                    </div>

                    <div className={styles.buttonRow}>
                        <button
                            className={styles.cancelButton}
                            onClick={props.onCancel}
                        >
                            <FormattedMessage
                                defaultMessage="Cancel"
                                description="Cancel button text"
                                id="gui.exportJustModal.cancel"
                            />
                        </button>
                        <button
                            className={styles.exportButton}
                            onClick={props.onExport}
                        >
                            <FormattedMessage
                                defaultMessage="Export"
                                description="Export button text"
                                id="gui.exportJustModal.export"
                            />
                        </button>
                    </div>
                </React.Fragment>
            )}
        </Box>
    </Modal>
);

ExportJustModal.propTypes = {
    intl: intlShape.isRequired,
    exportType: PropTypes.oneOf(['costumes', 'sounds']).isRequired,
    isExporting: PropTypes.bool.isRequired,
    progress: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChangeExportType: PropTypes.func.isRequired,
    onExport: PropTypes.func.isRequired
};

export default injectIntl(ExportJustModal);
