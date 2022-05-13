import PropTypes from 'prop-types';
import React from 'react';
import ReactModal from 'react-modal';
import Box from '../box/box.jsx';
import {defineMessages, injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {canConstructNewFunctions} from '../../lib/tw-environment-support-prober.js';

import styles from './browser-modal.css';
import unhappyBrowser from './unsupported-browser.svg';

const messages = defineMessages({
    label: {
        id: 'gui.unsupportedBrowser.label',
        defaultMessage: 'Browser is not supported',
        description: ''
    }
});

const BrowserModal = ({intl, ...props}) => {
    const label = messages.label;
    return (
        <ReactModal
            isOpen
            className={styles.modalContent}
            contentLabel={intl.formatMessage({...messages.label})}
            overlayClassName={styles.modalOverlay}
            onRequestClose={props.onBack}
        >
            <div dir={props.isRtl ? 'rtl' : 'ltr'} >
                <Box className={styles.illustration}>
                    <img src={unhappyBrowser} />
                </Box>

                <Box className={styles.body}>
                    <h2>
                        <FormattedMessage {...label} />
                    </h2>
                    {/* eslint-disable max-len */}
                    {canConstructNewFunctions() ? null : (
                        // This message is only intended to be read by website operators
                        // We don't need to make it translatable
                        <p>
                            {'This site is unable to compile arbitrary JavaScript. This is most likely caused by an overly-strict Content-Security-Policy set by the server.'}
                        </p>
                    )}
                    <p>
                        <FormattedMessage
                            defaultMessage="Make sure you're using a recent version of Google Chrome, Mozilla Firefox, Microsoft Edge, or Apple Safari."
                            description="A message that appears in the browser not supported modal"
                            id="tw.browserModal.desc"
                        />
                    </p>
                    {/* eslint-enable max-len */}
                </Box>
            </div>
        </ReactModal>
    );
};

BrowserModal.propTypes = {
    intl: intlShape.isRequired,
    isRtl: PropTypes.bool,
    onBack: PropTypes.func.isRequired
};

const WrappedBrowserModal = injectIntl(BrowserModal);

WrappedBrowserModal.setAppElement = ReactModal.setAppElement;

export default WrappedBrowserModal;
