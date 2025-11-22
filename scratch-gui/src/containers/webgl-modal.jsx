import React from 'react';
import PropTypes from 'prop-types';

import WebGlModalComponent from '../components/webgl-modal/webgl-modal.jsx';

class WebGlModal extends React.Component {
    handleBack = () => {
        const hasHistory = window.history.length > 1 && document.referrer !== '';
        
        if (hasHistory) {
            window.history.back();
        } else {
            // I'm Feeling Lucky! 🎲
            const funDestinations = [
                'https://omniblocks.miraheze.org/',
                'songeditor.html',
                'credits.html',
                'faq.html',
                'patch_notes.html',
                'sample_extractor.html'
            ];
            const lucky = funDestinations[Math.floor(Math.random() * funDestinations.length)];
            window.location.href = lucky;
        }
    };
    render () {
        return (
            <WebGlModalComponent
                isRtl={this.props.isRtl}
                onBack={this.handleBack}
            />
        );
    }
}

WebGlModal.propTypes = {
    isRtl: PropTypes.bool
};

export default WebGlModal;
