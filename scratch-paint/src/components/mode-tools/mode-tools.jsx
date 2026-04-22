/* eslint-disable no-case-declarations */
import classNames from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import Dropdown from '../dropdown/dropdown.jsx';
import MediaQuery from 'react-responsive';
import layout from '../../lib/layout-constants';

import { changeBrushSize, changeSimplifySize, setBrushType } from '../../reducers/brush-mode';
import { changeBrushSize as changeEraserSize, changeSimplifySize as changeEraserSimplifySize } from '../../reducers/eraser-mode';
import { changeSimplifySize as changePenSimplifySize } from '../../reducers/pen-mode';
import { changeRoundedRectCornerSize } from '../../reducers/rounded-rect-mode';
import { changeRoundedCornerSize } from '../../reducers/rect-mode';
import { changeTrianglePolyCount, changeTrianglePointCount } from '../../reducers/triangle-mode';
import { changeCurrentlySelectedShape } from '../../reducers/sussy-mode';
import { changeBitBrushSize } from '../../reducers/bit-brush-size';
import { changeBitEraserSize } from '../../reducers/bit-eraser-size';
import { setShapesFilled } from '../../reducers/fill-bitmap-shapes';
import { setTextAlignment } from '../../reducers/text-alignment';

import FontDropdown from '../../containers/font-dropdown.jsx';
import LiveInputHOC from '../forms/live-input-hoc.jsx';
import Label from '../forms/label.jsx';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import Input from '../forms/input.jsx';
import InputGroup from '../input-group/input-group.jsx';
import ButtonGroup from '../button-group/button-group.jsx';
import Button from '../button/button.jsx';
import LabeledIconButton from '../labeled-icon-button/labeled-icon-button.jsx';
import Modes from '../../lib/modes';
import Formats, { isBitmap, isVector } from '../../lib/format';
import { hideLabel } from '../../lib/hide-label';
import styles from './mode-tools.css';
import { MAX_STROKE_WIDTH } from '../../reducers/stroke-width';
import {
    selectableShapes as sussyToolShapes,
    categories as sussyToolCategories,
    generateShapeSVG as generateSussyShapeSVG,
    categorizeShapes as categorizeSussyShapes,
} from '../../helper/selectable-shapes.js';

import copyIcon from './icons/copy.svg';
import cutIcon from './icons/cut.svg';
import pasteIcon from './icons/paste.svg';
import deleteIcon from './icons/delete.svg';
import roundLine from './icons/round-line.svg';
import squareLine from './icons/square-line.svg';
import miterLineJoin from './icons/miter-line-join.svg';
import roundLineJoin from './icons/round-line-join.svg';
import bevelLineJoin from './icons/bevel-line-join.svg';
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
import triangleSpikeRatioIcon from './icons/triangle-spike-ratio.svg';
import flipHorizontalIcon from './icons/flip-horizontal.svg';
import flipVerticalIcon from './icons/flip-vertical.svg';
import centerSelectionIcon from './icons/centerSelection.svg';
import straightPointIcon from './icons/straight-point.svg';
import bitOvalIcon from '../bit-oval-mode/oval.svg';
import bitRectIcon from '../bit-rect-mode/rectangle.svg';
import bitOvalOutlinedIcon from '../bit-oval-mode/oval-outlined.svg';
import bitRectOutlinedIcon from '../bit-rect-mode/rectangle-outlined.svg';

const LiveInput = LiveInputHOC(Input);
const ModeToolsComponent = props => {
    const messages = defineMessages({
        brushSize: {
            defaultMessage: 'Size',
            description: 'Label for the brush size input',
            id: 'paint.modeTools.brushSize'
        },
        brushSimplify: {
            defaultMessage: 'Smoothing',
            description: 'Label for the brush smoothing input, higher numbers control how much the drawn line will be corrected',
            id: 'paint.modeTools.brushSimplify'
        },
        eraserSize: {
            defaultMessage: 'Eraser size',
            description: 'Label for the eraser size input',
            id: 'paint.modeTools.eraserSize'
        },
        eraserSimplify: {
            defaultMessage: 'Smoothing',
            description: 'Label for the eraser smoothing input, higher numbers control how much the drawn line will be corrected',
            id: 'paint.modeTools.eraserSimplify'
        },
        brushCircle: {
            defaultMessage: 'Circle Brush',
            description: 'Label for the circle brush shape',
            id: 'paint.modeTools.circleSquare'
        },
        brushSquare: {
            defaultMessage: 'Square Brush',
            description: 'Label for the square brush shape',
            id: 'paint.modeTools.brushSquare'
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
        spokeRatio: {
            defaultMessage: 'Star spoke ratio',
            description: 'Label for the Star spoke ratio input, controls the size of the spokes on a star',
            id: 'paint.modeTools.spikeRatio'
        },
        penSimplify: {
            defaultMessage: 'Smoothing',
            description: 'Label for the pen smoothing input, higher numbers control how much the drawn line will be corrected',
            id: 'paint.modeTools.penSimplify'
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
<<<<<<< HEAD
=======
        },
        joinSpiked: {
            defaultMessage: 'Spiked',
            description: 'Label for the button that sets the line join to miter',
            id: 'pm.paint.modeTools.joinSpiked'
        },
        joinRounded: {
            defaultMessage: 'Rounded',
            description: 'Label for the button that sets the line join to round',
            id: 'pm.paint.modeTools.joinRounded'
        },
        joinBeveled: {
            defaultMessage: 'Beveled',
            description: 'Label for the button that sets the line join to bevel',
            id: 'pm.paint.modeTools.joinBeveled'
        },
        endRounded: {
            defaultMessage: 'Rounded',
            description: 'Label for the button that sets the line cap to round',
            id: 'pm.paint.modeTools.endRounded'
        },
        endSquared: {
            defaultMessage: 'Squared',
            description: 'Label for the button that sets the line cap to square',
            id: 'pm.paint.modeTools.endSquared'
        },
        merge: {
            defaultMessage: 'Merge',
            description: 'Label for the button that merges two selected objects together',
            id: 'pm.paint.modeTools.merge'
        },
        subtract: {
            defaultMessage: 'Subtract',
            description: 'Label for the button that subtracts selected objects from eachother',
            id: 'pm.paint.modeTools.subtract'
        },
        mask: {
            defaultMessage: 'Mask',
            description: 'Label for the button that ands two selected objects together',
            id: 'pm.paint.modeTools.mask'
        },
        filter: {
            defaultMessage: 'Filter',
            description: 'Label for the button that xors two selected objects together',
            id: 'pm.paint.modeTools.filter'
        },
        leftAlign: {
            defaultMessage: 'Left Align',
            description: 'Label for the button that sets text alignment to the left',
            id: 'pm.paint.modeTools.leftAlign'
        },
        rightAlign: {
            defaultMessage: 'Right Align',
            description: 'Label for the button that sets text alignment to the right',
            id: 'pm.paint.modeTools.rightAlign'
        },
        centerAlign: {
            defaultMessage: 'Center Align',
            description: 'Label for the button that sets text alignment to the center',
            id: 'pm.paint.modeTools.centerAlign'
>>>>>>> 6083d544dc5ae6ac0bb8f05e0e2b5a7e8c6bf55b
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
                const currentSimplifyValue = props.simplifyValue;
                const changeFunction = isBitmap(props.format) ? props.onBitBrushSliderChange : props.onBrushSliderChange;
                const changeFunctionSimplify = props.onSimplifySliderChange;
                const currentMessage = props.mode === Modes.BIT_LINE ? messages.thickness : messages.brushSize;
                const hasSimplifyOption = props.mode === Modes.BRUSH;
                return (
                    <div className={classNames(props.className, styles.modeTools)}>
                        <div>
                            <img
                                alt={props.intl.formatMessage(currentMessage)}
                                title={props.intl.formatMessage(currentMessage)}
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
                        
                        {hasSimplifyOption && (
                            <Label text={props.intl.formatMessage(messages.brushSimplify)} style={{ marginLeft: 'calc(2 * .25rem)' }}>
                                <LiveInput
                                    range
                                    small
                                    max={1000}
                                    min="0"
                                    type="number"
                                    value={currentSimplifyValue}
                                    onSubmit={changeFunctionSimplify}
                                />
                            </Label>
                        )}

                        {/* TODO replace this with a dropdown when we add more brush shapes */}
                        {hasSimplifyOption && (
                            <InputGroup>
                                <ButtonGroup>
                                    <Button
                                        className={
                                            classNames(styles.buttonGroupButton)
                                        }
                                        onClick={() => props.onBrushChange("CIRCLE")}
                                    >
                                        <img
                                            alt={props.intl.formatMessage(messages.brushCircle)}
                                            className={styles.buttonGroupButtonIcon}
                                            draggable={false}
                                            src={"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCBmaWxsPSIjMDBjM2ZmIiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIHJ4PSIxMDAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIuNSAyLjUpIi8+PC9zdmc+"}
                                        />
                                    </Button>
                                    <Button
                                        className={
                                            classNames(styles.buttonGroupButton)
                                        }
                                        onClick={() => props.onBrushChange("SQUARE")}
                                    >
                                        <img
                                            alt={props.intl.formatMessage(messages.brushSquare)}
                                            className={styles.buttonGroupButtonIcon}
                                            draggable={false}
                                            src={"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCBmaWxsPSIjMDBjM2ZmIiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIHJ4PSIyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyLjUgMi41KSIvPjwvc3ZnPg=="}
                                        />
                                    </Button>
                                </ButtonGroup>
                            </InputGroup>
                        )}
                    </div>
                );
            }
        case Modes.BIT_ERASER:
        /* falls through */
        case Modes.ERASER:
            {
                const currentIcon = isVector(props.format) ? eraserIcon : bitEraserIcon;
                const currentEraserValue = isBitmap(props.format) ? props.bitEraserSize : props.eraserValue;
                const currentEraserSimplifyValue = props.eraserSimplifyValue;
                const changeFunction = isBitmap(props.format) ? props.onBitEraserSliderChange : props.onEraserSliderChange;
                const changeFunctionSimplify = props.onEraserSimplifySliderChange;
                const hasSimplifyOption = props.mode === Modes.ERASER;
                return (
                    <div className={classNames(props.className, styles.modeTools)}>
                        <div>
                            <img
                                alt={props.intl.formatMessage(messages.eraserSize)}
                                title={props.intl.formatMessage(messages.eraserSize)}
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

                        {hasSimplifyOption && (
                            <Label text={props.intl.formatMessage(messages.eraserSimplify)} style={{ marginLeft: 'calc(2 * .25rem)' }}>
                                <LiveInput
                                    range
                                    small
                                    max={1000}
                                    min="0"
                                    type="number"
                                    value={currentEraserSimplifyValue}
                                    onSubmit={changeFunctionSimplify}
                                />
                            </Label>
                        )}

                        {/* TODO replace this with a dropdown when we add more brush shapes */}
                        {hasSimplifyOption && (
                            <InputGroup>
                                <ButtonGroup>
                                    <Button
                                        className={
                                            classNames(styles.buttonGroupButton)
                                        }
                                        onClick={() => props.onBrushChange("CIRCLE")}
                                    >
                                        <img
                                            alt={props.intl.formatMessage(messages.brushCircle)}
                                            className={styles.buttonGroupButtonIcon}
                                            draggable={false}
                                            src={"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCBmaWxsPSIjMDBjM2ZmIiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIHJ4PSIxMDAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIuNSAyLjUpIi8+PC9zdmc+"}
                                        />
                                    </Button>
                                    <Button
                                        className={
                                            classNames(styles.buttonGroupButton)
                                        }
                                        onClick={() => props.onBrushChange("SQUARE")}
                                    >
                                        <img
                                            alt={props.intl.formatMessage(messages.brushSquare)}
                                            className={styles.buttonGroupButtonIcon}
                                            draggable={false}
                                            src={"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCBmaWxsPSIjMDBjM2ZmIiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIHJ4PSIyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyLjUgMi41KSIvPjwvc3ZnPg=="}
                                        />
                                    </Button>
                                </ButtonGroup>
                            </InputGroup>
                        )}
                    </div>
                )
            }
        case Modes.ROUNDED_RECT:
        /* falls through */
        case Modes.RECT:
            {
                // NOTE: BIT_RECT doesnt use Path, so this can't be added there the same way as RECT has it.
                const currentCornerValue = props.mode === Modes.ROUNDED_RECT ? props.roundedRectCornerValue : props.roundedCornerValue;
                const changeFunction = props.mode === Modes.ROUNDED_RECT ? props.onRoundedRectCornerSliderChange : props.onRoundedCornerSliderChange;
                return (
                    <div className={classNames(props.className, styles.modeTools)}>
                        <div>
                            <img
                                alt={props.intl.formatMessage(messages.roundedCornerSize)}
                                title={props.intl.formatMessage(messages.roundedCornerSize)}
                                className={styles.modeToolsIcon}
                                draggable={false}
                                src={roundedRectIcon}
                            />
                        </div>
                        <LiveInput
                            range
                            small
                            min={0}
                            max={1000}
                            type="number"
                            value={currentCornerValue}
                            onSubmit={changeFunction}
                        />
                    </div>
                );
            }
        case Modes.TRIANGLE:
            {
                const currentSideValue = props.trianglePolyValue;
                const currentPointValue = props.trianglePointValue;
                const changeFunction = props.onPolyCountSliderChange;
                const changeFunctionPoint = props.onPointCountSliderChange;
                return (
                    <div className={classNames(props.className, styles.modeTools)}>
                        <div>
                            <img
                                alt={props.intl.formatMessage(messages.currentSideCount)}
                                title={props.intl.formatMessage(messages.currentSideCount)}
                                className={styles.modeToolsIcon}
                                draggable={false}
                                src={triangleIcon}
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
                        <div>
                            <img
                                alt={props.intl.formatMessage(messages.spokeRatio)}
                                title={props.intl.formatMessage(messages.spokeRatio)}
                                className={styles.modeToolsIcon}
                                draggable={false}
                                src={triangleSpikeRatioIcon}
                            />
                        </div>
                        <LiveInput
                            range
                            small
                            max={1000}
                            min="0" // Spike ratio is limited to 0.01, but setting that here makes the number input arrows work really ugly
                            step="0.1"
                            type="number"
                            value={currentPointValue}
                            onSubmit={changeFunctionPoint}
                        />
                    </div>
                );
            }
        case Modes.SUSSY:
            {
                const currentlySelectedShape = props.currentlySelectedShape;
                const changeFunction = props.onCurrentlySelectedShapeChange;
                const selectedShapeObject = sussyToolShapes
                    .filter(shape => shape.id === currentlySelectedShape)[0];
                const categorizedShapes = categorizeSussyShapes(sussyToolShapes);
                const selectableShapesList = (
                    <InputGroup
                        className={classNames(
                            styles.modDashedBorder,
                            styles.dropItemShapeToolMenu,
                            styles.dropdownMaxItemList
                        )}
                    >
                        {Object.keys(categorizedShapes).map(categoryId => categorizedShapes[categoryId].length === 0 ?
                            (<React.Fragment key={categoryId} />) : (<React.Fragment key={categoryId}>
                                <p className={classNames(styles.dropItemShapeToolLabel)}>
                                    {sussyToolCategories[categoryId]}
                                </p>
                                {categorizedShapes[categoryId].map(shape => (
                                    <LabeledIconButton
                                        key={shape.id}
                                        className={classNames(styles.dropItemShapeTool)}
                                        hideLabel={hideLabel(props.intl.locale)}
                                        imgSrc={`data:image/svg+xml,${encodeURIComponent(generateSussyShapeSVG(shape))}`}
                                        title={shape.name}
                                        onClick={() => changeFunction(shape.id)}
                                    />
                                ))}
                        </React.Fragment>))}
                    </InputGroup>
                );
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
                                src={`data:image/svg+xml,${encodeURIComponent(generateSussyShapeSVG(selectedShapeObject))}`}
                                alt={selectedShapeObject.name}
                                title={selectedShapeObject.name}
                                height={16}
                            />
                        </Dropdown>
                    </div>
                );
            }
        case Modes.PEN:
            {
                const currentPenSimplifyValue = props.penSimplifyValue;
                const changeFunctionSimplify = props.onPenSimplifySliderChange;
                return (
                    <div className={classNames(props.className, styles.modeTools)}>
                        <Label text={props.intl.formatMessage(messages.eraserSimplify)} style={{ marginLeft: 'calc(2 * .25rem)' }}>
                            <LiveInput
                                range
                                small
                                max={1000}
                                min="0"
                                type="number"
                                value={currentPenSimplifyValue}
                                onSubmit={changeFunctionSimplify}
                            />
                        </Label>
                    </div>
                );
            }
        case Modes.RESHAPE:
            const lineJoinReshape = (
                <InputGroup className={classNames(styles.modDashedBorder, styles.modLabeledIconHeight)}>
                    <LabeledIconButton
                        disabled={props.hasSelectedMiterLineJoin}
                        hideLabel={hideLabel(props.intl.locale)}
                        imgSrc={miterLineJoin}
<<<<<<< HEAD
                        title={'Spiked'}
=======
                        title={props.intl.formatMessage(messages.joinSpiked)}
>>>>>>> 6083d544dc5ae6ac0bb8f05e0e2b5a7e8c6bf55b
                        onClick={props.onMiterLineJoin}
                    />
                    <LabeledIconButton
                        disabled={props.hasSelectedRoundLineJoin}
                        hideLabel={hideLabel(props.intl.locale)}
                        imgSrc={roundLineJoin}
<<<<<<< HEAD
                        title={'Rounded'}
=======
                        title={props.intl.formatMessage(messages.joinRounded)}
>>>>>>> 6083d544dc5ae6ac0bb8f05e0e2b5a7e8c6bf55b
                        onClick={props.onRoundLineJoin}
                    />
                    <LabeledIconButton
                        disabled={props.hasSelectedBevelLineJoin}
                        hideLabel={hideLabel(props.intl.locale)}
                        imgSrc={bevelLineJoin}
<<<<<<< HEAD
                        title={'Beveled'}
=======
                        title={props.intl.formatMessage(messages.joinBeveled)}
>>>>>>> 6083d544dc5ae6ac0bb8f05e0e2b5a7e8c6bf55b
                        onClick={props.onBevelLineJoin}
                    />
                </InputGroup>
            );
            const deleteSelectedNodes = (
                <InputGroup className={classNames(styles.modLabeledIconHeight)}>
                    <LabeledIconButton
                        hideLabel={hideLabel(props.intl.locale)}
                        imgSrc={deleteIcon}
                        title={props.intl.formatMessage(messages.delete)}
                        onClick={props.onDelete}
                    />
                </InputGroup>
            );
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
                    <InputGroup className={classNames(styles.modDashedBorder, styles.modLabeledIconHeight)}>
                        <LabeledIconButton
                            disabled={props.hasSelectedRoundEnds}
                            hideLabel={hideLabel(props.intl.locale)}
                            imgSrc={roundLine}
<<<<<<< HEAD
                            title={'Rounded'}
=======
                            title={props.intl.formatMessage(messages.endRounded)}
>>>>>>> 6083d544dc5ae6ac0bb8f05e0e2b5a7e8c6bf55b
                            onClick={props.onRoundEnds}
                        />
                        <LabeledIconButton
                            disabled={props.hasSelectedSquareEnds}
                            hideLabel={hideLabel(props.intl.locale)}
                            imgSrc={squareLine}
<<<<<<< HEAD
                            title={'Squared'}
=======
                            title={props.intl.formatMessage(messages.endSquared)}
>>>>>>> 6083d544dc5ae6ac0bb8f05e0e2b5a7e8c6bf55b
                            onClick={props.onSquareEnds}
                        />
                    </InputGroup>
                    <MediaQuery minWidth={layout.fullSizeEditorMinWidthExtraToolsCollapsed}>
                        {lineJoinReshape}
                        {deleteSelectedNodes}
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
                                        {lineJoinReshape}
                                        {deleteSelectedNodes}
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
        case Modes.BIT_SELECT:
        /* falls through */
        case Modes.SELECT:
            const reshapingMethods = props.format.startsWith("BITMAP") ? null : (
                <InputGroup className={classNames(styles.modDashedBorder, styles.modLabeledIconHeight)}>
                    <LabeledIconButton
                        hideLabel={hideLabel(props.intl.locale)}
                        imgSrc={shapeMergeIcon}
<<<<<<< HEAD
                        title={'Merge'}
=======
                        title={props.intl.formatMessage(messages.merge)}
>>>>>>> 6083d544dc5ae6ac0bb8f05e0e2b5a7e8c6bf55b
                        onClick={props.onMergeShape}
                    />
                    <LabeledIconButton
                        hideLabel={hideLabel(props.intl.locale)}
                        imgSrc={shapeMaskIcon}
<<<<<<< HEAD
                        title={'Mask'}
=======
                        title={props.intl.formatMessage(messages.mask)}
>>>>>>> 6083d544dc5ae6ac0bb8f05e0e2b5a7e8c6bf55b
                        onClick={props.onMaskShape}
                    />
                    <LabeledIconButton
                        hideLabel={hideLabel(props.intl.locale)}
                        imgSrc={shapeSubtractIcon}
<<<<<<< HEAD
                        title={'Subtract'}
=======
                        title={props.intl.formatMessage(messages.subtract)}
>>>>>>> 6083d544dc5ae6ac0bb8f05e0e2b5a7e8c6bf55b
                        onClick={props.onSubtractShape}
                    />
                    <LabeledIconButton
                        hideLabel={hideLabel(props.intl.locale)}
                        imgSrc={shapeFilterIcon}
<<<<<<< HEAD
                        title={'Filter'}
=======
                        title={props.intl.formatMessage(messages.filter)}
>>>>>>> 6083d544dc5ae6ac0bb8f05e0e2b5a7e8c6bf55b
                        onClick={props.onExcludeShape}
                    />
                </InputGroup>
            );
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
            );
            const movementOptions = (
                <InputGroup className={classNames(styles.modDashedBorder, styles.modLabeledIconHeight)}>
                    <LabeledIconButton
                        hideLabel={props.intl.locale !== 'en'}
                        imgSrc={centerSelectionIcon}
                        title={props.intl.formatMessage(messages.movementCenter)}
                        onClick={props.onCenterSelection}
                    />
                </InputGroup>
            );
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
                            hideLabel
                            imgSrc={alignLeftIcon}
<<<<<<< HEAD
                            title={'Left Align'}
=======
                            title={props.intl.formatMessage(messages.leftAlign)}
>>>>>>> 6083d544dc5ae6ac0bb8f05e0e2b5a7e8c6bf55b
                            onClick={props.onTextAlignLeft}
                        />
                        <LabeledIconButton
                            hideLabel
                            imgSrc={alignCenterIcon}
<<<<<<< HEAD
                            title={'Center Align'}
=======
                            title={props.intl.formatMessage(messages.centerAlign)}
>>>>>>> 6083d544dc5ae6ac0bb8f05e0e2b5a7e8c6bf55b
                            onClick={props.onTextAlignCenter}
                        />
                        <LabeledIconButton
                            hideLabel
                            imgSrc={alignRightIcon}
<<<<<<< HEAD
                            title={'Right Align'}
=======
                            title={props.intl.formatMessage(messages.rightAlign)}
>>>>>>> 6083d544dc5ae6ac0bb8f05e0e2b5a7e8c6bf55b
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
        case Modes.ARROW:
            {
                return (
                    <div className={classNames(props.className, styles.modeTools)}>
                        <span>{`Hold Alt + Shift to resize arrow tip`}</span>
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
    simplifyValue: PropTypes.number,
    className: PropTypes.string,
    clipboardItems: PropTypes.arrayOf(PropTypes.array),
    eraserValue: PropTypes.number,
    eraserSimplifyValue: PropTypes.number,
    brushType: PropTypes.string,
    penSimplifyValue: PropTypes.number,
    roundedCornerValue: PropTypes.number,
    roundedRectCornerValue: PropTypes.number,
    trianglePolyValue: PropTypes.number,
    trianglePointValue: PropTypes.number,
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
    onSimplifySliderChange: PropTypes.func.isRequired,
    onCopyToClipboard: PropTypes.func.isRequired,
    onCutToClipboard: PropTypes.func.isRequired,
    onCurvePoints: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEraserSliderChange: PropTypes.func,
    onBrushChange: PropTypes.func,
    onEraserSimplifySliderChange: PropTypes.func,
    onPenSimplifySliderChange: PropTypes.func,
    onFillShapes: PropTypes.func.isRequired,
    onFlipHorizontal: PropTypes.func.isRequired,
    onFlipVertical: PropTypes.func.isRequired,
    onCenterSelection: PropTypes.func.isRequired,
    onManageFonts: PropTypes.func,
    onOutlineShapes: PropTypes.func.isRequired,
    onPasteFromClipboard: PropTypes.func.isRequired,
    onPointPoints: PropTypes.func.isRequired,
    onUpdateImage: PropTypes.func.isRequired,

    onMergeShape: PropTypes.func.isRequired,
    onMaskShape: PropTypes.func.isRequired,
    onSubtractShape: PropTypes.func.isRequired,
    onExcludeShape: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    mode: state.scratchPaint.mode,
    format: state.scratchPaint.format,
    fillBitmapShapes: state.scratchPaint.fillBitmapShapes,
    bitBrushSize: state.scratchPaint.bitBrushSize,
    bitEraserSize: state.scratchPaint.bitEraserSize,
    brushValue: state.scratchPaint.brushMode.brushSize,
    simplifyValue: state.scratchPaint.brushMode.simplifySize,
    clipboardItems: state.scratchPaint.clipboard.items,
    eraserValue: state.scratchPaint.eraserMode.brushSize,
    eraserSimplifyValue: state.scratchPaint.eraserMode.simplifySize,
    brushType: state.scratchPaint.brushType,
    penSimplifyValue: state.scratchPaint.penMode.simplifySize,
    roundedRectCornerValue: state.scratchPaint.roundedRectMode.roundedCornerSize,
    roundedCornerValue: state.scratchPaint.rectMode.roundedCornerSize,
    trianglePolyValue: state.scratchPaint.triangleMode.trianglePolyCount,
    trianglePointValue: state.scratchPaint.triangleMode.trianglePointCount,
    currentlySelectedShape: state.scratchPaint.sussyMode.shape
});
const mapDispatchToProps = dispatch => ({
    onBrushSliderChange: brushSize => {
        dispatch(changeBrushSize(brushSize));
    },
    onSimplifySliderChange: brushSize => {
        dispatch(changeSimplifySize(brushSize));
    },
    onRoundedRectCornerSliderChange: roundedCornerSize => {
        dispatch(changeRoundedRectCornerSize(roundedCornerSize));
    },
    onRoundedCornerSliderChange: roundedCornerSize => {
        dispatch(changeRoundedCornerSize(roundedCornerSize));
    },
    onPolyCountSliderChange: polyCount => {
        dispatch(changeTrianglePolyCount(polyCount));
    },
    onPointCountSliderChange: polyCount => {
        dispatch(changeTrianglePointCount(polyCount));
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
    onEraserSimplifySliderChange: eraserSize => {
        dispatch(changeEraserSimplifySize(eraserSize));
    },
    onBrushChange: type => {
        dispatch(setBrushType(type));
    },
    onPenSimplifySliderChange: eraserSize => {
        dispatch(changePenSimplifySize(eraserSize));
    },
    onFillShapes: () => {
        dispatch(setShapesFilled(true));
    },
    onOutlineShapes: () => {
        dispatch(setShapesFilled(false));
    },
    onTextAlignLeft: () => {
        dispatch(setTextAlignment("left"));
    },
    onTextAlignRight: () => {
        dispatch(setTextAlignment("right"));
    },
    onTextAlignCenter: () => {
        dispatch(setTextAlignment("center"));
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(ModeToolsComponent));
