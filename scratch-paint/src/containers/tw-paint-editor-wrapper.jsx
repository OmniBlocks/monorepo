import React from 'react';
import PropTypes from 'prop-types';
import PaintEditor from './paint-editor.jsx';
import {connect} from 'react-redux';
import {resetZoomLevels} from '../reducers/zoom-levels.js';

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
            this.props.onResetZoomLevels();
            this.setState({
                key: this.state.key + 1
            });
        }
    }
    render () {
        const {
            /* eslint-disable no-unused-vars */
            onResetZoomLevels,
            /* eslint-enable no-unused-vars */
            ...props
        } = this.props;
        return (
            <PaintEditor
                key={this.state.key}
                {...props}
            />
        );
    }
}

TWPaintEditorWrapper.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    onResetZoomLevels: PropTypes.func
};

const mapStateToProps = () => ({});
const mapDispatchToProps = dispatch => ({
    onResetZoomLevels: () => dispatch(resetZoomLevels())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TWPaintEditorWrapper);
