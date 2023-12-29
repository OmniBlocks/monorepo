import PropTypes from 'prop-types';
import React from 'react';
import ReactModal from 'react-modal';
import Box from '../box/box.jsx';
import {defineMessages, injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {isRendererSupported, isNewFunctionSupported} from '../../lib/tw-environment-support-prober.js';

import styles from './browser-modal.css';
import unhappyBrowser from './unsupported-browser.svg';

const messages = defineMessages({
    label: {
        id: 'gui.unsupportedBrowser.label',
        defaultMessage: 'Browser is not supported',
        description: ''
    }
});

const noop = () => {};

const BrowserModal = ({intl, ...props}) => {
    const label = messages.label;
    return (
        <ReactModal
            isOpen
            className={styles.modalContent}
            contentLabel={intl.formatMessage({...messages.label})}
            overlayClassName={styles.modalOverlay}
            onRequestClose={noop}
        >
            <div dir={props.isRtl ? 'rtl' : 'ltr'} >
                <Box className={styles.illustration}>
                    <img
                        src={unhappyBrowser}
                        draggable={false}
                    />
                </Box>

                <Box className={styles.body}>
                    <h2>
                        <FormattedMessage {...label} />
                    </h2>

                    {/* eslint-disable max-len */}
                    {isNewFunctionSupported() ? null : (
                        // This message should only be seen by website operators, so we don't need to translate it
                        <p>
                            {'Unable to compile JavaScript with new Function(). This is most likely caused by an overly-strict Content-Security-Policy. The CSP must include \'unsafe-eval\'.'}
                        </p>
                    )}

                    {!isRendererSupported() && (
                        <React.Fragment>
                            <p>
                                <FormattedMessage
                                    defaultMessage="Your browser {webGlLink} which is needed for this site to run. Try updating your browser and graphics drivers or restarting your computer."
                                    description="WebGL missing message. {webGLLink} is a link with the text 'does not support WebGL' from Scratch's translations"
                                    id="tw.webglModal.description"
                                    values={{
                                        webGlLink: (
                                            <a href="https://get.webgl.org/">
                                                <FormattedMessage
                                                    defaultMessage="does not support WebGL"
                                                    description="link part of your browser does not support WebGL message"
                                                    id="gui.webglModal.webgllink"
                                                />
                                            </a>
                                        )
                                    }}
                                />
                            </p>
                            <p>
                                <FormattedMessage
                                    defaultMessage="Make sure you're using a recent version of Google Chrome, Mozilla Firefox, Microsoft Edge, or Apple Safari."
                                    description="A message that appears in the browser not supported modal"
                                    id="tw.browserModal.desc"
                                />
                            </p>
                            <p>
                                <FormattedMessage
                                    defaultMessage="On Apple devices, you must disable {lockdownMode}."
                                    description="Part of the browser not supported message. Lockdown Mode refers to https://support.apple.com/en-us/HT212650"
                                    id="tw.lockdownMode"
                                    values={{
                                        lockdownMode: (
                                            <a href="https://support.apple.com/en-us/HT212650">
                                                <FormattedMessage
                                                    defaultMessage="Lockdown Mode"
                                                    description="Links to an Apple support page about Lockdown Mode: https://support.apple.com/en-us/HT212650 Try to translate this the same as Apple."
                                                    id="tw.lockdownMode2"
                                                />
                                            </a>
                                        )
                                    }}
                                />
                            </p>
                        </React.Fragment>
                    )}
                </Box>
            </div>
        </ReactModal>
    );
};

BrowserModal.propTypes = {
    intl: intlShape.isRequired,
    isRtl: PropTypes.bool
};

const WrappedBrowserModal = injectIntl(BrowserModal);

WrappedBrowserModal.setAppElement = ReactModal.setAppElement;

export default WrappedBrowserModal;
