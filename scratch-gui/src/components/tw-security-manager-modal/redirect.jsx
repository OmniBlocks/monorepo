import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import styles from './security-manager-modal.css';
import {APP_NAME} from '../../lib/brand';

const RedirectModal = props => (
    <div>
        <FormattedMessage
            defaultMessage="The project wants to navigate this tab to the URL:"
            description="Part of modal when a project attempts to navigate the current tab"
            id="tw.redirect.title"
        />
        <p className={styles.url}>
            {props.url}
        </p>
        <p>
            <FormattedMessage
                // eslint-disable-next-line max-len
                defaultMessage="This website has not been reviewed by the {APP_NAME} developers. It may contain dangerous or malicious code."
                description="Part of modal when a project attempts to navigate the current tab"
                id="tw.redirect.dangerous"
                values={{
                    APP_NAME
                }}
            />
        </p>
    </div>

);

RedirectModal.propTypes = {
    url: PropTypes.string.isRequired
};

export default RedirectModal;
