import {defineMessages, FormattedMessage, intlShape, injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import Box from '../box/box.jsx';
import Modal from '../../containers/modal.jsx';

import styles from './security-manager-modal.css';

const messages = defineMessages({
    title: {
        defaultMessage: 'Custom Extensions',
        description: 'Title of modal shown when asking for permission to automatically load custom extension',
        id: 'tw.securityManager.title'
    }
});

const SecurityManagerModalComponent = props => (
    <Modal
        className={styles.modalContent}
        onRequestClose={props.onDenied}
        contentLabel={props.intl.formatMessage(messages.title)}
        id="securitymanagermodal"
    >
        <Box className={styles.body}>
            <p>
                <FormattedMessage
                    defaultMessage="The project wants to load the custom extension:"
                    description="Part of modal shown when asking for permission to automatically load custom extension"
                    id="tw.securityManager.label"
                />
            </p>
            <p className={styles.extension}>
                {props.extensionURL}
            </p>
            <p>
                <FormattedMessage
                    // eslint-disable-next-line max-len
                    defaultMessage="If you allow this, the extension's code will be downloaded and run on your computer."
                    description="Part of modal shown when asking for permission to automatically load custom extension"
                    id="tw.securityManager.download"
                />
            </p>
            <p>
                <FormattedMessage
                    // eslint-disable-next-line max-len
                    defaultMessage="While the code will be sandboxed, we can't guarantee this will be 100% safe. Make sure you trust the author of this extension before continuing."
                    description="Part of modal shown when asking for permission to automatically load custom extension"
                    id="tw.securityManager.sandbox"
                />
                
            </p>
            <Box className={styles.buttons}>
                <button
                    className={styles.denyButton}
                    onClick={props.onDenied}
                >
                    <FormattedMessage
                        defaultMessage="Deny"
                        description="Refuse modal asking for permission to automatically load custom extension"
                        id="tw.securityManager.deny"
                    />
                </button>
                <button
                    className={styles.allowButton}
                    onClick={props.onAllowed}
                >
                    <FormattedMessage
                        defaultMessage="Allow"
                        description="Refuse modal asking for permission to automatically load custom extension"
                        id="tw.securityManager.allow"
                    />
                </button>
            </Box>
        </Box>
    </Modal>
);

SecurityManagerModalComponent.propTypes = {
    intl: intlShape,
    extensionURL: PropTypes.string.isRequired,
    onAllowed: PropTypes.func.isRequired,
    onDenied: PropTypes.func.isRequired
};

export default injectIntl(SecurityManagerModalComponent);
