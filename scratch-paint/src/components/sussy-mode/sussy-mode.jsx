import React from 'react';
import PropTypes from 'prop-types';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';
import messages from '../../lib/messages.js';
import sussyIcon from './sussy.svg';

const SussyModeComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.sussy}
        imgSrc={sussyIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

SussyModeComponent.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default SussyModeComponent;
