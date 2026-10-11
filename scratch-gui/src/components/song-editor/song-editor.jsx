import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import 'select2';

import Box from '../box/box.jsx';

import styles from './song-editor.css';

if (typeof window !== 'undefined') {
    window.jQuery = $;
    window.$ = $;
}

const SongEditor = ({isVisible}) => {
    const hostRef = useRef(null);
    const editorRef = useRef(null);

    useEffect(() => {
        if (!hostRef.current || typeof window === 'undefined') {
            return undefined;
        }

        let cancelled = false;

        const mountEditor = async () => {
            const module = await import('song-editor');
            const mount = module.mountSongEditor || module.default?.mountSongEditor;
            if (!mount || cancelled || !hostRef.current) {
                return;
            }

            editorRef.current = mount(hostRef.current);
            window.dispatchEvent(new Event('resize'));
        };

        mountEditor();

        return () => {
            cancelled = true;
            if (editorRef.current && editorRef.current.destroy) {
                editorRef.current.destroy();
            }
            editorRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!isVisible) {
            return undefined;
        }

        const timer = window.setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 0);

        return () => window.clearTimeout(timer);
    }, [isVisible]);

    return (
        <Box className={styles.editorContainer}>
            <div id="beepboxEditorContainer" ref={hostRef} className={styles.editorHost} />
        </Box>
    );
};

SongEditor.propTypes = {
    isVisible: PropTypes.bool,
    vm: PropTypes.object,
    onClose: PropTypes.func
};

export default SongEditor;