import PropTypes from 'prop-types';
import React from 'react';
import ReactModal from 'react-modal';
import Box from '../box/box.jsx';
import {defineMessages, injectIntl, intlShape, FormattedMessage} from 'react-intl';

import styles from './webgl-broken-modal.css';

const messages = defineMessages({
    label: {
        id: 'gui.webglBrokenModal.label',
        defaultMessage: 'WebGL Appears to be Broken',
        description: 'WebGL broken title'
    }
});

const WebGlBrokenModal = ({intl, ...props}) => {
    // Try to detect iOS version from user agent
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

// Try standard iOS pattern first (iPhone, old iPads)
let iosMatch = navigator.userAgent.match(/OS (\d+)[._](\d+)[._]?(\d+)?/);

// If no match, iPad is likely reporting as Mac - try Safari Version/ instead
if (!iosMatch && isIOS) {
    iosMatch = navigator.userAgent.match(/Version\/(\d+)\.(\d+)(?:\.(\d+))?/);
}

const iosVersion = iosMatch ? `${iosMatch[1]}.${iosMatch[2]}${iosMatch[3] ? '.' + iosMatch[3] : ''}` : null;
const isIOS18_7 = iosVersion && iosVersion.startsWith('18.7');
    return (
        <ReactModal
            isOpen
            className={styles.modalContent}
            contentLabel={intl.formatMessage({...messages.label})}
            overlayClassName={styles.modalOverlay}
            onRequestClose={props.onBack}
        >
            <div dir={props.isRtl ? 'rtl' : 'ltr'}>
                <Box className={styles.illustration} />

                <Box className={styles.body}>
                    <h2>
                        <FormattedMessage {...messages.label} />
                    </h2>
                    <p>
                        <FormattedMessage
                            defaultMessage="Your browser claims to support WebGL, but it appears to be malfunctioning. This is likely a browser bug or graphics driver issue."
                            description="WebGL broken message"
                            id="gui.webglBrokenModal.description"
                        />
                    </p>

                    {isIOS18_7 && (
                        <p style={{marginTop: '1rem', padding: '0.75rem', backgroundColor: '#FFF3CD', borderRadius: '0.25rem'}}>
                            <strong>
                                <FormattedMessage
                                    defaultMessage="iOS/iPadOS 18.7.2 Users:"
                                    description="iOS 18.7.2 callout header"
                                    id="gui.webglBrokenModal.ios18Header"
                                />
                            </strong>
                            <br />
                            <FormattedMessage
                                defaultMessage="You may be on build 22H123 which has a known WebGL bug. Update to build 22H124 or later: Settings → General → Software Update (disable Beta Updates first if needed)."
                                description="iOS 18.7.2 specific guidance"
                                id="gui.webglBrokenModal.ios18Guidance"
                            />
                        </p>
                    )}

                    <Box className={styles.buttonRow}>
                        <button
                            className={styles.backButton}
                            onClick={props.onBack}
                        >
                            <FormattedMessage
                                defaultMessage="Back"
                                description="Label for button go back when WebGL is broken"
                                id="gui.webglBrokenModal.back"
                            />
                        </button>
                    </Box>

                    <div className={styles.faqLinkText}>
                        <FormattedMessage
                            defaultMessage="For more information, see the {statusLink}."
                            description="Status and Issues link"
                            id="gui.webglBrokenModal.statusLink"
                            values={{
                                statusLink: (
                                    <a
                                        className={styles.faqLink}
                                        href="https://omniblocks.miraheze.org/wiki/Status_and_Issues"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <FormattedMessage
                                            defaultMessage="Status and Issues page"
                                            description="link to Status and Issues wiki"
                                            id="gui.webglBrokenModal.statusLinkText"
                                        />
                                    </a>
                                )
                            }}
                        />
                    </div>
                </Box>
            </div>
        </ReactModal>
    );
};

WebGlBrokenModal.propTypes = {
    intl: intlShape.isRequired,
    isRtl: PropTypes.bool,
    onBack: PropTypes.func.isRequired
};


export default injectIntl(WebGlBrokenModal);
