import React, { useEffect, useRef } from 'react';

const SongEditor = () => {
    const iframeRef = useRef(null);

    useEffect(() => {
        console.log("🎶 Song Editor component mounted");

        const handleMessage = (event) => {
            console.log("🔗 Message received from:", event.origin);
            console.log("💬 Message data:", event.data);

            // Only proceed if the message origin matches the iframe origin
            if (event.origin !== window.location.origin) {
                console.warn(`❌ Message origin mismatch: expected ${window.location.origin}, received ${event.origin}`);
                return;
            }

            const { type, payload } = event.data;
            if (type === 'SONG_DATA') {
                console.log('🎶 Received UJ data:', payload);
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

    return (
        <div
            style={{
                width: '100vh',
                height: '100%',
                top: 0,
                left: 0
            }}
        >
            <iframe
                ref={iframeRef}
                id="beepboxEditorIframe"
                src="songeditor.html" 
                style={{
                    width: '100vh',
                    height: '100%',
                    border: 'none',
                    display: 'block',
                    
                                }}
                sandbox="allow-scripts allow-same-origin"
            />
        </div>
    );
};

export default SongEditor;
