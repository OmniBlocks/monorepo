import React from 'react';
import PropTypes from 'prop-types';
import PaintEditor from './paint-editor.jsx';

// PaintEditor currently can not handle dynamically changing width and height for various nontrivial reasons
// However, we can work around that by creating a new PaintEditor whenever the width or height changes,
// which does work. That's what this does.

class TWPaintEditorWrapper extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            key: 0
        };
    }
    componentWillUpdate (nextProps) {
        if (this.props.width !== nextProps.width || this.props.height !== nextProps.height) {
            this.setState({
                key: this.state.key + 1
            });
        }
    }
    render () {
        return (
            <PaintEditor
                key={this.state.key}
                {...this.props}
            />
        );
    }
}

TWPaintEditorWrapper.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number
};

export default TWPaintEditorWrapper;
