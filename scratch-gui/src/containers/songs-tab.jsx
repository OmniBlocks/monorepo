import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import {defineMessages, intlShape, injectIntl} from 'react-intl';
import VM from 'scratch-vm';

import {connect} from 'react-redux';

import AssetPanel from '../components/asset-panel/asset-panel.jsx';
import songIcon from '../components/gui/icon--songs.svg';
import addSongFromLibraryIcon from '../components/asset-panel/icon--add-song-lib.svg';
import fileUploadIcon from '../components/action-menu/icon--file-upload.svg';
import {SONGS_TAB_INDEX} from '../reducers/editor-tab';
import {setRestore} from '../reducers/restore-deletion';
import {showStandardAlert, closeAlertWithId} from '../reducers/alerts';

import SongEditor from '../components/song-editor/song-editor.jsx';

import {handleFileUpload, songUpload} from '../lib/file-uploader.js';
import {TextEncoder} from '../lib/tw-text-encoder.js';
import DragConstants from '../lib/drag-constants';
import downloadBlob from '../lib/download-blob';
import log from '../lib/log';

class SongsTab extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleSelectSong',
            'handleDeleteSong',
            'handleDuplicateSong',
            'handleExportSong',
            'handleNewSong',
            'handleFileUploadClick',
            'handleSongUpload',
            'handleSongUploadError',
            'handleEditorSongChange',
            'handleEditorSongMetadataChange',
            'handleEditorReady',
            'handleDrop',
            'setFileInput'
        ]);
        this.state = {
            selectedSongIndex: 0,
            selectedSongDuration: null
        };
        this.songEditor = null;
    }

    componentWillReceiveProps (nextProps) {
        const {editingTarget, sprites, stage} = nextProps;
        const target = editingTarget && sprites[editingTarget] ? sprites[editingTarget] : stage;
        if (!target || !target.songs) return;

        if (this.props.editingTarget !== editingTarget) {
            this.setState({
                selectedSongIndex: 0,
                selectedSongDuration: null
            });
        } else if (this.state.selectedSongIndex > target.songs.length - 1) {
            this.setState({
                selectedSongIndex: Math.max(target.songs.length - 1, 0),
                selectedSongDuration: null
            });
        }
    }

    handleSelectSong (index) {
        this.setState({
            selectedSongIndex: index,
            selectedSongDuration: null
        });
    }

    handleDeleteSong (index) {
        const restoreFun = this.props.vm.deleteSong(index);
        if (!restoreFun) return;

        if (index <= this.state.selectedSongIndex) {
            this.setState({selectedSongIndex: Math.max(0, this.state.selectedSongIndex - 1)});
        }
        this.props.dispatchUpdateRestore({restoreFun, deletedItem: 'Song'});
    }

    handleDuplicateSong (index) {
        this.props.vm.duplicateSong(index).then(() => {
            this.setState({selectedSongIndex: index + 1});
        })
            .catch(this.handleSongUploadError);
    }

    handleExportSong (index) {
        const song = this.props.vm.editingTarget.sprite.songs[index];
        if (!song || !song.asset) return;
        const blob = new Blob([song.asset.data], {type: song.asset.assetType.contentType});
        downloadBlob(`${song.name}.json`, blob);
    }

    handleNewSong () {
        const addSong = songData => {
            const data = new TextEncoder().encode(JSON.stringify(songData));
            const storage = this.props.vm.runtime.storage;
            const targetId = this.props.vm.editingTarget.id;
            songUpload(data.buffer, storage, song => {
                song.name = 'Song';
                this.props.vm.addSong(song, targetId).then(() => {
                    const songs = this.props.vm.editingTarget.sprite.songs;
                    this.setState({selectedSongIndex: songs.length - 1});
                })
                    .catch(this.handleSongUploadError);
            }, this.handleSongUploadError);
        };

        if (this.songEditor) {
            addSong(this.songEditor.getNewSongData());
            return;
        }

        import('song-editor').then(module => {
            const Song = module.Song || (module.default && module.default.Song);
            if (!Song) {
                throw new Error('The song editor does not expose its Song model.');
            }
            addSong(new Song().toJsonObject(true, 1, true));
        }).catch(this.handleSongUploadError);
    }

    handleFileUploadClick () {
        if (this.fileInput) this.fileInput.click();
    }

    handleSongUpload (event) {
        const storage = this.props.vm.runtime.storage;
        const targetId = this.props.vm.editingTarget.id;
        this.props.onShowImporting();

        handleFileUpload(event.target, (buffer, fileType, fileName, fileIndex, fileCount) => {
            songUpload(buffer, storage, song => {
                song.name = fileName;
                this.props.vm.addSong(song, targetId).then(() => {
                    const target = this.props.vm.runtime.getTargetById(targetId);
                    if (target) {
                        this.setState({selectedSongIndex: target.getSongs().length - 1});
                    }
                    if (fileIndex === fileCount - 1) this.props.onCloseImporting();
                })
                    .catch(this.handleSongUploadError);
            }, this.handleSongUploadError);
        }, this.handleSongUploadError);
    }

    handleSongUploadError (error) {
        log.error('Failed to load song:', error);
        this.props.onCloseImporting();
        this.props.onShowSongError();
    }

    handleEditorSongChange (songData) {
        const target = this.props.vm.editingTarget;
        if (!target || !target.getSongs()[this.state.selectedSongIndex]) return;

        this.props.vm.updateSong(this.state.selectedSongIndex, songData)
            .catch(this.handleSongUploadError);
    }

    handleEditorSongMetadataChange (songName, songDuration) {
        const target = this.props.vm.editingTarget;
        const song = target && target.getSongs()[this.state.selectedSongIndex];
        if (!song) return;

        if (song.name !== songName) {
            this.props.vm.renameSong(this.state.selectedSongIndex, songName);
        }
        if (this.state.selectedSongDuration !== songDuration) {
            this.setState({selectedSongDuration: songDuration});
        }
    }

    handleEditorReady (editor) {
        this.songEditor = editor;
    }

    handleDrop (dropInfo) {
        if (dropInfo.dragType !== DragConstants.SONG || !this.props.vm.editingTarget) return;
        const target = this.props.vm.editingTarget;
        const songs = target.sprite.songs;
        const selectedSong = songs[this.state.selectedSongIndex];
        if (!this.props.vm.reorderSong(target.id, dropInfo.index, dropInfo.newIndex)) return;
        this.setState({selectedSongIndex: songs.indexOf(selectedSong)});
    }

    setFileInput (input) {
        this.fileInput = input;
    }

    render () {
        const {intl, isRtl, vm, isVisible} = this.props;
        if (!vm.editingTarget) return null;

        const songs = vm.editingTarget.sprite.songs || [];
        const selectedSong = songs[this.state.selectedSongIndex];
        const songData = selectedSong && selectedSong.asset ? selectedSong.asset.decodeText() : null;
        const messages = defineMessages({
            newSong: {
                defaultMessage: 'New Song',
                description: 'Button to create a song in the songs tab',
                id: 'gui.songsTab.newSong'
            },
            uploadSong: {
                defaultMessage: 'Upload Song',
                description: 'Button to upload a song file in the songs tab',
                id: 'gui.songsTab.uploadSong'
            }
        });

        return (
            <div
                className="songs-tab-container"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: '1 1 0',
                    minWidth: 0,
                    minHeight: 0
                }}
            >
                <AssetPanel
                    buttons={[{
                        title: intl.formatMessage(messages.newSong),
                        img: addSongFromLibraryIcon,
                        onClick: this.handleNewSong
                    }, {
                        title: intl.formatMessage(messages.uploadSong),
                        img: fileUploadIcon,
                        onClick: this.handleFileUploadClick,
                        fileAccept: '.json',
                        fileChange: this.handleSongUpload,
                        fileInput: this.setFileInput,
                        fileMultiple: true
                    }]}
                    dragType={DragConstants.SONG}
                    isRtl={isRtl}
                    items={songs.map(song => ({
                        url: songIcon,
                        name: song.name,
                        details: song === selectedSong ? this.state.selectedSongDuration : null,
                        dragPayload: song
                    }))}
                    selectedItemIndex={this.state.selectedSongIndex}
                    onDeleteClick={this.handleDeleteSong}
                    onDrop={this.handleDrop}
                    onDuplicateClick={this.handleDuplicateSong}
                    onExportClick={this.handleExportSong}
                    onItemClick={this.handleSelectSong}
                >
                    {selectedSong && selectedSong.asset ? (
                        <SongEditor
                            isVisible={isVisible}
                            songData={songData}
                            songKey={selectedSong.md5}
                            onEditorReady={this.handleEditorReady}
                            onSongChange={this.handleEditorSongChange}
                            onSongMetadataChange={this.handleEditorSongMetadataChange}
                            onError={this.handleSongUploadError}
                        />
                    ) : null}
                </AssetPanel>
            </div>
        );
    }
}

SongsTab.propTypes = {
    dispatchUpdateRestore: PropTypes.func.isRequired,
    editingTarget: PropTypes.string,
    intl: intlShape.isRequired,
    isRtl: PropTypes.bool,
    isVisible: PropTypes.bool,
    onCloseImporting: PropTypes.func.isRequired,
    onShowImporting: PropTypes.func.isRequired,
    onShowSongError: PropTypes.func.isRequired,
    sprites: PropTypes.object,
    stage: PropTypes.object,
    vm: PropTypes.instanceOf(VM).isRequired
};

const mapStateToProps = state => ({
    editingTarget: state.scratchGui.targets.editingTarget,
    isRtl: state.locales.isRtl,
    isVisible: state.scratchGui.editorTab.activeTabIndex === SONGS_TAB_INDEX,
    sprites: state.scratchGui.targets.sprites,
    stage: state.scratchGui.targets.stage
});

const mapDispatchToProps = dispatch => ({
    dispatchUpdateRestore: restoreState => dispatch(setRestore(restoreState)),
    onCloseImporting: () => dispatch(closeAlertWithId('importingAsset')),
    onShowImporting: () => dispatch(showStandardAlert('importingAsset')),
    onShowSongError: () => dispatch(showStandardAlert('creatingError'))
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(SongsTab));
