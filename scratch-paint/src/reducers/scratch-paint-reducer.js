import {combineReducers} from 'redux';
import modeReducer from './modes';
import addonUtilReducer from './addon-util';
import bitBrushSizeReducer from './bit-brush-size';
import bitEraserSizeReducer from './bit-eraser-size';
import brushModeReducer from './brush-mode';
import eraserModeReducer from './eraser-mode';
import rectModeReducer from './rect-mode';
import roundedRectModeReducer from './rounded-rect-mode';
import triangleModeReducer from './triangle-mode';
import sussyModeReducer from './sussy-mode';
import colorReducer from './color';
import clipboardReducer from './clipboard';
import cursorReducer from './cursor';
import customFontsReducer from './custom-fonts';
import fillBitmapShapesReducer from './fill-bitmap-shapes';
import fillModeReducer from './fill-mode';
import fontReducer from './font';
import formatReducer from './format';
import hoverReducer from './hover';
import layoutReducer from './layout';
import modalsReducer from './modals';
import penModeReducer from './pen-mode';
import selectedItemReducer from './selected-items';
import textAlignmentReducer from './text-alignment';
import textEditTargetReducer from './text-edit-target';
import themeReducer from './theme';
import viewBoundsReducer from './view-bounds';
import undoReducer from './undo';
import zoomLevelsReducer from './zoom-levels';

export default combineReducers({
    mode: modeReducer,
    addonUtil: addonUtilReducer,
    bitBrushSize: bitBrushSizeReducer,
    bitEraserSize: bitEraserSizeReducer,
    brushMode: brushModeReducer,
    color: colorReducer,
    clipboard: clipboardReducer,
    cursor: cursorReducer,
    customFonts: customFontsReducer,
    eraserMode: eraserModeReducer,
    rectMode: rectModeReducer,
    roundedRectMode: roundedRectModeReducer,
    triangleMode: triangleModeReducer,
    sussyMode: sussyModeReducer,
    fillBitmapShapes: fillBitmapShapesReducer,
    fillMode: fillModeReducer,
    font: fontReducer,
    format: formatReducer,
    hoveredItemId: hoverReducer,
    layout: layoutReducer,
    modals: modalsReducer,
    penMode: penModeReducer,
    selectedItems: selectedItemReducer,
    textAlignment: textAlignmentReducer,
    textEditTarget: textEditTargetReducer,
    theme: themeReducer,
    undo: undoReducer,
    viewBounds: viewBoundsReducer,
    zoomLevels: zoomLevelsReducer
});
