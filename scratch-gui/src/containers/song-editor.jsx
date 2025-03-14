import React, { useEffect, useRef } from 'react';

const SongEditor = () => {
    const containerRef = useRef(null);
    
    useEffect(() => {
        let scriptElements = [];

        const loadEditor = async () => {
            try {
                const response = await fetch('/index.html');
                const htmlText = await response.text();

                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlText, 'text/html');
                const container = containerRef.current;

                if (!container) return;

                // Safely append new children without breaking React
                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }
                doc.body.childNodes.forEach(node => {
                    container.appendChild(node.cloneNode(true));
                });

                // Script Handling: Load them without React breaking
                doc.querySelectorAll("script").forEach(oldScript => {
                    const newScript = document.createElement("script");
                    if (oldScript.src) {
                        newScript.src = oldScript.src;
                        newScript.async = true;
                    } else {
                        newScript.textContent = oldScript.textContent;
                    }
                    container.appendChild(newScript);
                    scriptElements.push(newScript);
                });

            } catch (error) {
                console.error('Error loading editor:', error);
            }
        };

        loadEditor();

        return () => {
            // Cleanup: Remove all added scripts
            scriptElements.forEach(script => {
                if (script.parentNode === containerRef.current) {
                    script.remove();
                }
            });
        };
    }, []);

    return <div id="beepboxEditorContainer" ref={containerRef} />;
};

export default SongEditor;
