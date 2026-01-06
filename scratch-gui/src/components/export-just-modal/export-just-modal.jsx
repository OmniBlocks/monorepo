import {defineMessages, FormattedMessage, intlShape, injectIntl} from 'react-intl';
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
    description: {
        defaultMessage: 'Choose what you want to export from this sprite:',
        description: 'Description text in the export modal',
        id: 'gui.exportJustModal.description'
    },
    exportLabel: {
        defaultMessage: 'Export just:',
        description: 'Label for the dropdown',
        id: 'gui.exportJustModal.exportLabel'
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
    },
    exporting: {
        defaultMessage: 'Exporting...',
        description: 'Text shown while exporting',
        id: 'gui.exportJustModal.exporting'
    },
    cancel: {
        defaultMessage: 'Cancel',
        description: 'Cancel button text',
        id: 'gui.exportJustModal.cancel'
    },
    export: {
        defaultMessage: 'Export',
        description: 'Export button text',
        id: 'gui.exportJustModal.export'
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
                        sizePx={36}
                        value={props.progress}
                        max={100}
                    />
                    <div className={styles.progressText}>
                        <FormattedMessage
                            defaultMessage={`${messages.exporting.defaultMessage} ${props.progress}%`}
                            description={messages.exporting.description}
                            id={messages.exporting.id}
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
                            defaultMessage={messages.description.defaultMessage}
                            description={messages.description.description}
                            id={messages.description.id}
                        />
                    </p>
                    
                    <div className={styles.selectRow}>
                        <label
                            className={styles.label}
                            htmlFor="export-type-select"
                        >
                            <FormattedMessage
                                defaultMessage={messages.exportLabel.defaultMessage}
                                description={messages.exportLabel.description}
                                id={messages.exportLabel.id}
                            />
                        </label>
                        <select
                            id="export-type-select"
                            className={styles.select}
                            value={props.exportType}
                            onChange={props.onChangeExportType}
                        >
                            <option value="costumes">
                                <FormattedMessage
                                    defaultMessage={messages.costumes.defaultMessage}
                                    description={messages.costumes.description}
                                    id={messages.costumes.id}
                                />
                            </option>
                            <option value="sounds">
                                <FormattedMessage
                                    defaultMessage={messages.sounds.defaultMessage}
                                    description={messages.sounds.description}
                                    id={messages.sounds.id}
                                />
                            </option>
                        </select>
                    </div>

                    <div className={styles.buttonRow}>
                        <button
                            className={styles.cancelButton}
                            onClick={props.onCancel}
                        >
                            <FormattedMessage
                                defaultMessage={messages.cancel.defaultMessage}
                                description={messages.cancel.description}
                                id={messages.cancel.id}
                            />
                        </button>
                        <button
                            className={styles.exportButton}
                            onClick={props.onExport}
                        >
                            <FormattedMessage
                                defaultMessage={messages.export.defaultMessage}
                                description={messages.export.description}
                                id={messages.export.id}
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
    onChangeExportType: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onExport: PropTypes.func.isRequired
};

export default injectIntl(ExportJustModal);
