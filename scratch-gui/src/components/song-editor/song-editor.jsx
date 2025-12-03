import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Box from '../box/box.jsx';
import IconButton from '../icon-button/icon-button.jsx';

import styles from './song-editor.css';

import maximizeIcon from '../stage-header/icon--fullscreen.svg';

const SongEditor = () => {
    const iframeRef = useRef(null);

    useEffect(() => {
        console.log("🎶 Song Editor component mounted");

        const handleMessage = (event) => {
            console.log("🔗 Message received from:", event.origin);
            console.log("💬 Message data:", event.data);

            if (event.origin !== window.location.origin) {
                console.warn(`❌ Message origin mismatch: expected ${window.location.origin}, received ${event.origin}`);
                return;
            }

            if (typeof event.data !== 'object' || event.data === null) {
                console.warn('❌ Ignoring non-object message payload:', event.data);
                return;
            }

            const { type, payload } = event.data;
            if (type === 'SONG_DATA') {
                console.log('🎶 Received song data:', payload);
            } else if (type === 'DOWNLOAD_REQUEST') {
                console.log('💾 Download requested:', payload);
                handleDownload(payload);
            } else {
                console.log(`🔍 Received unknown message type: ${type}`);
            }
        };
        window.addEventListener('message', handleMessage);

        return () => {
            console.log("🛑 Cleaning up message listener");
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    const handleDownload = (downloadData) => {
        const { filename, data, mimeType } = downloadData;
        const blob = new Blob([data], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleToggleFullscreen = () => {
        if (iframeRef.current) {
            if (iframeRef.current.requestFullscreen) {
                iframeRef.current.requestFullscreen().catch(err => {
                    console.warn('Failed to enter fullscreen:', err);
                });
            }
        }
    };

    return (
        <Box className={styles.editorContainer}>
            <Box className={styles.toolbarContainer}>
                <IconButton
                    img={maximizeIcon}
                    title="Fullscreen"
                    onClick={handleToggleFullscreen}
                />
            </Box>
            <div className={styles.iframeWrapper}>
                <iframe
                    ref={iframeRef}
                    id="beepboxEditorIframe"
                    src="songeditor.html"
                    className={styles.iframe}
                    sandbox="allow-scripts allow-same-origin allow-downloads allow-midi allow-modals allow-forms"
                    allow="fullscreen"
                />
            </div>
        </Box>
    );
};

export default SongEditor;