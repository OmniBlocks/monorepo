import log from '../log/log';

const CHANGE_BRUSH_SIZE = 'scratch-paint/brush-mode/CHANGE_BRUSH_SIZE';
const CHANGE_SEG_SIZE = CHANGE_BRUSH_SIZE + 1;
const initialState = { brushSize: 10, segSize: 1 };

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    let {segSize, brushSize} = state;
    switch (action.type) {
        case CHANGE_BRUSH_SIZE:
            if (isNaN(action.brushSize)) {
                log.warn(`Invalid brush size: ${action.brushSize}`);
                return state;
            }
            return { segSize, brushSize: Math.max(1, action.brushSize) };
        case CHANGE_SEG_SIZE:
            if (isNaN(action.segSize)) {
                log.warn(`Invalid brush size: ${action.segSize}`);
                return state;
            }
            return { brushSize, segSize: Math.max(1, action.segSize) };
        default:
            return state;
    }
};

// Action creators ==================================
const changeBrushSize = function (brushSize) {
    return {
        type: CHANGE_BRUSH_SIZE,
        brushSize: brushSize
    };
};

const changeSegSize = function (segSize) {
    return {
        type: CHANGE_SEG_SIZE,
        segSize: segSize
    };
};

export {
    reducer as default,
    changeBrushSize,
    changeSegSize
};
