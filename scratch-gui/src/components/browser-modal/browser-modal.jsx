import PropTypes from 'prop-types';
import React from 'react';
import ReactModal from 'react-modal';
import Box from '../box/box.jsx';
import {defineMessages, injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {
    isRendererSupported,
    isNewFunctionSupported,
    findIncompatibleUserscripts
} from '../../lib/tw-environment-support-prober.js';
<<<<<<< HEAD
=======
import {APP_NAME} from '../../lib/brand.js';
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571

import styles from './browser-modal.css';
import unhappyBrowser from './unsupported-browser.svg';

const messages = defineMessages({
<<<<<<< HEAD
    label: {
        id: 'gui.unsupportedBrowser.label',
        defaultMessage: 'Browser is not supported',
        description: ''
=======
    browserNotSupported: {
        id: 'gui.unsupportedBrowser.label',
        defaultMessage: 'Browser is not supported',
        description: ''
    },
    systemNotSupported: {
        id: 'tw.browserModal.desktopTitle',
        defaultMessage: 'System is not supported',
        description: 'Title of error message in desktop app when system does not support required API, such as WebGL'
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
    }
});

const noop = () => {};

const BrowserModal = ({intl, ...props}) => {
<<<<<<< HEAD
    const label = messages.label;
=======
    const title = props.onClickDesktopSettings ? messages.systemNotSupported : messages.browserNotSupported;
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
    const incompatibleUserscripts = findIncompatibleUserscripts();
    return (
        <ReactModal
            isOpen
            className={styles.modalContent}
<<<<<<< HEAD
            contentLabel={intl.formatMessage({...messages.label})}
=======
            contentLabel={intl.formatMessage(title)}
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
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
<<<<<<< HEAD
                    <h2>
                        <FormattedMessage {...label} />
=======
                    <h2 className={styles.title}>
                        <FormattedMessage {...title} />
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
                    </h2>

                    {/* eslint-disable max-len */}
                    {isNewFunctionSupported() ? null : (
                        // This message should only be seen by website operators, so we don't need to translate it
                        <p>
                            {'Unable to compile JavaScript with new Function(). This is most likely caused by an overly-strict Content-Security-Policy. The CSP must include \'unsafe-eval\'.'}
                        </p>
                    )}

                    {incompatibleUserscripts.length > 0 && (
                        <React.Fragment>
                            {incompatibleUserscripts.map((message, index) => (
                                <p key={index}>
                                    {message}
                                </p>
                            ))}
                        </React.Fragment>
                    )}

                    {!isRendererSupported() && (
                        <React.Fragment>
                            <p>
                                <FormattedMessage
<<<<<<< HEAD
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
=======
                                    defaultMessage="{APP_NAME} requires WebGL, however your computer does not seem to support it. This is often a temporary error that can be fixed by restarting your computer."
                                    description="Error message when browser does not support WebGL."
                                    id="tw.browserModal.webgl1"
                                    values={{
                                        APP_NAME
                                    }}
                                />
                            </p>

                            {props.onClickDesktopSettings ? (
                                <React.Fragment>
                                    <p>
                                        <FormattedMessage
                                            defaultMessage={'You can also try toggling the "graphics acceleration" option in desktop settings:'}
                                            description="Error message when browser does not support WebGL (desktop app version). Consider seeing how Chrome translates 'graphics acceleration' into your language."
                                            id="tw.browserModal.webglDesktop"
                                        />
                                    </p>
                                    <div className={styles.desktopSettingsOuter}>
                                        <button
                                            onClick={props.onClickDesktopSettings}
                                            className={styles.desktopSettingsInner}
                                        >
                                            <FormattedMessage
                                                defaultMessage="Open Desktop Settings"
                                                description="Button in unsupported system modal to open desktop settings"
                                                id="tw.browserModal.desktopSettings"
                                            />
                                        </button>
                                    </div>
                                </React.Fragment>
                            ) : (
                                <p>
                                    <FormattedMessage
                                        defaultMessage={'Use a recent version of Chrome, Firefox, or Safari, and ensure your graphics drivers are up to date. You can also try toggling the "graphics acceleration" or "hardware acceleration" option in your browser\'s settings.'}
                                        description="Error message when browser does not support WebGL (browser version). Chrome calls it graphics acceleration and Firefox calls it hardware acceleration; consider seeing how they actually translate these"
                                        id="tw.browserModal.webglBrowser"
                                    />
                                </p>
                            )}
                        </React.Fragment>
                    )}

                    {/* eslint-enable max-len */}
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
                </Box>
            </div>
        </ReactModal>
    );
};

BrowserModal.propTypes = {
    intl: intlShape.isRequired,
<<<<<<< HEAD
    isRtl: PropTypes.bool
=======
    isRtl: PropTypes.bool,
    onClickDesktopSettings: PropTypes.func
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
};

const WrappedBrowserModal = injectIntl(BrowserModal);

WrappedBrowserModal.setAppElement = ReactModal.setAppElement;

export default WrappedBrowserModal;
