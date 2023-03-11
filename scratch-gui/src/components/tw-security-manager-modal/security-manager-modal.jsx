import {defineMessages, FormattedMessage, intlShape, injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import Box from '../box/box.jsx';
import Modal from '../../containers/modal.jsx';
import SecurityModals from '../../lib/tw-security-manager-constants';
import LoadExtensionModal from './load-extension.jsx';
import FetchModal from './fetch.jsx';
import OpenWindowModal from './open-window.jsx';
import RedirectModal from './redirect.jsx';
import DelayedMountPropertyHOC from './delayed-mount-property-hoc.jsx';

import styles from './security-manager-modal.css';

const messages = defineMessages({
    title: {
        defaultMessage: 'Extension Security',
        // eslint-disable-next-line max-len
        description: 'Title of modal thats asks the user for permission to let the project load an extension, fetch a resource, open a window, etc.',
        id: 'tw.securityManager.title'
    }
});

const noop = () => {};

const SecurityManagerModalComponent = props => {
    const MAX_LENGTH = 100;
    const trimmedURL = props.url.length > MAX_LENGTH ? `${props.url.substring(0, MAX_LENGTH)}...` : props.url;
    return (
        <Modal
            className={styles.modalContent}
            onRequestClose={props.enableButtons ? props.onDenied : noop}
            contentLabel={props.intl.formatMessage(messages.title)}
            id="securitymanagermodal"
        >
            <Box className={styles.body}>
                {props.type === SecurityModals.LoadExtension ? (
                    <LoadExtensionModal
                        url={trimmedURL}
                    />
                ) : props.type === SecurityModals.Fetch ? (
                    <FetchModal
                        url={trimmedURL}
                    />
                ) : props.type === SecurityModals.OpenWindow ? (
                    <OpenWindowModal
                        url={trimmedURL}
                    />
                ) : props.type === SecurityModals.Redirect ? (
                    <RedirectModal
                        url={trimmedURL}
                    />
                ) : '?'}

                <Box className={styles.buttons}>
                    <button
                        className={styles.denyButton}
                        onClick={props.onDenied}
                        disabled={!props.enableButtons}
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
                        disabled={!props.enableButtons}
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
};

SecurityManagerModalComponent.propTypes = {
    intl: intlShape,
    type: PropTypes.oneOf(Object.values(SecurityModals)),
    enableButtons: PropTypes.bool,
    url: PropTypes.string.isRequired,
    onAllowed: PropTypes.func.isRequired,
    onDenied: PropTypes.func.isRequired
};

export default DelayedMountPropertyHOC(injectIntl(SecurityManagerModalComponent), 750, {
    enableButtons: true
});
