import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';

import Box from '../box/box.jsx';

import {LOUPE_RADIUS, ZOOM_SCALE} from '../../helper/tools/eye-dropper';

import styles from './loupe.css';

class LoupeComponent extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'setCanvas'
        ]);
    }
    componentDidUpdate () {
        this.draw();
    }
    draw () {
        const boxSize = 5;
        const boxLineWidth = 1;
        const colorRingWidth = 15;
        const loupeRadius = ZOOM_SCALE * LOUPE_RADIUS;
        const loupeDiameter = loupeRadius * 2;

        const color = this.props.colorInfo.color;

        const ctx = this.canvas.getContext('2d');
        this.canvas.width = loupeDiameter;
        this.canvas.height = loupeDiameter;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, loupeDiameter, loupeDiameter);

        ctx.drawImage(
            this.props.colorInfo.data.image,
            this.props.colorInfo.data.x,
            this.props.colorInfo.data.y,
            this.props.colorInfo.data.width,
            this.props.colorInfo.data.height,
            0,
            0,
            loupeDiameter,
            loupeDiameter
        );

        // Draw an outlined square at the cursor position (cursor is hidden)
        ctx.lineWidth = boxLineWidth;
        ctx.strokeStyle = this.props.theme === 'light' ? 'black' : '#888';
        ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] / 255})`;
        ctx.beginPath();
        ctx.rect(loupeRadius - (boxSize / 2), loupeRadius - (boxSize / 2), boxSize, boxSize);
        ctx.fill();
        ctx.stroke();

        // Draw a thick ring around the loupe showing the current color
        ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] / 255})`;
        ctx.lineWidth = colorRingWidth;
        ctx.beginPath();
        ctx.moveTo(loupeDiameter, loupeDiameter);
        ctx.arc(loupeRadius, loupeRadius, loupeRadius, 0, 2 * Math.PI);
        ctx.stroke();
    }
    setCanvas (element) {
        this.canvas = element;
        // Make sure to draw a frame when this component is first mounted
        // Check for null ref because refs are called with null when unmounted
        if (this.canvas) {
            this.draw();
        }
    }
    render () {
        const {
            colorInfo,
            pixelRatio,
            ...boxProps
        } = this.props;
        const loupeDiameter = ZOOM_SCALE * LOUPE_RADIUS * 2;
        const x = (colorInfo.x / pixelRatio) - (loupeDiameter / 2);
        const y = (colorInfo.y / pixelRatio) - (loupeDiameter / 2);
        return (
            <Box
                {...boxProps}
                className={styles.eyeDropper}
                componentRef={this.setCanvas}
                element="canvas"
                height={LOUPE_RADIUS * 2}
                style={{
                    transform: `translate(${x}px, ${y}px)`,
                    width: loupeDiameter,
                    height: loupeDiameter
                }}
                width={LOUPE_RADIUS * 2}
            />
        );
    }
}

LoupeComponent.propTypes = {
    colorInfo: PropTypes.shape({
        color: PropTypes.instanceOf(Uint8ClampedArray), // this is the [r,g,b,a] array
        x: PropTypes.number,
        y: PropTypes.number,
        data: PropTypes.shape({
            image: PropTypes.instanceOf(HTMLCanvasElement),
            x: PropTypes.number,
            y: PropTypes.number,
            width: PropTypes.number,
            height: PropTypes.number
        })
    }),
    pixelRatio: PropTypes.number.isRequired,
    theme: PropTypes.string.isRequired
};

export default LoupeComponent;
