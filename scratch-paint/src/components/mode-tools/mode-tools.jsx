import classNames from 'classnames';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import Dropdown from '../dropdown/dropdown.jsx';
import MediaQuery from 'react-responsive';
import layout from '../../lib/layout-constants';

import {changeBrushSize} from '../../reducers/brush-mode';
import {changeBrushSize as changeEraserSize} from '../../reducers/eraser-mode';
import {changeRoundedCornerSize} from '../../reducers/rounded-rect-mode';
import {changeTrianglePolyCount} from '../../reducers/triangle-mode';
import {changeCurrentlySelectedShape} from '../../reducers/sussy-mode';
import {changeBitBrushSize} from '../../reducers/bit-brush-size';
import {changeBitEraserSize} from '../../reducers/bit-eraser-size';
import {setShapesFilled} from '../../reducers/fill-bitmap-shapes';

import FontDropdown from '../../containers/font-dropdown.jsx';
import LiveInputHOC from '../forms/live-input-hoc.jsx';
import Label from '../forms/label.jsx';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import Input from '../forms/input.jsx';
import InputGroup from '../input-group/input-group.jsx';
import LabeledIconButton from '../labeled-icon-button/labeled-icon-button.jsx';
import Modes from '../../lib/modes';
import Formats, {isBitmap, isVector} from '../../lib/format';
import {hideLabel} from '../../lib/hide-label';
import styles from './mode-tools.css';

import copyIcon from './icons/copy.svg';
import cutIcon from './icons/cut.svg';
import pasteIcon from './icons/paste.svg';
import deleteIcon from './icons/delete.svg';

import shapeMergeIcon from './icons/merge.svg';
import shapeMaskIcon from './icons/mask.svg';
import shapeSubtractIcon from './icons/subtract.svg';
import shapeFilterIcon from './icons/filter.svg';

import alignLeftIcon from './icons/alignLeft.svg';
import alignRightIcon from './icons/alignRight.svg';
import alignCenterIcon from './icons/alignCenter.svg';

import bitBrushIcon from '../bit-brush-mode/brush.svg';
import bitEraserIcon from '../bit-eraser-mode/eraser.svg';
import bitLineIcon from '../bit-line-mode/line.svg';
import brushIcon from '../brush-mode/brush.svg';
import curvedPointIcon from './icons/curved-point.svg';
import eraserIcon from '../eraser-mode/eraser.svg';
import roundedRectIcon from '../rounded-rect-mode/rounded-rectangle.svg';
import triangleIcon from '../triangle-mode/triangle.svg';
import flipHorizontalIcon from './icons/flip-horizontal.svg';
import flipVerticalIcon from './icons/flip-vertical.svg';
import centerSelectionIcon from './icons/centerSelection.svg';
import straightPointIcon from './icons/straight-point.svg';
import bitOvalIcon from '../bit-oval-mode/oval.svg';
import bitRectIcon from '../bit-rect-mode/rectangle.svg';
import bitOvalOutlinedIcon from '../bit-oval-mode/oval-outlined.svg';
import bitRectOutlinedIcon from '../bit-rect-mode/rectangle-outlined.svg';

import {MAX_STROKE_WIDTH} from '../../reducers/stroke-width';

import selectableShapes from '../../helper/selectable-shapes.js';

const LiveInput = LiveInputHOC(Input);
const ModeToolsComponent = props => {
    const messages = defineMessages({
        brushSize: {
            defaultMessage: 'Size',
            description: 'Label for the brush size input',
            id: 'paint.modeTools.brushSize'
        },
        eraserSize: {
            defaultMessage: 'Eraser size',
            description: 'Label for the eraser size input',
            id: 'paint.modeTools.eraserSize'
        },
        roundedCornerSize: {
            defaultMessage: 'Rounded corner size',
            description: 'Label for the Rounded corner size input',
            id: 'paint.modeTools.roundedCornerSize'
        },
        currentSideCount: {
            defaultMessage: 'Polygon side count',
            description: 'Label for the Polygon side count input',
            id: 'paint.modeTools.currentSideCount'
        },
        copy: {
            defaultMessage: 'Copy',
            description: 'Label for the copy button',
            id: 'paint.modeTools.copy'
        },
        cut: {
            defaultMessage: 'Cut',
            description: 'Label for the cut button',
            id: 'paint.modeTools.cut'
        },
        paste: {
            defaultMessage: 'Paste',
            description: 'Label for the paste button',
            id: 'paint.modeTools.paste'
        },
        delete: {
            defaultMessage: 'Delete',
            description: 'Label for the delete button',
            id: 'paint.modeTools.delete'
        },
        curved: {
            defaultMessage: 'Curved',
            description: 'Label for the button that converts selected points to curves',
            id: 'paint.modeTools.curved'
        },
        pointed: {
            defaultMessage: 'Pointed',
            description: 'Label for the button that converts selected points to sharp points',
            id: 'paint.modeTools.pointed'
        },
        thickness: {
            defaultMessage: 'Thickness',
            description: 'Label for the number input to choose the line thickness',
            id: 'paint.modeTools.thickness'
        },
        flipHorizontal: {
            defaultMessage: 'Flip Horizontal',
            description: 'Label for the button to flip the image horizontally',
            id: 'paint.modeTools.flipHorizontal'
        },
        flipVertical: {
            defaultMessage: 'Flip Vertical',
            description: 'Label for the button to flip the image vertically',
            id: 'paint.modeTools.flipVertical'
        },
        filled: {
            defaultMessage: 'Filled',
            description: 'Label for the button that sets the bitmap rectangle/oval mode to draw outlines',
            id: 'paint.modeTools.filled'
        },
        outlined: {
            defaultMessage: 'Outlined',
            description: 'Label for the button that sets the bitmap rectangle/oval mode to draw filled-in shapes',
            id: 'paint.modeTools.outlined'
        },
        movementCenter: {
            defaultMessage: 'Center',
            description: 'Label for the button that moves the selected objects to the center of the canvas',
            id: 'paint.modeTools.movementCenter'
        }
    });

    switch (props.mode) {
        case Modes.BRUSH:
            /* falls through */
        case Modes.BIT_BRUSH:
            /* falls through */
        case Modes.BIT_LINE:
        {
            const currentIcon = isVector(props.format) ? brushIcon :
                props.mode === Modes.BIT_LINE ? bitLineIcon : bitBrushIcon;
            const currentBrushValue = isBitmap(props.format) ? props.bitBrushSize : props.brushValue;
            const changeFunction = isBitmap(props.format) ? props.onBitBrushSliderChange : props.onBrushSliderChange;
            const currentMessage = props.mode === Modes.BIT_LINE ? messages.thickness : messages.brushSize;
            return (
                <div className={classNames(props.className, styles.modeTools)}>
                    <div>
                        <img
                            alt={props.intl.formatMessage(currentMessage)}
                            className={styles.modeToolsIcon}
                            draggable={false}
                            src={currentIcon}
                        />
                    </div>
                    <LiveInput
                        range
                        small
                        max={MAX_STROKE_WIDTH}
                        min="1"
                        type="number"
                        value={currentBrushValue}
                        onSubmit={changeFunction}
                    />
                </div>
            );
        }
        case Modes.BIT_ERASER:
            /* falls through */
        case Modes.ERASER:
        {
            const currentIcon = isVector(props.format) ? eraserIcon : bitEraserIcon;
            const currentEraserValue = isBitmap(props.format) ? props.bitEraserSize : props.eraserValue;
            const changeFunction = isBitmap(props.format) ? props.onBitEraserSliderChange : props.onEraserSliderChange;
            return (
                <div className={classNames(props.className, styles.modeTools)}>
                    <div>
                        <img
                            alt={props.intl.formatMessage(messages.eraserSize)}
                            className={styles.modeToolsIcon}
                            draggable={false}
                            src={currentIcon}
                        />
                    </div>
                    <LiveInput
                        range
                        small
                        max={MAX_STROKE_WIDTH}
                        min="1"
                        type="number"
                        value={currentEraserValue}
                        onSubmit={changeFunction}
                    />
                </div>
            );
        }
        case Modes.ROUNDED_RECT:
        {
            const currentIcon = roundedRectIcon;
            const currentCornerValue = props.roundedCornerValue;
            const changeFunction = props.onRoundedCornerSliderChange;
            return (
                <div className={classNames(props.className, styles.modeTools)}>
                    <div>
                        <img
                            alt={props.intl.formatMessage(messages.roundedCornerSize)}
                            className={styles.modeToolsIcon}
                            draggable={false}
                            src={currentIcon}
                        />
                    </div>
                    <LiveInput
                        range
                        small
                        max={1000}
                        min="1"
                        type="number"
                        value={currentCornerValue}
                        onSubmit={changeFunction}
                    />
                </div>
            );
        }
        case Modes.TRIANGLE:
        {
            const currentIcon = triangleIcon;
            const currentSideValue = props.trianglePolyValue;
            const changeFunction = props.onPolyCountSliderChange;
            return (
                <div className={classNames(props.className, styles.modeTools)}>
                    <div>
                        <img
                            alt={props.intl.formatMessage(messages.currentSideCount)}
                            className={styles.modeToolsIcon}
                            draggable={false}
                            src={currentIcon}
                        />
                    </div>
                    <LiveInput
                        range
                        small
                        max={1000}
                        min="3"
                        type="number"
                        value={currentSideValue}
                        onSubmit={changeFunction}
                    />
                </div>
            );
        }
        case Modes.SUSSY:
        {
            const currentlySelectedShape = props.currentlySelectedShape;
            const changeFunction = props.onCurrentlySelectedShapeChange;
            const selectedShapeObject = selectableShapes
                .filter(shape => shape.id === currentlySelectedShape)[0];
            const generateShapeSVG = (shapeObject) => {
                const strokeColor = "#575e75";
                const icon = shapeObject.icon;
                // extract viewbox
                const viewBoxStart = icon.substring(icon.indexOf('viewBox="') + 9);
                const viewBoxString = viewBoxStart
                    .substring(0, viewBoxStart.indexOf('"'));
                // extract fill color
                const fillColorStart = icon.substring(icon.indexOf('fill="') + 6);
                const fillColorString = fillColorStart
                    .substring(0, fillColorStart.indexOf('"'));
                // extract stroke width
                const strokeWidthStart = icon.substring(icon.indexOf('stroke-width="') + 14);
                const strokeWidthString = strokeWidthStart
                    .substring(0, strokeWidthStart.indexOf('"'));
                // extract viewbox to array
                const viewBox = viewBoxString
                    .replace(/ /gmi, ',')
                    .split(',')
                    .map(value => value.trim())
                    .map(num => Number(num));
                const newViewBox = [
                    viewBox[0] - 1.5,
                    viewBox[1] - 1.5,
                    viewBox[2] + (1.5 * 2),
                    viewBox[3] + (1.5 * 2)
                ].join(',');
                const newIcon = icon
                    .replace(`viewBox="${viewBoxString}"`, `viewBox="${newViewBox}"`)
                    .replace('stroke="none"', `stroke="${strokeColor}"`)
                    .replace(`fill="${fillColorString}"`, 'fill="none"')
                    .replace(`stroke-width="${strokeWidthString}"`, `stroke-width="${shapeObject.strokeWidth}"`);
                return `${newIcon}`
            };
            const selectableShapesList = (
                <InputGroup className={classNames(
                    styles.modDashedBorder,
                    // styles.modLabeledIconHeight,
                    styles.dropdownMaxItemList
                )}>
                    {selectableShapes.map(shape => {
                        return (<LabeledIconButton
                            hideLabel={hideLabel(props.intl.locale)}
                            imgSrc={`data:image/svg+xml,${encodeURIComponent(generateShapeSVG(shape))}`}
                            title={shape.name}
                            onClick={() => changeFunction(shape.id)}
                        />)
                    })}
                </InputGroup>
            )
            return (
                <div className={classNames(props.className, styles.modeTools)}>
                    <Dropdown
                        className={styles.modUnselect}
                        enterExitTransitionDurationMs={20}
                        popoverContent={
                            <InputGroup
                                className={styles.modContextMenu}
                                rtl={props.rtl}
                            >
                                {selectableShapesList}
                            </InputGroup>
                        }
                        tipSize={.01}
                    >
                        <img
                            src={`data:image/svg+xml,${encodeURIComponent(generateShapeSVG(selectedShapeObject))}`}
                            alt={selectedShapeObject.name}
                            title={selectedShapeObject.name}
                            height={16}
                        />
                    </Dropdown>
                </div>
            );
        }
        case Modes.RESHAPE:
            return (
                <div className={classNames(props.className, styles.modeTools)}>
                    <InputGroup className={classNames(styles.modDashedBorder, styles.modLabeledIconHeight)}>
                        <LabeledIconButton
                            disabled={!props.hasSelectedUncurvedPoints}
                            hideLabel={hideLabel(props.intl.locale)}
                            imgSrc={curvedPointIcon}
                            title={props.intl.formatMessage(messages.curved)}
                            onClick={props.onCurvePoints}
                        />
                        <LabeledIconButton
                            disabled={!props.hasSelectedUnpointedPoints}
                            hideLabel={hideLabel(props.intl.locale)}
                            imgSrc={straightPointIcon}
                            title={props.intl.formatMessage(messages.pointed)}
                            onClick={props.onPointPoints}
                        />
                    </InputGroup>
                    <InputGroup className={classNames(styles.modLabeledIconHeight)}>
                        <LabeledIconButton
                            hideLabel={hideLabel(props.intl.locale)}
                            imgSrc={deleteIcon}
                            title={props.intl.formatMessage(messages.delete)}
                            onClick={props.onDelete}
                        />
                    </InputGroup>
                </div>
            );
        case Modes.BIT_SELECT:
            /* falls through */
        case Modes.SELECT:
            const reshapingMethods = (
                <InputGroup className={classNames(styles.modDashedBorder, styles.modLabeledIconHeight)}>
                    <LabeledIconButton
                        hideLabel={hideLabel(props.intl.locale)}
                        imgSrc={shapeMergeIcon}
                        title={"Merge"}
                        onClick={props.onMergeShape}
                    />
                    <LabeledIconButton
                        hideLabel={hideLabel(props.intl.locale)}
                        imgSrc={shapeMaskIcon}
                        title={"Mask"}
                        onClick={props.onMaskShape}
                    />
                    <LabeledIconButton
                        hideLabel={hideLabel(props.intl.locale)}
                        imgSrc={shapeSubtractIcon}
                        title={"Subtract"}
                        onClick={props.onSubtractShape}
                    />
                    <LabeledIconButton
                        hideLabel={hideLabel(props.intl.locale)}
                        imgSrc={shapeFilterIcon}
                        title={"Filter"}
                        onClick={props.onExcludeShape}
                    />
                </InputGroup>
            )
            const flipOptions = (
                <InputGroup className={classNames(styles.modDashedBorder, styles.modLabeledIconHeight)}>
                    <LabeledIconButton
                        hideLabel={props.intl.locale !== 'en'}
                        imgSrc={flipHorizontalIcon}
                        title={props.intl.formatMessage(messages.flipHorizontal)}
                        onClick={props.onFlipHorizontal}
                    />
                    <LabeledIconButton
                        hideLabel={props.intl.locale !== 'en'}
                        imgSrc={flipVerticalIcon}
                        title={props.intl.formatMessage(messages.flipVertical)}
                        onClick={props.onFlipVertical}
                    />
                </InputGroup>
            )
            const movementOptions = (
                <InputGroup className={classNames(styles.modDashedBorder, styles.modLabeledIconHeight)}>
                    <LabeledIconButton
                        hideLabel={props.intl.locale !== 'en'}
                        imgSrc={centerSelectionIcon}
                        title={props.intl.formatMessage(messages.movementCenter)}
                        onClick={props.onCenterSelection}
                    />
                </InputGroup>
            )
            return (
                <div className={classNames(props.className, styles.modeTools)}>
                    <InputGroup className={classNames(styles.modDashedBorder, styles.modLabeledIconHeight)}>
                        <LabeledIconButton
                            hideLabel={hideLabel(props.intl.locale)}
                            imgSrc={copyIcon}
                            title={props.intl.formatMessage(messages.copy)}
                            onClick={props.onCopyToClipboard}
                        />
                        <LabeledIconButton
                            disabled={!(props.clipboardItems.length > 0)}
                            hideLabel={hideLabel(props.intl.locale)}
                            imgSrc={pasteIcon}
                            title={props.intl.formatMessage(messages.paste)}
                            onClick={props.onPasteFromClipboard}
                        />
                        <LabeledIconButton
                            hideLabel={hideLabel(props.intl.locale)}
                            imgSrc={cutIcon}
                            title={props.intl.formatMessage(messages.cut)}
                            onClick={props.onCutToClipboard}
                        />
                    </InputGroup>
                    <InputGroup className={classNames(styles.modDashedBorder, styles.modLabeledIconHeight)}>
                        <LabeledIconButton
                            hideLabel={hideLabel(props.intl.locale)}
                            imgSrc={deleteIcon}
                            title={props.intl.formatMessage(messages.delete)}
                            onClick={props.onDelete}
                        />
                    </InputGroup>
                    <MediaQuery minWidth={layout.fullSizeEditorMinWidthExtraToolsCollapsed}>
                        {/* Flip Options */}
                        {flipOptions}
                        {/* Movement Options */}
                        {movementOptions}
                        {/* Reshaping Methods */}
                        {(props.mode === Modes.SELECT) ? (
                            <MediaQuery minWidth={layout.fullSizeEditorMinWidthExtraTools}>
                                {reshapingMethods}
                            </MediaQuery>
                        ) : null}
                        {(props.mode === Modes.SELECT) ? (
                            <MediaQuery maxWidth={layout.fullSizeEditorMinWidthExtraTools - 1}>
                                <InputGroup className={classNames(styles.modDashedBorder, styles.modLabeledIconHeight)}>
                                    <Dropdown
                                        className={styles.modUnselect}
                                        enterExitTransitionDurationMs={20}
                                        popoverContent={
                                            <InputGroup
                                                className={styles.modContextMenu}
                                                rtl={props.rtl}
                                            >
                                                {reshapingMethods}
                                            </InputGroup>
                                        }
                                        tipSize={.01}
                                    >
                                        More
                                    </Dropdown>
                                </InputGroup>
                            </MediaQuery>
                        ) : null}
                    </MediaQuery>
                    <MediaQuery maxWidth={layout.fullSizeEditorMinWidthExtraToolsCollapsed - 1}>
                        <InputGroup className={classNames(styles.modDashedBorder, styles.modLabeledIconHeight)}>
                            <Dropdown
                                className={styles.modUnselect}
                                enterExitTransitionDurationMs={20}
                                popoverContent={
                                    <InputGroup
                                        className={styles.modContextMenu}
                                        rtl={props.rtl}
                                    >
                                        {flipOptions}
                                        {movementOptions}
                                        {reshapingMethods}
                                    </InputGroup>
                                }
                                tipSize={.01}
                            >
                                More
                            </Dropdown>
                        </InputGroup>
                    </MediaQuery>
                </div>
            );
        case Modes.BIT_TEXT:
            /* falls through */
        case Modes.TEXT:
            return (
                <div className={classNames(props.className, styles.modeTools)}>
                    <InputGroup className={classNames(styles.modDashedBorder)}>
                        <FontDropdown
                            onUpdateImage={props.onUpdateImage}
                            onManageFonts={props.onManageFonts}
                        />
                    </InputGroup>
                    <InputGroup className={classNames(styles.modDashedBorder, styles.modLabeledIconHeight)}>
                        <LabeledIconButton
                            hideLabel={true}
                            imgSrc={alignLeftIcon}
                            title={"Left Align"}
                            onClick={props.onTextAlignLeft}
                        />
                        <LabeledIconButton
                            hideLabel={true}
                            imgSrc={alignCenterIcon}
                            title={"Center Align"}
                            onClick={props.onTextAlignCenter}
                        />
                        <LabeledIconButton
                            hideLabel={true}
                            imgSrc={alignRightIcon}
                            title={"Right Align"}
                            onClick={props.onTextAlignRight}
                        />
                    </InputGroup>
                </div>
            );
        case Modes.BIT_RECT:
            /* falls through */
        case Modes.BIT_OVAL:
        {
            const fillIcon = props.mode === Modes.BIT_RECT ? bitRectIcon : bitOvalIcon;
            const outlineIcon = props.mode === Modes.BIT_RECT ? bitRectOutlinedIcon : bitOvalOutlinedIcon;
            return (
                <div className={classNames(props.className, styles.modeTools)}>
                    <InputGroup>
                        <LabeledIconButton
                            highlighted={props.fillBitmapShapes}
                            imgSrc={fillIcon}
                            title={props.intl.formatMessage(messages.filled)}
                            onClick={props.onFillShapes}
                        />
                    </InputGroup>
                    <InputGroup>
                        <LabeledIconButton
                            highlighted={!props.fillBitmapShapes}
                            imgSrc={outlineIcon}
                            title={props.intl.formatMessage(messages.outlined)}
                            onClick={props.onOutlineShapes}
                        />
                    </InputGroup>
                    {props.fillBitmapShapes ? null : (
                        <InputGroup>
                            <Label text={props.intl.formatMessage(messages.thickness)}>
                                <LiveInput
                                    range
                                    small
                                    max={MAX_STROKE_WIDTH}
                                    min="1"
                                    type="number"
                                    value={props.bitBrushSize}
                                    onSubmit={props.onBitBrushSliderChange}
                                />
                            </Label>
                        </InputGroup>)
                    }
                </div>
            );
        }
        default:
            // Leave empty for now, if mode not supported
            return (
                <div className={classNames(props.className, styles.modeTools)} />
            );
    }
};

ModeToolsComponent.propTypes = {
    bitBrushSize: PropTypes.number,
    bitEraserSize: PropTypes.number,
    brushValue: PropTypes.number,
    className: PropTypes.string,
    clipboardItems: PropTypes.arrayOf(PropTypes.array),
    eraserValue: PropTypes.number,
    roundedCornerValue: PropTypes.number,
    trianglePolyValue: PropTypes.number,
    currentlySelectedShape: PropTypes.string,
    fillBitmapShapes: PropTypes.bool,
    format: PropTypes.oneOf(Object.keys(Formats)),
    hasSelectedUncurvedPoints: PropTypes.bool,
    hasSelectedUnpointedPoints: PropTypes.bool,
    intl: intlShape.isRequired,
    mode: PropTypes.string.isRequired,
    onBitBrushSliderChange: PropTypes.func.isRequired,
    onBitEraserSliderChange: PropTypes.func.isRequired,
    onBrushSliderChange: PropTypes.func.isRequired,
    onCopyToClipboard: PropTypes.func.isRequired,
    onCutToClipboard: PropTypes.func.isRequired,
    onCurvePoints: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEraserSliderChange: PropTypes.func,
    onFillShapes: PropTypes.func.isRequired,
    onFlipHorizontal: PropTypes.func.isRequired,
    onFlipVertical: PropTypes.func.isRequired,
    onCenterSelection: PropTypes.func.isRequired,
    onManageFonts: PropTypes.func,
    onOutlineShapes: PropTypes.func.isRequired,
    onPasteFromClipboard: PropTypes.func.isRequired,
    onPointPoints: PropTypes.func.isRequired,
    onUpdateImage: PropTypes.func.isRequired,

    onTextAlignLeft: PropTypes.func.isRequired,
    onTextAlignRight: PropTypes.func.isRequired,
    onTextAlignCenter: PropTypes.func.isRequired,

    onMergeShape: PropTypes.func.isRequired,
    onMaskShape: PropTypes.func.isRequired,
    onSubtractShape: PropTypes.func.isRequired,
    onExcludeShape: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    mode: state.scratchPaint.mode,
    format: state.scratchPaint.format,
    fillBitmapShapes: state.scratchPaint.fillBitmapShapes,
    bitBrushSize: state.scratchPaint.bitBrushSize,
    bitEraserSize: state.scratchPaint.bitEraserSize,
    brushValue: state.scratchPaint.brushMode.brushSize,
    clipboardItems: state.scratchPaint.clipboard.items,
    eraserValue: state.scratchPaint.eraserMode.brushSize,
    roundedCornerValue: state.scratchPaint.roundedRectMode.roundedCornerSize,
    trianglePolyValue: state.scratchPaint.triangleMode.trianglePolyCount,
    currentlySelectedShape: state.scratchPaint.sussyMode.currentlySelectedShape
});
const mapDispatchToProps = dispatch => ({
    onBrushSliderChange: brushSize => {
        dispatch(changeBrushSize(brushSize));
    },
    onRoundedCornerSliderChange: roundedCornerSize => {
        dispatch(changeRoundedCornerSize(roundedCornerSize));
    },
    onPolyCountSliderChange: polyCount => {
        dispatch(changeTrianglePolyCount(polyCount));
    },
    onCurrentlySelectedShapeChange: shape => {
        dispatch(changeCurrentlySelectedShape(shape));
    },
    onBitBrushSliderChange: bitBrushSize => {
        dispatch(changeBitBrushSize(bitBrushSize));
    },
    onBitEraserSliderChange: eraserSize => {
        dispatch(changeBitEraserSize(eraserSize));
    },
    onEraserSliderChange: eraserSize => {
        dispatch(changeEraserSize(eraserSize));
    },
    onFillShapes: () => {
        dispatch(setShapesFilled(true));
    },
    onOutlineShapes: () => {
        dispatch(setShapesFilled(false));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(ModeToolsComponent));
