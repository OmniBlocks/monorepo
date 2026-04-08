import log from '../log/log';

const CHANGE_SUSSY_CURRENTLY_SELECTED_SHAPE = 'scratch-paint/sussy-mode/CHANGE_SUSSY_CURRENTLY_SELECTED_SHAPE';
const initialState = { shape: "smile" };

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
        case CHANGE_SUSSY_CURRENTLY_SELECTED_SHAPE:
            if (typeof action.shape !== "string") {
                log.warn(`Invalid shape: ${action.shape}`);
                return state;
            }
            return { shape: String(action.shape) };
        default:
            return state;
    }
};

// Action creators ===================================
const changeCurrentlySelectedShape = function (shape) {
    return {
        type: CHANGE_SUSSY_CURRENTLY_SELECTED_SHAPE,
        shape: shape
    };
};

export {
    reducer as default,
    changeCurrentlySelectedShape
};
