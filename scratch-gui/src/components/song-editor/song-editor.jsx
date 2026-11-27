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

const SongEditor = ({
    isVisible,
    songData,
    songKey,
    songName,
    onSongChange,
    onSongMetadataChange,
    onEditorReady,
    onError
}) => {
    const hostRef = useRef(null);
    const editorRef = useRef(null);
    const songDataRef = useRef(songData);
    const songKeyRef = useRef(songKey);
    const songNameRef = useRef(songName);
    const onSongChangeRef = useRef(onSongChange);
    const onSongMetadataChangeRef = useRef(onSongMetadataChange);
    const onEditorReadyRef = useRef(onEditorReady);
    const onErrorRef = useRef(onError);
    const loadedSongKeyRef = useRef(null);
    songDataRef.current = songData;
    songKeyRef.current = songKey;
    songNameRef.current = songName;
    onSongChangeRef.current = onSongChange;
    onSongMetadataChangeRef.current = onSongMetadataChange;
    onEditorReadyRef.current = onEditorReady;
    onErrorRef.current = onError;

    const loadSelectedSong = () => {
        const editor = editorRef.current;
        const selectedSongKey = songKeyRef.current;
        const selectedSongData = songDataRef.current;
        if (!editor) return;
        if (!selectedSongKey || !selectedSongData) {
            editor.setOnSongChange(null);
            loadedSongKeyRef.current = null;
            return;
        }

        const enableSongChangeNotifications = () => {
            editor.setOnSongChange(changedSongData => {
                if (onSongChangeRef.current) onSongChangeRef.current(changedSongData);
                if (onSongMetadataChangeRef.current) {
                    onSongMetadataChangeRef.current(editor.getSongName(), editor.getSongDuration());
                }
            });
        };
        const notifySongMetadata = () => {
            if (onSongMetadataChangeRef.current) {
                onSongMetadataChangeRef.current(editor.getSongName(), editor.getSongDuration());
            }
        };
        const syncSongName = () => {
            const selectedSongName = songNameRef.current;
            if (typeof selectedSongName === 'string' && editor.getSongName() !== selectedSongName) {
                editor.renameSong(selectedSongName);
            }
        };
        if (loadedSongKeyRef.current === selectedSongKey) {
            enableSongChangeNotifications();
            syncSongName();
            notifySongMetadata();
            return;
        }

        try {
            editor.setOnSongChange(null);
            editor.loadSongData(selectedSongData);
            loadedSongKeyRef.current = selectedSongKey;
            enableSongChangeNotifications();
            syncSongName();
            notifySongMetadata();
        } catch (error) {
            if (onErrorRef.current) onErrorRef.current(error);
        }
    };

    useEffect(() => {
        if (!hostRef.current || typeof window === 'undefined') {
            return;
        }

        let cancelled = false;

        const mountEditor = async () => {
            const module = await import('song-editor');
            const mount = module.mountSongEditor || module.default?.mountSongEditor;
            if (!mount) {
                throw new Error('The song editor module does not expose mountSongEditor.');
            }
            if (cancelled || !hostRef.current) {
                return;
            }

            window.beepbox = module.default ? module.default : module;
            editorRef.current = mount(hostRef.current);
            loadSelectedSong();
            if (onEditorReadyRef.current) onEditorReadyRef.current(editorRef.current);
            window.dispatchEvent(new Event('resize'));
        };

        mountEditor().catch(error => {
            if (onErrorRef.current) onErrorRef.current(error);
        });

        return () => {
            cancelled = true;
            if (editorRef.current) {
                window.beepbox = null;
                if (editorRef.current.destroy) editorRef.current.destroy();
                if (onEditorReadyRef.current) onEditorReadyRef.current(null);
            }
            editorRef.current = null;
        };
    }, []);

    useEffect(() => {
        loadSelectedSong();
    }, [songData, songKey]);

    useEffect(() => {
        loadSelectedSong();
    }, [songName]);

    useEffect(() => {
        if (!isVisible) {
            return;
        }

        const timer = window.setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 0);

        return () => window.clearTimeout(timer);
    }, [isVisible]);

    return (
        <Box className={styles.editorContainer}>
            <div
                id="beepboxEditorContainer"
                ref={hostRef}
                className={styles.editorHost}
            />
        </Box>
    );
};

SongEditor.propTypes = {
    isVisible: PropTypes.bool,
    songData: PropTypes.string,
    songKey: PropTypes.object,
    songName: PropTypes.string,
    onSongChange: PropTypes.func,
    onSongMetadataChange: PropTypes.func,
    onEditorReady: PropTypes.func,
    onError: PropTypes.func
};

export default SongEditor;
