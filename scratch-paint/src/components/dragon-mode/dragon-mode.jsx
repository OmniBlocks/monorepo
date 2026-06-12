import React from 'react';
import PropTypes from 'prop-types';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';
import messages from '../../lib/messages.js';
import dragonIcon from './icon.svg';

const DragonModeComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.dragon}
        imgSrc={dragonIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

DragonModeComponent.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default DragonModeComponent;
