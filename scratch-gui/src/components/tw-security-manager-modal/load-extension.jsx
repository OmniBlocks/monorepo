import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import styles from './security-manager-modal.css';

const LoadExtensionModal = props => (
    <div>
        <FormattedMessage
            defaultMessage="The project wants to load the custom extension:"
            description="Part of modal when a project attempts to automatically load an extenson"
            id="tw.loadExtension.title"
        />
        <p className={styles.url}>
            {props.url}
        </p>
        <p>
            <FormattedMessage
                // eslint-disable-next-line max-len
                defaultMessage="While the code will be sandboxed for security, it will be able to access information about your device such as your IP address and general location."
                description="Part of modal shown when asking for permission to automatically load custom extension"
                id="tw.securityManager.download"
            />
        </p>
        <p>
            <FormattedMessage
                // eslint-disable-next-line max-len
                defaultMessage="Make sure you trust the author of this extension before continuing."
                description="Part of modal shown when asking for permission to automatically load custom extension"
                id="tw.securityManager.trust"
            />
        </p>
    </div>
);

LoadExtensionModal.propTypes = {
    url: PropTypes.string.isRequired
};

export default LoadExtensionModal;
