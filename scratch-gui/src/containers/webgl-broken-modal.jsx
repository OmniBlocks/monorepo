import React from 'react';
import PropTypes from 'prop-types';

import WebGlBrokenModalComponent from '../components/webgl-broken-modal/webgl-broken-modal.jsx';

class WebGlBrokenModal extends React.Component {
    handleBack = () => {
        const hasHistory = window.history.length > 1 && document.referrer !== '';
        
        if (hasHistory) {
            window.history.back();
        } else {
            // I'm Feeling Lucky! 🎲
            const funDestinations = [
                'https://omniblocks.miraheze.org/',
                'songeditor.html',
                'credits.html'
            ];
            const lucky = funDestinations[Math.floor(Math.random() * funDestinations.length)];
            window.location.href = lucky;
        }
    };
    render () {
        return (
            <WebGlBrokenModalComponent
                isRtl={this.props.isRtl}
                onBack={this.handleBack}
            />
        );
    }
}

WebGlBrokenModal.propTypes = {
    isRtl: PropTypes.bool
};

export default WebGlBrokenModal;
