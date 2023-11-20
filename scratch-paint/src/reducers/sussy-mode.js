import log from '../log/log';
import SussyTool from '../helper/tools/sussy-tool';

const CHANGE_SUSSY_CURRENTLY_SELECTED_SHAPE = 'scratch-paint/sussy-mode/CHANGE_SUSSY_CURRENTLY_SELECTED_SHAPE';
const initialState = { currentlySelectedShape: "smile" };

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
        case CHANGE_SUSSY_CURRENTLY_SELECTED_SHAPE:
            if (typeof action.currentlySelectedShape !== "string") {
                log.warn(`Invalid shape: ${action.currentlySelectedShape}`);
                return state;
            }
            const value = String(action.currentlySelectedShape);
            SussyTool.currentlySelectedShape = value;
            return { currentlySelectedShape: value };
        default:
            return state;
    }
};

// Action creators ===================================
const changeCurrentlySelectedShape = function (shape) {
    return {
        type: CHANGE_SUSSY_CURRENTLY_SELECTED_SHAPE,
        currentlySelectedShape: shape
    };
};

export {
    reducer as default,
    changeCurrentlySelectedShape
};
