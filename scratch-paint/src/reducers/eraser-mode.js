import log from '../log/log';

const CHANGE_ERASER_SIZE = 'scratch-paint/eraser-mode/CHANGE_ERASER_SIZE';
const CHANGE_ERASER_SIMPLIFY_SIZE = 'scratch-paint/eraser-mode/CHANGE_ERASER_SIMPLIFY_SIZE';
const initialState = { brushSize: 40, simplifySize: 10 };

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    let {simplifySize, brushSize} = state;
    switch (action.type) {
        case CHANGE_ERASER_SIZE:
            if (isNaN(action.brushSize)) {
                log.warn(`Invalid brush size: ${action.brushSize}`);
                return state;
            }
            return { brushSize: Math.max(1, action.brushSize), simplifySize };
        case CHANGE_ERASER_SIMPLIFY_SIZE:
            if (isNaN(action.simplifySize)) {
                log.warn(`Invalid simplify setting: ${action.simplifySize}`);
                return state;
            }
            return { brushSize, simplifySize: Math.max(0, action.simplifySize) };
    default:
        return state;
    }
};

// Action creators ==================================
const changeBrushSize = function (brushSize) {
    return {
        type: CHANGE_ERASER_SIZE,
        brushSize: brushSize
    };
};

const changeSimplifySize = function (simplifySize) {
    return {
        type: CHANGE_ERASER_SIMPLIFY_SIZE,
        simplifySize: simplifySize
    };
};

export {
    reducer as default,
    changeBrushSize,
    changeSimplifySize
};
