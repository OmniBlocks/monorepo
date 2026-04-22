import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../lib/modes';
import Blobbiness from '../helper/blob-tools/blob';
import {changeBrushSize} from '../reducers/eraser-mode';
import {clearSelectedItems} from '../reducers/selected-items';
import EraserModeComponent from '../components/eraser-mode/eraser-mode.jsx';
import {changeMode} from '../reducers/modes';

class EraserMode extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool'
        ]);
        this.blob = new Blobbiness(
            this.props.onUpdateImage, this.props.clearSelectedItems);
    }
    componentDidMount () {
        if (this.props.isEraserModeActive) {
            this.activateTool();
        }
    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.isEraserModeActive && !this.props.isEraserModeActive) {
            this.activateTool();
        } else if (!nextProps.isEraserModeActive && this.props.isEraserModeActive) {
            this.deactivateTool();
        } else if (nextProps.isEraserModeActive && this.props.isEraserModeActive) {
<<<<<<< HEAD
            this.props.eraserModeState.brushType = this.props.brushModeState ? this.props.brushModeState.brushType : undefined;
=======
            this.props.eraserModeState.brushType = this.props.brushModeState?.brushType;
>>>>>>> 6083d544dc5ae6ac0bb8f05e0e2b5a7e8c6bf55b
            this.blob.setOptions({
                isEraser: true,
                ...nextProps.eraserModeState
            });
        }
    }
    shouldComponentUpdate (nextProps) {
        return nextProps.isEraserModeActive !== this.props.isEraserModeActive;
    }
    componentWillUnmount () {
        if (this.blob.tool) {
            this.deactivateTool();
        }
    }
    activateTool () {
<<<<<<< HEAD
        this.props.eraserModeState.brushType = this.props.brushModeState ? this.props.brushModeState.brushType : undefined;
=======
        this.props.eraserModeState.brushType = this.props.brushModeState?.brushType;
>>>>>>> 6083d544dc5ae6ac0bb8f05e0e2b5a7e8c6bf55b
        this.blob.activateTool({isEraser: true, ...this.props.eraserModeState});
    }
    deactivateTool () {
        this.blob.deactivateTool();
    }
    render () {
        return (
            <EraserModeComponent
                isSelected={this.props.isEraserModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

EraserMode.propTypes = {
    clearSelectedItems: PropTypes.func.isRequired,
    eraserModeState: PropTypes.shape({
        brushSize: PropTypes.number.isRequired,
        simplifySize: PropTypes.number,
        brushType: "CIRCLE"
    }),
    /* used to extract brush type */
    brushModeState: PropTypes.shape({
        brushSize: PropTypes.number.isRequired,
        simplifySize: PropTypes.number,
        brushType: "CIRCLE"
    }),
    handleMouseDown: PropTypes.func.isRequired,
    isEraserModeActive: PropTypes.bool.isRequired,
    onUpdateImage: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    eraserModeState: state.scratchPaint.eraserMode,
    brushModeState: state.scratchPaint.brushMode,
    isEraserModeActive: state.scratchPaint.mode === Modes.ERASER
});
const mapDispatchToProps = dispatch => ({
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    changeBrushSize: brushSize => {
        dispatch(changeBrushSize(brushSize));
    },
    handleMouseDown: () => {
        dispatch(changeMode(Modes.ERASER));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EraserMode);
