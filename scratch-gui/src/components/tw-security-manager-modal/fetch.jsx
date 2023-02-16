import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import styles from './security-manager-modal.css';

const FetchModal = props => (
    <div>
        <FormattedMessage
            defaultMessage="The project wants to connect to the website:"
            description="Part of modal when a project asks permission to fetch a URL"
            id="tw.fetch.title"
        />
        <p className={styles.url}>
            {props.url}
        </p>
        <p>
            <FormattedMessage
                // eslint-disable-next-line max-len
                defaultMessage="The project may require this to download additional images or sounds, implement multiplayer, access an API, or malicious purposes."
                description="Part of modal shown when a project asks permission to fetch a URL"
                id="tw.securityManager.why"
            />
        </p>
        <p>
            <FormattedMessage
                // eslint-disable-next-line max-len
                defaultMessage="This may share your IP address, general location, and other data from the project with the website."
                description="Part of modal shown when a project asks permission to fetch a URL"
                id="tw.securityManager.risk"
            />
        </p>
        <p>
            <FormattedMessage
                // eslint-disable-next-line max-len
                defaultMessage="If you allow this, all further requests to the same website will be automatically allowed."
                description="Part of modal shown when asking for permission to automatically load custom extension"
                id="tw.securityManager.trust"
            />
        </p>
    </div>
);

FetchModal.propTypes = {
    url: PropTypes.string.isRequired
};

export default FetchModal;
