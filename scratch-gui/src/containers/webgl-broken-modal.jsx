import React from 'react';
import PropTypes from 'prop-types';

import WebGlBrokenModalComponent from '../components/webgl-broken-modal/webgl-broken-modal.jsx';

class WebGlBrokenModal extends React.Component {
    handleCancel () {
        window.history.back();
    }
    render () {
        return (
            <WebGlBrokenModalComponent
                isRtl={this.props.isRtl}
                onBack={this.handleCancel}
            />
        );
    }
}

WebGlBrokenModal.propTypes = {
    isRtl: PropTypes.bool
};

export default WebGlBrokenModal;