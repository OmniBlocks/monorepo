import bindAll from 'lodash.bindall';
import {connect} from 'react-redux';
import paper from '@scratch/paper';
import parseColor from 'parse-color';
import PropTypes from 'prop-types';
import React from 'react';

import {changeColorIndex} from '../reducers/color-index';
import {clearSelectedItems} from '../reducers/selected-items';
import {activateEyeDropper} from '../reducers/eye-dropper';
import GradientTypes from '../lib/gradient-types';

import ColorPickerComponent from '../components/color-picker/color-picker.jsx';
import {MIXED} from '../helper/style-path';
import Modes from '../lib/modes';
import {colorToHex, makeAlphaComponent} from '../lib/tw-color-utils';

const colorStringToHsv = hexString => {
    let hsv;
    if (hexString.startsWith('#') && hexString.length === 9) {
        // parseColor does not properly parse alpha of hex colors
        hsv = parseColor(hexString).hsva;
        const alpha = parseInt(hexString.substr(hexString.length - 2), 16) / 255;
        hsv[3] = alpha;
    } else {
        hsv = parseColor(hexString).hsva;
    }
    // Hue comes out in [0, 360], limit to [0, 100]
    hsv[0] = hsv[0] / 3.6;
    // Black is parsed as {0, 0, 0}, but turn saturation up to 100
    // to make it easier to see slider values.
    if (hsv[1] === 0 && hsv[2] === 0) {
        hsv[1] = 100;
    }
    return hsv;
};

const hsvToHex = (h, s, v, a) => {
    let color = parseColor(`hsv(${3.6 * h}, ${s}, ${v})`).hex;
    if (a < 1) {
        color += makeAlphaComponent(a);
    }
    return color;
};

// Important! This component ignores new color props except when isEyeDropping
// This is to make the HSV <=> RGB conversion stable. The sliders manage their
// own changes until unmounted or color changes with props.isEyeDropping = true.
class ColorPicker extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'getHsv',
            'handleChangeGradientTypeHorizontal',
            'handleChangeGradientTypeRadial',
            'handleChangeGradientTypeSolid',
            'handleChangeGradientTypeVertical',
            'handleHueChange',
            'handleSaturationChange',
            'handleBrightnessChange',
            'handleAlphaChange',
            'handleHexColorChange',
            'handleTransparent',
            'handleActivateEyeDropper'
        ]);

        const color = props.colorIndex === 0 ? props.color : props.color2;
        const hsv = this.getHsv(color);
        this.state = {
            hue: hsv[0],
            saturation: hsv[1],
            brightness: hsv[2],
            alpha: hsv[3]
        };
    }
    componentWillReceiveProps (newProps) {
        const color = newProps.colorIndex === 0 ? this.props.color : this.props.color2;
        const newColor = newProps.colorIndex === 0 ? newProps.color : newProps.color2;
        const colorSetByEyedropper = this.props.isEyeDropping && color !== newColor;
        if (colorSetByEyedropper || this.props.colorIndex !== newProps.colorIndex) {
            const hsv = this.getHsv(newColor);
            this.setState({
                hue: hsv[0],
                saturation: hsv[1],
                brightness: hsv[2],
                alpha: hsv[3]
            });
        }
    }
    getHsv (color) {
        const isTransparent = color === null;
        const isMixed = color === MIXED;
        return isTransparent || isMixed ?
            [50, 100, 100, isTransparent ? 0 : 1] : colorStringToHsv(color);
    }
    ensureNonZeroAlpha () {
        if (this.state.alpha === 0) {
            this.setState({
                alpha: 1
            });
        }
    }
    handleHueChange (hue) {
        this.ensureNonZeroAlpha();
        this.setState({hue: hue}, () => {
            this.handleColorChange();
        });
    }
    handleSaturationChange (saturation) {
        this.ensureNonZeroAlpha();
        this.setState({saturation: saturation}, () => {
            this.handleColorChange();
        });
    }
    handleBrightnessChange (brightness) {
        this.ensureNonZeroAlpha();
        this.setState({brightness: brightness}, () => {
            this.handleColorChange();
        });
    }
    handleColorChange () {
        this.props.onChangeColor(hsvToHex(
            this.state.hue,
            this.state.saturation,
            this.state.brightness,
            this.state.alpha
        ));
    }
    handleAlphaChange (alpha) {
        this.setState({alpha: alpha / 100}, () => {
            if (this.state.alpha === 0) {
                this.handleTransparent();
            } else {
                this.handleColorChange();
            }
        });
    }
    handleHexColorChange (e) {
        let color;
        if (typeof e === 'string') {
            color = e;
        } else {
            color = e.target.value;
        }
        color = colorToHex(color);
        if (!color) {
            return;
        }
        const hsv = colorStringToHsv(color);
        this.setState({
            hue: hsv[0],
            saturation: hsv[1],
            brightness: hsv[2],
            alpha: hsv[3]
        });
        this.props.onChangeColor(color);
    }
    handleTransparent () {
        this.props.onChangeColor(null);
    }
    handleActivateEyeDropper () {
        this.props.onActivateEyeDropper(
            paper.tool, // get the currently active tool from paper
            this.props.onChangeColor
        );
    }
    handleChangeGradientTypeHorizontal () {
        this.props.onChangeGradientType(GradientTypes.HORIZONTAL);
    }
    handleChangeGradientTypeRadial () {
        this.props.onChangeGradientType(GradientTypes.RADIAL);
    }
    handleChangeGradientTypeSolid () {
        this.props.onChangeGradientType(GradientTypes.SOLID);
    }
    handleChangeGradientTypeVertical () {
        this.props.onChangeGradientType(GradientTypes.VERTICAL);
    }
    render () {
        return (
            <ColorPickerComponent
                brightness={this.state.brightness}
                color={this.props.color}
                color2={this.props.color2}
                colorIndex={this.props.colorIndex}
                gradientType={this.props.gradientType}
                hue={this.state.hue}
                isEyeDropping={this.props.isEyeDropping}
                mode={this.props.mode}
                rtl={this.props.rtl}
                saturation={this.state.saturation}
                alpha={this.state.alpha * 100}
                onAlphaChange={this.handleAlphaChange}
                hexColor={colorToHex(this.props.colorIndex === 0 ? this.props.color : this.props.color2)}
                onHexColorChange={this.handleHexColorChange}
                shouldShowGradientTools={this.props.shouldShowGradientTools}
                onActivateEyeDropper={this.handleActivateEyeDropper}
                onBrightnessChange={this.handleBrightnessChange}
                onChangeGradientTypeHorizontal={this.handleChangeGradientTypeHorizontal}
                onChangeGradientTypeRadial={this.handleChangeGradientTypeRadial}
                onChangeGradientTypeSolid={this.handleChangeGradientTypeSolid}
                onChangeGradientTypeVertical={this.handleChangeGradientTypeVertical}
                onHueChange={this.handleHueChange}
                onSaturationChange={this.handleSaturationChange}
                onSelectColor={this.props.onSelectColor}
                onSelectColor2={this.props.onSelectColor2}
                onSwap={this.props.onSwap}
                onTransparent={this.handleTransparent}
            />
        );
    }
}

ColorPicker.propTypes = {
    color: PropTypes.string,
    color2: PropTypes.string,
    colorIndex: PropTypes.number.isRequired,
    gradientType: PropTypes.oneOf(Object.keys(GradientTypes)).isRequired,
    isEyeDropping: PropTypes.bool.isRequired,
    mode: PropTypes.oneOf(Object.keys(Modes)),
    onActivateEyeDropper: PropTypes.func.isRequired,
    onChangeColor: PropTypes.func.isRequired,
    onChangeGradientType: PropTypes.func,
    onSelectColor: PropTypes.func.isRequired,
    onSelectColor2: PropTypes.func.isRequired,
    onSwap: PropTypes.func,
    rtl: PropTypes.bool.isRequired,
    shouldShowGradientTools: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
    colorIndex: state.scratchPaint.fillMode.colorIndex,
    isEyeDropping: state.scratchPaint.color.eyeDropper.active,
    mode: state.scratchPaint.mode,
    rtl: state.scratchPaint.layout.rtl
});

const mapDispatchToProps = dispatch => ({
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    onActivateEyeDropper: (currentTool, callback) => {
        dispatch(activateEyeDropper(currentTool, callback));
    },
    onSelectColor: () => {
        dispatch(changeColorIndex(0));
    },
    onSelectColor2: () => {
        dispatch(changeColorIndex(1));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ColorPicker);
