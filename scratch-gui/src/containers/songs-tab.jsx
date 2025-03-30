import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import {defineMessages, intlShape, injectIntl} from 'react-intl';
import VM from 'scratch-vm';

import {connect} from 'react-redux';

import {activateTab, SONGS_TAB_INDEX} from '../reducers/editor-tab';
import {setRestore} from '../reducers/restore-deletion';
import {showStandardAlert, closeAlertWithId} from '../reducers/alerts';

import SongEditor from './song-editor.jsx';

class SongsTab extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleCloseSongEditor',
            'onActivateSongsTab'
        ]);
        this.state = {
            isSongEditorOpen: true // Automatically open the song editor
        };
    }

    handleCloseSongEditor () {
        this.setState({isSongEditorOpen: false});
    }

    onActivateSongsTab() {
        this.props.onActivateSongsTab();
    }

    render () {
        const {
            intl,
            vm
        } = this.props;

        if (!vm.editingTarget) {
            return null;
        }

        return (
            <div>
                <SongEditor onClose={this.handleCloseSongEditor} />
            </div>
        );
    }
}

SongsTab.propTypes = {
    intl: intlShape.isRequired,
    vm: PropTypes.instanceOf(VM).isRequired,
    onActivateSongsTab: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    vm: state.scratchGui.vm
});

const mapDispatchToProps = dispatch => ({
    onActivateSongsTab: () => dispatch(activateTab(SONGS_TAB_INDEX))
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(SongsTab));

