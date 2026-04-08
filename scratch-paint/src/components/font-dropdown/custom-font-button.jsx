import React from 'react';
import PropTypes from 'prop-types';
import Button from '../button/button.jsx';

class CustomFontButton extends React.Component {
    constructor (props) {
        super(props);
        this.handleMouseOver = this.handleMouseOver.bind(this);
    }
    handleMouseOver () {
        this.props.onMouseOver(this.props.font);
    }
    render () {
        return (
            <Button
                {...this.props}
                onMouseOver={this.handleMouseOver}
            >
                {this.props.children}
            </Button>
        );
    }
}

CustomFontButton.propTypes = {
    children: PropTypes.node.isRequired,
    font: PropTypes.string.isRequired,
    onMouseOver: PropTypes.func.isRequired
};

export default CustomFontButton;
